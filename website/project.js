
const targets = document.querySelectorAll(`.hero .hero-title,.projects-left h2,.projects-right p,
  .portfolio .container,.card img,.skills-bg img,.skills-title,.skills-main-title,
  .skills-desc,.stat-item .icon,.stat-item .icon,.subscribe-box h2`);
 
const observerr = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // reset animation by forcing it to re-run
      entry.target.style.animation = "none";        // disable
      void entry.target.offsetWidth;                // trigger reflow
      entry.target.style.animation = "";            // restore original from CSS
    }
  });
}, { threshold: 0.2 });
 
targets.forEach(el => observerr.observe(el));

const counters = document.querySelectorAll(".counter");
  const speed = 100; // smaller = faster

  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText.replace(/\D/g, ""); // remove non-digits
      const increment = Math.ceil(target / speed);

      if (count < target) {
        counter.innerText = count + increment;
        setTimeout(updateCount, 20);
      } else {
        counter.innerText = target.toLocaleString() + "+"; // format with commas + "+"
      }
    };

    updateCount();
  });

  
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Mobile Navigation Toggle
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('show');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('show');
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('show');
        });
    });
}