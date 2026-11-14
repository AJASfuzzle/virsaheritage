import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Clock, MapPin, Sparkles, X, ArrowRight, BookOpen, Heart, Mic, FileText } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listLibraryEchoes, toggleLike } from "@/lib/echoes.functions";
import { RecommendationsRow } from "@/components/recs/RecommendationsRow";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { LIBRARY_STORIES_META } from "@/lib/library-stories-meta";
import { HERITAGE_SHELVES } from "@/lib/library-heritage-stories";
import { getHeritageStoryBody } from "@/lib/library-stories.functions";


export const Route = createFileRoute("/library")({
  validateSearch: (search: Record<string, unknown>): { story?: string } => ({
    story: typeof search.story === "string" ? (search.story as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "The Library of VIRSA - A Curated Archive of Living History" },
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
  source?: string;
};

type Shelf = {
  id: string;
  name: string;
  whisper: string;
  stories: Story[];
};

const BASE_SHELVES: Shelf[] = [
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
          "My grandfather, Hardev Singh, was twenty-three when he wrote this letter. It was found folded inside a steel trunk in our family home in Ludhiana, tucked between a railway ticket and a black-and-white photograph of his mother. The paper is the colour of weak tea now. The ink has softened to brown.\n\n\"Pyaare Bhrata Ji,\" it begins. Dear elder brother. He is writing from Anarkali Bazaar, Lahore, on the 11th of August 1947. He says the trams are still running but no one is on them. The shop where he buys his cloth has been shuttered for nine days. The shopkeeper, a Muslim friend named Bashir, came in the middle of the night to leave him a bolt of green silk and said, 'Keep it. If anyone asks, you bought it from me last year.' My grandfather writes that he did not know whether the silk was a gift or a goodbye.\n\nHe describes a city already split in two. The Hindus and Sikhs are leaving by the Frontier Mail every evening. The platforms at Lahore Junction are stacked with brass utensils, sewing machines, and grandfather clocks that no one will ever wind again. He writes about an old Sikh tailor he met at the station who refused to leave his sewing machine behind and was carrying it on his head 'as if it were a child'. My grandfather tried to help him. The man said, 'Beta, this machine has fed my family for thirty-five years. If I leave it, what was my life for?'\n\nIn the second half of the letter, the handwriting changes. The ink is thicker, pressed harder into the page. He has heard rumours about Amritsar - that trains are arriving with everyone inside dead. He writes, 'I do not believe these stories. We are too old a people to do such things to each other.' Three days later, he himself boarded a train. He survived. The man with the sewing machine, we never learnt.\n\nHe wrote in Gurmukhi, in the careful schoolboy hand of someone who has been taught to honour the elder he is writing to. He signed it 'aap ka chhota bhai, Hardev'. Your younger brother. He never spoke about Lahore for the rest of his life. The letter spoke for him.\n\nMy grandmother showed me this letter when I was nineteen. She said, 'Read it twice. The first time for what it says. The second time for what he could not bring himself to write.' I have read it many times since. There is a sentence near the end that I think about often: 'The mangoes this year were good. We did not eat enough of them.'",
      },
      {
        id: "nanima-wedding",
        title: "Interview: My Nani's Wedding, Jaipur 1962",
        blurb: "Recorded one monsoon afternoon on a kitchen stool, in three languages.",
        minutes: 14,
        tag: "Oral History · Rajasthan",
        curator: true,
        body:
          "My nani - Pushpa Devi, born 1944 in a village outside Jaipur - agreed to be recorded only on the condition that I peel the peas while she spoke. 'Otherwise it is a performance,' she said. 'And I am not a performer.' The recording is forty-seven minutes long. She switches between Marwari, Hindi and a careful, embarrassed English that she learnt from her grandchildren.\n\nShe was eighteen when she was married. The wedding was arranged in three weeks - fast, by the standards of the time - because my grandfather had been offered a job at the railways in Ajmer and the family wanted everything settled before he left. She had seen his photograph once. He was standing beside a Royal Enfield motorcycle that did not belong to him, borrowed from a cousin for exactly this purpose.\n\n'I did not look at the photograph properly,' she tells me. 'It is bad luck to study too closely. I looked at the motorcycle. I thought, this man is going somewhere.'\n\nShe describes the haldi ceremony in the courtyard of her parents' house. Her aunts ground the turmeric on a flat stone with their bare hands, mixing it with mustard oil and sandalwood. The smell of that paste, she says, is the smell of her own girlhood ending. Her mother sang a song that I have never heard anywhere else - a lament in old Marwari about a daughter who becomes a guest in her own home. She sings four lines of it into the recorder. Her voice cracks on the third line. We pause for tea.\n\nShe arrived at her in-laws' house in a doli carried by four men. The doli was lined with marigolds and a strip of red velvet stitched by her grandmother. When she stepped down, her mother-in-law put a copper pot of rice at the threshold and asked her to kick it over with her right foot - a rite that says, abundance will follow you into this house. She kicked it harder than necessary. The pot dented. Her mother-in-law laughed and said, 'Good. She has strong legs. She will manage the kitchen.'\n\nIn the recording, she pauses for a long time after this. I can hear the pressure cooker whistling in the background. Then she says, in English: 'I did not love him on that day. I did not know him. But I respected the strangeness of what we were doing. We were trying to build a house out of two children who had never met.' She is quiet again. Then: 'It worked. Beta, it worked for fifty-one years. He died last March. The pressure cooker is whistling, please go and turn it off.'\n\nThe transcript is in our family archive now. So is the dented copper pot. My mother polished it once and stopped - she said the dent was the most important part.",
      },
      {
        id: "sindh-migration",
        title: "Diary of a Sindhi Tailor, Bombay 1948",
        blurb: "Three pages from a coal-smudged notebook, written from a refugee camp.",
        minutes: 11,
        tag: "Diary · Sindh / Bombay",
        body:
          "These three pages belong to my great-grandfather, Naraindas Chandiramani. He kept a tailor's shop in Karachi before 1947. The diary is small, the size of a man's palm, with a maroon leather cover and an elastic band that has perished. He wrote in a mixture of Sindhi (in the Khudabadi script my grandmother had to teach me to read) and English, depending on what he was trying to say.\n\nThe first page is dated 'Pila Camp, Kalyan, 4 March 1948'. The camp was on the outskirts of Bombay, a stretch of military barracks repurposed for the Sindhi refugees who had arrived by ship over the previous five months. He writes about the heat - 'the heat of Bombay is a different heat, it has no honesty to it' - and about the food, which is mostly rice and a thin dal he describes as 'water with three lentils swimming in it'.\n\nThe second page is a list. It is a list of everything he left behind in his shop on Bunder Road. He writes:\n\n'• 14 bolts of fine wool, English and Italian\n• 1 Singer treadle machine, 1937 model, in good condition\n• 6 pairs of scissors, including the long pair from my father\n• A photograph of King George with my name printed below it, given by Mr Mountcastle\n• A drawer full of buttons, sorted by colour\n• My measuring tapes, 11 in number\n• My signboard, Naraindas & Sons, Tailors, painted by Hashmat Ali\n• My customers' measurements, in a black ledger, 22 years of them'\n\nThe last item is underlined twice. He writes underneath it, in English: 'Without these measurements I am a tailor in name only.'\n\nThe third page is about a Muslim friend named Hashmat - the same man who painted his signboard. Hashmat came to the docks at midnight on the day my great-grandfather was leaving and pressed a small package into his hand. Inside was a fold of yellow paper. On it Hashmat had written, in his own neat Urdu, every single measurement from the black ledger that he could remember by heart - fifty-two names, my great-grandfather counts. 'He told me, Naraindas bhai, when you open your shop in Hindustan, at least these fifty-two customers, you will still know.'\n\nMy great-grandfather did open a shop, in Ulhasnagar, in 1950. He used Hashmat's measurements for the first fifteen customers who walked in, even though most of them were strangers. He said, 'If a man comes in with the shoulders of an Anwar, I will cut him a coat for an Anwar. The measurements remember even when the men are gone.'\n\nHe died in 1981. We still have the diary, the yellow paper, and a single pair of long scissors that he eventually had shipped to him through a Parsi merchant in 1953. They are in our cupboard in Pune. They still cut cloth cleanly.",
      },
      {
        id: "soldier-letter",
        title: "Letters from a Soldier, NEFA 1962",
        blurb: "Eleven envelopes, one of them never opened. He did not come home.",
        minutes: 10,
        tag: "Letters · Assam / Arunachal",
        body:
          "My great-uncle Captain Joginder Singh Sandhu of the 4 Sikh Regiment wrote eleven letters home between October and November 1962, during the war with China in the North-East Frontier Agency. We have all eleven of them, tied with a length of cotton tape that has gone yellow. The last one is still sealed. My great-grandmother could never bring herself to open it. None of us have either.\n\nThe earlier letters are cheerful in the way that all soldiers' letters home are cheerful. He writes about the cold - 'Mata Ji, please send the brown woollen socks, not the grey ones, the grey ones itch' - and about the height of the mountains, which he says are 'so tall they have made me a smaller man, in a good way'. He describes the local Monpa villagers who bring the soldiers buckwheat pancakes and butter tea. He says the butter tea tastes like 'a soup made by a person who has never eaten soup', and that he has come to love it.\n\nIn the sixth letter he writes about a young sepoy from a village near his own who has never seen snow. The boy stood outside the tent the entire first night it snowed, holding his hands out, until his fingers turned blue and the medic had to bring him in. Joginder writes, 'I scolded him. Then I went outside and did the same thing for ten minutes, secretly. Do not tell anyone.'\n\nThe ninth letter is shorter. He says they are being moved up to a place called Bumla. He cannot say more. He asks after his sister's pregnancy and tells his father that the buffalo named Heera must be sold before winter - 'she will not survive another one, and it is cruel to ask her to try'.\n\nThe tenth letter, dated 16th November 1962, is the one I have read the most. It is six lines long. He says he is well. He says the tea ration has been reduced but the rum has not. He says, 'If you do not hear from me for some weeks, do not worry. The post is slow here. The mountains do not believe in postmen.' He signs it 'your loving son, Jogi.'\n\nThe eleventh letter arrived on the 4th of December, two weeks after the family had received the telegram. It is still sealed. The stamp is a green one - the King George had been replaced by Ashoka's lions by then, and my great-grandmother had not yet got used to the change. She kept the envelope in her almirah, next to her wedding chunni, and would touch it on his birthday every year.\n\nMy mother thinks one day someone will open it. I am not sure. There is a kind of love that lives only in the not-knowing, and I am afraid of disturbing it.",
      },
      {
        id: "recipe-diary",
        title: "My Paati's Recipe Diary, Thanjavur 1958–1989",
        blurb: "A hardback notebook with thirty-one years of marginalia.",
        minutes: 9,
        tag: "Diary · Tamil Nadu",
        curator: true,
        body:
          "My paati - Lakshmi Ammal of Thanjavur - kept her recipes in a maroon hardback notebook with the words 'Bharath Stationers, Kumbakonam' embossed on the cover in fading gold. She began it in 1958, the year she was married, and stopped in 1989, the year my grandfather died. She wrote in Tamil, in a slanting, schoolmistress hand, with the occasional English word slipped in where the Tamil word seemed too plain.\n\nThe recipes themselves are not the point of the notebook. Anyone can find a recipe for rasam. The point is what she wrote in the margins.\n\nUnder her recipe for puli kuzhambu, dated June 1961: 'Made this for V's parents' first visit. His mother said the tamarind was too sour. I have not changed the recipe. She has changed her opinion.'\n\nUnder a recipe for adhirasam, dated November 1964: 'My mother taught me this when I was nine. The dough must rest for one full day. Patience is the first ingredient. My mother died this morning. I am writing this recipe so I do not forget her hands.'\n\nUnder a recipe for kara kozhukattai, dated August 1971: 'V is in Delhi this week. The children have asked me to make this five times. I have made it five times. There is something about a husband being away that makes the children hungrier. Perhaps they are eating his portion too, out of loyalty.'\n\nUnder her recipe for ven pongal, dated January 1979: 'My granddaughter - that is me - 'came to stay for Pongal. She is afraid of the cow. The cow is not afraid of her. I think they will learn to tolerate each other, like all good Tamil women.' I was four years old. I do not remember the cow. I remember the pongal.\n\nThe last entry, March 1989, is not a recipe. It is half a page, in pencil, dated four days after my grandfather's funeral. She writes:\n\n'V loved my morkozhambu more than any other thing I ever cooked. He used to say, eat it slowly, Lakshmi, do not eat it like it is dal, this is morkozhambu, it has a soul. I made it on Tuesday. I have eaten three meals of it now. I have not been able to taste anything since he left. I am writing it down anyway. The next person who reads this notebook will not know that. They will think it is a recipe like any other. Let them. Some sorrow is not for sharing.'\n\nMy mother keeps the notebook now, wrapped in muslin. I am the only grandchild who can still read Tamil. So once a year, on her death anniversary, I take it out and read one page aloud to whoever is in the kitchen with me. The kitchen is usually quiet afterwards. That is the right kind of quiet.",
      },
      {
        id: "kashmiri-houseboat",
        title: "Interview: Houseboat Owner, Dal Lake 1989",
        blurb: "Recorded in 2019 by his great-grandson, on a phone propped against a samovar.",
        minutes: 8,
        tag: "Oral History · Kashmir",
        body:
          "Ghulam Mohammed Najar - 'Gama Saheb' to everyone on Dal Lake - was eighty-four when his great-grandson recorded him. The recording was made in the back room of the houseboat 'Young Prince of Kashmir', moored at the third ghat of Nageen, in October 2019. There is the sound of the kerosene heater. There is the sound of a samovar gurgling. Once, faintly, you can hear the call to prayer from a mosque across the water.\n\nHis family had owned houseboats since his grandfather's time. He describes the boats not as boats but as 'wooden houses that have learnt to float'. The 'Young Prince' was built in 1934 from cedar that his grandfather had bought from a contractor in Pahalgam. The walls of the dining room were carved by a single artisan over fourteen months. The artisan, a Hindu named Pyare Lal Kaul, signed his name in tiny letters inside the foot of one chair, so that you would only see it if you turned the chair over to repair it.\n\nGama Saheb's clearest memories are from the late 1980s. He talks about the foreign tourists - 'the Germans came every May, the Israelis after their army, the English at any time, you could never predict the English' - and the long evenings when guests would sit on the front deck and ask him to tell them about Kashmir. He says, 'I told them every story I knew. When I ran out, I told them stories my father told me. When I ran out of those, I made some up. They did not mind. They had paid for the tea.'\n\nThe tone of the recording changes when he reaches 1989. He says, quietly, 'After that winter, the tourists stopped. They did not come for many, many years. Some came back, but it was never the same. My boats sat empty. The wood does not like to sit empty. It cracks. It feels insulted.'\n\nHe describes patching the 'Young Prince' himself, year after year, with money he did not really have. His sons wanted him to sell. He refused. 'I told them, this boat has my grandfather's hands in it. If I sell it, I am selling a pair of hands. You cannot do that.'\n\nNear the end of the recording, his great-grandson asks him, in English, what he would say to a young Kashmiri who wanted to leave. There is a long pause. Then Gama Saheb says, in Kashmiri, very softly: 'I would say, go. But take the lake with you. Take it in here.' His great-grandson notes in the transcript that he touched the centre of his chest when he said this.\n\nGama Saheb passed away in March 2022. The 'Young Prince of Kashmir' is still moored at the third ghat of Nageen. The artisan's signature is still under the foot of the dining-room chair. We checked.",
      },
    ],
  },
  {

    id: "civilizations",
    name: "Civilizations",
    whisper: "Empires that drew the maps we still walk.",
    stories: [
      { id: "indus", title: "Indus Valley", blurb: "Cities of brick, water, and quiet symmetry.", minutes: 14, tag: "Civilization", curator: true,
        body: "The first time I stood at the edge of the Great Bath at Mohenjo-daro, in the winter of 2014, I remember thinking that the silence was wrong. A bath this size - twelve metres long, seven wide, fed by a brick-lined well, drained by a covered channel that still works - should have been ringing with voices. Children, washerwomen, priests, somebody. Instead there was only the wind moving over the Sindh plain and a single crow walking along the parapet as if it owned the place.\n\nFive thousand years ago, the people of the Indus laid their streets at right angles before anyone in the world had thought to do it. They built granaries the size of city squares. They fitted every house, even the modest ones at the edge of town, with its own bathroom and a drain that ran out into a covered municipal sewer. The drains were inspected. We know this because the inspection holes - neat brick manholes the size of a man's shoulders - are still there. A civilization that takes its drains seriously is a civilization that takes its people seriously.\n\nWhat I find most moving is what they did not build. There are no palaces. No giant temples. No monumental tombs glorifying a single king. The largest building in the city is a public bath. The second largest is a granary. Whoever ran Mohenjo-daro seems to have decided, very early, that the city itself was the monument.\n\nWe still cannot read their script. Four hundred symbols, scratched onto soapstone seals the size of a postage stamp, and not a single bilingual inscription anywhere to give us a key. The seals show a humped bull, a unicorn-like creature drinking from a trough, a horned figure seated cross-legged in what looks unmistakably like meditation. Every generation of scholars announces that they have cracked the script, and every generation is gently and politely proven wrong.\n\nMy guide that day was a man from Larkana named Allah Dino, in his sixties, who had been showing visitors around the site since he was a boy walking behind his father. He pointed to a small terracotta figurine in the museum - the so-called 'priest-king' with his trefoil shawl and half-closed eyes - and said, 'Sahib, look at his face. He is not angry. He is not proud. He is just thinking. What kind of king is that?' I didn't have an answer.\n\nThe Indus civilization declined sometime around 1900 BCE. We don't fully know why - climate change, the shifting of the Saraswati, a slow ecological exhaustion, perhaps simply the patience of the river running out. They did not collapse so much as they quietly stopped. The cities were left tidy. The drains were left clear. As if they had only gone away for the season and might still come back." },
      { id: "mauryan", title: "Mauryan Empire", blurb: "Ashoka's edicts carved on stone, taller than thrones.", minutes: 13, tag: "Civilization",
        body: "There is an edict of Ashoka carved on a boulder at Maski, in northern Karnataka, that I went to see in the summer of 2018. It is not a famous edict. There are no signboards. The road ends a long way before the boulder does, and the last kilometre is across a field of black cotton soil that, in the monsoon, will refuse to let go of your shoes. The boulder itself is unremarkable until you are right next to it. Then you see the Brahmi script, weathered to the colour of the rock around it, and the single word that changed everything for historians: Devanampriya Asoka. 'Beloved of the gods, Ashoka.' Before this inscription was deciphered in 1915, we knew the emperor only as 'Devanampriya', a title - we did not even know his name.\n\nThe Mauryan Empire, at its height under Ashoka in the third century BCE, stretched from the Hindu Kush to the Bay of Bengal and as far south as Karnataka. It was the largest political unit the subcontinent would see until the British. It was administered out of Pataliputra - modern Patna - from a city that the Greek ambassador Megasthenes described as nine miles long, ringed by a wooden palisade and a moat, with five hundred and seventy towers.\n\nAshoka came to the throne around 268 BCE after, by some accounts, killing several of his brothers. For the first eight years he was an ordinary expansionist king. Then he invaded Kalinga, modern Odisha. The campaign was so brutal - the thirteenth rock edict says 'a hundred and fifty thousand were carried away captive, a hundred thousand were killed, and many times that number perished' - that he could not bear it.\n\nWhat he did next has, I think, no real parallel in the ancient world. He did not abdicate. He did not destroy his army. He converted to Buddhism and proceeded to carve his remorse, in his own voice, onto rocks and polished sandstone pillars across the entire subcontinent. The pillars are extraordinary objects in their own right - fifteen metres of single-piece sandstone, polished to a mirror finish that twenty-three centuries of weather have not entirely dulled. On top of them sit animals: lions, bulls, an elephant at Sankissa, the famous four lions at Sarnath that India later chose for its national emblem.\n\nBut the writing on them is what shakes you. It is not, like most royal inscriptions, a list of conquests. It is, in plain Prakrit that any literate citizen of the time could read, a moral plea. Do not harm living creatures. Be kind to your servants and your parents. Tolerate other religions. Plant shade trees along the roads. Dig wells. Do not boast of your own faith by belittling others.\n\nA king, voluntarily, carving his own conscience into the rock face of his empire so that even his successors could not erase it. We still have not done better." },
      { id: "gupta", title: "Gupta Period", blurb: "A golden age of mathematics, metallurgy, and verse.", minutes: 12, tag: "Civilization", curator: true,
        body: "On a wet July morning in 2016 I climbed the small hill in the Qutb complex in Delhi where the Iron Pillar stands. It is the height of two men, six and a half metres, and seven and a half tonnes of nearly pure wrought iron. It has been outdoors, in the open air of the Indo-Gangetic plain, since roughly the year 400 CE. It has not rusted. Not properly. There is a thin protective coat of misawite that the iron itself has grown over sixteen centuries, and metallurgists are still arguing about exactly how it was made. The casting joints, if there were any, are invisible.\n\nThe Gupta period, roughly 320 to 550 CE, is the period everyone means when they say 'the golden age' of ancient India. Like all golden ages, the phrase flattens it. But the things that happened in this window are, when you list them out, almost embarrassing.\n\nA mathematician named Aryabhata, working in Kusumapura in 499 CE at the age of twenty-three, wrote a book of one hundred and twenty-one verses in which he calculated the value of pi to four decimal places, proposed that the earth rotates on its own axis (not the heavens around it), computed the length of the sidereal year to within a few minutes of the modern figure, and casually introduced the concept of zero as a placeholder. The decimal place-value system that the entire modern world uses to count comes through Arab intermediaries from this period of Indian mathematics. We call them Arabic numerals out of polite custom. The Arabs themselves called them al-arqam al-hindiyyah, 'the Indian numbers.'\n\nIn the same century, Kalidasa was writing the Meghaduta, the Cloud Messenger - a poem in which an exiled yaksha asks a passing monsoon cloud to carry a message to his wife in the Himalayas. The poem is one hundred and eleven verses long. It describes the entire route the cloud must take, river by river, hill by hill, with such precision that you can still trace it on a map. There is a stanza in it about the cloud resting on a particular peak and the peacocks coming out to dance because they think the rains have arrived early. I do not know any other poem in any language in which a meteorological event is given so much tenderness.\n\nThe Gupta court was not a loud court. The kings - Chandragupta II, Kumaragupta, Skandagupta - appear on their coins as small, almost wistful figures, sometimes shown playing the veena. They commissioned the Ajanta cave paintings, where bodhisattvas look out of dim plastered walls with eyes so lowered and so kind that the painters seem to have been trying to draw not a face but a temperament.\n\nWhen I came down from the Iron Pillar that morning, my notebook was wet, and the pillar was still standing there as it had been standing since before my country existed. I touched it once, on the cold of the iron, and walked away. It did not need me to do anything else." },
      { id: "chola", title: "Chola Dynasty", blurb: "Bronzes that dance and a navy that crossed oceans.", minutes: 15, tag: "Civilization",
        body: "The Brihadeeswara temple at Thanjavur was finished in 1010 CE, the twenty-fifth regnal year of a king named Rajaraja I. It is built of granite - sixty thousand tonnes of it - quarried from a riverbed seventy kilometres away and dragged here by elephants and men, on rollers cut from palmyra logs, along a ramp said to have been six kilometres long. The vimana, the main tower, is sixty-six metres high. On top of it sits a single stone, the size of a small house, weighing eighty tonnes. No one is entirely sure how it was lifted up there. The most plausible theory is the ramp. The most beautiful theory is that they kept building the ramp longer and longer and let the elephants walk it up.\n\nI went there with my father in 2011. He was sixty-eight. He had wanted to see it all his life and had never managed. He stood in the middle of the courtyard for a long time and did not say anything. Then he said, very quietly, in Tamil, 'They built this for a god they could not see, with a confidence we do not have for the things we can.'\n\nThe Cholas ruled Tamil country from roughly 850 to 1250 CE. They are not a flashy dynasty in Indian school textbooks, which is a mistake. They were the only Indian power before modern times to project naval force across the Bay of Bengal - Rajendra I, Rajaraja's son, sent a fleet in 1025 CE that crossed to Sumatra and reduced the Srivijaya empire to a tributary. The fleet probably included ships of three hundred tonnes. The expedition is recorded on a copper-plate inscription, in matter-of-fact administrative prose, as if sending an armada across an ocean were a quarterly task.\n\nBut what the Cholas are really remembered for, by anyone who has stood in front of one, are the bronzes. Lost-wax casting in copper alloy. Almost always Shiva, almost always dancing - Nataraja, the Lord of the Dance, his right foot crushing the dwarf of ignorance, his hair flying out in a wheel of matted strands, a small drum in one hand whose rhythm sets the universe going and a flame in another whose fire will end it. The standard pose is fixed. The proportions are fixed. The grace, somehow, is not. Each bronze, even though the iconography is identical, has a different exact tilt of the head. Some are quiet. Some are smiling. One in the Government Museum at Chennai is so confident in his footwork that you find yourself, without meaning to, standing up straighter in front of him.\n\nA Chola temple, when you understand it, is not really a building. It is a calendar - the eastern entrance lines up with the equinox sunrise. It is a treasury - its walls record, in inscriptions, every gift of land and goats and lamp oil ever made to it, with the donor's name and village. It is a bank - it lent grain to farmers in lean years at fixed interest. It is a theatre - its outer pavilions were for dance, its inner ones for chanting. It is an astronomical instrument, an employment office, a school, and, almost as an afterthought, a place where a god lives.\n\nMy father bought me a small bronze Nataraja, modern, sand-cast, from a shop near the temple gate that afternoon. It sits on my desk. When I am writing badly I look at his footwork and try again." },
      { id: "mughal", title: "Mughal Era", blurb: "Persian gardens, Indian stone, and an emperor who wept at marble.", minutes: 13, tag: "Civilization",
        body: "I have been to the Taj Mahal four times. The first time, I was nine, and I remember mostly being hot and being told not to climb on the plinth. The second time, I was twenty-four and recently broken-hearted, and I remember it not at all - I think I cried in the gardens but I cannot now be sure why. The third time was in winter, with my mother. The fourth time was at six in the morning, alone, in February 2022, and that was the time I finally understood what Shah Jahan had done.\n\nThe marble is not white. That is the first thing. It is alive. It picks up the colour of whatever sky is above it - pale grey at dawn, milk-blue by mid-morning, gold and pink at sunset, almost lavender in monsoon light. The semi-precious inlay - carnelian, lapis, jade, malachite, set into the marble in the pietra dura technique imported from Florence - does not flash at you the way you might expect. It glows quietly, like embers seen through ash. You have to walk close enough to put your hand to the wall to see how fine the work is. A single flower, the size of a fingernail, can have thirty separate pieces of stone in it. The seams are invisible to the eye.\n\nThe Mughal dynasty began with Babur, who arrived from Ferghana - modern Uzbekistan - through the Khyber Pass with twelve thousand men in 1526 and won the battle of Panipat with cannons that the Indian armies had not seen before. Babur was a gardener before he was anything else. His memoirs, the Baburnama, are the first real autobiography in the Islamic world, and they are full of melons. He misses the melons of Samarkand for the rest of his life. He plants chinar trees and pomegranates and tries to grow grapes in the wrong climate. He builds gardens at Agra and at Dholpur because he says the heat of Hindustan is not bearable without running water and shade.\n\nHis grandson Akbar, who became emperor at the age of thirteen, was illiterate his entire life and is one of the most curious men who ever held a throne. He could not read but he had books read to him for hours every evening. He invited Jesuits, Jains, Zoroastrians, Sufis, and Hindu pandits to debate religion in his Ibadat Khana, the House of Worship, on Thursday nights. He tried to invent a new syncretic faith of his own, called Din-i-Ilahi, which collected about nineteen disciples and quietly died with him. He commissioned a Persian translation of the Mahabharata. He married a Rajput princess and let her keep her gods.\n\nShah Jahan, Akbar's grandson, lost his wife Mumtaz Mahal in 1631, in childbirth with their fourteenth child. She was thirty-eight. He is said to have gone into seclusion for a week and emerged with his hair turned grey. He spent the next twenty-two years building her tomb. He was eventually deposed by his own son Aurangzeb and imprisoned in the Agra Fort in a small octagonal room with one window. From that window, across the bend of the Yamuna, he could see the Taj Mahal. He spent the last eight years of his life looking at it. When he died, his daughter Jahanara had him buried beside her mother, inside.\n\nWalking back to the gate that February morning, I passed an old man selling postcards. He saw my face and laughed gently. 'Sahib,' he said, 'everyone cries here at least once. It is permitted.'" },
    ],
  },
  {
    id: "languages",
    name: "Languages & Scripts",
    whisper: "Letters that remember what mouths forgot.",
    stories: [
      { id: "sanskrit", title: "Sanskrit", blurb: "A grammar so precise it inspired computer science.", minutes: 12, tag: "Language", curator: true,
        body: "My Sanskrit teacher in college was a small, fierce woman from Pune named Dr Bhide, who must have been seventy when she taught us and who could recite the entire eighth chapter of the Bhagavad Gita without taking a breath that we could see. On the first day of class she wrote one sentence on the board, in Devanagari, and underneath it the Roman transliteration: 'vrkshah patati'. The tree falls. Then she turned around and said, 'For the next four months we are going to take this sentence apart. By the end of it, you will know why no other language in the world makes a sentence quite the same way.'\n\nSanskrit was described - not invented, described - by a grammarian named Panini, who lived in the region of Gandhara, around the fourth century BCE. His book, the Ashtadhyayi, the Eight Chapters, contains three thousand nine hundred and fifty-nine rules in a notation so compact and so formal that twentieth-century linguists, when they finally read it properly, said it looked uncannily like a computer programming language. Each rule is a tiny aphorism, often three or four words long, that operates on the rules around it. It is generative - meaning, from these rules you can produce every valid Sanskrit sentence that has ever been written or that ever could be. Two and a half thousand years before Noam Chomsky tried to do the same thing for English in 1957, Panini had finished and gone home.\n\nThe American computer scientist Frits Staal, who studied with Brahmin priests in Kerala in the 1970s, said that Panini's grammar was 'one of the greatest monuments of human intelligence', alongside Euclid's Elements and Newton's Principia. NASA published a paper in the 1980s, half-seriously, suggesting that if humans ever needed an unambiguous machine-translatable natural language for talking to artificial intelligence, Sanskrit would be a remarkably good candidate.\n\nBut Sanskrit is not really a science. That is what the textbooks miss. It is a language that has carried the Vedas, the Mahabharata, the Bhagavad Gita, the love poems of Kalidasa, the philosophical dialogues of the Upanishads, and the diary of a Kashmiri king named Kalhana who wrote a verse history of his own family in 1148 CE. It is a language in which the word for sky, 'akasha', also means the space inside the heart. It is a language in which the word for guest, 'atithi', literally means 'one whose arrival is not fixed in time' - a stranger who could come on any day, for whom you must always be a little prepared.\n\nDr Bhide passed away in 2019. I had not been a good student. I wrote to her family afterwards to apologise and to thank them. Her daughter wrote back and said her mother had kept a small notebook of her favourite students' names. Mine, surprisingly, was in it, with a single comment next to it in her precise Devanagari hand: 'asks slow questions, will understand eventually.' I am still trying." },
      { id: "brahmi", title: "Brahmi", blurb: "The mother script of half a continent.", minutes: 11, tag: "Script",
        body: "Half the writing systems still in daily use across South and Southeast Asia descend from one parent: Brahmi. Devanagari, which is used for Hindi and Sanskrit and Marathi. Tamil, Telugu, Kannada, Malayalam. Sinhala in Sri Lanka. Burmese. Thai. Khmer. Lao. The classical script of Tibetan. Even the now-fragile script of the Cham people in Vietnam. All of them, structurally - the way they arrange consonants and attached vowels into single visual syllables - go back to a single script that was used by Ashoka's masons to carve his edicts into rock and pillar in the third century BCE.\n\nFor a thousand years after Ashoka, no one in India could read those edicts. The script had quietly evolved into its descendants and the parent form had been forgotten. Travellers would walk past the great pillars at Delhi and Allahabad and notice the writing but assume it was decorative - a flowing pattern of curves and dots that pleased the eye and meant nothing. Mughal emperors had the pillars moved around the country as trophies. The script on them was still illegible.\n\nThe man who unlocked it was a young numismatist in the East India Company named James Prinsep, the assay-master at the Calcutta mint, who was given a stack of coins and inscriptions to work through. Prinsep was not a Sanskrit scholar. He was a thirty-something Englishman with a knack for cryptography and a habit of working late into the Calcutta heat. In 1837, in a paper to the Asiatic Society, he announced that he had cracked it. His method was elegant. He noticed that on a series of small donative inscriptions at a Buddhist site called Sanchi, every one ended with the same two-word formula. He guessed, correctly, that it was 'danam' - 'the gift' - followed by the donor's name. From those two recurring symbols he worked outward, letter by letter, until the whole script opened up to him in a single feverish week.\n\nThe first thing he read with confidence was Ashoka's edicts. The thing the emperor had carved everywhere in his empire so that no successor could ever erase it, and that had then in fact been silently erased by time itself, came back into the world through the patience of one English clerk who could not stop staring at a coin.\n\nPrinsep did not live to enjoy the fame. He worked himself to a breakdown in the Calcutta heat and was invalided back to England in 1838. He died in London in 1840, aged forty. The Prinsep Ghat on the Hooghly is named for him. I sat there once at sunset and tried to feel grateful in his direction.\n\nWhat I find unbearable, in a beautiful way, is this: every time a Tamil grandmother today writes her grandchild's name on a school notebook in careful, rounded letters, she is shaping the great-great-many-times-grandchildren of the same letterforms Ashoka's stonecutters were cutting into the rock at Maski twenty-three centuries ago. The shapes have softened and rounded and split into a hundred regional dialects, but the bones are the same. You can still feel the family resemblance if you put them side by side." },
      { id: "tamil", title: "Tamil Literature", blurb: "Sangam poems older than most empires.", minutes: 12, tag: "Language",
        body: "The earliest body of secular poetry in any Indian language is in Tamil. It is called the Sangam corpus - two thousand three hundred and eighty-one poems by four hundred and seventy-three named poets, composed roughly between 300 BCE and 300 CE in the Pandya and Chera and Chola country of the deep south. About thirty of those poets are women. About a dozen of them are kings. One is an old soldier writing about how his hands have gone soft now that the wars are over and he has been given a village to administer. One is a courtesan writing very simply about her lover, who has gone away on trade to Sri Lanka, and how the season of mango blossom has come and gone twice without him.\n\nMy mother, who was born in a village in Thoothukudi district in 1953, was made to memorise stanzas from the Kuruntokai - one of the Sangam anthologies - in primary school. She still knows most of them. She quoted one to me once, sitting on a bench at the airport in Chennai, when I was about to leave for a job abroad. The poem is by a poet called Kapilar. It is four lines long. In translation, very roughly: 'What he said, sitting beside me - / that our love would be / as the red earth and the pouring rain - / let it be true.' She did not explain it. She did not need to. The red earth of inland Tamil Nadu, when the first rains hit it, releases a smell so specific that no one who has grown up there forgets it. The love being described is the love that mixes that fully with the place it lands in.\n\nWhat is astonishing about the Sangam poems is how unadorned they are. There are no gods in them, in the main. No priests. No metaphysics. They are about hunting, ploughing, waiting, missing someone, the colour of a particular bird's wing in a particular kind of light. They are organised, formally, into five 'landscapes' - the mountains (love and union), the forest (waiting), the cultivated plains (sulking and quarrel), the seashore (separation), and the desert wasteland (elopement). Every emotion has a piece of geography that belongs to it. A poem set on a seashore at evening, with seagulls calling, is doing emotional work that you can decode without being told.\n\nTamil is one of only a handful of languages in the world that has had a continuous literary tradition for over two thousand years, in roughly the same recognisable form. A modern Tamil speaker can struggle through Sangam poetry the way an English speaker can struggle through Chaucer - slowly, with help, but yes. The language has been carried forward, through the Bhakti movement, through the Chola court, through medieval grammarians, through colonial printing presses, through Subramania Bharati shouting his nationalist verses on a Pondicherry beach in 1908, into the SMS texts of Chennai teenagers in 2025.\n\nMy mother died last year. I have been re-reading the Kuruntokai poems on her behalf, one a week. They are very short. They take a long time." },
      { id: "persian", title: "Persian Influences", blurb: "The court tongue that became a poet's mother.", minutes: 11, tag: "Language",
        body: "For roughly five hundred years - from the early Sultanate period in the thirteenth century until the British formally replaced it in 1837 - Persian was the language of administration, diplomacy, court poetry, and high education across a vast belt of the subcontinent. Not just under Muslim rulers. Hindu Rajput chieftains corresponded with Mughal emperors in Persian. Sikh gurus had their court accountants keep records in Persian. Marathi documents from the eighteenth century are scattered with Persian administrative terms - taluk, mahal, sadr, dastur - that survive in Indian bureaucratic English to this day. When a clerk in a Mumbai office stamps a paper 'sadar' or files a 'roznamcha', he is, without knowing it, speaking Persian.\n\nThe greatest poet of the language in India, and perhaps anywhere outside Iran, was a man born in Patiala district in 1253 to a Turkic father and a Hindu Rajput mother. He took the pen name Amir Khusrau. He served seven sultans in succession at the Delhi court. He wrote ghazals so musical they are still sung in qawwali concerts at the Nizamuddin dargah in Delhi every Thursday evening, eight hundred years after he wrote them. He is credited - perhaps fairly, perhaps a little loosely - with inventing the sitar and the tabla and several major raags of Hindustani classical music. He invented an early form of Hindi-Urdu blending in his street verses, switching from a line of Persian to a line of Brij Bhasha and back again in the same poem, which is the literal foundation of the language now spoken on Mumbai film sets every day.\n\nHis love for his spiritual master, the Sufi saint Nizamuddin Auliya, is one of the most famous attachments in Indian literary history. When Nizamuddin died in 1325 while Khusrau was away on a campaign, Khusrau was told the news on the road. He returned to Delhi, sat by his master's grave, recited one couplet - 'The fair maiden lies on the couch with her tresses spread across her face / O Khusrau, come home, the world has been laid to waste' - tore his clothes, gave away his possessions, and died six months later. They are buried a few feet apart in Nizamuddin. Pilgrims still tie threads on both their tombs.\n\nThe last great Persian poet of India was Mirza Ghalib, in Delhi in the nineteenth century, who wrote with equal facility in Urdu and Persian and considered his Persian work the superior of the two. He lived to see the British depose the last Mughal emperor in 1857, watched his own beloved Delhi sacked, and wrote letters in a Persian-inflected Urdu so wry and so heartbroken that they are still read like the day they were sent. One of his couplets - 'Hain aur bhi duniya mein sukhanwar bahut achchhe / Kehte hain ki Ghalib ka hai andaz-e-bayan aur' - basically, 'there are many fine poets in the world, they say, but Ghalib's manner of saying things is something else' - is the kind of small, dignified self-praise that only a man who knows he is right is allowed to write.\n\nMy own grandfather, a Punjabi Hindu, kept a small leather-bound copy of Hafez's Divan on his bedside table all his life. He could not read Persian properly. He used a transliteration. He said it didn't matter. 'The sound of it,' he told me, 'is half the meaning.'" },
      { id: "dialects", title: "Forgotten Dialects", blurb: "Voices that survive in lullabies and ledgers.", minutes: 11, tag: "Language",
        body: "There is a man named Dhaniram Toto who lives in a village called Totopara, in the foothills of the Bhutan border in West Bengal, and who is, as of 2024, one of approximately one thousand six hundred remaining speakers of a language called Toto. Toto is a Sino-Tibetan language. It has no close relatives. Until 2015, it had no script. Dhaniram spent twenty years, mostly alone and mostly unpaid, designing one. The Toto script is now in Unicode. He told a journalist in 2022 that the day his granddaughter wrote her own name in Toto letters for the first time he had to leave the room.\n\nIndia has, depending on how you count, somewhere between seven hundred and one thousand six hundred living languages. The 2011 census recognised one hundred and twenty-one as having more than ten thousand speakers each. The People's Linguistic Survey of India, conducted by the linguist Ganesh Devy between 2010 and 2013 with the help of three thousand volunteers, identified seven hundred and eighty languages and estimated that perhaps another hundred had gone extinct in the previous fifty years without anyone noticing. The Andamanese language Bo went silent in 2010 with the death of an eighty-five-year-old woman named Boa Sr. She was the last speaker. The linguist Anvita Abbi, who had recorded her for years, said the worst thing was the silence afterwards - Boa Sr used to sing in Bo to the birds, and the birds, said Abbi, no longer had anyone to sing back at.\n\nMost of these vanishing languages are spoken in three regions: the eastern Himalayan belt (Arunachal Pradesh alone has at least fifty), the central tribal belt of Chhattisgarh and Jharkhand and Odisha, and the Andaman and Nicobar Islands. They are vanishing for the usual reasons. Children are sent to schools where the language of instruction is Hindi or Bengali or Odia. Government forms are not in the mother tongue. Wage labour pulls young people to cities where the mother tongue is useless and embarrassing. Marriage outside the community means the next generation grows up with a different first language. In two generations, sometimes one, the language is over.\n\nWhat is lost when a language dies is not just words. It is a way of carving up the world. The Brokpa shepherds of the upper Indus, in Ladakh, have separate verbs for 'to walk on snow that has frozen overnight' and 'to walk on snow that is still soft'. The Mishmi tribes of Arunachal have categories for plants - by smell, by season, by use - that do not match any botanical taxonomy and that probably contain pharmacological knowledge no one has yet bothered to write down. The Majhi boatmen of the Sundarbans have words for tides at specific phases of the moon that English, for all its vocabulary, simply does not have. When the last Majhi speaker dies, those distinctions die.\n\nI visited a small folk-recording archive in Bhopal in 2021. The archivist, an old man with very thick glasses, played me a wax-cylinder recording from 1934 of a lullaby in a language called Kharia. He did not know what the words meant. He had not been able to find anyone who did. He said, 'I play it anyway, every week, so that the sound of it has been heard by another human being recently. I don't want it to be lonely.'" },
    ],
  },
  {
    id: "legends",
    name: "Legends & Folklore",
    whisper: "Stories that walked before they were ever written.",
    stories: [
      { id: "myths", title: "Regional Myths", blurb: "Why the river turned, why the mountain bowed.", minutes: 11, tag: "Folklore",
        body: "Every river in India is a goddess and every hill is a story. This is not a poetic exaggeration; it is a literal fact of the spiritual geography you grow up inside. The Ganga is the daughter of Himavan and was brought down to earth, in one telling, by the penance of a king named Bhagiratha who wanted to liberate the souls of his ancestors. Shiva had to catch her in his hair as she fell, because if she had landed directly on the earth she would have shattered it. You can be a perfectly modern Hindu in Delhi and still, on a morning visit to Haridwar, fold your hands once before you step into the water because that is what your mother did and her mother before her, all the way back.\n\nIn the village in Karnataka where my father's family is from, there is a hill behind the temple. It is not a tall hill. It is round, and bare on top, and red-soiled, and from a distance it looks vaguely like a sleeping animal. The local legend, which my grandmother told me when I was six, is that the hill is in fact the tip of a much larger mountain that once tried to fly across the country and was pinned in place by a saint who needed somewhere quiet to sit. The mountain bowed and stayed. That is why the slope on one side is steeper than the other. That is why nothing tall grows on top. The mountain is still trying, very politely, not to disturb the saint.\n\nThis kind of story is what folklorists call etiological - it explains why a thing in the landscape looks the way it does. India has tens of thousands of these. A goddess refused to marry, and her broken wedding pots became seven small islands off the coast of Karnataka. A serpent taught a king humility, and that is why the lake near Pushkar has no fish - the serpent ate them all and then renounced fish, and the lake has respected the renunciation ever since. A poet was so moved by a particular bend in the river Cauvery that he sat there for a year and refused to leave; he is now buried on that bend and there is a small whitewashed shrine, and people still leave him jasmine flowers on the anniversary of a death no one is sure ever happened.\n\nWhat I love about these stories is that nobody seems to mind that they cannot literally be true. A village geologist in Tamil Nadu will explain to you, with a perfectly straight face, both the plate-tectonic origin of his local hill and the goddess who fell asleep on it. He sees no contradiction. The geology tells you what the hill is made of. The story tells you how to feel about it on a hot afternoon when you are walking past it on the way to your aunt's house.\n\nThe danger of national modernisation is that these stories are being flattened into one official version, told in Sanskrit-inflected Hindi on television, with the regional weirdness ironed out. My grandmother's mountain doesn't appear in any pan-Indian mythology. It exists only in three villages around hers, all of whom tell slightly different versions. When she died, she took her version with her. My cousin, who lives in Bangalore, has tried to write the local version down. She has interviewed eleven old women so far. No two of them agree on the exact name of the saint." },
      { id: "heroes", title: "Heroic Tales", blurb: "Pabuji, Tejaji, the chieftains who came back for one last duty.", minutes: 12, tag: "Folklore", curator: true,
        body: "In the desert villages of western Rajasthan there is a class of professional storytellers called the bhopas. They are not Brahmins. They are not priests. They are usually low-caste, often Nayak or Bhil by community, and they inherit their profession from their father, who inherited it from his father. What they perform is the par of Pabuji - a painted cloth scroll, seven metres long and roughly a metre and a half high, on which the entire life and death and posthumous adventures of a fourteenth-century chieftain named Pabuji Rathore are painted in bright pigment in a kind of medieval cinematic shorthand.\n\nThe scroll, when unrolled, takes about thirty hours of singing to read in full. The bhopa and his wife - for the wife, the bhopi, is half the performance - sing the verses in alternation, while the bhopa moves an oil lamp slowly across the scroll, lighting up the relevant scene as he sings it. A full reading takes five nights. The audience sits on the ground. Villagers bring tea. Children fall asleep on their grandmothers' laps and wake up to the next episode hours later. The performance is also, formally, a ritual - the bhopa is understood to be possessed by Pabuji during the recital, and women who cannot conceive will sometimes come at dawn to ask him, while he is still 'inside' Pabuji, for a blessing.\n\nPabuji himself is a small king of a small place. He is not a national hero. He probably lived somewhere in the late fourteenth century, in the village of Kolu, near Phalodi in modern Jodhpur district. He is famous for one act: he had promised to bring camels to a Charan woman named Deval as a bride-price for her daughter, and on the very day of his own wedding, news came that Deval's camel-herd was being raided by a rival named Jindrav Khinchi. Pabuji had three options. He could finish the wedding. He could fight after the wedding. He could leave the wedding ceremony unfinished, halfway through the seven rounds, and ride to honour his promise. He chose the third. He left his bride mid-pheras. He rode to fight. He defeated the raiders. He died in the battle. His bride became sati on his funeral pyre.\n\nThat is the entire story. There is no grand empire. There is no national consequence. It is a small man in a small place who kept a small promise at the cost of his life, and seven centuries later, on cold winter nights in villages no one famous has ever heard of, men and women are still singing about him by the light of a kerosene lamp.\n\nThe folklorist John D. Smith, who studied the Pabuji epic for over twenty years, wrote that he was repeatedly struck by how the bhopas did not regard themselves as artists. They regarded themselves as servants of Pabuji. The performance was a duty. The reward was that they were allowed to go on doing it.\n\nI heard a partial recital once, in a village called Bisalpur in 2017, on a January night when the desert temperature dropped to about three degrees and there were maybe forty of us wrapped in shawls on the sand outside the village shrine. The bhopa was an old man with a voice that had no business still being so strong. At one point his wife took up a quarter-note higher than he had pitched, and he laughed, mid-line, and then carried on. Even Pabuji, I think, would have allowed it." },
      { id: "sacred", title: "Sacred Stories", blurb: "Krishna's mischief, Sita's exile, Buddha's silence.", minutes: 13, tag: "Folklore",
        body: "The Mahabharata is roughly one hundred thousand verses long. That is, in raw word count, about ten times the Iliad and about fifteen times the Bible put together. It contains, at its centre, an eighteen-day battle between two sets of cousins; on the eve of which, the warrior Arjuna loses his nerve, looks across the field at all the relatives and teachers and friends he is about to kill, drops his bow, and asks his charioteer - who happens to be the god Krishna in disguise - what on earth he is doing. The conversation that follows is the Bhagavad Gita. It is seven hundred verses long. It is treated, by many Hindus, as the single most concentrated piece of moral teaching in the tradition.\n\nWhat people outside India sometimes miss is how much of the Mahabharata is not the battle. The epic is, in equal measure, a vast anthology of side-stories, parables, legal codes, family arguments, embarrassing confessions, and digressions about whether a hungry hunter is allowed to eat a dog. It also contains the Ramayana in compressed form, told within itself by a sage who is killing time on a particularly slow afternoon. Indian children grow up not so much reading the Mahabharata as falling into it from various directions - a grandmother retells one episode, a comic book covers another, a television series covers the main battle in seventy-two episodes that the entire country watched in 1988 with the streets visibly emptier on Sunday mornings.\n\nThe Ramayana, the other great epic, is shorter - about twenty-four thousand verses - and more linear. Rama, the prince of Ayodhya, is exiled to the forest on the eve of his coronation through a court intrigue involving his stepmother. His wife Sita and his brother Lakshmana go with him. Sita is abducted by the demon king Ravana of Lanka. Rama crosses the sea with an army of monkeys to rescue her. He wins. They return. Then, in one of the most disturbing passages in any sacred text, Rama exiles his now-pregnant wife on the basis of village gossip about her chastity during her captivity. She raises their twin sons in the forest alone. When, years later, Rama finally finds them and asks her to return, she calls on the earth - who is her mother - and is swallowed back into the ground rather than return to a man who once doubted her. The Ramayana ends, in most versions, with Rama ruling alone, justly, in immense grief.\n\nThis story is performed every autumn, across northern India, as the Ramlila - open-air theatre with painted faces, paper crowns, and an entire village playing the supporting cast. The Ramlila at Ramnagar, near Varanasi, has been performed every year for thirty-one nights in a row since the early nineteenth century. The audience walks from neighbourhood to neighbourhood as the scenes change location. People sleep on the route between scenes. Children grow up inside the story.\n\nAnd then there is the Buddha - Siddhartha Gautama, prince of the Shakya clan, who walked away from his palace at the age of twenty-nine and spent six years wandering the Ganga plain looking for an answer to suffering. When he found what he believed to be the answer, sitting under a peepul tree at Bodh Gaya, his first response was to consider not telling anyone. He thought no one would understand. A god is said to have come down and pleaded with him to teach. He agreed, reluctantly, and walked to Sarnath, where in a deer park near Varanasi he delivered his first sermon to five former companions. That sermon is four noble truths, eight steps long, and is the seed of an entire civilisation that grew across Asia.\n\nMy father used to say that the great gift of Indian sacred literature is that nobody is required to choose. You can revere Krishna and meditate in the Buddha's silence and worry about Sita's exile all in the same week, and no one will think you are confused." },
      { id: "oral", title: "Oral Traditions", blurb: "Memory as the oldest archive we have.", minutes: 12, tag: "Folklore",
        body: "The Rig Veda was composed somewhere between roughly 1500 and 1200 BCE, in the upper Indus and Saraswati basin, in a form of early Sanskrit that even most Sanskrit scholars find difficult. It is ten books long. It contains one thousand and twenty-eight hymns. It was not written down for, by the most conservative scholarly estimate, at least a thousand years after its composition. The writing-down happened reluctantly, late, and in some priestly families is still considered slightly improper. Until then - and largely even after then - the text was preserved entirely in human memory.\n\nNot just the words. The order of the words. The exact pitch each syllable was to be sung at. The duration of each vowel. The pauses. Every single phoneme. Across a thousand years.\n\nThe method by which this was done is one of the most extraordinary intellectual feats in human history, and almost no one outside the tradition has heard of it. The Vedic schools developed eleven different ways of reciting the same text, called pathas. The most basic is samhita-patha, the natural recitation. Then there is pada-patha, in which every word is recited separately, breaking up the natural sandhi (the way Sanskrit words run into each other). Then there is krama-patha, in which the words are recited in overlapping pairs: words 1-2, then 2-3, then 3-4, then 4-5, and so on, like a verbal weave. Then jata-patha, in which each pair is recited forward, backward, and forward again. And finally ghana-patha, the most complex, in which words are recited in patterns like AB-BA-ABC-CBA-ABC, a kind of palindromic braid that makes any error in transmission almost instantly detectable, because it would not survive being said backward.\n\nA priest who has mastered the ghana-patha of the Rig Veda is called a Ghanapathi. There are perhaps a few hundred of them alive today. I met one in Kerala in 2019 at a Vedic school in a small town called Trichur. He was in his late sixties, very thin, very calm, and he could recite the entire Rig Veda forward, backward, and in five interlocked permutations without consulting any text. I asked him how long it had taken to learn. He said, in English, 'I started at six. I stopped having free afternoons at six. I am still learning, sir, please do not flatter me.'\n\nWhat this means is that the Rig Veda has come down to us, across more than three millennia, in a form that is essentially identical across all regional schools - Kerala, Maharashtra, Kashmir, Bengal - to a degree of textual fidelity that the surviving manuscripts of Shakespeare cannot match across four hundred years. Linguists who have compared recitations from schools that have had no contact with each other for centuries have found differences of perhaps half a dozen syllables in the entire ten-thousand-verse text.\n\nThis was done without writing. Without recording. Without printing. Without the internet. With nothing but children, fathers, teachers, breath, attention, and the willingness to spend a lifetime carrying somebody else's words faithfully forward into a future they would never see.\n\nIt is, when you think about it for long enough, the oldest functioning piece of human technology still in operation. And it is being run, this evening, in a school in Trichur, by a man on a wooden bench, with a glass of weak coffee at his elbow, and three small boys sitting cross-legged in front of him, beginning again with the very first verse." },
    ],
  },
  {
    id: "architecture",
    name: "Architecture",
    whisper: "Stone that learned to breathe.",
    stories: [
      { id: "temples", title: "Temples", blurb: "Mountains carved inward until they became gods.", minutes: 14, tag: "Architecture", curator: true,
        body: "The Kailasa temple at Ellora is not built. It is carved. There is a difference, and it took me a while standing in front of it to feel it properly. A built temple stacks blocks of stone upward. A carved temple starts at the top of a hill and removes everything that is not the temple. The Kailasa was excavated, top-down, out of a single volcanic basalt cliff, in the eighth century CE, under the patronage of a Rashtrakuta king named Krishna I. The excavators began at the top of the hill and worked downward, leaving the temple standing in a vast pit they were digging around it. Modern estimates suggest they removed roughly two hundred thousand tonnes of rock. There is no second draft in this kind of architecture. A mistake at the top of a pillar cannot be patched.\n\nThe finished temple is the size of the Parthenon. It has two storeys of carved galleries running around it. There is a free-standing flagstaff that was cut out of the same continuous rock as the floor it stands on. The elephants supporting the plinth are full-sized, and their trunks, in places, are still gently curled around lotus stems that the masons left intact a thousand and three hundred years ago. There is an inscription in which a later king, the Rashtrakuta successor, came to see the temple and admitted in writing that he could not understand how it had been done. 'Even the artist who built it,' the inscription says, 'was struck with astonishment, saying - I have built this; how have I built it?'\n\nIndian temple architecture is broadly split into three main streams. The nagara style of the north, with its soaring curvilinear shikharas - think of the Khajuraho temples in Madhya Pradesh, where the towers ripple upward like flames frozen at the moment of leaping. The dravida style of the south, with its receding storeys and immense gopuram gateways painted in primary colours - think of the Meenakshi temple at Madurai or the Brihadeeswara at Thanjavur. And the vesara style of the Deccan, which blends the two - think of the Hoysala temples at Belur and Halebidu, where the walls are so thickly carved with figures that there is barely a square inch of plain surface anywhere.\n\nWhat unites them is a single underlying idea. The temple is not a building you enter to find God. The temple is itself the body of God. The shikhara is the head. The garbha-griha - the dark, small inner sanctum that holds the deity - is the heart, deliberately kept small, deliberately kept dim, because the divine, in this scheme, does not require a lot of room. You move from the bright outer pavilions, through progressively darker pillared halls, into a final chamber lit only by a single oil lamp, where you stand within touching distance of the deity. It is, architecturally, a journey from the periphery of your own self to its centre. Hindu cosmology mapped onto granite, then walked through with bare feet.\n\nI took my grandfather to the Brihadeeswara temple at Thanjavur the year before he died. He was eighty-three. The Cholas, his ancestors had served as accountants under, in the eleventh century. He walked very slowly to the centre of the courtyard and stood facing the vimana, the great tower. The shadow it cast - the famous fact about this temple is that the shadow of its tower, at noon, falls within the temple itself and never crosses the outer wall - was directly at his feet. He did not say anything for a long time. Then he said, in Tamil, 'They knew, you see, that we would still come. That is the only reason a man builds something like this.'" },
      { id: "forts", title: "Forts", blurb: "Walls that watched centuries.", minutes: 12, tag: "Architecture",
        body: "The fort of Mehrangarh rises straight out of a four-hundred-foot sandstone cliff on the western edge of Jodhpur. Seen from the old city below, it does not look built. It looks grown. The walls, in places, are six metres thick. The cliff face itself has been cut and shaped into ramparts so that you cannot, at certain angles, tell where the rock ends and the masonry begins. The seventh and last of its gates, Lohapol, still has the small, painted handprints of fifteen royal widows who walked through it in 1843 on their way to their husband Maharaja Man Singh's funeral pyre. The paint has faded. The prints have not been touched up. They are kept exactly as they were left.\n\nA fort, in the Indian sense, is not just a defensive structure. It is a small sovereign world. Inside Mehrangarh's walls there is a palace, a treasury, a temple, a covered water reservoir that holds enough water for a six-month siege, a museum of howdahs and palanquins, an audience hall with windows of latticed sandstone so fine that the courtyard outside is visible only as a kind of dappled pattern, and a long sequence of zenanas - the women's quarters - whose pierced screens allowed the women to watch the entire court without being seen.\n\nChittorgarh, in southern Rajasthan, fell three times. In 1303 to Alauddin Khalji, in 1535 to Bahadur Shah of Gujarat, and in 1568 to Akbar. On each of these three occasions, when the defenders knew the fort was about to be taken and that there was no further hope, the men committed saka - they put on saffron robes, opened the gates, and rode out to die. The women committed jauhar - they lit a single great fire inside the inner courtyard and walked into it together rather than be captured. The smoke from the third jauhar was said to have hung over the cliffs of Chittor for three days. There is a small inscription on the wall of one of the inner gates that lists, in dry medieval Rajasthani, the number of women who walked into the fire each time. The list goes: thirteen thousand, ten thousand, eight thousand.\n\nYou can walk these forts now as a tourist. There are signboards. There are audio guides. There are men selling cold drinks. None of this dilutes them. You climb the long ramp up to Kumbhalgarh, a hill fort whose outer wall is the second longest continuous wall in the world after the Great Wall of China - thirty-six kilometres of unbroken battlements - and you understand, in your legs and your lungs, how seriously these places were meant. You are walking up the ramp the elephants of attacking armies could not.\n\nMy own favourite is the small, far less famous Junagarh fort at Bikaner. It is a desert fort. It has never been taken in battle. It does not even have a hill. It sits on the flat sand of the Thar with a moat that was - until they ran out of water - a real moat. The interior is a maze of about thirty courtyards opening into each other, each with its own miniature character - one in Mughal style, one in Rajput, one in Anglo-Indian after a maharaja came back from his European tour. The royal family still lives in a small wing of it. The current Maharaja, when I visited in 2019, was eating breakfast on a verandah overlooking a fountain that had been turned on for him alone that morning. He waved without looking up.\n\nThese forts are not, finally, about war. They are about the willingness of a small group of people, in a hard climate, to declare a place worth defending forever - and then to spend two or three centuries proving it." },
      { id: "stepwells", title: "Stepwells", blurb: "Architecture you descend into, not up.", minutes: 11, tag: "Architecture",
        body: "Rani-ki-Vav at Patan, in northern Gujarat, is a building you enter by walking down. There is no roof. There is no facade. From a hundred metres away you cannot tell it is there at all - the surrounding land is flat scrub, and the structure begins as a rectangular hole in the ground that you only see when you are standing on the edge of it. Then you look down and realise the hole is the size of a city block and seven storeys deep, and that every wall going down is covered, from top to bottom, with eight hundred carved sculptures of gods, goddesses, attendants, and incidental musicians. A temple turned upside down and pushed into the earth.\n\nIt was built around 1063 CE by Rani Udayamati, the widow of King Bhima I of the Solanki dynasty, as a memorial to her husband. It is a memorial that also stored water. This is the genius of the form. A stepwell is, functionally, a well - but the well-shaft has been opened up into a long staircase, lined with galleries, so that the entire community can walk down to the water level. In a region where the water table dropped by twenty or thirty feet between summer and monsoon, an ordinary well became unreachable in dry months. A stepwell, by being an entire staircase, simply met the water wherever it was. In summer you walked down seven storeys. In monsoon you walked down two.\n\nAnd because the women of the village walked down to fetch the water - twice a day, every day - the stepwell became, in a hot country, the single coolest, calmest, most architecturally dignified social space available to them. The temperature at the bottom of Rani-ki-Vav is, even in the height of Gujarati summer, perhaps fifteen degrees cooler than the surface. You walk down out of the desert glare into a stone twilight, and the sculptures lean toward you on either side - Vishnu in ten avatars, Parvati standing on one leg in penance, apsaras taking thorns out of their feet - and you understand that this was a place where a tired woman with two pots on her hip could stop, sit on a step beside a sandstone goddess who had also paused to rest, and pass a few minutes in air that did not punish her.\n\nThere are roughly three thousand surviving stepwells across western India. Most are unknown to anyone outside their immediate village. Many are partly silted in. Some, in the late twentieth century, were filled in entirely as health hazards by district administrators who did not understand what they were destroying. A few - Adalaj near Ahmedabad, Chand Baori at Abhaneri in Rajasthan, the Agrasen ki Baoli in central Delhi - are preserved as monuments. Most are not. You can find them by asking elderly farmers. They will lead you down a path through a field of cotton, and there, suddenly, will be a hundred-and-fifty-step staircase descending into the earth, with a thin layer of green water at the bottom, and a single egret standing in it, and a Vishnu missing his arms looking down at you from the third gallery as if to ask what took so long.\n\nMy mother grew up in a village in north Gujarat. The village had a small, unfamous stepwell. She used to be sent there every morning at six to fill water before school. She told me, when I was a child, that the stepwell was her favourite place in the world, because at six in the morning, in the bottom gallery, it was always the same temperature, and the same goddess was always sitting there, and as long as she sat next to her for a few minutes before climbing back up with the heavy pot, the goddess did not seem to mind that my mother sometimes cried." },
      { id: "palaces", title: "Palaces", blurb: "Where mirror, marble, and intrigue all reflected each other.", minutes: 11, tag: "Architecture",
        body: "The Hawa Mahal in Jaipur is not, properly speaking, a palace. It is a screen. Five storeys of pink sandstone, pierced by nine hundred and fifty-three small latticed windows, attached to the back of the City Palace, with rooms behind the windows that are barely deep enough to stand in. From the front it looks like an elaborate facade. From the back it is almost flat. Maharaja Sawai Pratap Singh had it built in 1799 for one reason: so that the women of his royal household, who under purdah could not appear in public, could nevertheless watch the street processions of the city pass below them without being seen themselves. The windows are angled. The screens are calculated. A woman could press her face to the lattice and see the entire bazaar in detail, and the bazaar, looking up, would see only carved stone.\n\nIndian palace architecture is, on the whole, more about screening than about display. The great Mughal palaces - the Red Fort at Delhi, the Fatehpur Sikri complex, the Lahore Fort, the Agra Fort - are organised as a sequence of progressively private courtyards. The outer courtyard, the Diwan-i-Aam, is the hall of public audience, large, open, accessible to any subject who came with a petition. Beyond that, through a guarded gate, the Diwan-i-Khas, the hall of private audience, smaller, decorated with semi-precious inlay, where only the trusted nobles and ambassadors were received. Beyond that, the personal apartments of the emperor. Beyond those, the zenana - the imperial harem - which was a city in itself, often holding several hundred women, eunuch officials, slave-girls, dance instructors, midwives, and food-tasters, and which no man other than the emperor could enter.\n\nThe Sheesh Mahal - the Hall of Mirrors - at the Amer Fort in Jaipur is the architectural ancestor of every disco ball you have ever seen. The ceiling and walls of the inner chamber are inlaid with tiny convex mirrors, thousands of them, brought from Belgium, set into floral patterns of plaster. The story, possibly true, is that the queen liked to look at the stars at night and was not permitted, under purdah, to sleep outdoors. So her husband built her a room in which a single candle, lit in the centre of the floor, would reflect off the mirrors and produce, on the ceiling, the entire night sky. I have stood in that room with a single candle. The story is true.\n\nThe Lake Palace of Udaipur, now a hotel, was built in 1746 as a summer residence for Maharana Jagat Singh II on a small island in Lake Pichola. It is white marble. It floats. When the lake is full, in good monsoon years, it appears to be sitting directly on the water with no foundation, which is roughly true - its base is built down to the lake bed and was meant to look exactly this way. I had a single overpriced cup of coffee on its verandah in 2015 and watched the city across the water turn pink in the sunset. It was worth every rupee.\n\nWhat I find moving about these palaces is not their grandeur, which is real but not particularly Indian; many cultures build grand palaces. It is the constant, very Indian preoccupation with concealment. With windows that can see but not be seen through. With courtyards that can be entered only by certain people. With balconies for women and audience halls for men. With architecture as a way of organising who is allowed to look at whom. It is a quieter, more ambivalent kind of grandeur than the European version. Versailles wants to be looked at. The Hawa Mahal wants to look out." },
      { id: "monasteries", title: "Monasteries", blurb: "Cells of silence above the snow line.", minutes: 12, tag: "Architecture",
        body: "Thiksey Monastery sits on a hill in the Indus valley of Ladakh at an altitude of three thousand six hundred metres. It is twelve storeys high. Seen from below, on the road from Leh, it does not so much sit on the hill as grow out of it - the whitewashed walls follow the contours of the slope, climbing in stepped tiers until they reach the central temple at the summit. The monastery houses, on a normal day, about a hundred and twenty monks. In winter the number drops to fewer than forty, because the rest go down to the lower valleys until the worst of the cold passes. The butter lamps in the main prayer hall, however, have not gone out, in any verified telling, since the monastery's founding in 1430.\n\nThe Tibetan Buddhist gompas of the Himalayas - Thiksey, Hemis, Lamayuru, Diskit, Tabo, Spituk, the great Tawang in Arunachal Pradesh - are libraries first and architecture second. The thing they were built to preserve, more than anything, is text. After the destruction of the great Indian Buddhist universities of Nalanda and Vikramashila by Bakhtiyar Khilji's forces around 1200 CE, the Buddhist tradition in the Indian heartland essentially ended. The texts that survived survived because individual monks, in the centuries leading up to and following that destruction, had walked them across the Himalayas to Tibet and to the high-altitude valleys of Ladakh and Spiti. The libraries at these monasteries hold the Tibetan Buddhist canon - the Kangyur and the Tengyur, more than four thousand texts in total - in handwritten, hand-illuminated manuscripts on long, narrow leaves of treated paper, wrapped in silk and stacked between wooden boards.\n\nA Tibetan-style monastery is built in a particular order, on a particular logic. The thickest walls and the highest tier are reserved for the lhakhang, the assembly hall, which contains the principal images. Below that are the residential cells of the monks, smaller, plain, often just a bed and a small shrine. Below those are the kitchens, the granaries, the cattle sheds. The monastery is meant to be self-sufficient for the whole winter. The villagers in the valley below give grain and butter and yak-hair cloth as donations, and in return the monastery provides ritual services for births, deaths, illnesses, the consecration of new houses, and the annual cham - the masked dance performed in the courtyard in summer, when villagers walk for two days to come and watch and then walk two days back.\n\nThe oldest of these monasteries, Tabo in Spiti, was founded in 996 CE. Its walls are mud. Its murals, painted in the eleventh century in a Kashmiri-influenced style, are some of the finest surviving Buddhist paintings in the world. They have lasted because the climate is dry and the altitude is high, and because the monks never lit fires for warmth inside the prayer halls, which would have blackened them. The monks shivered through a thousand winters so that the paintings would survive. They survived. The monks, mostly, did not - the average lifespan of a Tabo monk before the twentieth century, by what records exist, was around forty-five.\n\nI spent a single night in a guest cell at Lamayuru in October of 2018. The room was three metres by two, with a low wooden bed, a single window of unglazed wood lattice, and a small iron stove that the caretaker monk lit for me at sunset. The temperature dropped well below freezing in the night. I could see my breath. From the cell I could hear, very faintly, the morning prayer beginning at four-thirty - the long low note of the dungchen horns, the deep collective chanting, the small metallic clash of cymbals. I lay in my sleeping bag and did not move and let it go on for forty-five minutes around me, and when it ended and the silence came back, the silence was different. It had been touched." },
    ],
  },
  {
    id: "art",
    name: "Art & Craft",
    whisper: "Hands that refused to forget.",
    stories: [
      { id: "textiles", title: "Textiles", blurb: "Patola, Jamdani, Kalamkari - fabrics written by hand.", minutes: 13, tag: "Craft", curator: true,
        body: "A double-ikat Patola sari takes six months to weave and is made by exactly one family in the world. The Salvi family of Patan, in northern Gujarat, has been weaving Patolas for, by their own count, thirty-five generations. They moved to Patan from Karnataka in the twelfth century at the invitation of King Kumarpal of the Solanki dynasty, who wanted the finest cloth in the country for the temple of his coronation. The family came. They have not left since. There are, as of 2024, perhaps four people in the entire world who can do the full process from start to finish, and three of them share a surname.\n\nDouble ikat - the technique that makes a Patola a Patola - works as follows. Before any thread is woven, the pattern is calculated as a grid. The grid is then projected onto both the warp threads (the long ones, running the length of the loom) and the weft threads (the cross threads). At every point where the grid says a particular colour must appear, the relevant section of thread is tightly tied with a thin cotton resist before dyeing. The whole bundle is then dipped in the first colour. The ties prevent that colour from penetrating the bound sections. The ties are then partly undone or moved, and the bundle is dipped in the second colour. And so on, often for ten or twelve dye baths.\n\nThis means that before the weaving has even begun, both the warp and the weft already 'know' the pattern. When they are then woven together on the loom, the two sets of threads must interlock at exactly the right point - within less than a millimetre - for the colours to align. If a single weft thread is even half a thread off, the geometric pattern is ruined and the whole sari has to be unpicked. The Salvis do not unpick. They get it right the first time.\n\nIndia has, beyond Patola, a working textile vocabulary that is the deepest and most regionally specific anywhere in the world. Jamdani from Dhaka and Murshidabad - fine muslin so light that an entire sari can pass through a ring, woven with supplementary weft patterns that float on the surface like shadows of birds. Kalamkari from the temple towns of Andhra Pradesh - cotton cloth painted by hand with a bamboo pen dipped in fermented jaggery and iron filings, then washed in the Krishna river so that the mordant binds the dye into the fibre. Banarasi brocade from Varanasi - silk shot through with real gold and silver thread, woven on pit looms by Muslim weavers who often cannot themselves afford the saris they make for Hindu brides. Chikankari from Lucknow - fine white-on-white shadow embroidery developed in the Mughal court, said to have been introduced by Nur Jahan, that requires the embroiderer to count individual warp threads through a magnifying glass.\n\nThe colonial period was, for these traditions, a catastrophe. Cheaper, lower-quality Manchester cloth flooded the Indian market in the nineteenth century. The Bengal muslin industry, which had clothed European nobility in the eighteenth century, was effectively destroyed by 1830. The story - disputed by some historians, accepted by most - is that the British, to protect Lancashire mills, broke the thumbs of the most skilled Bengal muslin weavers so that the technique could not be passed on. Whether the breaking was literal or economic, the result was the same. By the time of Independence, the average Indian handloom weaver was earning less than a daily wage labourer.\n\nThe revival owes a lot to one woman, Kamaladevi Chattopadhyay, who in the 1950s set up the All India Handicrafts Board essentially by sheer force of personality and refused to let traditional textile work die quietly into industrial obsolescence. The crafts survived. Many are now thriving again. The Salvis of Patan still get more orders than they can fulfil. There is a five-year waiting list.\n\nI bought a Patola dupatta for my mother in 2018. It cost more than I could comfortably afford. She wore it twice, then folded it back into its silk wrapping, and said, 'I am keeping this for your wedding.' I am not married yet. The dupatta is still folded." },
      { id: "pottery", title: "Pottery", blurb: "Earth, wheel, fire, hand. Nothing else.", minutes: 11, tag: "Craft",
        body: "The kumhars of India - the traditional potters' community - have been making the same set of objects for, by the most recent archaeological consensus, approximately five thousand years. The shapes have evolved subtly. The function has not. A clay pot for storing drinking water (matka), a smaller pot for buttermilk (handi), a shallow round dish for rolling out chapatis (chakla), small unfired tea cups (kulhads), oil lamps for the festival of lights (diyas) - these objects, in essentially their current form, appear in the excavated levels of Harappan cities from the third millennium BCE. The wheel they are thrown on is the same kind of wheel. The kiln they are fired in is the same kind of kiln. Few craft traditions on earth have such a continuous lineage of basic competence.\n\nI grew up drinking water from a matka in our kitchen in Indore. My mother believed, as did her mother, that water tastes different from clay. She was right. The matka is porous. A small percentage of the water evaporates through the wall of the pot, and this evaporation cools the water inside by several degrees below the ambient temperature, without any refrigeration. The water also takes on a very faint earthen taste - not muddy, not metallic, just a soft mineral suggestion that bottled water cannot mimic. In the height of an Indian summer in a house without air conditioning, the matka was the most reliable comfort we had.\n\nRegional pottery traditions are as varied as the soils they come from. The black terracotta of Manipur is fired in such low-oxygen conditions that the iron in the clay turns from red to black, producing a deep, almost graphite sheen - vessels meant for ritual offerings, made for centuries by women in the Andro and Thongjao villages. The blue pottery of Jaipur, which is not strictly pottery at all because it contains no clay - it is made of quartz, glass, and Multani mitti, fused with a cobalt-blue glaze - was brought to Rajasthan from Persia by the Mughals in the seventeenth century and adapted by local craftsmen who could not get the original Persian frit and substituted ground quartz from the desert hills.\n\nIn West Bengal, the village of Krishnanagar has, since the late eighteenth century, made small unfired clay figurines so realistic that a particular nineteenth-century artisan named Yadunath Pal once sculpted a likeness of Queen Victoria's husband Prince Albert that, when it was sent to England, was reportedly mistaken for a wax figure. In the Bastar region of Chhattisgarh, the Ghadwa community has cast brass figurines in lost-wax (dhokra) for, again, nearly four thousand years - a wax model wrapped in clay, the wax melted out, molten brass poured in, the clay broken away. The mould is destroyed every time. Each figurine is therefore literally one of one.\n\nThe village potter, the gaon ka kumhar, is also - uniquely - the only craftsman in the traditional Indian village hierarchy whose product almost everybody, of every caste, must use. The Brahmin priest will not eat off a leather worker's plate, but he will drink his morning water from a clay pot the kumhar made. The kulhads at a roadside chai stall are still the only fully sanitary disposable cup in widespread use in India - they are used once, then thrown to the ground, where they break and return to the earth they came from within months. No plastic. No waste. A four-thousand-year-old technology that solves a problem we have not yet figured out how to solve modernly.\n\nMy father took me to a potters' colony on the outskirts of Indore when I was about seven. The potter there gave me a small lump of clay and showed me how to centre it on the wheel. I could not do it. The clay flew off and hit me in the chest. He laughed and said, in Hindi, 'It is all right, beta. The clay must trust your hands. You have not yet asked it to.'" },
      { id: "miniature", title: "Miniature Paintings", blurb: "Stories painted on the back of a hand.", minutes: 12, tag: "Art",
        body: "There is a Pahari miniature painting from the late eighteenth century, in the Kangra style, that I have looked at perhaps thirty times in my life and never finished looking at. It hangs - or it did when I last saw it, in 2017 - in the National Museum in Delhi. It is about the size of a paperback book. It shows Radha and Krishna seated together under a tree at the edge of a small forest pool, at the moment just before a monsoon storm. The leaves of the trees are being lifted by the first wind. The water of the pool has just begun to ripple. Radha is looking sideways at Krishna with an expression that is at once love and a slight, half-amused alarm - not at the storm, but at her own happiness. Krishna is smiling at the trees. The painter has somehow communicated that he, being a god, already knows what the storm will and will not do.\n\nThe whole painting is the size of a man's hand. It is on paper laid down on cloth. The pigments are mineral - ground lapis for the blue of Krishna's skin, ground malachite for the green of the leaves, white lead for the highlights, gold leaf for the jewellery, all bound in gum arabic and applied with brushes that, in the Kangra school, are made from a single hair plucked from the throat of a young squirrel.\n\nIndian miniature painting is a tradition that runs across at least four major schools and roughly three centuries. The Mughal school - formalised under Akbar in the late sixteenth century, refined under Jahangir, baroque under Shah Jahan - produced portraits of staggering psychological realism, hunting scenes, court receptions, and entire illustrated histories like the Akbarnama and the Padshahnama in which every face in a crowd of three hundred courtiers is recognisable. The Rajput schools - Mewar, Bundi, Kishangarh, Marwar - took the Mughal technique and bent it back toward Hindu mythological subjects, with a particular focus on the Krishna-Radha story and on the rasamala, the cycle of seasonal moods. The Pahari schools - Basohli, Guler, Kangra, Kullu, Chamba - flourished in the hill kingdoms of present-day Himachal Pradesh between roughly 1690 and 1820, often in tiny courts with only one or two royal patrons and a single master painter passing the workshop down through his sons. The Deccani schools - Bijapur, Golconda, Hyderabad - drew on Persian and Turkish influences mixed with a southern colour sensibility, producing portraits of the Deccani sultans against backgrounds of intense purples and golds.\n\nWhat is being painted, almost always, is a moment of feeling. The hero is leaving on a journey and the heroine is watching from her window. The lover is late. The lover has arrived. The lover and the beloved are sitting together, finally, in the same garden, and there is nothing left to want. These are not narrative paintings in the European sense - they are not telling a story. They are isolating one frame of a story and saturating it with mood.\n\nThe master painter most often invoked is Nainsukh of Guler, an eighteenth-century court painter whose patron Balwant Singh of Jasrota was, by all accounts, a not particularly important raja in a not particularly important kingdom. But Nainsukh painted him obsessively, over decades, in every imaginable private moment - Balwant Singh reading by lamplight, Balwant Singh smoking a hookah on a winter morning with a shawl over his head, Balwant Singh listening to a young musician, Balwant Singh wrapped in a quilt looking out at falling snow with an expression that says he is thinking about something he will not say out loud. The two of them - the painter and the patron - clearly trusted each other. The paintings are an act of attention so sustained and so kind that they are, in their own quiet way, one of the great records of a friendship in art history.\n\nNainsukh outlived Balwant Singh by twenty years. He continued painting, but the work, by general consensus, never quite recovered the same warmth." },
      { id: "sculpture", title: "Sculpture", blurb: "From Mathura serenity to Hoysala excess.", minutes: 12, tag: "Art",
        body: "There is a stone Buddha in the Mathura Museum, carved out of mottled pink Sikri sandstone in the late first or early second century CE, that I went to see specifically the first time I was in Mathura. The label calls him simply Standing Buddha, Kushan period. He is about a metre and a half tall. His robe falls in soft pleats over his left shoulder. His right hand is raised in the gesture of fearlessness - abhaya mudra - palm forward, fingers gently curved. His eyes are not closed but very nearly so. The corners of his mouth are turned up by perhaps a millimetre. He is smiling, but you have to be willing to see it.\n\nThe Mathura school, working in the first and second centuries CE, produced what are arguably the earliest fully anthropomorphic images of the Buddha anywhere - before that, the Buddha was usually represented by symbols, an empty throne, a pair of footprints, a parasol, a wheel. The decision to put a body and a face on him was a significant theological one, and the Mathura artists answered the question 'what should the awakened one look like?' with this: he should look like a healthy young north Indian man in his late twenties who has stopped being afraid of anything. That is the Mathura Buddha. He is not ascetic. He is not gaunt. He is not somewhere else. He is here, and he is calm.\n\nIndian sculpture spans an almost vertiginous range. At one end, the Mathura serenity I have just described, and the slightly later Gandharan Greco-Buddhist statues from what is now Pakistan, where the Buddha picks up the wavy hair and the contrapposto stance of a Greek youth because the sculptors were trained by Alexandrian craftsmen left behind by the diadochi. At the other end, the impossible excess of Hoysala temple sculpture - twelfth- and thirteenth-century Karnataka - where every square inch of the soft chloritic schist walls of Belur and Halebidu and Somanathapura is carved into bracket figures of dancers and goddesses so thickly bejewelled that the artist Belavadi Mallitamma is recorded, by an inscription on the temple wall itself, as having spent twelve years on a single bracket figure of a salabhanjika - a tree-spirit - whose bangles, when you look at them through a magnifying glass, have a thread of stone visible passing through them, suggesting that the bangle is movable.\n\nThe Mathura, Sarnath, and Gupta-period sculptors stripped away. The Hoysalas piled on. Both are India.\n\nIn between is the bronze tradition I have written about elsewhere - the Chola south Indian bronzes, with their lost-wax Natarajas and Parvatis and standing Vishnus. And the cave sculpture of Ellora and Elephanta, where the great Trimurti at Elephanta Cave 1 - a six-metre carving of Shiva's three faces, the creative, the destructive, and the meditative, emerging from a single block of basalt - has, on the central meditating face, an expression of inwardness so complete that the architectural historian Stella Kramrisch said simply, 'It is the face of a god who has forgotten he is being looked at.'\n\nA Hoysala goddess at Belur - the most famous one, called Darpana Sundari, the Beauty with the Mirror - is carved with such depth that a thin metal wire can be passed all the way around her ankle anklets without touching the stone. The anklet is fully detached from the leg, fully detached from the supporting bracket, attached only at the top and bottom. This is in chloritic schist, a stone soft enough to carve when freshly quarried and rapidly hardening on exposure to air. The sculptor had perhaps a few weeks to finish before the material became too hard to work. He finished.\n\nI stood in front of Darpana Sundari with a cousin in 2019. He is a software engineer in Bangalore. He looked at the carved bangles, at the carved thread of jasmine in her hair, at the carved fold of cloth at her hip, and then he said, very quietly, 'I am not sure what my engineering can really claim, after this.'" },
      { id: "metalwork", title: "Metalwork", blurb: "Bidri, dhokra, repoussé - alloys with memory.", minutes: 11, tag: "Craft",
        body: "Bidriware is named for the small town of Bidar in northern Karnataka, where the technique was perfected in the fourteenth and fifteenth centuries under the Bahmani sultans. The base alloy is a zinc-copper mix, with the zinc at about ninety-five per cent. The object - a hookah base, a tray, a pandan box, a small jewellery casket - is cast in this alloy, allowed to cool, and then the surface is blackened by a chemical treatment using a paste of soil from a particular wall of the Bidar fort. Bidri craftsmen will tell you, with the utter seriousness of professionals, that the paste does not work as well if it is made from soil from any other wall. They have tested. They are right.\n\nOnto this black surface the craftsman engraves a fine design - usually floral, often Persian-influenced, occasionally calligraphic - with a steel stylus. Into the engraved grooves, he hammers thin strips or wires of pure silver, sometimes gold, until the inlay is flush with the surface. He then polishes the whole object. The silver shines. The zinc base, treated again with the soil paste, deepens to a velvet matte black that has, somehow, almost no reflection at all. The contrast is extraordinary. A bidri hookah base in evening light looks like a piece of solidified night sky with stars set into it.\n\nIndia's metalworking traditions are, like its textiles, defined by particular families in particular villages who have done one thing for centuries. The dhokra brass casters of the Bastar region, whom I have mentioned before, work in lost wax. The bell-metal artisans of Kerala cast vast ritual lamps, sometimes ten feet tall, that hang in temples and are filled every evening with coconut oil and a hundred and one wicks. The Tibetan ritual bronze tradition, surviving in the Ladakh and Spiti monasteries, casts the dorje and the ghanta and the small seated Buddhas used in personal shrines, using techniques carried up from the plains a thousand years ago.\n\nIn Moradabad, in western Uttar Pradesh, an entire town has, for over four hundred years, specialised in brass repoussé - designs hammered out from the inside of the metal so that they stand in relief on the outside. The brass trays and platters of Moradabad are exported to the Middle East and to Europe by the container-load. The town's older artisans, however, still produce a handful of pieces a year that are made the old way, by hand, on a hardened bitumen bed, with a curved hammer and a set of punches that the craftsman makes himself, modifying their shape every few years as his style evolves. The difference between a hand-hammered Moradabadi tray and a machine-stamped one is something you can feel with your eyes closed. The hand piece breathes. The machine piece sits dead in your palm.\n\nThe Iron Pillar at Delhi I have already written about - the great Gupta-period feat of metallurgy, six and a half metres of nearly pure wrought iron that has not properly rusted in sixteen hundred years. India's metallurgical confidence runs that deep. The wootz steel of Hyderabad, exported through the Persian Gulf to Damascus for sword-making, was the original 'Damascus steel' - its distinctive watered pattern was a result of a smelting process Indian iron-workers had developed perhaps as early as the third century BCE, and that European steelworkers, despite trying for centuries, could never quite replicate.\n\nI bought a small bidri box once, in Hyderabad in 2016, from a craftsman in his seventies whose grandfather had supplied the Nizam. The box is the size of my fist. The lid has an inlay of jasmine flowers in silver against the black. He sold it to me for less money than I had been ready to spend. When I tried to give him more, he refused. He said, in Urdu, 'Sahib, my price is my price. If I take more than my price, I become a different craftsman. I do not want to become that.'" },
    ],
  },
  {
    id: "music",
    name: "Music & Performance",
    whisper: "Time, measured in raga and breath.",
    stories: [
      { id: "classical", title: "Classical Traditions", blurb: "Hindustani and Carnatic - two rivers from one sky.", minutes: 14, tag: "Music", curator: true,
        body: "There are perhaps three hundred main ragas in the working Hindustani classical repertoire and around seventy-two parent scales (melakarta) in the Carnatic system from which several hundred derivative ragas are constructed. A serious classical musician will, over a lifetime, develop a deep practical relationship with perhaps thirty of them. Pandit Bhimsen Joshi, who died in 2011, was said by his disciples to have lived inside about a dozen ragas with such intimacy that they became almost biographical - his Miyan Ki Todi at six in the morning sounded like a man speaking to a particular daybreak that he had been meeting in private for fifty years.\n\nA raga is not a scale. A scale is a ladder of notes. A raga is a person. It has a particular set of notes, yes, but it also has a particular set of permitted ascents and descents, particular phrases that are characteristic and that must appear, particular notes that are emphasised and particular ones that are touched only in passing, a particular time of day or season when it is traditionally sung, and - crucially - a particular emotional weather. Raga Yaman, sung in the early evening, is contemplative, slightly amorous, suited to the moment when the lamps are being lit. Raga Bhairav, at dawn, is austere, devotional, the music of someone walking to a river to perform ritual ablutions. Raga Malhar, sung in the monsoon, is supposed to bring rain, and the great Mughal court singer Tansen is said to have proved it more than once.\n\nThe distinction between Hindustani - the classical music of the north - and Carnatic - the classical music of the south - emerged over several centuries, broadly stabilising after the thirteenth century when the Muslim courts of north India absorbed strong Persian and Central Asian musical influences while the south continued in a more directly temple-based devotional tradition. Hindustani music developed long, slow improvisatory introductions (alaap) in which the singer or instrumentalist explores the raga without rhythmic accompaniment for sometimes forty minutes before any drum enters. Carnatic music kept the composition (kriti) more central, with most of the improvisation occurring around the fixed compositions of three great eighteenth-century saint-composers - Tyagaraja, Muthuswami Dikshitar, and Syama Sastri - who, by an absurd coincidence of history, were all born in the same small town of Tiruvarur in Tamil Nadu within ten years of each other.\n\nThe relationship between teacher and disciple in the classical tradition - the guru-shishya parampara - is one of the most demanding apprenticeships in any artistic tradition in the world. A serious student traditionally goes to live with the guru, sometimes for years, performing household chores, listening to the guru practise, being given short phrases to repeat for hours, slowly being trusted with more. Ustad Bismillah Khan, the shehnai master who died in 2006, would tell his students that he learnt his most important lesson not from his uncle Ali Bux, who taught him formally, but from sitting in the Vishwanath temple at Varanasi for hours every day, listening to the rhythm of the priests' ringing bells, and trying to understand how a single repeated note could contain so much.\n\nThe tabla - the pair of small drums that accompany most Hindustani performances - has its own vast vocabulary. The drum is spoken before it is played. Every stroke has a syllable: dha, tin, ta, ki, te, dhin, na. A student learns to recite a long rhythmic composition (a peshkar or a kayda) in spoken syllables, fluently and at speed, before being allowed to play it. The point is that the rhythm must live in the throat before it can live in the fingers.\n\nI was taken, when I was about twenty-two, by a friend's grandfather, to an all-night Hindustani concert in Pune called the Sawai Gandharva Bhimsen Festival. We arrived at nine in the evening. The performance continued, with brief breaks for tea, until five thirty the next morning. I have never been so tired. I have also never been so attentive. The last performer, an old vocalist named Pandit Jasraj, sang a raga called Bhatiyar - a pre-dawn raga - as the first grey light came up over the cantonment in Pune, and the entire pandal of two thousand people, who had been awake all night, fell into a silence so complete that the only sound was the soft hiss of the kerosene lamps at the back of the hall. Then he reached a particular phrase and held a note for what felt like a minute. Somebody near me - an elderly woman, I think - sighed audibly, the way people sigh when they finally, after a long wait, hear the thing they have come to hear. That is what a raga is for." },
      { id: "folk", title: "Folk Music", blurb: "Songs sung while planting, walking, mourning, marrying.", minutes: 11, tag: "Music",
        body: "Indian folk music is the diary of the subcontinent. Every state, every district, often every caste community within a district, has its own repertoire of songs for the actual occasions of human life - for sowing the paddy, for walking to the well, for grinding the millet, for the bride leaving her father's house, for the corpse being carried to the cremation ground. The classical traditions are sung in concert halls. The folk traditions are sung at work and at home, by people who do not, mostly, think of themselves as musicians at all.\n\nThe Baul singers of West Bengal are perhaps the most internationally known of these folk traditions. The Bauls are a small, unorthodox spiritual community - neither fully Hindu nor fully Muslim, suspicious of both organised faiths - who wander the rural districts of Bengal and Bangladesh in saffron or patchwork robes, carrying a one-stringed instrument called the ektara and a small drum. Their songs are devotional but also philosophical and often gently mocking of religious authority. The most famous Baul of the twentieth century, Lalon Fakir, who lived to about a hundred and sixteen by traditional reckoning (more cautiously perhaps eighty-three), is credited with composing several hundred songs that are still sung at his shrine in Kushtia every year, in a fair where Bauls gather from across Bengal and sleep on the ground for three nights.\n\nIn Maharashtra, the lavani tradition is sung by women, usually in saris worn in the kasta style with the pleats tucked at the back, and accompanied by the dholki drum. Lavani is full-throated, frankly erotic, dramatically performed; it is the cousin of folk theatre, performed in tamasha companies that tour rural Maharashtra in the dry season. The legendary lavani composer Ram Joshi, in the early nineteenth century, was so good at writing the lyrics that a series of pesh-wai courtesans in Pune competed to perform his work first.\n\nIn Punjab, the women's wedding songs - called the suhag and the ghorian - form an entire parallel curriculum that no formal music institution has ever fully transcribed. A Punjabi grandmother, who cannot read a single line of musical notation, can sing thirty distinct songs across the various stages of a five-day wedding, in the right order, with the right calls and responses, and improvise the verses to include the names of the specific bride and groom and their parents and the specific village they come from. The songs are passed down between women, between generations, never written. When the grandmother dies, if her daughter has not learnt them, they are gone.\n\nIn Rajasthan, the Manganiyar and Langa communities - both hereditary Muslim musician castes who serve Hindu patron families - have, for centuries, performed at weddings, funerals, the birth of a son, the consecration of a new house. A Manganiyar singer in 2024 can recite, on request, the genealogy of his patron family back six or seven generations, in song, with the dates of significant marriages and the names of children who died young. He is, functionally, the family memory. When the patron family stops being able to support him - which has happened increasingly in the last fifty years - the genealogy starts to fade.\n\nIn Kashmir, the chakri - a form sung by groups of men sitting in a circle, accompanied by the rabab and the harmonium - carries the religious Sufi poetry of saints like Sheikh Noor-ud-din and Lalleshwari. Lalleshwari, called Lal Ded - 'Grandmother Lal' - was a fourteenth-century Kashmiri saint-poet whose vakhs, four-line verses in Old Kashmiri, are recited by both Hindu and Muslim Kashmiris and are considered the foundation of the modern Kashmiri language. She walked, by tradition, naked, and is supposed to have said, when challenged, that she only saw men, not human beings.\n\nThe danger to folk music is not, as is sometimes said, that it is being killed off by film music or by digital media. The danger is more specific. Folk music is tied to occasions - work, weddings, festivals, deaths. When the occasions themselves are mechanised or shortened or replaced (combine harvesters in the paddy fields, two-day weddings in banquet halls, professional priests at funerals), the songs simply lose their place to be sung. A song without an occasion is no longer a folk song. It becomes, at best, a museum object." },
      { id: "dance", title: "Dance Forms", blurb: "Bharatanatyam, Kathak, Odissi, Manipuri.", minutes: 13, tag: "Performance",
        body: "Indian classical dance is governed, in theory, by a single ancient text - the Natya Shastra, attributed to the sage Bharata, compiled probably between 200 BCE and 200 CE. It is a manual of theatre and dance. It contains, among many other things, a complete catalogue of one hundred and eight basic movement units (karanas), thirty-two minor movements (charis), a taxonomy of nine fundamental emotional states (the navarasas - wonder, love, mirth, sorrow, anger, fear, disgust, courage, peace), and a system of gestures of the hand (mudras or hastas) of which the standard count is around one hundred and eight when you include the variations.\n\nFrom this single textual root, by long regional divergence, several distinct classical dance traditions have grown. Bharatanatyam, originally from the temples of Tamil Nadu, performed by the devadasi community of temple dancers until the practice was outlawed in 1947 and the dance was revived in middle-class concert form by the dancer Rukmini Devi Arundale. Kathak, originally a Hindu temple narrative dance from north India, transformed under the Mughal courts into a fast-spinning, rhythmically dense form whose great twentieth-century master Pandit Birju Maharaj could, in his prime, complete one hundred and eight pirouettes without breaking the rhythm. Odissi, from the Jagannath temple at Puri in Odisha, with its characteristic tribhanga - the threefold bend of head, torso, and hip - which gives it a sculptural quality recognisable from any of the temple wall carvings at Konark. Manipuri, from the northeast, soft-footed, ankle-light, the women's costumes constructed around a wide cylindrical skirt that floats as they turn. Kuchipudi, from Andhra Pradesh, traditionally performed by Brahmin men in temple courtyards. Kathakali, from Kerala, with its towering green-faced masks of paint and rice paste, performed all night by oil lamp. Mohiniyattam, also from Kerala, the dance of the enchantress, slow and lateral, performed by women.\n\nWhat all these forms share is the conviction that the body is a complete vocabulary. There is no gesture too small to mean something. The neck has its own grammar (griva bhedas - twelve distinct movements). The eyes have nine standard expressions of emotion that must be practised in front of a mirror until they are fully separate from the face's other movements. A trained Bharatanatyam dancer can, in slow motion, look at an imaginary distant flower with one eye while looking at her beloved with the other. The hand alone - leaving the body aside - can communicate, by combination of position and movement, almost any noun or verb in Sanskrit literature: a deer, a temple, a river, the act of plucking a fruit, the act of welcoming a guest, the moon, the act of stringing a bow, the act of asking forgiveness.\n\nA full-length classical solo recital - a Bharatanatyam margam, for instance - runs for about two hours and follows a fixed structural sequence. It begins with an alarippu, a pure abstract movement piece that is essentially a warm-up, the dancer 'awakening' the body. It continues through pieces of increasing complexity and emotional content - jathiswaram, sabdam, varnam - to the central varnam, which is a forty-minute work of alternating pure dance and expressive narrative. It closes with a tillana, fast and joyful. The sequence is not casual. It is the temple ritual structure of approach, devotion, and farewell, performed by a single dancer in front of an audience that increasingly forgets it is an audience.\n\nI was taken once, in Chennai during the December music season, to a Bharatanatyam recital by an elderly dancer named Alarmel Valli. She was, at the time, in her sixties. The performance was in a small sabha hall, perhaps three hundred people, ordinary plastic chairs. She danced for ninety minutes without an apparent break. In the central varnam - a Tamil composition addressed to Krishna - she enacted the part of a heroine waiting for her divine beloved to appear. For one extended passage, she sat almost completely still, only her face moving, going through every state of waiting - hope, anxiety, tiredness, sudden joy at a misheard footstep, disappointment, resignation, renewed hope. There was no music for the last minute of this passage. Only her face. I do not know how a face can do that. I have not seen anything like it in any film, on any stage, in any other tradition. And then she stood up and resumed the dance and the whole thing dissolved into a torrent of rhythm so fast you could not follow it. Afterwards an old man near me wiped his eyes and said, in Tamil, to no one in particular, 'Such a small woman. Such a big country inside her.'" },
      { id: "theatre", title: "Theatre", blurb: "Kathakali masks, Yakshagana torches, Koodiyattam nights.", minutes: 12, tag: "Performance",
        body: "Koodiyattam, performed in the temple theatres of central Kerala, is the oldest continuously performed theatre tradition in the world. UNESCO recognised this formally in 2001, but the tradition itself had not waited for the recognition - it had been going on more or less without interruption for, by conservative estimates, over two thousand years. The performers belong almost exclusively to a single community, the Chakyars, who are temple-bound performers in a hereditary relationship with specific temples in the Trichur and Ernakulam districts. The drummers are Nambiar Brahmins. The female roles are performed by women of the Nangyar community. The whole tradition is, essentially, three families.\n\nA Koodiyattam performance can take a single Sanskrit verse - sometimes a single line - and stretch it across an entire night of performance. The full enactment of a play might take forty consecutive nights. The actor begins by gesturing through the verse word by word, then phrase by phrase, then taking each word and improvising on it in an elaborate mimetic mode called pakarnnattam - 'turning into' - in which the performer becomes, in sequence, every character mentioned in the verse, every situation evoked by the verse, every memory or allusion that the verse triggers. A single image in a Sanskrit poem - say, a hero looking at the moon - can be expanded by the actor into a forty-minute meditation in which he plays the hero, then the moon, then the hero's beloved who is also looking at the moon from a different city, then her maidservant who is bringing her water, then a courtier who reports the hero's distraction to the king, and so on. The audience, mostly elderly devotees who have known the plays since childhood, follows all of this without subtitles.\n\nKathakali, also from Kerala, is the more visually famous form. The make-up alone - applied over several hours before the performance, using rice paste, lime, and natural pigments - turns the actor into a fully iconographic figure. The pacha (green) face indicates a noble hero. The kathi (knife) face, green with red curls, indicates an arrogant but ultimately noble villain. The thaadi (beard) faces - black, red, or white - indicate progressively more demonic or animal characters. The female roles, the minukku, are performed almost entirely with minimal make-up but with the most subtle and demanding facial expression work in the entire tradition. The performances run all night in temple courtyards, lit traditionally by a single large oil lamp at the front of the stage. The audience sits on the ground. Sleep is permitted. The drumming, which is intense and unbroken, ensures that you wake up at the dramatic moments.\n\nYakshagana, in coastal Karnataka, is the rural cousin of Kathakali - louder, faster, with brighter costumes, performed in open paddy fields rather than temple courtyards, with torches and amplified harmoniums. The performers are usually farmers in the off-season. The plays are episodes from the Mahabharata and Ramayana. The crowds are huge - sometimes two or three thousand people sitting on the ground through the rain, in a field outside their village, watching Bhima kill Duryodhana in a torch-lit duel that lasts two hours and contains, by all accounts, a frankly excessive amount of stomping.\n\nIn Manipur, the Sankirtana traditions combine devotional singing, dance, and percussion in performances that can also run for an entire night, particularly during the Rasa Lila cycle - the dance of Krishna with the gopis - which has its own distinctive Manipuri choreography of large white skirts and very small ankle movements, the women's feet barely seeming to touch the ground.\n\nWhat all these traditions share is duration. They are not designed for a ninety-minute slot in a modern theatre. They are designed for an audience that is willing to sit, on the ground, in the same place, for six or eight or twelve hours, while a story is unfolded at its own pace. There is no fast-forward. The actor and the audience are agreeing to inhabit the same time together. This is, in 2025, a radical proposition. It is the reason the audiences are dwindling and the reason the artists are increasingly old and the reason that, where the tradition does survive, the surviving practitioners regard themselves as essentially priests of attention.\n\nI saw a Koodiyattam performance in 2018 at a small temple in Irinjalakuda, in central Kerala. There were perhaps thirty of us in the audience. The performer was an elderly Chakyar named Mani Madhava Chakyar's grand-nephew. He performed one verse for about ninety minutes. At the end he simply stood still for a moment, made a small gesture of farewell, and walked off the stage. The drummer continued for another half a minute and then also stopped. No one applauded. Applause, I was told later, would have been inappropriate. We simply sat for another minute, then quietly got up and walked out into the warm Kerala night, and a stray dog followed us most of the way back to the bus stand." },
      { id: "ritual", title: "Ritual Performances", blurb: "Theyyam, where the dancer becomes the god.", minutes: 12, tag: "Performance",
        body: "Theyyam is performed in the northern districts of Kerala - Kannur, Kasaragod, parts of Wayanad - between roughly October and May, in the courtyards of small village shrines called kavus, mostly attached to grove-temples that predate organised Hinduism in the region. There are over four hundred distinct theyyam forms, each representing a specific deity, ancestor, or local hero. Some forms are performed by only one family in the entire state. Some are performed only in one village. Some have not been performed for fifty years because the last carrier of the role died without a successor.\n\nThe performer - almost always from one of the traditionally marginalised communities, the Vannan, the Malayan, the Pulayan - undergoes a long preparation. The make-up alone takes between four and six hours. The face is painted in elaborate red and white patterns specific to the deity being embodied. The eyes are extended into long sweeping lines. A complex headdress is constructed on the performer's head, sometimes towering three metres above him, made of bamboo, palm fronds, painted cloth, and metal ornaments. The costume includes a thick skirt of palm leaves that fans out around the legs, a heavy chest plate, and dozens of small mirror pieces sewn onto the cloth so that as the performer moves, light fractures everywhere.\n\nAnd then - this is the part that everything else is preparation for - at a particular moment, often signalled by the lighting of a particular lamp or the playing of a particular drum rhythm, the performer is understood to no longer be himself. He is the deity. For the duration of the performance, which can last several hours and sometimes through the entire night, he is not playing the god. He is the god. The villagers approach him on their knees. They ask for blessings, for the curing of illnesses, for the resolution of family disputes. He speaks to them in the voice of the deity - sometimes in archaic Malayalam they do not fully understand. The drummers behind him do not stop.\n\nThis is the part that anthropologists find difficult to describe and that many Theyyam performers themselves describe in matter-of-fact terms. They say: when the make-up is on, when the drums begin, when the first lamp is lit, the god enters. They do not say it metaphorically. They do not say it modestly. They say it the way a competent professional describes a known phenomenon. When it is over, they sit down, the make-up is removed, and they go back to being themselves - usually a farmer or an agricultural labourer who, the next morning, will be back in the fields. The deity, they say, has gone home.\n\nWhat makes Theyyam socially extraordinary is the inversion of normal caste hierarchy. The performer is from a community that, in everyday life, would not be allowed to enter many of the very shrines whose deities he embodies during the performance. But once he is in the make-up, the Namboothiri Brahmins of the village will fold their hands and bow to him. He can scold them. He can demand things of them. He can, and sometimes does, criticise their behaviour in the village. They will accept this without protest, because they have not been spoken to by him but by the deity speaking through him. The next morning the social order is restored. Both sides know exactly what is happening. Both sides accept it. It is one of the more remarkable consensual rituals of social adjustment that human cultures have invented.\n\nI saw a Theyyam performance in 2019 in a small kavu outside Payyannur. The performer was a man named Raman, in his forties, who worked as a daily wage labourer. The deity he was embodying was Muthappan - a hunter-god, drinker of toddy, smoker of beedis, beloved across north Kerala for his almost human, fallible character. Muthappan, through Raman, came out of the shrine. He drank from a small clay pot of toddy. He lit a beedi. He spoke to the assembled villagers in a deep, slightly amused voice, calling some of them by name, asking after their children, making one of them - a young man in his twenties - laugh out loud at some private joke between them. Then he came over to where I was sitting at the back. He looked at me for a long moment. He said, in Malayalam, which my friend translated for me afterwards, 'You have come from far away. You will go even further. Do not forget to come back here once.' He touched my forehead. He moved on.\n\nI have not yet gone back. I intend to. It is a promise I made to a god through a labourer through a friend in a translation, and I do not, on reflection, take it any less seriously for that." },
    ],
  },
];

