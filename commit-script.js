const { execSync } = require("child_process");
const fs = require("fs");

// Path to the file for commits
const filePath = "./data/random-commit.txt";

// Generate a random number of commits per day (between min and max)
const generateRandomCommits = (startDate, endDate, minCommits = 1, maxCommits = 5) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let current = start;

    while (current <= end) {
        const commitsToday = Math.floor(Math.random() * (maxCommits - minCommits + 1)) + minCommits;
        for (let i = 0; i < commitsToday; i++) {
            fs.writeFileSync(filePath, `Commit on ${current.toISOString()}\n`, { flag: "a" });

            // Add changes
            execSync(`git add ${filePath}`);
            
            // Commit with the specific date
            execSync(`git commit --date="${current.toISOString()}" -m "Random commit for ${current.toDateString()}"`);
        }

        // Move to the next day
        current.setDate(current.getDate() + 1);
    }
};

// Execute the function
generateRandomCommits("2024-09-10", "2024-05-26");
