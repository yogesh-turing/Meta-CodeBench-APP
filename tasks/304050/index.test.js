const {SmartPlaylist} = require('./correct');

describe('SmartPlaylist', () => {
  let playlist;
  const mockDate = new Date('2024-01-01T12:00:00Z');

  beforeEach(() => {
    playlist = new SmartPlaylist();
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should add valid songs', () => {
    const song = {
      title: 'Test Song',
      artist: 'Test Artist',
      duration: 180,
      genre: 'Rock'
    };
    playlist.addSong(song);
    expect(playlist.songs.length).toBe(1);
    expect(playlist.songs[0]).toEqual({
      ...song,
      playCount: 0,
      lastPlayed: null,
      weight: 1.0
    });
  });

  test('should throw error when genre is missing', () => {
    const song = { 
      title: 'Song 1', 
      artist: 'Artist 1', 
      duration: 180 
    };
    
    expect(() => playlist.addSong(song)).toThrow('Invalid song format');
  });

  test('should reject invalid songs', () => {
    expect(() => playlist.addSong(null)).toThrow('Invalid song format');
    expect(() => playlist.addSong({})).toThrow('Invalid song format');
    expect(() => playlist.addSong({ title: 'Test' })).toThrow('Invalid song format');
    expect(() => playlist.addSong({ title: 'Test', artist: 'Artist' })).toThrow('Invalid song format');
    expect(() => playlist.addSong({ title: 'Test', artist: 'Artist', duration: 180 })).toThrow('Invalid song format');
    expect(() => playlist.addSong({ title: 'Test', artist: 'Artist', genre: 'Rock' })).toThrow('Invalid song format');
  });

  test('should throw error on empty playlist shuffle', () => {
    expect(() => playlist.shuffle()).toThrow('Playlist is empty');
  });

  test('should properly update weights based on play history', () => {
    const song = {
      title: 'Test Song',
      artist: 'Test Artist',
      duration: 180,
      genre: 'Rock'
    };
    playlist.addSong(song);
    
    // First play
    const firstPlay = playlist.shuffle();
    expect(firstPlay.playCount).toBe(1);
    expect(firstPlay.lastPlayed).toEqual(mockDate);
    
    // Advance time by 1 hour
    jest.advanceTimersByTime(3600000); // 1 hour
    
    // Second play
    playlist.updateWeight(playlist.songs[0]);
    expect(playlist.songs[0].weight).toBeLessThan(1); // Weight should decrease due to recent play
  });

  test('should handle genre and artist history in weight calculation', () => {
    const songs = [
      { title: 'Song 1', artist: 'Artist 1', duration: 180, genre: 'Rock' },
      { title: 'Song 2', artist: 'Artist 1', duration: 180, genre: 'Rock' },
      { title: 'Song 3', artist: 'Artist 2', duration: 180, genre: 'Pop' }
    ];
    
    songs.forEach(song => playlist.addSong(song));
    
    // Play a song by Artist 1
    const firstSong = playlist.songs.find(s => s.artist === 'Artist 1');
    firstSong.lastPlayed = new Date();
    playlist.artistHistory.set(firstSong.artist, Date.now());
    playlist.genreHistory.set(firstSong.genre, Date.now());
    
    // Advance time by 30 minutes
    jest.advanceTimersByTime(1800000);
    
    // Update weights for remaining songs
    const remainingSongs = playlist.songs.filter(s => s !== firstSong);
    remainingSongs.forEach(song => playlist.updateWeight(song));
    
    // Find a song by the same artist and a song by a different artist
    const sameArtistSong = remainingSongs.find(s => s.artist === firstSong.artist);
    const differentArtistSong = remainingSongs.find(s => s.artist !== firstSong.artist);
    
    // Same artist song should have lower weight due to artist history
    expect(sameArtistSong.weight).toBeLessThan(differentArtistSong.weight);
  });

  test('should maintain play history and trim when necessary', () => {
    const songs = [
      { title: 'Song 1', artist: 'Artist 1', duration: 180, genre: 'Rock' },
      { title: 'Song 2', artist: 'Artist 2', duration: 180, genre: 'Pop' }
    ];
    
    songs.forEach(song => playlist.addSong(song));
    
    // Play songs multiple times
    for (let i = 0; i < 5; i++) {
      playlist.shuffle();
      jest.advanceTimersByTime(3600000); // Advance 1 hour
    }
    
    // History should not exceed playlist length
    expect(playlist.playHistory.length).toBeLessThanOrEqual(songs.length);
  });

  test('should provide accurate playlist analytics', () => {
    const songs = [
      { title: 'Song 1', artist: 'Artist 1', duration: 180, genre: 'Rock' },
      { title: 'Song 2', artist: 'Artist 2', duration: 180, genre: 'Pop' }
    ];
    
    songs.forEach(song => playlist.addSong(song));
    
    // Play the first song twice
    const firstSong = playlist.songs[0];
    firstSong.playCount = 2;
    firstSong.lastPlayed = new Date();
    playlist.updateWeight(firstSong);
    
    // Update second song's weight
    const secondSong = playlist.songs[1];
    playlist.updateWeight(secondSong);
    
    const analytics = playlist.getPlaylistAnalytics();
    
    expect(analytics.totalSongs).toBe(2);
    expect(analytics.totalPlays).toBe(2);
    expect(analytics.averageWeight).toBeGreaterThan(0);
    expect(analytics.mostPlayed.title).toBe('Song 1');
    expect(analytics.mostPlayed.playCount).toBe(2);
    expect(analytics.leastPlayed.title).toBe('Song 2');
    expect(analytics.leastPlayed.playCount).toBe(0);
  });

  test('should handle maximum weight limit', () => {
    const song = {
      title: 'Test Song',
      artist: 'Test Artist',
      duration: 180,
      genre: 'Rock'
    };
    playlist.addSong(song);
    
    // Advance time by 24 hours (should max out weight at 2.0)
    jest.advanceTimersByTime(24 * 3600000);
    
    playlist.updateWeight(playlist.songs[0]);
    expect(playlist.songs[0].weight).toBeLessThanOrEqual(2.0);
  });

  test('should properly decay weights for frequently played songs', () => {
    const song = {
      title: 'Test Song',
      artist: 'Test Artist',
      duration: 180,
      genre: 'Rock'
    };
    playlist.addSong(song);
    
    // Play the song multiple times
    for (let i = 0; i < 5; i++) {
      playlist.shuffle();
      jest.advanceTimersByTime(3600000); // Advance 1 hour
    }
    
    playlist.updateWeight(playlist.songs[0]);
    expect(playlist.songs[0].weight).toBeLessThan(1.0); // Weight should decrease due to frequent plays
  });

  test('should handle genre weight adjustments', () => {
    const rockSong1 = { title: 'Rock Song', artist: 'Artist 1', duration: 180, genre: 'Rock' };
    const popSong = { title: 'Pop Song', artist: 'Artist 2', duration: 180, genre: 'Pop' };
    const rockSong2 = { title: 'Another Rock', artist: 'Artist 3', duration: 180, genre: 'Rock' };

    playlist.addSong(rockSong1);
    playlist.addSong(popSong);
    playlist.addSong(rockSong2);

    // Simulate playing a rock song by directly updating histories
    const playlistRockSong1 = playlist.songs.find(s => s.title === 'Rock Song');
    playlistRockSong1.lastPlayed = new Date();
    playlist.genreHistory.set('Rock', new Date());
    
    // Advance time by 30 minutes
    jest.advanceTimersByTime(30 * 60 * 1000);

    // Get the songs from playlist to check their weights
    const playlistRockSong2 = playlist.songs.find(s => s.title === 'Another Rock');
    const playlistPopSong = playlist.songs.find(s => s.title === 'Pop Song');
    
    // Update weights for all songs
    playlist.songs.forEach(song => playlist.updateWeight(song));

    // The second rock song should have lower weight due to recent genre play
    expect(playlistRockSong2.weight).toBeLessThan(playlistPopSong.weight);
  });

  test('should handle empty playlist analytics', () => {
    const emptyPlaylist = new SmartPlaylist();
    const analytics = emptyPlaylist.getPlaylistAnalytics();
    expect(analytics.totalSongs).toBe(0);
    expect(analytics.totalPlays).toBe(0);
    expect(analytics.averageWeight).toBe(0);
    expect(analytics.mostPlayed == null || analytics.mostPlayed == undefined).toBe(true);
    expect(analytics.leastPlayed == null || analytics.leastPlayed == undefined).toBe(true);
  });

  test('should trim play history when it exceeds song count', () => {
    const song = { 
      title: 'Test Song', 
      artist: 'Test Artist', 
      duration: 180, 
      genre: 'Rock' 
    };
    playlist.addSong(song);

    // Play the song multiple times to build up history
    for (let i = 0; i < 3; i++) {
      playlist.shuffle();
      jest.advanceTimersByTime(60 * 60 * 1000); // Advance 1 hour
    }

    // History should be trimmed to match song count
    expect(playlist.playHistory.length).toBe(1);
    expect(playlist.playHistory[0]).toBe('Test Song');
  });

  test('should select songs based on weights', () => {
    // Mock Math.random to return a value that will select the middle song
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.4; // This will make it select the middle song
    global.Math = mockMath;

    // Add three songs with specific weights
    const songs = [
      { title: 'Song 1', artist: 'Artist 1', duration: 180, genre: 'Rock' },
      { title: 'Song 2', artist: 'Artist 2', duration: 180, genre: 'Pop' },
      { title: 'Song 3', artist: 'Artist 3', duration: 180, genre: 'Jazz' }
    ];
    songs.forEach(song => playlist.addSong(song));

    // Set weights so we know exactly which song will be selected
    playlist.songs[0].weight = 0.3;  // 0.0 - 0.3
    playlist.songs[1].weight = 0.2;  // 0.3 - 0.5
    playlist.songs[2].weight = 0.5;  // 0.5 - 1.0

    // With Math.random() = 0.4, it should skip first song, select second song, and break
    const selected = playlist.shuffle();
    expect(selected.title).toBe('Song 2');

    // Verify the state after selection
    expect(selected.playCount).toBe(1);
    expect(selected.lastPlayed).toBeInstanceOf(Date);
    expect(playlist.playHistory).toContain('Song 2');
    expect(playlist.artistHistory.has('Artist 2')).toBe(true);
    expect(playlist.genreHistory.has('Pop')).toBe(true);

    // Restore original Math
    global.Math = Object.create(mockMath);
  });

  test('should provide accurate analytics with multiple songs and plays', () => {
    const songs = [
      { title: 'Most Played', artist: 'Artist 1', duration: 180, genre: 'Rock' },
      { title: 'Medium Played', artist: 'Artist 2', duration: 180, genre: 'Pop' },
      { title: 'Least Played', artist: 'Artist 3', duration: 180, genre: 'Jazz' }
    ];
    songs.forEach(song => playlist.addSong(song));

    // Set up different play counts and weights
    playlist.songs[0].playCount = 5;
    playlist.songs[0].weight = 1.5;
    playlist.songs[1].playCount = 3;
    playlist.songs[1].weight = 1.0;
    playlist.songs[2].playCount = 1;
    playlist.songs[2].weight = 0.5;

    const analytics = playlist.getPlaylistAnalytics();
    expect(analytics.totalPlays).toBe(9); // 5 + 3 + 1
    expect(analytics.averageWeight).toBe(1.0); // (1.5 + 1.0 + 0.5) / 3
    expect(analytics.mostPlayed.title).toBe('Most Played');
    expect(analytics.leastPlayed.title).toBe('Least Played');
  });

  test('should provide detailed song statistics', () => {
    const song = {
      title: 'Test Song',
      artist: 'Test Artist',
      duration: 180,
      genre: 'Rock'
    };
    playlist.addSong(song);
    
    // Play the song once
    playlist.shuffle();
    
    const stats = playlist.getSongStats();
    expect(stats).toHaveLength(1);
    expect(stats[0]).toEqual({
      title: 'Test Song',
      playCount: 1,
      lastPlayed: mockDate,
      currentWeight: expect.any(Number)
    });
  });

  test('should properly decay weights for frequently played songs', () => {
    const song = {
      title: 'Test Song',
      artist: 'Test Artist',
      duration: 180,
      genre: 'Rock'
    };
    playlist.addSong(song);
    
    // Play the song multiple times
    for (let i = 0; i < 5; i++) {
      playlist.shuffle();
      jest.advanceTimersByTime(3600000); // Advance 1 hour
    }
    
    const stats = playlist.getSongStats();
    expect(stats[0].playCount).toBe(5);
    expect(stats[0].currentWeight).toBeLessThan(1.0); // Weight should decrease due to frequent plays
  });
});