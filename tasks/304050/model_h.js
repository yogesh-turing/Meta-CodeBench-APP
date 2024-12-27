/**
 * Returns an array of next recurrences based on the provided start date and frequency.
 * 
 * @param {Date} startDate The start date for calculating recurrences.
 * @param {number} frequency The frequency of recurrences in days.
 * @param {number} count The number of recurrences to generate.
 * @param {boolean} [onlyWeekDays=false] If true, only include weekdays (Monday to Friday) in the recurrences.
 * @returns {Date[]} An array of dates representing the next recurrences.
 * @throws {Error} If startDate is not a valid date, or if frequency or count is negative.
 */
function getNextRecurrences(startDate, frequency, count, onlyWeekDays = false) {
    // Check for invalid input values and throw errors accordingly
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
        throw new Error('Invalid start date');
    }
    if (frequency < 0) {
        throw new Error('Frequency cannot be negative');
    }
    if (count < 0) {
        throw new Error('Count cannot be negative');
    }
  
    const recurrences = [];
    let currentDate = new Date(startDate);
  
    for (let i = 0; i < count; i++) {
        // If onlyWeekDays is true, skip weekends
        if (onlyWeekDays && (currentDate.getDay() === 0 || currentDate.getDay() === 6)) {
            // Adjust the current date to the next weekday
            currentDate.setDate(currentDate.getDate() + (currentDate.getDay() === 0 ? 1 : 2));
        }
  
        recurrences.push(new Date(currentDate));
  
        // Increment the current date by the frequency
        currentDate.setDate(currentDate.getDate() + frequency);
    }
  
    return recurrences;
  }
  
  // // Example usage:
  // const startDate = new Date('2024-03-04'); // Monday
  // const frequency = 3; // Every 3 days
  // const count = 5;
  
  // // Get recurrences without considering weekdays
  // const recurrences = getNextRecurrences(startDate, frequency, count);
  // // Output: [2024-03-04, 2024-03-07, 2024-03-10, 2024-03-13, 2024-03-16]
  
  // // Get recurrences considering only weekdays
  // const weekdayRecurrences = getNextRecurrences(startDate, frequency, count, true);
  // // Output: [2024-03-04, 2024-03-07, 2024-03-11, 2024-03-14, 2024-03-18]
  
  module.exports = {
    getNextRecurrences
  };