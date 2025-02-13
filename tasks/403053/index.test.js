const {TextEditor} = require('./incorrect');

describe('TextEditor', () => {
    let editor;

    beforeEach(() => {
        editor = new TextEditor();
    });

    test('basic insert and delete operations', () => {
        editor.insert(0, 'Hello');
        expect(editor.getContent()).toBe('Hello');
        
        editor.insert(5, ' World');
        expect(editor.getContent()).toBe('Hello World');
        
        editor.delete(5, 11);
        expect(editor.getContent()).toBe('Hello');
    });

    test('basic undo and redo operations', () => {
        editor.insert(0, 'Hello');
        editor.insert(5, ' World');
        
        editor.undo();
        expect(editor.getContent()).toBe('Hello');
        
        editor.redo();
        expect(editor.getContent()).toBe('Hello World');
    });

    test('error handling for invalid positions', () => {
        expect(() => editor.insert(-1, 'test')).toThrow('Invalid position');
        expect(() => editor.insert(1, 'test')).toThrow('Invalid position');
        expect(() => editor.delete(5, 2)).toThrow('Invalid position');
        expect(() => editor.delete(-1, 5)).toThrow('Invalid position');
        expect(() => editor.delete(0, 1)).toThrow('Invalid position');
    });

    test('undo/redo stack clearing after new action', () => {
        editor.insert(0, 'Hello');
        editor.insert(5, ' World');
        editor.undo();
        editor.insert(5, ' Earth');
        
        expect(editor.redo()).toBe(false);
        expect(editor.getContent()).toBe('Hello Earth');
    });

    test('group operations', () => {
        editor.beginGroup();
        editor.insert(0, 'Hello');
        editor.insert(5, ' World');
        editor.endGroup();

        expect(editor.getContent()).toBe('Hello World');
        editor.undo();
        expect(editor.getContent()).toBe('');
        editor.redo();
        expect(editor.getContent()).toBe('Hello World');
    });

    test('nested group operations error handling', () => {
        editor.beginGroup();
        expect(() => editor.beginGroup()).toThrow('Already in a group operation');
        editor.endGroup();
    });

    test('end group without begin error', () => {
        expect(() => editor.endGroup()).toThrow('No group operation in progress');
    });

    test('empty group operation', () => {
        editor.beginGroup();
        editor.endGroup();
        expect(editor.getUndoStackSize()).toBe(0);
    });

    test('stack size management for undo stack', () => {
        // Fill up the stack beyond maxStackSize
        for (let i = 0; i < 105; i++) {
            editor.insert(editor.getContent().length, 'a');
        }
        expect(editor.getUndoStackSize()).toBe(100);
    });

    test('stack size management for redo stack', () => {
        // Fill up the redo stack beyond maxStackSize
        for (let i = 0; i < 105; i++) {
            editor.insert(editor.getContent().length, 'a');
        }
        for (let i = 0; i < 105; i++) {
            editor.undo();
        }
        expect(editor.getRedoStackSize()).toBe(100);
    });

    test('undo with empty stack', () => {
        expect(editor.undo()).toBe(false);
    });

    test('redo with empty stack', () => {
        expect(editor.redo()).toBe(false);
    });

    test('group operations with delete and redo', () => {
        editor.insert(0, 'Hello World');
        editor.beginGroup();
        editor.delete(0, 5);
        editor.insert(0, 'Hi');
        editor.endGroup();
        
        expect(editor.getContent()).toBe('Hi World');
        editor.undo();
        expect(editor.getContent()).toBe('Hello World');
        editor.redo();
        expect(editor.getContent()).toBe('Hi World');
    });

    test('stack size getters', () => {
        editor.insert(0, 'test');
        expect(editor.getUndoStackSize()).toBe(1);
        expect(editor.getRedoStackSize()).toBe(0);
        
        editor.undo();
        expect(editor.getUndoStackSize()).toBe(0);
        expect(editor.getRedoStackSize()).toBe(1);
    });

    test('complex group operations with undo/redo', () => {
        // First operation outside group
        editor.insert(0, 'Hello');
        
        // Group operation
        editor.beginGroup();
        editor.delete(0, 5);
        editor.insert(0, 'Hi');
        editor.endGroup();
        
        expect(editor.getContent()).toBe('Hi');
        
        // Undo group operation
        editor.undo();
        expect(editor.getContent()).toBe('Hello');
        
        // Redo group operation
        editor.redo();
        expect(editor.getContent()).toBe('Hi');
    });

    test('multiple operations in group', () => {
        editor.beginGroup();
        editor.insert(0, 'Hello');
        editor.insert(5, ' ');
        editor.insert(6, 'World');
        editor.endGroup();
        
        expect(editor.getContent()).toBe('Hello World');
        editor.undo();
        expect(editor.getContent()).toBe('');
        editor.redo();
        expect(editor.getContent()).toBe('Hello World');
    });

    test('single operation redo', () => {
        editor.insert(0, 'Hello');
        editor.undo();
        editor.redo();
        expect(editor.getContent()).toBe('Hello');
    });

    test('single operation delete and redo', () => {
        editor.insert(0, 'Hello');
        editor.delete(0, 5);
        editor.undo();
        editor.redo();
        expect(editor.getContent()).toBe('');
    });

    test('stack size management for group operations', () => {
        // Create many group operations to test stack size limit
        for (let i = 0; i < 105; i++) {
            editor.beginGroup();
            editor.insert(0, 'a');
            editor.insert(1, 'b');
            editor.endGroup();
        }
        expect(editor.getUndoStackSize()).toBe(100);
    });

    test('mixed single and group operations', () => {
        editor.insert(0, 'Hello');
        editor.beginGroup();
        editor.insert(5, ' ');
        editor.insert(6, 'World');
        editor.endGroup();
        editor.insert(11, '!');
        
        expect(editor.getContent()).toBe('Hello World!');
        editor.undo(); // Undo the last single operation
        expect(editor.getContent()).toBe('Hello World');
        editor.undo(); // Undo the group operation
        expect(editor.getContent()).toBe('Hello');
    });

    test('group operation with multiple deletes', () => {
        editor.insert(0, 'Hello World');
        editor.beginGroup();
        editor.delete(5, 6); // Delete space
        editor.delete(5, 10); // Delete World
        editor.endGroup();
        
        expect(editor.getContent()).toBe('Hello');
        editor.undo();
        expect(editor.getContent()).toBe('Hello World');
        editor.redo();
        expect(editor.getContent()).toBe('Hello');
    });

    test('redo after undo chain', () => {
        editor.insert(0, 'Hello');
        editor.insert(5, ' World');
        editor.undo();
        editor.undo();
        editor.redo();
        expect(editor.getContent()).toBe('Hello');
    });

    test('insert empty string', () => {
        editor.insert(0, '');
        expect(editor.getContent()).toBe('');
        
        editor.insert(0, 'Hello');
        editor.insert(5, '');
        expect(editor.getContent()).toBe('Hello');
        
        editor.insert(2, '');
        expect(editor.getContent()).toBe('Hello');
    });

    test('edge cases - consecutive operations', () => {
        // Multiple consecutive empty operations
        editor.insert(0, '');
        editor.insert(0, '');
        editor.insert(0, '');
        expect(editor.getContent()).toBe('');
        
        // Rapid insert/delete at same position
        editor.insert(0, 'a');
        editor.delete(0, 1);
        editor.insert(0, 'b');
        editor.delete(0, 1);
        expect(editor.getContent()).toBe('');
    });

    test('edge cases - whitespace handling', () => {
        const spaces = '   ';
        editor.insert(0, spaces);  // Multiple spaces
        expect(editor.getContent()).toBe(spaces);
        
        const withTab = spaces + '\t';
        editor.insert(3, '\t');   // Tab character
        expect(editor.getContent()).toBe(withTab);
        
        const withNewline = withTab + '\n';
        editor.insert(4, '\n');   // Newline
        expect(editor.getContent()).toBe(withNewline);
        
        editor.undo();
        editor.undo();
        editor.undo();
        expect(editor.getContent()).toBe('');
    });

    test('edge cases - special characters', () => {
        const specialChars = '!@#$%^&*()_+{}[]|";:<>?,./`~';
        editor.insert(0, specialChars);
        expect(editor.getContent()).toBe(specialChars);
        
        // Unicode characters
        editor.insert(editor.getContent().length, '🎉👋');
        expect(editor.getContent()).toBe(specialChars + '🎉👋');
    });


    test('edge cases - maximum content manipulation', () => {
        // Create a long string
        const longString = 'a'.repeat(1000);
        editor.insert(0, longString);
        
        // Delete from middle
        editor.delete(400, 600);
        expect(editor.getContent().length).toBe(800);
        
        // Insert in middle of long content
        editor.insert(500, 'middle');
        expect(editor.getContent().includes('middle')).toBe(true);
    });

});