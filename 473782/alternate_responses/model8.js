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
        let newX = this.position.x;
        let newY = this.position.y;

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

        if (newX < 0 || newX >= this.grid[0].length || newY < 0 || newY >= this.grid.length) {
            throw new Error("Out of bounds");
        }

        if (this.obstacles.has(`${newX},${newY}`)) {
            throw new Error("Cannot move through obstacle");
        }

        this.position = { x: newX, y: newY };
    }

    getPosition() {
        return this.position;
    }

    setObstacles(obstacleList) {
        obstacleList.forEach(([x, y]) => this.obstacles.add(`${x},${y}`));
    }

    pickupPackage() {
        if (this.hasPackage) {
            throw new Error("Robot already has a package");
        }

        if (this.packageLocations.some(([x, y]) => x === this.position.x && y === this.position.y)) {
            this.hasPackage = true;
            console.log("Package picked up!");
        } else {
            throw new Error("No package at this location");
        }
    }

    deliverPackage() {
        if (!this.hasPackage) {
            throw new Error("Robot does not have a package");
        }

        if (this.dropOffLocations.some(([x, y]) => x === this.position.x && y === this.position.y)) {
            this.hasPackage = false;
            console.log("Package delivered!");
        } else {
            throw new Error("Not at a drop-off location");
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

            visited.add(`${x},${y}`);

            const directions = [
                { x: x - 1, y },
                { x: x + 1, y },
                { x, y: y - 1 },
                { x, y: y + 1 },
            ];

            directions.forEach((newPosition) => {
                if (
                    newPosition.x >= 0 &&
                    newPosition.x < this.grid[0].length &&
                    newPosition.y >= 0 &&
                    newPosition.y < this.grid.length &&
                    !visited.has(`${newPosition.x},${newPosition.y}`) &&
                    !this.obstacles.has(`${newPosition.x},${newPosition.y}`)
                ) {
                    queue.push([...path, newPosition]);
                }
            });
        }

        throw new Error("No valid path found");
    }
}

module.exports = { WarehouseRobot };