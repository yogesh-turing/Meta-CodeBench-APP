class EnhancedAlarmSystem {
  constructor() {
      this.alarms = new Map();
      this.nextAlarmId = 1;
  }

  addAlarm(config) {
      if (!config || typeof config !== 'object') {
          throw new Error('Alarm configuration must be an object');
      }

      const { time, label = '', priority = 'normal', recurrence = [] } = config;

      if (!(time instanceof Date)) {
          throw new Error('Time must be a valid Date object');
      }

      if (!['low', 'normal', 'high', 'critical'].includes(priority)) {
          throw new Error('Invalid priority level');
      }

      if (!Array.isArray(recurrence)) {
          throw new Error('Recurrence must be an array of strings');
      }

      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      if (recurrence.length > 0 && recurrence.some(day => !daysOfWeek.includes(day))) {
          throw new Error('Invalid day of week in recurrence');
      }

      const now = new Date();
      if (recurrence.length === 0 && time < now) {
          throw new Error('Cannot set alarm for past time');
      }

      const alarmId = this.nextAlarmId++;
      this.alarms.set(alarmId, {
          time,
          label: String(label),
          isActive: true,
          priority,
          snoozeCount: 0,
          recurrence
      });

      return alarmId;
  }

  removeAlarm(alarmId) {
      if (!this.alarms.has(alarmId)) {
          throw new Error('Alarm not found');
      }
      this.alarms.delete(alarmId);
  }

  getAlarm(alarmId) {
      const alarm = this.alarms.get(alarmId);
      if (!alarm) {
          throw new Error('Alarm not found');
      }
      return { ...alarm, id: alarmId };
  }

  toggleAlarm(alarmId) {
      const alarm = this.alarms.get(alarmId);
      if (!alarm) {
          throw new Error('Alarm not found');
      }
      alarm.isActive = !alarm.isActive;
      return alarm.isActive;
  }

  getActiveAlarms() {
      const now = new Date();
      const activeAlarms = [];

      for (const [id, alarm] of this.alarms) {
          if (alarm.isActive) {
              if (alarm.recurrence.length > 0) {
                  const today = daysOfWeek[now.getDay()];
                  if (alarm.recurrence.includes(today) && now.getHours() === alarm.time.getHours() && now.getMinutes() === alarm.time.getMinutes()) {
                      activeAlarms.push({
                          id,
                          ...alarm
                      });
                  }
              } else if (alarm.time <= now) {
                  activeAlarms.push({
                      id,
                      ...alarm
                  });
              }
          }
      }

      return activeAlarms.sort((a, b) => {
          const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }

  snoozeAlarm(alarmId, minutes) {
      if (!Number.isInteger(minutes) || minutes <= 0) {
          throw new Error('Snooze minutes must be a positive integer');
      }

      const alarm = this.alarms.get(alarmId);
      if (!alarm) {
          throw new Error('Alarm not found');
      }

      const newTime = new Date(alarm.time.getTime() + minutes * 60000);
      alarm.time = newTime;
      alarm.snoozeCount++;
      return newTime;
  }
}

module.exports = {EnhancedAlarmSystem};