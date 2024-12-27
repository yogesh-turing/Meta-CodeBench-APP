const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Get the root directory where test-runner.js is located
const rootDir = __dirname;
console.log("Root directory:", rootDir);

// Initialize summary object
const testSummary = {};

// Clean up any existing temporary config files
const cleanupTempFiles = () => {
  fs.readdirSync(rootDir)
    .filter(
      (file) => file.startsWith("jest.config.task") && file.endsWith(".json")
    )
    .forEach((file) => {
      fs.unlinkSync(path.join(rootDir, file));
    });
};

// Clean up at start
cleanupTempFiles();

// Ensure coverage directory is empty
const coverageDir = path.join(rootDir, "coverage");
if (fs.existsSync(coverageDir)) {
  fs.rmSync(coverageDir, { recursive: true, force: true });
}
fs.mkdirSync(coverageDir);

// Create implementation type directories
const implTypes = ["base", "correct", "incorrect"];
implTypes.forEach((type) => {
  const implTypeDir = path.join(coverageDir, type);
  if (!fs.existsSync(implTypeDir)) {
    fs.mkdirSync(implTypeDir);
  }
});

// Find all task folders
const tasksDir = path.join(rootDir, "tasks");
const taskFolders = fs
  .readdirSync(tasksDir)
  .filter((folder) => fs.statSync(path.join(tasksDir, folder)).isDirectory())
  .sort();

console.log("\nTask folders found:", taskFolders);

// Helper function to run tests and get results
const runTestWithOutput = (testCommand, env) => {
  try {
    execSync(testCommand, {
      env: env,
      stdio: "inherit",
    });
    return true;
  } catch (error) {
    return false;
  }
};

// For each task folder
taskFolders.forEach((taskFolder) => {
  const taskPath = path.join(tasksDir, taskFolder);
  console.log(`\n\n=== Running tests for ${taskFolder} ===`);

  testSummary[taskFolder] = {};

  // Find JavaScript files in the task folder
  const files = fs.readdirSync(taskPath).filter((file) => {
    return (
      file.endsWith(".js") &&
      !file.includes("test") &&
      !file.includes("node_modules")
    );
  });

  console.log(`\nFiles to test in ${taskFolder}:`, files);

  // Run tests for each implementation file
  files.forEach((file) => {
    const filePath = path.resolve(taskPath, file);
    const testPath = path.resolve(taskPath, "index.test.js");
    const implementationType = file.replace(".js", "");

    // Skip if test file doesn't exist
    if (!fs.existsSync(testPath)) {
      console.log(`No test file found for ${taskFolder}`);
      testSummary[taskFolder][implementationType] = "No tests found";
      return;
    }

    // Create coverage directory for this task under its implementation type
    const coveragePath = path.join(coverageDir, implementationType, taskFolder);
    if (!fs.existsSync(coveragePath)) {
      fs.mkdirSync(coveragePath, { recursive: true });
    }

    console.log(`\nRunning tests for: ${file} in ${taskFolder}`);
    console.log("Implementation path:", filePath);
    console.log("Test file path:", testPath);

    // Create temporary jest config
    const jestConfig = {
      rootDir: rootDir,
      testMatch: [testPath],
      coverageDirectory: coveragePath,
    };

    const tempConfigPath = path.join(
      rootDir,
      `jest.config.${taskFolder}.${implementationType}.json`
    );
    fs.writeFileSync(tempConfigPath, JSON.stringify(jestConfig));

    const env = { ...process.env, TARGET_FILE: filePath };

    try {
      // First run with --json to get test counts
      const jsonOutput = execSync(
        `npx jest --config ${tempConfigPath} --json`,
        {
          env: env,
          encoding: "utf-8",
          stdio: ["pipe", "pipe", "pipe"],
        }
      );

      const testResults = JSON.parse(jsonOutput);
      const numPassedTests = testResults.numPassedTests;
      const totalTests = testResults.numTotalTests;
      testSummary[taskFolder][
        implementationType
      ] = `${numPassedTests}/${totalTests} tests passed`;

      // Always run coverage report, even if tests fail
      console.log(`\nGenerating coverage report for ${file} in ${taskFolder}:`);
      runTestWithOutput(
        `npx jest --config ${tempConfigPath} --coverage --coverageReporters=text --coverageReporters=html`,
        env
      );
    } catch (error) {
      // Try to extract test results from error output
      try {
        const errorOutput = error.stdout ? error.stdout.toString() : "{}";
        const testResults = JSON.parse(errorOutput);
        const numPassedTests = testResults.numPassedTests || 0;
        const totalTests = testResults.numTotalTests || 0;
        testSummary[taskFolder][
          implementationType
        ] = `${numPassedTests}/${totalTests} tests passed`;
      } catch {
        testSummary[taskFolder][implementationType] = "Tests failed";
      }

      // Still generate coverage report even if tests fail
      console.log(`\nGenerating coverage report for ${file} in ${taskFolder}:`);
      runTestWithOutput(
        `npx jest --config ${tempConfigPath} --coverage --coverageReporters=text --coverageReporters=html`,
        env
      );
    }

    // Clean up temporary config file
    if (fs.existsSync(tempConfigPath)) {
      fs.unlinkSync(tempConfigPath);
    }

    console.log(`\nCompleted testing ${file} in ${taskFolder}`);
  });

  console.log(`\nCompleted all tests for ${taskFolder}`);
});

// Final cleanup of any remaining temp files
cleanupTempFiles();

// Print summary
console.log("\n============= TEST SUMMARY =============\n");
Object.keys(testSummary).forEach((taskFolder) => {
  console.log(`${taskFolder}:`);
  Object.entries(testSummary[taskFolder]).forEach(([impl, result]) => {
    if (result === "Tests failed" || result === "Not tested") {
      console.log(
        `  ${impl.padEnd(11)}: ${result.padEnd(12)} [\x1b[31mFAILED\x1b[0m]`
      );
    } else {
      const match = result.match(/(\d+)\/(\d+)/);
      if (match) {
        const [, passed, total] = match;
        const status =
          parseInt(passed) === parseInt(total)
            ? "\x1b[32mPASSED\x1b[0m"
            : "\x1b[31mFAILED\x1b[0m";
        console.log(`  ${impl.padEnd(11)}: ${result.padEnd(12)} [${status}]`);
      }
    }
  });
  console.log("");
});

// Save summary to file
const summaryPath = path.join(rootDir, "test-summary.txt");
let summaryContent = "TEST SUMMARY\n============\n\n";
Object.keys(testSummary).forEach((taskFolder) => {
  summaryContent += `${taskFolder}:\n`;
  Object.entries(testSummary[taskFolder]).forEach(([impl, result]) => {
    if (result === "Tests failed" || result === "Not tested") {
      summaryContent += `${impl.padEnd(11)}: ${result.padEnd(12)} [FAILED]\n`;
    } else {
      const match = result.match(/(\d+)\/(\d+)/);
      if (match) {
        const [, passed, total] = match;
        const status =
          parseInt(passed) === parseInt(total) ? "PASSED" : "FAILED";
        summaryContent += `${impl.padEnd(11)}: ${result.padEnd(
          12
        )} [${status}]\n`;
      }
    }
  });
  summaryContent += "\n";
});
fs.writeFileSync(summaryPath, summaryContent);

console.log("All test runs completed!");
