// Simple client-side router for static site
class Router {
  constructor() {
    this.routes = {
      '/': 'views/home.html',
      '/join': 'views/join.html',
      '/contact': 'views/contact.html',
      '/events': 'views/contact.html',
      '/people': 'views/people.html',
    };
    
    this.init();
  }

  init() {
    // Handle navigation link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="/"]');
      if (link && !link.target) {
        e.preventDefault();
        this.navigate(link.href);
      }
    });

    // Handle back/forward buttons
    window.addEventListener('popstate', () => {
      this.loadPage(window.location.pathname);
    });

    // Load initial page
    this.loadPage(window.location.pathname);
  }

  navigate(url) {
    const path = new URL(url, window.location.origin).pathname;
    window.history.pushState({}, '', path);
    this.loadPage(path);
  }

  async loadPage(path) {
    const filePath = this.routes[path] || this.routes['/'];
    
    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error('Page not found');
      
      const html = await response.text();
      
      // Extract the content from the fetched page
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const appContainer = doc.querySelector('#app');
      
      if (appContainer) {
        // Replace the app container content
        document.querySelector('#app').innerHTML = appContainer.innerHTML;
        
        // Update page title
        document.title = doc.title || 'Cornell Cybersecurity Club';
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Update header nav active state (if component exists)
        window.updateActiveNav?.();

        // Re-initialize router for new links (no re-init here to avoid recursive loads)
      }
    } catch (error) {
      console.error('Error loading page:', error);
      document.querySelector('#app').innerHTML = '<p>Error loading page</p>';
    }
  }
}

// Loads a simple HTML fragment into the page
async function loadComponent(url, selector) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Component not found: ' + url);
    const html = await res.text();
    const el = document.querySelector(selector);
    if (el) el.innerHTML = html;
    // update navigation highlight after inserting header
    window.updateActiveNav?.();
  } catch (err) {
    console.warn(err);
  }
}

// Update nav active state based on current pathname
window.updateActiveNav = function() {
  // normalize current path to match nav data-path values
  let p = window.location.pathname.replace(/\/+$/, '');
  if (p === '' || p === '/index.html' || p === '/index') p = '/';
  // common cases when views are loaded from surrounding paths
  p = p.replace(/^\/views\//, '/');

  // treat legacy /events as /contact so nav highlights contact link
  if (p === '/events') p = '/contact';

  document.querySelectorAll('.nav-link').forEach(a => {
    const target = ((a.dataset.path || a.getAttribute('href') || '').replace(/\/+$/, '') || '/').replace(/^\/views\//, '/');
    if (target === p) {
      a.classList.add('nav-link--active');
    } else {
      a.classList.remove('nav-link--active');
    }
  });
};

// Initialize router when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  // inject sticky bar and header components before router boot
  await loadComponent('/components/sticky-bar.html', '#sticky-bar-component');
  await loadComponent('/components/header.html', '#header-component');
  new Router();
});