const SHELVES: Shelf[] = [...BASE_SHELVES, ...HERITAGE_SHELVES];

// Place label shown on cards in place of reading time. Built from each story's recorded region.
const BASE_LOCALITY: Record<string, string> = {
  "partition-letter": "Lahore, Punjab", "nanima-wedding": "Jaipur, Rajasthan", "sindh-migration": "Sindh & Bombay",
  "soldier-letter": "Assam & Arunachal Pradesh", "recipe-diary": "Thanjavur, Tamil Nadu", "kashmiri-houseboat": "Dal Lake, Kashmir",
  indus: "Indus Valley", gupta: "North India", mughal: "North India", persian: "North India", dialects: "Northeast India",
  temples: "South India", monasteries: "The Himalayas",
};
const LOCALITY: Record<string, string> = Object.fromEntries(
  LIBRARY_STORIES_META.map((m) => {
    const r = BASE_LOCALITY[m.id] ?? m.region ?? "";
    if (!r) return [m.id, ""];
    if (r === "Pan-India" || r === "Pan-Indian") return [m.id, "India"];
    return [m.id, `${r}, India`];
  }),
);
const localityOf = (id: string) => LOCALITY[id] ?? "";

/* ---------------- page ---------------- */

function LibraryPage() {
  const search = Route.useSearch();
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

  // Open a story when arriving with ?story=<id>
  useEffect(() => {
    const id = search.story;
    if (!id) return;
    const found = allStories.find((s) => s.id === id);
    if (found) {
      setActive(found);
      // Smooth scroll to top so the modal slide-in feels intentional.
      try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch {}
    }
  }, [search.story, allStories]);

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
              placeholder="Search the archive - civilizations, ragas, stepwells…"
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
                          <p className="truncate text-xs text-muted-foreground">{r.shelf}</p>
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
                <span />
                <span className="inline-flex items-center gap-1 text-foreground/80 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Shelves */}
      <section className="mx-auto max-w-6xl space-y-20 px-6 pb-20">
        {SHELVES.map((shelf, i) => (
          <Shelf key={shelf.id} shelf={shelf} index={i} onOpen={setActive} />
        ))}
      </section>

      {/* From Echoes - community-submitted archive (below the shelves) */}
      <EchoesFromCommunity />


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

      {/* The "shelf" - horizontal scroll on mobile, grid on desktop */}
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
        <span />
        <span className="inline-flex items-center gap-1 text-foreground/70 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100">
          Open <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </motion.button>
  );
}

