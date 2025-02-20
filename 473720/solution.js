class Song {
  /**
   * Creates an instance of Song.
   * @param {string} title - The title of the song.
   * @param {string} artist - The artist of the song.
   * @param {number} duration - The duration of the song in seconds.
   * @throws {Error} If any of the inputs are invalid.
   */
  constructor(title, artist, duration) {
      if (typeof title !== 'string' || !title.trim()) {
          throw new Error('Invalid input: title must be a non-empty string');
      }
      if (typeof artist !== 'string' || !artist.trim()) {
          throw new Error('Invalid input: artist must be a non-empty string');
      }
      if (typeof duration !== 'number' || duration <= 0) {
          throw new Error('Invalid input: duration must be a positive number and greater than zero');
      }
      
      this._title = title;
      this._artist = artist;
      this._duration = duration;
  }

  /**
   * Retrieves the details of the song.
   * @returns {Object} An object containing title, artist, and duration.
   */
  getDetails() {
      return {
          title: this._title,
          artist: this._artist,
          duration: this._duration
      };
  }

  /**
   * Checks if the provided title matches the song title.
   * @param {string} title - The title to compare.
   * @returns {boolean} True if titles match, false otherwise.
   */
  isMatchingTitle(title) {
      return this._title === title;
  }
}

class Playlist {
  /**
   * Creates an instance of Playlist.
   * @param {string} name - The name of the playlist.
   * @throws {Error} If the name is invalid.
   */
  constructor(name) {
      if (typeof name !== 'string' || !name.trim()) {
          throw new Error('Invalid input: name must be a non-empty string');
      }
      this._name = name;
      this._songs = [];
  }

  /**
   * Adds a song to the playlist.
   * @param {Song} song - The song instance to add.
   * @throws {Error} If the song is not a valid instance of Song.
   */
  addSong(song) {
      if (!(song instanceof Song)) {
          throw new Error('Invalid input: song must be a Song instance.');
      }
      this._songs.push(song);
  }

  /**
   * Retrieves all songs in the playlist.
   * @returns {Song[]} An array of Song instances.
   */
  getSongs() {
      return [...this._songs];
  }
}

class User {
  /**
   * Creates an instance of User.
   * @param {string} name - The name of the user.
   * @throws {Error} If the name is invalid.
   */
  constructor(name) {
      if (typeof name !== 'string' || !name.trim()) {
          throw new Error('Invalid input: name must be a non-empty string');
      }
      this._name = name;
      this._playlists = new Map();
  }

  /**
   * Creates a new playlist for the user.
   * @param {string} name - The name of the playlist.
   * @returns {Playlist} The created playlist instance.
   */
  createPlaylist(name) {
      const playlist = new Playlist(name);
      this._playlists.set(name, playlist);
      return playlist;
  }

  /**
   * Retrieves a playlist by name.
   * @param {string} name - The name of the playlist.
   * @returns {Playlist | -1} The playlist if found, or -1 if not found.
   */
  getPlaylist(name) {
      return this._playlists.has(name) ? this._playlists.get(name) : -1;
  }

  /**
   * Retrieves the name of the user.
   * @returns {string} The user's name.
   */
  getName() {
      return this._name;
  }
}

class MusicLibrary {
  /**
   * Creates an instance of MusicLibrary.
   */
  constructor() {
      this._users = new Map();
      this._songs = new Map();
  }

  /**
   * Adds a song to the library.
   * @param {string} title - The title of the song.
   * @param {string} artist - The artist of the song.
   * @param {number} duration - The duration of the song.
   * @returns {Song} The added song instance.
   */
  addSong(title, artist, duration) {
      const song = new Song(title, artist, duration);
      this._songs.set(title, song);
      return song;
  }

  /**
   * Registers a new user in the library.
   * @param {string} name - The name of the user.
   * @returns {User} The registered user instance.
   */
  registerUser(name) {
      const user = new User(name);
      this._users.set(name, user);
      return user;
  }

  /**
   * Adds a song to a user's playlist.
   * @param {string} userName - The name of the user.
   * @param {string} playlistName - The name of the playlist.
   * @param {string} songTitle - The title of the song.
   * @returns {boolean} True if the song is successfully added.
   * @throws {Error} If user, playlist, or song is not found.
   */
  addSongToUserPlaylist(userName, playlistName, songTitle) {
      if (!this._users.has(userName)) {
          throw new Error('Operation failed: User not found');
      }

      const user = this._users.get(userName);
      const playlist = user.getPlaylist(playlistName);

      if (playlist === -1) {
          throw new Error('Operation failed: Playlist not found');
      }

      if (!this._songs.has(songTitle)) {
          throw new Error('Operation failed: Song not found.');
      }

      const song = this._songs.get(songTitle);
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