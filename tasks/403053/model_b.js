class TextEditor {
  constructor() {
      this.content = '';
      this.undoStack = [];
      this.redoStack = [];
      this.groupOperationStack = [];
      this.isGrouping = false;
      this.maxStackSize = 100;  // Limit stack size for memory efficiency
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
          this.executeOperation(operation);
      }

      this.redoStack = [];
  }

  delete(start, end) {
      if (start < 0 || end > this.content.length || start >= end) {
          throw new Error("Invalid position");
      }

      const operation = {
          type: 'delete',
          position: start,
          text: this.content.substring(start, end),
          oldContent: this.content
      };

      if (this.isGrouping) {
          this.groupOperationStack.push(operation);
      } else {
          this.executeOperation(operation);
      }

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
              oldContent: this.content
          };
          this.executeOperation(groupOperation);
      }

      this.isGrouping = false;
      this.groupOperationStack = [];
      this.redoStack = [];
  }

  executeOperation(operation) {
      if (operation.type === 'insert') {
          this.content = this.content.slice(0, operation.position) + 
                        operation.text + 
                        this.content.slice(operation.position);
      } else if (operation.type === 'delete') {
          this.content = this.content.slice(0, operation.position) + 
                        this.content.slice(operation.position + operation.text.length);
      } else if (operation.type === 'group') {
          operation.operations.forEach(op => {
              if (op.type === 'insert') {
                  this.content = this.content.slice(0, op.position) + 
                               op.text + 
                               this.content.slice(op.position);
              } else if (op.type === 'delete') {
                  this.content = this.content.slice(0, op.position) + 
                               this.content.slice(op.position + op.text.length);
              }
          });
      }

      this.undoStack.push(operation);
      if (this.undoStack.length > this.maxStackSize) {
          this.undoStack.shift();
      }
  }

  undo() {
      if (this.undoStack.length === 0) return false;

      const operation = this.undoStack.pop();
      this.redoStack.push(operation);
      this.content = operation.oldContent;
      return true;
  }

  redo() {
      if (this.redoStack.length === 0) return false;

      const operation = this.redoStack.pop();
      this.executeOperation(operation);
      return true;
  }

  getContent() {
      return this.content;
  }

  getUndoStackSize() {
      return this.undoStack.length;
  }

  getRedoStackSize() {
      return this.redoStack.length;
  }
}

module.exports = {TextEditor};