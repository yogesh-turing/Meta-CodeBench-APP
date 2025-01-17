class SmartPlaylist {
    constructor() {
      this.songs = [];
      this.playHistory = [];
      this.genreHistory = new Map();
      this.artistHistory = new Map();
    }
  
    addSong(song) {
      if (!song || typeof song !== 'object' || !song.title || !song.artist || !song.duration) {
        throw new Error('Invalid song format');
      }
      this.songs.push({
        ...song,
        playCount: 0,
        lastPlayed: null,
        weight: 1.0
      });
    }
  
    // Basic shuffle implementation
    shuffle() {
      if (this.songs.length === 0) {
        throw new Error('Playlist is empty');
      }
  
      const available = this.songs.filter(song => !this.playHistory.includes(song.title));
      if (available.length === 0) {
        this.playHistory = [];
        return this.shuffle();
      }
  
      this.updateWeights();
      const totalWeight = available.reduce((sum, song) => sum + song.weight, 0);
      const randomWeight = Math.random() * totalWeight;
      let cumulativeWeight = 0;
  
      for (const song of available) {
        cumulativeWeight += song.weight;
        if (cumulativeWeight >= randomWeight) {
          song.playCount++;
          song.lastPlayed = new Date();
          this.playHistory.push(song.title);
          this.updateHistory(song);
          return song;
        }
      }
    }
  
    updateWeights() {
      for (const song of this.songs) {
        const timeSinceLastPlay = song.lastPlayed ? (new Date() - song.lastPlayed) / (1000 * 60 * 60) : 24;
        const playCountFactor = Math.pow(0.95, song.playCount);
        const timeFactor = Math.min(2, Math.max(0.5, timeSinceLastPlay / 24));
        let artistFactor = 1;
        let genreFactor = 1;
  
        if (this.artistHistory.has(song.artist)) {
          const lastPlayed = this.artistHistory.get(song.artist);
          const timeSinceLastArtistPlay = (new Date() - lastPlayed) / (1000 * 60 * 60);
          artistFactor = timeSinceLastArtistPlay < 2 ? 0.8 : 1;
        }
  
        if (this.genreHistory.has(song.genre)) {
          const lastPlayed = this.genreHistory.get(song.genre);
          const timeSinceLastGenrePlay = (new Date() - lastPlayed) / (1000 * 60 * 60);
          genreFactor = timeSinceLastGenrePlay < 1 ? 0.9 : 1;
        }
  
        song.weight = playCountFactor * timeFactor * artistFactor * genreFactor;
      }
    }
  
    updateHistory(song) {
      this.artistHistory.set(song.artist, song.lastPlayed);
      this.genreHistory.set(song.genre, song.lastPlayed);
      if (this.playHistory.length > this.songs.length) {
        this.playHistory.shift();
      }
    }
  
    getSongStats() {
      return this.songs.map(song => ({
        title: song.title,
        playCount: song.playCount,
        lastPlayed: song.lastPlayed,
        currentWeight: song.weight
      }));
    }
  
    getPlaylistAnalytics() {
      const totalSongs = this.songs.length;
      const totalPlays = this.songs.reduce((sum, song) => sum + song.playCount, 0);
      const averageWeight = this.songs.reduce((sum, song) => sum + song.weight, 0) / totalSongs;
      const mostPlayed = this.songs.reduce((max, song) => song.playCount > max.playCount ? song : max, this.songs[0]);
      const leastPlayed = this.songs.reduce((min, song) => song.playCount < min.playCount ? song : min, this.songs[0]);
  
      return {
        totalSongs,
        totalPlays,
        averageWeight,
        mostPlayed,
        leastPlayed
      };
    }
  }
  
  module.exports = { SmartPlaylist };