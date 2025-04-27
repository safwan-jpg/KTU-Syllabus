// Base URL for the syllabus folder hosted on GitHub Pages
const BASE_URL = "https://safwan-rcet.github.io/KTU-Syllabus/syllabus/";

// DOM Elements
const schemeDropdown = document.getElementById("scheme-dropdown");
const departmentDropdown = document.getElementById("department-dropdown");
const semesterDropdown = document.getElementById("semester-dropdown");
const pdfFilesList = document.getElementById("pdf-files");

const departmentSection = document.getElementById("department-selection");
const semesterSection = document.getElementById("semester-selection");
const pdfSection = document.getElementById("pdf-list");

// Fetch folder structure and populate dropdowns
async function fetchFolderContents(url) {
    try {
        const response = await fetch(url, { method: "GET", mode: "cors" });
        if (!response.ok) {
            throw new Error(`Failed to fetch folder contents: ${response.status}`);
        }

        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const links = Array.from(doc.querySelectorAll("a")).map((a) => a.href);

        return links.filter((link) => !link.endsWith("../"));
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Initialize dropdowns
async function initializeDropdowns() {
    const schemes = await fetchFolderContents(BASE_URL);

    if (schemes.length === 0) {
        alert("Failed to load syllabus data.");
        return;
    }

    // Populate Scheme Dropdown
    schemes.forEach((scheme) => {
        const schemeName = scheme.split("/").slice(-2, -1)[0];
        const option = document.createElement("option");
        option.value = scheme;
        option.textContent = schemeName;
        schemeDropdown.appendChild(option);
    });

    // Handle Scheme Selection
    schemeDropdown.addEventListener("change", async () => {
        const selectedScheme = schemeDropdown.value;
        departmentDropdown.innerHTML = '<option value="">-- Choose Department --</option>';
        semesterDropdown.innerHTML = '<option value="">-- Choose Semester --</option>';
        pdfFilesList.innerHTML = '';
        departmentSection.style.display = "none";
        semesterSection.style.display = "none";
        pdfSection.style.display = "none";

        if (selectedScheme) {
            const departments = await fetchFolderContents(selectedScheme);
            departments.forEach((department) => {
                const departmentName = department.split("/").slice(-2, -1)[0];
                const option = document.createElement("option");
                option.value = department;
                option.textContent = departmentName;
                departmentDropdown.appendChild(option);
            });
            departmentSection.style.display = "block";
        }
    });

    // Handle Department Selection
    departmentDropdown.addEventListener("change", async () => {
        const selectedDepartment = departmentDropdown.value;
        semesterDropdown.innerHTML = '<option value="">-- Choose Semester --</option>';
        pdfFilesList.innerHTML = '';
        semesterSection.style.display = "none";
        pdfSection.style.display = "none";

        if (selectedDepartment) {
            const semesters = await fetchFolderContents(selectedDepartment);
            semesters.forEach((semester) => {
                const semesterName = semester.split("/").slice(-2, -1)[0];
                const option = document.createElement("option");
                option.value = semester;
                option.textContent = semesterName;
                semesterDropdown.appendChild(option);
            });
            semesterSection.style.display = "block";
        }
    });

    // Handle Semester Selection
    semesterDropdown.addEventListener("change", async () => {
        const selectedSemester = semesterDropdown.value;
        pdfFilesList.innerHTML = '';
        pdfSection.style.display = "none";

        if (selectedSemester) {
            const pdfFiles = await fetchFolderContents(selectedSemester);
            pdfFiles.forEach((file) => {
                const fileName = file.split("/").slice(-1)[0];
                if (fileName.endsWith(".pdf")) {
                    const listItem = document.createElement("li");
                    const link = document.createElement("a");
                    link.href = file;
                    link.textContent = fileName;
                    link.target = "_blank";
                    listItem.appendChild(link);
                    pdfFilesList.appendChild(listItem);
                }
            });
            pdfSection.style.display = "block";
        }
    });
}

// Initialize dropdowns on page load
initializeDropdowns();