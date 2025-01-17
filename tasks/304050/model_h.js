class SmartPlaylist {
    constructor() {
      this.songs = [];
      this.playHistory = [];
      this.genreHistory = new Map();
      this.artistHistory = new Map();
    }
  
    addSong(song) {
      if (!song || typeof song !== 'object' || !song.title || !song.artist || !song.duration || !song.genre) {
        throw new Error('Invalid song format');
      }
      this.songs.push({
        ...song,
        playCount: 0,
        lastPlayed: null,
        weight: 1.0
      });
    }
  
    updateWeight(song) {
      const now = new Date();
      const timeDiff = (now - song.lastPlayed) / (1000 * 3600); // hours since last play
  
      let weight = 1.0;
      if (timeDiff >= 24) weight *= 2;
      else if (timeDiff <= 1) weight *= 0.5;
  
      weight *= Math.pow(0.95, song.playCount);
  
      if (this.artistHistory.has(song.artist)) {
        const artistTimeDiff = (now - this.artistHistory.get(song.artist)) / (1000 * 3600);
        if (artistTimeDiff <= 2) weight *= 0.8;
      }
  
      if (this.genreHistory.has(song.genre)) {
        const genreTimeDiff = (now - this.genreHistory.get(song.genre)) / (1000 * 3600);
        if (genreTimeDiff <= 1) weight *= 0.9;
      }
  
      song.weight = weight;
    }
  
    shuffle() {
      if (this.songs.length === 0) {
        throw new Error('Playlist is empty');
      }
  
      this.songs.forEach(song => this.updateWeight(song));
  
      const totalWeight = this.songs.reduce((acc, song) => acc + song.weight, 0);
      const random = Math.random() * totalWeight;
      let cumulativeWeight = 0;
  
      for (const song of this.songs) {
        cumulativeWeight += song.weight;
        if (random <= cumulativeWeight) {
          song.playCount++;
          song.lastPlayed = new Date();
          this.playHistory.push(song.title);
          this.artistHistory.set(song.artist, song.lastPlayed);
          this.genreHistory.set(song.genre, song.lastPlayed);
  
          if (this.playHistory.length > this.songs.length) {
            this.playHistory.shift();
          }
  
          return song;
        }
      }
    }
  
    getPlaylistAnalytics() {
      const totalPlays = this.songs.reduce((acc, song) => acc + song.playCount, 0);
      const averageWeight = this.songs.reduce((acc, song) => acc + song.weight, 0) / this.songs.length;
      const mostPlayed = this.songs.reduce((max, song) => song.playCount > max.playCount ? song : max, this.songs[0]);
      const leastPlayed = this.songs.reduce((min, song) => song.playCount < min.playCount ? song : min, this.songs[0]);
  
      return {
        totalSongs: this.songs.length,
        totalPlays,
        averageWeight,
        mostPlayed,
        leastPlayed
      };
    }
  
    getSongStats() {
      return this.songs.map(song => ({
        title: song.title,
        playCount: song.playCount,
        lastPlayed: song.lastPlayed,
        currentWeight: song.weight
      }));
    }
  }
  
  module.exports = {SmartPlaylist};