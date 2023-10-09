import { useState } from 'react';

function PlayerDisplay({ player, handleRemovePlayer, key }) {
    return (
        <>
            <div>
                <input type="text" name="player" id={key} value={player} readOnly></input>
                <button onClick={handleRemovePlayer}>Remove</button>
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
        <div>
            <input type="text" id="new-player" name="new-player" onChange={handleChange} value={player}></input>
            <button onClick={handleAddPlayer}>Add Player</button>
        </div>
    );
}


function PlayerForm({ setTeams }) {
    const [players, setPlayers] = useState([]);
    const [teamSize, setTeamSize] = useState('');

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
        <>
            <form action="">
                <label htmlFor="team-size">Size of Each Team </label>
                <input type="text" name="team-size" id="team-size" onChange={handleTeamSizeChange} value={teamSize}></input>
            </form>
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
            <PlayerInput addPlayer={addPlayer} />
            <button onClick={makeTeams}>Make Teams</button>
        </>
    )
}


export default function TeamMaker() {
    const [teams, setTeams] = useState([])

    if (teams.length > 0) {
        return (
            <>
                {
                    teams.map((team, index) => {
                        return (
                            <li key={index}>
                                <ul>
                                    {team.map((member, i) => <li key={member}>{member}</li>)}
                                </ul>
                            </li>
                        )
                    })
                }
                <button onClick={() => setTeams([])}>Start Over</button>
            </>
        )
    } else {
        return <PlayerForm setTeams={setTeams} />;
    }
}
