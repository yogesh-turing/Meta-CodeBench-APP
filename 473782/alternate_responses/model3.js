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
        // Check boundaries
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
            if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
                this.obstacles.add(`${x},${y}`);
            }
        }
    }

    pickupPackage() {
        const currentPos = `${this.position.x},${this.position.y}`;
        if (this.hasPackage) {
            throw new Error('Robot already has a package');
        }
        
        if (this.packageLocations.includes(currentPos)) {
            this.hasPackage = true;
            return true;
        }
        return false;
    }

    deliverPackage() {
        const currentPos = `${this.position.x},${this.position.y}`;
        if (!this.hasPackage) {
            throw new Error('No package to deliver');
        }

        if (this.dropOffLocations.includes(currentPos)) {
            this.hasPackage = false;
            return true;
        }
        return false;
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

            // Try all four directions
            const directions = [
                [0, -1, 'up'],
                [0, 1, 'down'],
                [-1, 0, 'left'],
                [1, 0, 'right']
            ];

            for (const [dx, dy, dir] of directions) {
                const newX = currentX + dx;
                const newY = currentY + dy;
                
                if (this.isValidMove({ x: newX, y: newY })) {
                    const newPath = [...path, dir];
                    queue.push([newX, newY, newPath]);
                }
            }
        }

        throw new Error('No valid path found');
    }
}

module.exports = { WarehouseRobot };