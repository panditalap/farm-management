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
 * Checks for incoming shared data and shows a confirmation
 */
function handleSharedData() {
  const params = new URLSearchParams(window.location.search);
  
  // Check if any shared parameters exist
  if (params.has('title') || params.has('text') || params.has('url')) {
    const title = params.get('title') || 'Shared Content';
    const text = params.get('text') || '';
    const url = params.get('url') || '';

    alert(`Successfully received share!\n\nTitle: ${title}\nInfo: ${text}\nLink: ${url}`);
    
    // Clean URL so the alert doesn't reappear on page refresh
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
