const { execSync } = require("child_process");
const fs = require("fs");

// Path to the file for commits
const filePath = "./data/random-commit.txt";

// Helper to get random number between min and max
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Higher chance to skip days (40% chance) to create more gaps
const shouldSkipDay = () => {
    return Math.random() < 0.4;
};

const generateNaturalCommits = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let current = start;
    let totalCommits = 0;

    while (current <= end && totalCommits < 100) {
        // Skip some days randomly
        if (shouldSkipDay()) {
            current.setDate(current.getDate() + 1);
            continue;
        }

        // Mostly 1-3 commits, occasionally 4-5
        const commitsToday = Math.random() < 0.85 
            ? getRandomInt(1, 3) 
            : getRandomInt(4, 5);

        // Random times during the day
        for (let i = 0; i < commitsToday && totalCommits < 100; i++) {
            // Add random hours/minutes during typical coding hours
            const hour = getRandomInt(10, 23); // Between 10 AM and 11 PM
            const minute = getRandomInt(0, 59);
            const commitDate = new Date(current);
            commitDate.setHours(hour, minute);

            fs.writeFileSync(filePath, `Update for ${commitDate.toISOString()}\n`, { flag: "a" });
            execSync(`git add ${filePath}`);
            
            // More varied commit messages
            const messages = [
                "Update documentation",
                "Fix minor styling issues",
                "Refactor helper functions",
                "Add error handling",
                "Improve performance",
                "Update dependencies",
                "Fix typos",
                "Clean up code"
            ];
            const message = messages[Math.floor(Math.random() * messages.length)];
            execSync(`git commit --date="${commitDate.toISOString()}" -m "${message}"`);
            
            totalCommits++;
        }

        current.setDate(current.getDate() + 1);
    }
};

// Run for July and August gaps
generateNaturalCommits('2024-07-01', '2024-08-31');
