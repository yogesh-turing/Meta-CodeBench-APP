const {EnhancedAlarmSystem} = require('./incorrect');

describe('EnhancedAlarmSystem', () => {
    let alarmSystem;
    let baseTime;
    let RealDate;

    beforeEach(() => {
        alarmSystem = new EnhancedAlarmSystem();
        RealDate = global.Date;
        baseTime = new RealDate('2025-01-09T14:38:20Z');
        
        const MockDate = class extends RealDate {
            constructor(...args) {
                if (args.length === 0) {
                    super(baseTime);
                    return this;
                }
                super(...args);
                return this;
            }
        };
        
        MockDate.now = () => baseTime.getTime();
        global.Date = MockDate;
    });

    afterEach(() => {
        global.Date = RealDate;
    });

    describe('Basic Alarm Operations', () => {
        test('adding and retrieving alarm', () => {
            const futureTime = new Date(baseTime.getTime() + 3600000);
            const alarmId = alarmSystem.addAlarm({
                time: futureTime,
                label: 'Test Alarm',
                priority: 'high'
            });

            const alarm = alarmSystem.getAlarm(alarmId);
            expect(alarm.time).toEqual(futureTime);
            expect(alarm.label).toBe('Test Alarm');
            expect(alarm.priority).toBe('high');
            expect(alarm.isActive).toBe(true);
            expect(alarm.snoozeCount).toBe(0);
        });

        test('rejecting invalid configurations', () => {
            const futureTime = new Date(baseTime.getTime() + 3600000);
            const pastTime = new Date(baseTime.getTime() - 3600000);

            expect(() => alarmSystem.addAlarm(null)).toThrow(Error);
            expect(() => alarmSystem.addAlarm({ time: 'invalid' })).toThrow(Error);
            expect(() => alarmSystem.addAlarm({ time: pastTime })).toThrow(Error);
            expect(() => alarmSystem.addAlarm({ time: futureTime, priority: 'invalid' })).toThrow(Error);
        });

        test('removing alarm', () => {
            const futureTime = new Date(baseTime.getTime() + 3600000);
            const alarmId = alarmSystem.addAlarm({ time: futureTime });

            alarmSystem.removeAlarm(alarmId);
            expect(() => alarmSystem.getAlarm(alarmId)).toThrow(Error);
            expect(() => alarmSystem.removeAlarm(999)).toThrow(Error);
        });

        test('toggling alarm state', () => {
            const futureTime = new Date(baseTime.getTime() + 3600000);
            const alarmId = alarmSystem.addAlarm({ time: futureTime });

            expect(alarmSystem.toggleAlarm(alarmId)).toBe(false);
            expect(alarmSystem.getAlarm(alarmId).isActive).toBe(false);

            expect(alarmSystem.toggleAlarm(alarmId)).toBe(true);
            expect(alarmSystem.getAlarm(alarmId).isActive).toBe(true);

            expect(() => alarmSystem.toggleAlarm(999)).toThrow(Error);
        });
    });

    describe('Active Alarms', () => {
        test('getting active alarms sorted by priority', () => {
            // Mock current time
            const currentTime = new Date(baseTime);
            jest.spyOn(global.Date, 'now').mockImplementation(() => currentTime.getTime());

            // Add alarms in the past (1 hour ago)
            const pastTime = new Date(currentTime.getTime() - 3600000);
            jest.spyOn(global.Date, 'now').mockImplementation(() => pastTime.getTime());

            const priorities = ['normal', 'high', 'critical', 'low'];
            priorities.forEach(priority => {
                alarmSystem.addAlarm({ time: currentTime, priority });
            });

            // Add a future alarm
            const futureTime = new Date(currentTime.getTime() + 3600000);
            alarmSystem.addAlarm({ time: futureTime, priority: 'normal' });

            // Reset time to current
            jest.spyOn(global.Date, 'now').mockImplementation(() => currentTime.getTime());

            const activeAlarms = alarmSystem.getActiveAlarms();
            expect(activeAlarms).toHaveLength(4);
            expect(activeAlarms.map(a => a.priority)).toEqual(['critical', 'high', 'normal', 'low']);
        });

        test('snoozing alarms', () => {
            // Mock current time
            const currentTime = new Date(baseTime);
            jest.spyOn(global.Date, 'now').mockImplementation(() => currentTime.getTime());

            // Add alarm in the past
            const pastTime = new Date(currentTime.getTime() - 3600000);
            jest.spyOn(global.Date, 'now').mockImplementation(() => pastTime.getTime());

            const alarmId = alarmSystem.addAlarm({ time: currentTime });

            // Reset time to current
            jest.spyOn(global.Date, 'now').mockImplementation(() => currentTime.getTime());

            expect(() => alarmSystem.snoozeAlarm(alarmId, 0)).toThrow(Error);
            expect(() => alarmSystem.snoozeAlarm(alarmId, -1)).toThrow(Error);
            expect(() => alarmSystem.snoozeAlarm(999, 5)).toThrow(Error);

            const newTime = alarmSystem.snoozeAlarm(alarmId, 5);
            const alarm = alarmSystem.getAlarm(alarmId);
            expect(newTime).toEqual(alarm.time);
            expect(alarm.snoozeCount).toBe(1);
            expect(alarm.time.getTime()).toBe(currentTime.getTime() + 5 * 60000);
        });
    });

    describe('Recurring Alarms', () => {
        test('adding recurring alarm with valid weekdays', () => {
            const futureTime = new Date(baseTime.getTime() + 3600000);
            const alarmId = alarmSystem.addAlarm({
                time: futureTime,
                label: 'Morning Routine',
                recurrence: ['Monday', 'Wednesday', 'Friday']
            });

            

            const alarm = alarmSystem.getAlarm(alarmId);
            expect(alarm.recurrence.map(day => day.toLowerCase())).toEqual(['monday', 'wednesday', 'friday']);
            expect(alarm.time).toEqual(futureTime);
            expect(alarm.label).toBe('Morning Routine');
        });

        test('rejecting invalid recurrence configurations', () => {
            const futureTime = new Date(baseTime.getTime() + 3600000);

            // Test non-array recurrence
            expect(() => alarmSystem.addAlarm({
                time: futureTime,
                recurrence: 'Tuesday'
            })).toThrow(Error);

            // Test invalid weekday names
            expect(() => alarmSystem.addAlarm({
                time: futureTime,
                recurrence: ['Mon', 'Funday']
            })).toThrow(Error);
        });

        test('allowing past time for recurring alarms', () => {
            const pastTime = new Date(baseTime.getTime() - 3600000);
            const alarmId = alarmSystem.addAlarm({
                time: pastTime,
                recurrence: ['Thursday'] // Today is Thursday
            });

            const alarm = alarmSystem.getAlarm(alarmId);
            expect(alarm.time).toEqual(pastTime);
            expect(alarm.recurrence.map(day => day.toLowerCase())).toEqual(['Thursday'].map(day => day.toLowerCase()));
        });

        test('getting active recurring alarms', () => {
            const currentTime = new Date(baseTime);
            // Set exact hours and minutes to match
            currentTime.setHours(14, 38, 0, 0);
            jest.spyOn(global.Date, 'now').mockImplementation(() => currentTime.getTime());
            
            const today = 'Thursday'; // Based on our baseTime

            // Add a recurring alarm for today at current time
            const activeAlarmId = alarmSystem.addAlarm({
                time: new Date(currentTime),
                label: 'Today Recurring',
                recurrence: [today]
            });

            // Add a recurring alarm for tomorrow
            alarmSystem.addAlarm({
                time: new Date(currentTime),
                label: 'Tomorrow Recurring',
                recurrence: ['Friday']
            });

            // Add a recurring alarm for today but different time
            const laterTime = new Date(currentTime);
            laterTime.setHours(15);
            alarmSystem.addAlarm({
                time: laterTime,
                label: 'Today Later',
                recurrence: [today]
            });

            // Add an inactive recurring alarm for today
            const inactiveAlarmId = alarmSystem.addAlarm({
                time: new Date(currentTime),
                label: 'Inactive Today',
                recurrence: [today]
            });
            alarmSystem.toggleAlarm(inactiveAlarmId); // Make it inactive

            const activeAlarms = alarmSystem.getActiveAlarms();
            expect(activeAlarms.length).toBe(1);
            expect(activeAlarms[0].label).toBe('Today Recurring');
        });

        test('combining recurring and non-recurring alarms', () => {
            // Create a fixed time for testing
            const currentTime = new Date('2025-01-09T14:38:20Z');
            const today = 'Thursday';

            // Add recurring alarm for current time
            jest.spyOn(global.Date, 'now').mockImplementation(() => currentTime.getTime());
            alarmSystem.addAlarm({
                time: new Date(currentTime),
                label: 'Recurring',
                recurrence: [today]
            });

            // Add non-recurring alarm for current time
            const slightlyEarlier = new Date('2025-01-09T14:38:19Z');
            jest.spyOn(global.Date, 'now').mockImplementation(() => slightlyEarlier.getTime());
            alarmSystem.addAlarm({
                time: currentTime,
                label: 'Non-recurring'
            });

            // Check alarms at current time
            jest.spyOn(global.Date, 'now').mockImplementation(() => currentTime.getTime());
            const activeAlarms = alarmSystem.getActiveAlarms();
            expect(activeAlarms.length).toBe(2);
            expect(activeAlarms.map(a => a.label).sort()).toEqual(['Non-recurring', 'Recurring']);
        });

        test('snoozing recurring alarms', () => {
            const currentTime = new Date(baseTime);
            const today = 'Thursday';
            
            const alarmId = alarmSystem.addAlarm({
                time: currentTime,
                label: 'Recurring Alarm',
                recurrence: [today]
            });

            const snoozeMinutes = 10;
            const newTime = alarmSystem.snoozeAlarm(alarmId, snoozeMinutes);
            const alarm = alarmSystem.getAlarm(alarmId);

            expect(newTime.getTime()).toBe(currentTime.getTime() + snoozeMinutes * 60000);
            expect(alarm.recurrence.map(day=>day.toLowerCase())).toEqual([today.toLowerCase()]); // Recurrence should remain unchanged
            expect(alarm.snoozeCount).toBe(1);
        });

        test('handling recurring alarms with different priorities', () => {
            const currentTime = new Date(baseTime);
            const today = 'Thursday';

            // Add recurring alarms with different priorities
            alarmSystem.addAlarm({
                time: currentTime,
                label: 'Normal Recurring',
                priority: 'normal',
                recurrence: [today]
            });

            alarmSystem.addAlarm({
                time: currentTime,
                label: 'High Recurring',
                priority: 'high',
                recurrence: [today]
            });

            const activeAlarms = alarmSystem.getActiveAlarms();
            expect(activeAlarms.length).toBe(2);
            expect(activeAlarms[0].priority).toBe('high');
            expect(activeAlarms[1].priority).toBe('normal');
        });

        test('handling recurring alarms with exact time match', () => {
            const currentTime = new Date(baseTime);
            const today = 'Thursday';
            
            // Set exact hours and minutes
            currentTime.setHours(14, 38, 0, 0);
            const mockNow = jest.spyOn(global.Date, 'now');
            mockNow.mockImplementation(() => currentTime.getTime());

            // Add alarm with exact same time
            alarmSystem.addAlarm({
                time: new Date(currentTime),
                label: 'Exact Time',
                recurrence: [today]
            });

            // Add alarm with different minutes
            const differentTime = new Date(currentTime);
            differentTime.setMinutes(31);
            alarmSystem.addAlarm({
                time: differentTime,
                label: 'Different Time',
                recurrence: [today]
            });

            const activeAlarms = alarmSystem.getActiveAlarms();
            expect(activeAlarms.length).toBe(1);
            expect(activeAlarms[0].label).toBe('Exact Time');
        });
    });
});