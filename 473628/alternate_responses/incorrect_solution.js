class ChatBot {
  constructor(intents, responses, entities) {
    this.intents = intents;
    this.responses = responses;
    this.entities = entities;
    this.conversations = new Map();
    this.conversationIdCounter = 0;
  }

  startConversation() {
    const conversationId = this.conversationIdCounter++;
    this.conversations.set(conversationId, { context: null });
    return conversationId;
  }

  processInput(conversationId, input) {
    if (!this.conversations.has(conversationId)) {
      throw new Error(`Invalid conversation ID: ${conversationId}`);
    }

    const conversation = this.conversations.get(conversationId);
    const lowercaseInput = input.toLowerCase();

    // Check for entity recognition
    for (const [entity, response] of Object.entries(this.entities)) {
      if (lowercaseInput.includes(entity.toLowerCase())) {
        return response;
      }
    }

    // Check for follow-up questions
    if (conversation.context) {
      const followUpIntent = `${conversation.context}_follow_up`;
      if (this.intents[followUpIntent]) {
        for (const keyword of this.intents[followUpIntent]) {
          if (lowercaseInput.includes(keyword)) {
            return this.responses[followUpIntent];
          }
        }
      }
    }

    // Check for intents
    for (const [intent, keywords] of Object.entries(this.intents)) {
      if (keywords.some(keyword => lowercaseInput.includes(keyword))) {
        conversation.context = intent;
        return this.responses[intent];
      }
    }

    // Default response
    return this.responses.default;
  }

  getContext(conversationId) {
    if (!this.conversations.has(conversationId)) {
      throw new Error(`Invalid conversation ID: ${conversationId}`);
    }
    return this.conversations.get(conversationId).context;
  }

  endConversation(conversationId) {
    if (!this.conversations.has(conversationId)) {
      throw new Error(`Invalid conversation ID: ${conversationId}`);
    }
    this.conversations.delete(conversationId);
  }

  addIntent(intent, keywords, response) {
    this.intents[intent] = keywords;
    this.responses[intent] = response;
  }
}

module.exports = { ChatBot };