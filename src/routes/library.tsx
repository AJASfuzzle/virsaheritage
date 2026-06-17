import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Clock, Sparkles, X, ArrowRight, BookOpen, Heart, Mic, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listLibraryEchoes } from "@/lib/echoes.functions";
import { RecommendationsRow } from "@/components/recs/RecommendationsRow";


export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "The Library of VIRSA — A Curated Archive of Living History" },
      { name: "description", content: "Wander shelves of civilizations, languages, legends, architecture, art, and music. Every story opens another door through time." },
      { property: "og:title", content: "The Library of VIRSA" },
      { property: "og:description", content: "A curated archive where every shelf whispers another forgotten story." },
    ],
  }),
  component: LibraryPage,
});

/* ---------------- data ---------------- */

type Story = {
  id: string;
  title: string;
  blurb: string;
  minutes: number;
  tag: string;
  curator?: boolean;
  body?: string;
};

type Shelf = {
  id: string;
  name: string;
  whisper: string;
  stories: Story[];
};

const SHELVES: Shelf[] = [
  {
    id: "family-stories",
    name: "Family Stories",
    whisper: "Letters, diaries and voices preserved by those who lived them.",
    stories: [
      {
        id: "partition-letter",
        title: "A Letter from Lahore, August 1947",
        blurb: "My grandfather's last letter from the city he was about to lose.",
        minutes: 12,
        tag: "Letter · Punjab",
        curator: true,
        body:
          "My grandfather, Hardev Singh, was twenty-three when he wrote this letter. It was found folded inside a steel trunk in our family home in Ludhiana, tucked between a railway ticket and a black-and-white photograph of his mother. The paper is the colour of weak tea now. The ink has softened to brown.\n\n\"Pyaare Bhrata Ji,\" it begins. Dear elder brother. He is writing from Anarkali Bazaar, Lahore, on the 11th of August 1947. He says the trams are still running but no one is on them. The shop where he buys his cloth has been shuttered for nine days. The shopkeeper, a Muslim friend named Bashir, came in the middle of the night to leave him a bolt of green silk and said, 'Keep it. If anyone asks, you bought it from me last year.' My grandfather writes that he did not know whether the silk was a gift or a goodbye.\n\nHe describes a city already split in two. The Hindus and Sikhs are leaving by the Frontier Mail every evening. The platforms at Lahore Junction are stacked with brass utensils, sewing machines, and grandfather clocks that no one will ever wind again. He writes about an old Sikh tailor he met at the station who refused to leave his sewing machine behind and was carrying it on his head 'as if it were a child'. My grandfather tried to help him. The man said, 'Beta, this machine has fed my family for thirty-five years. If I leave it, what was my life for?'\n\nIn the second half of the letter, the handwriting changes. The ink is thicker, pressed harder into the page. He has heard rumours about Amritsar — that trains are arriving with everyone inside dead. He writes, 'I do not believe these stories. We are too old a people to do such things to each other.' Three days later, he himself boarded a train. He survived. The man with the sewing machine, we never learnt.\n\nHe wrote in Gurmukhi, in the careful schoolboy hand of someone who has been taught to honour the elder he is writing to. He signed it 'aap ka chhota bhai, Hardev'. Your younger brother. He never spoke about Lahore for the rest of his life. The letter spoke for him.\n\nMy grandmother showed me this letter when I was nineteen. She said, 'Read it twice. The first time for what it says. The second time for what he could not bring himself to write.' I have read it many times since. There is a sentence near the end that I think about often: 'The mangoes this year were good. We did not eat enough of them.'",
      },
      {
        id: "nanima-wedding",
        title: "Interview: My Nani's Wedding, Jaipur 1962",
        blurb: "Recorded one monsoon afternoon on a kitchen stool, in three languages.",
        minutes: 14,
        tag: "Oral History · Rajasthan",
        curator: true,
        body:
          "My nani — Pushpa Devi, born 1944 in a village outside Jaipur — agreed to be recorded only on the condition that I peel the peas while she spoke. 'Otherwise it is a performance,' she said. 'And I am not a performer.' The recording is forty-seven minutes long. She switches between Marwari, Hindi and a careful, embarrassed English that she learnt from her grandchildren.\n\nShe was eighteen when she was married. The wedding was arranged in three weeks — fast, by the standards of the time — because my grandfather had been offered a job at the railways in Ajmer and the family wanted everything settled before he left. She had seen his photograph once. He was standing beside a Royal Enfield motorcycle that did not belong to him, borrowed from a cousin for exactly this purpose.\n\n'I did not look at the photograph properly,' she tells me. 'It is bad luck to study too closely. I looked at the motorcycle. I thought, this man is going somewhere.'\n\nShe describes the haldi ceremony in the courtyard of her parents' house. Her aunts ground the turmeric on a flat stone with their bare hands, mixing it with mustard oil and sandalwood. The smell of that paste, she says, is the smell of her own girlhood ending. Her mother sang a song that I have never heard anywhere else — a lament in old Marwari about a daughter who becomes a guest in her own home. She sings four lines of it into the recorder. Her voice cracks on the third line. We pause for tea.\n\nShe arrived at her in-laws' house in a doli carried by four men. The doli was lined with marigolds and a strip of red velvet stitched by her grandmother. When she stepped down, her mother-in-law put a copper pot of rice at the threshold and asked her to kick it over with her right foot — a rite that says, abundance will follow you into this house. She kicked it harder than necessary. The pot dented. Her mother-in-law laughed and said, 'Good. She has strong legs. She will manage the kitchen.'\n\nIn the recording, she pauses for a long time after this. I can hear the pressure cooker whistling in the background. Then she says, in English: 'I did not love him on that day. I did not know him. But I respected the strangeness of what we were doing. We were trying to build a house out of two children who had never met.' She is quiet again. Then: 'It worked. Beta, it worked for fifty-one years. He died last March. The pressure cooker is whistling, please go and turn it off.'\n\nThe transcript is in our family archive now. So is the dented copper pot. My mother polished it once and stopped — she said the dent was the most important part.",
      },
      {
        id: "sindh-migration",
        title: "Diary of a Sindhi Tailor, Bombay 1948",
        blurb: "Three pages from a coal-smudged notebook, written from a refugee camp.",
        minutes: 11,
        tag: "Diary · Sindh / Bombay",
        body:
          "These three pages belong to my great-grandfather, Naraindas Chandiramani. He kept a tailor's shop in Karachi before 1947. The diary is small, the size of a man's palm, with a maroon leather cover and an elastic band that has perished. He wrote in a mixture of Sindhi (in the Khudabadi script my grandmother had to teach me to read) and English, depending on what he was trying to say.\n\nThe first page is dated 'Pila Camp, Kalyan, 4 March 1948'. The camp was on the outskirts of Bombay, a stretch of military barracks repurposed for the Sindhi refugees who had arrived by ship over the previous five months. He writes about the heat — 'the heat of Bombay is a different heat, it has no honesty to it' — and about the food, which is mostly rice and a thin dal he describes as 'water with three lentils swimming in it'.\n\nThe second page is a list. It is a list of everything he left behind in his shop on Bunder Road. He writes:\n\n'• 14 bolts of fine wool, English and Italian\n• 1 Singer treadle machine, 1937 model, in good condition\n• 6 pairs of scissors, including the long pair from my father\n• A photograph of King George with my name printed below it, given by Mr Mountcastle\n• A drawer full of buttons, sorted by colour\n• My measuring tapes, 11 in number\n• My signboard, Naraindas & Sons, Tailors, painted by Hashmat Ali\n• My customers' measurements, in a black ledger, 22 years of them'\n\nThe last item is underlined twice. He writes underneath it, in English: 'Without these measurements I am a tailor in name only.'\n\nThe third page is about a Muslim friend named Hashmat — the same man who painted his signboard. Hashmat came to the docks at midnight on the day my great-grandfather was leaving and pressed a small package into his hand. Inside was a fold of yellow paper. On it Hashmat had written, in his own neat Urdu, every single measurement from the black ledger that he could remember by heart — fifty-two names, my great-grandfather counts. 'He told me, Naraindas bhai, when you open your shop in Hindustan, at least these fifty-two customers, you will still know.'\n\nMy great-grandfather did open a shop, in Ulhasnagar, in 1950. He used Hashmat's measurements for the first fifteen customers who walked in, even though most of them were strangers. He said, 'If a man comes in with the shoulders of an Anwar, I will cut him a coat for an Anwar. The measurements remember even when the men are gone.'\n\nHe died in 1981. We still have the diary, the yellow paper, and a single pair of long scissors that he eventually had shipped to him through a Parsi merchant in 1953. They are in our cupboard in Pune. They still cut cloth cleanly.",
      },
      {
        id: "soldier-letter",
        title: "Letters from a Soldier, NEFA 1962",
        blurb: "Eleven envelopes, one of them never opened. He did not come home.",
        minutes: 10,
        tag: "Letters · Assam / Arunachal",
        body:
          "My great-uncle Captain Joginder Singh Sandhu of the 4 Sikh Regiment wrote eleven letters home between October and November 1962, during the war with China in the North-East Frontier Agency. We have all eleven of them, tied with a length of cotton tape that has gone yellow. The last one is still sealed. My great-grandmother could never bring herself to open it. None of us have either.\n\nThe earlier letters are cheerful in the way that all soldiers' letters home are cheerful. He writes about the cold — 'Mata Ji, please send the brown woollen socks, not the grey ones, the grey ones itch' — and about the height of the mountains, which he says are 'so tall they have made me a smaller man, in a good way'. He describes the local Monpa villagers who bring the soldiers buckwheat pancakes and butter tea. He says the butter tea tastes like 'a soup made by a person who has never eaten soup', and that he has come to love it.\n\nIn the sixth letter he writes about a young sepoy from a village near his own who has never seen snow. The boy stood outside the tent the entire first night it snowed, holding his hands out, until his fingers turned blue and the medic had to bring him in. Joginder writes, 'I scolded him. Then I went outside and did the same thing for ten minutes, secretly. Do not tell anyone.'\n\nThe ninth letter is shorter. He says they are being moved up to a place called Bumla. He cannot say more. He asks after his sister's pregnancy and tells his father that the buffalo named Heera must be sold before winter — 'she will not survive another one, and it is cruel to ask her to try'.\n\nThe tenth letter, dated 16th November 1962, is the one I have read the most. It is six lines long. He says he is well. He says the tea ration has been reduced but the rum has not. He says, 'If you do not hear from me for some weeks, do not worry. The post is slow here. The mountains do not believe in postmen.' He signs it 'your loving son, Jogi.'\n\nThe eleventh letter arrived on the 4th of December, two weeks after the family had received the telegram. It is still sealed. The stamp is a green one — the King George had been replaced by Ashoka's lions by then, and my great-grandmother had not yet got used to the change. She kept the envelope in her almirah, next to her wedding chunni, and would touch it on his birthday every year.\n\nMy mother thinks one day someone will open it. I am not sure. There is a kind of love that lives only in the not-knowing, and I am afraid of disturbing it.",
      },
      {
        id: "recipe-diary",
        title: "My Paati's Recipe Diary, Thanjavur 1958–1989",
        blurb: "A hardback notebook with thirty-one years of marginalia.",
        minutes: 9,
        tag: "Diary · Tamil Nadu",
        curator: true,
        body:
          "My paati — Lakshmi Ammal of Thanjavur — kept her recipes in a maroon hardback notebook with the words 'Bharath Stationers, Kumbakonam' embossed on the cover in fading gold. She began it in 1958, the year she was married, and stopped in 1989, the year my grandfather died. She wrote in Tamil, in a slanting, schoolmistress hand, with the occasional English word slipped in where the Tamil word seemed too plain.\n\nThe recipes themselves are not the point of the notebook. Anyone can find a recipe for rasam. The point is what she wrote in the margins.\n\nUnder her recipe for puli kuzhambu, dated June 1961: 'Made this for V's parents' first visit. His mother said the tamarind was too sour. I have not changed the recipe. She has changed her opinion.'\n\nUnder a recipe for adhirasam, dated November 1964: 'My mother taught me this when I was nine. The dough must rest for one full day. Patience is the first ingredient. My mother died this morning. I am writing this recipe so I do not forget her hands.'\n\nUnder a recipe for kara kozhukattai, dated August 1971: 'V is in Delhi this week. The children have asked me to make this five times. I have made it five times. There is something about a husband being away that makes the children hungrier. Perhaps they are eating his portion too, out of loyalty.'\n\nUnder her recipe for ven pongal, dated January 1979: 'My granddaughter — that is me — 'came to stay for Pongal. She is afraid of the cow. The cow is not afraid of her. I think they will learn to tolerate each other, like all good Tamil women.' I was four years old. I do not remember the cow. I remember the pongal.\n\nThe last entry, March 1989, is not a recipe. It is half a page, in pencil, dated four days after my grandfather's funeral. She writes:\n\n'V loved my morkozhambu more than any other thing I ever cooked. He used to say, eat it slowly, Lakshmi, do not eat it like it is dal, this is morkozhambu, it has a soul. I made it on Tuesday. I have eaten three meals of it now. I have not been able to taste anything since he left. I am writing it down anyway. The next person who reads this notebook will not know that. They will think it is a recipe like any other. Let them. Some sorrow is not for sharing.'\n\nMy mother keeps the notebook now, wrapped in muslin. I am the only grandchild who can still read Tamil. So once a year, on her death anniversary, I take it out and read one page aloud to whoever is in the kitchen with me. The kitchen is usually quiet afterwards. That is the right kind of quiet.",
      },
      {
        id: "kashmiri-houseboat",
        title: "Interview: Houseboat Owner, Dal Lake 1989",
        blurb: "Recorded in 2019 by his great-grandson, on a phone propped against a samovar.",
        minutes: 8,
        tag: "Oral History · Kashmir",
        body:
          "Ghulam Mohammed Najar — 'Gama Saheb' to everyone on Dal Lake — was eighty-four when his great-grandson recorded him. The recording was made in the back room of the houseboat 'Young Prince of Kashmir', moored at the third ghat of Nageen, in October 2019. There is the sound of the kerosene heater. There is the sound of a samovar gurgling. Once, faintly, you can hear the call to prayer from a mosque across the water.\n\nHis family had owned houseboats since his grandfather's time. He describes the boats not as boats but as 'wooden houses that have learnt to float'. The 'Young Prince' was built in 1934 from cedar that his grandfather had bought from a contractor in Pahalgam. The walls of the dining room were carved by a single artisan over fourteen months. The artisan, a Hindu named Pyare Lal Kaul, signed his name in tiny letters inside the foot of one chair, so that you would only see it if you turned the chair over to repair it.\n\nGama Saheb's clearest memories are from the late 1980s. He talks about the foreign tourists — 'the Germans came every May, the Israelis after their army, the English at any time, you could never predict the English' — and the long evenings when guests would sit on the front deck and ask him to tell them about Kashmir. He says, 'I told them every story I knew. When I ran out, I told them stories my father told me. When I ran out of those, I made some up. They did not mind. They had paid for the tea.'\n\nThe tone of the recording changes when he reaches 1989. He says, quietly, 'After that winter, the tourists stopped. They did not come for many, many years. Some came back, but it was never the same. My boats sat empty. The wood does not like to sit empty. It cracks. It feels insulted.'\n\nHe describes patching the 'Young Prince' himself, year after year, with money he did not really have. His sons wanted him to sell. He refused. 'I told them, this boat has my grandfather's hands in it. If I sell it, I am selling a pair of hands. You cannot do that.'\n\nNear the end of the recording, his great-grandson asks him, in English, what he would say to a young Kashmiri who wanted to leave. There is a long pause. Then Gama Saheb says, in Kashmiri, very softly: 'I would say, go. But take the lake with you. Take it in here.' His great-grandson notes in the transcript that he touched the centre of his chest when he said this.\n\nGama Saheb passed away in March 2022. The 'Young Prince of Kashmir' is still moored at the third ghat of Nageen. The artisan's signature is still under the foot of the dining-room chair. We checked.",
      },
    ],
  },
  {

    id: "civilizations",
    name: "Civilizations",
    whisper: "Empires that drew the maps we still walk.",
    stories: [
      { id: "indus", title: "Indus Valley", blurb: "Cities of brick, water, and quiet symmetry.", minutes: 8, tag: "Civilization", curator: true,
        body: "Five thousand years ago, the people of the Indus laid streets at right angles, built granaries the size of city squares, and bathed in vast public pools fed by engineered drains. We still cannot read their script, yet their seals — a bull, a horned figure in meditation — speak across the silence." },
      { id: "mauryan", title: "Mauryan Empire", blurb: "Ashoka’s edicts carved on stone, taller than thrones.", minutes: 7, tag: "Civilization",
        body: "From Pataliputra, Chandragupta and his grandson Ashoka built a state that stretched from the Hindu Kush to the Bay of Bengal. After Kalinga, Ashoka traded conquest for dharma, and had his remorse inscribed on rocks and polished sandstone pillars across the subcontinent." },
      { id: "gupta", title: "Gupta Period", blurb: "A golden age of mathematics, metallurgy, and verse.", minutes: 6, tag: "Civilization", curator: true,
        body: "The zero, the decimal place, the iron pillar of Delhi that does not rust — and Kalidasa writing of clouds carrying lovers’ messages. The Gupta court turned curiosity into a quiet, unhurried civilization." },
      { id: "chola", title: "Chola Dynasty", blurb: "Bronzes that dance and a navy that crossed oceans.", minutes: 9, tag: "Civilization",
        body: "From Tanjore, the Cholas cast Shiva as the cosmic dancer in lost-wax bronze and sent fleets to Srivijaya. Their temples are not buildings; they are calendars, treasuries, theatres, and astronomical instruments at once." },
      { id: "mughal", title: "Mughal Era", blurb: "Persian gardens, Indian stone, and an emperor who wept at marble.", minutes: 7, tag: "Civilization",
        body: "Babur the gardener, Akbar the listener, Shah Jahan the builder. A dynasty that fused Persia and India into miniatures, charbagh gardens, and a tomb of white marble that changes colour with the hours." },
    ],
  },
  {
    id: "languages",
    name: "Languages & Scripts",
    whisper: "Letters that remember what mouths forgot.",
    stories: [
      { id: "sanskrit", title: "Sanskrit", blurb: "A grammar so precise it inspired computer science.", minutes: 6, tag: "Language", curator: true,
        body: "Panini’s Ashtadhyayi, written around the 4th century BCE, describes Sanskrit in 3,959 rules — a generative grammar two millennia before Chomsky. The language carries the Vedas, the Mahabharata, and the Bhagavad Gita." },
      { id: "brahmi", title: "Brahmi", blurb: "The mother script of half a continent.", minutes: 5, tag: "Script",
        body: "From Brahmi descend Devanagari, Tamil, Sinhala, Burmese, Thai, Khmer, Tibetan. Ashoka’s pillars are written in it. For centuries no one could read them — until James Prinsep decoded the script in 1837." },
      { id: "tamil", title: "Tamil Literature", blurb: "Sangam poems older than most empires.", minutes: 7, tag: "Language",
        body: "The Sangam corpus — 2,381 poems by 473 poets — speaks of love, war, kings, and rain on red earth. Tamil is one of the oldest continuously spoken languages in the world." },
      { id: "persian", title: "Persian Influences", blurb: "The court tongue that became a poet’s mother.", minutes: 5, tag: "Language",
        body: "For five hundred years Persian was the language of administration and verse across South Asia. Ghalib, Amir Khusrau, and a thousand letters between merchants and emperors all flowed through it." },
      { id: "dialects", title: "Forgotten Dialects", blurb: "Voices that survive in lullabies and ledgers.", minutes: 6, tag: "Language",
        body: "Brokpa, Toto, Majhi, Kharia — dozens of tongues spoken by a few hundred elders each. Each one is an entire grammar, an entire cosmology, vanishing in real time." },
    ],
  },
  {
    id: "legends",
    name: "Legends & Folklore",
    whisper: "Stories that walked before they were ever written.",
    stories: [
      { id: "myths", title: "Regional Myths", blurb: "Why the river turned, why the mountain bowed.", minutes: 5, tag: "Folklore",
        body: "Every hill and every bend of a river has a story attached — a goddess who refused to marry, a saint who shifted a peak with a glance, a serpent that taught a king humility." },
      { id: "heroes", title: "Heroic Tales", blurb: "Pabuji, Tejaji, the chieftains who came back for one last duty.", minutes: 6, tag: "Folklore", curator: true,
        body: "In Rajasthan, painted scrolls called phads tell the story of Pabuji across a single seven-metre cloth, sung through the night by bhopas with the help of a single oil lamp." },
      { id: "sacred", title: "Sacred Stories", blurb: "Krishna’s mischief, Sita’s exile, Buddha’s silence.", minutes: 7, tag: "Folklore",
        body: "The Mahabharata is fifteen times the length of the Bible and the Iliad combined. The Ramayana is performed every year in a thousand villages, with the same lines and a different sky." },
      { id: "oral", title: "Oral Traditions", blurb: "Memory as the oldest archive we have.", minutes: 5, tag: "Folklore",
        body: "The Rig Veda survived for over a thousand years before being written, preserved syllable-perfect by the oral memory of Brahmin schools — a feat unrivalled in any other tradition." },
    ],
  },
  {
    id: "architecture",
    name: "Architecture",
    whisper: "Stone that learned to breathe.",
    stories: [
      { id: "temples", title: "Temples", blurb: "Mountains carved inward until they became gods.", minutes: 8, tag: "Architecture", curator: true,
        body: "From Kailasanatha at Ellora — carved top-down out of a single rock — to the soaring shikharas of Khajuraho, Indian temples are cosmologies in stone." },
      { id: "forts", title: "Forts", blurb: "Walls that watched centuries.", minutes: 6, tag: "Architecture",
        body: "Mehrangarh rises a hundred and twenty metres from the desert floor. Chittor fell three times, and three times the women walked into fire rather than be captured. These are not buildings; they are vows." },
      { id: "stepwells", title: "Stepwells", blurb: "Architecture you descend into, not up.", minutes: 5, tag: "Architecture",
        body: "Rani-ki-Vav in Gujarat is seven storeys deep, lined with eight hundred sculptures. Built by a queen for her husband, it is a temple, a reservoir, and an upside-down monument all at once." },
      { id: "palaces", title: "Palaces", blurb: "Where mirror, marble, and intrigue all reflected each other.", minutes: 6, tag: "Architecture",
        body: "The Hawa Mahal is a screen, not a palace — five storeys of latticed windows so the women of the court could watch the city without being watched in return." },
      { id: "monasteries", title: "Monasteries", blurb: "Cells of silence above the snow line.", minutes: 7, tag: "Architecture",
        body: "Thiksey, Hemis, Tabo — the gompas of the Himalayas are libraries, schools, and meditation halls clinging to cliffs at four thousand metres. Their butter lamps have not gone out in centuries." },
    ],
  },
  {
    id: "art",
    name: "Art & Craft",
    whisper: "Hands that refused to forget.",
    stories: [
      { id: "textiles", title: "Textiles", blurb: "Patola, Jamdani, Kalamkari — fabrics written by hand.", minutes: 7, tag: "Craft", curator: true,
        body: "A double-ikat Patola sari takes six months to weave; the threads are dyed before the loom even begins, so the pattern emerges only as the cloth itself takes shape." },
      { id: "pottery", title: "Pottery", blurb: "Earth, wheel, fire, hand. Nothing else.", minutes: 5, tag: "Craft",
        body: "From the black terracotta of Manipur to the blue pottery of Jaipur — borrowed from Persia, perfected in India — every region speaks in clay." },
      { id: "miniature", title: "Miniature Paintings", blurb: "Stories painted on the back of a hand.", minutes: 6, tag: "Art",
        body: "Mughal, Pahari, Rajput, Deccani — schools that painted gods, lovers, and rulers on palm-sized paper, sometimes with a single squirrel-hair brush." },
      { id: "sculpture", title: "Sculpture", blurb: "From Mathura serenity to Hoysala excess.", minutes: 6, tag: "Art",
        body: "The smile of a Mathura Buddha; the impossible jewellery of a Hoysala goddess at Belur, carved with such depth that a thread can pass through her bangles." },
      { id: "metalwork", title: "Metalwork", blurb: "Bidri, dhokra, repoussé — alloys with memory.", minutes: 5, tag: "Craft",
        body: "Dhokra brass is poured in lost-wax moulds the same way it was four thousand years ago in the Indus Valley. The technology has not needed an upgrade." },
    ],
  },
  {
    id: "music",
    name: "Music & Performance",
    whisper: "Time, measured in raga and breath.",
    stories: [
      { id: "classical", title: "Classical Traditions", blurb: "Hindustani and Carnatic — two rivers from one sky.", minutes: 8, tag: "Music", curator: true,
        body: "A raga is not a scale; it is a personality, a time of day, a season, an emotional weather system. There are hundreds, and a lifetime is not enough to learn one fully." },
      { id: "folk", title: "Folk Music", blurb: "Songs sung while planting, walking, mourning, marrying.", minutes: 5, tag: "Music",
        body: "Baul of Bengal, Lavani of Maharashtra, Sufi qawwali, the wedding songs of Punjab — folk music is the diary of a region kept in melody." },
      { id: "dance", title: "Dance Forms", blurb: "Bharatanatyam, Kathak, Odissi, Manipuri.", minutes: 7, tag: "Performance",
        body: "Every gesture has a name. The hand-shapes — mudras — number more than a hundred, and the eyes have their own grammar of nine emotions." },
      { id: "theatre", title: "Theatre", blurb: "Kathakali masks, Yakshagana torches, Koodiyattam nights.", minutes: 6, tag: "Performance",
        body: "Koodiyattam, the oldest continuously performed theatre in the world, can stretch a single Sanskrit verse across an entire night." },
      { id: "ritual", title: "Ritual Performances", blurb: "Theyyam, where the dancer becomes the god.", minutes: 6, tag: "Performance",
        body: "In northern Kerala, a Theyyam performer paints his face, dons towering headgear, and for a few hours is no longer himself. The village comes to him for blessings, not applause." },
    ],
  },
];

