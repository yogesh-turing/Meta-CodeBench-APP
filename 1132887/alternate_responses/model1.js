const EventEmitter = require('events');

class LibrarySystem extends EventEmitter {
    constructor() {
        super();
        this.books = new Map();
        this.members = new Map();
    }

    addBook(title, author, copies) {
        if (!title || !author || !copies || 
            typeof copies !== "number" || 
            copies <= 0) {
            throw new Error("Error encountered");
        }

        const book = { title, author, copies };
        this.books.set(title, book);
        this.emit('bookAdded', book);
    }

    registerMember(name, id) {
        if (!name || !id || 
            typeof id !== "number") {
            throw new Error("Error encountered");
        }

        const member = { name, id };
        this.members.set(id, member);
        this.emit('memberRegistered', member);
    }

    issueBook(title, memberId) {
        const book = this.books.get(title);
        const member = this.members.get(memberId);

        if (!book || !member) {
            throw new Error("Error encountered");
        }

        if (book.copies <= 0) {
            throw new Error("Error encountered");
        }

        book.copies -= 1;
        this.emit('bookIssued', {
            title: book.title,
            memberId: member.id
        });
    }
}

module.exports = { LibrarySystem };