// Фракции и квесты Outward Definitive Edition
// Все 4 фракции ВЗАИМОИСКЛЮЧАЕМЫ - при выборе одной, остальные 3 блокируются

const FACTIONS = {
  blue_chamber: {
    id: 'blue_chamber',
    name: 'Blue Chamber Collective',
    ru: 'Голубая Палата',
    exclusive: true,
    parallel_quest: 'vendavel_quest'
  },
  holy_mission: {
    id: 'holy_mission',
    name: 'Holy Mission of Elatt',
    ru: 'Святая Миссия Элатта',
    exclusive: true,
    parallel_quest: 'purifier'
  },
  heroic_kingdom: {
    id: 'heroic_kingdom',
    name: 'Heroic Kingdom of Levant',
    ru: 'Героическое Королевство Левант',
    exclusive: true,
    parallel_quest: 'blood_under_sun'
  },
  sorobor_academy: {
    id: 'sorobor_academy',
    name: 'Sorobor Academy',
    ru: 'Академия Соробор',
    exclusive: true,
    dlc: 'The Soroboreans',
    parallel_quest: 'rust_and_vengeance'
  }
};

const QUESTS = [
  // Blue Chamber
  { id: 'mixed_legacies', name: 'Mixed Legacies', faction: 'blue_chamber', order: 1, type: 'main' },
  { id: 'ash_giants', name: 'Ash Giants', faction: 'blue_chamber', order: 2, type: 'main' },
  { id: 'whispering_bones', name: 'Whispering Bones', faction: 'blue_chamber', order: 3, type: 'main' },
  { id: 'ancestral_peacemaker', name: 'Ancestral Peacemaker', faction: 'blue_chamber', order: 4, type: 'main' },
  { id: 'vendavel_quest', name: 'Vendavel Quest', faction: 'blue_chamber', order: 5, type: 'parallel', timed: true },

  // Holy Mission
  { id: 'questions_and_corruption', name: 'Questions and Corruption', faction: 'holy_mission', order: 1, type: 'main' },
  { id: 'doubts_and_secrets', name: 'Doubts and Secrets', faction: 'holy_mission', order: 2, type: 'main' },
  { id: 'truth_and_purpose', name: 'Truth and Purpose', faction: 'holy_mission', order: 3, type: 'main' },
  { id: 'hallowed_peacemaker', name: 'Hallowed Peacemaker', faction: 'holy_mission', order: 4, type: 'main' },
  { id: 'purifier', name: 'Purifier', faction: 'holy_mission', order: 5, type: 'parallel', timed: true },

  // Heroic Kingdom
  { id: 'tending_the_flame', name: 'Tending the Flame', faction: 'heroic_kingdom', order: 1, type: 'main' },
  { id: 'sand_corsairs', name: 'Sand Corsairs', faction: 'heroic_kingdom', order: 2, type: 'main' },
  { id: 'mouths_to_feed', name: 'Mouths to Feed', faction: 'heroic_kingdom', order: 3, type: 'main' },
  { id: 'heroic_peacemaker', name: 'Heroic Peacemaker', faction: 'heroic_kingdom', order: 4, type: 'main' },
  { id: 'blood_under_sun', name: 'Blood Under The Sun', faction: 'heroic_kingdom', order: 5, type: 'parallel', timed: true },

  // Sorobor Academy
  { id: 'enrollment', name: 'Enrollment', faction: 'sorobor_academy', order: 1, type: 'main' },
  { id: 'up_the_ladder', name: 'Up The Ladder', faction: 'sorobor_academy', order: 2, type: 'main' },
  { id: 'a_knife_in_the_back', name: 'A Knife in the Back', faction: 'sorobor_academy', order: 3, type: 'main' },
  { id: 'cloak_and_dagger', name: 'Cloak and Dagger', faction: 'sorobor_academy', order: 4, type: 'main' },
  { id: 'a_house_divided', name: 'A House Divided', faction: 'sorobor_academy', order: 5, type: 'main' },
  { id: 'rust_and_vengeance', name: 'Rust and Vengeance', faction: 'sorobor_academy', order: 6, type: 'parallel', timed: true, dlc: 'The Soroboreans' }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FACTIONS, QUESTS };
}
