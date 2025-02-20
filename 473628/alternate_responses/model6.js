class ChatBot {
  constructor(intents, responses, entities) {
    this.intents = intents;
    this.responses = responses;
    this.entities = entities;
    this.conversations = new Map();
  }

  startConversation() {
    const conversationId = Math.random().toString(36).substr(2, 9);
    this.conversations.set(conversationId, { context: null });
    return conversationId;
  }

  processInput(input, conversationId) {
    if (!this.conversations.has(conversationId)) {
      throw new Error(`Invalid conversation ID: ${conversationId}`);
    }

    const conversation = this.conversations.get(conversationId);
    const lowercaseInput = input.toLowerCase();

    // Check if the input matches any entities
    for (const [entity, response] of Object.entries(this.entities)) {
      if (lowercaseInput.includes(entity.toLowerCase())) {
        return response;
      }
    }

    // Check if the input matches any intents
    for (const [intent, keywords] of Object.entries(this.intents)) {
      if (keywords.some(keyword => lowercaseInput.includes(keyword))) {
        conversation.context = intent;
        return this.responses[intent];
      }
    }

    // Check if the input is a follow-up question
    if (conversation.context) {
      const followUpResponse = this.getFollowUpResponse(conversation.context, lowercaseInput);
      if (followUpResponse) {
        return followUpResponse;
      }
    }

    return this.responses.default;
  }

  getFollowUpResponse(context, input) {
    switch (context) {
      case "library_hours":
        if (input.includes("weekend")) {
          return this.responses.library_hours_weekend;
        }
        break;
      default:
        return null;
    }
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