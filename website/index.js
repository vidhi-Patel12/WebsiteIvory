// DOM Elements

const targets = document.querySelectorAll(`.hero p,
    .cta-btn.dark, .cta-btn.light, .cta-call, .main-image img, .clients-overlay, .about-text h2,
    .about-text h3, .about-text .muted, .ripple, .toast, .sub-image, .showcase-head .overline,
    .showcase-head h2, .showcase-item h3, .showcase-item p, .read-more, .project-head .overline,
    .hero h1, .project-head h2, .ph-right,.why-us .section-header h5,
    .why-us .section-header h2, .ts-hero-text .overline, .ts-hero-text h2,
    .play-btn, .ts-card,.pm-left .overline, .pm-left h2, .pm-right, .pm-grid,
    .pm-card, .cta-hero-text h2,.cta-hero-text p, .cta-btn.primary,
    .panel-left h3, .info-icon,.info-text h5,.info-text p ,.form-card,
    .fc-left .overline,.fc-left h2,.clients-overline,.clients-card h3,
    .logo, .why-grid,.main-img,.mini-img-1, .mini-img-2, .img-badge,
    .project-grid, .project-card, .project-card img, .project-grid,
    .project-card h3, .project-card p, .project-card a,.subscribe-box h2`);
 
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
    { x: 1150, y: 200 },
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
const navbar = document.querySelector('.navbar');
const backToTop = document.getElementById('backToTop');
const toast = document.getElementById('toast');
const contactForm = document.getElementById('contactForm');
const faqToggles = document.querySelectorAll('.faq-toggle');

// Mobile Navigation Toggle
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

// Contact Form Submission
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        try {
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            showToast('Message sent successfully!', 'success');
            
            // Reset form
            contactForm.reset();
            
        } catch (error) {
            showToast('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

// Toast Notification System
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        toast.style.display = 'none';
    }, 5000);
}

// Ripple Effect for Buttons
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple effect to all buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', createRipple);
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

// Service Card Hover Effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Project Item Hover Effects
document.querySelectorAll('.project-item').forEach(project => {
    project.addEventListener('mouseenter', () => {
        const overlay = project.querySelector('.project-overlay');
        if (overlay) {
            overlay.style.opacity = '1';
        }
    });
    
    project.addEventListener('mouseleave', () => {
        const overlay = project.querySelector('.project-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
        }
    });
});

// Pricing Card Interactions
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        if (!card.classList.contains('featured')) {
            card.style.transform = 'translateY(-10px)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('featured')) {
            card.style.transform = 'translateY(0)';
        }
    });
});

// Form Input Focus Effects
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
});

// Testimonial Card Interactions
document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// CTA Button Interactions
document.querySelectorAll('.cta-buttons .btn').forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0) scale(1)';
    });
});

// Footer Link Interactions
document.querySelectorAll('.footer-links a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateX(5px)';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateX(0)';
    });
});

// Social Media Icon Interactions
document.querySelectorAll('.social-icons a, .footer-socials a').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'translateY(-3px) rotate(5deg)';
    });
    
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'translateY(0) rotate(0deg)';
    });
});

// Logo Animation
const logo = document.querySelector('.brand .logo');
if (logo) {
    logo.addEventListener('mouseenter', () => {
        logo.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    logo.addEventListener('mouseleave', () => {
        logo.style.transform = 'scale(1) rotate(0deg)';
    });
}

// Navigation Link Active State
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.classList.add('loaded');
    
    // Initialize tooltips for service features
    document.querySelectorAll('.service-features li').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
        });
    });
    
    // Initialize project tech stack animations
    document.querySelectorAll('.project-tech span').forEach(tech => {
        tech.addEventListener('mouseenter', () => {
            tech.style.transform = 'scale(1.1)';
        });
        
        tech.addEventListener('mouseleave', () => {
            tech.style.transform = 'scale(1)';
        });
    });
    
    // Initialize pricing feature animations
    document.querySelectorAll('.pricing-features li').forEach(feature => {
        feature.addEventListener('mouseenter', () => {
            feature.style.transform = 'translateX(5px)';
        });
        
        feature.addEventListener('mouseleave', () => {
            feature.style.transform = 'translateX(0)';
        });
    });
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    updateActiveNavLink();
}, 100));

// Add CSS for additional animations
const style = document.createElement('style');
style.textContent = `
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    
    .form-group.focused input,
    .form-group.focused textarea {
        border-color: var(--maroon);
        box-shadow: 0 0 0 3px rgba(111, 29, 27, 0.1);
    }
    
    .btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .fade-up {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }
    
    .fade-up.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    body.loaded {
        animation: fadeIn 0.5s ease-out;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

document.head.appendChild(style);

// Export functions for potential external use
window.TechnoAgency = {
    showToast,
    updateActiveNavLink,
    animateCounters
};
 

document.querySelectorAll('.ts-card').forEach(card => {
  const p = card.querySelector('p');
  const btn = card.querySelector('.read-more');
  const fullText = card.dataset.fulltext;

  if (!fullText) return; // Skip if missing

  const shortText = fullText.substring(0, 150) + '...';
  p.textContent = shortText;

  btn.addEventListener('click', () => {
    document.getElementById('modal-text').textContent = fullText;
    document.getElementById('modal-img').src = card.querySelector('img').src;
    document.getElementById('modal-name').textContent = card.querySelector('.ts-author-meta strong').textContent;
    document.getElementById('modal-position').textContent = card.querySelector('.ts-author-meta span').textContent;

    // Show modal with animation
    document.getElementById('testimonial-modal').classList.add('show');
  });
});

// Close modal (if you have a close button)
document.querySelector('.modal .close')?.addEventListener('click', () => {
  document.getElementById('testimonial-modal').classList.remove('show');
});


// JavaScript for toggling the "More" and "Less" buttons
document.getElementById('toggle-button').addEventListener('click', function() {
    const container = document.querySelector('.techcard');
    const button = document.getElementById('toggle-button');

    // Toggle the expanded class to show/hide extra items
    container.classList.toggle('expanded');

    // Change the button text between 'More' and 'Less'
    if (container.classList.contains('expanded')) {
        button.textContent = 'Less';  // When expanded
    } else {
        button.textContent = 'More';  // When collapsed
    }
});

document.getElementById('backendtoggle-button').addEventListener('click', function() {
    const container = document.querySelector('.backendtechcard');
    const button = document.getElementById('backendtoggle-button');

    // Toggle the expanded class to show/hide extra items
    container.classList.toggle('expanded');

    // Change the button text between 'More' and 'Less'
    if (container.classList.contains('expanded')) {
        button.textContent = 'Less';  // When expanded
    } else {
        button.textContent = 'More';  // When collapsed
    }
});

document.getElementById('cloudtoggle-button').addEventListener('click', function() {
    const container = document.querySelector('.cloudtechcard');
    const button = document.getElementById('cloudtoggle-button');

    // Toggle the expanded class to show/hide extra items
    container.classList.toggle('expanded');

    // Change the button text between 'More' and 'Less'
    if (container.classList.contains('expanded')) {
        button.textContent = 'Less';  // When expanded
    } else {
        button.textContent = 'More';  // When collapsed
    }
});



