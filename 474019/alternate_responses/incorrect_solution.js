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
            
            if (this.player.health <= 0) {
                this.isGameOver = true;
                console.log(`Game Over! You survived ${this.turns} turns!`);
            }
            
            // 1 second delay between turns
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

    async handleTurn() {
        const roll = Math.random() * 100;
        
        // Auto-use potion if health is low
        if (this.player.health < 50 && this.player.inventory.includes('Potion')) {
            const potionIndex = this.player.inventory.indexOf('Potion');
            this.player.inventory.splice(potionIndex, 1);
            this.player.health = Math.min(100, this.player.health + 30);
            console.log("Used a potion to restore health!");
        }

        if (roll < 35) { // Combat (35%)
            const enemies = ['Goblin', 'Wolf', 'Bandit'];
            const enemy = enemies[Math.floor(Math.random() * enemies.length)];
            const ability = this.player.abilities[Math.floor(Math.random() * this.player.abilities.length)];
            const damage = this.calculateAbilityDamage(ability);
            const enemyDamage = Math.floor(Math.random() * 21) + 5; // 5-25 damage
            
            console.log(`Fighting ${enemy}!`);
            console.log(`You use ${ability} for ${damage} damage!`);
            
            // Apply damage reduction if player has Shield
            let damageTaken = enemyDamage;
            if (this.player.inventory.includes('Shield')) {
                damageTaken = Math.max(0, damageTaken - 2);
            }
            
            // Apply damage avoidance if player has Boots
            if (this.player.inventory.includes('Boots') && Math.random() < 0.1) {
                damageTaken = 0;
                console.log("You dodged the attack!");
            }
            
            this.player.health -= damageTaken;
            console.log(`${enemy} hits you for ${damageTaken} damage!`);
            
            const goldReward = Math.floor(Math.random() * 11) + 5; // 5-15 gold
            const expReward = Math.floor(Math.random() * 16) + 10; // 10-25 exp
            this.player.gold += goldReward;
            this.addExperience(expReward);
            
            if (this.activeQuest && this.activeQuest.type === 'kill') {
                this.activeQuest.progress++;
                this.checkQuestCompletion();
            }
        } else if (roll < 60) { // Find Item (25%)
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
                if (item !== 'Potion' && this.player.inventory.filter(i => i === item).length >= 2) {
                    console.log(`Found ${item} but already have maximum amount!`);
                } else {
                    this.player.inventory.push(item);
                    console.log(`Found ${item}!`);
                }
            } else {
                console.log("Inventory is full!");
            }
        } else if (roll < 80) { // Shop (20%)
            console.log("You encounter a merchant!");
            const items = [
                { name: 'Potion', cost: 20 },
                { name: 'Sword', cost: 50 },
                { name: 'Shield', cost: 40 }
            ];
            
            for (const item of items) {
                if (this.player.gold >= item.cost) {
                    console.log(`Would you like to buy ${item.name} for ${item.cost} gold?`);
                    // Simulate purchase decision
                    if (Math.random() < 0.5 && this.player.inventory.length < this.maxInventorySize) {
                        this.player.gold -= item.cost;
                        this.player.inventory.push(item.name);
                        console.log(`Bought ${item.name}!`);
                        break;
                    }
                }
            }
        } else if (roll < 95) { // Nothing (15%)
            const messages = [
                "You continue your journey...",
                "The wind whistles through the trees...",
                "You hear distant sounds of wildlife...",
                "You take a moment to rest..."
            ];
            console.log(messages[Math.floor(Math.random() * messages.length)]);
        } else if (!this.activeQuest) { // Quest (5%)
            this.generateNewQuest();
        }
    }

    calculateAbilityDamage(ability) {
        let damage = 0;
        
        switch (ability) {
            case 'Strike':
                damage = Math.floor(Math.random() * 16) + 10; // 10-25
                if (this.player.inventory.includes('Sword')) damage += 5;
                if (this.player.inventory.includes('Amulet')) damage += 2;
                break;
            case 'Fireball':
                damage = Math.floor(Math.random() * 26) + 15; // 15-40
                if (this.player.inventory.includes('Ring')) damage += 3;
                if (this.player.inventory.includes('Amulet')) damage += 2;
                break;
            case 'Whirlwind':
                damage = Math.floor(Math.random() * 21) + 12; // 12-32
                if (this.player.inventory.includes('Sword')) damage += 7;
                if (this.player.inventory.includes('Ring')) damage += 3;
                break;
            default:
                damage = Math.floor(Math.random() * 11) + 5; // 5-15
        }
        
        return damage;
    }

    addExperience(exp) {
        if (this.player.inventory.includes('Amulet')) {
            exp += 2;
        }
        this.player.exp += exp;
        console.log(`Gained ${exp} experience!`);
        
        if (this.player.exp >= 100) {
            this.levelUp();
        }
    }

    levelUp() {
        this.player.level++;
        this.player.exp -= 100;
        console.log(`Level up! You are now level ${this.player.level}!`);
        
        if (this.player.level === 2) {
            this.player.abilities.push('Fireball');
        } else if (this.player.level === 3) {
            this.player.abilities.push('Whirlwind');
        }
    }

    generateNewQuest() {
        const questTypes = ['kill', 'collect'];
        const type = questTypes[Math.floor(Math.random() * questTypes.length)];
        const target = Math.floor(Math.random() * 3) + 3; // 3-5
        
        this.activeQuest = {
            type,
            target,
            progress: 0,
            description: type === 'kill' ? 
                `Defeat ${target} enemies` : 
                `Collect ${target} items`
        };
        
        console.log(`New Quest: ${this.activeQuest.description}`);
    }

    checkQuestCompletion() {
        if (this.activeQuest && this.activeQuest.progress >= this.activeQuest.target) {
            console.log("Quest completed!");
            const reward = Math.floor(Math.random() * 51) + 50; // 50-100 gold
            this.player.gold += reward;
            console.log(`Received ${reward} gold as reward!`);
            this.activeQuest = null;
        }
    }
}

module.exports = {
    Game
};