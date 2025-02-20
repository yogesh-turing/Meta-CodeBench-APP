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
        this.turns = 0;
    }

    start() {
        console.log("Welcome to the RPG Adventure!");
        this.player.name = 'Hero';
        this.gameLoop();
    }

    async gameLoop() {
        while (!this.isGameOver) {
            this.turns++;
            this.printStatus();
            this.handleTurn();
            
            if (this.player.health <= 0) {
                this.isGameOver = true;
                console.log(`Game Over! You survived ${this.turns} turns!`);
            }
            
            // Delay between turns
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    printStatus() {
        console.log(`\n=== ${this.player.name}'s Status ===`);
        console.log(`Level: ${this.player.level} (EXP: ${this.player.exp}/100)`);
        console.log(`Health: ${this.player.health}/100`);
        console.log(`Gold: ${this.player.gold}`);
        console.log(`Inventory (${this.player.inventory.length}/${this.maxInventorySize}): ${this.player.inventory.length > 0 ? this.player.inventory.join(', ') : 'empty'}`);
        console.log(`Abilities: ${this.player.abilities.join(', ')}`);
        if (this.activeQuest) {
            console.log(`Quest: ${this.activeQuest.description} (${this.activeQuest.progress}/${this.activeQuest.target})`);
        }
    }

    handleTurn() {
        const roll = Math.random() * 100;
        
        // Auto-use potion if health is low
        if (this.player.health < 50 && this.player.inventory.includes('Potion')) {
            const potionIndex = this.player.inventory.indexOf('Potion');
            this.player.inventory.splice(potionIndex, 1);
            this.player.health = Math.min(100, this.player.health + 30);
            console.log("Used a potion to restore health!");
        }

        if (roll < 35) { // Combat (35%)
            this.handleCombat();
        } else if (roll < 60) { // Find Item (25%)
            this.handleFindItem();
        } else if (roll < 80) { // Shop (20%)
            this.handleShop();
        } else if (roll < 95) { // Nothing (15%)
            this.handleNothing();
        } else if (!this.activeQuest) { // Quest (5% if no active quest)
            this.generateNewQuest();
        }
    }

    handleCombat() {
        const enemies = ['Goblin', 'Wolf', 'Bandit'];
        const enemy = enemies[Math.floor(Math.random() * enemies.length)];
        const ability = this.player.abilities[Math.floor(Math.random() * this.player.abilities.length)];
        const damage = this.calculateAbilityDamage(ability);
        const enemyDamage = Math.floor(Math.random() * 21) + 5; // 5-25 damage
        const goldReward = Math.floor(Math.random() * 11) + 5; // 5-15 gold
        const expReward = Math.floor(Math.random() * 16) + 10; // 10-25 exp

        console.log(`You encounter a ${enemy}!`);
        console.log(`You use ${ability} for ${damage} damage!`);
        this.player.health -= enemyDamage;
        this.player.gold += goldReward;
        this.addExperience(expReward);

        if (this.activeQuest && this.activeQuest.type === 'kill') {
            this.activeQuest.progress++;
            this.checkQuestCompletion();
        }
    }

    calculateAbilityDamage(ability) {
        let baseDamage = 0;
        let bonus = 0;

        switch (ability) {
            case 'Strike':
                baseDamage = Math.floor(Math.random() * 16) + 10; // 10-25
                if (this.player.inventory.includes('Sword')) bonus += 5;
                if (this.player.inventory.includes('Amulet')) bonus += 2;
                break;
            case 'Fireball':
                baseDamage = Math.floor(Math.random() * 26) + 15; // 15-40
                if (this.player.inventory.includes('Ring')) bonus += 3;
                if (this.player.inventory.includes('Amulet')) bonus += 2;
                break;
            case 'Whirlwind':
                baseDamage = Math.floor(Math.random() * 21) + 12; // 12-32
                if (this.player.inventory.includes('Sword')) bonus += 7;
                if (this.player.inventory.includes('Ring')) bonus += 3;
                break;
            default:
                baseDamage = Math.floor(Math.random() * 11) + 5; // 5-15
        }

        return baseDamage + bonus;
    }

    handleFindItem() {
        if (this.player.inventory.length >= this.maxInventorySize) {
            console.log("Inventory is full!");
            return;
        }

        const items = [
            { name: 'Sword', weight: 15 },
            { name: 'Shield', weight: 15 },
            { name: 'Potion', weight: 25 },
            { name: 'Amulet', weight: 15 },
            { name: 'Ring', weight: 15 },
            { name: 'Boots', weight: 15 }
        ];

        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
        let roll = Math.random() * totalWeight;
        let selectedItem;

        for (const item of items) {
            roll -= item.weight;
            if (roll <= 0) {
                selectedItem = item.name;
                break;
            }
        }

        if (selectedItem !== 'Potion' && 
            this.player.inventory.filter(i => i === selectedItem).length >= 2) {
            console.log(`You already have maximum ${selectedItem}s!`);
            return;
        }

        this.player.inventory.push(selectedItem);
        console.log(`Found a ${selectedItem}!`);
    }

    handleShop() {
        const items = [
            { name: 'Potion', cost: 20 },
            { name: 'Sword', cost: 50 },
            { name: 'Shield', cost: 40 }
        ];

        const affordable = items.filter(item => this.player.gold >= item.cost);
        if (affordable.length === 0) {
            console.log("You can't afford any items in the shop.");
            return;
        }

        const item = affordable[Math.floor(Math.random() * affordable.length)];
        if (this.player.inventory.length < this.maxInventorySize) {
            this.player.gold -= item.cost;
            this.player.inventory.push(item.name);
            console.log(`Bought a ${item.name} for ${item.cost} gold!`);
        } else {
            console.log("Inventory is full!");
        }
    }

    handleNothing() {
        const messages = [
            "You continue your journey...",
            "The wind whistles through the trees...",
            "You hear distant sounds of wildlife...",
            "You take a moment to rest..."
        ];
        console.log(messages[Math.floor(Math.random() * messages.length)]);
    }

    addExperience(exp) {
        this.player.exp += exp;
        if (this.player.exp >= 100) {
            this.levelUp();
        }
    }

    levelUp() {
        this.player.level++;
        this.player.exp -= 100;
        this.player.health = 100;
        if (this.player.level === 2) this.player.abilities.push('Fireball');
        if (this.player.level === 3) this.player.abilities.push('Whirlwind');
        console.log(`Level up! You are now level ${this.player.level}!`);
    }

    generateNewQuest() {
        const questTypes = [
            { type: 'kill', description: 'Defeat 5 enemies', target: 5 },
            { type: 'gold', description: 'Collect 100 gold', target: 100 },
            { type: 'item', description: 'Find 3 items', target: 3 }
        ];

        this.activeQuest = {
            ...questTypes[Math.floor(Math.random() * questTypes.length)],
            progress: 0
        };
        console.log(`New quest: ${this.activeQuest.description}`);
    }

    checkQuestCompletion() {
        if (this.activeQuest && this.activeQuest.progress >= this.activeQuest.target) {
            console.log("Quest completed! Received bonus rewards!");
            this.player.gold += 50;
            this.addExperience(50);
            this.activeQuest = null;
        }
    }
}

module.exports = {
    Game
};