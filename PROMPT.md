Base Code:
```JavaScript
class TextEditor {
    constructor() {
        this.content = '';
        this.undoStack = [];
        this.redoStack = [];
        this.groupOperationStack = [];
        this.isGrouping = false;
        this.maxStackSize = 100;  // Limit stack size for memory efficiency
    }
    


    // Get current content
    getContent() {
        return this.content;
    }

    // Get the current undo stack size
    getUndoStackSize() {
        return this.undoStack.length;
    }

    // Get the current redo stack size
    getRedoStackSize() {
        return this.redoStack.length;
    }
}

module.exports = {TextEditor};
```
Prompt:
The `TextEditor` class is a text editor with various functionalities. 
I want it enhanced with the ability to insert a text. The `insert` method takes the position and text to be inserted. If the position is invalid, the error should be "Invalid position". 

An operation has a `type`, `position`, `text` and `oldContent`. 

Also It should be enhanced with a `delete` operation which takes the starting position and end position of where to be deleted exclusive. 

Also implement `beginGroup` and `endGroup` to mark the start and end of grouped operations. If an operation is already in a group, the error should be "Already in a group operation" and if it's not in a group operation but the `endGroup` is called, the error should be "No group operation in progress". 

Lastly it should have `redo` and `undo` functionalities. Group operations have a type of 'group'. If the `redo` or `undo` operation is successful it should return `true` else `false`.