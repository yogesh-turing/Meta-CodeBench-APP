class ChatBot {
    constructor(intents = {}, responses = {}, entities = {}) {
        this.intents = intents;
        this.responses = responses;
        this.entities = entities;
        this.conversations = new Map();
        this.nextConversationId = 1;
    }

    startConversation() {
        const conversationId = this.nextConversationId++;
        this.conversations.set(conversationId, {
            context: null,
            lastEntity: null,
            timestamp: Date.now()
        });
        return conversationId;
    }

    validateConversation(conversationId) {
        if (!this.conversations.has(conversationId)) {
            throw new Error(`Invalid conversation ID: ${conversationId}`);
        }
    }

    processInput(input, conversationId) {
        this.validateConversation(conversationId);
        const conversation = this.conversations.get(conversationId);
        const lowercaseInput = input.toLowerCase();

        // Check for entities first
        for (const [entity, response] of Object.entries(this.entities)) {
            if (lowercaseInput.includes(entity.toLowerCase())) {
                conversation.lastEntity = entity;
                conversation.context = 'entity';
                return response;
            }
        }

        // Check for follow-up questions
        if (conversation.context) {
            if (lowercaseInput.includes('weekend') && conversation.context === 'library_hours') {
                return this.responses.library_hours_weekend;
            }
        }

        // Process regular intents
        for (const [intent, keywords] of Object.entries(this.intents)) {
            if (keywords.some(keyword => lowercaseInput.includes(keyword))) {
                conversation.context = intent;
                return this.responses[intent];
            }
        }

        // If no match found, maintain context but return default response
        return this.responses.default;
    }

    getContext(conversationId) {
        this.validateConversation(conversationId);
        const conversation = this.conversations.get(conversationId);
        return {
            context: conversation.context,
            lastEntity: conversation.lastEntity
        };
    }

    endConversation(conversationId) {
        this.validateConversation(conversationId);
        return this.conversations.delete(conversationId);
    }

    addIntent(intent, keywords, response) {
        if (!Array.isArray(keywords)) {
            throw new Error('Keywords must be an array');
        }
        this.intents[intent] = keywords;
        this.responses[intent] = response;
    }

    addEntity(entity, response) {
        if (typeof entity !== 'string' || typeof response !== 'string') {
            throw new Error('Entity and response must be strings');
        }
        this.entities[entity] = response;
    }
}

module.exports = { ChatBot };