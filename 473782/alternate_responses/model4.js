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
        if (!this.hasPackage && this.packageLocations.includes(currentPos)) {
            this.hasPackage = true;
            return true;
        }
        throw new Error('No package at current location');
    }

    deliverPackage() {
        const currentPos = `${this.position.x},${this.position.y}`;
        if (this.hasPackage && this.dropOffLocations.includes(currentPos)) {
            this.hasPackage = false;
            return true;
        }
        throw new Error('Cannot deliver package at current location');
    }

    findPath(destination) {
        const [destX, destY] = destination;
        const queue = [[this.position.x, this.position.y, []]];
        const visited = new Set();

        while (queue.length > 0) {
            const [currentX, currentY, path] = queue.shift();
            const currentKey = `${currentX},${currentY}`;

            if (currentX === destX && currentY === destY) {
                return path;
            }

            if (visited.has(currentKey)) continue;
            visited.add(currentKey);

            const directions = [
                [0, 1, 'down'],
                [0, -1, 'up'],
                [1, 0, 'right'],
                [-1, 0, 'left']
            ];

            for (const [dx, dy, dir] of directions) {
                const nextX = currentX + dx;
                const nextY = currentY + dy;
                const nextPos = { x: nextX, y: nextY };

                if (this.isValidMove(nextPos)) {
                    queue.push([nextX, nextY, [...path, dir]]);
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