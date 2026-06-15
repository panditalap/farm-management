// service-worker.js
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Check if this is the share target action
  if (event.request.method === 'POST' && url.pathname === '/farm-management/index.html') {
    event.respondWith(Response.redirect('/farm-management/index.html'));

    event.waitUntil(async function () {
      const data = await event.request.formData();
      const client = await self.clients.get(event.resultingClientId || event.clientId);
      
      // Get the file from the form data (matching "media" in manifest)
      const file = data.get('media');
      
      // Send the file to your index.html
      client.postMessage({ file, action: 'load-image' });
    }());
  }
});
