function showSection(sectionId) {
  // Hide all
  document.getElementById("serviceListSection").style.display = "none";
  document.getElementById("addServiceSection").style.display = "none";
  document.getElementById("updateServiceSection").style.display = "none";

  // Show the requested one
  document.getElementById(sectionId).style.display = "block";
}



// document.addEventListener("DOMContentLoaded", async () => {
//   const tableBody = document.getElementById("serviceTableBody");

//   try {
//     const response = await fetch("https://localhost:44394/api/Service");

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const services = await response.json();

//     // Clear old rows
//     tableBody.innerHTML = "";

//     // Populate table
//     services.forEach(service => {
//       const row = document.createElement("tr");
//       row.innerHTML = `
//         <td>${service.serviceName}</td>
//         <td>${service.description}</td>

//         <td>
//           <button class="action-btn edit" onclick="loadService(${service.serviceId})">
//             <i class="fas fa-edit"></i>
//           </button>
//           <button class="action-btn delete" onclick="deleteService(${service.serviceId})">
//             <i class="fas fa-trash-alt"></i>
//           </button>
//         </td>
//       `;
//       tableBody.appendChild(row);
//     });
//   } catch (error) {
//     tableBody.innerHTML = `
//       <tr><td colspan="4" style="color:red; text-align:center;">
//         Failed to load services: ${error.message}
//       </td></tr>
//     `;
//     console.error("Error fetching services:", error);
//   }
// });



document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("serviceTableBody");

  try {
    const response = await fetch("https://localhost:44394/api/Service");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const services = await response.json();

    // Clear old rows
    tableBody.innerHTML = "";

    // Populate table
    services.forEach(service => {
      const shortDesc = service.description.length > 100 ?
        service.description.substring(0, 100) + "..." :
        service.description;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${service.serviceName}</td>
        <td title="${service.description.replace(/"/g, '&quot;')}">${shortDesc}</td>
        <td class="text-center">
        
      <button type="button" class="btn-icon text-secondary me-2"
        onclick="getbyidService(${service.serviceId})" title="View">
  <i class="fas fa-eye fa-lg"></i>
</button>

<button type="button" class="btn-icon me-2" style="color: #1b3f6f;"
        onclick="loadService(${service.serviceId})" title="Edit">
  <i class="fas fa-edit fa-lg"></i>
</button>

<button type="button" class="btn-icon text-danger"
        onclick="deleteService(${service.serviceId})" title="Delete">
  <i class="fas fa-trash-alt fa-lg"></i>
</button>


        </td>
      `;
      tableBody.appendChild(row);
    });

    // ✅ Initialize DataTable (Bootstrap 5 styling)
    if ($.fn.DataTable.isDataTable("#serviceTable")) {
      $("#serviceTable").DataTable().destroy();
    }

    $("#serviceTable").DataTable({
      pageLength: 5,
      lengthChange: true,
      searching: true,
      ordering: true,
      info: true,
      autoWidth: false,
      language: {
        search: "🔍 Search:",
        lengthMenu: "Show _MENU_ entries"
      }
    });

  } catch (error) {
    tableBody.innerHTML = `
      <tr><td colspan="3" class="text-danger text-center">
        Failed to load services: ${error.message}
      </td></tr>
    `;
    console.error("Error fetching services:", error);
  }
});



// Cookie reader function
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// Preview image
document.getElementById("imageFile").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      const preview = document.getElementById("previewImage");
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// Format datetime → `2025-09-03T16:10:26.415Z`
function formatDateTimeISO(date) {
  return date.toISOString();
}

// Submit form
document.getElementById("serviceForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const role = parseInt(getCookie("role") || "0", 10); // userId from cookie
  console.log("Creating service by user with role:", role);

  const now = formatDateTimeISO(new Date());

  const formData = new FormData();
  formData.append("ServiceId", 0);
  formData.append("ServiceName", document.getElementById("serviceName").value);
  formData.append("Description", document.getElementById("description").value);

  // Send only filename for Image (API will save actual file separately)
  const fileInput = document.getElementById("imageFile");
  if (fileInput.files[0]) {
    formData.append("Image", fileInput.files[0].name);
    formData.append("imageFile", fileInput.files[0]); // binary
  } else {
    formData.append("Image", "");
  }

  formData.append("IsActive", true);
  formData.append("CreatedBy", role);
  formData.append("CreatedDate", now);
  formData.append("UpdatedBy", role);
  formData.append("UpdatedDate", now);

  try {
    const response = await fetch("https://localhost:44394/api/Service/Post", {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById("result").innerHTML =
        `<div class=""> </div>`;
      this.reset();
      location.reload();
      showSection("serviceListSection");

    } else {
      const errorText = await response.text();
      document.getElementById("result").innerHTML =
        `<div class="alert alert-danger"> Error: ${errorText}</div>`;
    }
  } catch (err) {
    document.getElementById("result").innerHTML =
      `<div class="alert alert-danger"> API Error: ${err.message}</div>`;
  }
});



// Delete function
async function deleteService(id) {
  if (!confirm("Are you sure you want to delete this service?")) return;

  try {
    const response = await fetch(`https://localhost:44394/api/Service/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      alert("Service deleted successfully.");
      location.reload(); // refresh table
    } else {
      alert("Failed to delete service.");
    }
  } catch (error) {
    alert("Error deleting service: " + error.message);
  }
}



// Cookie reader
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// Format datetime
function formatDateTimeISO(date) {
  return date.toISOString();
}

