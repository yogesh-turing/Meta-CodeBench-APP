Base Code:
```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

class Employee {
    id;
    constructor(name, email, dob) {
        this.name = name;
        this.email = email;
        this.dob = dob;
    }

    getAge() {
        return new Date().getFullYear() - new Date(this.dob).getFullYear();
    }
}

class EmployeeModel {
    #table = 'employees';
    #db;

    constructor(db) {
        this.#db = db;
        this.#db.run(`CREATE TABLE IF NOT EXISTS ${this.#table} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            dob TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT 1,
            created_by TEXT,
            updated_by TEXT
        )`);
    }

    addEmployee(employee) {
        // TODO: Complete the function

        // Validate employee object

        // Check if employee with the same email already exists

        // Insert employee into the database
    }

    getEmployees() {
        return new Promise((resolve, reject) => {
            this.#db.all(`SELECT * FROM ${this.#table}`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => new Employee(row.name, row.email, row.dob)));
                }
            });
        });
    }

    getEmployeeByEmail(email) {
        return new Promise((resolve, reject) => {
            this.#db.get(`SELECT * FROM ${this.#table} WHERE email = ?`, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Employee(row.name, row.email, row.dob));
                }
            });
        });
    }
}

module.exports = { Employee, EmployeeModel, db };
```

Prompt:
Please help to complete the following function
1. Complete `addEmployee` function:
    - The function should validate the input parameter employee.
    - Make sure the employee object is valid, the employee object should have 
        - name: string with 3 to 20 characters.
        - email: valid email string.
        - dob: valid date in the past.
    - Before inserting an employee into the table, ensure there is no existing entry with the same email address. Email ID should be case-insensitive.
    - Make sure other values like created_at, created_by, updated_at, updated_by and is_active are set correctly. Use the string "System" for created_by and updated_by. 