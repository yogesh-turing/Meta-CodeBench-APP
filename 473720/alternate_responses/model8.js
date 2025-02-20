class Song {
  constructor(title, artist, duration) {
    if (!title || typeof title !== 'string') {
      throw new Error('Invalid input: title must be a non-empty string');
    }
    if (!artist || typeof artist !== 'string') {
      throw new Error('Invalid input: artist must be a non-empty string');
    }
    if (typeof duration !== 'number' || duration <= 0) {
      throw new Error('Invalid input: duration must be a positive number and greater than zero');
    }
    this.title = title;
    this.artist = artist;
    this.duration = duration;
  }

  getDetails() {
    return { title: this.title, artist: this.artist, duration: this.duration };
  }

  isMatchingTitle(title) {
    return this.title === title;
  }
}

class Playlist {
  constructor(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('Invalid input: name must be a non-empty string');
    }
    this.name = name;
    this.songs = [];
  }

  addSong(song) {
    if (!(song instanceof Song)) {
      throw new Error('Invalid input: song must be a Song instance.');
    }
    this.songs.push(song);
  }

  getSongs() {
    return this.songs;
  }
}

class User {
  constructor(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('Invalid input: name must be a non-empty string');
    }
    this.name = name;
    this.playlists = {};
  }

  createPlaylist(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('Invalid input: name must be a non-empty string');
    }
    this.playlists[name] = new Playlist(name);
  }

  getPlaylist(name) {
    if (!this.playlists[name]) {
      return -1;
    }
    return this.playlists[name];
  }

  getName() {
    return this.name;
  }
}

class MusicLibrary {
  constructor() {
    this.songs = [];
    this.users = {};
  }

  addSong(title, artist, duration) {
    const song = new Song(title, artist, duration);
    this.songs.push(song);
    return song;
  }

  registerUser(name) {
    const user = new User(name);
    this.users[name] = user;
    return user;
  }

  addSongToUserPlaylist(userName, playlistName, songTitle) {
    if (!this.users[userName]) {
      throw new Error('Operation failed: User not found');
    }
    const user = this.users[userName];
    const playlist = user.getPlaylist(playlistName);
    if (playlist === -1) {
      throw new Error('Operation failed: Playlist not found');
    }
    const song = this.songs.find(s => s.isMatchingTitle(songTitle));
    if (!song) {
      throw new Error('Operation failed: Song not found.');
    }
    playlist.addSong(song);
    return true;
  }
}

module.exports = {
  Song,
  Playlist,
  User,
  MusicLibrary
};