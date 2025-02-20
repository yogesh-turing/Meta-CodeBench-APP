const { EventScheduler } = require('./solution.js');

describe('EventScheduler', () => {
  let scheduler;

  beforeEach(() => {
    scheduler = new EventScheduler();
  });

  test('1. Should add a non-overlapping event successfully', () => {
    expect(
      scheduler.addEvent(1700000000000, 1700003600000, 'Morning Meeting')
    ).toBe(true);
  });

  test('2. Should retrieve events sorted by start time', () => {
    scheduler.addEvent(1700000000000, 1700003600000, 'Morning Meeting');
    scheduler.addEvent(1700007200000, 1700010800000, 'Project Discussion');

    expect(scheduler.getSchedule()).toEqual([
      { title: 'Morning Meeting', start: 1700000000000, end: 1700003600000 },
      { title: 'Project Discussion', start: 1700007200000, end: 1700010800000 },
    ]);
  });

  test('3. Should reject an overlapping event', () => {
    scheduler.addEvent(1700000000000, 1700003600000, 'Morning Meeting');
    expect(
      scheduler.addEvent(1700001800000, 1700005400000, 'Overlapping Event')
    ).toBe(false);
  });

  test('4. Should remove an existing event', () => {
    scheduler.addEvent(1700000000000, 1700003600000, 'Morning Meeting');
    scheduler.removeEvent('Morning Meeting');
    expect(scheduler.getSchedule()).toEqual([]);
  });

  test('5. Should not change schedule when removing a non-existent event', () => {
    scheduler.addEvent(1700007200000, 1700010800000, 'Project Discussion');
    scheduler.removeEvent('Nonexistent Event');
    expect(scheduler.getSchedule()).toEqual([
      { title: 'Project Discussion', start: 1700007200000, end: 1700010800000 },
    ]);
  });

  test('6. Should allow an event that starts when another ends', () => {
    scheduler.addEvent(1700010800000, 1700014400000, 'First Event');
    expect(scheduler.addEvent(1700014400000, 1700018000000, 'Next Event')).toBe(
      true
    );
  });

  test('7. Should reject an event where start time is after end time', () => {
    expect(
      scheduler.addEvent(1700025000000, 1700024000000, 'Invalid Event')
    ).toBe(false);
  });

  test('8. Should return an empty schedule when no events are added', () => {
    expect(scheduler.getSchedule()).toEqual([]);
  });

  test('9. Should keep events sorted even if added in random order', () => {
    scheduler.addEvent(1700030000000, 1700033600000, 'Evening Talk');
    scheduler.addEvent(1700020000000, 1700023600000, 'Afternoon Session');

    const schedule = scheduler.getSchedule();
    expect(schedule[0].title).toBe('Afternoon Session');
    expect(schedule[1].title).toBe('Evening Talk');
  });

  test('10. Should reject an event that has the same start time but different end time as an existing event', () => {
    scheduler.addEvent(1700020000000, 1700023600000, 'Afternoon Session');
    expect(
      scheduler.addEvent(1700020000000, 1700021800000, 'Conflicting Event')
    ).toBe(false);
  });

  test('11. Should have an empty schedule after all events are removed', () => {
    scheduler.addEvent(1700036000000, 1700039600000, 'Talk');
    scheduler.addEvent(1700040000000, 1700043600000, 'Meeting');
    scheduler.removeEvent('Talk');
    scheduler.removeEvent('Meeting');

    expect(scheduler.getSchedule()).toEqual([]);
  });

  test('12. Should allow duplicate titles if the timestamps are different', () => {
    scheduler.addEvent(1700036000000, 1700039600000, 'Duplicate Title');
    expect(
      scheduler.addEvent(1700040000000, 1700043600000, 'Duplicate Title')
    ).toBe(true);
  });

  test('13. Should reject a small event that overlaps inside a larger event', () => {
    scheduler.addEvent(1700050000000, 1700060000000, 'Large Event');
    expect(
      scheduler.addEvent(1700053000000, 1700057000000, 'Small Overlap Event')
    ).toBe(false);
  });
});