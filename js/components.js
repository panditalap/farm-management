/**
 * components.js
 * Loads shared HTML components (navbar, footer) into every page.
 * Run once on DOMContentLoaded — no other file needs to touch this.
 */

/**
 * Fetches an HTML file and injects it into a DOM element.
 * @param {string} selector - CSS selector of the target element (e.g. '#navbar-placeholder')
 * @param {string} path     - Path to the HTML component file
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

/**
 * Reads the current page filename and adds Bootstrap's "active"
 * class to the matching nav link automatically.
 */
function highlightActiveLink() {
  // Get just the filename: "about.html", "index.html", etc.
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page'); // accessibility
    }
  });
}

/**
 * Automatically injects the manifest link into the head of any page
 * that loads this components.js file.
 */
function injectManifest() {
  const link = document.createElement('link');
  link.rel = 'manifest';
  link.href = 'manifest.json';
  document.head.appendChild(link);
}

/**
 * Master init — loads all shared components, then runs post-load logic.
 * await ensures navbar exists in DOM before highlightActiveLink runs.
 */
document.addEventListener('DOMContentLoaded', async () => {
  injectManifest(); // injects manifest on each page
  await loadComponent('#navbar-placeholder',  'components/navbar.html');  // inject navbar on each page
  await loadComponent('#footer-placeholder',  'components/footer.html');  // inject footer on each page
  highlightActiveLink(); // must run AFTER navbar is in the DOM

});
