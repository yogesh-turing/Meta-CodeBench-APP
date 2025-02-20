class Song {
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

    getDetails() {
        return {
            title: this._title,
            artist: this._artist,
            duration: this._duration
        };
    }

    isMatchingTitle(title) {
        return this._title === title;
    }
}

class Playlist {
    constructor(name) {
        if (typeof name !== 'string' || !name.trim()) {
            throw new Error('Invalid input: name must be a non-empty string');
        }
        this._name = name;
        this._songs = [];
    }

    addSong(song) {
        if (!(song instanceof Song)) {
            throw new Error('Invalid input: song must be a Song instance');
        }
        this._songs.push(song);
    }

    getSongs() {
        return [...this._songs];
    }
}

class User {
    constructor(name) {
        if (typeof name !== 'string' || !name.trim()) {
            throw new Error('Invalid input: name must be a non-empty string');
        }
        this._name = name;
        this._playlists = new Map();
    }

    createPlaylist(name) {
        const playlist = new Playlist(name);
        this._playlists.set(name, playlist);
        return playlist;
    }

    getPlaylist(name) {
        return this._playlists.has(name) ? this._playlists.get(name) : -1;
    }

    getName() {
        return this._name;
    }
}

class MusicLibrary {
    constructor() {
        this._users = new Map();
        this._songs = new Map();
    }

    addSong(title, artist, duration) {
        const song = new Song(title, artist, duration);
        this._songs.set(title, song);
        return song;
    }

    registerUser(name) {
        const user = new User(name);
        this._users.set(name, user);
        return user;
    }

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
            throw new Error('Operation failed: Song not found');
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