const songs = [];
const users = {};
const playlists = {};

function addSong(title, artist, duration) {
  if (!title || !artist || typeof duration !== 'number' || duration <= 0) {
    console.log('Invalid song input');
    return;
  }
  songs.push({ title, artist, duration });
}

function registerUser(name) {
  if (!name) {
    console.log('Invalid user name');
    return;
  }
  if (!users[name]) {
    users[name] = [];
  }
}

function createPlaylist(userName, playlistName) {
  if (!userName || !playlistName) {
    console.log('Invalid user or playlist name');
    return;
  }
  if (!users[userName]) {
    console.log('User not found');
    return;
  }
  if (!playlists[userName]) {
    playlists[userName] = {};
  }
  playlists[userName][playlistName] = [];
}

function addSongToPlaylist(userName, playlistName, songTitle) {
  if (!userName || !playlistName || !songTitle) {
    console.log('Invalid input');
    return;
  }
  if (!users[userName] || !playlists[userName] || !playlists[userName][playlistName]) {
    console.log('User or playlist not found');
    return;
  }
  const song = songs.find(s => s.title === songTitle);
  if (!song) {
    console.log('Song not found');
    return;
  }
  playlists[userName][playlistName].push(song);
}

function getPlaylist(userName, playlistName) {
  if (!userName || !playlistName) {
    console.log('Invalid input');
    return [];
  }
  if (!users[userName] || !playlists[userName] || !playlists[userName][playlistName]) {
    console.log('Playlist not found');
    return [];
  }
  return playlists[userName][playlistName];
}

module.exports = {
  addSong,
  registerUser,
  createPlaylist,
  addSongToPlaylist,
  getPlaylist,
}