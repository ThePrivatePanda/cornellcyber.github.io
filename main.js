// Simple client-side router for static site
class Router {
  constructor() {
    this.routes = {
      '/': 'views/home.html',
      '/join': 'views/join.html',
      '/contact': 'views/contact.html',
    };
    
    this.handleClick = this.handleClick.bind(this);
    this.handlePopState = this.handlePopState.bind(this);
    this.initialized = false;

    this.init();
  }

  init() {
    if (this.initialized) return;

    // Handle navigation link clicks
    document.addEventListener('click', this.handleClick);

    // Handle back/forward buttons
    window.addEventListener('popstate', this.handlePopState);

    this.initialized = true;

    // Load initial page
    this.loadPage(window.location.pathname);
  }

  handleClick(e) {
    const link = e.target.closest('a[href^="/"]');
    if (link && !link.target) {
      e.preventDefault();
      this.navigate(link.href);
    }
  }

  handlePopState() {
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

