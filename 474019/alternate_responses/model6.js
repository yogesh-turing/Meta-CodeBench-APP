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
        console.log('Welcome to the game!');
        this.player.name = 'Hero';
        this.gameLoop();
    }

    gameLoop() {
        while (!this.isGameOver) {
            this.printStatus();
            this.handleTurn();
            setTimeout(() => {}, 1000); // delay 1 second
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
        console.log(`Inventory (${this.player.inventory.length}/${this.maxInventorySize}): ${this.player.inventory.join(', ') || 'empty'}`);
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
        } else {
            if (!this.activeQuest) {
                this.questEvent();
            }
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
        console.log(`You used ${this.player.abilities[0]} and dealt ${this.calculateAbilityDamage(this.player.abilities[0])} damage!`);
        console.log(`The ${enemy} dealt ${damage} damage to you!`);
        this.player.health -= damage;
        this.player.gold += goldReward;
        this.player.exp += expReward;
        console.log(`You earned ${goldReward} gold and ${expReward} exp!`);
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
        const item = items[Math.floor(Math.random() * items.length)];
        if (this.player.inventory.length < this.maxInventorySize) {
            if (item === 'Potion' || !this.player.inventory.includes(item)) {
                this.player.inventory.push(item);
                console.log(`You found a ${item}!`);
            } else {
                console.log(`You already have a ${item}.`);
            }
        } else {
            console.log('Your inventory is full!');
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
                console.log(`You bought a ${item}!`);
            } else {
                console.log('Your inventory is full!');
            }
        } else {
            console.log('You don\'t have enough gold!');
        }
    }

    nothingEvent() {
        const messages = ['You continue your journey...', 'The wind whistles through the trees...', 'You hear distant sounds of wildlife...', 'You take a moment to rest...'];
        console.log(messages[Math.floor(Math.random() * messages.length)]);
    }

    questEvent() {
        const quests = ['Kill 5 Goblins', 'Find 3 Potions', 'Collect 10 Gold'];
        const quest = quests[Math.floor(Math.random() * quests.length)];
        const type = quest.split(' ')[0].toLowerCase();
        const target = parseInt(quest.split(' ')[1]);
        this.activeQuest = { description: quest, type, target, progress: 0 };
        console.log(`You received a new quest: ${quest}`);
    }

    usePotion() {
        const index = this.player.inventory.indexOf('Potion');
        this.player.inventory.splice(index, 1);
        this.player.health += 30;
        if (this.player.health > 100) {
            this.player.health = 100;
        }
        console.log('You used a potion!');
    }

    calculateAbilityDamage(ability) {
        let damage = 0;
        switch (ability) {
            case 'Strike':
                damage = Math.floor(Math.random() * 15) + 10;
                if (this.player.inventory.includes('Sword')) {
                    damage += 5;
                }
                if (this.player.inventory.includes('Amulet')) {
                    damage += 2;
                }
                break;
            case 'Fireball':
                damage = Math.floor(Math.random() * 25) + 15;
                if (this.player.inventory.includes('Ring')) {
                    damage += 3;
                }
                if (this.player.inventory.includes('Amulet')) {
                    damage += 2;
                }
                break;
            case 'Whirlwind':
                damage = Math.floor(Math.random() * 20) + 12;
                if (this.player.inventory.includes('Sword')) {
                    damage += 7;
                }
                if (this.player.inventory.includes('Ring')) {
                    damage += 3;
                }
                break;
            default:
                damage = Math.floor(Math.random() * 10) + 5;
                break;
        }
        return damage;
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
        console.log('You leveled up!');
    }

    generateNewQuest() {
        this.questEvent();
    }

    checkQuestCompletion() {
        if (this.activeQuest && this.activeQuest.progress >= this.activeQuest.target) {
            console.log('You completed the quest!');
            this.activeQuest = null;
        }
    }
}

module.exports = {
    Game
}