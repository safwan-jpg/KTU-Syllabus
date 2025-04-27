const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Path to the syllabus folder
const syllabusFolder = path.join(__dirname, "syllabus");

// API to get the folder structure
app.get("/api/folders", (req, res) => {
    const data = {};

    // Recursively read the folder structure
    const readFolder = (dir, obj) => {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        items.forEach((item) => {
            if (item.isDirectory()) {
                obj[item.name] = {};
                readFolder(path.join(dir, item.name), obj[item.name]);
            } else {
                if (!obj.files) obj.files = [];
                obj.files.push(item.name);
            }
        });
    };

    readFolder(syllabusFolder, data);
    res.json(data);
});

// Serve the frontend files
app.use(express.static(__dirname));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});