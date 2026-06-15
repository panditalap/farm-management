/**
 * components.js
 * Loads shared HTML components (navbar, footer) into every page.
 */

async function loadComponent(selector, path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Could not load "${path}" (${response.status})`);
    const html = await response.text();
    document.querySelector(selector).innerHTML = html;
  } catch (err) {
    console.warn('[components.js]', err.message);
  }
}

function highlightActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

function injectManifest() {
  const link = document.createElement('link');
  link.rel = 'manifest';
  link.href = 'manifest.json';
  document.head.appendChild(link);
}

/**
 * Processes shared data and displays it on the index page
 */
function handleSharedData() {
  const params = new URLSearchParams(window.location.search);
  
  if (params.has('title') || params.has('url')) {
    const title = params.get('title') || 'Shared Item';
    const url = params.get('url') || '';
    
    // Show the container
    const container = document.getElementById('share-preview-container');
    if (container) {
      container.classList.remove('d-none');
      document.getElementById('shared-content-info').innerHTML = `<p><strong>${title}</strong><br><a href="${url}" target="_blank">${url}</a></p>`;
      
      // If the URL ends in an image extension, show the image
      const imagePreview = document.getElementById('shared-image-preview');
      if (url.match(/\.(jpeg|jpg|gif|png)$/)) {
        imagePreview.src = url;
      }
    }
    
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  injectManifest();
  await loadComponent('#navbar-placeholder', 'components/navbar.html');
  await loadComponent('#footer-placeholder', 'components/footer.html');
  
  highlightActiveLink();
  handleSharedData(); // Process any shared content received from mobile share menu
});

// Add to components.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/farm-management/service-worker.js');
}

// Listen for the file from the service worker
navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data.action === 'load-image') {
    const file = event.data.file;
    const preview = document.getElementById('shared-image-preview');
    preview.src = URL.createObjectURL(file);
    document.getElementById('share-preview-container').classList.remove('d-none');
  }
});
