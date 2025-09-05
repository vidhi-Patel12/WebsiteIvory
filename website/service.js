
const targets = document.querySelectorAll(`.services-col:last-child,.services-col .description,
  .services-col .description,.hero .hero-title,.services-section .service-icon,.subscribe-box h2`);
 
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


async function loadServices() {
  try {
    const response = await fetch("https://localhost:44394/api/Service");
    if (!response.ok) throw new Error("Failed to fetch services");

    const services = await response.json();
    const container = document.getElementById("servicesContainer");
    container.innerHTML = ""; // Clear before adding

    services.forEach((service, index) => {
      // Extract filename for image path
      const fileName = service.image ? service.image.split("\\").pop().split("/").pop() : null;
      const imageUrl = fileName 
        ? `https://localhost:44394/uploads/${fileName}`
        : "https://via.placeholder.com/150?text=No+Image";

      const card = document.createElement("div");
      card.className = "service-card";

      // Truncate description to 100 chars
      const fullText = service.description || "";
      const shortText = fullText.length > 100 ? fullText.substring(0, 100) + "..." : fullText;

      // unique button ID
      const uniqueId = `readmore-${service.serviceId || index}`;

      card.innerHTML = `
        <img src="${imageUrl}" alt="${service.serviceName}" class="service-icon rotateIn">
        <h4 class="service-title fadeInUp">${service.serviceName}</h4>
        <p class="service-text fadeInUp">${shortText}</p>
        ${fullText.length > 100 ? `<button id="${uniqueId}" class="read-more" style="background: #1b3f6f;
    color: #fff; border: none;
    border-radius: 70px; margin-left: 160px;
    right: 16px;height: 40px;
    width: 100px;">
    
    Read More</button>` : ""}
      `;

      container.appendChild(card);

      // Attach modal open event (only for card-read-more)
      const readMoreBtn = document.getElementById(uniqueId);
      if (readMoreBtn) {
        readMoreBtn.addEventListener("click", () => {
          document.getElementById("modal-img").src = imageUrl;
          document.getElementById("modal-name").textContent = service.serviceName;
          document.getElementById("modal-text").textContent = fullText;
          document.getElementById("serviceModal").classList.add("show");
        });
      }
    });
  } catch (err) {
    console.error("Error loading services:", err);
    document.getElementById("servicesContainer").innerHTML =
      `<p style="color:red;"> Failed to load services.</p>`;
  }
}


const modal = document.getElementById("serviceModal");
const closeBtn = modal.querySelector(".close");

closeBtn.addEventListener("click", () => {
  modal.classList.remove("show");
});



// Load when page ready
document.addEventListener("DOMContentLoaded", loadServices);



