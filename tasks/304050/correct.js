const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const { isEmail } = require('validator'); // Assuming you have validator package installed
const moment = require('moment'); // Assuming you have moment package installed


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
        return new Promise((resolve, reject) => {
            // Validate employee object
            if (typeof employee.name !== 'string' || employee.name.length < 3 || employee.name.length > 20) {
                return reject(new Error('Invalid name'));
            }
            if (!isEmail(employee.email)) {
                return reject(new Error('Invalid email'));
            }
            if (!moment(employee.dob, 'YYYY-MM-DD', true).isValid() || moment(employee.dob).isAfter(moment())) {
                return reject(new Error('Invalid date of birth'));
            }
    
            // Check if employee with the same email already exists (case-insensitive)
            this.#db.get(`SELECT * FROM ${this.#table} WHERE LOWER(email) = LOWER(?)`, [employee.email], (err, row) => {
                if (err) {
                    return reject(err);
                }
                if (row) {
                    return reject(new Error('Employee with this email already exists'));
                }
    
                // Insert employee into the database
                const createdAt = new Date().toISOString();
                const updatedAt = createdAt;
                const createdBy = 'System';
                const updatedBy = 'System';
                const isActive = 1;
    
                this.#db.run(
                    `INSERT INTO ${this.#table} (name, email, dob, created_at, created_by, updated_at, updated_by, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [employee.name, employee.email, employee.dob, createdAt, createdBy, updatedAt, updatedBy, isActive],
                    function (err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve({ id: this.lastID, ...employee });
                    }
                );
            });
        });
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