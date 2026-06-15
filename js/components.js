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
 * Master init — loads all shared components, then runs post-load logic.
 * await ensures navbar exists in DOM before highlightActiveLink runs.
 */
document.addEventListener('DOMContentLoaded', async () => {

  await loadComponent('#navbar-placeholder',  'components/navbar.html');
  await loadComponent('#footer-placeholder',  'components/footer.html');

  highlightActiveLink(); // must run AFTER navbar is in the DOM

});
