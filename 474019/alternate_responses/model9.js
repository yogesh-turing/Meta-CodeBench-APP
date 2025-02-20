class Game {
    constructor() {
        this.player = {
            name: '',
            health: 100,
            inventory: [],
            gold: 0,
            level: 1,
            exp: 0,
            abilities: ['Strike']
        };
        this.isGameOver = false;
        this.activeQuest = null;
        this.maxInventorySize = 10;
    }

    start() {
        console.log("Welcome to the game!");
        this.player.name = 'Hero';
        this.gameLoop();
    }

    gameLoop() {
        while (!this.isGameOver) {
            this.printStatus();
            this.handleTurn();
            setTimeout(() => { }, 1000);
            if (this.player.health <= 0) {
                this.isGameOver = true;
                console.log(`Game Over! You survived ${this.player.level} turns!`);
            }
        }
    }

    printStatus() {
        console.log("\n=================================");
        console.log(`=== ${this.player.name}'s Status ===`);
        console.log(`Level: ${this.player.level} (EXP: ${this.player.exp}/100)`);
        console.log(`Health: ${this.player.health}/100`);
        console.log(`Gold: ${this.player.gold}`);
        console.log(`Inventory (${this.player.inventory.length}/${this.maxInventorySize}): ${this.player.inventory.join(', ') || 'empty'}`);
        console.log(`Abilities: ${this.player.abilities.join(', ')}`);
        if (this.activeQuest) {
            console.log(`Quest: ${this.activeQuest.description} (${this.activeQuest.progress}/${this.activeQuest.target})`);
        }
        console.log("=================================\n");
    }

    handleTurn() {
        const eventRoll = Math.floor(Math.random() * 100);
        if (eventRoll < 35) {
            // Combat
            const enemies = ['Goblin', 'Wolf', 'Bandit'];
            const enemy = enemies[Math.floor(Math.random() * enemies.length)];
            const damage = Math.floor(Math.random() * 20) + 5;
            const goldReward = Math.floor(Math.random() * 10) + 5;
            const expReward = Math.floor(Math.random() * 15) + 10;
            console.log(`You encountered a ${enemy}!`);
            const ability = this.player.abilities[Math.floor(Math.random() * this.player.abilities.length)];
            const playerDamage = this.calculateAbilityDamage(ability);
            console.log(`You used ${ability} and dealt ${playerDamage} damage!`);
            console.log(`The ${enemy} dealt ${damage} damage to you!`);
            this.player.health -= damage;
            this.player.gold += goldReward;
            this.player.exp += expReward;
            if (this.activeQuest && this.activeQuest.type === 'kill') {
                this.activeQuest.progress++;
            }
        } else if (eventRoll < 60) {
            // Find Item
            const items = ['Sword', 'Shield', 'Potion', 'Amulet', 'Ring', 'Boots'];
            const weights = [15, 15, 25, 15, 15, 15];
            const item = items[Math.floor(Math.random() * items.length)];
            if (this.player.inventory.length < this.maxInventorySize) {
                if (item === 'Potion' || this.player.inventory.filter(i => i === item).length < 2) {
                    this.player.inventory.push(item);
                    console.log(`You found a ${item}!`);
                } else {
                    console.log(`You already have two ${item}s!`);
                }
            } else {
                console.log('Your inventory is full!');
            }
        } else if (eventRoll < 80) {
            // Shop
            const items = ['Potion', 'Sword', 'Shield'];
            const prices = [20, 50, 40];
            const item = items[Math.floor(Math.random() * items.length)];
            const price = prices[items.indexOf(item)];
            if (this.player.gold >= price) {
                console.log(`You can buy a ${item} for ${price} gold!`);
                this.player.gold -= price;
                this.player.inventory.push(item);
                console.log(`You bought a ${item}!`);
            } else {
                console.log('You don\'t have enough gold!');
            }
        } else if (eventRoll < 95) {
            // Nothing
            const messages = ['You continue your journey...', 'The wind whistles through the trees...', 'You hear distant sounds of wildlife...', 'You take a moment to rest...'];
            console.log(messages[Math.floor(Math.random() * messages.length)]);
        } else if (!this.activeQuest) {
            // Quest
            this.generateNewQuest();
        }
        if (this.player.health < 50 && this.player.inventory.includes('Potion')) {
            this.player.health += 30;
            this.player.inventory.splice(this.player.inventory.indexOf('Potion'), 1);
            console.log('You used a potion to heal yourself!');
        }
    }

    calculateAbilityDamage(ability) {
        let baseDamage;
        switch (ability) {
            case 'Strike':
                baseDamage = Math.floor(Math.random() * 15) + 10;
                break;
            case 'Fireball':
                baseDamage = Math.floor(Math.random() * 25) + 15;
                break;
            case 'Whirlwind':
                baseDamage = Math.floor(Math.random() * 20) + 12;
                break;
            default:
                baseDamage = Math.floor(Math.random() * 10) + 5;
        }
        if (this.player.inventory.includes('Sword') && (ability === 'Strike' || ability === 'Whirlwind')) {
            baseDamage += 5;
        }
        if (this.player.inventory.includes('Amulet')) {
            baseDamage += 2;
        }
        if (this.player.inventory.includes('Ring') && ability === 'Fireball') {
            baseDamage += 3;
        }
        return baseDamage;
    }

    addExperience(exp) {
        this.player.exp += exp;
        if (this.player.exp >= 100) {
            this.levelUp();
        }
    }

    levelUp() {
        this.player.level++;
        this.player.exp = 0;
        this.player.health = 100;
        console.log(`You leveled up to level ${this.player.level}!`);
    }

    generateNewQuest() {
        const questTypes = ['kill', 'collect'];
        const questType = questTypes[Math.floor(Math.random() * questTypes.length)];
        let questDescription;
        let questTarget;
        switch (questType) {
            case 'kill':
                questDescription = `Kill ${questTarget = Math.floor(Math.random() * 10) + 5} enemies`;
                break;
            case 'collect':
                questDescription = `Collect ${questTarget = Math.floor(Math.random() * 5) + 3} items`;
                break;
        }
        this.activeQuest = {
            type: questType,
            description: questDescription,
            target: questTarget,
            progress: 0
        };
        console.log(`You received a new quest: ${questDescription}`);
    }

    checkQuestCompletion() {
        if (this.activeQuest && this.activeQuest.progress >= this.activeQuest.target) {
            console.log(`You completed the quest: ${this.activeQuest.description}`);
            this.activeQuest = null;
        }
    }
}

module.exports = {
    Game
}