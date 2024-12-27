# Test Runner Application (JavaScript)

A Node.js application for running and managing multiple JavaScript test suites across different tasks. This application provides organized test execution, coverage reporting, and a clear summary of test results.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Usage](#usage)
- [Output Format](#output-format)
- [Coverage Reports](#coverage-reports)

## Features

- ✅ Run tests for multiple implementations (base code, ideal response code, incorrect solution code) across different tasks
- 📊 Generate detailed test coverage reports
- 📝 Provide clear test result summaries with PASS/FAIL status
- 🎨 Colored console output for better readability
- 📁 Organized coverage reports by implementation type
- 📄 Summary report generation in both console and file formats

## Project Structure

```
root/
├── node_modules/
├── coverage/
│   ├── base/
│   │   ├── task1/
│   │   ├── task2/
│   │   └── ...
│   ├── correct/
│   │   ├── task1/
│   │   ├── task2/
│   │   └── ...
│   └── incorrect/
│       ├── task1/
│       ├── task2/
│       └── ...
├── tasks/
│   ├── task1/
│   │   ├── base.js
│   │   ├── correct.js
│   │   ├── incorrect.js
│   │   └── index.test.js
│   ├── task2/
│   │   ├── base.js
│   │   ├── correct.js
│   │   ├── incorrect.js
│   │   └── index.test.js
│   └── ...
├── test-runner.js
├── test-summary.txt
├── package.json
└── package-lock.json
```

## Setup

1. Install Node.js (version 14 or higher recommended)

2. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

3. Place your task folders inside the `tasks` directory. Each task folder should contain:
   - `base.js` - Base implementation
   - `correct.js` - Correct implementation
   - `incorrect.js` - Implementation with known issues
   - `index.test.js` - Test file for all implementations

## Usage

Run the test runner:

```bash
node test-runner.js
```

This will:

1. Run tests for all implementations in each task folder
2. Generate coverage reports
3. Display results in the console
4. Create a test summary file (`test-summary.txt`)

## Output Format

### Console Output

The test runner provides real-time output for each test run and a final summary:

```
============= TEST SUMMARY =============

taskname:
  base       : 3/19 tests passed  [FAILED]
  correct    : 19/19 tests passed [PASSED]
  incorrect  : 11/19 tests passed [FAILED]
```

Colors are used in the console output:

- Green: PASSED (all tests successful)
- Red: FAILED (some tests failed)

### Summary File

A `test-summary.txt` file is generated with the same information in a plain text format.

## Coverage Reports

Coverage reports are generated in the `coverage` directory, organized by implementation type:

```
coverage/
├── base/
│   └── taskname/
│       └── index.html
├── correct/
│   └── taskname/
│       └── index.html
└── incorrect/
    └── taskname/
        └── index.html
```

Each implementation gets its own coverage report with:

- Line coverage
- Function coverage
- Branch coverage
- Visual code coverage display

To view the coverage reports:

1. Navigate to the relevant directory under `coverage`
2. Open `index.html` in a web browser

## Notes

- The test runner automatically cleans up temporary configuration files
- Coverage reports are regenerated on each run
- Tests are run in alphabetical order of task folders
- Failed tests will still generate coverage reports
