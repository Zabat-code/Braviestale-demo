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
 while data:=f.read(64*1024*1024):
  name=f'game.zip.part{index:03d}';(dest/name).write_bytes(data);h.update(data);parts.append({'url':name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()});index+=1
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
p=dest/'service-worker.js';p.write_text(p.read_text().replace("var cacheName = 'braviestale';","var cacheName = 'braviestale-016';"))
# Store checksum evidence, remove only reproducible original transport copy.
(dest/'hosting-chunks.json').write_text(json.dumps({'version':meta['version'],'game_zip_sha256':original,'bytes':source.stat().st_size,'parts':parts},indent=2));source.unlink()
for p in [dest/'game.zip.sha256',dest/'index.html.symbols']:
 if p.exists():p.unlink()
assert max(p.stat().st_size for p in dest.rglob('*') if p.is_file())<100000000
print('PASS: exact archive split into',len(parts),'parts; all files <100 MB')