/* ---------------- page ---------------- */

function LibraryPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Story | null>(null);

  const allStories = useMemo(
    () => SHELVES.flatMap((s) => s.stories.map((st) => ({ ...st, shelf: s.name }))),
    [],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allStories
      .filter((s) =>
        [s.title, s.blurb, s.tag, s.shelf].some((f) => f.toLowerCase().includes(q)),
      )
      .slice(0, 6);
  }, [query, allStories]);

  const curated = useMemo(() => allStories.filter((s) => s.curator), [allStories]);

  // close on esc
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <div className="pt-24 sm:pt-28">
      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pb-16 sm:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground"
        >
          <BookOpen className="h-3.5 w-3.5" />
          The Library
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl"
        >
          The Library of <span className="text-gradient-ember italic">VIRSA</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground sm:text-xl"
        >
          Every story opens another door through time.
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mt-10 max-w-xl"
        >
          <div className="glass flex items-center gap-3 rounded-full px-5 py-3.5 shadow-[var(--shadow-soft)]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the archive — civilizations, ragas, stepwells…"
              aria-label="Search the library"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="glass absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-2xl shadow-[var(--shadow-soft)]"
              >
                <ul className="divide-y divide-[var(--glass-border)]">
                  {results.map((r) => (
                    <li key={r.id}>
                      <button
                        onClick={() => {
                          setActive(r);
                          setQuery("");
                        }}
                        className="flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition hover:bg-foreground/5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{r.title}</p>
                          <p className="truncate text-xs text-muted-foreground">{r.shelf} · {r.minutes} min</p>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Personalised AI recommendations */}
      <RecommendationsRow
        surface="library"
        title="Stories for you"
        subtitle="Virsa AI picks stories from your saved items, interests and recent reads."
        onStoryClick={(id) => {
          const found = allStories.find((s) => s.id === id);
          if (found) setActive(found);
        }}
      />

      {/* Curator's Picks */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[color:var(--accent)]">
              <Sparkles className="h-3.5 w-3.5" /> Curator’s Selections
            </p>
            <h2 className="font-display text-3xl sm:text-4xl">Handpicked by VIRSA</h2>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {curated.slice(0, 6).map((s, i) => (
            <motion.button
              key={s.id}
              onClick={() => setActive(s)}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-gradient-to-br from-[color-mix(in_oklab,var(--card)_90%,var(--accent)_10%)] to-[var(--card)] p-7 text-left shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-glow)]"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--accent)] opacity-10 blur-3xl transition-opacity group-hover:opacity-20" />
              <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent)]">{s.tag}</p>
              <h3 className="font-display text-2xl leading-tight">{s.title}</h3>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{s.blurb}</p>
              <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {s.minutes} min</span>
                <span className="inline-flex items-center gap-1 text-foreground/80 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* From Echoes — community-submitted archive */}
      <EchoesFromCommunity />

      {/* Shelves */}
      <section className="mx-auto max-w-6xl space-y-20 px-6 pb-32">
        {SHELVES.map((shelf, i) => (
          <Shelf key={shelf.id} shelf={shelf} index={i} onOpen={setActive} />
        ))}
      </section>


      {/* Story modal */}
      <StoryModal story={active} onClose={() => setActive(null)} />
    </div>
  );
}

