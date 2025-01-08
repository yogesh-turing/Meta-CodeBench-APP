class SocialNetwork {
    constructor() {
      this.users = new Map(); // User's social network represented as an adjacency list
    }
  
    addUser(user) {
      if (!this.users.has(user)) {
        this.users.set(user, new Set());
      }
    }
  
    addFriend(user, friend) {
      if (this.users.has(user) && this.users.has(friend)) {
        this.users.get(user).add(friend);
        this.users.get(friend).add(user);
      }
    }
  
    async recommendFriends(user) {
      if (!this.users.has(user)) {
        throw new Error(`User ${user} does not exist in the network`);
      }
  
      const userFriends = this.users.get(user);
      if (!userFriends || userFriends.size === 0) {
        return []; // Return an empty array if the user has no friends
      }
  
      const recommended = new Map();
  
      for (let friend of userFriends) {
        const friendsOfFriend = this.users.get(friend);
  
        for (let potentialFriend of friendsOfFriend) {
          if (potentialFriend === user || userFriends.has(potentialFriend)) {
            continue; // Skip the user themselves and existing friends
          }
  
          // Count mutual friends
          recommended.set(
            potentialFriend,
            (recommended.get(potentialFriend) || 0) + 1
          );
        }
      }
  
      // If no recommendations found, return an empty array
      if (recommended.size === 0) {
        return [];
      }
  
      // Sort recommendations by the number of mutual friends in descending order
      const sortedRecommendations = [...recommended.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([user, mutualFriends]) => ({
          user,
          mutualFriends,
        }));
  
      return sortedRecommendations;
    }
  }
  
  module.exports = { SocialNetwork };