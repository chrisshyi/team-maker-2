import { useState } from 'react';

function PlayerDisplay({ player, handleRemovePlayer, key }) {
    return (
        <>
            <div className="input-group mb-3">
                <input
                    type="text" name="player" id={key} value={player} readOnly
                    className="form-control"
                >
                </input>
                <button
                    onClick={handleRemovePlayer}
                    className="btn btn-outline-danger"
                    type="button"
                >
                    Remove
                </button>
            </div>
        </>
    );
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
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


function PlayerForm({ players, setPlayers, teamSize, setTeamSize, makeTeams }) {
    const handleTeamSizeChange = (event) => {
        const size = parseInt(event.target.value);
        setTeamSize(isNaN(size) ? '' : size);
    }

    function addPlayer(player) {
        setPlayers([...players, player])
    }

    function removePlayer(index) {
        setPlayers([...players.slice(0, index), ...players.slice(index + 1)])
    }

    return (
        <>
            <div className="row">
                <div className="col">
                    <form>
                        <label htmlFor="team-size" className="form-label">Size of Each Team </label>
                        <input type="text" name="team-size"
                            id="team-size" className="form-control"
                            onChange={handleTeamSizeChange} value={teamSize}>
                        </input>
                        <div id="team-size-help" className="form-text">How big is each team?</div>
                    </form>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <form>
                        {<h3 className="display-6 fw-bold text-body-emphasis">Players</h3>}
                        {
                            players.map(
                                (player, index) => {
                                    return <PlayerDisplay player={player}
                                        handleRemovePlayer={() => removePlayer(index)}
                                        key={player + index}
                                    />
                                }
                            )
                        }
                    </form>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <PlayerInput addPlayer={addPlayer} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button onClick={makeTeams} className="btn btn-success">Make Teams</button>
                </div>
            </div>
        </>
    )
}

function TeamDisplay({ teams, setTeams, makeTeams }) {
    return (
        <>
            <div className="row">
                <div className="col">
                    {
                        teams.map((team, index) => {
                            return (
                                <ul className="list-group mb-4 mt-5" key={index}>
                                    {team.map((member, i) => <li key={index + member + i} className="list-group-item">{member}</li>)}
                                </ul>
                            )
                        })
                    }
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button onClick={() => setTeams([])} className="btn btn-primary">Start Over</button>
                </div>
                <div className="col">
                    <button className="btn btn-warning" onClick={makeTeams}>Shuffle</button>
                </div>
            </div>
        </>
    )
}

export default function TeamMaker() {
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [teamSize, setTeamSize] = useState('');

    function makeTeams() {
        if (!teamSize || players.length === 0) {
            return;
        }

        const teams = [];
        console.log(`players = ${players}`);
        const shuffledPlayers = [...players.slice()];
        shuffleArray(shuffledPlayers);
        console.log(`shuffledPlayers = ${shuffledPlayers}`);

        for (let i = 0; i < shuffledPlayers.length; i += teamSize) {
            console.log(`i = {i}`);
            const end = Math.min(i + teamSize, shuffledPlayers.length)
            const team = shuffledPlayers.slice(i, end);
            console.log(`Pushing team = ${team}`);
            teams.push(team);
        }

        setTeams(teams);
    }

    return (
        <div className="container">
            <div className="row mb-5">
                <div className="col-md-3 col-sm-1"></div>
                <div className="col-md-6 col-sm-10">
                    {
                        teams.length > 0 ? <TeamDisplay teams={teams} setTeams={setTeams} makeTeams={makeTeams}/>
                                         : <PlayerForm
                                            players={players} setPlayers={setPlayers}
                                            teamSize={teamSize} setTeamSize={setTeamSize}
                                            makeTeams={makeTeams}
                                           />
                    }
                </div>
                <div className="col-md-3 col-sm-1"></div>
            </div>
        </div>
    )
}
