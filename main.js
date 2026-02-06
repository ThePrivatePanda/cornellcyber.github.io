// Simple client-side router for static site
class Router {
  constructor() {
    this.routes = {
      '/': 'views/home.html',
      '/join': 'views/join.html',
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
        
        // Re-initialize router for new links
        this.init();
      }
    } catch (error) {
      console.error('Error loading page:', error);
      document.querySelector('#app').innerHTML = '<p>Error loading page</p>';
    }
  }
}

// Initialize router when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Router();
});

