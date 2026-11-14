// Lightweight metadata for every story in the Library.
// Used to feed the recommendation engine without dragging the full story bodies.
// Keep in sync with SHELVES in src/routes/library.tsx.

export type LibraryStoryMeta = {
  id: string;
  title: string;
  blurb: string;
  tag: string;
  shelf: string;
  region?: string;
  minutes: number;
};

export const LIBRARY_STORIES_META: LibraryStoryMeta[] = [
  // Family Stories
  { id: "partition-letter", title: "A Letter from Lahore, August 1947", blurb: "My grandfather's last letter from the city he was about to lose.", tag: "Letter · Punjab", shelf: "Family Stories", region: "Punjab", minutes: 12 },
  { id: "nanima-wedding", title: "Interview: My Nani's Wedding, Jaipur 1962", blurb: "Recorded one monsoon afternoon on a kitchen stool, in three languages.", tag: "Oral History · Rajasthan", shelf: "Family Stories", region: "Rajasthan", minutes: 14 },
  { id: "sindh-migration", title: "Diary of a Sindhi Tailor, Bombay 1948", blurb: "Three pages from a coal-smudged notebook, written from a refugee camp.", tag: "Diary · Sindh / Bombay", shelf: "Family Stories", region: "Maharashtra", minutes: 11 },
  { id: "soldier-letter", title: "Letters from a Soldier, NEFA 1962", blurb: "Eleven envelopes, one of them never opened. He did not come home.", tag: "Letters · Assam / Arunachal", shelf: "Family Stories", region: "Northeast", minutes: 10 },
  { id: "recipe-diary", title: "My Paati's Recipe Diary, Thanjavur 1958–1989", blurb: "A hardback notebook with thirty-one years of marginalia.", tag: "Diary · Tamil Nadu", shelf: "Family Stories", region: "Tamil Nadu", minutes: 9 },
  { id: "kashmiri-houseboat", title: "Interview: Houseboat Owner, Dal Lake 1989", blurb: "Recorded in 2019 by his great-grandson, on a phone propped against a samovar.", tag: "Oral History · Kashmir", shelf: "Family Stories", region: "Kashmir", minutes: 8 },

  // Civilizations
  { id: "indus", title: "Indus Valley", blurb: "Cities of brick, water, and quiet symmetry.", tag: "Civilization", shelf: "Civilizations", region: "Northwest", minutes: 8 },
  { id: "mauryan", title: "Mauryan Empire", blurb: "Ashoka's edicts carved on stone, taller than thrones.", tag: "Civilization", shelf: "Civilizations", region: "Pan-India", minutes: 7 },
  { id: "gupta", title: "Gupta Period", blurb: "A golden age of mathematics, metallurgy, and verse.", tag: "Civilization", shelf: "Civilizations", region: "North India", minutes: 6 },
  { id: "chola", title: "Chola Dynasty", blurb: "Bronzes that dance and a navy that crossed oceans.", tag: "Civilization", shelf: "Civilizations", region: "Tamil Nadu", minutes: 9 },
  { id: "mughal", title: "Mughal Era", blurb: "Persian gardens, Indian stone, and an emperor who wept at marble.", tag: "Civilization", shelf: "Civilizations", region: "North India", minutes: 7 },

  // Languages
  { id: "sanskrit", title: "Sanskrit", blurb: "A grammar so precise it inspired computer science.", tag: "Language", shelf: "Languages", region: "Pan-India", minutes: 6 },
  { id: "brahmi", title: "Brahmi", blurb: "The mother script of half a continent.", tag: "Script", shelf: "Languages", region: "Pan-India", minutes: 5 },
  { id: "tamil", title: "Tamil Literature", blurb: "Sangam poems older than most empires.", tag: "Language", shelf: "Languages", region: "Tamil Nadu", minutes: 7 },
  { id: "persian", title: "Persian Influences", blurb: "The court tongue that became a poet's mother.", tag: "Language", shelf: "Languages", region: "North India", minutes: 5 },
  { id: "dialects", title: "Forgotten Dialects", blurb: "Voices that survive in lullabies and ledgers.", tag: "Language", shelf: "Languages", region: "Northeast", minutes: 6 },

  // Legends & Folklore
  { id: "myths", title: "Regional Myths", blurb: "Why the river turned, why the mountain bowed.", tag: "Folklore", shelf: "Festivals", region: "Pan-India", minutes: 5 },
  { id: "heroes", title: "Heroic Tales", blurb: "Pabuji, Tejaji, the chieftains who came back for one last duty.", tag: "Folklore", shelf: "Festivals", region: "Rajasthan", minutes: 6 },
  { id: "sacred", title: "Sacred Stories", blurb: "Krishna's mischief, Sita's exile, Buddha's silence.", tag: "Folklore", shelf: "Festivals", region: "Pan-India", minutes: 7 },
  { id: "oral", title: "Oral Traditions", blurb: "Memory as the oldest archive we have.", tag: "Folklore", shelf: "Festivals", region: "Pan-India", minutes: 5 },

  // Architecture
  { id: "temples", title: "Temples", blurb: "Mountains carved inward until they became gods.", tag: "Architecture", shelf: "Architecture", region: "South India", minutes: 8 },
  { id: "forts", title: "Forts", blurb: "Walls that watched centuries.", tag: "Architecture", shelf: "Architecture", region: "Rajasthan", minutes: 6 },
  { id: "stepwells", title: "Stepwells", blurb: "Architecture you descend into, not up.", tag: "Architecture", shelf: "Architecture", region: "Gujarat", minutes: 5 },
  { id: "palaces", title: "Palaces", blurb: "Where mirror, marble, and intrigue all reflected each other.", tag: "Architecture", shelf: "Architecture", region: "Rajasthan", minutes: 6 },
  { id: "monasteries", title: "Monasteries", blurb: "Cells of silence above the snow line.", tag: "Architecture", shelf: "Architecture", region: "Himalayas", minutes: 7 },

  // Art & Crafts
  { id: "textiles", title: "Textiles", blurb: "Patola, Jamdani, Kalamkari - fabrics written by hand.", tag: "Craft", shelf: "Crafts", region: "Gujarat", minutes: 7 },
  { id: "pottery", title: "Pottery", blurb: "Earth, wheel, fire, hand. Nothing else.", tag: "Craft", shelf: "Crafts", region: "Rajasthan", minutes: 5 },
  { id: "miniature", title: "Miniature Paintings", blurb: "Stories painted on the back of a hand.", tag: "Art", shelf: "Crafts", region: "Rajasthan", minutes: 6 },
  { id: "sculpture", title: "Sculpture", blurb: "From Mathura serenity to Hoysala excess.", tag: "Art", shelf: "Crafts", region: "Karnataka", minutes: 6 },
  { id: "metalwork", title: "Metalwork", blurb: "Bidri, dhokra, repoussé - alloys with memory.", tag: "Craft", shelf: "Crafts", region: "Pan-India", minutes: 5 },

  // Music & Performance
  { id: "classical", title: "Classical Traditions", blurb: "Hindustani and Carnatic - two rivers from one sky.", tag: "Music", shelf: "Music", region: "Pan-India", minutes: 8 },
  { id: "folk", title: "Folk Music", blurb: "Songs sung while planting, walking, mourning, marrying.", tag: "Music", shelf: "Music", region: "Pan-India", minutes: 5 },
  { id: "dance", title: "Dance Forms", blurb: "Bharatanatyam, Kathak, Odissi, Manipuri.", tag: "Performance", shelf: "Performance", region: "Pan-India", minutes: 7 },
  { id: "theatre", title: "Theatre", blurb: "Kathakali masks, Yakshagana torches, Koodiyattam nights.", tag: "Performance", shelf: "Performance", region: "Kerala", minutes: 6 },
  { id: "ritual", title: "Ritual Performances", blurb: "Theyyam, where the dancer becomes the god.", tag: "Performance", shelf: "Performance", region: "Kerala", minutes: 6 },
];
