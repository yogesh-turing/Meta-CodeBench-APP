Base Code:
```JavaScript
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
```

Prompt:
The `SmartPlaylist` class implements a music playlist system with basic shuffle functionality. It tracks play history to avoid immediate repeats but lacks sophisticated shuffling algorithms and analytics.


Improve it by implementing  an intelligent shuffle algorithm with weighted song selection and comprehensive analytics. Implement a way to update weight of a song, `updateWeight` which takes a song as input. This method calculates the weight based on time since last play(increase up to 2 for songs not played in 24 hours, decrease for frequently played songs, decrease if same artist played recently, decrease if same genre played recently), also by play count(multiply by 0.95 exponent `playCount`), artist history(multiply by 0.8 if same artist played in the last 2 hours) and by genre history(multiply by 0.9 if same genre was played in the last hour). Also, update the `shuffle` method which selects a song based on weight and updates the history and statistics. Play history shouldn't be more than the total number of songs. Lastly, implement `getPlaylistAnalytics` method which gets playlist analytics.

Example Usage:

const playlist = new SmartPlaylist();

playlist.addSong({
  title: "Song 1",
  artist: "Artist A",
  duration: 180,
  genre: "Rock"
});

const nextSong = playlist.shuffle();
Expected Output: {title: "Song 1", artist: "Artist A", duration: 180, genre: "Rock", playCount: 1, lastPlayed: Date, weight: <calculated>}

const stats = playlist.getPlaylistAnalytics();
 Expected Output: {
  totalSongs: 1,
   totalPlays: 1,
   averageWeight: <calculated>,
  mostPlayed: <song object>,
   leastPlayed: <song object>
}