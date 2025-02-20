class WarehouseRobot {
    constructor(rows, cols) {
        this.grid = Array.from({ length: rows }, () => Array(cols).fill(0));
        this.position = { x: 0, y: 0 };
        this.hasPackage = false;
        this.packageLocations = [];
        this.dropOffLocations = [];
        this.obstacles = new Set();
        this.rows = rows;
        this.cols = cols;
    }

    move(direction) {
        const newPosition = { ...this.position };
        
        switch (direction.toLowerCase()) {
            case 'up':
                newPosition.y -= 1;
                break;
            case 'down':
                newPosition.y += 1;
                break;
            case 'left':
                newPosition.x -= 1;
                break;
            case 'right':
                newPosition.x += 1;
                break;
            default:
                throw new Error('Invalid direction');
        }

        if (this.isValidMove(newPosition)) {
            this.position = newPosition;
            return true;
        }
        return false;
    }

    isValidMove(position) {
        // Check bounds
        if (position.x < 0 || position.x >= this.cols || 
            position.y < 0 || position.y >= this.rows) {
            return false;
        }

        // Check obstacles
        const positionKey = `${position.x},${position.y}`;
        return !this.obstacles.has(positionKey);
    }

    getPosition() {
        return { ...this.position };
    }

    setObstacles(obstacleList) {
        this.obstacles.clear();
        for (const [x, y] of obstacleList) {
            this.obstacles.add(`${x},${y}`);
        }
    }

    pickupPackage() {
        const currentPos = `${this.position.x},${this.position.y}`;
        if (this.hasPackage) {
            throw new Error('Robot already has a package');
        }
        
        if (this.packageLocations.includes(currentPos)) {
            this.hasPackage = true;
            return 'Package picked up!';
        }
        throw new Error('No package at current location');
    }

    deliverPackage() {
        const currentPos = `${this.position.x},${this.position.y}`;
        if (!this.hasPackage) {
            throw new Error('No package to deliver');
        }
        
        if (this.dropOffLocations.includes(currentPos)) {
            this.hasPackage = false;
            return 'Package delivered!';
        }
        throw new Error('Not at a valid drop-off location');
    }

    findPath(destination) {
        const [destX, destY] = destination;
        const queue = [[this.position.x, this.position.y, []]];
        const visited = new Set();

        while (queue.length > 0) {
            const [x, y, path] = queue.shift();
            const posKey = `${x},${y}`;

            if (x === destX && y === destY) {
                return path;
            }

            if (visited.has(posKey)) continue;
            visited.add(posKey);

            // Try all four directions
            const directions = [
                ['up', x, y - 1],
                ['down', x, y + 1],
                ['left', x - 1, y],
                ['right', x + 1, y]
            ];

            for (const [dir, newX, newY] of directions) {
                if (this.isValidMove({ x: newX, y: newY })) {
                    queue.push([newX, newY, [...path, dir]]);
                }
            }
        }

        throw new Error('No valid path to destination');
    }

    setPackageLocations(locations) {
        this.packageLocations = locations.map(([x, y]) => `${x},${y}`);
    }

    setDropOffLocations(locations) {
        this.dropOffLocations = locations.map(([x, y]) => `${x},${y}`);
    }
}

module.exports = { WarehouseRobot };