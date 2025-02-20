class ChatBot {
    constructor(intents, responses, entities) {
        this.intents = intents;
        this.responses = responses;
        this.entities = entities;
        this.conversations = new Map();
    }

    startConversation() {
        const conversationId = Date.now().toString();
        this.conversations.set(conversationId, { context: null, lastIntent: null });
        return conversationId;
    }

    processInput(input, conversationId) {
        if (!this.conversations.has(conversationId)) {
            throw new Error("Invalid conversation ID");
        }

        const conversation = this.conversations.get(conversationId);
        const lowercaseInput = input.toLowerCase();

        // Check for entities
        for (const [entity, response] of Object.entries(this.entities)) {
            if (lowercaseInput.includes(entity.toLowerCase())) {
                conversation.context = entity;
                return response;
            }
        }

        // Check for intents
        for (const [intent, keywords] of Object.entries(this.intents)) {
            if (keywords.some(keyword => lowercaseInput.includes(keyword))) {
                conversation.lastIntent = intent;
                if (intent === 'library_hours') {
                    conversation.context = 'library_hours';
                }
                return this.responses[intent];
            }
        }

        // Handle follow-up questions
        if (conversation.context === 'library_hours' && lowercaseInput.includes('weekend')) {
            return this.responses.library_hours_weekend;
        }

        conversation.context = null;
        return this.responses.default;
    }

    getContext(conversationId) {
        if (!this.conversations.has(conversationId)) {
            throw new Error("Invalid conversation ID");
        }
        return this.conversations.get(conversationId).context;
    }

    endConversation(conversationId) {
        if (!this.conversations.has(conversationId)) {
            throw new Error("Invalid conversation ID");
        }
        this.conversations.delete(conversationId);
    }

    addIntent(intent, keywords, response) {
        this.intents[intent] = keywords;
        this.responses[intent] = response;
    }
}

module.exports = {ChatBot};