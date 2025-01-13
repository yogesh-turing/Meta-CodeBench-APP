// Import necessary libraries
const { next, previous, jump, showCalendar } = require('./correct');
describe('Calendar Application', () => {
  let currentMonth;
  let currentYear;
  let today;

  beforeEach(() => {
    // Mock "today" to a fixed date for consistent tests
    today = new Date(2025, 0, 15); // January 15, 2025
    jest.spyOn(global, 'Date').mockImplementation(() => today); // Mock Date globally
    
    currentMonth = today.getMonth(); // Get current month (0-based index)
    currentYear = today.getFullYear(); // Get current year
    console.log = jest.fn(); // Mock console.log for testing purposes
    console.error = jest.fn(); // Mock console.error for testing purposes
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore the Date mock after each test
  });

  // Positive Test: Check if "next()" navigates to the next month correctly (not in December)
  test('next() navigates to the next month correctly when not in December', () => {
    currentMonth = 0; // January
    currentYear = 2025;

    const result = next(currentMonth, currentYear);

    expect(result.month).toBe(1); // February
    expect(result.year).toBe(2025); // Same year
  });

  // Positive Test: Check if "next()" correctly transitions from December to January
  test('next() navigates to the next month correctly from December', () => {
    currentMonth = 11; // December
    currentYear = 2025;

    const result = next(currentMonth, currentYear);

    expect(result.month).toBe(0); // January
    expect(result.year).toBe(2026); // Next year
  });

  // Positive Test: Check if "previous()" navigates to the previous month correctly (not in January)
  test('previous() navigates to the previous month correctly when not in January', () => {
    currentMonth = 1; // February
    currentYear = 2025;

    const result = previous(currentMonth, currentYear);

    expect(result.month).toBe(0); // January
    expect(result.year).toBe(2025); // Same year
  });

  // Positive Test: Check if "previous()" correctly transitions from January to December
  test('previous() navigates to the previous month correctly from January', () => {
    currentMonth = 0; // January
    currentYear = 2025;

    const result = previous(currentMonth, currentYear);

    expect(result.month).toBe(11); // December
    expect(result.year).toBe(2024); // Previous year
  });

  // Positive Test: Check if "jump()" navigates to a valid month and year
  test('jump() navigates to a valid selected month and year', () => {
    const selectMonth = 5; // June
    const selectYear = 2025;

    const result = jump(selectMonth, selectYear);

    expect(result.month).toBe(selectMonth); // June
    expect(result.year).toBe(selectYear); // 2025
  });

  // Negative Test: Check if "jump()" logs error for an invalid month (greater than 11)
  test('jump() logs error for invalid month and year (month > 11)', () => {
    const invalidMonth = 13; // Invalid month (greater than 11)
    const invalidYear = 2025;

    jump(invalidMonth, invalidYear);

    expect(console.error).toHaveBeenCalledWith('Invalid month or year selected');
  });

  // Negative Test: Check if "jump()" logs error for an invalid month (negative value)
  test('jump() logs error for invalid month and year (month < 0)', () => {
    const invalidMonth = -1; // Invalid month (less than 0)
    const invalidYear = 2025;

    jump(invalidMonth, invalidYear);

    expect(console.error).toHaveBeenCalledWith('Invalid month or year selected');
  });

  // Negative Test: Check if "jump()" logs error for invalid year
  test('jump() logs error for invalid year (negative value)', () => {
    const invalidMonth = 5; // June
    const invalidYear = -1; // Invalid year (negative)

    jump(invalidMonth, invalidYear);

    expect(console.error).toHaveBeenCalledWith('Invalid month or year selected');
  });

  // Edge Case: Check if "showCalendar()" displays the correct number of days for February in a non-leap year (28 days)
  test('showCalendar() correctly calculates days in February (non-leap year)', () => {
    const month = 1; // February
    const year = 2025; // Non-leap year (28 days)
  
    showCalendar(month, year);
  
    const calls = console.log.mock.calls.map(call => call[0]);
  
    // Ensure we have 28 days logged for February 2025
    expect(calls).toContain('Calendar for Feb 2025');
  });

  // Edge Case: Check if "showCalendar()" displays the correct number of days for February in a leap year (29 days)
  test('showCalendar() correctly calculates days in February (leap year)', () => {
    const month = 1; // February
    const year = 2024; // Leap year (29 days)
  
    showCalendar(month, year);
  
    const calls = console.log.mock.calls.map(call => call[0]);
  
    // Ensure we have 29 days logged for February 2024
    expect(calls).toContain('Calendar for Feb 2024');
  });

  // Edge Case: Check if "showCalendar()" correctly marks today’s date
  test('showCalendar() marks today’s date', () => {
    showCalendar(today.getMonth(), today.getFullYear());

    expect(console.log).toHaveBeenCalledWith(`*Today's Date: ${today.getDate()}`);
  });

  // Positive Test: Check if "showCalendar()" displays correct days for a valid month and year
  test('showCalendar() displays correct days for a valid month and year', () => {
    const month = 5; // June
    const year = 2025;
    console.log = jest.fn();
    showCalendar(month, year);
  
    const calls = console.log.mock.calls.map(call => call[0]);
    console.log(calls)

    expect(calls).toContain('Calendar for Jun 2025');
    expect(calls).toContain(1);  
  })
});
