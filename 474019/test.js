const { Game } = require("./solution"); // Replace functionNames with the correct function(s)

describe("Game Class", () => {
  let game;
  let consoleSpy;

  beforeEach(() => {
    game = new Game();
    consoleSpy = jest.spyOn(console, "log").mockImplementation();
    jest.useFakeTimers();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    jest.useRealTimers();
  });

  describe("Constructor and Initial State", () => {
    test("should initialize with correct default values", () => {
      expect(game.player).toEqual({
        name: "",
        health: 100,
        inventory: [],
        gold: 0,
        level: 1,
        exp: 0,
        abilities: ["Strike"],
      });
      expect(game.isGameOver).toBeFalsy();
      expect(game.activeQuest).toBeNull();
      expect(game.maxInventorySize).toBe(10);
    });
  });

  describe("start()", () => {
    test("should set player name and start game", () => {
      game.start();
      expect(game.player.name).toBe("Hero");
      expect(consoleSpy).toHaveBeenCalled();
    });

    test("should only run once", () => {
      const gameLoopSpy = jest.spyOn(game, "gameLoop");
      game.start();
      expect(gameLoopSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("gameLoop()", () => {
    test("should end game when health reaches 0", async () => {
      game.player.health = 0;
      const loopPromise = game.gameLoop();
      await jest.runAllTimersAsync();
      await loopPromise;

      expect(game.isGameOver).toBeTruthy();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Game Over!")
      );
    });

    test("should handle errors without crashing", async () => {
      const mockPrintStatus = jest
        .spyOn(game, "printStatus")
        .mockImplementation(() => {
          throw new Error("Test error");
        });

      const loopPromise = game.gameLoop();
      await jest.runAllTimersAsync();
      await loopPromise;

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("error occurred")
      );
      mockPrintStatus.mockRestore();
    });
  });

  describe("printStatus()", () => {
    beforeEach(() => {
      game.player.name = "Hero";
      game.player.inventory = ["Sword", "Potion"];
    });

    test("should display all required status elements in correct order", () => {
      game.printStatus();
      const output = consoleSpy.mock.calls.map((call) => call[0]);

      expect(output).toEqual(
        expect.arrayContaining([
          expect.stringContaining("=== Hero's Status ==="),
          expect.stringContaining("Level: 1 (EXP: 0/100)"),
          expect.stringContaining("Health: 100/100"),
          expect.stringContaining("Gold: 0"),
          expect.stringContaining("Inventory (2/10): Sword, Potion"),
          expect.stringContaining("Abilities: Strike"),
        ])
      );
    });

    test('should show "empty" for empty inventory', () => {
      game.player.inventory = [];
      game.printStatus();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Inventory (0/10): empty")
      );
    });

    test("should display quest information when active", () => {
      game.activeQuest = {
        description: "Test Quest",
        progress: 1,
        target: 5,
      };
      game.printStatus();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Quest: Test Quest (1/5)")
      );
    });
  });

  describe("handleTurn()", () => {
    test("should handle combat event correctly", () => {
      const mockMath = Object.create(global.Math);
      mockMath.random = () => 0.1;
      global.Math = mockMath;

      game.handleTurn();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/encounter|attack/)
      );
    });

    test("should respect inventory size limit", () => {
      game.player.inventory = Array(10).fill("Sword");
      game.handleTurn();
      expect(game.player.inventory.length).toBeLessThanOrEqual(10);
    });

    test("should respect item type limit", () => {
      game.player.inventory = ["Sword", "Sword", "Shield"];
      game.handleTurn();
      const swordCount = game.player.inventory.filter(
        (i) => i === "Sword"
      ).length;
      expect(swordCount).toBeLessThanOrEqual(2);
    });

    test("should auto-use potion when health is low", () => {
      game.player.health = 40;
      game.player.inventory = ["Potion"];
      game.handleTurn();
      expect(game.player.inventory).not.toContain("Potion");
      expect(game.player.health).toBeGreaterThan(40);
    });
  });

  describe("calculateAbilityDamage()", () => {
    test("should calculate Strike damage correctly", () => {
      const damage = game.calculateAbilityDamage("Strike");
      expect(damage).toBeGreaterThanOrEqual(10);
      expect(damage).toBeLessThanOrEqual(25);
    });

    test("should add Sword bonus to Strike", () => {
      game.player.inventory = ["Sword"];
      const damage = game.calculateAbilityDamage("Strike");
      expect(damage).toBeGreaterThanOrEqual(15);
      expect(damage).toBeLessThanOrEqual(30);
    });

    test("should calculate Fireball damage correctly", () => {
      game.player.abilities.push("Fireball");
      const damage = game.calculateAbilityDamage("Fireball");
      expect(damage).toBeGreaterThanOrEqual(15);
      expect(damage).toBeLessThanOrEqual(40);
    });

    test("should add Ring bonus to Fireball", () => {
      game.player.abilities.push("Fireball");
      game.player.inventory = ["Ring"];
      const damage = game.calculateAbilityDamage("Fireball");
      expect(damage).toBeGreaterThanOrEqual(18);
      expect(damage).toBeLessThanOrEqual(43);
    });

    test("should calculate Whirlwind damage correctly", () => {
      game.player.abilities.push("Whirlwind");
      const damage = game.calculateAbilityDamage("Whirlwind");
      expect(damage).toBeGreaterThanOrEqual(12);
      expect(damage).toBeLessThanOrEqual(32);
    });

    test("should handle unknown abilities", () => {
      const damage = game.calculateAbilityDamage("UnknownAbility");
      expect(damage).toBeGreaterThanOrEqual(5);
      expect(damage).toBeLessThanOrEqual(15);
    });

    test("should return whole numbers", () => {
      const damage = game.calculateAbilityDamage("Strike");
      expect(Number.isInteger(damage)).toBeTruthy();
    });

    test("should stack multiple item bonuses", () => {
      game.player.inventory = ["Sword", "Amulet"];
      const damage = game.calculateAbilityDamage("Strike");
      expect(damage).toBeGreaterThanOrEqual(17);
      expect(damage).toBeLessThanOrEqual(32);
    });
  });

  describe("addExperience", () => {
    test("should add experience correctly", () => {
      game.addExperience(50);
      expect(game.player.exp).toBe(50);
    });

    test("should trigger level up at 100 exp", () => {
      game.addExperience(100);
      expect(game.player.level).toBe(2);
      expect(game.player.exp).toBe(0);
    });

    test("should handle multiple level ups", () => {
      game.addExperience(250);
      expect(game.player.level).toBe(3);
      expect(game.player.exp).toBe(50);
    });
  });

  describe("levelUp", () => {
    test("should increase level and reset health", () => {
      game.player.health = 30;
      game.levelUp();
      expect(game.player.level).toBe(2);
      expect(game.player.health).toBe(100);
    });

    test("should add new ability at even levels", () => {
      game.player.level = 1;
      game.levelUp();
      expect(game.player.abilities.length).toBe(2);
      expect(["Fireball", "Whirlwind"]).toContain(game.player.abilities[1]);
    });

    test("should not add ability at odd levels", () => {
      game.levelUp();
      game.levelUp();
      expect(game.player.abilities.length).toBe(2);
    });
  });

  describe("generateNewQuest", () => {
    test("should generate valid quest", () => {
      game.generateNewQuest();
      expect(game.activeQuest).toHaveProperty("type");
      expect(game.activeQuest).toHaveProperty("description");
      expect(game.activeQuest).toHaveProperty("target");
      expect(game.activeQuest).toHaveProperty("progress");
      expect(game.activeQuest.progress).toBe(0);
    });

    test("should not generate quest if one is active", () => {
      game.generateNewQuest();
      const firstQuest = { ...game.activeQuest };
      game.generateNewQuest();
      expect(game.activeQuest).toEqual(firstQuest);
    });
  });

  describe("checkQuestCompletion", () => {
    test("should complete quest when progress meets target", () => {
      game.activeQuest = {
        type: "kill",
        description: "Test Quest",
        target: 1,
        progress: 1,
      };
      game.checkQuestCompletion();
      expect(game.activeQuest).toBeNull();
    });

    test("should not complete quest when progress is insufficient", () => {
      game.activeQuest = {
        type: "kill",
        description: "Test Quest",
        target: 2,
        progress: 1,
      };
      game.checkQuestCompletion();
      expect(game.activeQuest).not.toBeNull();
    });
  });
});