// Load existing service by ID
async function loadService(serviceId) {
  try {
    const response = await fetch(`https://localhost:44394/api/Service/${serviceId}`);
    if (response.ok) {
      const service = await response.json();

      // Fill form fields
      document.getElementById("serviceId").value = service.serviceId;
      document.getElementById("updateServiceName").value = service.serviceName;
      document.getElementById("updateDescription").value = service.description;

      // Handle image preview
      if (service.image) {
        // Extract filename from path (works for Windows and Linux paths)
        const fileName = service.image.split("\\").pop().split("/").pop();

        // Construct public URL (served from wwwroot/uploads/)
        const imageUrl = `https://localhost:44394/uploads/${fileName}`;

        // Show preview
        const previewImg = document.getElementById("updatePreviewImage");
        previewImg.src = imageUrl;
        previewImg.style.display = "block";

        // Store relative path (so backend can keep it if unchanged)
        document.getElementById("updateImage").value = `uploads/${fileName}`;
        document.getElementById("currentImageName").textContent = fileName;
      } else {
        document.getElementById("updatePreviewImage").style.display = "none";
        document.getElementById("currentImageName").textContent = "";
        document.getElementById("updateImage").value = "";
      }

      // Show update form
      showSection("updateServiceSection");
    } else {
      document.getElementById("updateResult").innerHTML =
        `<div class="alert alert-danger">❌ Failed to load service</div>`;
    }
  } catch (err) {
    document.getElementById("updateResult").innerHTML =
      `<div class="alert alert-danger">🚨 API Error: ${err.message}</div>`;
  }
}

// Handle new image preview
document.getElementById("updateImageFile").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById("updatePreviewImage").src = e.target.result;
      document.getElementById("updatePreviewImage").style.display = "block";
      document.getElementById("currentImageName").textContent = file.name;

      // Replace hidden value with new file path
      document.getElementById("updateImage").value = "uploads/" + file.name;
    };
    reader.readAsDataURL(file);
  }
});

// Submit update form
document.getElementById("updateForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const role = parseInt(getCookie("role") || "0", 10);
  const now = formatDateTimeISO(new Date());

  const formData = new FormData();
  formData.append("ServiceId", document.getElementById("serviceId").value);
  formData.append("ServiceName", document.getElementById("updateServiceName").value);
  formData.append("Description", document.getElementById("updateDescription").value);

  const newFile = document.getElementById("updateImageFile").files[0];
  if (newFile) {
    // If user picked a new image
    formData.append("Image", "uploads/" + newFile.name);
    formData.append("imageFile", newFile);
  } else {
    // No new image → keep old path
    const oldImagePath = document.getElementById("updateImage").value;
    formData.append("Image", oldImagePath);

    //  Trick: send dummy empty file so API validation passes
    const dummy = new Blob([], {
      type: "application/octet-stream"
    });
    formData.append("imageFile", dummy, "empty.txt");
  }

  formData.append("IsActive", true);
  formData.append("UpdatedBy", role);
  formData.append("UpdatedDate", now);

  try {
    const response = await fetch("https://localhost:44394/api/Service/Update", {
      method: "PUT",
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById("updateResult").innerHTML =
        `<div></div>`;
      this.reset();
      await loadServices();
      showSection("serviceListSection");
    } else {
      const errorText = await response.text();
      document.getElementById("updateResult").innerHTML =
        `<div class="alert alert-danger"> Error: ${errorText}</div>`;
    }
  } catch (err) {
    document.getElementById("updateResult").innerHTML =
      `<div class="alert alert-danger"> API Error: ${err.message}</div>`;
  }
});

// Reusable function
async function loadServices() {
  const tableBody = document.getElementById("serviceTableBody");

  try {
    const response = await fetch("https://localhost:44394/api/Service");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const services = await response.json();
    tableBody.innerHTML = "";

    services.forEach(service => {
      const shortDesc = service.description.length > 100 ?
        service.description.substring(0, 100) + "..." :
        service.description;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${service.serviceName}</td>
        <td>
          <span title="${service.description.replace(/"/g, '&quot;')}">
            ${shortDesc}
          </span>
        </td>
        <td>
           <button class="btn btn-link btn-sm text-warning me-2 p-0"
            onclick="loadService(${service.serviceId})" title="Edit">
      <i class="fas fa-edit"></i>
    </button>
    <button class="btn btn-link btn-sm text-danger p-0"
            onclick="deleteService(${service.serviceId})" title="Delete">
      <i class="fas fa-trash-alt"></i>
    </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Initialize DataTable (destroy first if reloading)
    if ($.fn.DataTable.isDataTable('#serviceTable')) {
      $('#serviceTable').DataTable().destroy();
    }
    $('#serviceTable').DataTable({
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      ordering: true,
      searching: true,
      paging: true
    });

  } catch (error) {
    tableBody.innerHTML = `
      <tr><td colspan="3" class="text-danger text-center">
        Failed to load services: ${error.message}
      </td></tr>
    `;
    console.error("Error fetching services:", error);
  }
}


// Load services on first page load
document.addEventListener("DOMContentLoaded", loadServices);

async function getbyidService(serviceId) {
  try {
    const response = await fetch(`https://localhost:44394/api/Service/${serviceId}`);
    if (!response.ok) throw new Error("Failed to fetch service");

    const service = await response.json();

    // Fill modal content
    document.getElementById("viewServiceName").textContent = service.serviceName;
    document.getElementById("viewServiceDescription").textContent = service.description;

    // Handle image
    if (service.image) {
      const fileName = service.image.split("\\").pop().split("/").pop();
      document.getElementById("viewServiceImage").src = `https://localhost:44394/uploads/${fileName}`;
    } else {
      document.getElementById("viewServiceImage").src = "https://via.placeholder.com/250?text=No+Image";
    }

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById("viewServiceModal"));
    modal.show();

  } catch (err) {
    console.error("Error fetching service details:", err);
    alert("Could not load service details.");
  }
}