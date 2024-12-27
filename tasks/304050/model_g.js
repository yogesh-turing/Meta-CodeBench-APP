function getNextRecurrences(startDate, frequency, count, onlyWeekDays = false) {
    if (startDate === null || startDate === undefined) {
      throw new Error("startDate cannot be null or undefined");
    }
  
    if (frequency < 0) {
      throw new Error("frequency cannot be negative");
    }
  
    if (count < 0) {
      throw new Error("count cannot be negative");
    }
  
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
      throw new Error("startDate must be a valid Date object");
    }
  
    const recurrences = [];
    let currentDate = new Date(startDate);
  
    for (let i = 0; i < count; i++) {
      if (onlyWeekDays && (currentDate.getDay() === 0 || currentDate.getDay() === 6)) {
        // Skip weekends
        currentDate.setDate(currentDate.getDate() + 1);
        i--; // Decrement the counter to ensure we get the correct number of recurrences
        continue;
      }
  
      recurrences.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + frequency);
    }
  
    return recurrences;
  }

  module.exports = {
    getNextRecurrences
};