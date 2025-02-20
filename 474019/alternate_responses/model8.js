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
            setTimeout(() => {}, 1000); // delay for 1 second
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
        console.log("=================================");
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

        console.log(`You encounter a ${enemy}!`);
        console.log(`You use your ${this.player.abilities[0]} ability.`);
        const abilityDamage = this.calculateAbilityDamage(this.player.abilities[0]);
        console.log(`You deal ${abilityDamage} damage to the ${enemy}.`);
        console.log(`The ${enemy} attacks you for ${damage} damage.`);
        this.player.health -= damage;
        console.log(`You kill the ${enemy} and earn ${goldReward} gold and ${expReward} exp.`);
        this.player.gold += goldReward;
        this.player.exp += expReward;
        if (this.activeQuest && this.activeQuest.type === 'kill') {
            this.activeQuest.progress++;
        }
    }

    findItemEvent() {
        const items = ['Sword', 'Shield', 'Potion', 'Amulet', 'Ring', 'Boots'];
        const weights = [15, 15, 25, 15, 15, 15];
        const item = this.getRandomItem(items, weights);
        if (this.player.inventory.length < this.maxInventorySize) {
            if (item === 'Potion' || !this.player.inventory.includes(item)) {
                this.player.inventory.push(item);
                console.log(`You find a ${item}!`);
            } else {
                console.log(`You already have a ${item}.`);
            }
        } else {
            console.log('Your inventory is full.');
        }
    }

    shopEvent() {
        const items = ['Potion', 'Sword', 'Shield'];
        const prices = [20, 50, 40];
        const item = this.getRandomItem(items, [1, 1, 1]);
        const price = prices[items.indexOf(item)];
        if (this.player.gold >= price) {
            console.log(`You can buy a ${item} for ${price} gold.`);
            this.player.gold -= price;
            this.player.inventory.push(item);
            console.log(`You buy the ${item}.`);
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
            progress: 0,
            target: 5
        };
        console.log(`You receive a quest: ${this.activeQuest.description}`);
    }

    usePotion() {
        this.player.health += 30;
        if (this.player.health > 100) {
            this.player.health = 100;
        }
        this.player.inventory.splice(this.player.inventory.indexOf('Potion'), 1);
        console.log('You use a potion and heal 30 HP.');
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
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        const randomWeight = Math.floor(Math.random() * totalWeight);
        let cumulativeWeight = 0;
        for (let i = 0; i < items.length; i++) {
            cumulativeWeight += weights[i];
            if (randomWeight < cumulativeWeight) {
                return items[i];
            }
        }
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
        console.log(`You level up to level ${this.player.level}!`);
    }

    generateNewQuest() {
        this.activeQuest = {
            type: 'kill',
            description: `Kill ${Math.floor(Math.random() * 5) + 5} ${['Goblin', 'Wolf', 'Bandit'][Math.floor(Math.random() * 3)]}`,
            progress: 0,
            target: Math.floor(Math.random() * 5) + 5
        };
        console.log(`You receive a new quest: ${this.activeQuest.description}`);
    }

    checkQuestCompletion() {
        if (this.activeQuest && this.activeQuest.progress >= this.activeQuest.target) {
            console.log(`You complete the quest: ${this.activeQuest.description}`);
            this.activeQuest = null;
            this.generateNewQuest();
        }
    }
}

module.exports = {
    Game
}