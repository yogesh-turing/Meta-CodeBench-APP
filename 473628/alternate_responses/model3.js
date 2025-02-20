class ChatBot {
    constructor(intents = {}, responses = {}, entities = {}) {
        this.intents = intents;
        this.responses = responses;
        this.entities = entities;
        this.conversations = new Map();
    }

    startConversation() {
        const conversationId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        this.conversations.set(conversationId, {
            context: null,
            lastIntent: null,
            timestamp: Date.now()
        });
        return conversationId;
    }

    validateConversation(conversationId) {
        if (!this.conversations.has(conversationId)) {
            throw new Error('Invalid conversation ID');
        }
    }

    processInput(input, conversationId) {
        this.validateConversation(conversationId);
        const conversation = this.conversations.get(conversationId);
        const lowercaseInput = input.toLowerCase();

        // Check for entities first
        for (const [entity, response] of Object.entries(this.entities)) {
            if (lowercaseInput.includes(entity.toLowerCase())) {
                conversation.context = 'entity';
                conversation.lastIntent = entity;
                return response;
            }
        }

        // Handle follow-up questions
        if (conversation.context === 'library_hours' && 
            lowercaseInput.includes('weekend')) {
            return this.responses.library_hours_weekend;
        }

        // Check for intents
        for (const [intent, keywords] of Object.entries(this.intents)) {
            if (keywords.some(keyword => lowercaseInput.includes(keyword))) {
                conversation.context = intent;
                conversation.lastIntent = intent;
                return this.responses[intent];
            }
        }

        // If no match found but we have context
        if (conversation.context) {
            const contextResponse = this.handleContextualResponse(lowercaseInput, conversation);
            if (contextResponse) return contextResponse;
        }

        return this.responses.default;
    }

    handleContextualResponse(input, conversation) {
        // Add specific context-based responses
        if (conversation.context === 'library_hours') {
            if (input.includes('weekend')) {
                return this.responses.library_hours_weekend;
            }
        }
        return null;
    }

    getContext(conversationId) {
        this.validateConversation(conversationId);
        const conversation = this.conversations.get(conversationId);
        return conversation.context;
    }

    endConversation(conversationId) {
        this.validateConversation(conversationId);
        return this.conversations.delete(conversationId);
    }

    addIntent(intent, keywords, response) {
        this.intents[intent] = keywords;
        this.responses[intent] = response;
    }

    // Helper method to clean up old conversations
    cleanupOldConversations(maxAge = 30 * 60 * 1000) { // 30 minutes default
        const now = Date.now();
        for (const [id, conversation] of this.conversations.entries()) {
            if (now - conversation.timestamp > maxAge) {
                this.conversations.delete(id);
            }
        }
    }
}

module.exports = { ChatBot };