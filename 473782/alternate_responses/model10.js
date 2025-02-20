class WarehouseRobot {
    constructor(rows, cols) {
        this.grid = Array.from({ length: rows }, () => Array(cols).fill(0));
        this.position = { x: 0, y: 0 };
        this.hasPackage = false;
        this.packageLocations = [];
        this.dropOffLocations = [];
        this.obstacles = new Set();
    }

    move(direction) {
        const { x, y } = this.position;
        let newX = x;
        let newY = y;

        switch (direction) {
            case "up":
                newY -= 1;
                break;
            case "down":
                newY += 1;
                break;
            case "left":
                newX -= 1;
                break;
            case "right":
                newX += 1;
                break;
            default:
                throw new Error("Invalid direction");
        }

        if (this.isValidPosition(newX, newY)) {
            this.position = { x: newX, y: newY };
        } else {
            throw new Error("Cannot move in that direction");
        }
    }

    getPosition() {
        return this.position;
    }

    setObstacles(obstacleList) {
        obstacleList.forEach(([x, y]) => {
            this.obstacles.add(`${x},${y}`);
        });
    }

    pickupPackage() {
        if (this.packageLocations.includes(`${this.position.x},${this.position.y}`)) {
            this.hasPackage = true;
            console.log("Package picked up!");
        } else {
            throw new Error("No package at this location");
        }
    }

    deliverPackage() {
        if (this.dropOffLocations.includes(`${this.position.x},${this.position.y}`) && this.hasPackage) {
            this.hasPackage = false;
            console.log("Package delivered!");
        } else {
            throw new Error("Cannot deliver package at this location");
        }
    }

    findPath(destination) {
        const queue = [[this.position]];
        const visited = new Set();

        while (queue.length > 0) {
            const path = queue.shift();
            const { x, y } = path[path.length - 1];

            if (x === destination[0] && y === destination[1]) {
                console.log(`Shortest path found: ${path.map(({ x, y }) => `[${x}, ${y}]`).join(" -> ")}`);
                return path;
            }

            if (visited.has(`${x},${y}`)) {
                continue;
            }

            visited.add(`${x},${y}`);

            const directions = ["up", "down", "left", "right"];
            directions.forEach((direction) => {
                const { x: newX, y: newY } = this.getNewPosition(x, y, direction);
                if (this.isValidPosition(newX, newY)) {
                    queue.push([...path, { x: newX, y: newY }]);
                }
            });
        }

        throw new Error("No valid path found");
    }

    isValidPosition(x, y) {
        if (x < 0 || y < 0 || x >= this.grid[0].length || y >= this.grid.length) {
            return false;
        }

        if (this.obstacles.has(`${x},${y}`)) {
            return false;
        }

        return true;
    }

    getNewPosition(x, y, direction) {
        let newX = x;
        let newY = y;

        switch (direction) {
            case "up":
                newY -= 1;
                break;
            case "down":
                newY += 1;
                break;
            case "left":
                newX -= 1;
                break;
            case "right":
                newX += 1;
                break;
            default:
                throw new Error("Invalid direction");
        }

        return { x: newX, y: newY };
    }
}

module.exports = { WarehouseRobot };