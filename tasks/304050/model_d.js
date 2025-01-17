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
        let weight = 1.0;
        const now = new Date();

        // Time since last play adjustment
        if (song.lastPlayed) {
            const hoursSinceLastPlay = (now - song.lastPlayed) / (1000 * 60 * 60);
            weight *= Math.min(2.0, 1.0 + (hoursSinceLastPlay / 24));
        } else {
            weight *= 2.0; // Never played songs get maximum time bonus
        }

        // Play count penalty
        weight *= Math.pow(0.95, song.playCount);

        // Artist history penalty
        const lastArtistPlay = this.artistHistory.get(song.artist);
        if (lastArtistPlay && (now - lastArtistPlay) / (1000 * 60 * 60) <= 2) {
            weight *= 0.8;
        }

        // Genre history penalty
        const lastGenrePlay = this.genreHistory.get(song.genre);
        if (lastGenrePlay && (now - lastGenrePlay) / (1000 * 60 * 60) <= 1) {
            weight *= 0.9;
        }

        return weight;
    }

    shuffle() {
        if (this.songs.length === 0) {
            throw new Error('Playlist is empty');
        }

        // Update weights for all songs
        this.songs.forEach(song => {
            song.weight = this.updateWeight(song);
        });

        // Calculate total weight
        const totalWeight = this.songs.reduce((sum, song) => sum + song.weight, 0);
        let randomWeight = Math.random() * totalWeight;

        // Select song based on weight
        let selected = null;
        for (const song of this.songs) {
            randomWeight -= song.weight;
            if (randomWeight <= 0) {
                selected = song;
                break;
            }
        }

        // Update history and statistics
        selected.playCount++;
        selected.lastPlayed = new Date();
        this.artistHistory.set(selected.artist, selected.lastPlayed);
        this.genreHistory.set(selected.genre, selected.lastPlayed);

        // Maintain play history length
        this.playHistory.push(selected.title);
        if (this.playHistory.length > this.songs.length) {
            this.playHistory.shift();
        }

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

    getPlaylistAnalytics() {
        const totalPlays = this.songs.reduce((sum, song) => sum + song.playCount, 0);
        const totalWeight = this.songs.reduce((sum, song) => sum + song.weight, 0);
        const averageWeight = this.songs.length > 0 ? totalWeight / this.songs.length : 0;

        const mostPlayed = [...this.songs].sort((a, b) => b.playCount - a.playCount)[0] || null;
        const leastPlayed = [...this.songs].sort((a, b) => a.playCount - b.playCount)[0] || null;

        return {
            totalSongs: this.songs.length,
            totalPlays,
            averageWeight,
            mostPlayed: mostPlayed ? {
                title: mostPlayed.title,
                playCount: mostPlayed.playCount,
                weight: mostPlayed.weight
            } : null,
            leastPlayed: leastPlayed ? {
                title: leastPlayed.title,
                playCount: leastPlayed.playCount,
                weight: leastPlayed.weight
            } : null
        };
    }
}

module.exports = { SmartPlaylist };