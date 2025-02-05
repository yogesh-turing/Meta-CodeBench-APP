
const { Event, EventScheduler } = require('./incorrect');

describe('EventScheduler Tests', () => {
    let scheduler;

    beforeAll(() => {
        scheduler = new EventScheduler();
    });

    test('basic test', () => {
        const events = [
            new Event(1, 3, 5),
            new Event(2, 5, 6),
            new Event(4, 6, 5),
            new Event(6, 7, 4)
        ];
        expect(EventScheduler.maxPopularityScore(events)).toBe(14);
    });

    test('non-overlapping events', () => {
        const events = [
            new Event(1, 2, 3),
            new Event(3, 4, 5),
            new Event(5, 6, 7)
        ];
        expect(EventScheduler.maxPopularityScore(events)).toBe(15);
    });

    test('all overlapping events', () => {
        const events = [
            new Event(1, 4, 8),
            new Event(2, 5, 10),
            new Event(3, 6, 7)
        ];
        expect(EventScheduler.maxPopularityScore(events)).toBe(10);
    });

    test('single event', () => {
        const events = [
            new Event(1, 10, 20)
        ];
        expect(EventScheduler.maxPopularityScore(events)).toBe(20);
    });

    test('all events with same start and end time', () => {
        const events = [
            new Event(1, 4, 8),
            new Event(1, 4, 10),
            new Event(1, 4, 17)
        ];
        expect(EventScheduler.maxPopularityScore(events)).toBe(17);
    });

    test('no events', () => {
        const events = [];
        expect(EventScheduler.maxPopularityScore(events)).toBe(0);
    });

    test('null events', () => {
        const events = null;
        expect(EventScheduler.maxPopularityScore(events)).toBe(0);
    });

    test('negative start time', () => {
        const events = [
            new Event(2, 4, 8),
            new Event(1, 3, 10),
            new Event(-1, 4, 17)
        ];
        expect(EventScheduler.maxPopularityScore(events)).toBe(-1);
    });

    test('negative end time', () => {
        const events = [
            new Event(2, -4, 8),
            new Event(1, 3, 10),
            new Event(1, 4, 17)
        ];
        expect(EventScheduler.maxPopularityScore(events)).toBe(-1);
    });

    test('negative popularity', () => {
        const events = [
            new Event(2, 4, 8),
            new Event(1, 3, -10),
            new Event(1, 4, 17)
        ];
        expect(EventScheduler.maxPopularityScore(events)).toBe(-1);
    });

    test('start time more than end time', () => {
        const events = [
            new Event(5, 4, 8),
            new Event(2, 6, -10),
            new Event(1, 4, 17)
        ];
        expect(EventScheduler.maxPopularityScore(events)).toBe(-1);
    });

    test('zero popularity events', () => {
        const events = [
            new Event(3, 4, 0),
            new Event(2, 6, 0),
            new Event(1, 4, 0)
        ];
        expect(EventScheduler.maxPopularityScore(events)).toBe(0);
    });
});
