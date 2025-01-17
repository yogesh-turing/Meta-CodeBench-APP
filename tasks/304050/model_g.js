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
    const timeSinceLastPlay = song.lastPlayed ? (new Date() - song.lastPlayed) / (1000 * 60 * 60 * 24) : Infinity;
    let weight = 1.0;

    // Increase weight up to 2 for songs not played in 24 hours
    weight *= Math.min(2, 1 + timeSinceLastPlay);

    // Decrease weight for frequently played songs
    weight *= Math.pow(0.95, song.playCount);

    // Decrease weight if same artist played recently
    const lastArtistPlay = this.artistHistory.get(song.artist);
    if (lastArtistPlay && (new Date() - lastArtistPlay) / (1000 * 60 * 60) < 2) {
      weight *= 0.8;
    }

    // Decrease weight if same genre played recently
    const lastGenrePlay = this.genreHistory.get(song.genre);
    if (lastGenrePlay && (new Date() - lastGenrePlay) / (1000 * 60 * 60) < 1) {
      weight *= 0.9;
    }

    song.weight = weight;
  }

  shuffle() {
    if (this.songs.length === 0) {
      throw new Error('Playlist is empty');
    }

    // Update weights for all songs
    this.songs.forEach(song => this.updateWeight(song));

    // Select a song based on weight
    const totalWeight = this.songs.reduce((acc, song) => acc + song.weight, 0);
    const random = Math.random() * totalWeight;
    let cumulativeWeight = 0;
    const selected = this.songs.find(song => {
      cumulativeWeight += song.weight;
      return cumulativeWeight >= random;
    });

    // Update history and statistics
    selected.playCount++;
    selected.lastPlayed = new Date();
    this.playHistory.push(selected.title);
    this.artistHistory.set(selected.artist, new Date());
    this.genreHistory.set(selected.genre, new Date());

    // Limit play history to the total number of songs
    if (this.playHistory.length > this.songs.length) {
      this.playHistory.shift();
    }

    return selected;
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

module.exports = { SmartPlaylist };