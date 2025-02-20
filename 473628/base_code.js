class ChatBot {
  constructor() {
      this.intents = {
          "greeting": ["hello", "hi", "hey"],
          "farewell": ["bye", "goodbye", "see you"],
          "help": ["help", "assist", "support"],
          "library_hours": ["hours", "open", "close"]
      };
      this.responses = {
          "greeting": "Hello! How can I assist you today?",
          "farewell": "Goodbye! Have a great day!",
          "help": "I'm here to help. What do you need assistance with?",
          "library_hours": "The library is open from 9 AM to 9 PM on weekdays.",
          "library_hours_weekend": "On weekends, the library is open from 10 AM to 6 PM.",
          "default": "I'm sorry, I don't understand. Could you please rephrase that?"
      };
      this.entities = {
          "Science Library": "The Science Library is open from 8 AM to 10 PM on weekdays.",
          "Main Library": "The Main Library is open 24/7."
      };
  }

  processInput(input) {
      const lowercaseInput = input.toLowerCase();
      for (const [intent, keywords] of Object.entries(this.intents)) {
          if (keywords.some(keyword => lowercaseInput.includes(keyword))) {
              return this.responses[intent];
          }
      }
      return this.responses.default;
  }

  addIntent(intent, keywords, response) {
      this.intents[intent] = keywords;
      this.responses[intent] = response;
  }
}

module.exports = {ChatBot};