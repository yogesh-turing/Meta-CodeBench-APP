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
        const queue = [[this.position.x, this.position.y]];
        const visited = new Set([`${this.position.x},${this.position.y}`]);
        const parent = new Map();
        
        while (queue.length > 0) {
            const [currentX, currentY] = queue.shift();
            
            if (currentX === destX && currentY === destY) {
                return this.reconstructPath(parent, [destX, destY]);
            }
            
            const directions = [
                [0, 1], [1, 0], [0, -1], [-1, 0]  // down, right, up, left
            ];
            
            for (const [dx, dy] of directions) {
                const newX = currentX + dx;
                const newY = currentY + dy;
                const newPos = { x: newX, y: newY };
                const posKey = `${newX},${newY}`;
                
                if (this.isValidMove(newPos) && !visited.has(posKey)) {
                    queue.push([newX, newY]);
                    visited.add(posKey);
                    parent.set(posKey, `${currentX},${currentY}`);
                }
            }
        }
        
        throw new Error('No valid path found');
    }

    reconstructPath(parent, destination) {
        const path = [];
        let current = `${destination[0]},${destination[1]}`;
        
        while (parent.has(current)) {
            path.unshift(current.split(',').map(Number));
            current = parent.get(current);
        }
        
        path.unshift([this.position.x, this.position.y]);
        return path;
    }
}

module.exports = { WarehouseRobot };