const fs = require('fs');
const execSync = require('child_process').execSync;

// Function to generate random date between start and end date
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
        execSync(`set GIT_COMMITTER_DATE=${formattedDate} && git commit --amend --no-edit --date "${formattedDate}"`);
    } catch (error) {
        console.error("Error amending commit date:", error.message);
    }
}

// Function to check if there are any changes to commit
function checkForChanges() {
    try {
        const status = execSync('git status --porcelain').toString();
        return status.length > 0; // If there are any changes, status won't be empty
    } catch (error) {
        console.error("Error checking for changes:", error.message);
        return false;
    }
}

// Create 410 random commits between Sept 10th, 2024, and May 26th, 2024
const startDate = new Date('2024-09-10T00:00:00');
const endDate = new Date('2024-05-26T23:59:59');

for (let i = 0; i < 410; i++) {
    // Generate a random commit date
    const randomDate = getRandomDate(startDate, endDate);

    // Make a random change to the repository (e.g., modifying a file)
    fs.appendFileSync('data.json', `\n// Random commit on ${randomDate.toISOString()}`);

    // Check if there are changes to commit
    if (checkForChanges()) {
        // Stage the changes
        execSync('git add .');

        // Commit the changes with the random date
        changeCommitDate(randomDate);
        try {
            execSync('git commit -m "Random commit"');
        } catch (error) {
            console.error("Error committing changes:", error.message);
        }
    } else {
        console.log("No changes detected, skipping commit.");
    }
}

console.log('Completed creating 410 random commits between Sept 10th, 2024, and May 26th, 2024.');
