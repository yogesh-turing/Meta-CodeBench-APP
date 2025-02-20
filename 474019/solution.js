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
      this.turnCount = 0;
  }

  start() {
      console.log('Welcome to the Text Adventure!');
      this.player.name = 'Hero';
      this.gameLoop();
  }

  gameLoop() {
      try {
          while (!this.isGameOver) {
              this.turnCount++;
              this.printStatus();
              this.handleTurn();
              
              if (this.player.health <= 0) {
                  this.isGameOver = true;
                  console.log(`Game Over! You survived ${this.turnCount} turns!`);
              }
          }
      } catch (error) {
          console.log(`An error occurred: ${error.message}`);
          this.isGameOver = true;
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
      console.log('===============================');
  }

  handleTurn() {
      const random = Math.random() * 100;
      
      if (random < 35) { // Combat (35%)
          this.handleCombat();
      } else if (random < 60) { // Find Item (25%)
          this.handleFindItem();
      } else if (random < 80) { // Shop (20%)
          this.handleShop();
      } else if (random < 95) { // Nothing (15%)
          this.handleNothing();
      } else { // Quest (5%)
          if (!this.activeQuest) {
              this.generateNewQuest();
          }
      }

      // Auto-use potion if health is low
      if (this.player.health < 50 && this.player.inventory.includes('Potion')) {
          const potionIndex = this.player.inventory.indexOf('Potion');
          this.player.inventory.splice(potionIndex, 1);
          this.player.health = Math.min(100, this.player.health + 30);
          console.log('You used a Potion and recovered 30 health!');
      }
  }

  handleCombat() {
      const enemies = ['Goblin', 'Wolf', 'Bandit'];
      const enemy = enemies[Math.floor(Math.random() * enemies.length)];
      const ability = this.player.abilities[Math.floor(Math.random() * this.player.abilities.length)];
      
      const damage = this.calculateAbilityDamage(ability);
      const goldReward = Math.floor(Math.random() * 11) + 5; // 5-15 gold
      const expReward = Math.floor(Math.random() * 16) + 10; // 10-25 exp
      
      console.log(`You encounter a ${enemy}!`);
      console.log(`You use ${ability} and deal ${damage} damage!`);
      
      // Calculate damage taken
      let damageTaken = Math.floor(Math.random() * 21) + 5; // 5-25 damage
      if (this.player.inventory.includes('Shield')) {
          damageTaken = Math.max(0, damageTaken - 2);
      }
      if (this.player.inventory.includes('Boots') && Math.random() < 0.1) {
          damageTaken = 0;
          console.log('You dodged the attack!');
      }
      
      this.player.health = Math.max(0, this.player.health - damageTaken);
      this.player.gold += goldReward;
      this.addExperience(expReward);
      
      console.log(`You took ${damageTaken} damage and found ${goldReward} gold!`);
      
      if (this.activeQuest && this.activeQuest.type === 'kill') {
          this.activeQuest.progress++;
          this.checkQuestCompletion();
      }
  }

  handleFindItem() {
      if (this.player.inventory.length >= this.maxInventorySize) {
          console.log('Your inventory is full!');
          return;
      }

      const items = ['Sword', 'Shield', 'Potion', 'Amulet', 'Ring', 'Boots'];
      const weights = [15, 15, 25, 15, 15, 15];
      let totalWeight = weights.reduce((a, b) => a + b);
      let random = Math.random() * totalWeight;
      let itemIndex = 0;

      for (let i = 0; i < weights.length; i++) {
          if (random < weights[i]) {
              itemIndex = i;
              break;
          }
          random -= weights[i];
      }

      const item = items[itemIndex];
      
      // Check item limit (except potions)
      if (item !== 'Potion' && this.player.inventory.filter(i => i === item).length >= 2) {
          console.log(`You already have enough ${item}s.`);
          return;
      }

      this.player.inventory.push(item);
      console.log(`You found a ${item}!`);
  }

  handleShop() {
      const shopItems = [
          { name: 'Potion', cost: 20 },
          { name: 'Sword', cost: 50 },
          { name: 'Shield', cost: 40 }
      ];

      const item = shopItems[Math.floor(Math.random() * shopItems.length)];
      
      if (this.player.gold >= item.cost) {
          if (this.player.inventory.length < this.maxInventorySize) {
              this.player.gold -= item.cost;
              this.player.inventory.push(item.name);
              console.log(`You bought a ${item.name} for ${item.cost} gold!`);
          } else {
              console.log('Your inventory is full!');
          }
      } else {
          console.log(`You can't afford the ${item.name} (${item.cost} gold).`);
      }
  }

  handleNothing() {
      const messages = [
          'You continue your journey...',
          'The wind whistles through the trees...',
          'You hear distant sounds of wildlife...',
          'You take a moment to rest...'
      ];
      console.log(messages[Math.floor(Math.random() * messages.length)]);
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

  addExperience(exp) {
      if (this.player.inventory.includes('Amulet')) {
          exp += 2;
      }
      
      this.player.exp += exp;
      console.log(`Gained ${exp} experience!`);
      
      while (this.player.exp >= 100) {
          this.levelUp();
      }
  }

  levelUp() {
      this.player.level++;
      this.player.exp -= 100;
      this.player.health = 100;
      console.log(`Level Up! You are now level ${this.player.level}!`);
      
      if (this.player.level % 2 === 0) {
          const newAbilities = ['Fireball', 'Whirlwind'];
          const availableAbilities = newAbilities.filter(a => !this.player.abilities.includes(a));
          
          if (availableAbilities.length > 0) {
              const newAbility = availableAbilities[Math.floor(Math.random() * availableAbilities.length)];
              this.player.abilities.push(newAbility);
              console.log(`You learned a new ability: ${newAbility}!`);
          }
      }
  }

  generateNewQuest() {
      const questTypes = [
          { type: 'kill', description: 'Defeat 3 monsters', target: 3 },
          { type: 'gold', description: 'Collect 50 gold', target: 50 },
          { type: 'item', description: 'Find 2 items', target: 2 }
      ];

      this.activeQuest = {
          ...questTypes[Math.floor(Math.random() * questTypes.length)],
          progress: 0
      };
      
      console.log(`New Quest: ${this.activeQuest.description}`);
  }

  checkQuestCompletion() {
      if (!this.activeQuest) return;

      if (this.activeQuest.progress >= this.activeQuest.target) {
          console.log('Quest Complete!');
          const goldReward = Math.floor(Math.random() * 31) + 20; // 20-50 gold
          const expReward = Math.floor(Math.random() * 26) + 25; // 25-50 exp
          
          this.player.gold += goldReward;
          this.addExperience(expReward);
          console.log(`Rewards: ${goldReward} gold and ${expReward} experience!`);
          
          this.activeQuest = null;
      }
  }
}

module.exports = {
  Game
};