/* ---------------- shelf ---------------- */

function Shelf({
  shelf,
  index,
  onOpen,
}: {
  shelf: Shelf;
  index: number;
  onOpen: (s: Story) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const preview = shelf.stories.slice(0, 4);
  const rest = shelf.stories.slice(4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: Math.min(index * 0.05, 0.2), ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-6 flex items-end justify-between gap-6">
        <div className="min-w-0">
          <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Shelf · 0{index + 1}</p>
          <h2 className="font-display text-3xl sm:text-4xl">{shelf.name}</h2>
          <p className="mt-2 max-w-xl text-sm italic text-muted-foreground">{shelf.whisper}</p>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="btn-glossy hidden shrink-0 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-5 py-2.5 text-xs uppercase tracking-[0.22em] text-foreground sm:inline-flex"
        >
          {expanded ? "Collapse" : "Explore Collection"}
          <ArrowRight className="ml-2 h-3.5 w-3.5" />
        </button>
      </div>

      {/* The "shelf" — horizontal scroll on mobile, grid on desktop */}
      <div className="relative">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--glass-border)] to-transparent" />
        <div className="absolute -bottom-2 left-6 right-6 h-4 rounded-[100%] bg-[var(--accent)] opacity-[0.06] blur-2xl" />

        <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-6 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {preview.map((s, idx) => (
            <StoryCard key={s.id} story={s} index={idx} onOpen={onOpen} />
          ))}
        </div>

        <AnimatePresence initial={false}>
          {expanded && rest.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                {rest.map((s, idx) => (
                  <StoryCard key={s.id} story={s} index={idx} onOpen={onOpen} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="btn-glossy mt-4 inline-flex w-full justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-5 py-3 text-xs uppercase tracking-[0.22em] text-foreground sm:hidden"
        >
          {expanded ? "Collapse" : "Explore Collection"}
          <ArrowRight className="ml-2 h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

/* ---------------- story card ---------------- */

function StoryCard({
  story,
  index,
  onOpen,
}: {
  story: Story;
  index: number;
  onOpen: (s: Story) => void;
}) {
  return (
    <motion.button
      onClick={() => onOpen(story)}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="group relative flex w-[78vw] shrink-0 snap-start flex-col rounded-2xl border border-[var(--glass-border)] bg-[var(--card)] p-5 text-left shadow-[var(--shadow-soft)] transition-all hover:border-[color:var(--accent)]/30 hover:shadow-[var(--shadow-glow)] sm:w-auto"
    >
      {/* Spine */}
      <div className="absolute inset-y-4 left-0 w-[3px] rounded-r bg-gradient-to-b from-[color:var(--accent)]/0 via-[color:var(--accent)]/60 to-[color:var(--accent)]/0 opacity-50 transition-opacity group-hover:opacity-100" />

      <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{story.tag}</p>
      <h3 className="font-display text-xl leading-tight">{story.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{story.blurb}</p>

      <div className="mt-5 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3" /> {story.minutes} min read</span>
        <span className="inline-flex items-center gap-1 text-foreground/70 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100">
          Open <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </motion.button>
  );
}

/* ---------------- modal ---------------- */

function StoryModal({ story, onClose }: { story: Story | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {story && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-stretch justify-end bg-background/60 backdrop-blur-md sm:items-center sm:justify-center sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={story.title}
        >
          <motion.article
            initial={{ x: "100%", opacity: 0.4 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative h-full w-full max-w-2xl overflow-y-auto rounded-none border border-[var(--glass-border)] bg-[var(--card)] shadow-[var(--shadow-soft)] sm:h-auto sm:max-h-[88vh] sm:rounded-3xl"
          >
            {/* Header art */}
            <div className="relative h-56 overflow-hidden sm:h-64">
              <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--accent)]/30 via-[color:var(--primary)]/20 to-transparent" />
              <div className="absolute inset-0 [background-image:radial-gradient(ellipse_at_top_right,oklch(0.74_0.13_75_/_0.35),transparent_60%),radial-gradient(ellipse_at_bottom_left,oklch(0.58_0.10_165_/_0.18),transparent_55%)]" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--card)] to-transparent" />
              <button
                onClick={onClose}
                aria-label="Close"
                className="glass absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-5 left-6 right-6">
                <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent)]">{story.tag}</p>
                <h2 className="font-display text-3xl leading-tight sm:text-4xl">{story.title}</h2>
              </div>
            </div>

            <div className="px-6 py-8 sm:px-10 sm:py-10">
              <p className="text-pretty text-base italic text-muted-foreground">{story.blurb}</p>
              <div className="my-6 h-px w-12 bg-[color:var(--accent)]/50" />
              <p className="text-pretty text-base leading-relaxed text-foreground/90 sm:text-lg">
                {story.body ?? story.blurb}
              </p>

              <div className="mt-10 flex items-center justify-between border-t border-[var(--glass-border)] pt-6 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {story.minutes} min read</span>
                <button
                  onClick={onClose}
                  className="btn-glossy rounded-full bg-[var(--accent)] px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[color:var(--accent-foreground)]"
                >
                  Continue Exploring
                </button>
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- echoes from community ---------------- */

function EchoesFromCommunity() {
  const fetchEchoes = useServerFn(listLibraryEchoes);
  const { data } = useQuery({
    queryKey: ["library-echoes"],
    queryFn: () => fetchEchoes({ data: { limit: 8 } }),
  });

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-gradient-to-br from-[color-mix(in_oklab,var(--card)_88%,var(--accent)_12%)] to-[var(--card)] p-8 shadow-[var(--shadow-soft)] sm:p-12"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--accent)] opacity-10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[color:var(--primary)] opacity-10 blur-3xl" />

        <div className="relative">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[color:var(--accent)]">
                <Heart className="h-3.5 w-3.5" /> From Echoes
              </p>
              <h2 className="font-display text-3xl leading-[1.1] sm:text-4xl">
                Memory, <span className="italic text-gradient-ember">contributed by keepers.</span>
              </h2>
              <p className="mt-3 max-w-xl text-pretty text-sm text-muted-foreground sm:text-base">
                Stories, photographs and traditions that the community has added to the permanent archive.
              </p>
            </div>
            <Link
              to="/echoes"
              className="btn-glossy inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-xs uppercase tracking-[0.22em] text-[color:var(--accent-foreground)]"
            >
              Open Echoes <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {data && data.length === 0 && (
            <p className="mt-8 rounded-2xl border border-dashed border-white/15 bg-background/30 p-6 text-center text-sm text-muted-foreground">
              No community echoes in the Library yet. Be the first to add one.
            </p>
          )}

          {data && data.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {data.map((p: any) => {
                const m = p.media_signed?.[0];
                return (
                  <Link
                    key={p.id}
                    to="/echoes/$postId"
                    params={{ postId: p.id }}
                    className="group relative aspect-square overflow-hidden rounded-2xl bg-black/30 ring-1 ring-[var(--glass-border)] transition hover:ring-[color:var(--accent)]/40"
                  >
                    {m?.url ? (
                      m.type === "video" ? (
                        <video src={m.url} className="h-full w-full object-cover" muted />
                      ) : (
                        <img src={m.url} alt={p.title ?? "Echo"} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                      )
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-4 text-center">
                        <span className="font-display text-base leading-tight">{p.title ?? p.caption?.slice(0, 60) ?? "An echo"}</span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p className="line-clamp-2 text-xs text-white">{p.title ?? p.caption ?? "Untitled"}</p>
                      {p.category && <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-white/70">{p.category}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}


