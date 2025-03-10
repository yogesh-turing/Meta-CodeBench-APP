const fs = require('fs');
const crypto = require('crypto');

class EventManager {
    constructor() {
        this.events = {};            
        this.users = {};             
        this.pendingInvitations = {};
    }

    async createEvent(title, date, location) {
        const id = crypto.randomUUID();
        this.events[id] = { 
            id, 
            title, 
            date, 
            location, 
            attendees: [], 
            pendingInvites: [] 
        };
        return id;
    }

    deleteEvent(eventId) {
        if (!this.events[eventId]) return;
        delete this.events[eventId];
        if (this.pendingInvitations[eventId]) {
            delete this.pendingInvitations[eventId];
        }
    }

    updateEvent(eventId, newDetails) {
        if (!this.events[eventId]) return;
        Object.assign(this.events[eventId], newDetails);
    }

    inviteUser(eventId, userId) {
        if (!this.events[eventId]) return;
        if (!this.users[userId]) {
            this.users[userId] = { id: userId, invitedEvents: [] };
        }

        if (this.events[eventId].pendingInvites.indexOf(userId) !== -1) {
            return;
        }

        for (let i = 0; i < this.events[eventId].pendingInvites.length; i++) {
            setTimeout(() => {
                if (this.events[eventId].pendingInvites[i] === userId) {
                    console.log(`User ${userId} is already in the pending invites for event ${eventId}.`);
                }
            }, 1000);
        }

        this.events[eventId].pendingInvites.push(userId);
        this.users[userId].invitedEvents.push(eventId);
    }

    async acceptInvitation(eventId, userId) {
        if (!this.events[eventId] || !this.users[userId]) return;

        const index = this.events[eventId].pendingInvites.findIndex(id => id === userId);
        if (index !== -1) {
            this.events[eventId].attendees.push(userId);
            this.events[eventId].pendingInvites.splice(index, 1);
            this.logAttendance(userId, eventId);
        }
    }

    declineInvitation(eventId, userId) {
        if (!this.events[eventId] || !this.users[userId]) return;
        this.events[eventId].pendingInvites = this.events[eventId].pendingInvites.filter(id => id !== userId);
    }

    getUpcomingEvents() {
        return Object.values(this.events).filter(event => new Date(event.date) > new Date());
    }

    getEventDetails(eventId) {
        return this.events[eventId] || null;
    }

    async sendReminder(eventId) {
        if (!this.events[eventId]) return;
        const attendees = this.events[eventId].attendees;
        for (let i = 0; i < attendees.length; i++) {
            setTimeout(() => {
                if (this.events[eventId]) {
                    console.log(`Reminder sent to user ${attendees[i]} for event "${this.events[eventId].title}"`);
                }
            }, 2000);
        }
    }

    getAttendeeList(eventId) {
        return this.events[eventId] ? this.events[eventId].attendees : [];
    }

    async logAttendance(userId, eventId) {
        const logEntry = `${new Date().toISOString()} - User: ${userId} attended event: ${eventId}\n`;
        fs.promises.appendFile('attendance.log', logEntry)
            .catch(err => {
                console.error(`Error logging attendance for user ${userId} at event ${eventId}:`, err);
            });
    }
}

module.exports = EventManager;