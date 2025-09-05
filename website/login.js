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



 // Toggle between Password & OTP form
        const btnPassword = document.getElementById("btnPassword");
        const btnOtp = document.getElementById("btnOtp");
        const passwordForm = document.getElementById("passwordForm");
        const otpForm = document.getElementById("otpForm");

        btnPassword.addEventListener("click", () => {
            passwordForm.classList.remove("hidden");
            otpForm.classList.add("hidden");
            btnPassword.classList.add("btn-dark");
            btnPassword.classList.remove("btn-outline-dark");
            btnOtp.classList.remove("btn-dark");
            btnOtp.classList.add("btn-outline-dark");
        });

        btnOtp.addEventListener("click", () => {
            otpForm.classList.remove("hidden");
            passwordForm.classList.add("hidden");
            btnOtp.classList.add("btn-dark");
            btnOtp.classList.remove("btn-outline-dark");
            btnPassword.classList.remove("btn-dark");
            btnPassword.classList.add("btn-outline-dark");
        });

        document.getElementById("passwordForm").addEventListener("submit", async function (e) {
            e.preventDefault();

            const mobile = document.getElementById("mobile").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch(
                    "https://localhost:44394/api/Login/loginwithpassword", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            mobile: mobile,
                            password: password
                        })
                    });

                if (response.ok) {
                    const data = await response.json();
                     document.cookie = `role=${data.role}; path=/; SameSite=Lax`;
                    window.location.href = "adminservice.html";
                }
                    // document.getElementById("result").innerHTML =
                    //     `<div class="alert alert-success"> ${data.message}</div>`;

                    // Example: set cookie
                    // document.cookie = `userRole=${data.user.userRole}; path=/;`;

                 else if (response.status === 401) {
                    document.getElementById("result").innerHTML =
                        `<div class="alert alert-danger"> Invalid contact number or password</div>`;
                } else {
                    const errorText = await response.text();
                    document.getElementById("result").innerHTML =
                        `<div class="alert alert-warning"> Error: ${errorText}</div>`;
                }
            } catch (err) {
                document.getElementById("result").innerHTML =
                    `<div class="alert alert-danger"> API Error: ${err.message}</div>`;
            }
        });

        // OTP Form Submission

        document.getElementById("sendOtpBtn").addEventListener("click", async function () {
            const mobile = document.getElementById("otpMobile").value;

            if (!mobile) {
                alert("Please enter mobile number first");
                return;
            }

            try {
                const response = await fetch("https://localhost:44394/api/Login/loginwithotp", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        mobile) // because your backend expects long mobile directly
                });

                if (response.ok) {
                    const data = await response.json();
                    document.getElementById("result").innerHTML =
                        `<div class="alert alert-success"> ${data.message}</div>`;
                } else {
                    const errorText = await response.text();
                    document.getElementById("result").innerHTML =
                        `<div class="alert alert-danger"> ${errorText}</div>`;
                }
            } catch (err) {
                document.getElementById("result").innerHTML =
                    `<div class="alert alert-danger"> API Error: ${err.message}</div>`;
            }
        });

        // ---------- Verify OTP ----------
        document.getElementById("otpForm").addEventListener("submit", async function (e) {
            e.preventDefault();

            const mobile = document.getElementById("otpMobile").value;
            const otp = document.getElementById("otpCode").value;

            try {
                const response = await fetch("https://localhost:44394/api/Login/verifyotp", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        mobile: mobile,
                        otp: parseInt(otp)
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    document.getElementById("result").innerHTML =
                        `<div class="alert alert-success"> ${data.message}, Role: ${data.role}</div>`;
                } else {
                    const errorText = await response.text();
                    document.getElementById("result").innerHTML =
                        `<div class="alert alert-danger"> ${errorText}</div>`;
                }
            } catch (err) {
                document.getElementById("result").innerHTML =
                    `<div class="alert alert-danger"> API Error: ${err.message}</div>`;
            }
        });