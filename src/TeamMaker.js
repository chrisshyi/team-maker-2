import { useState } from 'react';
import Picker from "./picker";
import "./styles.css";

function PicksDisplay({ pickedPlayers }) {
    return (
        <div className="row mb-5">
            <div className="col">
                <ul className="list-group">
                    {
                        pickedPlayers.length > 0 && <h4>Picks</h4>
                    }
                    {
                        pickedPlayers.map(
                            (player, _) => {
                                return (
                                    <li className="list-group-item" key={player.id}>{player.name}</li>
                                )
                            }
                        )
                    }
                </ul>
            </div>
        </div>
    )
}

function PlayerDisplay(
    {
        player, handleRemovePlayer,
        handleIncPlayerGames, handleDecPlayerGames,
        handleTogglePlayerPaused
    }
) {
    return (
        <div className="row">
            <div className="col-8">
                <div className="input-group mb-3">
                    <input
                        type="text" name="playerName" id={player.id + "name"} value={player.name} readOnly
                        className="form-control"
                        disabled={player.paused}
                    >
                    </input>
                    <button
                        onClick={handleRemovePlayer}
                        className="btn btn-outline-danger"
                        type="button"
                    >
                        X
                    </button>
                    {
                        player.paused ?
                        <button onClick={handleTogglePlayerPaused} className="btn btn-warning" type="button">😴</button>
                        :
                        <button onClick={handleTogglePlayerPaused} className="btn btn-outline-warning" type="button">😴</button>
                    }
                </div>
            </div>
            <div className="col-4">
                <div className="input-group mb-3">
                    <input
                        type="text" name="playerGames" id={player.games + "games"} value={player.games} readOnly
                        className="form-control"
                    >
                    </input>
                    <button onClick={handleIncPlayerGames} className="btn btn-outline-primary" type="button">+</button>
                    <button onClick={handleDecPlayerGames} className="btn btn-outline-danger" type="button">-</button>
                </div>
            </div>
        </div>
    );
}


function PlayerInput({ addPlayer }) {
    const [player, setPlayer] = useState('');

    const handleChange = (event) => {
        setPlayer(event.target.value);
    }

    const handleAddPlayer = () => {
        addPlayer(player);
        setPlayer('');
    };

    return (
        <div className="input-group mb-3">
            <input type="text"
                id="new-player"
                name="new-player" onChange={handleChange} value={player}
                className="form-control"
            >
            </input>
            <button onClick={handleAddPlayer} className="btn btn-primary" type="button">
                Add Player
            </button>
        </div>
    );
}

function NumPicksInput({ numPicks, setNumPicks }) {
    const handleNumPicksChange = (event) => {
        const size = parseInt(event.target.value);
        setNumPicks(isNaN(size) ? '' : size);
    }

    return (
        <div className="row mb-3">
            <div className="col">
                <form>
                    <label htmlFor="team-size" className="form-label"># Players Next Round</label>
                    <input type="text" name="team-size"
                        id="team-size" className="form-control"
                        onChange={handleNumPicksChange} value={numPicks}>
                    </input>
                    <div id="team-size-help" className="form-text">Number of players to pick for the next round</div>
                </form>
            </div>
        </div>
    )
}


function PlayerForm({ numPicks, setNumPicks, picker, setPicker, currentPicks, setCurrentPicks }) {
    function addPlayer(player) {
        if (player !== '') {
            const newPicker = picker.clone(picker.players, picker.currentId);
            newPicker.addPlayer(player);
            setPicker(newPicker);
        }
    }

    function removePlayer(id) {
        const newPicker = picker.clone(picker.players, picker.currentId);
        newPicker.removePlayer(id);
        setPicker(newPicker);
    }

    function pickPlayers(random) {
        let picks;
        if (random) {
            picks = picker.pickRandom(numPicks);
        } else {
            picks = picker.pick(numPicks);
        }
        const newPicker = picker.clone(picker.players, picker.currentId);
        for (const pick of picks) {
            newPicker.setPlayerGames(pick.id, pick.games + 1);
        }
        setPicker(newPicker);
        setCurrentPicks(picks);
    }

    function setPlayerGames(id, games) {
        const newPicker = picker.clone(picker.players, picker.currentId);
        newPicker.setPlayerGames(id, games);
        setPicker(newPicker);
    }

    function togglePlayerPaused(id) {
        const newPicker = picker.clone(picker.players, picker.currentId);
        newPicker.togglePlayerPaused(id);
        setPicker(newPicker);
    }

    return (
        <>
            <div className="row">
                <div className="col">
                    <form>
                        <h3 className="display-7 fw-bold text-body-emphasis mt-4">Players</h3>
                        {
                            picker.getPlayers().length > 0 &&
                            <div className="row mb-2">
                                <div className="col-8">
                                    Player
                                </div>
                                <div className="col-4">
                                    Games Played
                                </div>
                            </div>
                        }
                        {
                            picker.getPlayers().map(
                                (player, _) => {
                                    return <PlayerDisplay player={player} playerId={player.id} games={player.games}
                                        playerName={player.name}
                                        handleRemovePlayer={() => removePlayer(player.id)}
                                        handleIncPlayerGames={() => setPlayerGames(player.id, player.games + 1)}
                                        handleDecPlayerGames={() => setPlayerGames(player.id, player.games - 1)}
                                        handleTogglePlayerPaused={() => togglePlayerPaused(player.id)}
                                        key={player.id}
                                    />
                                }
                            )
                        }
                    </form>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <PlayerInput addPlayer={addPlayer} />
                </div>
            </div>
            <NumPicksInput numPicks={numPicks} setNumPicks={setNumPicks} />
            <div className="row mb-4">
                <div className="col">
                    <button onClick={() => pickPlayers(false)} className="btn btn-success">Pick Players</button>
                </div>
                <div className="col">
                    <button onClick={() => pickPlayers(true)} className="btn btn-primary">Random</button>
                </div>
            </div>
            <PicksDisplay pickedPlayers={currentPicks} />
        </>
    )
}

export default function TeamMaker() {
    const [numPicks, setNumPicks] = useState(0);
    const [currentPicks, setCurrentPicks] = useState([]);
    const [picker, setPicker] = useState(new Picker());

    return (
        <div className="container">
            <div className="row mb-5">
                <div className="col-md-3 col-sm-1"></div>
                <div className="col-md-6 col-sm-10">
                    {
                        <PlayerForm
                            picker={picker} setPicker={setPicker}
                            numPicks={numPicks} setNumPicks={setNumPicks}
                            currentPicks={currentPicks} setCurrentPicks={setCurrentPicks}
                        />
                    }
                </div>
                <div className="col-md-3 col-sm-1"></div>
            </div>
        </div>
    )
}
