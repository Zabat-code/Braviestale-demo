"""Unpack an approved web release for branch-based GitHub Pages (<100 MB/file).
Only its transport changes: streamed chunks reproduce game.zip byte for byte.
"""
from pathlib import Path
import hashlib,json,zipfile,sys
root=Path(__file__).resolve().parents[1];meta=json.loads((root/'docs/version.json').read_text());archive=Path(sys.argv[1]);dest=root/'docs/jugar'
assert archive.name==meta['web_archive']
if dest.is_symlink():dest.unlink()
dest.mkdir(exist_ok=True)
with zipfile.ZipFile(archive) as z:
 for i in z.infolist():
  p=Path(i.filename);assert not p.is_absolute() and '..' not in p.parts,p
 z.extractall(dest)
source=dest/'game.zip';parts=[];h=hashlib.sha256()
with source.open('rb') as f:
 index=0
 while data:=f.read(8*1024*1024):
  name=f'game.zip.8m.part{index:03d}';(dest/name).write_bytes(data);h.update(data);parts.append({'url':name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()});index+=1
original=hashlib.file_digest(source.open('rb'),'sha256').hexdigest();assert h.hexdigest()==original
js=dest/'renpy-pre.js';text=js.read_text();start=text.index('            let response = await fetch(window.gameZipURL);');end=text.index('            FS.close(f);',start)+len('            FS.close(f);')
text=text[:start]+'''            // GitHub Pages transport: stream unchanged archive in <100 MB parts.
            const parts = window.gameZipChunks || [{url: window.gameZipURL, bytes: 0}];
            gameZipSize = parts.reduce((total, p) => total + p.bytes, 0);
            const f = FS.open('/game.zip', 'w');
            try {
                for (const part of parts) {
                    const response = await fetch(part.url);
                    if (!response.ok) throw new Error(part.url + ': ' + response.status);
                    if (parts.length === 1 && !gameZipSize) gameZipSize = parseInt(response.headers.get('Content-Length'), 10) || 0;
                    const reader = response.body.getReader();
                    let partBytes = 0;
                    while (true) {
                        const {done, value} = await reader.read();
                        if (done) break;
                        FS.write(f, value, 0, value.length);
                        partBytes += value.length;
                        gameZipDownloaded += value.length;
                        updateDownloadProgress();
                    }
                    if (part.bytes && partBytes !== part.bytes) throw new Error('Incomplete download: ' + part.url);
                }
            } finally { FS.close(f); }'''+text[end:];js.write_text(text)
p=dest/'index.html';text=p.read_text().replace('<head>','<head>\n<script>window.gameZipChunks='+json.dumps([{'url':x['url'],'bytes':x['bytes']} for x in parts])+';</script>',1);p.write_text(text)
p=dest/'pwa_catalog.json';data=json.loads(p.read_text());assert 'game.zip' in data['files'];data['files']=[f for f in data['files'] if f!='game.zip']+[x['url'] for x in parts];p.write_text(json.dumps(data))
p=dest/'service-worker.js';p.write_text(p.read_text().replace("var cacheName = 'braviestale';", "var cacheName = 'braviestale-" + meta["release"].removeprefix("v").replace(".", "") + "';"))
# Store checksum evidence, remove only reproducible original transport copy.
(dest/'hosting-chunks.json').write_text(json.dumps({'version':meta['version'],'game_zip_sha256':original,'bytes':source.stat().st_size,'parts':parts},indent=2));source.unlink()
for p in [dest/'game.zip.sha256',dest/'index.html.symbols']:
 if p.exists():p.unlink()
assert max(p.stat().st_size for p in dest.rglob('*') if p.is_file())<100000000
print('PASS: exact archive split into',len(parts),'parts; all files <100 MB')

# Network resilience is a hosting concern, applied to each new export.
import re
shutil_source=root/'tools/archive-transport.js'
(dest/'archive-transport.js').write_bytes(shutil_source.read_bytes())
p=dest/'index.html';page=p.read_text();page=page.replace('<head>', '<head>\n<script src="archive-transport.js"></script>',1)
page=re.sub(r'<script>window.gameZipChunks=.*?</script>', '<script>window.gameArchiveIdentity='+json.dumps(original)+';window.gameZipChunks='+json.dumps(parts)+';</script>', page)
page=page.replace('src="renpy-pre.js"', 'src="renpy-pre.js?transport=2"');p.write_text(page)
p=dest/'renpy-pre.js';code=p.read_text();a=code.index('            // GitHub Pages transport:');b=code.index('            } finally { FS.close(f); }',a)+len('            } finally { FS.close(f); }')
code=code[:a]+"""            const parts = window.gameZipChunks || [{url: window.gameZipURL, bytes: 0}];
            gameZipSize = parts.reduce((total, p) => total + p.bytes, 0);
            await window.downloadGameArchive(FS, parts, window.gameArchiveIdentity,
                bytes => { gameZipDownloaded = bytes; updateDownloadProgress(); },
                message => { console.log(message); statusTextDiv.textContent = message; });"""+code[b:]
code=code.replace('reportError("Could not download game.zip", e);', 'reportError("No se pudo completar la descarga. Pulsa Reintentar para continuar", e);\n            const button = document.createElement("button");\n            button.textContent = "Reintentar descarga";\n            button.style.cssText = "position:fixed;left:50%;bottom:15%;transform:translateX(-50%);z-index:9999;padding:16px 28px;font-size:20px;cursor:pointer";\n            button.onclick = () => window.location.reload();\n            document.body.appendChild(button);\n            throw e;')
code=code.replace("Module.removeRunDependency('loadGameZip');\n        });", "Module.removeRunDependency('loadGameZip');\n        }).catch(e => console.error('Game archive not ready', e));");p.write_text(code)
p=dest/'pwa_catalog.json';catalog=json.loads(p.read_text());catalog['files'].append('archive-transport.js');p.write_text(json.dumps(catalog))
