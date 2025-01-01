const { exec } = require('child_process');

function runJestTests() {
    const testMatch = 'tasks/304032/index.test.js';
    process.env.TARGET_FILE = './model_a.js';
    const jestCommand = `npx jest ${testMatch} --verbose --ignore=tasks`;
    exec(jestCommand, (error, stdout, output) => {
        if (error) {
            console.error(error.message);
            process.exit(1);
        } else if (output) {
            console.log(`${output}`);
        }
        process.exit(0);
    });
    
}

runJestTests();