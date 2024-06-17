const fs = require('fs');
const execSync = require('child_process').execSync;

// Function to generate a random date between start and end date
function getRandomDate(startDate, endDate) {
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    const randomTimestamp = Math.floor(Math.random() * (endTimestamp - startTimestamp + 1)) + startTimestamp;
    return new Date(randomTimestamp);
}

// Function to change the commit date
function changeCommitDate(date) {
    const formattedDate = date.toISOString();
    try {
        execSync(
            `set GIT_COMMITTER_DATE=${formattedDate} && git commit --amend --no-edit --date "${formattedDate}"`
        );
        console.log(`Commit date changed to: ${formattedDate}`);
    } catch (error) {
        console.error("Error amending commit date:", error.message);
    }
}

// Function to check if there are any changes to commit
function checkForChanges() {
    try {
        const status = execSync('git status --porcelain').toString();
        return status.trim().length > 0; // If there are any changes, status won't be empty
    } catch (error) {
        console.error("Error checking for changes:", error.message);
        return false;
    }
}

// Helper function to modify JSON
function appendToJSON(filePath, randomDate) {
    try {
        // Check if file exists and is not empty, otherwise initialize it
        let data = [];
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            // Only parse if the file has valid JSON content
            if (fileContent.trim().length > 0) {
                data = JSON.parse(fileContent);
            }
        }

        // Add new entry to the JSON array
        data.push({ timestamp: randomDate.toISOString() });

        // Write the updated array back to the JSON file
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log("JSON file updated.");
    } catch (error) {
        console.error("Error modifying JSON file:", error.message);
    }
}

// Create 410 random commits between Sept 10th, 2024, and May 26th, 2024
const startDate = new Date('2024-05-26T00:00:00');
const endDate = new Date('2024-09-10T23:59:59');
const jsonFilePath = 'data.json';

for (let i = 0; i < 410; i++) {
    console.log(`Creating commit #${i + 1}...`);

    // Generate a random commit date
    const randomDate = getRandomDate(startDate, endDate);

    // Modify the JSON file with a valid entry
    appendToJSON(jsonFilePath, randomDate);

    // Check if there are changes to commit
    if (checkForChanges()) {
        try {
            // Stage the changes
            execSync('git add .');
            console.log(`Changes staged.`);

            // Commit the changes with the random date
            changeCommitDate(randomDate);
        } catch (error) {
            console.error("Error during Git operations:", error.message);
        }
    } else {
        console.log("No changes detected, skipping commit.");
    }
}

console.log('Completed creating 410 random commits between May 26th, 2024, and Sept 10th, 2024.');
