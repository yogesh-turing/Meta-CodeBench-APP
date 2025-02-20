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
        console.log('Welcome to the RPG game!');
        this.player.name = 'Hero';
        this.gameLoop();
    }

    gameLoop() {
        while (!this.isGameOver) {
            this.printStatus();
            this.handleTurn();
            setTimeout(() => {}, 1000); // delay of 1 second
            if (this.player.health <= 0) {
                this.isGameOver = true;
                console.log(`Game Over! You survived ${this.player.level} turns!`);
            }
        }
    }

    printStatus() {
        console.log(`\n=== ${this.player.name}'s Status ===`);
        console.log(`Level: ${this.player.level} (EXP: ${this.player.exp}/100)`);
        console.log(`Health: ${this.player.health}/100`);
        console.log(`Gold: ${this.player.gold}`);
        const inventory = this.player.inventory.length > 0 ? this.player.inventory.join(', ') : 'empty';
        console.log(`Inventory (${this.player.inventory.length}/${this.maxInventorySize}): ${inventory}`);
        console.log(`Abilities: ${this.player.abilities.join(', ')}`);
        if (this.activeQuest) {
            console.log(`Quest: ${this.activeQuest.description} (${this.activeQuest.progress}/${this.activeQuest.target})`);
        }
        console.log('===========================');
    }

    handleTurn() {
        const randomEvent = Math.floor(Math.random() * 100);
        if (randomEvent < 35) {
            this.combatEvent();
        } else if (randomEvent < 60) {
            this.findItemEvent();
        } else if (randomEvent < 80) {
            this.shopEvent();
        } else if (randomEvent < 95) {
            this.nothingEvent();
        } else if (!this.activeQuest) {
            this.questEvent();
        }
        if (this.player.health < 50 && this.player.inventory.includes('Potion')) {
            this.usePotion();
        }
    }

    combatEvent() {
        const enemies = ['Goblin', 'Wolf', 'Bandit'];
        const enemy = enemies[Math.floor(Math.random() * enemies.length)];
        const damage = Math.floor(Math.random() * 20) + 5;
        const goldReward = Math.floor(Math.random() * 10) + 5;
        const expReward = Math.floor(Math.random() * 15) + 10;
        console.log(`You encountered a ${enemy}!`);
        console.log(`You took ${damage} damage.`);
        this.player.health -= damage;
        if (this.player.health <= 0) {
            return;
        }
        const ability = this.player.abilities[Math.floor(Math.random() * this.player.abilities.length)];
        const abilityDamage = this.calculateAbilityDamage(ability);
        console.log(`You used ${ability} and dealt ${abilityDamage} damage.`);
        this.player.gold += goldReward;
        this.player.exp += expReward;
        console.log(`You gained ${goldReward} gold and ${expReward} exp.`);
        if (this.activeQuest && this.activeQuest.type === 'kill') {
            this.activeQuest.progress++;
            if (this.activeQuest.progress >= this.activeQuest.target) {
                console.log('You completed the quest!');
                this.activeQuest = null;
            }
        }
    }

    findItemEvent() {
        const items = ['Sword', 'Shield', 'Potion', 'Amulet', 'Ring', 'Boots'];
        const weights = [15, 15, 25, 15, 15, 15];
        const item = this.getRandomItem(items, weights);
        if (this.player.inventory.length < this.maxInventorySize) {
            if (item === 'Potion' || !this.player.inventory.includes(item)) {
                this.player.inventory.push(item);
                console.log(`You found a ${item}!`);
            } else {
                console.log('You already have this item.');
            }
        } else {
            console.log('Your inventory is full.');
        }
    }

    shopEvent() {
        const items = ['Potion', 'Sword', 'Shield'];
        const prices = [20, 50, 40];
        const item = items[Math.floor(Math.random() * items.length)];
        const price = prices[items.indexOf(item)];
        if (this.player.gold >= price) {
            console.log(`You can buy a ${item} for ${price} gold.`);
            if (this.player.inventory.length < this.maxInventorySize) {
                this.player.gold -= price;
                this.player.inventory.push(item);
                console.log(`You bought a ${item}.`);
            } else {
                console.log('Your inventory is full.');
            }
        } else {
            console.log('You do not have enough gold.');
        }
    }

    nothingEvent() {
        const messages = ['You continue your journey...', 'The wind whistles through the trees...', 'You hear distant sounds of wildlife...', 'You take a moment to rest...'];
        console.log(messages[Math.floor(Math.random() * messages.length)]);
    }

    questEvent() {
        this.activeQuest = {
            type: 'kill',
            description: 'Kill 5 Goblins',
            target: 5,
            progress: 0
        };
        console.log('You received a new quest!');
    }

    usePotion() {
        this.player.health += 30;
        if (this.player.health > 100) {
            this.player.health = 100;
        }
        this.player.inventory.splice(this.player.inventory.indexOf('Potion'), 1);
        console.log('You used a potion.');
    }

    calculateAbilityDamage(ability) {
        let baseDamage;
        switch (ability) {
            case 'Strike':
                baseDamage = Math.floor(Math.random() * 15) + 10;
                if (this.player.inventory.includes('Sword')) {
                    baseDamage += 5;
                }
                if (this.player.inventory.includes('Amulet')) {
                    baseDamage += 2;
                }
                break;
            case 'Fireball':
                baseDamage = Math.floor(Math.random() * 25) + 15;
                if (this.player.inventory.includes('Ring')) {
                    baseDamage += 3;
                }
                if (this.player.inventory.includes('Amulet')) {
                    baseDamage += 2;
                }
                break;
            case 'Whirlwind':
                baseDamage = Math.floor(Math.random() * 20) + 12;
                if (this.player.inventory.includes('Sword')) {
                    baseDamage += 7;
                }
                if (this.player.inventory.includes('Ring')) {
                    baseDamage += 3;
                }
                break;
            default:
                baseDamage = Math.floor(Math.random() * 10) + 5;
        }
        return baseDamage;
    }

    getRandomItem(items, weights) {
        const random = Math.floor(Math.random() * weights.reduce((a, b) => a + b, 0));
        let cumulativeWeight = 0;
        for (let i = 0; i < items.length; i++) {
            cumulativeWeight += weights[i];
            if (random < cumulativeWeight) {
                return items[i];
            }
        }
    }
}

module.exports = {
    Game
}