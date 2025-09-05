function showSection(sectionId) {
  // Hide all
  document.getElementById("serviceListSection").style.display = "none";
  document.getElementById("addServiceSection").style.display = "none";
  document.getElementById("updateServiceSection").style.display = "none";

  // Show the requested one
  document.getElementById(sectionId).style.display = "block";
}


document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("serviceTableBody");

  try {
    // Fetch both SubServices and Services to map ServiceId -> ServiceName
    const [subServiceRes, serviceRes] = await Promise.all([
      fetch("https://localhost:44394/api/SubService"),
      fetch("https://localhost:44394/api/Service")
    ]);

    if (!subServiceRes.ok || !serviceRes.ok) {
      throw new Error(`HTTP error! SubService: ${subServiceRes.status}, Service: ${serviceRes.status}`);
    }

    const subServices = await subServiceRes.json();
    const services = await serviceRes.json();

    // Build a lookup dictionary for serviceId -> serviceName
    const serviceMap = {};
    services.forEach(s => {
      serviceMap[s.serviceId] = s.serviceName;
    });

    // Clear old rows
    tableBody.innerHTML = "";

    // Populate table
    subServices.forEach(sub => {
      const shortDesc = sub.description.length > 100
        ? sub.description.substring(0, 100) + "..."
        : sub.description;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${serviceMap[sub.serviceId] || "N/A"}</td>
        <td>${sub.subServiceName}</td>
        <td title="${sub.description.replace(/"/g, '&quot;')}">${shortDesc}</td>
        <td class="text-center">
          <button type="button" class="btn-icon text-secondary me-2"
                  onclick="getbyidSubService(${sub.subServiceId})" title="View">
            <i class="fas fa-eye fa-lg"></i>
          </button>

          <button type="button" class="btn-icon me-2" style="color: #1b3f6f;"
                  onclick="loadSubService(${sub.subServiceId})" title="Edit">
            <i class="fas fa-edit fa-lg"></i>
          </button>

          <button type="button" class="btn-icon text-danger"
                  onclick="deleteSubService(${sub.subServiceId})" title="Delete">
            <i class="fas fa-trash-alt fa-lg"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    //  Initialize DataTable (Bootstrap 5 styling)
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
      <tr><td colspan="4" class="text-danger text-center">
        Failed to load sub-services: ${error.message}
      </td></tr>
    `;
    console.error("Error fetching sub-services:", error);
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

  const role = parseInt(getCookie("role") || "0", 10); // createdBy = role
  const now = formatDateTimeISO(new Date()); // createdDate = now

  const formData = new FormData();
  formData.append("SubServiceId", 0); 
  formData.append("ServiceId", document.getElementById("serviceDropdown").value); // 👈 selected dropdown ID
  formData.append("SubServiceName", document.getElementById("subserviceName").value); // 👈 sub service name
  formData.append("Description", document.getElementById("description").value);

  // Image file
  const fileInput = document.getElementById("imageFile");
  if (fileInput.files[0]) {
    formData.append("Image", fileInput.files[0].name);   // filename
    formData.append("imageFile", fileInput.files[0]);    // binary
  } else {
    formData.append("Image", "");
  }

  formData.append("IsActive", true);
  formData.append("CreatedBy", role);
  formData.append("CreatedDate", now);
  formData.append("UpdatedBy", role);
  formData.append("UpdatedDate", now);

  try {
    const response = await fetch("https://localhost:44394/api/SubService/Post", {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById("result").innerHTML =
        `<div></div>`;
      this.reset();
      location.reload();
      showSection("serviceListSection");
    } else {
      const errorText = await response.text();
      document.getElementById("result").innerHTML =
        `<div class="alert alert-danger">Error: ${errorText}</div>`;
    }
  } catch (err) {
    document.getElementById("result").innerHTML =
      `<div class="alert alert-danger"> API Error: ${err.message}</div>`;
  }
});




// Delete function
async function deleteSubService(id) {
  if (!confirm("Are you sure you want to delete this service?")) return;

  try {
    const response = await fetch(`https://localhost:44394/api/SubService/${id}`, {
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

// Load services into dropdown

async function loadServicesIntoDropdown(dropdownId, selectedId = null) {
  try {
    const response = await fetch("https://localhost:44394/api/Service");
    if (!response.ok) throw new Error("Failed to fetch services");

    const services = await response.json();
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = `<option value="">-- Select Service --</option>`;

    services.forEach(service => {
      const option = document.createElement("option");
      option.value = service.serviceId;
      option.textContent = service.serviceName;

      if (selectedId && service.serviceId === selectedId) {
        option.selected = true; // 👈 preselect service in update form
      }

      dropdown.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading services:", err);
  }
}


// Load existing service by ID
async function loadSubService(subServiceId) {
  try {
    const response = await fetch(`https://localhost:44394/api/SubService/${subServiceId}`);
    if (response.ok) {
      const subService = await response.json();

      // Fill SubService fields
      document.getElementById("serviceId").value = subService.subServiceId;
      document.getElementById("updateServiceName").value = subService.subServiceName;
      document.getElementById("updateDescription").value = subService.description;

      // Load dropdown with services and select the right one
      await loadServicesIntoDropdown("updateServiceDropdown", subService.serviceId);

      // Handle image preview
      if (subService.image) {
        const fileName = subService.image.split("\\").pop().split("/").pop();
        const imageUrl = `https://localhost:44394/uploads/${fileName}`;

        const previewImg = document.getElementById("updatePreviewImage");
        previewImg.src = imageUrl;
        previewImg.style.display = "block";

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
        `<div class="alert alert-danger">❌ Failed to load subservice</div>`;
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
  formData.append("SubServiceId", document.getElementById("serviceId").value); // hidden input
  formData.append("ServiceId", document.getElementById("updateServiceDropdown").value); // dropdown
  formData.append("SubServiceName", document.getElementById("updateServiceName").value);
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

    // send dummy empty file so API validation passes
    const dummy = new Blob([], { type: "application/octet-stream" });
    formData.append("imageFile", dummy, "empty.txt");
  }

  formData.append("IsActive", true);
  formData.append("UpdatedBy", role);
  formData.append("UpdatedDate", now);

  try {
    const response = await fetch("https://localhost:44394/api/SubService/Update", {
      method: "PUT",
      body: formData
    });

    if (response.ok) {
      document.getElementById("updateResult").innerHTML =
        `<div></div>`;
      this.reset();
      await loadServices(); // refresh list
      location.reload();
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



async function loadServices() {
  try {
    const response = await fetch("https://localhost:44394/api/Service");
    if (!response.ok) throw new Error("Failed to fetch services");

    const services = await response.json();
    console.log("Services data:", services);

    const dropdown = document.getElementById("serviceDropdown");
    dropdown.innerHTML = `<option value="">-- Select Service --</option>`;

    services.forEach(service => {
      const option = document.createElement("option");
      option.value = service.serviceId;        //  send ID
      option.textContent = service.serviceName; // display Name
      dropdown.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading services:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadServices);


// Load services when page is ready
document.addEventListener("DOMContentLoaded", loadSubServices);



// Reusable function
async function loadSubServices() {
  const tableBody = document.getElementById("serviceTableBody");

  try {
    // 🔹 1. Fetch all services to map ID → Name
    const serviceResp = await fetch("https://localhost:44394/api/Service");
    if (!serviceResp.ok) throw new Error("Failed to fetch services");
    const services = await serviceResp.json();

    const serviceMap = {};
    services.forEach(s => {
      serviceMap[s.serviceId] = s.serviceName;
    });

    // 🔹 2. Fetch sub-services
    const subResp = await fetch("https://localhost:44394/api/SubService");
    if (!subResp.ok) throw new Error("Failed to fetch sub-services");
    const subServices = await subResp.json();

    // Clear old rows
    tableBody.innerHTML = "";

    // 🔹 3. Populate table
    subServices.forEach(sub => {
      const shortDesc = sub.description.length > 100
        ? sub.description.substring(0, 100) + "..."
        : sub.description;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${serviceMap[sub.serviceId] || "N/A"}</td>
        <td>${sub.subServiceName}</td>
        <td title="${sub.description.replace(/"/g, "&quot;")}">${shortDesc}</td>
        <td class="text-center">
          <button type="button" class="btn-icon text-secondary me-2"
                  onclick="getbyidSubService(${sub.subServiceId})" title="View">
            <i class="fas fa-eye fa-lg"></i>
          </button>
          <button type="button" class="btn-icon me-2" style="color: #1b3f6f;"
                  onclick="loadSubService(${sub.subServiceId})" title="Edit">
            <i class="fas fa-edit fa-lg"></i>
          </button>
          <button type="button" class="btn-icon text-danger"
                  onclick="deleteSubService(${sub.subServiceId})" title="Delete">
            <i class="fas fa-trash-alt fa-lg"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    //  Reinitialize DataTable cleanly
    if ($.fn.DataTable.isDataTable("#serviceTable")) {
      $("#serviceTable").DataTable().destroy();
    }

    $("#serviceTable").DataTable({
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      ordering: true,
      searching: true,
      paging: true,
      autoWidth: false,
      language: {
        search: "Search:",
        lengthMenu: "Show _MENU_ entries"
      }
    });

  } catch (error) {
    tableBody.innerHTML = `
      <tr><td colspan="4" class="text-danger text-center">
        Failed to load sub-services: ${error.message}
      </td></tr>
    `;
    console.error("Error fetching sub-services:", error);
  }
}



// Load services on first page load
document.addEventListener("DOMContentLoaded", loadSubServices);

async function getbyidSubService(subServiceId) {
  try {
    const response = await fetch(`https://localhost:44394/api/SubService/${subServiceId}`);
    if (!response.ok) throw new Error("Failed to fetch subservice");

    const subService = await response.json();

    // 1. Fetch parent service by ID
    let serviceName = "";
    if (subService.serviceId) {
      try {
        const serviceResponse = await fetch(`https://localhost:44394/api/Service/${subService.serviceId}`);
        if (serviceResponse.ok) {
          const serviceData = await serviceResponse.json();
          serviceName = serviceData.serviceName; // 👈 use ServiceName
        }
      } catch (err) {
        console.warn("Could not fetch parent service name:", err);
      }
    }

    // 2. Fill modal content
    document.getElementById("viewServiceName").textContent = serviceName || "(Unknown Service)";
    document.getElementById("viewSubServiceName").textContent = subService.subServiceName;
    document.getElementById("viewServiceDescription").textContent = subService.description;

    // 3. Handle image
    if (subService.image) {
      const fileName = subService.image.split("\\").pop().split("/").pop();
      document.getElementById("viewServiceImage").src = `https://localhost:44394/uploads/${fileName}`;
    } else {
      document.getElementById("viewServiceImage").src = "https://via.placeholder.com/250?text=No+Image";
    }

    // 4. Show modal
    const modal = new bootstrap.Modal(document.getElementById("viewServiceModal"));
    modal.show();

  } catch (err) {
    console.error("Error fetching service details:", err);
    alert("Could not load service details.");
  }
}
