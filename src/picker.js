import Player from './player.js';

export default class Picker {
    constructor() {
        this.players = new Map();
        this.currentId = 0;
    }

    clone(players, currentId) {
        const newPicker = new Picker();
        newPicker.players = new Map(players);
        newPicker.currentId = currentId;
        return newPicker;
    }

    addPlayer(name) {
        this.currentId++;
        this.players.set(this.currentId, new Player(
            this.currentId,
            name,
            0
        ));
    }

    setPlayerName(id, name) {
        if (this.players.has(id)) {
            this.players.get(id).name = name;
        }
    }

    setPlayerGames(id, games) {
        if (this.players.has(id)) {
            this.players.get(id).games = games;
        }
    }

    removePlayer(id) {
        this.players.delete(id);
    }

    getPlayers() {
        if (this.players.size === 0) {
            return [];
        }
        const players = Array.from(this.players.values());
        players.sort((p1, p2) => {
            if (p1.games < p2.games) {
                return -1;
            } else if (p1.games > p2.games) {
                return 1;
            } else {
                return p1.id - p2.id;
            }
        });
        return players;
    }

    clearPlayers() {
        this.players.clear();
    }

    resetAllPlayerGames() {
        for (const player of this.players.values()) {
            player.games = 0;
        }
    }

    pick(numPicks) {
        if (this.players.size === 0) {
            return [];
        }
        const players = Array.from(this.players.values());
        players.sort((p1, p2) => {
            if (p1.games < p2.games) {
                return -1;
            } else if (p1.games > p2.games) {
                return 1;
            } else {
                return p1.id - p2.id;
            }
        });
        numPicks = Math.min(numPicks, players.length);
        return Array.from(players.slice(0, numPicks));
    }
}