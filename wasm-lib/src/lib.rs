use std::sync::RwLock;
use std::cmp::Ordering;
use std::collections::BinaryHeap;
use std::collections::HashMap;
use std::cmp::Reverse;
use wasm_bindgen::prelude::*;
// https://stackoverflow.com/a/73014979
static PICKER: RwLock<Option<Picker>> = RwLock::new(None);

#[wasm_bindgen]
pub fn pick(num_players: u32) -> Vec<Player> {
    PICKER.read().unwrap().as_ref().unwrap().pick(num_players)
}

#[wasm_bindgen]
pub fn add_player(name: &str) {
    PICKER.write().unwrap().as_mut().unwrap().add_player(name);
}

#[wasm_bindgen]
pub fn remove_player(id: u32) {
    PICKER.write().unwrap().as_mut().unwrap().remove_player(id);
}

#[wasm_bindgen]
pub fn clear_players() {
    PICKER.write().unwrap().as_mut().unwrap().clear_players();
}

#[wasm_bindgen]
pub fn set_player_games(id: u32, games: u32) {
    PICKER.write().unwrap().as_mut().unwrap().set_player_games(id, games);
}

#[wasm_bindgen]
pub fn get_players() -> Vec<Player> {
    match PICKER.read().unwrap().as_ref() {
        Some(picker) => picker.get_players().clone(),
        None => Vec::new()
    }
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub struct Player {
    pub id: u32,
    #[wasm_bindgen(getter_with_clone)]
    pub name: String,
    pub games: u32
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

#[wasm_bindgen]
impl Player {
    #[wasm_bindgen(constructor)]
    pub fn new(id: u32, name: String, games: u32 ) -> Player {
        Player {
            id,
            name,
            games,
        }
    }

    fn set_games(&mut self, games: u32) {
        self.games = games;
    }

    fn set_name(&mut self, name: &str) {
        self.name = name.to_string();
    }
}

#[wasm_bindgen]
pub struct Picker {
    current_id: u32,
    players: HashMap<u32, Player>
}

impl Picker {
    pub fn new() -> Picker {
        Picker {
            current_id: 0,
            players: HashMap::new()
        }
    }

    pub fn add_player(&mut self, name: &str) {
        self.current_id += 1;
        self.players.insert(self.current_id, Player{
            id: self.current_id,
            name: name.to_string(),
            games: 0
        });
    }

    pub fn pick(&self, num_players: u32) -> Vec<Player> {
        let num_players: u32 = if num_players > self.players.len() as u32 {
            self.players.len() as u32
        } else {
            num_players
        };
        let mut picks: Vec<Player> = Vec::new();
        let mut heap: BinaryHeap<_> = self.players.clone().into_values().map(Reverse).collect();

        for _ in 0..num_players {
            let player = heap.pop().unwrap().0;
            picks.push(player);
        }
        picks
    }

    pub fn set_player_games(&mut self, id: u32, games: u32) {
        match self.players.get_mut(&id) {
            Some(player) => player.set_games(games),
            None => log(&format!("Player with id {} not found", id))
        }
    }

    pub fn set_player_name(&mut self, id: u32, name: &str) {
        match self.players.get_mut(&id) {
            Some(player) => player.set_name(name),
            None => log(&format!("Player with id {} not found", id))
        }
    }

    pub fn clear_players(&mut self) {
        self.players.clear();
    }

    fn remove_player(&mut self, id: u32) {
        self.players.remove(&id);
    }

    fn get_players(&self) -> Vec<Player> {
        let mut players = self.players.values().cloned().collect::<Vec<Player>>();
        players.sort();
        players
    }
}

#[wasm_bindgen(start)]
pub fn main() {
    PICKER.write().unwrap().replace(Picker::new());
    add_player(format!("Player 1").as_str());
    add_player(format!("Player 2").as_str());
    add_player(format!("Player 3").as_str());

    set_player_games(1, 1);
    set_player_games(2, 2);
    set_player_games(3, 0);
    log("Set up picker state");

    let players = get_players();
    for player in players {
        log(&format!("Player: {}, id: {}, games: {}", player.name, player.id, player.games));
    }
}


#[cfg(test)]
mod tests {
    use super::*;

    fn set_up_picker(num_players: u32) -> Picker {
        let mut picker = Picker::new();
        for i in 0..num_players {
            picker.add_player(&format!("p{}", i + 1));
            picker.set_player_games(i + 1, i + 1);
        }
        // Sets up players [1, 2, 3, 4, 5...]
        // games           [1, 2, 3, 4, 5...]
        picker
    }

    fn set_up_picker_reverse(num_players: u32) -> Picker {
        let mut picker = Picker::new();
        for i in 0..num_players {
            picker.add_player(&format!("p{}", i + 1));
            picker.set_player_games(i + 1, 5 - i);
        }
        // Sets up players [1, 2, 3, 4, 5]
        // games           [5, 4, 3, 2, 1]
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
        picker.set_player_games(num_players as u32, 0);
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
            assert_eq!(pick.id, 5 - i);
            assert_eq!(pick.name, format!("p{}", 5 - i));
        }
    }

    #[test]
    fn test_get_players() {
        let picker = set_up_picker(5);

        let player_ids = picker.get_players().iter().map(|p| p.id).collect::<Vec<u32>>();
        for i in 0..player_ids.len() {
            assert_eq!(player_ids[i], i as u32 + 1);
        }
    }

    #[test]
    fn test_get_players_rev() {
        let picker = set_up_picker_reverse(5);

        let player_ids = picker.get_players().iter().map(|p| p.id).collect::<Vec<u32>>();
        for i in 0..player_ids.len() {
            assert_eq!(player_ids[i], 5 - i as u32);
        }
    }
}