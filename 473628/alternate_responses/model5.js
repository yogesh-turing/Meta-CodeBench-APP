class ChatBot {
    constructor(intents = {}, responses = {}, entities = {}) {
        this.intents = intents;
        this.responses = responses;
        this.entities = entities;
        this.conversations = new Map();
    }

    startConversation() {
        const conversationId = Date.now().toString();
        this.conversations.set(conversationId, {
            context: null,
            history: [],
            lastIntent: null
        });
        return conversationId;
    }

    validateConversation(conversationId) {
        if (!this.conversations.has(conversationId)) {
            throw new Error('Invalid conversation ID');
        }
    }

    getContext(conversationId) {
        this.validateConversation(conversationId);
        return this.conversations.get(conversationId).context;
    }

    processInput(input, conversationId) {
        this.validateConversation(conversationId);
        
        const conversation = this.conversations.get(conversationId);
        const lowercaseInput = input.toLowerCase();

        // Check for follow-up questions
        if (conversation.lastIntent === 'library_hours' && 
            lowercaseInput.includes('weekend')) {
            return this.responses['library_hours_weekend'];
        }

        // Check for entity mentions
        for (const [entity, response] of Object.entries(this.entities)) {
            if (lowercaseInput.includes(entity.toLowerCase())) {
                conversation.context = entity;
                conversation.lastIntent = 'entity';
                return response;
            }
        }

        // Process intents
        for (const [intent, keywords] of Object.entries(this.intents)) {
            if (keywords.some(keyword => lowercaseInput.includes(keyword))) {
                conversation.context = intent;
                conversation.lastIntent = intent;
                conversation.history.push({
                    input: input,
                    intent: intent,
                    timestamp: new Date()
                });
                return this.responses[intent];
            }
        }

        // Handle default case
        conversation.history.push({
            input: input,
            intent: 'unknown',
            timestamp: new Date()
        });
        return this.responses.default;
    }

    addIntent(intent, keywords, response) {
        if (!intent || !keywords || !response) {
            throw new Error('Intent, keywords, and response are required');
        }
        this.intents[intent] = keywords;
        this.responses[intent] = response;
    }

    endConversation(conversationId) {
        this.validateConversation(conversationId);
        return this.conversations.delete(conversationId);
    }

    getConversationHistory(conversationId) {
        this.validateConversation(conversationId);
        return this.conversations.get(conversationId).history;
    }
}

module.exports = { ChatBot };