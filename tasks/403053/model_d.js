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

  insert(position, text) {
      if (position < 0 || position > this.content.length) {
          throw new Error("Invalid position");
      }

      const operation = {
          type: 'insert',
          position,
          text,
          oldContent: this.content
      };

      if (this.isGrouping) {
          this.groupOperationStack.push(operation);
      } else {
          this.undoStack.push(operation);
          if (this.undoStack.length > this.maxStackSize) {
              this.undoStack.shift();
          }
      }

      this.content = this.content.slice(0, position) + text + this.content.slice(position);
      this.redoStack = [];
  }

  delete(start, end) {
      if (start < 0 || end > this.content.length || start >= end) {
          throw new Error("Invalid position");
      }

      const operation = {
          type: 'delete',
          position: start,
          text: this.content.slice(start, end),
          oldContent: this.content
      };

      if (this.isGrouping) {
          this.groupOperationStack.push(operation);
      } else {
          this.undoStack.push(operation);
          if (this.undoStack.length > this.maxStackSize) {
              this.undoStack.shift();
          }
      }

      this.content = this.content.slice(0, start) + this.content.slice(end);
      this.redoStack = [];
  }

  beginGroup() {
      if (this.isGrouping) {
          throw new Error("Already in a group operation");
      }
      this.isGrouping = true;
      this.groupOperationStack = [];
  }

  endGroup() {
      if (!this.isGrouping) {
          throw new Error("No group operation in progress");
      }
      if (this.groupOperationStack.length > 0) {
          const groupOperation = {
              type: 'group',
              operations: this.groupOperationStack,
              oldContent: this.groupOperationStack[0].oldContent
          };
          this.undoStack.push(groupOperation);
          if (this.undoStack.length > this.maxStackSize) {
              this.undoStack.shift();
          }
      }
      this.isGrouping = false;
      this.groupOperationStack = [];
      this.redoStack = [];
  }

  undo() {
      if (this.undoStack.length === 0) return false;

      const operation = this.undoStack.pop();
      this.content = operation.oldContent;
      this.redoStack.push(operation);
      if (this.redoStack.length > this.maxStackSize) {
          this.redoStack.shift();
      }
      return true;
  }

  redo() {
      if (this.redoStack.length === 0) return false;

      const operation = this.redoStack.pop();
      if (operation.type === 'group') {
          operation.operations.forEach(op => {
              if (op.type === 'insert') {
                  this.content = this.content.slice(0, op.position) + op.text + 
                               this.content.slice(op.position);
              } else if (op.type === 'delete') {
                  this.content = this.content.slice(0, op.position) + 
                               this.content.slice(op.position + op.text.length);
              }
          });
      } else if (operation.type === 'insert') {
          this.content = this.content.slice(0, operation.position) + operation.text + 
                        this.content.slice(operation.position);
      } else if (operation.type === 'delete') {
          this.content = this.content.slice(0, operation.position) + 
                        this.content.slice(operation.position + operation.text.length);
      }
      this.undoStack.push(operation);
      return true;
  }
}

module.exports = {TextEditor};