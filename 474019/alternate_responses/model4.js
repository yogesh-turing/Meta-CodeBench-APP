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
            await this.handleTurn();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (this.player.health <= 0) {
                this.isGameOver = true;
                console.log(`Game Over! You survived ${this.turns} turns!`);
            }
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
        console.log("========================");
    }

    async handleTurn() {
        const roll = Math.random() * 100;
        
        // Auto-use potion if health is low
        if (this.player.health < 50 && this.player.inventory.includes('Potion')) {
            const potionIndex = this.player.inventory.indexOf('Potion');
            this.player.inventory.splice(potionIndex, 1);
            this.player.health = Math.min(100, this.player.health + 30);
            console.log("Used a potion to restore health!");
        }

        if (roll < 35) { // Combat
            const enemies = ['Goblin', 'Wolf', 'Bandit'];
            const enemy = enemies[Math.floor(Math.random() * enemies.length)];
            const ability = this.player.abilities[Math.floor(Math.random() * this.player.abilities.length)];
            const damage = this.calculateAbilityDamage(ability);
            const enemyDamage = Math.floor(Math.random() * 21) + 5; // 5-25 damage
            
            console.log(`You encounter a ${enemy}!`);
            console.log(`You use ${ability} for ${damage} damage!`);
            
            if (!this.player.inventory.includes('Shield')) {
                this.player.health -= enemyDamage;
                console.log(`${enemy} hits you for ${enemyDamage} damage!`);
            } else {
                const reducedDamage = enemyDamage - 2;
                this.player.health -= reducedDamage;
                console.log(`${enemy} hits you for ${reducedDamage} damage (reduced by Shield)!`);
            }
            
            const goldReward = Math.floor(Math.random() * 11) + 5; // 5-15 gold
            const expReward = Math.floor(Math.random() * 16) + 10; // 10-25 exp
            this.player.gold += goldReward;
            this.addExperience(expReward);
            
            console.log(`You defeated the ${enemy}! Earned ${goldReward} gold and ${expReward} exp.`);
            
            if (this.activeQuest && this.activeQuest.type === 'kill') {
                this.activeQuest.progress++;
                this.checkQuestCompletion();
            }
        } else if (roll < 60) { // Find Item
            if (this.player.inventory.length < this.maxInventorySize) {
                const items = ['Sword', 'Shield', 'Potion', 'Amulet', 'Ring', 'Boots'];
                const weights = [15, 15, 25, 15, 15, 15];
                let totalWeight = weights.reduce((a, b) => a + b, 0);
                let random = Math.random() * totalWeight;
                let itemIndex = 0;
                
                for (let i = 0; i < weights.length; i++) {
                    random -= weights[i];
                    if (random <= 0) {
                        itemIndex = i;
                        break;
                    }
                }
                
                const item = items[itemIndex];
                const itemCount = this.player.inventory.filter(i => i === item).length;
                
                if (item === 'Potion' || itemCount < 2) {
                    this.player.inventory.push(item);
                    console.log(`You found a ${item}!`);
                } else {
                    console.log(`You found a ${item}, but you already have enough of those.`);
                }
            } else {
                console.log("Your inventory is full!");
            }
        } else if (roll < 80) { // Shop
            const shopItems = [
                { name: 'Potion', price: 20 },
                { name: 'Sword', price: 50 },
                { name: 'Shield', price: 40 }
            ];
            
            const item = shopItems[Math.floor(Math.random() * shopItems.length)];
            if (this.player.gold >= item.price && this.player.inventory.length < this.maxInventorySize) {
                this.player.gold -= item.price;
                this.player.inventory.push(item.name);
                console.log(`You bought a ${item.name} for ${item.price} gold.`);
            } else {
                console.log(`You can't afford the ${item.name} (${item.price} gold).`);
            }
        } else if (roll < 95) { // Nothing
            const messages = [
                "You continue your journey...",
                "The wind whistles through the trees...",
                "You hear distant sounds of wildlife...",
                "You take a moment to rest..."
            ];
            console.log(messages[Math.floor(Math.random() * messages.length)]);
        } else if (!this.activeQuest) { // Quest (5% chance)
            this.generateNewQuest();
        }
    }

    calculateAbilityDamage(ability) {
        let damage = 0;
        const hasItem = (item) => this.player.inventory.includes(item);
        
        switch (ability) {
            case 'Strike':
                damage = Math.floor(Math.random() * 16) + 10; // 10-25
                if (hasItem('Sword')) damage += 5;
                if (hasItem('Amulet')) damage += 2;
                break;
            case 'Fireball':
                damage = Math.floor(Math.random() * 26) + 15; // 15-40
                if (hasItem('Ring')) damage += 3;
                if (hasItem('Amulet')) damage += 2;
                break;
            case 'Whirlwind':
                damage = Math.floor(Math.random() * 21) + 12; // 12-32
                if (hasItem('Sword')) damage += 7;
                if (hasItem('Ring')) damage += 3;
                break;
            default:
                damage = Math.floor(Math.random() * 11) + 5; // 5-15
        }
        
        return Math.floor(damage);
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
        
        if (this.player.level === 2) {
            this.player.abilities.push('Fireball');
        } else if (this.player.level === 3) {
            this.player.abilities.push('Whirlwind');
        }
        
        console.log(`Level Up! You are now level ${this.player.level}!`);
        if (this.player.exp >= 100) {
            this.levelUp();
        }
    }

    generateNewQuest() {
        const questTypes = [
            { type: 'kill', description: 'Defeat monsters', target: 5 },
            { type: 'gold', description: 'Collect gold', target: 100 },
            { type: 'item', description: 'Find items', target: 3 }
        ];
        
        this.activeQuest = {
            ...questTypes[Math.floor(Math.random() * questTypes.length)],
            progress: 0
        };
        
        console.log(`New Quest: ${this.activeQuest.description} (0/${this.activeQuest.target})`);
    }

    checkQuestCompletion() {
        if (this.activeQuest && this.activeQuest.progress >= this.activeQuest.target) {
            console.log("Quest completed! Rewards: 50 gold and 50 exp");
            this.player.gold += 50;
            this.addExperience(50);
            this.activeQuest = null;
        }
    }
}

module.exports = {
    Game
};