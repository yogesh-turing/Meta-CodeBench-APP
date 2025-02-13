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

  // Insert text at a specified position
  insert(position, text) {
      if (position < 0 || position > this.content.length) {
          throw new Error("Invalid position");
      }

      const oldContent = this.content;
      this.content = this.content.slice(0, position) + text + this.content.slice(position);
      this.pushOperation({
          type: 'insert',
          position,
          text,
          oldContent
      });
  }

  // Delete text within a specified range
  delete(start, end) {
      if (start < 0 || end > this.content.length || start >= end) {
          throw new Error("Invalid position");
      }

      const oldContent = this.content;
      this.content = this.content.slice(0, start) + this.content.slice(end);
      this.pushOperation({
          type: 'delete',
          start,
          end,
          oldContent
      });
  }

  // Begin a group operation
  beginGroup() {
      if (this.isGrouping) {
          throw new Error("Already in a group operation");
      }
      this.isGrouping = true;
      this.groupOperationStack.push({ type: 'group' });
  }

  // End a group operation
  endGroup() {
      if (!this.isGrouping) {
          throw new Error("No group operation in progress");
      }
      this.isGrouping = false;
      this.pushOperation({ type: 'group' });
  }

  // Undo the last operation
  undo() {
      if (this.undoStack.length === 0) {
          return false;
      }

      const operation = this.undoStack.pop();
      this.redoStack.push(operation);

      if (operation.type === 'insert') {
          this.content = operation.oldContent;
      } else if (operation.type === 'delete') {
          this.content = operation.oldContent;
      } else if (operation.type === 'group') {
          this.groupOperationStack.pop();
      }

      return true;
  }

  // Redo the last undone operation
  redo() {
      if (this.redoStack.length === 0) {
          return false;
      }

      const operation = this.redoStack.pop();
      this.undoStack.push(operation);

      if (operation.type === 'insert') {
          this.content = operation.oldContent.slice(0, operation.position) + operation.text + operation.oldContent.slice(operation.position);
      } else if (operation.type === 'delete') {
          this.content = operation.oldContent.slice(0, operation.start) + operation.oldContent.slice(operation.end);
      } else if (operation.type === 'group') {
          this.groupOperationStack.push({ type: 'group' });
      }

      return true;
  }

  // Helper function to push operations onto the undo stack
  pushOperation(operation) {
      this.undoStack.push(operation);
      this.redoStack = []; // Clear redo stack after a new operation

      // Limit stack size for memory efficiency
      if (this.undoStack.length > this.maxStackSize) {
          this.undoStack.shift();
      }
  }
}

module.exports = {TextEditor};