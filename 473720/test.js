const { Song, Playlist, User, MusicLibrary } = require('./solution');

describe('Song Class', () => {
  test('should create a song with valid inputs', () => {
    const song = new Song('Imagine', 'John Lennon', 183);
    expect(song.getDetails()).toEqual({ title: 'Imagine', artist: 'John Lennon', duration: 183 });
    expect(song.isMatchingTitle('Imagine')).toBe(true);
    expect(song.isMatchingTitle('imagine')).toBe(false);
    expect(song.isMatchingTitle(134)).toBe(false);
    expect(song.isMatchingTitle('Other')).toBe(false);
  });

  test('should throw error for invalid title or artist', () => {
    expect(() => new Song('', 'John Lennon', 183)).toThrow('Invalid input: title must be a non-empty string');
    expect(() => new Song('Imagine', '', 183)).toThrow('Invalid input: artist must be a non-empty string');
    expect(() => new Song(null, 'John Lennon', 183)).toThrow('Invalid input: title must be a non-empty string');
    expect(() => new Song('Imagine', null, 183)).toThrow('Invalid input: artist must be a non-empty string');
    expect(() => new Song([], 'John Lennon', 183)).toThrow('Invalid input: title must be a non-empty string');
    expect(() => new Song('Imagine', [], 183)).toThrow('Invalid input: artist must be a non-empty string');

  });

  test('should throw error for invalid duration', () => {
    expect(() => new Song('Imagine', 'John Lennon', 0)).toThrow('Invalid input: duration must be a positive number and greater than zero');
    expect(() => new Song('Imagine', 'John Lennon', -5)).toThrow('Invalid input: duration must be a positive number and greater than zero');
    expect(() => new Song('Imagine', 'John Lennon', '5')).toThrow('Invalid input: duration must be a positive number and greater than zero');
    expect(() => new Song('Imagine', 'John Lennon', [])).toThrow('Invalid input: duration must be a positive number and greater than zero');
  });
});

describe('Playlist Class', () => {
  test('should create a playlist with a valid name', () => {
    const playlist = new Playlist('Favorites');
    expect(playlist.getSongs()).toEqual([]);
  });

  test('should throw error for invalid playlist name', () => {
    expect(() => new Playlist('')).toThrow('Invalid input: name must be a non-empty string');
    expect(() => new Playlist(null)).toThrow('Invalid input: name must be a non-empty string');
    expect(() => new Playlist([])).toThrow('Invalid input: name must be a non-empty string');
  });

  test('should add a valid song to the playlist', () => {
    const playlist = new Playlist('Favorites');
    const song = new Song('Hey Jude', 'The Beatles', 431);
    playlist.addSong(song);
    expect(playlist.getSongs()).toEqual([song]);
  });

  test('should throw error when adding an invalid song', () => {
    const playlist = new Playlist('Favorites');
    expect(() => playlist.addSong({})).toThrow('Invalid input: song must be a Song instance.');
  });
});

describe('User Class', () => {
  test('should create a user with a valid name', () => {
    const user = new User('Alice');
    expect(user.getName()).toBe('Alice');
  });

  test('should throw error for invalid user name', () => {
    expect(() => new User('')).toThrow('Invalid input: name must be a non-empty string');
  });

  test('should throw error for invalid playlist name', () => {
    const user = new User('Alice');
   expect(() => user.createPlaylist('')).toThrow('Invalid input: name must be a non-empty string');
   expect(() => user.createPlaylist(null)).toThrow('Invalid input: name must be a non-empty string');
   expect(() => user.createPlaylist([])).toThrow('Invalid input: name must be a non-empty string');
  });

  test('should allow a user to create and retrieve a playlist', () => {
    const user = new User('Alice');
    user.createPlaylist('Chill');
    const playlist = user.getPlaylist('Chill');
    expect(playlist).toBeInstanceOf(Playlist);
  });
  

  test('should throw error when retrieving a non-existent playlist', () => {
    const user = new User('Alice');
    expect(user.getPlaylist('NonExistent')).toEqual(-1)
  });
});

describe('MusicLibrary Class', () => {
  let library;
  beforeEach(() => {
    library = new MusicLibrary();
  });

  test('should add a song to the library with valid inputs', () => {
    const song = library.addSong('Stairway to Heaven', 'Led Zeppelin', 482);
    expect(song).toBeInstanceOf(Song);
  });

  test('should throw error when adding a song with invalid inputs', () => {
    expect(() => library.addSong('', 'Artist', 300)).toThrow('Invalid input: title must be a non-empty string');
    expect(() => library.addSong('Title', '', 300)).toThrow('Invalid input: artist must be a non-empty string');
    expect(() => library.addSong(undefined, 'Artist', 300)).toThrow('Invalid input: title must be a non-empty string');
    expect(() => library.addSong('Title', undefined, 300)).toThrow('Invalid input: artist must be a non-empty string');
    expect(() => library.addSong('Title', 'Artist', -5)).toThrow('Invalid input: duration must be a positive number and greater than zero');
    expect(() => library.addSong('Title', 'Artist', '12')).toThrow('Invalid input: duration must be a positive number and greater than zero');
  });

  test('should register a user with a valid name', () => {
    const user = library.registerUser('Bob');
    expect(user).toBeInstanceOf(User);
    expect(user.getName()).toBe('Bob');
  });

  test('should throw error when registering a user with invalid name', () => {
    expect(() => library.registerUser('')).toThrow('Invalid input: name must be a non-empty string');
  });

  test('should add a song to a user’s playlist successfully', () => {
    const song = library.addSong('Song1', 'Artist1', 250);
    const user = library.registerUser('Charlie');
    user.createPlaylist('Hits');
    expect(library.addSongToUserPlaylist('Charlie', 'Hits', 'Song1')).toBe(true);
  });

  test('should throw error when adding a song to a non-existent user', () => {
    library.addSong('Song1', 'Artist1', 250);
    expect(() => library.addSongToUserPlaylist('NonUser', 'Hits', 'Song1')).toThrow('Operation failed: User not found');
  });

  test('should throw error when adding a song to a non-existent playlist', () => {
    const song = library.addSong('Song1', 'Artist1', 250);
    const user = library.registerUser('Charlie');
    expect(() => library.addSongToUserPlaylist('Charlie', 'NonHits', 'Song1')).toThrow('Operation failed: Playlist not found');
  });

  test('should throw error when adding a non-existent song to a playlist', () => {
    const user = library.registerUser('Charlie');
    user.createPlaylist('Hits');
    expect(() => library.addSongToUserPlaylist('Charlie', 'Hits', 'NonSong')).toThrow('Operation failed: Song not found.');
  });
});