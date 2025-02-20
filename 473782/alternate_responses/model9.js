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
        // Define possible movements
        const movements = {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 },
        };

        // Check if movement is valid
        if (!movements[direction]) {
            throw new Error(`Invalid direction: ${direction}`);
        }

        // Calculate new position
        const newX = this.position.x + movements[direction].x;
        const newY = this.position.y + movements[direction].y;

        // Check if new position is within bounds and not an obstacle
        if (newX < 0 || newX >= this.grid[0].length || newY < 0 || newY >= this.grid.length) {
            throw new Error("Movement would result in out-of-bounds error");
        }
        if (this.obstacles.has(`${newX},${newY}`)) {
            throw new Error("Movement would result in collision with obstacle");
        }

        // Update position
        this.position = { x: newX, y: newY };
    }

    getPosition() {
        return this.position;
    }

    setObstacles(obstacleList) {
        obstacleList.forEach((obstacle) => {
            this.obstacles.add(`${obstacle[0]},${obstacle[1]}`);
        });
    }

    pickupPackage() {
        // Check if robot is at a package location
        if (this.packageLocations.some((location) => location[0] === this.position.x && location[1] === this.position.y)) {
            this.hasPackage = true;
            console.log("Package picked up!");
        } else {
            console.log("No package to pick up at this location");
        }
    }

    deliverPackage() {
        // Check if robot has a package and is at a drop-off location
        if (this.hasPackage && this.dropOffLocations.some((location) => location[0] === this.position.x && location[1] === this.position.y)) {
            this.hasPackage = false;
            console.log("Package delivered!");
        } else {
            console.log("Cannot deliver package at this location");
        }
    }

    findPath(destination) {
        // Implement BFS algorithm to find shortest path
        const queue = [[this.position]];
        const visited = new Set();

        while (queue.length > 0) {
            const path = queue.shift();
            const node = path[path.length - 1];

            if (node.x === destination[0] && node.y === destination[1]) {
                console.log(`Shortest path found: ${path.map((node) => `[${node.x}, ${node.y}]`).join(" -> ")}`);
                return path;
            }

            // Explore neighbors
            const neighbors = [
                { x: node.x - 1, y: node.y },
                { x: node.x + 1, y: node.y },
                { x: node.x, y: node.y - 1 },
                { x: node.x, y: node.y + 1 },
            ];

            neighbors.forEach((neighbor) => {
                if (
                    neighbor.x >= 0 &&
                    neighbor.x < this.grid[0].length &&
                    neighbor.y >= 0 &&
                    neighbor.y < this.grid.length &&
                    !visited.has(`${neighbor.x},${neighbor.y}`) &&
                    !this.obstacles.has(`${neighbor.x},${neighbor.y}`)
                ) {
                    visited.add(`${neighbor.x},${neighbor.y}`);
                    queue.push([...path, neighbor]);
                }
            });
        }

        console.log("No valid path found");
        return null;
    }
}

module.exports = { WarehouseRobot };