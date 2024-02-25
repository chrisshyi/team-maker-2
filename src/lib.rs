use std::cmp::Ordering;
use std::collections::BinaryHeap;
use std::cmp::Reverse;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Player {
    name: String,
    games: u32,
    id: u32
}

impl PartialOrd for Player {
    fn partial_cmp(&self, other: &Player) -> Option<Ordering> {
        if self.games > other.games {
            Some(Ordering::Greater)
        } else if self.games < other.games {
            Some(Ordering::Less)
        } else {
            Some(self.id.cmp(&other.id))
        }
    }
}

impl Ord for Player {
    fn cmp(&self, other: &Player) -> Ordering {
        if self.games > other.games {
            Ordering::Greater
        } else if self.games < other.games {
            Ordering::Less
        } else {
            self.id.cmp(&other.id)
        }
    }
}

impl Eq for Player {}

impl PartialEq for Player {
    fn eq(&self, other: &Player) -> bool {
        self.id == other.id
    }
}

impl Clone for Player {
    fn clone(&self) -> Player {
        Player {
            name: self.name.clone(),
            games: self.games,
            id: self.id
        }
    }
}

impl Player {
    fn set_games(&mut self, games: u32) {
        self.games = games;
    }

    fn set_name(&mut self, name: &str) {
        self.name = name.to_string();
    }
}

#[wasm_bindgen]
pub struct Picker {
    players: Vec<Player>,
}

#[wasm_bindgen]
impl Picker {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Picker {
        Picker {
            players: Vec::new(),
        }
    }

    #[wasm_bindgen]
    pub fn add_player(&mut self, player: Player) {
        self.players.push(player);
    }

    #[wasm_bindgen]
    pub fn pick(&self, num_players: u32) -> Vec<Player> {
        let num_players: u32 = if num_players > self.players.len() as u32 {
            self.players.len() as u32
        } else {
            num_players
        };
        let mut picks: Vec<Player> = Vec::new();
        let mut heap: BinaryHeap<_> = self.players.clone().into_iter().map(Reverse).collect();

        for _ in 0..num_players {
            let player = heap.pop().unwrap().0;
            picks.push(player);
        }
        picks
    }

    #[wasm_bindgen]
    pub fn set_player_games(&mut self, index: usize, games: u32) {
        self.players[index].set_games(games);
    }

    #[wasm_bindgen]
    pub fn set_player_name(&mut self, index: usize, name: &str) {
        self.players[index].set_name(name);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn set_up_picker(num_players: u32) -> Picker {
        let mut picker = Picker::new();
        for i in 0..num_players {
            picker.add_player(Player {
                name: format!("p{}", i + 1),
                games: i + 1,
                id: i + 1
            });
        }
        // Sets up players [1, 2, 3, 4, 5...]
        picker
    }

    fn set_up_picker_reverse(num_players: u32) -> Picker {
        let mut picker = Picker::new();
        for i in (0..num_players).rev() {
            picker.add_player(Player {
                name: format!("p{}", i + 1),
                games: i + 1,
                id: i + 1
            });
        }
        // Sets up players [5, 4, 3, 2, 1...]
        picker
    }

    #[test]
    fn test_picker_pick() {
        let picker = set_up_picker(5);

        let num_picks = 3;
        let picks = picker.pick(num_picks);

        assert_eq!(picks.len(), num_picks as usize);
        for i in 0..num_picks {
            let pick = &picks[i as usize];
            assert_eq!(pick.games, i + 1);
            assert_eq!(pick.id, i + 1);
            assert_eq!(pick.name, format!("p{}", i + 1));
        }
    }

    #[test]
    fn test_picker_pick_with_mutation() {
        let num_players = 5;
        let mut picker = set_up_picker(num_players);

        let num_picks = 3;
        // The last player has 0 games
        picker.set_player_games(num_players as usize - 1, 0);
        let picks = picker.pick(num_picks);

        assert_eq!(picks.len(), num_picks as usize);
        assert_eq!(picks[0].games, 0);
        assert_eq!(picks[0].id, num_players);
        assert_eq!(picks[0].name, format!("p{}", num_players));

        // the rest of the picks should be [1, 2]
        for i in 1..num_picks {
            let pick = &picks[i as usize];
            assert_eq!(pick.games, i);
            assert_eq!(pick.id, i);
            assert_eq!(pick.name, format!("p{}", i));
        }
    }

    #[test]
    fn test_picker_pick_rev() {
        let picker = set_up_picker_reverse(5);

        let num_picks = 3;
        let picks = picker.pick(num_picks);

        assert_eq!(picks.len(), num_picks as usize);
        for i in 0..num_picks {
            let pick = &picks[i as usize];
            assert_eq!(pick.games, i + 1);
            assert_eq!(pick.id, i + 1);
            assert_eq!(pick.name, format!("p{}", i + 1));
        }
    }
}