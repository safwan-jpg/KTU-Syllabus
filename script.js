// Configuration
const REPO_OWNER = "safwan-jpg"; // Your GitHub username
const REPO_NAME = "KTU-Syllabus"; // Your repository name
const BRANCH_NAME = "main"; // Your branch name (e.g., main)

// GitHub API endpoint to fetch folder contents
const GITHUB_API_BASE_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/syllabus?ref=${BRANCH_NAME}`;

// DOM Elements
const schemeDropdown = document.getElementById("scheme-dropdown");
const departmentDropdown = document.getElementById("department-dropdown");
const semesterDropdown = document.getElementById("semester-dropdown");
const pdfFilesList = document.getElementById("pdf-files");

const departmentSection = document.getElementById("department-selection");
const semesterSection = document.getElementById("semester-selection");
const pdfSection = document.getElementById("pdf-list");

// Fetch folder contents from GitHub API
async function fetchFolderContents(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch folder contents: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Initialize dropdowns by fetching syllabus folder structure
async function initializeDropdowns() {
    const schemes = await fetchFolderContents(GITHUB_API_BASE_URL);

    if (schemes.length === 0) {
        alert("Failed to load syllabus data.");
        return;
    }

    // Populate Scheme Dropdown
    schemes.forEach((scheme) => {
        if (scheme.type === "dir") {
            const option = document.createElement("option");
            option.value = scheme.name;
            option.textContent = scheme.name;
            schemeDropdown.appendChild(option);
        }
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
            const departments = await fetchFolderContents(`${GITHUB_API_BASE_URL}/${selectedScheme}`);
            departments.forEach((dept) => {
                if (dept.type === "dir") {
                    const option = document.createElement("option");
                    option.value = dept.name;
                    option.textContent = dept.name;
                    departmentDropdown.appendChild(option);
                }
            });
            departmentSection.style.display = "block";
        }
    });

    // Handle Department Selection
    departmentDropdown.addEventListener("change", async () => {
        const selectedScheme = schemeDropdown.value;
        const selectedDepartment = departmentDropdown.value;
        semesterDropdown.innerHTML = '<option value="">-- Choose Semester --</option>';
        pdfFilesList.innerHTML = '';
        semesterSection.style.display = "none";
        pdfSection.style.display = "none";

        if (selectedDepartment) {
            const semesters = await fetchFolderContents(
                `${GITHUB_API_BASE_URL}/${selectedScheme}/${selectedDepartment}`
            );
            semesters.forEach((sem) => {
                if (sem.type === "dir") {
                    const option = document.createElement("option");
                    option.value = sem.name;
                    option.textContent = sem.name;
                    semesterDropdown.appendChild(option);
                }
            });
            semesterSection.style.display = "block";
        }
    });

    // Handle Semester Selection
    semesterDropdown.addEventListener("change", async () => {
        const selectedScheme = schemeDropdown.value;
        const selectedDepartment = departmentDropdown.value;
        const selectedSemester = semesterDropdown.value;
        pdfFilesList.innerHTML = '';
        pdfSection.style.display = "none";

        if (selectedSemester) {
            const pdfFiles = await fetchFolderContents(
                `${GITHUB_API_BASE_URL}/${selectedScheme}/${selectedDepartment}/${selectedSemester}`
            );
            pdfFiles.forEach((file) => {
                if (file.type === "file" && file.name.endsWith(".pdf")) {
                    const listItem = document.createElement("li");
                    const link = document.createElement("a");
                    link.href = file.download_url;
                    link.textContent = file.name;
                    link.target = "_blank";
                    listItem.appendChild(link);
                    pdfFilesList.appendChild(listItem);
                }
            });
            pdfSection.style.display = "block";
        }
    });
}

// Initialize the dropdowns on page load
initializeDropdowns();