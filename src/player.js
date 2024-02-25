export default class Player {
    constructor(id, name, games) {
        this.id = id;
        this.name = name;
        this.games = games;
        this.paused = false;
    }
}