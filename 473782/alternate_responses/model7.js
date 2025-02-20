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
        let x = this.position.x;
        let y = this.position.y;

        switch (direction) {
            case "up":
                y--;
                break;
            case "down":
                y++;
                break;
            case "left":
                x--;
                break;
            case "right":
                x++;
                break;
            default:
                throw new Error("Invalid direction");
        }

        if (x < 0 || x >= this.grid[0].length || y < 0 || y >= this.grid.length) {
            throw new Error("Out of bounds");
        }

        if (this.obstacles.has(`${x},${y}`)) {
            throw new Error("Cannot move through obstacle");
        }

        this.position = { x, y };
    }

    getPosition() {
        return this.position;
    }

    setObstacles(obstacleList) {
        for (const [x, y] of obstacleList) {
            this.obstacles.add(`${x},${y}`);
        }
    }

    pickupPackage() {
        if (this.packageLocations.includes(`${this.position.x},${this.position.y}`)) {
            this.hasPackage = true;
            console.log("Package picked up!");
        } else {
            console.log("No package to pick up at this location");
        }
    }

    deliverPackage() {
        if (this.hasPackage && this.dropOffLocations.includes(`${this.position.x},${this.position.y}`)) {
            this.hasPackage = false;
            console.log("Package delivered!");
        } else {
            console.log("Cannot deliver package at this location");
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

            for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < this.grid[0].length && ny >= 0 && ny < this.grid.length && !this.obstacles.has(`${nx},${ny}`)) {
                    queue.push([...path, { x: nx, y: ny }]);
                }
            }
        }

        console.log("No valid path found");
        return null;
    }
}

module.exports = { WarehouseRobot };