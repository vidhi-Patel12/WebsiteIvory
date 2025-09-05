
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

const headers = document.querySelectorAll(".collapse-header");

headers.forEach(header => {
  header.addEventListener("click", () => {
    header.classList.toggle("active");
    const content = header.nextElementSibling;

    if (content.style.maxHeight) {
      // closing
      content.style.maxHeight = null;
      content.classList.remove("show");
    } else {
      // opening
      content.style.maxHeight = content.scrollHeight + "px";
      content.classList.add("show");

      // After animation, allow natural growth
      setTimeout(() => {
        content.style.maxHeight = "none";
      }, 400); // match CSS transition duration
    }
  });
});
