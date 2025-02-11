const { EmployeeInvitation  } = require(process.env.TARGET_FILE);

describe('EmployeeInvitation.maxEmployeesInvited', () => {
    test('Positive case', () => {
        const favorite = [1, 2, 0, 4, 5, 3];
        expect(EmployeeInvitation.maxEmployeesInvited(favorite)).toBe(3);
    });

    test('Single employee', () => {
        const favorite = [0];
        expect(EmployeeInvitation.maxEmployeesInvited(favorite)).toBe(1);
    });

    test('Empty list', () => {
        const favorite = [];
        expect(EmployeeInvitation.maxEmployeesInvited(favorite)).toBe(0);
    });

    test('Circular relationship', () => {
        const favorite = [1, 0];
        expect(EmployeeInvitation.maxEmployeesInvited(favorite)).toBe(2);
    });

    test('Null input', () => {
        expect(() => EmployeeInvitation.maxEmployeesInvited(null)).toThrow();
    });

    test('Multiple cycles', () => {
        const favorite = [1, 2, 0, 4, 5, 3];
        expect(EmployeeInvitation.maxEmployeesInvited(favorite)).toBe(3);
    });

    test('All employees in a cycle', () => {
        const favorite = [1, 2, 3, 4, 5, 0];
        expect(EmployeeInvitation.maxEmployeesInvited(favorite)).toBe(6);
    });

    test('Multiple disconnected cycles', () => {
        const favorite = [1, 0, 3, 2, 5, 4];
        expect(EmployeeInvitation.maxEmployeesInvited(favorite)).toBe(2);
    });

    test('Large input single cycle', () => {
        const favorite = [1, 2, 3, 4, 5, 6, 7, 0];
        expect(EmployeeInvitation.maxEmployeesInvited(favorite)).toBe(8);
    });

    test('Multiple cycles of different sizes', () => {
        const favorite = [1, 2, 0, 4, 5, 4];
        expect(EmployeeInvitation.maxEmployeesInvited(favorite)).toBe(3);
    });
});
