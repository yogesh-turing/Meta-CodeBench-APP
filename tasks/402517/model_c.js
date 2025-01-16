function getNextRecurrences(startDate, frequency, count, onlyWeekDays = false) {
    // Input validation
    if (startDate == null || frequency == null || count == null) {
        throw new Error("startDate, frequency, and count must be provided");
    }
    
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
        throw new Error("Invalid startDate");
    }
    
    if (typeof frequency !== 'number' || frequency <= 0) {
        throw new Error("frequency must be a positive number");
    }
    
    if (typeof count !== 'number' || count <= 0) {
        throw new Error("count must be a positive number");
    }
  
    const recurrences = [];
    let currentDate = new Date(start);
  
    function isWeekday(date) {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    }
  
    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
  
    while (recurrences.length < count) {
        if (!onlyWeekDays || isWeekday(currentDate)) {
            recurrences.push(new Date(currentDate));
        }
  
        if (onlyWeekDays) {
            do {
                currentDate = addDays(currentDate, 1);
            } while (!isWeekday(currentDate));
            
            const daysToAdd = frequency - 1;
            for (let i = 0; i < daysToAdd; i++) {
                currentDate = addDays(currentDate, 1);
                if (!isWeekday(currentDate)) {
                    i--; // Don't count weekend days
                }
            }
        } else {
            currentDate = addDays(currentDate, frequency);
        }
    }
  
    return recurrences;
  }
  
  module.exports = {
    getNextRecurrences
  };