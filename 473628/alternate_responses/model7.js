class ChatBot {
  /**
   * @param {Object} intents - An object containing intents as keys and arrays of keywords as values.
   * @param {Object} responses - An object containing intents as keys and response strings as values.
   * @param {Object} entities - An object containing entity names as keys and response strings as values.
   */
  constructor(intents, responses, entities) {
      this.intents = intents;
      this.responses = responses;
      this.entities = entities;
      this.conversations = new Map();
  }

  /**
   * Starts a new conversation and returns a unique conversation ID.
   * @returns {string} A unique conversation ID.
   */
  startConversation() {
      const conversationId = Math.random().toString(36).substr(2, 9);
      this.conversations.set(conversationId, { context: null });
      return conversationId;
  }

  /**
   * Processes the input for a specific conversation and returns a response.
   * @param {string} input - The user's input.
   * @param {string} conversationId - The ID of the conversation.
   * @returns {string} A response to the user's input.
   */
  processInput(input, conversationId) {
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
          const followUpResponse = this.getFollowUpResponse(conversation.context, lowercaseInput);
          if (followUpResponse) {
              return followUpResponse;
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

  /**
   * Returns the current context for a given conversation.
   * @param {string} conversationId - The ID of the conversation.
   * @returns {string|null} The current context for the conversation, or null if no context is set.
   */
  getContext(conversationId) {
      if (!this.conversations.has(conversationId)) {
          throw new Error(`Invalid conversation ID: ${conversationId}`);
      }
      return this.conversations.get(conversationId).context;
  }

  /**
   * Ends a conversation and clears its context.
   * @param {string} conversationId - The ID of the conversation to end.
   */
  endConversation(conversationId) {
      if (!this.conversations.has(conversationId)) {
          throw new Error(`Invalid conversation ID: ${conversationId}`);
      }
      this.conversations.delete(conversationId);
  }

  /**
   * Returns a follow-up response for a given context and input.
   * @param {string} context - The current context.
   * @param {string} input - The user's input.
   * @returns {string|null} A follow-up response, or null if no follow-up response is found.
   */
  getFollowUpResponse(context, input) {
      switch (context) {
          case 'library_hours':
              if (input.includes('weekend')) {
                  return this.responses.library_hours_weekend;
              }
              break;
          default:
              return null;
      }
  }
}

module.exports = { ChatBot };