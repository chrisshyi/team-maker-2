import { useState } from 'react';

function PlayerDisplay({ player }) {
    return (
        <>
            <div>
                <input type="text" name="player" id="player" value={player} readOnly></input>
                <button>Remove</button>
            </div>
        </>
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
        <div>
            <input type="text" id="new-player" name="new-player" onChange={handleChange} value={player}></input>
            <button onClick={handleAddPlayer}>Add Player</button>
        </div>
    );
}

function PlayerForm({ handleMakeTeams }) {
    const [players, setPlayers] = useState([]);

    function addPlayer(player) {
        setPlayers([...players, player])
    }

    return (
        <>
           <form action="">
                <label htmlFor="team-size">Size of Each Team </label>
                <input type="text" name="team-size" id="team-size"></input>
           </form>
            {players.map((player, index) => <PlayerDisplay player={player} />)}
            <PlayerInput addPlayer={addPlayer}/>
        </>
    )
}


export default function TeamMaker() {
    const [teamSize, setTeamSize] = useState(null);
    const [teams, setTeams] = useState([])

    function handleMakeTeams() {

    }

    if (teamSize) {
        return (
            teams.map((team, index) => {
                return (
                    <li key={index}>
                        <ul>
                            {team.map((member, i) => <li key={member}>{member}</li>)}
                        </ul>
                    </li>
                )
            })
        )
    } else {
        return <PlayerForm handleMakeTeams={handleMakeTeams} />;
    }
}
