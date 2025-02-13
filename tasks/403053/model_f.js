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

  // Insert text at a specific position
  insert(position, text) {
      if (position < 0 || position > this.content.length) {
          throw new Error("Invalid position");
      }

      let oldContent = this.content;
      this.content = this.content.substring(0, position) + text + this.content.substring(position);
      let operation = {
          type: 'insert',
          position: position,
          text: text,
          oldContent: oldContent
      };

      if (this.isGrouping) {
          this.groupOperationStack.push(operation);
      } else {
          this.undoStack.push(operation);
          this.redoStack = []; // Clear redo stack when new operation is performed
          if (this.undoStack.length > this.maxStackSize) {
              this.undoStack.shift();
          }
      }
  }

  // Delete text from a specific range
  delete(start, end) {
      if (start < 0 || start > this.content.length || end < 0 || end > this.content.length || start >= end) {
          throw new Error("Invalid position");
      }

      let oldContent = this.content;
      this.content = this.content.substring(0, start) + this.content.substring(end);
      let operation = {
          type: 'delete',
          start: start,
          end: end,
          text: this.content.substring(start, end),
          oldContent: oldContent
      };

      if (this.isGrouping) {
          this.groupOperationStack.push(operation);
      } else {
          this.undoStack.push(operation);
          this.redoStack = []; // Clear redo stack when new operation is performed
          if (this.undoStack.length > this.maxStackSize) {
              this.undoStack.shift();
          }
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

      this.isGrouping = false;
      let groupOperation = {
          type: 'group',
          operations: this.groupOperationStack
      };
      this.undoStack.push(groupOperation);
      this.groupOperationStack = [];
      this.redoStack = []; // Clear redo stack when new operation is performed
      if (this.undoStack.length > this.maxStackSize) {
          this.undoStack.shift();
      }
  }

  // Undo the last operation
  undo() {
      if (this.undoStack.length === 0) {
          return false;
      }

      let operation = this.undoStack.pop();
      this.redoStack.push(operation);

      if (operation.type === 'group') {
          for (let op of operation.operations.reverse()) {
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

      return true;
  }

  // Redo the last undone operation
  redo() {
      if (this.redoStack.length === 0) {
          return false;
      }

      let operation = this.redoStack.pop();
      this.undoStack.push(operation);

      if (operation.type === 'group') {
          for (let op of operation.operations) {
              if (op.type === 'insert') {
                  this.content = op.oldContent.substring(0, op.position) + op.text + op.oldContent.substring(op.position);
              } else if (op.type === 'delete') {
                  this.content = op.oldContent.substring(0, op.start) + op.oldContent.substring(op.end);
              }
          }
      } else if (operation.type === 'insert') {
          this.content = operation.oldContent.substring(0, operation.position) + operation.text + operation.oldContent.substring(operation.position);
      } else if (operation.type === 'delete') {
          this.content = operation.oldContent.substring(0, operation.start) + operation.oldContent.substring(operation.end);
      }

      return true;
  }
}

module.exports = {TextEditor};