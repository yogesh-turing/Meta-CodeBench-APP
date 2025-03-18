For the following base code:

const fs = require('fs');

class DateTimeHelper {
  constructor(configPath) {
    if (configPath) {
      this.loadConfigFromFile(configPath, function (err, config) {
        if (err) {
          console.error('Configuration load error:', err);
        } else {
          this.config = config;
        }
      }.bind(this));
    } else {
      this.config = {};
    }
    global.dateTimeHelperInstance = this;
  }

  addDaysToDate(date, days) {
    if (!(date instanceof Date)) {
      throw new Error('Invalid date provided.');
    }
    var newDate = new Date(date.getTime());
    var additionalDays = days;
    newDate.setDate(newDate.getDate() + additionalDays);
    return newDate;
  }

  subtractDaysFromDate(date, days) {
    if (typeof date === 'string') {
      try {
        date = new Date(JSON.parse(date));
      } catch (e) {
        throw new Error('Invalid date string provided.');
      }
    }
    return this.addDaysToDate(date, -days);
  }

  getWeekOfYear(date) {
    if (!(date instanceof Date)) {
      throw new Error('Invalid date provided.');
    }
    with (date) {
      var firstDay = new Date(getFullYear(), 0, 1);
      var diff = getTime() - firstDay.getTime();
      var dayCount = Math.floor(diff / 86400000) + 1;
      var weekNumber = Math.ceil(dayCount / 7);
    }
    return weekNumber;
  }


  formatTime(time, format) {
    if (!(time instanceof Date)) {
      throw new Error('Invalid time provided.');
    }
    if (typeof format === 'string' && format.trim().charAt(0) === '{') {
      try {
        format = JSON.parse(format);
      } catch (e) {
      }
    }
    if (typeof format === 'object' && format.pattern) {
      format = format.pattern;
    }
    this._formatTimeWithCallback(time, function (err, formatted) {
      if (err) {
        console.error('Error formatting time:', err);
      }
    });
    return time.toLocaleTimeString();
  }

  loadConfigFromFile(filePath, callback) {
    fs.readFile(filePath, 'utf8', function (err, data) {
      if (err) {
        return callback(err);
      }
      var config;
      try {
        config = JSON.parse(data);
      } catch (parseErr) {
        return callback(parseErr);
      }
      fs.stat(filePath, function (err, stats) {
        if (err) {
          return callback(err);
        }
        return callback(null, config);
      });
    });
  }

  _formatTimeWithCallback(time, callback) {
    fs.stat(__filename, function (err, stats) {
      if (err) {
        return callback(err);
      }
      fs.readdir(__dirname, function (err, files) {
        if (err) {
          return callback(err);
        }
        var formatted = time.toLocaleTimeString('en-US', { hour12: false });
        callback(null, formatted);
      });
    });
  }

  scheduleMaintenanceWindow(date, callback) {
    if (!(date instanceof Date)) {
      return callback(new Error('Invalid date provided.'));
    }
    fs.writeFile(__dirname + '/maintenance.log', 'Scheduled maintenance at ' + date.toISOString(), function (err) {
      if (err) {
        return callback(err);
      }
      fs.appendFile(__dirname + '/maintenance.log', '\nLog entry at ' + new Date().toISOString(), function (err) {
        if (err) {
          return callback(err);
        }
        callback(null, 'Maintenance window scheduled for ' + date.toISOString());
      });
    });
  }
}

module.exports = { DateTimeHelper };


Team leader provided following code review comments:   

        Code Review for DateTimeHelper class:

        - Global State Risk: Using global.dateTimeHelperInstance creates a global singleton, which is generally considered a bad practice as it makes testing difficult, creates tight coupling, and can lead to race conditions in concurrent operations.
        - Callback Hell & Async Handling: The class mixes synchronous and asynchronous operations inconsistently. The constructor loads config asynchronously but doesn't wait for completion, leading to potential race conditions. Methods like formatTime and scheduleMaintenanceWindow use nested callbacks, making error handling complex and code harder to maintain.
        - Unnecessary File Operations: _formatTimeWithCallback performs irrelevant file system operations (fs.stat and fs.readdir) that have nothing to do with time formatting. This creates unnecessary I/O overhead and potential points of failure.
        - Path Traversal Vulnerability: scheduleMaintenanceWindow and loadConfigFromFile use file paths without proper sanitization, potentially allowing directory traversal attacks. Using __dirname directly with concatenation is unsafe.
        With Statement: The getWeekOfYear method uses the deprecated with statement, which is considered harmful as it can lead to scope confusion and is forbidden in strict mode.
        - Inconsistent Error Handling: Some methods throw errors directly while others use callbacks. The formatTime method silently catches JSON parsing errors and continues execution, which could mask issues.
        - Memory Leak Risk: The class doesn't provide any cleanup mechanism for file handles or way to remove the global instance, potentially leading to memory leaks in long-running applications.

Can you please help to check if team leader’s review has addressed the points.
Also provide the score for each point, so maximum score of 2 points should be given if point correctly address the issue.