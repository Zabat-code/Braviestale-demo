/* Retry transport only; game archive and save databases are unchanged. */
window.downloadGameArchive = async function (FS, parts, identity, progress, status) {
    let cache = null;
    try { cache = await caches.open('braviestale-download-' + identity); } catch (_) {}
    const f = FS.open('/game.zip', 'w+');
    let completed = 0;
    try {
        for (let index = 0; index < parts.length; index++) {
            const part = parts[index];
            const url = new URL(part.url, document.baseURI);
            url.searchParams.set('archive', identity);
            let lastError;
            for (let attempt = 0; attempt < 4; attempt++) {
                const controller = new AbortController();
                let timer, reader, cacheWrite;
                const arm = () => { clearTimeout(timer); timer = setTimeout(() => controller.abort(), 30000); };
                try {
                    status('Descargando parte ' + (index + 1) + '/' + parts.length + (attempt ? ' · Reintentando conexión…' : '…'));
                    arm();
                    let response = cache && await cache.match(url.href);
                    if (!response) {
                        response = await fetch(url.href, {signal: controller.signal, cache: 'no-cache'});
                        if (!response.ok) throw new Error('HTTP ' + response.status + ' · ' + part.url);
                        if (cache) cacheWrite = cache.put(url.href, response.clone()).catch(() => {});
                    }
                    reader = response.body.getReader();
                    let received = 0;
                    while (true) {
                        arm();
                        const value = await reader.read();
                        if (value.done) break;
                        if (part.bytes && received + value.value.length > part.bytes) throw new Error('Tamaño incorrecto · ' + part.url);
                        FS.write(f, value.value, 0, value.value.length, completed + received);
                        received += value.value.length;
                        progress(completed + received);
                    }
                    clearTimeout(timer);
                    if (part.bytes && received !== part.bytes) throw new Error('Descarga incompleta · ' + part.url);
                    if (part.sha256 && window.crypto && window.crypto.subtle) {
                        const bytes = new Uint8Array(received);
                        FS.read(f, bytes, 0, received, completed);
                        const digest = await crypto.subtle.digest('SHA-256', bytes);
                        const hex = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
                        if (hex !== part.sha256) throw new Error('Datos incorrectos · ' + part.url);
                    }
                    if (cacheWrite) await cacheWrite;
                    completed += received;
                    progress(completed);
                    lastError = null;
                    break;
                } catch (error) {
                    lastError = error;
                    controller.abort();
                    if (reader) await reader.cancel().catch(() => {});
                    if (cacheWrite) await cacheWrite;
                    if (cache) await cache.delete(url.href).catch(() => {});
                    progress(completed);
                    if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
                } finally { clearTimeout(timer); }
            }
            if (lastError) throw lastError;
        }
    } finally { FS.close(f); }
    return completed;
};