/* ---------------- modal ---------------- */

function StoryModal({ story, onClose }: { story: Story | null; onClose: () => void }) {
  const fetchBody = useServerFn(getHeritageStoryBody);
  const needsBody = !!story && !story.body && !!story.source;
  const bodyQuery = useQuery({
    queryKey: ["heritage-story", story?.id],
    queryFn: () => fetchBody({ data: { id: story!.id } }),
    enabled: needsBody,
    staleTime: Infinity,
    retry: 1,
  });
  const bodyText = story?.body ?? (needsBody
    ? bodyQuery.data?.body ?? (bodyQuery.isError ? "This story could not be opened just now. Please try again in a moment." : "Opening the story from the archive…")
    : story?.blurb);
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
              <p className="whitespace-pre-line text-pretty text-base leading-relaxed text-foreground/90 sm:text-lg">
                {bodyText}
              </p>

              <div className="mt-10 flex items-center justify-between border-t border-[var(--glass-border)] pt-6 text-xs text-muted-foreground">
                <span />
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
              {data.map((p: any) => (
                <LibraryEchoCard key={p.id} post={p} />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}

function LibraryEchoCard({ post }: { post: any }) {
  const { user } = useAuth();
  const router = useRouter();
  const likeFn = useServerFn(toggleLike);
  const m = post.media_signed?.[0];
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState<number>(post.likes_count ?? 0);

  const like = useMutation({
    mutationFn: () => likeFn({ data: { postId: post.id } }),
    onMutate: () => {
      setLiked((v) => !v);
      setCount((c) => (liked ? Math.max(0, c - 1) : c + 1));
    },
    onError: () => {
      setLiked((v) => !v);
      setCount((c) => (liked ? c + 1 : Math.max(0, c - 1)));
      toast.error("Couldn't update like");
    },
  });

  const onLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.navigate({ to: "/auth", search: { mode: "signin" } });
      return;
    }
    like.mutate();
  };

  return (
    <Link
      to="/echoes/$postId"
      params={{ postId: post.id }}
      className="group relative aspect-square overflow-hidden rounded-2xl bg-black/30 ring-1 ring-[var(--glass-border)] transition hover:ring-[color:var(--accent)]/40"
    >
      {m?.url ? (
        m.type === "video" ? (
          <video src={m.url} className="h-full w-full object-cover" muted />
        ) : (
          <img src={m.url} alt={post.title ?? "Echo"} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
        )
      ) : (
        <div className="flex h-full w-full items-center justify-center p-4 text-center">
          <span className="font-display text-base leading-tight">{post.title ?? post.caption?.slice(0, 60) ?? "An echo"}</span>
        </div>
      )}
      <button
        type="button"
        onClick={onLike}
        aria-label={liked ? "Unlike" : "Like"}
        aria-pressed={liked}
        className={cn(
          "absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] text-white backdrop-blur transition hover:bg-black/75",
          liked && "text-rose-300"
        )}
      >
        <Heart className={cn("h-3.5 w-3.5", liked && "fill-rose-400 text-rose-400")} />
        <span className="tabular-nums">{count}</span>
      </button>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <p className="line-clamp-2 text-xs text-white">{post.title ?? post.caption ?? "Untitled"}</p>
        {post.category && <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-white/70">{post.category}</p>}
      </div>
    </Link>
  );
}


