class TextEditor {
  constructor() {
      this.content = '';
      this.undoStack = [];
      this.redoStack = [];
      this.groupOperationStack = [];
      this.isGrouping = false;
      this.maxStackSize = 100;  // Limit stack size for memory efficiency
  }

  // Insert text at a specific position
  insert(position, text) {
      if (position < 0 || position > this.content.length) {
          throw new Error("Invalid position");
      }

      const oldContent = this.content;
      this.content = this.content.substring(0, position) + text + this.content.substring(position);

      this.undoStack.push({
          type: 'insert',
          position,
          text,
          oldContent
      });
      this.redoStack = []; // Clear redo stack after a new operation

      if (this.undoStack.length > this.maxStackSize) {
          this.undoStack.shift();
      }
  }

  // Delete text from a specific position
  delete(startPosition, endPosition) {
      if (startPosition < 0 || startPosition > this.content.length || endPosition < 0 || endPosition > this.content.length || startPosition > endPosition) {
          throw new Error("Invalid position");
      }

      const oldContent = this.content;
      this.content = this.content.substring(0, startPosition) + this.content.substring(endPosition);

      this.undoStack.push({
          type: 'delete',
          startPosition,
          endPosition,
          oldContent
      });
      this.redoStack = []; // Clear redo stack after a new operation

      if (this.undoStack.length > this.maxStackSize) {
          this.undoStack.shift();
      }
  }

  // Begin a group operation
  beginGroup() {
      if (this.isGrouping) {
          throw new Error("Already in a group operation");
      }
      this.isGrouping = true;
      this.groupOperationStack.push({
          type: 'group'
      });
  }

  // End a group operation
  endGroup() {
      if (!this.isGrouping) {
          throw new Error("No group operation in progress");
      }
      this.isGrouping = false;
      this.undoStack.push(this.groupOperationStack.pop());
      this.redoStack = []; // Clear redo stack after a new operation
  }

  // Undo the last operation
  undo() {
      if (this.undoStack.length === 0) {
          return false;
      }

      const operation = this.undoStack.pop();
      if (operation.type === 'insert') {
          this.content = operation.oldContent;
      } else if (operation.type === 'delete') {
          this.content = operation.oldContent;
      } else if (operation.type === 'group') {
          // Handle group operation
      }

      this.redoStack.push(operation);
      return true;
  }

  // Redo the last undone operation
  redo() {
      if (this.redoStack.length === 0) {
          return false;
      }

      const operation = this.redoStack.pop();
      if (operation.type === 'insert') {
          this.content = this.content.substring(0, operation.position) + operation.text + this.content.substring(operation.position);
      } else if (operation.type === 'delete') {
          this.content = this.content.substring(0, operation.startPosition) + this.content.substring(operation.endPosition);
      } else if (operation.type === 'group') {
          // Handle group operation
      }

      this.undoStack.push(operation);
      return true;
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

module.exports = { TextEditor };