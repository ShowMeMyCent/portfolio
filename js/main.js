// Main JavaScript file for portfolio
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));

    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 25);

      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();

    return promise;
  }

  update() {
    let output = "";
    let complete = 0;

    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.3) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}
class Portfolio {
  setupScramble() {
    const el = document.querySelector("#scramble");
    if (!el) return;

    const fx = new TextScramble(el);

    const phrases = ["Wildan", "Engineer", "Student", "Developer"];

    let counter = 0;

    const next = () => {
      fx.setText(phrases[counter]).then(() => {
        setTimeout(next, 1400);
      });
      counter = (counter + 1) % phrases.length;
    };

    next();
  }
  constructor() {
    this.RESOURCE_PATH = "./resource/";
    this.EQUATIONS = [
      "\\(X_k = \\sum_{n=0}^{N-1} x_n e^{-i 2\\pi kn / N}\\)",
      "\\(x(t) = A\\sin(2\\pi f t + \\phi)\\)",
      "\\(H(s) = \\frac{\\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2}\\)",
      "\\(E = mc^2\\)",
      "\\(\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\varepsilon_0}\\)",
      "\\(V_{out} = V_{in} e^{-t/RC}\\)",
      "\\(f(t) * g(t) = \\int_{-\\infty}^{\\infty} f(\\tau) g(t-\\tau) d\\tau\\)",
      "\\(\\omega = 2\\pi f\\)",
      "\\(I = \\frac{V}{R}\\)",
    ];
    this.init();
  }

  async init() {
    await this.loadComponents();
    this.setupResourcePaths();
    this.mountEquationBackground();
    this.renderEquations();
    this.startClock();
    this.runIntroSequence();
    this.setupScrolling();
    this.setupContactForm();

    this.setupScramble(); // 🔥 ADD THIS
  }
  async loadComponents() {
    const components = [
      { selector: "#hero-component", file: "hero.html" },
      { selector: "#about-component", file: "about.html" },
      { selector: "#education-component", file: "education.html" },
      { selector: "#skills-component", file: "skills.html" },
      { selector: "#experience-component", file: "experience.html" },
      { selector: "#projects-component", file: "projects.html" },
      { selector: "#contact-component", file: "contact.html" },
      { selector: "#footer-component", file: "footer.html" },
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
    document.querySelectorAll("img[data-src]").forEach((img) => {
      img.src = getResourceUrl(img.getAttribute("data-src"));
    });

    console.log("Resource paths configured");
  }

  setupScrolling() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  setupContactForm() {
    // Form submission handler
    document.addEventListener("submit", (e) => {
      if (e.target.matches("form")) {
        e.preventDefault();
        alert(
          "Thank you for your message! But this feature isn't ready yet. I'll get back to you soon.",
        );
        e.target.reset();
      }
    });
  }

  renderEquations() {
    const attemptRender = (remainingAttempts = 12) => {
      if (typeof window.renderMathInElement !== "function") {
        if (remainingAttempts <= 0) {
          console.warn("KaTeX renderMathInElement not available");
          return;
        }

        setTimeout(() => attemptRender(remainingAttempts - 1), 120);
        return;
      }

      window.renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false },
        ],
      });
    };

    setTimeout(() => attemptRender(), 40);
  }

  mountEquationBackground() {
    const equationLayer = document.querySelector("#equation-bg");
    if (!equationLayer) return;

    equationLayer.innerHTML = "";

    const spriteCount = Math.min(
      18,
      Math.max(10, Math.floor(window.innerWidth / 96)),
    );

    const placed = []; // store existing positions

    const SPRITE_SIZE = 80; // approx width/height in px (adjust to your CSS)
    const MAX_ATTEMPTS = 50;

    for (let i = 0; i < spriteCount; i += 1) {
      let attempts = 0;
      let x, y, overlap;

      do {
        overlap = false;
        x = Math.random() * (window.innerWidth - SPRITE_SIZE);
        y = Math.random() * (window.innerHeight - SPRITE_SIZE);

        for (const p of placed) {
          const dx = p.x - x;
          const dy = p.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < SPRITE_SIZE) {
            overlap = true;
            break;
          }
        }

        attempts++;
      } while (overlap && attempts < MAX_ATTEMPTS);

      // If still overlapping after many tries, just skip
      if (overlap) continue;

      placed.push({ x, y });

      const node = document.createElement("span");
      node.className = "equation-sprite";
      node.textContent =
        this.EQUATIONS[Math.floor(Math.random() * this.EQUATIONS.length)];

      node.style.left = `${(x / window.innerWidth) * 100}%`;
      node.style.top = `${(y / window.innerHeight) * 100}%`;

      equationLayer.appendChild(node);
    }
  }

  startClock() {
    const clockNode = document.querySelector("#site-clock");
    if (!clockNode) return;

    const updateClock = () => {
      const now = new Date();
      clockNode.textContent = `Local Time: ${now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}`;
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  runIntroSequence() {
    const intro = document.querySelector("#engine-intro");
    const introStep = document.querySelector("#engine-step");
    const introProgress = document.querySelector("#engine-progress");
    const introTime = document.querySelector("#engine-time");
    if (!intro || !introStep || !introProgress || !introTime) return;

    const steps = [
      "Powering guidance bus...",
      "Calibrating signal processors...",
      "Synchronizing mission timeline...",
      "Ignition nominal. Welcome aboard.",
    ];

    let idx = 0;
    let intervalId;
    intro.classList.add("active");
    intro.setAttribute("aria-hidden", "false");

    const tick = () => {
      const now = new Date();
      introTime.textContent = `Sequence Time: ${now.toLocaleTimeString()}`;
      introStep.textContent = steps[idx];
      const progress = Math.min(
        100,
        Math.round(((idx + 1) / steps.length) * 100),
      );
      introProgress.style.width = `${progress}%`;

      idx += 1;
      if (idx >= steps.length) {
        clearInterval(intervalId);

        setTimeout(() => {
          intro.classList.add("hide");
          intro.setAttribute("aria-hidden", "true");
          setTimeout(() => intro.remove(), 450);
        }, 600);
      }
    };

    tick();
    intervalId = setInterval(tick, 850);
  }
}

// Initialize portfolio when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new Portfolio();
});
