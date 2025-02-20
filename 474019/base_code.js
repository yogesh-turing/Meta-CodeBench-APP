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
    }

    gameLoop() {
    }

    printStatus() {
    }

    handleTurn() {
    }

    calculateAbilityDamage(ability) {
    }

    addExperience(exp) {
    }

    levelUp() {
    }

    generateNewQuest() {
    }

    checkQuestCompletion() {
    }
}

module.exports = {
    Game
}