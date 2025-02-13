class TextEditor {
  constructor() {
      this.content = '';
      this.undoStack = [];
      this.redoStack = [];
      this.groupOperationStack = [];
      this.isGrouping = false;
      this.maxStackSize = 100;  // Limit stack size for memory efficiency
  }

  // Insert text at a specified position
  insert(position, text) {
      if (position < 0 || position > this.content.length) {
          throw new Error("Invalid position");
      }

      const oldContent = this.content;
      this.content = this.content.slice(0, position) + text + this.content.slice(position);

      if (this.isGrouping) {
          this.groupOperationStack.push({
              type: 'insert',
              position,
              text,
              oldContent
          });
      } else {
          this.undoStack.push({
              type: 'insert',
              position,
              text,
              oldContent
          });
          this.redoStack = [];  // Clear redo stack after new operation
      }

      // Limit stack size for memory efficiency
      if (this.undoStack.length > this.maxStackSize) {
          this.undoStack.shift();
      }
  }

  // Delete text between two positions
  delete(startPosition, endPosition) {
      if (startPosition < 0 || endPosition > this.content.length || startPosition > endPosition) {
          throw new Error("Invalid position");
      }

      const oldContent = this.content;
      this.content = this.content.slice(0, startPosition) + this.content.slice(endPosition);

      if (this.isGrouping) {
          this.groupOperationStack.push({
              type: 'delete',
              startPosition,
              endPosition,
              oldContent
          });
      } else {
          this.undoStack.push({
              type: 'delete',
              startPosition,
              endPosition,
              oldContent
          });
          this.redoStack = [];  // Clear redo stack after new operation
      }

      // Limit stack size for memory efficiency
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
  }

  // End a group operation
  endGroup() {
      if (!this.isGrouping) {
          throw new Error("No group operation in progress");
      }

      this.undoStack.push({
          type: 'group',
          operations: this.groupOperationStack
      });
      this.groupOperationStack = [];
      this.isGrouping = false;
      this.redoStack = [];  // Clear redo stack after new operation
  }

  // Undo the last operation
  undo() {
      if (this.undoStack.length === 0) {
          return false;
      }

      const operation = this.undoStack.pop();

      if (operation.type === 'group') {
          for (let i = operation.operations.length - 1; i >= 0; i--) {
              const op = operation.operations[i];
              if (op.type === 'insert') {
                  this.content = op.oldContent;
              } else if (op.type === 'delete') {
                  this.content = op.oldContent;
              }
          }
      } else if (operation.type === 'insert') {
          this.content = operation.oldContent;
      } else if (operation.type === 'delete') {
          this.content = operation.oldContent;
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

      if (operation.type === 'group') {
          for (let i = 0; i < operation.operations.length; i++) {
              const op = operation.operations[i];
              if (op.type === 'insert') {
                  this.content = this.content.slice(0, op.position) + op.text + this.content.slice(op.position);
              } else if (op.type === 'delete') {
                  this.content = this.content.slice(0, op.startPosition) + this.content.slice(op.endPosition);
              }
          }
      } else if (operation.type === 'insert') {
          this.content = this.content.slice(0, operation.position) + operation.text + this.content.slice(operation.position);
      } else if (operation.type === 'delete') {
          this.content = this.content.slice(0, operation.startPosition) + this.content.slice(operation.endPosition);
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

module.exports = {TextEditor};