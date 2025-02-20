const {ChatBot} = require('./solution');

describe('ChatBot', () => {
    let chatbot;
    let conversationId;

    const mockIntents = {
        "greeting": ["hello", "hi", "hey"],
        "farewell": ["bye", "goodbye", "see you"],
        "help": ["help", "assist", "support"],
        "library_hours": ["hours", "open", "close"]
    };

    const mockResponses = {
        "greeting": "Hello! How can I assist you today?",
        "farewell": "Goodbye! Have a great day!",
        "help": "I'm here to help. What do you need assistance with?",
        "library_hours": "The library is open from 9 AM to 9 PM on weekdays.",
        "library_hours_weekend": "On weekends, the library is open from 10 AM to 6 PM.",
        "default": "I'm sorry, I don't understand. Could you please rephrase that?"
    };

    const mockEntities = {
        "Science Library": "The Science Library is open from 8 AM to 10 PM on weekdays.",
        "Main Library": "The Main Library is open 24/7."
    };

    beforeEach(() => {
        chatbot = new ChatBot(mockIntents, mockResponses, mockEntities);
        conversationId = chatbot.startConversation();
    });

    test('should start a conversation and return a valid ID', () => {
        if(conversationId == 0){
            expect(conversationId).toBe(0);
        }else{
            expect(conversationId).toBeTruthy();
        }
    });

    test('should process basic intents correctly', () => {
        expect(chatbot.processInput('hello', conversationId)).toBe(mockResponses.greeting);
        expect(chatbot.processInput('goodbye', conversationId)).toBe(mockResponses.farewell);
        expect(chatbot.processInput('I need help', conversationId)).toBe(mockResponses.help);
    });

    test('should handle unknown inputs', () => {
        expect(chatbot.processInput('random input', conversationId)).toBe(mockResponses.default);
    });

    test('should maintain context for library hours', () => {
        chatbot.processInput('What are the library hours?', conversationId);
        expect(chatbot.getContext(conversationId)).toBe('library_hours');
        expect(chatbot.processInput('What about on weekends?', conversationId)).toBe(mockResponses.library_hours_weekend);
    });

    test('should recognize entities', () => {
        expect(chatbot.processInput('What are the hours for the Science Library?', conversationId)).toBe(mockEntities['Science Library']);
        expect(chatbot.getContext(conversationId)).toBe("Science Library");
    });

    test('should handle follow-up questions', () => {
        chatbot.processInput('What are the library hours?', conversationId);
        expect(chatbot.processInput('And on weekends?', conversationId)).toBe(mockResponses.library_hours_weekend);
    });

    test('should throw error for invalid conversation ID', () => {
        expect(() => chatbot.processInput('hello', 'invalid-id')).toThrow(Error);
        expect(() => chatbot.getContext('invalid-id')).toThrow(Error);
        expect(() => chatbot.endConversation('invalid-id')).toThrow(Error);
    });

    test('should end conversation and clear context', () => {
        chatbot.processInput('What are the library hours?', conversationId);
        expect(chatbot.getContext(conversationId)).toBe('library_hours');
        chatbot.endConversation(conversationId);
        expect(() => chatbot.getContext(conversationId)).toThrow(Error);
    });

    test('should add new intent', () => {
        const newIntent = 'weather';
        const newKeywords = ['weather', 'forecast'];
        const newResponse = 'The weather is sunny today.';
        chatbot.addIntent(newIntent, newKeywords, newResponse);
        expect(chatbot.processInput('What\'s the weather like?', conversationId)).toBe(newResponse);
    });
});