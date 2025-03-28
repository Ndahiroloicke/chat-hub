const { execSync } = require("child_process");
const fs = require("fs");

// Path to the file for commits
const filePath = "./data/random-commit.txt";

// Helper to get random number between min and max
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper to decide if we should skip a day (30% chance to skip)
const shouldSkipDay = () => {
    return Math.random() < 0.3;
};

const generateNaturalCommits = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let current = start;

    while (current <= end) {
        // Skip some days randomly
        if (shouldSkipDay()) {
            current.setDate(current.getDate() + 1);
            continue;
        }

        // Random number of commits (1-4 commits most days, rarely 5-7)
        const commitsToday = Math.random() < 0.8 
            ? getRandomInt(1, 4) 
            : getRandomInt(5, 7);

        // Random times during the day
        for (let i = 0; i < commitsToday; i++) {
            // Add random hours/minutes to make it look more natural
            const hour = getRandomInt(9, 22); // Between 9 AM and 10 PM
            const minute = getRandomInt(0, 59);
            const commitDate = new Date(current);
            commitDate.setHours(hour, minute);

            fs.writeFileSync(filePath, `Commit on ${commitDate.toISOString()}\n`, { flag: "a" });
            execSync(`git add ${filePath}`);
            execSync(`git commit --date="${commitDate.toISOString()}" -m "Update documentation and fix minor issues"`);
        }

        current.setDate(current.getDate() + 1);
    }
};

// Run for June and September gaps
generateNaturalCommits('2024-06-01', '2024-06-30');
generateNaturalCommits('2024-09-01', '2024-09-30');
