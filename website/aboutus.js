const targets = document.querySelectorAll(`.about-header h1,.section-container, .main-img, .main-img-1,.main-img-2,
    .img-badge,.who-we-are, .main-title, .skills-bg img,.skills-title,.skills-main-title,.skills-desc,
    .why-us .section-header h5,.why-us .section-header h5,.why-us .section-header h2, .why-us .section-header h3, .why-us .section-header .section-p,
    .why-grid,.subscribe-box h2`);
 
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


// animate numbers
const canvas = document.getElementById('network-lines');
const ctx = canvas.getContext('2d');

// Fixed coordinates for points
const points = [
    { x: 50,  y: 100 },
    { x: 200, y: 100 },
    { x: 400, y: 50 },
    { x: 600, y: 120 },
    { x: 150, y: 900 },
    { x: 350, y: 950 },
    { x: 500, y: 700 },
    { x: 800, y: 420 },
    { x: 1150, y: 145},
    { x: 1350, y: 370 }
];

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawNetwork();
}

function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;

    // Draw lines between points
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
        }
    }

    // Draw circles at each point
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();


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


function animate(el){
  const target = +el.dataset.count; const duration = 1400; const start = performance.now();
  function step(now){
    const p = Math.min(1,(now-start)/duration);
    el.textContent = (Math.floor(target*p)).toLocaleString();
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.querySelectorAll('.au-num').forEach(animate);
// IntersectionObserver to reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('show');
      io.unobserve(e.target);
    }
  });
},{threshold:0.15});

document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Counters
function animateCounter(el){
  const target = +el.dataset.count;
  const duration = 1400;
  const start = performance.now();
  function step(now){
    const p = Math.min(1,(now-start)/duration);
    const value = Math.floor(p*target);
    el.textContent = value.toLocaleString();
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
document.querySelectorAll('.counter-card .value').forEach(animateCounter);

// Progress bars animated width
document.querySelectorAll('.progress .bar span').forEach(span=>{
  const to = getComputedStyle(span).getPropertyValue('--to');
  span.style.width = to;
});

// back to top
const back = document.getElementById('backToTop');
window.addEventListener('scroll',()=>{
  if(window.scrollY>400){back.classList.add('show')} else back.classList.remove('show');
});
back && back.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));




// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('show');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const navbar = document.querySelector('.navbar'); // or #navbar depending on your HTML


// Sticky Navigation
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

// Back to top functionality
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-up elements
document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
});

const faqToggles = document.querySelectorAll('.faq-toggle'); 

// FAQ Accordion
faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const faqItem = toggle.parentElement;
        const faqPanel = faqItem.querySelector('.faq-panel');
        const isActive = toggle.classList.contains('active');
        
        // Close all other FAQ items
        faqToggles.forEach(otherToggle => {
            if (otherToggle !== toggle) {
                otherToggle.classList.remove('active');
                otherToggle.parentElement.querySelector('.faq-panel').classList.remove('show');
            }
        });
        
        // Toggle current FAQ item
        toggle.classList.toggle('active');
        faqPanel.classList.toggle('show');
    });
});


// Counter Animation for Stats
function animateCounters() {
  const counters = document.querySelectorAll('.stat-icon');
  
  counters.forEach(counter => {
      const target = parseInt(counter.textContent.replace(/\D/g, ''));
      const increment = target / 100;
      let current = 0;
      
      const updateCounter = () => {
          if (current < target) {
              current += increment;
              counter.textContent = Math.ceil(current) + '+';
              requestAnimationFrame(updateCounter);
          } else {
              counter.textContent = target + '+';
          }
      };
      
      updateCounter();
  });
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              animateCounters();
              statsObserver.unobserve(entry.target);
          }
      });
  }, { threshold: 0.5 });
  
  statsObserver.observe(statsSection);
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero) {
      const rate = scrolled * -0.5;
      hero.style.transform = `translateY(${rate}px)`;
  }
});

