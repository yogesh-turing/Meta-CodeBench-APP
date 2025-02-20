class ChatBot {
    constructor(intents = {}, responses = {}, entities = {}) {
        this.intents = intents;
        this.responses = responses;
        this.entities = entities;
        this.conversations = new Map();
        this.nextConversationId = 1;
    }

    startConversation() {
        const conversationId = `conv_${this.nextConversationId++}`;
        this.conversations.set(conversationId, {
            context: null,
            lastIntent: null,
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

        // If no match found, but we have context
        if (conversation.context && this.responses[`${conversation.context}_followup`]) {
            return this.responses[`${conversation.context}_followup`];
        }

        return this.responses.default;
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
}

module.exports = { ChatBot };