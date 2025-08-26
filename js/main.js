// Main JavaScript file for portfolio
class Portfolio {
  constructor() {
    this.RESOURCE_PATH = './resource/';
    this.init();
  }

  async init() {
    await this.loadComponents();
    this.setupResourcePaths();
    this.setupScrolling();
    this.setupContactForm();
  }

  async loadComponents() {
    const components = [
      { selector: '#hero-component', file: 'hero.html' },
      { selector: '#about-component', file: 'about.html' },
      { selector: '#education-component', file: 'education.html' },
      { selector: '#skills-component', file: 'skills.html' },
      { selector: '#experience-component', file: 'experience.html' },
      { selector: '#projects-component', file: 'projects.html' },
      { selector: '#contact-component', file: 'contact.html' },
      { selector: '#footer-component', file: 'footer.html' }
    ];

    for (const component of components) {
      try {
        const response = await fetch(`./components/${component.file}`);
        const html = await response.text();
        const element = document.querySelector(component.selector);
        if (element) {
          element.innerHTML = html;
        }
      } catch (error) {
        console.error(`Error loading component ${component.file}:`, error);
      }
    }
  }

  setupResourcePaths() {
    // Helper function to get resource URL
    const getResourceUrl = (filename) => {
      return this.RESOURCE_PATH + filename;
    };

    // Automatically replace all <img data-src="..."> with full path
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = getResourceUrl(img.getAttribute('data-src'));
    });

    console.log('Resource paths configured');
  }

  setupScrolling() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  setupContactForm() {
    // Form submission handler
    document.addEventListener('submit', (e) => {
      if (e.target.matches('form')) {
        e.preventDefault();
        alert('Thank you for your message! But this feature isn\'t ready yet. I\'ll get back to you soon.');
        e.target.reset();
      }
    });
  }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Portfolio();
});
