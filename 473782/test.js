const { WarehouseRobot } = require("./solution");

describe("Warehouse Robot Navigator - Additional Tests", () => {
    let robot;

    beforeEach(() => {
        robot = new WarehouseRobot(5, 5);
        robot.setObstacles([[2, 2], [3, 3]]);
    });

    test("should not move outside grid boundaries", () => {
        robot.move("left");
        expect(robot.getPosition()).toEqual({ x: 0, y: 0 });

        robot.move("up");
        expect(robot.getPosition()).toEqual({ x: 0, y: 0 });

        robot.move("right");
        robot.move("right");
        robot.move("right");
        robot.move("right");
        expect(robot.getPosition()).toEqual({ x: 4, y: 0 });

        robot.move("down");
        robot.move("down");
        robot.move("down");
        robot.move("down");
        expect(robot.getPosition()).toEqual({ x: 4, y: 4 });
    });

    test("should throw error when picking up package without package at location", () => {
        robot.setPackageLocations([[1, 1]]);
        expect(() => robot.pickupPackage()).toThrow('No package at current location');
    });

    test("should throw error when delivering package without having a package", () => {
        robot.setDropOffLocations([[1, 1]]);
        expect(() => robot.deliverPackage()).toThrow('No package to deliver');
    });

    test("should throw error when moving in invalid direction", () => {
        expect(() => robot.move("invalid")).toThrow('Invalid direction');
    });

    test("should handle multiple package locations", () => {
        robot.setPackageLocations([[1, 1], [3, 3]]);
        robot.move("right");
        robot.move("down");
        robot.pickupPackage();
        expect(robot.hasPackage).toBe(true);

        robot.move("right");
        robot.move("down");
        expect(() => robot.pickupPackage()).toThrow('Robot already has a package');
    });

    test("should handle multiple drop-off locations", () => {
        robot.setPackageLocations([[1, 1]]);
        robot.setDropOffLocations([[4, 4], [0, 0]]);

        robot.move("right");
        robot.move("down");
        robot.pickupPackage();

        robot.move("left");
        robot.move("up");
        robot.deliverPackage();
        expect(robot.hasPackage).toBe(false);
        expect(robot.getPosition()).toEqual({ x: 0, y: 0 });
    });

    test("should not allow setting invalid package locations", () => {
        expect(() => robot.setPackageLocations([[5, 5]])).toThrow();
        expect(() => robot.setPackageLocations([[-1, -1]])).toThrow();
    });

    test("should not allow setting invalid drop-off locations", () => {
        expect(() => robot.setDropOffLocations([[5, 5]])).toThrow();
        expect(() => robot.setDropOffLocations([[-1, -1]])).toThrow();
    });

    test("should handle empty obstacle list", () => {
        robot.setObstacles([]);
        robot.move("right");
        robot.move("down");
        expect(robot.getPosition()).toEqual({ x: 1, y: 1 });
    });

    test("should handle no package locations", () => {
        robot.setPackageLocations([]);
        expect(() => robot.pickupPackage()).toThrow('No package at current location');
    });

    test("should handle no drop-off locations", () => {
        robot.setDropOffLocations([]);
        robot.setPackageLocations([[1, 1]]);
        robot.move("right");
        robot.move("down");
        robot.pickupPackage();
        expect(() => robot.deliverPackage()).toThrow('Not at a valid drop-off location');
    });

    test("should handle pathfinding with no obstacles", () => {
        robot.setObstacles([]);
        const path = robot.findPath([4, 4]);
        expect(path.length).toBeGreaterThan(0);
    });

    test("should handle pathfinding when destination is start position", () => {
        const path = robot.findPath([0, 0]);
        expect(path.length).toBe(0);
    });

    test("should handle pathfinding when destination is unreachable", () => {
        robot.setObstacles([[1, 0], [0, 1], [1, 1]]);
        expect(() => robot.findPath([4, 4])).toThrow("No valid path found");
    });
});