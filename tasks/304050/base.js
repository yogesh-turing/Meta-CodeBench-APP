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
    
        const randomIndex = Math.floor(Math.random() * available.length);
        const selected = available[randomIndex];
        
        selected.playCount++;
        selected.lastPlayed = new Date();
        this.playHistory.push(selected.title);
        
        return selected;
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