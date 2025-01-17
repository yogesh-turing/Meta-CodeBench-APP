class EnhancedAlarmSystem {
    constructor() {
        this.alarms = new Map();
        this.nextAlarmId = 1;
        this.validDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    }

    addAlarm(config) {
        if (!config || typeof config !== 'object') {
            throw new Error('Alarm configuration must be an object');
        }

        const { time, label = '', priority = 'normal', recurrence } = config;

        if (!(time instanceof Date)) {
            throw new Error('Time must be a valid Date object');
        }

        if (!['low', 'normal', 'high', 'critical'].includes(priority)) {
            throw new Error('Invalid priority level');
        }

        if (recurrence !== undefined) {
            if (!Array.isArray(recurrence) || recurrence.length === 0) {
                throw new Error('Recurrence must be an array of days');
            }
            
            for (const day of recurrence) {
                if (!this.validDays.includes(day)) {
                    throw new Error(`Invalid day in recurrence: ${day}`);
                }
            }
        } else {
            // Only check for past time if it's not a recurring alarm
            const now = new Date();
            if (time < now) {
                throw new Error('Cannot set non-recurring alarm for past time');
            }
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

    isAlarmTimeMatching(alarm, currentTime) {
        return alarm.time.getHours() === currentTime.getHours() &&
               alarm.time.getMinutes() === currentTime.getMinutes();
    }

    shouldAlarmBeActive(alarm, currentTime) {
        if (!alarm.recurrence) {
            return alarm.time <= currentTime;
        }

        const currentDay = this.validDays[currentTime.getDay()];
        return alarm.recurrence.includes(currentDay) && this.isAlarmTimeMatching(alarm, currentTime);
    }

    getActiveAlarms() {
        const now = new Date();
        const activeAlarms = [];

        for (const [id, alarm] of this.alarms) {
            if (alarm.isActive && this.shouldAlarmBeActive(alarm, now)) {
                activeAlarms.push({
                    id,
                    ...alarm
                });
            }
        }

        return activeAlarms.sort((a, b) => {
            const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }

    getNextOccurrence(alarm) {
        if (!alarm.recurrence) {
            return alarm.time;
        }

        const now = new Date();
        const currentDay = now.getDay();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const alarmTime = alarm.time.getHours() * 60 + alarm.time.getMinutes();

        const nextOccurrence = new Date(now);
        nextOccurrence.setHours(alarm.time.getHours(), alarm.time.getMinutes(), 0, 0);

        const orderedDays = alarm.recurrence.map(day => this.validDays.indexOf(day))
            .sort((a, b) => a - b);

        for (let i = 0; i <= 7; i++) {
            const checkDay = (currentDay + i) % 7;
            if (orderedDays.includes(checkDay)) {
                if (i === 0 && currentTime > alarmTime) {
                    continue;
                }
                nextOccurrence.setDate(now.getDate() + i);
                return nextOccurrence;
            }
        }

        // If we get here, set to the first day in the next week
        nextOccurrence.setDate(now.getDate() + (7 - currentDay) + orderedDays[0]);
        return nextOccurrence;
    }

    snoozeAlarm(alarmId, minutes) {
        if (!Number.isInteger(minutes) || minutes <= 0) {
            throw new Error('Snooze minutes must be a positive integer');
        }

        const alarm = this.alarms.get(alarmId);
        if (!alarm) {
            throw new Error('Alarm not found');
        }

        if (alarm.recurrence) {
            const nextOccurrence = this.getNextOccurrence(alarm);
            const newTime = new Date(nextOccurrence.getTime() + minutes * 60000);
            alarm.time = newTime;
        } else {
            const newTime = new Date(alarm.time.getTime() + minutes * 60000);
            alarm.time = newTime;
        }

        alarm.snoozeCount++;
        return alarm.time;
    }
}

module.exports = { EnhancedAlarmSystem };