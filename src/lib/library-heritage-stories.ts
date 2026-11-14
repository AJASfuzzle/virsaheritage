// Heritage story catalogue: documented myths, folk tales, oral traditions, histories,
// festivals and lives from across India. Full text is written on first open and
// stored so every reader sees the same version (see library-stories.functions.ts).

export type HeritageStory = { id: string; title: string; blurb: string; minutes: number; tag: string; region: string; language: string; source: string };
export type HeritageShelf = { id: string; name: string; whisper: string; stories: HeritageStory[] };

export const HERITAGE_SHELVES: HeritageShelf[] = [
 {
  "id": "heritage-myths",
  "name": "Myths & Legends",
  "whisper": "Gods, sages and the oldest stories India tells about itself.",
  "stories": [
   {
    "id": "hs-samudra-manthan",
    "title": "Samudra Manthan",
    "blurb": "The gods and demons churn the ocean of milk for amrit.",
    "minutes": 6,
    "tag": "Myth · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Bhagavata & Vishnu Purana"
   },
   {
    "id": "hs-the-descent-of-ganga",
    "title": "The Descent of Ganga",
    "blurb": "Bhagiratha's penance brings the river down through Shiva's hair.",
    "minutes": 6,
    "tag": "Myth · Uttarakhand · Sanskrit",
    "region": "Uttarakhand",
    "language": "Sanskrit",
    "source": "Ramayana, Bala Kanda"
   },
   {
    "id": "hs-savitri-and-satyavan",
    "title": "Savitri and Satyavan",
    "blurb": "A wife follows Yama himself to win back her husband's life.",
    "minutes": 6,
    "tag": "Myth · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Mahabharata, Vana Parva"
   },
   {
    "id": "hs-nachiketa-and-yama",
    "title": "Nachiketa and Yama",
    "blurb": "A boy waits three days at Death's door and asks what lies beyond.",
    "minutes": 6,
    "tag": "Myth · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Katha Upanishad"
   },
   {
    "id": "hs-dhruva-the-pole-star",
    "title": "Dhruva, the Pole Star",
    "blurb": "A rejected prince meditates until he becomes the fixed star.",
    "minutes": 6,
    "tag": "Myth · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Vishnu Purana"
   },
   {
    "id": "hs-prahlada-and-narasimha",
    "title": "Prahlada and Narasimha",
    "blurb": "Vishnu bursts from a pillar as half-man, half-lion.",
    "minutes": 6,
    "tag": "Myth · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Bhagavata Purana"
   },
   {
    "id": "hs-markandeya-and-the-noose-of-death",
    "title": "Markandeya and the Noose of Death",
    "blurb": "A boy clings to a linga as Yama casts his rope.",
    "minutes": 6,
    "tag": "Myth · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Markandeya Purana"
   },
   {
    "id": "hs-ganesha-and-the-race-around-the-world",
    "title": "Ganesha and the Race Around the World",
    "blurb": "The elephant-headed god circles his parents instead of the earth.",
    "minutes": 6,
    "tag": "Myth · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Puranic tradition"
   },
   {
    "id": "hs-how-ganesha-wrote-the-mahabharata",
    "title": "How Ganesha Wrote the Mahabharata",
    "blurb": "Vyasa dictates and Ganesha breaks his tusk to keep writing.",
    "minutes": 6,
    "tag": "Myth · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Mahabharata, Adi Parva"
   },
   {
    "id": "hs-shakuntala-and-the-lost-ring",
    "title": "Shakuntala and the Lost Ring",
    "blurb": "A forgotten bride, a swallowed ring, a king's remembering.",
    "minutes": 6,
    "tag": "Myth · Uttarakhand · Sanskrit",
    "region": "Uttarakhand",
    "language": "Sanskrit",
    "source": "Mahabharata & Kalidasa"
   },
   {
    "id": "hs-nala-and-damayanti",
    "title": "Nala and Damayanti",
    "blurb": "A king loses everything at dice and his queen finds him again.",
    "minutes": 6,
    "tag": "Myth · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Mahabharata, Vana Parva"
   },
   {
    "id": "hs-ekalavya-s-thumb",
    "title": "Ekalavya's Thumb",
    "blurb": "A forest archer pays his teacher the cruellest fee.",
    "minutes": 6,
    "tag": "Myth · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Mahabharata, Adi Parva"
   },
   {
    "id": "hs-karna-s-armour",
    "title": "Karna's Armour",
    "blurb": "The sun's son gives away the armour that kept him alive.",
    "minutes": 6,
    "tag": "Myth · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Mahabharata, Vana Parva"
   },
   {
    "id": "hs-the-yaksha-s-questions",
    "title": "The Yaksha's Questions",
    "blurb": "Yudhishthira answers riddles at a poisoned lake.",
    "minutes": 6,
    "tag": "Myth · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Mahabharata, Vana Parva"
   },
   {
    "id": "hs-ruru-and-pramadvara",
    "title": "Ruru and Pramadvara",
    "blurb": "A young sage gives half his life to revive his bride.",
    "minutes": 6,
    "tag": "Myth · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Mahabharata, Adi Parva"
   },
   {
    "id": "hs-urvashi-and-pururavas",
    "title": "Urvashi and Pururavas",
    "blurb": "A celestial nymph and a mortal king, and the condition that parted them.",
    "minutes": 6,
    "tag": "Myth · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Rigveda & Shatapatha Brahmana"
   },
   {
    "id": "hs-sati-and-daksha-s-sacrifice",
    "title": "Sati and Daksha's Sacrifice",
    "blurb": "A goddess's self-immolation and the birth of the Shakti Peethas.",
    "minutes": 6,
    "tag": "Myth · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Shiva & Devi Bhagavata Purana"
   },
   {
    "id": "hs-the-birth-of-kartikeya",
    "title": "The Birth of Kartikeya",
    "blurb": "The war god born of six mothers and a forest of reeds.",
    "minutes": 6,
    "tag": "Myth · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Kumarasambhava & Skanda Purana"
   },
   {
    "id": "hs-murugan-and-the-fruit-of-wisdom",
    "title": "Murugan and the Fruit of Wisdom",
    "blurb": "The quarrel that sent Murugan to the hill of Palani.",
    "minutes": 6,
    "tag": "Myth · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Tamil Murugan tradition"
   },
   {
    "id": "hs-meenakshi-s-wedding",
    "title": "Meenakshi's Wedding",
    "blurb": "The three-breasted warrior princess of Madurai marries Shiva.",
    "minutes": 6,
    "tag": "Myth · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Tiruvilaiyadal Puranam"
   },
   {
    "id": "hs-kannagi-and-the-anklet",
    "title": "Kannagi and the Anklet",
    "blurb": "A wronged wife burns the city of Madurai.",
    "minutes": 6,
    "tag": "Myth · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Silappatikaram"
   },
   {
    "id": "hs-manimekalai-s-begging-bowl",
    "title": "Manimekalai's Begging Bowl",
    "blurb": "A dancer's daughter renounces the world with a bowl that never empties.",
    "minutes": 6,
    "tag": "Myth · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Manimekalai"
   },
   {
    "id": "hs-parashurama-and-the-making-of-kerala",
    "title": "Parashurama and the Making of Kerala",
    "blurb": "The axe-bearing sage throws his axe and the sea retreats.",
    "minutes": 6,
    "tag": "Myth · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Keralolpathi"
   },
   {
    "id": "hs-mahabali-and-onam",
    "title": "Mahabali and Onam",
    "blurb": "The beloved asura king who returns once a year.",
    "minutes": 6,
    "tag": "Myth · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Bhagavata Purana & Kerala tradition"
   },
   {
    "id": "hs-the-story-of-guruvayur",
    "title": "The Story of Guruvayur",
    "blurb": "Guru and Vayu install Krishna's idol after a flood.",
    "minutes": 6,
    "tag": "Myth · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Guruvayur temple tradition"
   },
   {
    "id": "hs-ayyappa-son-of-two-gods",
    "title": "Ayyappa, Son of Two Gods",
    "blurb": "The forest-born prince who fought Mahishi and chose Sabarimala.",
    "minutes": 6,
    "tag": "Myth · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Bhuthanatha Upakhyanam"
   },
   {
    "id": "hs-jagannath-and-the-unfinished-idols",
    "title": "Jagannath and the Unfinished Idols",
    "blurb": "A carpenter's condition leaves the gods without hands.",
    "minutes": 6,
    "tag": "Myth · Odisha · Odia",
    "region": "Odisha",
    "language": "Odia",
    "source": "Skanda Purana, Purushottama Kshetra Mahatmya"
   },
   {
    "id": "hs-manasa-and-chand-sadagar",
    "title": "Manasa and Chand Sadagar",
    "blurb": "A merchant refuses to worship the snake goddess.",
    "minutes": 6,
    "tag": "Myth · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Manasamangal Kavya"
   },
   {
    "id": "hs-behula-and-lakhindar",
    "title": "Behula and Lakhindar",
    "blurb": "A widow sails her husband's body down the river to the gods.",
    "minutes": 6,
    "tag": "Myth · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Manasamangal Kavya"
   },
   {
    "id": "hs-chandi-and-kalketu",
    "title": "Chandi and Kalketu",
    "blurb": "The goddess makes a poor hunter a king.",
    "minutes": 6,
    "tag": "Myth · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Chandimangal of Mukundaram"
   },
   {
    "id": "hs-durga-and-mahishasura",
    "title": "Durga and Mahishasura",
    "blurb": "The goddess forged from the gods' combined fury.",
    "minutes": 6,
    "tag": "Myth · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Devi Mahatmya"
   },
   {
    "id": "hs-kamakhya-and-the-bleeding-goddess",
    "title": "Kamakhya and the Bleeding Goddess",
    "blurb": "Why a temple in Assam closes each June.",
    "minutes": 6,
    "tag": "Myth · Assam · Assamese",
    "region": "Assam",
    "language": "Assamese",
    "source": "Kalika Purana"
   },
   {
    "id": "hs-usha-and-aniruddha",
    "title": "Usha and Aniruddha",
    "blurb": "Banasura's daughter dreams of a prince and her friend paints him.",
    "minutes": 6,
    "tag": "Myth · Assam · Assamese",
    "region": "Assam",
    "language": "Assamese",
    "source": "Bhagavata Purana & Tezpur tradition"
   },
   {
    "id": "hs-hidimba-of-manali",
    "title": "Hidimba of Manali",
    "blurb": "The rakshasi who married Bhima and became a goddess.",
    "minutes": 6,
    "tag": "Myth · Himachal Pradesh · Pahari",
    "region": "Himachal Pradesh",
    "language": "Pahari",
    "source": "Mahabharata & Kullu tradition"
   },
   {
    "id": "hs-lord-kinnaur-kailash",
    "title": "Lord Kinnaur Kailash",
    "blurb": "The mountain Shiva of the Kinnauri people.",
    "minutes": 6,
    "tag": "Myth · Himachal Pradesh · Kinnauri",
    "region": "Himachal Pradesh",
    "language": "Kinnauri",
    "source": "Kinnaur oral tradition"
   },
   {
    "id": "hs-vaishno-devi-and-bhairon-nath",
    "title": "Vaishno Devi and Bhairon Nath",
    "blurb": "The goddess flees to a cave and beheads her pursuer.",
    "minutes": 6,
    "tag": "Myth · Jammu · Dogri",
    "region": "Jammu",
    "language": "Dogri",
    "source": "Vaishno Devi shrine tradition"
   },
   {
    "id": "hs-amarnath-and-the-secret-of-immortality",
    "title": "Amarnath and the Secret of Immortality",
    "blurb": "Shiva tells Parvati the secret in an ice cave; two pigeons overhear.",
    "minutes": 6,
    "tag": "Myth · Kashmir · Kashmiri",
    "region": "Kashmir",
    "language": "Kashmiri",
    "source": "Amarnath Mahatmya"
   },
   {
    "id": "hs-nilamata-and-the-draining-of-satisar",
    "title": "Nilamata and the Draining of Satisar",
    "blurb": "How the lake became the Kashmir valley.",
    "minutes": 6,
    "tag": "Myth · Kashmir · Kashmiri",
    "region": "Kashmir",
    "language": "Kashmiri",
    "source": "Nilamata Purana"
   },
   {
    "id": "hs-gogaji-the-snake-god",
    "title": "Gogaji, the Snake God",
    "blurb": "The Rajput warrior worshipped by Hindus and Muslims alike.",
    "minutes": 6,
    "tag": "Myth · Rajasthan · Rajasthani",
    "region": "Rajasthan",
    "language": "Rajasthani",
    "source": "Goga Medi oral tradition"
   },
   {
    "id": "hs-karni-mata-and-the-rats-of-deshnoke",
    "title": "Karni Mata and the Rats of Deshnoke",
    "blurb": "A mystic woman bargains with Yama for her clan's souls.",
    "minutes": 6,
    "tag": "Myth · Rajasthan · Rajasthani",
    "region": "Rajasthan",
    "language": "Rajasthani",
    "source": "Charan oral tradition"
   },
   {
    "id": "hs-vitthala-waiting-on-a-brick",
    "title": "Vitthala Waiting on a Brick",
    "blurb": "Krishna stands on a brick in Pandharpur because a son was busy serving his parents.",
    "minutes": 6,
    "tag": "Myth · Maharashtra · Marathi",
    "region": "Maharashtra",
    "language": "Marathi",
    "source": "Pundalik legend, Varkari tradition"
   },
   {
    "id": "hs-khandoba-and-mhalsa",
    "title": "Khandoba and Mhalsa",
    "blurb": "The horseman god of the Deccan and his two wives.",
    "minutes": 6,
    "tag": "Myth · Maharashtra · Marathi",
    "region": "Maharashtra",
    "language": "Marathi",
    "source": "Malhari Mahatmya"
   },
   {
    "id": "hs-renuka-and-yellamma",
    "title": "Renuka and Yellamma",
    "blurb": "The mother whose head was cut off and restored.",
    "minutes": 6,
    "tag": "Myth · Karnataka · Kannada",
    "region": "Karnataka",
    "language": "Kannada",
    "source": "Yellamma tradition"
   },
   {
    "id": "hs-tirupati-and-the-debt-to-kubera",
    "title": "Tirupati and the Debt to Kubera",
    "blurb": "Why Venkateswara is still repaying a loan.",
    "minutes": 6,
    "tag": "Myth · Andhra Pradesh · Telugu",
    "region": "Andhra Pradesh",
    "language": "Telugu",
    "source": "Venkatachala Mahatmya"
   },
   {
    "id": "hs-srisailam-and-mallikarjuna",
    "title": "Srisailam and Mallikarjuna",
    "blurb": "Parvati's search for her angry son on a hill of jasmine.",
    "minutes": 6,
    "tag": "Myth · Andhra Pradesh · Telugu",
    "region": "Andhra Pradesh",
    "language": "Telugu",
    "source": "Srisaila Khanda"
   },
   {
    "id": "hs-ramappa-and-the-floating-bricks",
    "title": "Ramappa and the Floating Bricks",
    "blurb": "Kakatiya builders and a temple named for its sculptor.",
    "minutes": 6,
    "tag": "Myth · Telangana · Telugu",
    "region": "Telangana",
    "language": "Telugu",
    "source": "Kakatiya local tradition"
   },
   {
    "id": "hs-somnath-and-the-moon-s-curse",
    "title": "Somnath and the Moon's Curse",
    "blurb": "Chandra, cursed to wane, is restored by Shiva.",
    "minutes": 6,
    "tag": "Myth · Gujarat · Gujarati",
    "region": "Gujarat",
    "language": "Gujarati",
    "source": "Skanda Purana, Prabhasa Khanda"
   },
   {
    "id": "hs-dwarka-under-the-sea",
    "title": "Dwarka Under the Sea",
    "blurb": "Krishna's city taken back by the ocean.",
    "minutes": 6,
    "tag": "Myth · Gujarat · Gujarati",
    "region": "Gujarat",
    "language": "Gujarati",
    "source": "Mahabharata, Mausala Parva"
   },
   {
    "id": "hs-lord-shiva-s-wedding-procession",
    "title": "Lord Shiva's Wedding Procession",
    "blurb": "The ghouls and ganas who came to Parvati's door.",
    "minutes": 6,
    "tag": "Myth · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Shiva Purana"
   },
   {
    "id": "hs-rishyasringa-and-the-rain",
    "title": "Rishyasringa and the Rain",
    "blurb": "A sage who had never seen a woman brings rain to a dry kingdom.",
    "minutes": 6,
    "tag": "Myth · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Ramayana & Mahabharata"
   }
  ]
 },
 {
  "id": "heritage-folk",
  "name": "Folk Tales",
  "whisper": "Stories told at bedtime, at weddings and around the hearth.",
  "stories": [
   {
    "id": "hs-birbal-s-khichdi",
    "title": "Birbal's Khichdi",
    "blurb": "How Birbal proved a man could not be warmed by a distant lamp.",
    "minutes": 6,
    "tag": "Folk Tale · Uttar Pradesh · Hindi",
    "region": "Uttar Pradesh",
    "language": "Hindi",
    "source": "Akbar-Birbal tradition"
   },
   {
    "id": "hs-birbal-and-the-crows-of-agra",
    "title": "Birbal and the Crows of Agra",
    "blurb": "Counting every crow in the city in one clever answer.",
    "minutes": 6,
    "tag": "Folk Tale · Uttar Pradesh · Hindi",
    "region": "Uttar Pradesh",
    "language": "Hindi",
    "source": "Akbar-Birbal tradition"
   },
   {
    "id": "hs-tenali-raman-and-the-cats",
    "title": "Tenali Raman and the Cats",
    "blurb": "The court jester raises a cat that refuses milk.",
    "minutes": 6,
    "tag": "Folk Tale · Andhra Pradesh · Telugu",
    "region": "Andhra Pradesh",
    "language": "Telugu",
    "source": "Tenali Ramakrishna tradition"
   },
   {
    "id": "hs-tenali-raman-and-the-thieves",
    "title": "Tenali Raman and the Thieves",
    "blurb": "Watering the garden by tricking burglars.",
    "minutes": 6,
    "tag": "Folk Tale · Andhra Pradesh · Telugu",
    "region": "Andhra Pradesh",
    "language": "Telugu",
    "source": "Tenali Ramakrishna tradition"
   },
   {
    "id": "hs-gopal-bhar-and-the-raja",
    "title": "Gopal Bhar and the Raja",
    "blurb": "The barber-wit of Krishnanagar outsmarts his king.",
    "minutes": 6,
    "tag": "Folk Tale · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Gopal Bhar tradition"
   },
   {
    "id": "hs-mulla-nasruddin-in-the-bazaar",
    "title": "Mulla Nasruddin in the Bazaar",
    "blurb": "The wise fool turns up in Indian markets too.",
    "minutes": 6,
    "tag": "Folk Tale · Pan-Indian · Urdu",
    "region": "Pan-Indian",
    "language": "Urdu",
    "source": "Nasruddin tradition in India"
   },
   {
    "id": "hs-sheikh-chilli-s-dream",
    "title": "Sheikh Chilli's Dream",
    "blurb": "A pot of milk, a dream of riches, and a broken pot.",
    "minutes": 6,
    "tag": "Folk Tale · Haryana · Haryanvi",
    "region": "Haryana",
    "language": "Haryanvi",
    "source": "Sheikh Chilli tradition"
   },
   {
    "id": "hs-the-brahmin-and-the-mongoose",
    "title": "The Brahmin and the Mongoose",
    "blurb": "A loyal pet killed in haste.",
    "minutes": 6,
    "tag": "Folk Tale · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Panchatantra"
   },
   {
    "id": "hs-the-monkey-and-the-crocodile",
    "title": "The Monkey and the Crocodile",
    "blurb": "A monkey who left his heart in the tree.",
    "minutes": 6,
    "tag": "Folk Tale · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Panchatantra"
   },
   {
    "id": "hs-the-lion-and-the-hare",
    "title": "The Lion and the Hare",
    "blurb": "A small hare leads a tyrant lion to a well.",
    "minutes": 6,
    "tag": "Folk Tale · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Panchatantra"
   },
   {
    "id": "hs-the-tortoise-and-the-geese",
    "title": "The Tortoise and the Geese",
    "blurb": "A talkative tortoise who could not keep his mouth shut.",
    "minutes": 6,
    "tag": "Folk Tale · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Panchatantra"
   },
   {
    "id": "hs-the-blue-jackal",
    "title": "The Blue Jackal",
    "blurb": "A jackal falls into dye and declares himself king.",
    "minutes": 6,
    "tag": "Folk Tale · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Panchatantra"
   },
   {
    "id": "hs-the-four-learned-fools",
    "title": "The Four Learned Fools",
    "blurb": "Scholars who revived a lion.",
    "minutes": 6,
    "tag": "Folk Tale · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Panchatantra"
   },
   {
    "id": "hs-the-mice-that-freed-the-elephants",
    "title": "The Mice That Freed the Elephants",
    "blurb": "A promise kept by the smallest creatures.",
    "minutes": 6,
    "tag": "Folk Tale · Pan-Indian · Sanskrit",
    "region": "Pan-Indian",
    "language": "Sanskrit",
    "source": "Panchatantra"
   },
   {
    "id": "hs-the-golden-swan",
    "title": "The Golden Swan",
    "blurb": "A swan who gave a feather a day to a poor family.",
    "minutes": 6,
    "tag": "Folk Tale · Pan-Indian · Pali",
    "region": "Pan-Indian",
    "language": "Pali",
    "source": "Jataka Tales"
   },
   {
    "id": "hs-the-monkey-king-s-bridge",
    "title": "The Monkey King's Bridge",
    "blurb": "A monkey king makes his body a bridge for his troop.",
    "minutes": 6,
    "tag": "Folk Tale · Pan-Indian · Pali",
    "region": "Pan-Indian",
    "language": "Pali",
    "source": "Mahakapi Jataka"
   },
   {
    "id": "hs-the-hare-in-the-moon",
    "title": "The Hare in the Moon",
    "blurb": "A hare offers itself as food to a hungry traveller.",
    "minutes": 6,
    "tag": "Folk Tale · Pan-Indian · Pali",
    "region": "Pan-Indian",
    "language": "Pali",
    "source": "Sasa Jataka"
   },
   {
    "id": "hs-vikram-and-the-vetala",
    "title": "Vikram and the Vetala",
    "blurb": "A king carries a corpse that tells him riddles.",
    "minutes": 6,
    "tag": "Folk Tale · Madhya Pradesh · Sanskrit",
    "region": "Madhya Pradesh",
    "language": "Sanskrit",
    "source": "Vetala Panchavimshati"
   },
   {
    "id": "hs-simhasana-dvatrimsika",
    "title": "Simhasana Dvatrimsika",
    "blurb": "Thirty-two statues on a throne each tell a tale of Vikramaditya.",
    "minutes": 6,
    "tag": "Folk Tale · Madhya Pradesh · Sanskrit",
    "region": "Madhya Pradesh",
    "language": "Sanskrit",
    "source": "Simhasana Dvatrimsika"
   },
   {
    "id": "hs-tales-from-the-kathasaritsagara-upakosa",
    "title": "Tales from the Kathasaritsagara: Upakosa",
    "blurb": "A clever wife traps four suitors in chests.",
    "minutes": 6,
    "tag": "Folk Tale · Kashmir · Sanskrit",
    "region": "Kashmir",
    "language": "Sanskrit",
    "source": "Kathasaritsagara of Somadeva"
   },
   {
    "id": "hs-thakurmar-jhuli-lalkamal-and-neelkamal",
    "title": "Thakurmar Jhuli: Lalkamal and Neelkamal",
    "blurb": "Two brothers who fight rakshasas.",
    "minutes": 6,
    "tag": "Folk Tale · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Thakurmar Jhuli (Dakshinaranjan Mitra Majumdar)"
   },
   {
    "id": "hs-thakurmar-jhuli-the-seven-champa-brothers",
    "title": "Thakurmar Jhuli: The Seven Champa Brothers",
    "blurb": "Seven brothers turned into champa flowers.",
    "minutes": 6,
    "tag": "Folk Tale · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Thakurmar Jhuli"
   },
   {
    "id": "hs-byangoma-and-byangomi",
    "title": "Byangoma and Byangomi",
    "blurb": "The prophetic birds of Bengali folklore.",
    "minutes": 6,
    "tag": "Folk Tale · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Bengali folk tradition"
   },
   {
    "id": "hs-tuntuni-and-the-king",
    "title": "Tuntuni and the King",
    "blurb": "A tailorbird who outwits a greedy king.",
    "minutes": 6,
    "tag": "Folk Tale · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Tuntuni Boi (Upendrakishore Ray Chowdhury)"
   },
   {
    "id": "hs-burhi-aair-sadhu-tejimola",
    "title": "Burhi Aair Sadhu: Tejimola",
    "blurb": "A girl killed by her stepmother who returns as a plant.",
    "minutes": 6,
    "tag": "Folk Tale · Assam · Assamese",
    "region": "Assam",
    "language": "Assamese",
    "source": "Burhi Aair Sadhu (Lakshminath Bezbaroa)"
   },
   {
    "id": "hs-burhi-aair-sadhu-champavati",
    "title": "Burhi Aair Sadhu: Champavati",
    "blurb": "A girl married to a python.",
    "minutes": 6,
    "tag": "Folk Tale · Assam · Assamese",
    "region": "Assam",
    "language": "Assamese",
    "source": "Burhi Aair Sadhu"
   },
   {
    "id": "hs-kanchanmala-and-kankanmala",
    "title": "Kanchanmala and Kankanmala",
    "blurb": "A queen and a maid who switched places.",
    "minutes": 6,
    "tag": "Folk Tale · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Thakurmar Jhuli"
   },
   {
    "id": "hs-the-sparrow-and-the-crow",
    "title": "The Sparrow and the Crow",
    "blurb": "The crow's house of dung and the sparrow's house of wax.",
    "minutes": 6,
    "tag": "Folk Tale · Pan-Indian · Hindi",
    "region": "Pan-Indian",
    "language": "Hindi",
    "source": "North Indian nursery tradition"
   },
   {
    "id": "hs-ek-tha-raja-the-clever-daughter-in-law",
    "title": "Ek Tha Raja: The Clever Daughter-in-Law",
    "blurb": "A bride's riddles save a family.",
    "minutes": 6,
    "tag": "Folk Tale · Rajasthan · Rajasthani",
    "region": "Rajasthan",
    "language": "Rajasthani",
    "source": "Vijaydan Detha, Baatan ri Phulwari"
   },
   {
    "id": "hs-duvidha",
    "title": "Duvidha",
    "blurb": "A ghost takes a merchant's form while he is away.",
    "minutes": 6,
    "tag": "Folk Tale · Rajasthan · Rajasthani",
    "region": "Rajasthan",
    "language": "Rajasthani",
    "source": "Vijaydan Detha, Baatan ri Phulwari"
   },
   {
    "id": "hs-dhola-and-maru",
    "title": "Dhola and Maru",
    "blurb": "A camel ride across the desert to reclaim a childhood bride.",
    "minutes": 6,
    "tag": "Folk Tale · Rajasthan · Rajasthani",
    "region": "Rajasthan",
    "language": "Rajasthani",
    "source": "Dhola Maru ra Duha"
   },
   {
    "id": "hs-moomal-and-mahendra",
    "title": "Moomal and Mahendra",
    "blurb": "The lovers of Lodurva and a misread shadow.",
    "minutes": 6,
    "tag": "Folk Tale · Rajasthan · Rajasthani",
    "region": "Rajasthan",
    "language": "Rajasthani",
    "source": "Sindhi-Rajasthani folk tradition"
   },
   {
    "id": "hs-heer-and-ranjha",
    "title": "Heer and Ranjha",
    "blurb": "The flute player and the Jhang beauty, as Waris Shah told it.",
    "minutes": 6,
    "tag": "Folk Tale · Punjab · Punjabi",
    "region": "Punjab",
    "language": "Punjabi",
    "source": "Waris Shah, Heer"
   },
   {
    "id": "hs-sohni-and-mahiwal",
    "title": "Sohni and Mahiwal",
    "blurb": "Crossing the Chenab on a clay pot.",
    "minutes": 6,
    "tag": "Folk Tale · Punjab · Punjabi",
    "region": "Punjab",
    "language": "Punjabi",
    "source": "Punjabi qissa tradition"
   },
   {
    "id": "hs-mirza-and-sahiban",
    "title": "Mirza and Sahiban",
    "blurb": "Why Sahiban broke her lover's arrows.",
    "minutes": 6,
    "tag": "Folk Tale · Punjab · Punjabi",
    "region": "Punjab",
    "language": "Punjabi",
    "source": "Peelu's qissa"
   },
   {
    "id": "hs-puran-bhagat",
    "title": "Puran Bhagat",
    "blurb": "A prince wronged by his stepmother becomes a saint.",
    "minutes": 6,
    "tag": "Folk Tale · Punjab · Punjabi",
    "region": "Punjab",
    "language": "Punjabi",
    "source": "Qadir Yar's qissa"
   },
   {
    "id": "hs-sassi-and-punnu",
    "title": "Sassi and Punnu",
    "blurb": "A washerman's daughter chases her lover into the desert.",
    "minutes": 6,
    "tag": "Folk Tale · Gujarat · Sindhi",
    "region": "Gujarat",
    "language": "Sindhi",
    "source": "Shah Abdul Latif, Shah Jo Risalo"
   },
   {
    "id": "hs-laila-majnu-in-indian-retelling",
    "title": "Laila Majnu in Indian Retelling",
    "blurb": "The Persian lovers as sung in Kashmir and Punjab.",
    "minutes": 6,
    "tag": "Folk Tale · Kashmir · Kashmiri",
    "region": "Kashmir",
    "language": "Kashmiri",
    "source": "Kashmiri masnavi tradition"
   },
   {
    "id": "hs-habba-khatoon-s-songs",
    "title": "Habba Khatoon's Songs",
    "blurb": "The peasant girl who became a queen and lost her king.",
    "minutes": 6,
    "tag": "Folk Tale · Kashmir · Kashmiri",
    "region": "Kashmir",
    "language": "Kashmiri",
    "source": "Kashmiri oral history"
   },
   {
    "id": "hs-akka-mahadevi-s-search",
    "title": "Akka Mahadevi's Search",
    "blurb": "A woman walks away clothed only in her hair to seek Shiva.",
    "minutes": 6,
    "tag": "Folk Tale · Karnataka · Kannada",
    "region": "Karnataka",
    "language": "Kannada",
    "source": "Vachana tradition"
   },
   {
    "id": "hs-punyakoti-the-cow",
    "title": "Punyakoti the Cow",
    "blurb": "A cow who keeps her promise to a tiger.",
    "minutes": 6,
    "tag": "Folk Tale · Karnataka · Kannada",
    "region": "Karnataka",
    "language": "Kannada",
    "source": "Govina Haadu"
   },
   {
    "id": "hs-kittur-folk-the-story-of-sangolli-rayanna",
    "title": "Kittur Folk: The Story of Sangolli Rayanna",
    "blurb": "Folk ballads of a rebel hanged by the British.",
    "minutes": 6,
    "tag": "Folk Tale · Karnataka · Kannada",
    "region": "Karnataka",
    "language": "Kannada",
    "source": "Lavani & gee-gee pada tradition"
   },
   {
    "id": "hs-paramartha-guru-and-his-disciples",
    "title": "Paramartha Guru and His Disciples",
    "blurb": "Tamil tales of a foolish guru by a Jesuit missionary.",
    "minutes": 6,
    "tag": "Folk Tale · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Constanzo Beschi, Paramartha Guru Kathai"
   },
   {
    "id": "hs-mariyadai-raman-s-judgements",
    "title": "Mariyadai Raman's Judgements",
    "blurb": "The Tamil judge whose verdicts became proverbs.",
    "minutes": 6,
    "tag": "Folk Tale · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Tamil folk tradition"
   },
   {
    "id": "hs-kathavarayan",
    "title": "Kathavarayan",
    "blurb": "The outcaste hero who loved a Brahmin girl.",
    "minutes": 6,
    "tag": "Folk Tale · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Tamil ballad tradition"
   },
   {
    "id": "hs-muthupattan",
    "title": "Muthupattan",
    "blurb": "A Brahmin who married two cobbler sisters.",
    "minutes": 6,
    "tag": "Folk Tale · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Tamil villuppattu tradition"
   },
   {
    "id": "hs-kayamkulam-kochunni",
    "title": "Kayamkulam Kochunni",
    "blurb": "The Robin Hood of Travancore.",
    "minutes": 6,
    "tag": "Folk Tale · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Kottarathil Sankunni, Aithihyamala"
   },
   {
    "id": "hs-kadamattathu-kathanar",
    "title": "Kadamattathu Kathanar",
    "blurb": "The priest-sorcerer who tamed yakshis.",
    "minutes": 6,
    "tag": "Folk Tale · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Aithihyamala"
   },
   {
    "id": "hs-parayi-petta-panthirukulam",
    "title": "Parayi Petta Panthirukulam",
    "blurb": "Twelve children of one Pariah mother, scattered across Kerala's castes.",
    "minutes": 6,
    "tag": "Folk Tale · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Aithihyamala"
   },
   {
    "id": "hs-naranathu-bhranthan",
    "title": "Naranathu Bhranthan",
    "blurb": "The madman who rolled a stone up a hill to watch it fall.",
    "minutes": 6,
    "tag": "Folk Tale · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Aithihyamala"
   },
   {
    "id": "hs-the-yakshi-of-kalliyankattu",
    "title": "The Yakshi of Kalliyankattu",
    "blurb": "The vengeful spirit chained to a temple.",
    "minutes": 6,
    "tag": "Folk Tale · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Aithihyamala"
   },
   {
    "id": "hs-chindi-the-shrew",
    "title": "Chindi the Shrew",
    "blurb": "Konkani folktale of a quarrelsome wife and a clever husband.",
    "minutes": 6,
    "tag": "Folk Tale · Goa · Konkani",
    "region": "Goa",
    "language": "Konkani",
    "source": "Goan folk tradition"
   },
   {
    "id": "hs-bonbibi-of-the-sundarbans",
    "title": "Bonbibi of the Sundarbans",
    "blurb": "A forest goddess protects honey gatherers from the tiger Dakshin Rai.",
    "minutes": 6,
    "tag": "Folk Tale · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Bonbibi Johuranama"
   },
   {
    "id": "hs-lilavati-s-pearl",
    "title": "Lilavati's Pearl",
    "blurb": "The mathematician's daughter and the water clock.",
    "minutes": 6,
    "tag": "Folk Tale · Karnataka · Sanskrit",
    "region": "Karnataka",
    "language": "Sanskrit",
    "source": "Bhaskaracharya tradition"
   }
  ]
 },
 {
  "id": "heritage-tribal",
  "name": "Tribal & Indigenous Narratives",
  "whisper": "Origin stories, ancestors and the land, as the first peoples tell them.",
  "stories": [
   {
    "id": "hs-santal-creation-pilchu-haram-and-pilchu-budhi",
    "title": "Santal Creation: Pilchu Haram and Pilchu Budhi",
    "blurb": "The first Santal couple born from swan eggs.",
    "minutes": 6,
    "tag": "Oral Tradition · Jharkhand · Santali",
    "region": "Jharkhand",
    "language": "Santali",
    "source": "Santal oral tradition (Binti)"
   },
   {
    "id": "hs-the-santal-hul",
    "title": "The Santal Hul",
    "blurb": "The 1855 rebellion of Sidhu and Kanhu Murmu.",
    "minutes": 6,
    "tag": "Oral Tradition · Jharkhand · Santali",
    "region": "Jharkhand",
    "language": "Santali",
    "source": "Santal Hul history"
   },
   {
    "id": "hs-birsa-munda-dharti-aba",
    "title": "Birsa Munda, Dharti Aba",
    "blurb": "The father of the earth and the Ulgulan.",
    "minutes": 6,
    "tag": "Oral Tradition · Jharkhand · Mundari",
    "region": "Jharkhand",
    "language": "Mundari",
    "source": "Munda history & songs"
   },
   {
    "id": "hs-sing-bonga-and-the-asurs",
    "title": "Sing Bonga and the Asurs",
    "blurb": "The sun god and the iron-smelting Asurs.",
    "minutes": 6,
    "tag": "Oral Tradition · Jharkhand · Mundari",
    "region": "Jharkhand",
    "language": "Mundari",
    "source": "Munda creation tradition"
   },
   {
    "id": "hs-the-asur-iron-smelters",
    "title": "The Asur Iron Smelters",
    "blurb": "The Asur people's own account of their furnaces.",
    "minutes": 6,
    "tag": "Oral Tradition · Jharkhand · Asuri",
    "region": "Jharkhand",
    "language": "Asuri",
    "source": "Asur oral history"
   },
   {
    "id": "hs-ho-creation-ote-boram-and-sage-sing-bonga",
    "title": "Ho Creation: Ote Boram and Sage Sing Bonga",
    "blurb": "How the Ho world was made.",
    "minutes": 6,
    "tag": "Oral Tradition · Jharkhand · Ho",
    "region": "Jharkhand",
    "language": "Ho",
    "source": "Ho oral tradition"
   },
   {
    "id": "hs-kurukh-origin-of-the-oraons",
    "title": "Kurukh Origin of the Oraons",
    "blurb": "Migration from the Rohtas hills.",
    "minutes": 6,
    "tag": "Oral Tradition · Jharkhand · Kurukh",
    "region": "Jharkhand",
    "language": "Kurukh",
    "source": "Oraon oral history"
   },
   {
    "id": "hs-gond-origin-lingo-pen",
    "title": "Gond Origin: Lingo Pen",
    "blurb": "The culture-hero who freed the Gond gods from a cave.",
    "minutes": 6,
    "tag": "Oral Tradition · Madhya Pradesh · Gondi",
    "region": "Madhya Pradesh",
    "language": "Gondi",
    "source": "Gond Pandwani & Lingo tradition"
   },
   {
    "id": "hs-pardhan-gond-painting-myths",
    "title": "Pardhan Gond Painting Myths",
    "blurb": "Why Gond artists paint the stories of Bara Dev.",
    "minutes": 6,
    "tag": "Oral Tradition · Madhya Pradesh · Gondi",
    "region": "Madhya Pradesh",
    "language": "Gondi",
    "source": "Pardhan Gond tradition"
   },
   {
    "id": "hs-baiga-and-the-first-plough",
    "title": "Baiga and the First Plough",
    "blurb": "Why the Baiga refused to wound the earth.",
    "minutes": 6,
    "tag": "Oral Tradition · Chhattisgarh · Baiga",
    "region": "Chhattisgarh",
    "language": "Baiga",
    "source": "Verrier Elwin, The Baiga"
   },
   {
    "id": "hs-bhil-origin-and-the-flood",
    "title": "Bhil Origin and the Flood",
    "blurb": "The Bhil story of the great deluge.",
    "minutes": 6,
    "tag": "Oral Tradition · Gujarat · Bhili",
    "region": "Gujarat",
    "language": "Bhili",
    "source": "Bhil Bharath oral epic"
   },
   {
    "id": "hs-bhil-bharath",
    "title": "Bhil Bharath",
    "blurb": "The Mahabharata as the Bhils sing it, with Draupadi at the centre.",
    "minutes": 6,
    "tag": "Oral Tradition · Gujarat · Bhili",
    "region": "Gujarat",
    "language": "Bhili",
    "source": "Bhil Bharath (Bhagwandas Patel)"
   },
   {
    "id": "hs-rathwa-pithora",
    "title": "Rathwa Pithora",
    "blurb": "Painting the horse-god on the house wall.",
    "minutes": 6,
    "tag": "Oral Tradition · Gujarat · Rathwi",
    "region": "Gujarat",
    "language": "Rathwi",
    "source": "Rathwa Pithora tradition"
   },
   {
    "id": "hs-warli-the-tarpa-dance",
    "title": "Warli: The Tarpa Dance",
    "blurb": "The circle of life painted around a flute player.",
    "minutes": 6,
    "tag": "Oral Tradition · Maharashtra · Warli",
    "region": "Maharashtra",
    "language": "Warli",
    "source": "Warli tradition"
   },
   {
    "id": "hs-korku-why-the-dead-are-remembered-on-wood",
    "title": "Korku: Why the Dead Are Remembered on Wood",
    "blurb": "The Korku memorial pillars.",
    "minutes": 6,
    "tag": "Oral Tradition · Madhya Pradesh · Korku",
    "region": "Madhya Pradesh",
    "language": "Korku",
    "source": "Korku tradition"
   },
   {
    "id": "hs-muria-ghotul",
    "title": "Muria Ghotul",
    "blurb": "The youth dormitory of Bastar.",
    "minutes": 6,
    "tag": "Oral Tradition · Chhattisgarh · Gondi",
    "region": "Chhattisgarh",
    "language": "Gondi",
    "source": "Verrier Elwin, The Muria and their Ghotul"
   },
   {
    "id": "hs-bastar-dussehra-and-danteshwari",
    "title": "Bastar Dussehra and Danteshwari",
    "blurb": "A 75-day festival that has nothing to do with Rama.",
    "minutes": 6,
    "tag": "Oral Tradition · Chhattisgarh · Halbi",
    "region": "Chhattisgarh",
    "language": "Halbi",
    "source": "Bastar Dussehra tradition"
   },
   {
    "id": "hs-toda-the-buffalo-and-the-sacred-dairy",
    "title": "Toda: The Buffalo and the Sacred Dairy",
    "blurb": "How the Toda world revolves around buffaloes.",
    "minutes": 6,
    "tag": "Oral Tradition · Tamil Nadu · Toda",
    "region": "Tamil Nadu",
    "language": "Toda",
    "source": "Toda oral tradition"
   },
   {
    "id": "hs-kurumba-honey-hunters",
    "title": "Kurumba Honey Hunters",
    "blurb": "The Nilgiri cliffs and the honey songs.",
    "minutes": 6,
    "tag": "Oral Tradition · Tamil Nadu · Kurumba",
    "region": "Tamil Nadu",
    "language": "Kurumba",
    "source": "Kurumba tradition"
   },
   {
    "id": "hs-irula-snake-catchers",
    "title": "Irula Snake Catchers",
    "blurb": "The knowledge passed from elders to children.",
    "minutes": 6,
    "tag": "Oral Tradition · Tamil Nadu · Irula",
    "region": "Tamil Nadu",
    "language": "Irula",
    "source": "Irula tradition"
   },
   {
    "id": "hs-kani-tribe-and-the-arogyapacha-plant",
    "title": "Kani Tribe and the Arogyapacha Plant",
    "blurb": "Forest knowledge that became a medicine.",
    "minutes": 6,
    "tag": "Oral Tradition · Kerala · Kani",
    "region": "Kerala",
    "language": "Kani",
    "source": "Kani tradition, Jeevani case"
   },
   {
    "id": "hs-paniya-and-the-slave-markets-of-wayanad",
    "title": "Paniya and the Slave Markets of Wayanad",
    "blurb": "The memory of Valliyoorkavu.",
    "minutes": 6,
    "tag": "Oral Tradition · Kerala · Paniya",
    "region": "Kerala",
    "language": "Paniya",
    "source": "Wayanad oral history"
   },
   {
    "id": "hs-soliga-and-the-tiger-hills",
    "title": "Soliga and the Tiger Hills",
    "blurb": "Living with the tiger in the BR Hills.",
    "minutes": 6,
    "tag": "Oral Tradition · Karnataka · Soliga",
    "region": "Karnataka",
    "language": "Soliga",
    "source": "Soliga tradition"
   },
   {
    "id": "hs-jenu-kuruba-honey-collectors",
    "title": "Jenu Kuruba Honey Collectors",
    "blurb": "Song and smoke in the Nagarahole forest.",
    "minutes": 6,
    "tag": "Oral Tradition · Karnataka · Jenu Kuruba",
    "region": "Karnataka",
    "language": "Jenu Kuruba",
    "source": "Jenu Kuruba tradition"
   },
   {
    "id": "hs-siddi-of-karnataka",
    "title": "Siddi of Karnataka",
    "blurb": "The African-descended people of the Western Ghats.",
    "minutes": 6,
    "tag": "Oral Tradition · Karnataka · Siddi",
    "region": "Karnataka",
    "language": "Siddi",
    "source": "Siddi oral history"
   },
   {
    "id": "hs-chenchu-and-lord-narasimha",
    "title": "Chenchu and Lord Narasimha",
    "blurb": "How a Chenchu girl married a god.",
    "minutes": 6,
    "tag": "Oral Tradition · Andhra Pradesh · Chenchu",
    "region": "Andhra Pradesh",
    "language": "Chenchu",
    "source": "Chenchu-Ahobilam tradition"
   },
   {
    "id": "hs-sammakka-and-saralamma",
    "title": "Sammakka and Saralamma",
    "blurb": "The Koya women who fought the Kakatiyas.",
    "minutes": 6,
    "tag": "Oral Tradition · Telangana · Koya",
    "region": "Telangana",
    "language": "Koya",
    "source": "Medaram Jatara tradition"
   },
   {
    "id": "hs-kondh-and-the-earth-goddess",
    "title": "Kondh and the Earth Goddess",
    "blurb": "Dharani Penu and the end of meriah sacrifice.",
    "minutes": 6,
    "tag": "Oral Tradition · Odisha · Kui",
    "region": "Odisha",
    "language": "Kui",
    "source": "Kondh tradition"
   },
   {
    "id": "hs-dongria-kondh-and-niyam-raja",
    "title": "Dongria Kondh and Niyam Raja",
    "blurb": "The mountain that is a king.",
    "minutes": 6,
    "tag": "Oral Tradition · Odisha · Kui",
    "region": "Odisha",
    "language": "Kui",
    "source": "Dongria Kondh tradition"
   },
   {
    "id": "hs-bonda-the-women-who-shaved-their-heads",
    "title": "Bonda: The Women Who Shaved Their Heads",
    "blurb": "Why Bonda women laughed at Sita.",
    "minutes": 6,
    "tag": "Oral Tradition · Odisha · Remo",
    "region": "Odisha",
    "language": "Remo",
    "source": "Bonda oral tradition"
   },
   {
    "id": "hs-saora-ikons",
    "title": "Saora Ikons",
    "blurb": "Wall paintings for the dead and the gods.",
    "minutes": 6,
    "tag": "Oral Tradition · Odisha · Sora",
    "region": "Odisha",
    "language": "Sora",
    "source": "Verrier Elwin, The Religion of an Indian Tribe"
   },
   {
    "id": "hs-juang-and-the-leaf-dress",
    "title": "Juang and the Leaf Dress",
    "blurb": "Why the Juang once wore leaves.",
    "minutes": 6,
    "tag": "Oral Tradition · Odisha · Juang",
    "region": "Odisha",
    "language": "Juang",
    "source": "Juang tradition"
   },
   {
    "id": "hs-khasi-the-golden-ladder",
    "title": "Khasi: The Golden Ladder",
    "blurb": "How heaven and earth were once connected.",
    "minutes": 6,
    "tag": "Oral Tradition · Meghalaya · Khasi",
    "region": "Meghalaya",
    "language": "Khasi",
    "source": "Khasi creation tradition (U Hynniew Trep)"
   },
   {
    "id": "hs-khasi-ka-likai-and-the-waterfall",
    "title": "Khasi: Ka Likai and the Waterfall",
    "blurb": "Nohkalikai Falls and a mother's grief.",
    "minutes": 6,
    "tag": "Oral Tradition · Meghalaya · Khasi",
    "region": "Meghalaya",
    "language": "Khasi",
    "source": "Khasi folk tradition"
   },
   {
    "id": "hs-khasi-u-thlen-the-serpent",
    "title": "Khasi: U Thlen, the Serpent",
    "blurb": "The man-eating snake and its keepers.",
    "minutes": 6,
    "tag": "Oral Tradition · Meghalaya · Khasi",
    "region": "Meghalaya",
    "language": "Khasi",
    "source": "Khasi folk tradition"
   },
   {
    "id": "hs-garo-saljong-and-the-wangala",
    "title": "Garo: Saljong and the Wangala",
    "blurb": "Thanking the sun god at harvest.",
    "minutes": 6,
    "tag": "Oral Tradition · Meghalaya · Garo",
    "region": "Meghalaya",
    "language": "Garo",
    "source": "Garo Wangala tradition"
   },
   {
    "id": "hs-garo-why-garos-have-no-script",
    "title": "Garo: Why Garos Have No Script",
    "blurb": "The lost script eaten by a dog.",
    "minutes": 6,
    "tag": "Oral Tradition · Meghalaya · Garo",
    "region": "Meghalaya",
    "language": "Garo",
    "source": "Garo oral tradition"
   },
   {
    "id": "hs-mizo-chhurbura",
    "title": "Mizo: Chhurbura",
    "blurb": "The trickster of the Mizo hills.",
    "minutes": 6,
    "tag": "Oral Tradition · Mizoram · Mizo",
    "region": "Mizoram",
    "language": "Mizo",
    "source": "Mizo folk tradition"
   },
   {
    "id": "hs-mizo-chawngmawii-and-the-lake",
    "title": "Mizo: Chawngmawii and the Lake",
    "blurb": "A girl stolen by a water spirit.",
    "minutes": 6,
    "tag": "Oral Tradition · Mizoram · Mizo",
    "region": "Mizoram",
    "language": "Mizo",
    "source": "Mizo folk tradition"
   },
   {
    "id": "hs-mizo-tlingi-and-ngama",
    "title": "Mizo: Tlingi and Ngama",
    "blurb": "The lovers of Mizo legend.",
    "minutes": 6,
    "tag": "Oral Tradition · Mizoram · Mizo",
    "region": "Mizoram",
    "language": "Mizo",
    "source": "Mizo folk tradition"
   },
   {
    "id": "hs-naga-the-sky-people-and-the-hornbill",
    "title": "Naga: The Sky People and the Hornbill",
    "blurb": "Why the hornbill feather is sacred.",
    "minutes": 6,
    "tag": "Oral Tradition · Nagaland · Ao",
    "region": "Nagaland",
    "language": "Ao",
    "source": "Ao Naga tradition"
   },
   {
    "id": "hs-ao-longterok-the-six-stones",
    "title": "Ao: Longterok, the Six Stones",
    "blurb": "The Ao ancestors emerged from stones.",
    "minutes": 6,
    "tag": "Oral Tradition · Nagaland · Ao",
    "region": "Nagaland",
    "language": "Ao",
    "source": "Ao Naga origin tradition"
   },
   {
    "id": "hs-angami-man-tiger-and-spirit",
    "title": "Angami: Man, Tiger and Spirit",
    "blurb": "Three brothers from one mother.",
    "minutes": 6,
    "tag": "Oral Tradition · Nagaland · Angami",
    "region": "Nagaland",
    "language": "Angami",
    "source": "Angami origin tradition"
   },
   {
    "id": "hs-konyak-headhunters-memory",
    "title": "Konyak Headhunters' Memory",
    "blurb": "The morung and the last tattooed warriors.",
    "minutes": 6,
    "tag": "Oral Tradition · Nagaland · Konyak",
    "region": "Nagaland",
    "language": "Konyak",
    "source": "Konyak oral history"
   },
   {
    "id": "hs-apatani-abotani-the-first-man",
    "title": "Apatani: Abotani, the First Man",
    "blurb": "Ancestor of the Tani tribes.",
    "minutes": 6,
    "tag": "Oral Tradition · Arunachal Pradesh · Apatani",
    "region": "Arunachal Pradesh",
    "language": "Apatani",
    "source": "Tani oral tradition"
   },
   {
    "id": "hs-adi-donyi-polo",
    "title": "Adi: Donyi-Polo",
    "blurb": "Sun and Moon as the eyes of god.",
    "minutes": 6,
    "tag": "Oral Tradition · Arunachal Pradesh · Adi",
    "region": "Arunachal Pradesh",
    "language": "Adi",
    "source": "Donyi-Polo tradition"
   },
   {
    "id": "hs-mishmi-the-man-who-married-a-tiger-s-sister",
    "title": "Mishmi: The Man Who Married a Tiger's Sister",
    "blurb": "Kinship between Idu Mishmi and tigers.",
    "minutes": 6,
    "tag": "Oral Tradition · Arunachal Pradesh · Idu Mishmi",
    "region": "Arunachal Pradesh",
    "language": "Idu Mishmi",
    "source": "Idu Mishmi tradition"
   },
   {
    "id": "hs-monpa-the-yak-and-the-yeti",
    "title": "Monpa: The Yak and the Yeti",
    "blurb": "Highland stories of Tawang.",
    "minutes": 6,
    "tag": "Oral Tradition · Arunachal Pradesh · Monpa",
    "region": "Arunachal Pradesh",
    "language": "Monpa",
    "source": "Monpa tradition"
   },
   {
    "id": "hs-lepcha-mayel-lyang-the-hidden-land",
    "title": "Lepcha: Mayel Lyang, the Hidden Land",
    "blurb": "The paradise below Kanchenjunga.",
    "minutes": 6,
    "tag": "Oral Tradition · Sikkim · Lepcha",
    "region": "Sikkim",
    "language": "Lepcha",
    "source": "Lepcha tradition"
   },
   {
    "id": "hs-lepcha-the-tower-to-heaven",
    "title": "Lepcha: The Tower to Heaven",
    "blurb": "Building a tower of clay pots to reach the sky.",
    "minutes": 6,
    "tag": "Oral Tradition · Sikkim · Lepcha",
    "region": "Sikkim",
    "language": "Lepcha",
    "source": "Lepcha tradition"
   },
   {
    "id": "hs-bhutia-guru-rinpoche-s-hidden-valleys",
    "title": "Bhutia: Guru Rinpoche's Hidden Valleys",
    "blurb": "The beyuls of Sikkim.",
    "minutes": 6,
    "tag": "Oral Tradition · Sikkim · Bhutia",
    "region": "Sikkim",
    "language": "Bhutia",
    "source": "Nyingma terma tradition"
   },
   {
    "id": "hs-mising-abotani-and-the-river",
    "title": "Mising: Abotani and the River",
    "blurb": "River people of the Brahmaputra.",
    "minutes": 6,
    "tag": "Oral Tradition · Assam · Mising",
    "region": "Assam",
    "language": "Mising",
    "source": "Mising tradition"
   },
   {
    "id": "hs-bodo-bathou-and-the-siju-plant",
    "title": "Bodo: Bathou and the Siju Plant",
    "blurb": "The Bodo god of five elements.",
    "minutes": 6,
    "tag": "Oral Tradition · Assam · Bodo",
    "region": "Assam",
    "language": "Bodo",
    "source": "Bathou tradition"
   },
   {
    "id": "hs-karbi-sabin-alun",
    "title": "Karbi: Sabin Alun",
    "blurb": "The Karbi Ramayana.",
    "minutes": 6,
    "tag": "Oral Tradition · Assam · Karbi",
    "region": "Assam",
    "language": "Karbi",
    "source": "Karbi oral epic"
   },
   {
    "id": "hs-dimasa-kachari-kings-of-dimapur",
    "title": "Dimasa: Kachari Kings of Dimapur",
    "blurb": "The forgotten kingdom and its pillars.",
    "minutes": 6,
    "tag": "Oral Tradition · Assam · Dimasa",
    "region": "Assam",
    "language": "Dimasa",
    "source": "Dimasa oral history"
   },
   {
    "id": "hs-tripuri-the-fourteen-gods",
    "title": "Tripuri: The Fourteen Gods",
    "blurb": "Kharchi Puja and the Tripuri pantheon.",
    "minutes": 6,
    "tag": "Oral Tradition · Tripura · Kokborok",
    "region": "Tripura",
    "language": "Kokborok",
    "source": "Kharchi Puja tradition"
   },
   {
    "id": "hs-meitei-khamba-and-thoibi",
    "title": "Meitei: Khamba and Thoibi",
    "blurb": "The poor wrestler and the princess.",
    "minutes": 6,
    "tag": "Oral Tradition · Manipur · Meitei",
    "region": "Manipur",
    "language": "Meitei",
    "source": "Moirang Kangleirol"
   },
   {
    "id": "hs-meitei-pakhangba-the-dragon-god",
    "title": "Meitei: Pakhangba, the Dragon God",
    "blurb": "The serpent ancestor of the Meitei kings.",
    "minutes": 6,
    "tag": "Oral Tradition · Manipur · Meitei",
    "region": "Manipur",
    "language": "Meitei",
    "source": "Meitei Sanamahi tradition"
   },
   {
    "id": "hs-tangkhul-shirui-lily",
    "title": "Tangkhul: Shirui Lily",
    "blurb": "The flower that grows on only one hill.",
    "minutes": 6,
    "tag": "Oral Tradition · Manipur · Tangkhul",
    "region": "Manipur",
    "language": "Tangkhul",
    "source": "Tangkhul tradition"
   },
   {
    "id": "hs-kuki-the-cave-of-chhinlung",
    "title": "Kuki: The Cave of Chhinlung",
    "blurb": "Where the Kuki-Chin peoples emerged.",
    "minutes": 6,
    "tag": "Oral Tradition · Manipur · Thadou",
    "region": "Manipur",
    "language": "Thadou",
    "source": "Chhinlung tradition"
   },
   {
    "id": "hs-great-andamanese-the-first-fire",
    "title": "Great Andamanese: The First Fire",
    "blurb": "How fire came to the islands.",
    "minutes": 6,
    "tag": "Oral Tradition · Andaman Islands · Great Andamanese",
    "region": "Andaman Islands",
    "language": "Great Andamanese",
    "source": "A.R. Radcliffe-Brown, The Andaman Islanders"
   },
   {
    "id": "hs-onge-the-spirit-of-the-turtle",
    "title": "Onge: The Spirit of the Turtle",
    "blurb": "Turtle hunting and the spirits of the sea.",
    "minutes": 6,
    "tag": "Oral Tradition · Andaman Islands · Onge",
    "region": "Andaman Islands",
    "language": "Onge",
    "source": "Onge tradition"
   },
   {
    "id": "hs-nicobarese-kanaha-and-the-pigs",
    "title": "Nicobarese: Kanaha and the Pigs",
    "blurb": "The Nicobarese view of spirits and feasts.",
    "minutes": 6,
    "tag": "Oral Tradition · Nicobar Islands · Nicobarese",
    "region": "Nicobar Islands",
    "language": "Nicobarese",
    "source": "Nicobarese tradition"
   },
   {
    "id": "hs-ladakhi-king-gesar",
    "title": "Ladakhi: King Gesar",
    "blurb": "The Tibetan epic hero as sung in Ladakh.",
    "minutes": 6,
    "tag": "Oral Tradition · Ladakh · Ladakhi",
    "region": "Ladakh",
    "language": "Ladakhi",
    "source": "Ladakhi Gesar tradition"
   },
   {
    "id": "hs-gaddi-the-shepherds-and-shiva",
    "title": "Gaddi: The Shepherds and Shiva",
    "blurb": "Shepherds of Bharmour who call Shiva their own.",
    "minutes": 6,
    "tag": "Oral Tradition · Himachal Pradesh · Gaddi",
    "region": "Himachal Pradesh",
    "language": "Gaddi",
    "source": "Gaddi tradition"
   },
   {
    "id": "hs-van-gujjar-buffaloes-and-the-forest",
    "title": "Van Gujjar: Buffaloes and the Forest",
    "blurb": "The pastoralists of the Shivaliks.",
    "minutes": 6,
    "tag": "Oral Tradition · Uttarakhand · Gojri",
    "region": "Uttarakhand",
    "language": "Gojri",
    "source": "Van Gujjar tradition"
   },
   {
    "id": "hs-raika-and-the-camel",
    "title": "Raika and the Camel",
    "blurb": "Why the Raika believe Shiva made the camel.",
    "minutes": 6,
    "tag": "Oral Tradition · Rajasthan · Rajasthani",
    "region": "Rajasthan",
    "language": "Rajasthani",
    "source": "Raika oral tradition"
   },
   {
    "id": "hs-bishnoi-and-the-khejarli-sacrifice",
    "title": "Bishnoi and the Khejarli Sacrifice",
    "blurb": "363 people died hugging trees in 1730.",
    "minutes": 6,
    "tag": "Oral Tradition · Rajasthan · Rajasthani",
    "region": "Rajasthan",
    "language": "Rajasthani",
    "source": "Bishnoi history"
   },
   {
    "id": "hs-kalbelia-snake-charmers",
    "title": "Kalbelia Snake Charmers",
    "blurb": "How the Kalbelia dance was born.",
    "minutes": 6,
    "tag": "Oral Tradition · Rajasthan · Rajasthani",
    "region": "Rajasthan",
    "language": "Rajasthani",
    "source": "Kalbelia tradition"
   },
   {
    "id": "hs-banjara-and-the-salt-caravans",
    "title": "Banjara and the Salt Caravans",
    "blurb": "The travelling traders of the Deccan.",
    "minutes": 6,
    "tag": "Oral Tradition · Telangana · Lambadi",
    "region": "Telangana",
    "language": "Lambadi",
    "source": "Banjara oral history"
   },
   {
    "id": "hs-dhangar-shepherds-and-biroba",
    "title": "Dhangar Shepherds and Biroba",
    "blurb": "The god of the Deccan shepherds.",
    "minutes": 6,
    "tag": "Oral Tradition · Maharashtra · Marathi",
    "region": "Maharashtra",
    "language": "Marathi",
    "source": "Dhangar tradition"
   },
   {
    "id": "hs-maldhari-and-the-banni-grasslands",
    "title": "Maldhari and the Banni Grasslands",
    "blurb": "Herders of Kutch.",
    "minutes": 6,
    "tag": "Oral Tradition · Gujarat · Kutchi",
    "region": "Gujarat",
    "language": "Kutchi",
    "source": "Maldhari tradition"
   }
  ]
 },
 {
  "id": "heritage-history",
  "name": "Local Histories",
  "whisper": "Kings, cities and the people who lived in them.",
  "stories": [
   {
    "id": "hs-rani-durgavati-of-gondwana",
    "title": "Rani Durgavati of Gondwana",
    "blurb": "The queen who fought Akbar's army.",
    "minutes": 6,
    "tag": "Local History · Madhya Pradesh · Hindi",
    "region": "Madhya Pradesh",
    "language": "Hindi",
    "source": "Gond history"
   },
   {
    "id": "hs-rani-abbakka-of-ullal",
    "title": "Rani Abbakka of Ullal",
    "blurb": "The Tulu queen who fought the Portuguese.",
    "minutes": 6,
    "tag": "Local History · Karnataka · Tulu",
    "region": "Karnataka",
    "language": "Tulu",
    "source": "Ullal history"
   },
   {
    "id": "hs-rani-chennamma-of-kittur",
    "title": "Rani Chennamma of Kittur",
    "blurb": "She rose against the British in 1824.",
    "minutes": 6,
    "tag": "Local History · Karnataka · Kannada",
    "region": "Karnataka",
    "language": "Kannada",
    "source": "Kittur history"
   },
   {
    "id": "hs-rani-velu-nachiyar",
    "title": "Rani Velu Nachiyar",
    "blurb": "The Sivaganga queen who reclaimed her kingdom.",
    "minutes": 6,
    "tag": "Local History · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Sivaganga history"
   },
   {
    "id": "hs-onake-obavva",
    "title": "Onake Obavva",
    "blurb": "A woman who defended Chitradurga with a pestle.",
    "minutes": 6,
    "tag": "Local History · Karnataka · Kannada",
    "region": "Karnataka",
    "language": "Kannada",
    "source": "Chitradurga history"
   },
   {
    "id": "hs-rani-lakshmibai-of-jhansi",
    "title": "Rani Lakshmibai of Jhansi",
    "blurb": "The queen of 1857.",
    "minutes": 6,
    "tag": "Local History · Uttar Pradesh · Hindi",
    "region": "Uttar Pradesh",
    "language": "Hindi",
    "source": "1857 history"
   },
   {
    "id": "hs-begum-hazrat-mahal",
    "title": "Begum Hazrat Mahal",
    "blurb": "Awadh's queen who refused British pensions.",
    "minutes": 6,
    "tag": "Local History · Uttar Pradesh · Urdu",
    "region": "Uttar Pradesh",
    "language": "Urdu",
    "source": "1857 history"
   },
   {
    "id": "hs-rani-gaidinliu",
    "title": "Rani Gaidinliu",
    "blurb": "The Naga freedom fighter jailed at sixteen.",
    "minutes": 6,
    "tag": "Local History · Manipur · Zeme",
    "region": "Manipur",
    "language": "Zeme",
    "source": "Heraka movement history"
   },
   {
    "id": "hs-lachit-borphukan-and-saraighat",
    "title": "Lachit Borphukan and Saraighat",
    "blurb": "The Ahom general who stopped the Mughals.",
    "minutes": 6,
    "tag": "Local History · Assam · Assamese",
    "region": "Assam",
    "language": "Assamese",
    "source": "Ahom Buranji"
   },
   {
    "id": "hs-the-ahom-buranjis",
    "title": "The Ahom Buranjis",
    "blurb": "A kingdom that wrote its own chronicles.",
    "minutes": 6,
    "tag": "Local History · Assam · Assamese",
    "region": "Assam",
    "language": "Assamese",
    "source": "Ahom Buranji tradition"
   },
   {
    "id": "hs-kakatiya-rudramadevi",
    "title": "Kakatiya Rudramadevi",
    "blurb": "The queen who ruled as a king.",
    "minutes": 6,
    "tag": "Local History · Telangana · Telugu",
    "region": "Telangana",
    "language": "Telugu",
    "source": "Kakatiya history & Marco Polo"
   },
   {
    "id": "hs-krishnadevaraya-of-vijayanagara",
    "title": "Krishnadevaraya of Vijayanagara",
    "blurb": "The poet-king of Hampi.",
    "minutes": 6,
    "tag": "Local History · Karnataka · Telugu",
    "region": "Karnataka",
    "language": "Telugu",
    "source": "Vijayanagara history"
   },
   {
    "id": "hs-the-fall-of-vijayanagara",
    "title": "The Fall of Vijayanagara",
    "blurb": "Talikota, 1565.",
    "minutes": 6,
    "tag": "Local History · Karnataka · Kannada",
    "region": "Karnataka",
    "language": "Kannada",
    "source": "Vijayanagara history"
   },
   {
    "id": "hs-raja-raja-chola-s-temple",
    "title": "Raja Raja Chola's Temple",
    "blurb": "How the Big Temple was built.",
    "minutes": 6,
    "tag": "Local History · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Chola inscriptions"
   },
   {
    "id": "hs-rajendra-chola-s-gangaikonda",
    "title": "Rajendra Chola's Gangaikonda",
    "blurb": "Bringing Ganga water to the south.",
    "minutes": 6,
    "tag": "Local History · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Chola inscriptions"
   },
   {
    "id": "hs-marthanda-varma-and-colachel",
    "title": "Marthanda Varma and Colachel",
    "blurb": "The Travancore king who defeated the Dutch.",
    "minutes": 6,
    "tag": "Local History · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Travancore history"
   },
   {
    "id": "hs-kunjali-marakkars",
    "title": "Kunjali Marakkars",
    "blurb": "Admirals of the Zamorin.",
    "minutes": 6,
    "tag": "Local History · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Calicut history"
   },
   {
    "id": "hs-pazhassi-raja",
    "title": "Pazhassi Raja",
    "blurb": "The Lion of Kerala in the Wayanad forests.",
    "minutes": 6,
    "tag": "Local History · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Kottayam (Malabar) history"
   },
   {
    "id": "hs-tipu-sultan-s-rockets",
    "title": "Tipu Sultan's Rockets",
    "blurb": "The Mysore rockets that reached London.",
    "minutes": 6,
    "tag": "Local History · Karnataka · Kannada",
    "region": "Karnataka",
    "language": "Kannada",
    "source": "Mysore history"
   },
   {
    "id": "hs-shivaji-s-escape-from-agra",
    "title": "Shivaji's Escape from Agra",
    "blurb": "The fruit baskets.",
    "minutes": 6,
    "tag": "Local History · Maharashtra · Marathi",
    "region": "Maharashtra",
    "language": "Marathi",
    "source": "Maratha bakhar tradition"
   },
   {
    "id": "hs-tanaji-and-sinhagad",
    "title": "Tanaji and Sinhagad",
    "blurb": "The lion's fort and the monitor lizard.",
    "minutes": 6,
    "tag": "Local History · Maharashtra · Marathi",
    "region": "Maharashtra",
    "language": "Marathi",
    "source": "Powada tradition"
   },
   {
    "id": "hs-baji-prabhu-at-pavan-khind",
    "title": "Baji Prabhu at Pavan Khind",
    "blurb": "Holding the pass until the guns fired.",
    "minutes": 6,
    "tag": "Local History · Maharashtra · Marathi",
    "region": "Maharashtra",
    "language": "Marathi",
    "source": "Maratha history"
   },
   {
    "id": "hs-ahilyabai-holkar-of-indore",
    "title": "Ahilyabai Holkar of Indore",
    "blurb": "The philosopher queen of Malwa.",
    "minutes": 6,
    "tag": "Local History · Madhya Pradesh · Marathi",
    "region": "Madhya Pradesh",
    "language": "Marathi",
    "source": "Holkar history"
   },
   {
    "id": "hs-maharana-pratap-and-chetak",
    "title": "Maharana Pratap and Chetak",
    "blurb": "Haldighati, 1576.",
    "minutes": 6,
    "tag": "Local History · Rajasthan · Rajasthani",
    "region": "Rajasthan",
    "language": "Rajasthani",
    "source": "Mewar history"
   },
   {
    "id": "hs-padmini-of-chittor",
    "title": "Padmini of Chittor",
    "blurb": "History, poem and the jauhar.",
    "minutes": 6,
    "tag": "Local History · Rajasthan · Rajasthani",
    "region": "Rajasthan",
    "language": "Rajasthani",
    "source": "Malik Muhammad Jayasi, Padmavat"
   },
   {
    "id": "hs-panna-dhai",
    "title": "Panna Dhai",
    "blurb": "A nurse who gave her own son to save a prince.",
    "minutes": 6,
    "tag": "Local History · Rajasthan · Rajasthani",
    "region": "Rajasthan",
    "language": "Rajasthani",
    "source": "Mewar history"
   },
   {
    "id": "hs-hammir-dev-of-ranthambore",
    "title": "Hammir Dev of Ranthambore",
    "blurb": "The king who would not surrender a refugee.",
    "minutes": 6,
    "tag": "Local History · Rajasthan · Rajasthani",
    "region": "Rajasthan",
    "language": "Rajasthani",
    "source": "Hammira Mahakavya"
   },
   {
    "id": "hs-prithviraj-chauhan-and-sanyogita",
    "title": "Prithviraj Chauhan and Sanyogita",
    "blurb": "The swayamvara and Tarain.",
    "minutes": 6,
    "tag": "Local History · Rajasthan · Hindi",
    "region": "Rajasthan",
    "language": "Hindi",
    "source": "Prithviraj Raso"
   },
   {
    "id": "hs-banda-singh-bahadur",
    "title": "Banda Singh Bahadur",
    "blurb": "The Sikh general who abolished zamindari.",
    "minutes": 6,
    "tag": "Local History · Punjab · Punjabi",
    "region": "Punjab",
    "language": "Punjabi",
    "source": "Sikh history"
   },
   {
    "id": "hs-maharaja-ranjit-singh",
    "title": "Maharaja Ranjit Singh",
    "blurb": "The Lion of Punjab and the Koh-i-Noor.",
    "minutes": 6,
    "tag": "Local History · Punjab · Punjabi",
    "region": "Punjab",
    "language": "Punjabi",
    "source": "Sikh Empire history"
   },
   {
    "id": "hs-the-saragarhi-battle",
    "title": "The Saragarhi Battle",
    "blurb": "21 Sikh soldiers in 1897.",
    "minutes": 6,
    "tag": "Local History · Punjab · Punjabi",
    "region": "Punjab",
    "language": "Punjabi",
    "source": "Military history"
   },
   {
    "id": "hs-jallianwala-bagh",
    "title": "Jallianwala Bagh",
    "blurb": "13 April 1919.",
    "minutes": 6,
    "tag": "Local History · Punjab · Punjabi",
    "region": "Punjab",
    "language": "Punjabi",
    "source": "Hunter Committee & survivor accounts"
   },
   {
    "id": "hs-bahadur-shah-zafar",
    "title": "Bahadur Shah Zafar",
    "blurb": "The last Mughal and his exile.",
    "minutes": 6,
    "tag": "Local History · Delhi · Urdu",
    "region": "Delhi",
    "language": "Urdu",
    "source": "1857 history"
   },
   {
    "id": "hs-the-founding-of-hyderabad",
    "title": "The Founding of Hyderabad",
    "blurb": "Quli Qutb Shah and Bhagmati.",
    "minutes": 6,
    "tag": "Local History · Telangana · Dakhni",
    "region": "Telangana",
    "language": "Dakhni",
    "source": "Qutb Shahi history"
   },
   {
    "id": "hs-chand-bibi-of-ahmednagar",
    "title": "Chand Bibi of Ahmednagar",
    "blurb": "The regent who held off the Mughals.",
    "minutes": 6,
    "tag": "Local History · Maharashtra · Dakhni",
    "region": "Maharashtra",
    "language": "Dakhni",
    "source": "Deccan sultanate history"
   },
   {
    "id": "hs-malik-ambar",
    "title": "Malik Ambar",
    "blurb": "The Ethiopian who ruled the Deccan.",
    "minutes": 6,
    "tag": "Local History · Maharashtra · Marathi",
    "region": "Maharashtra",
    "language": "Marathi",
    "source": "Ahmednagar history"
   },
   {
    "id": "hs-bijapur-s-gol-gumbaz",
    "title": "Bijapur's Gol Gumbaz",
    "blurb": "The whispering dome.",
    "minutes": 6,
    "tag": "Local History · Karnataka · Dakhni",
    "region": "Karnataka",
    "language": "Dakhni",
    "source": "Adil Shahi history"
   },
   {
    "id": "hs-wajid-ali-shah-in-exile",
    "title": "Wajid Ali Shah in Exile",
    "blurb": "The Nawab who built a little Lucknow in Calcutta.",
    "minutes": 6,
    "tag": "Local History · West Bengal · Urdu",
    "region": "West Bengal",
    "language": "Urdu",
    "source": "Awadh history"
   },
   {
    "id": "hs-siraj-ud-daulah-and-plassey",
    "title": "Siraj-ud-Daulah and Plassey",
    "blurb": "1757 and the betrayal of Mir Jafar.",
    "minutes": 6,
    "tag": "Local History · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Bengal history"
   },
   {
    "id": "hs-the-bengal-famine-of-1770",
    "title": "The Bengal Famine of 1770",
    "blurb": "One-third of Bengal starved.",
    "minutes": 6,
    "tag": "Local History · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Bengal history"
   },
   {
    "id": "hs-indigo-revolt",
    "title": "Indigo Revolt",
    "blurb": "Peasants against the planters, 1859.",
    "minutes": 6,
    "tag": "Local History · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Nil Darpan & history"
   },
   {
    "id": "hs-the-paika-rebellion",
    "title": "The Paika Rebellion",
    "blurb": "Odisha rises in 1817.",
    "minutes": 6,
    "tag": "Local History · Odisha · Odia",
    "region": "Odisha",
    "language": "Odia",
    "source": "Odisha history"
   },
   {
    "id": "hs-kalinga-and-ashoka",
    "title": "Kalinga and Ashoka",
    "blurb": "The war that changed an emperor.",
    "minutes": 6,
    "tag": "Local History · Odisha · Odia",
    "region": "Odisha",
    "language": "Odia",
    "source": "Ashokan Rock Edict XIII"
   },
   {
    "id": "hs-kharavela-of-kalinga",
    "title": "Kharavela of Kalinga",
    "blurb": "The Hathigumpha inscription.",
    "minutes": 6,
    "tag": "Local History · Odisha · Prakrit",
    "region": "Odisha",
    "language": "Prakrit",
    "source": "Hathigumpha inscription"
   },
   {
    "id": "hs-nalanda-s-library",
    "title": "Nalanda's Library",
    "blurb": "The university that burned for months.",
    "minutes": 6,
    "tag": "Local History · Bihar · Sanskrit",
    "region": "Bihar",
    "language": "Sanskrit",
    "source": "Xuanzang & Nalanda history"
   },
   {
    "id": "hs-vaishali-the-first-republic",
    "title": "Vaishali, the First Republic",
    "blurb": "The Licchavi assembly.",
    "minutes": 6,
    "tag": "Local History · Bihar · Prakrit",
    "region": "Bihar",
    "language": "Prakrit",
    "source": "Buddhist & Jain sources"
   },
   {
    "id": "hs-pataliputra-and-megasthenes",
    "title": "Pataliputra and Megasthenes",
    "blurb": "A Greek ambassador's India.",
    "minutes": 6,
    "tag": "Local History · Bihar · Greek",
    "region": "Bihar",
    "language": "Greek",
    "source": "Megasthenes, Indica fragments"
   },
   {
    "id": "hs-sher-shah-suri-s-road",
    "title": "Sher Shah Suri's Road",
    "blurb": "The Grand Trunk Road.",
    "minutes": 6,
    "tag": "Local History · Bihar · Hindi",
    "region": "Bihar",
    "language": "Hindi",
    "source": "Sur history"
   },
   {
    "id": "hs-hampi-s-bazaars",
    "title": "Hampi's Bazaars",
    "blurb": "What Domingo Paes saw.",
    "minutes": 6,
    "tag": "Local History · Karnataka · Kannada",
    "region": "Karnataka",
    "language": "Kannada",
    "source": "Domingo Paes' chronicle"
   },
   {
    "id": "hs-goa-inquisition",
    "title": "Goa Inquisition",
    "blurb": "The Portuguese tribunal's long shadow.",
    "minutes": 6,
    "tag": "Local History · Goa · Konkani",
    "region": "Goa",
    "language": "Konkani",
    "source": "Goa history"
   },
   {
    "id": "hs-daman-diu-and-the-portuguese-forts",
    "title": "Daman, Diu and the Portuguese Forts",
    "blurb": "The last outposts.",
    "minutes": 6,
    "tag": "Local History · Daman & Diu · Gujarati",
    "region": "Daman & Diu",
    "language": "Gujarati",
    "source": "Portuguese India history"
   },
   {
    "id": "hs-pondicherry-and-dupleix",
    "title": "Pondicherry and Dupleix",
    "blurb": "French India.",
    "minutes": 6,
    "tag": "Local History · Puducherry · Tamil",
    "region": "Puducherry",
    "language": "Tamil",
    "source": "French India history"
   },
   {
    "id": "hs-tranquebar-the-danish-town",
    "title": "Tranquebar, the Danish Town",
    "blurb": "Denmark's colony in Tamil Nadu.",
    "minutes": 6,
    "tag": "Local History · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Danish India history"
   },
   {
    "id": "hs-chinsurah-s-dutch",
    "title": "Chinsurah's Dutch",
    "blurb": "The Dutch on the Hooghly.",
    "minutes": 6,
    "tag": "Local History · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Dutch Bengal history"
   },
   {
    "id": "hs-mattancherry-synagogue",
    "title": "Mattancherry Synagogue",
    "blurb": "The Jews of Kochi.",
    "minutes": 6,
    "tag": "Local History · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Kochi Jewish history"
   },
   {
    "id": "hs-the-parsis-arrive-at-sanjan",
    "title": "The Parsis Arrive at Sanjan",
    "blurb": "Milk and sugar.",
    "minutes": 6,
    "tag": "Local History · Gujarat · Gujarati",
    "region": "Gujarat",
    "language": "Gujarati",
    "source": "Qissa-i Sanjan"
   },
   {
    "id": "hs-the-siddis-of-janjira",
    "title": "The Siddis of Janjira",
    "blurb": "An island fort never conquered.",
    "minutes": 6,
    "tag": "Local History · Maharashtra · Marathi",
    "region": "Maharashtra",
    "language": "Marathi",
    "source": "Janjira history"
   },
   {
    "id": "hs-lothal-s-dockyard",
    "title": "Lothal's Dockyard",
    "blurb": "The Harappan port.",
    "minutes": 6,
    "tag": "Local History · Gujarat · Gujarati",
    "region": "Gujarat",
    "language": "Gujarati",
    "source": "ASI excavations (S.R. Rao)"
   },
   {
    "id": "hs-dholavira-s-water",
    "title": "Dholavira's Water",
    "blurb": "The Harappan city of reservoirs.",
    "minutes": 6,
    "tag": "Local History · Gujarat · Gujarati",
    "region": "Gujarat",
    "language": "Gujarati",
    "source": "ASI excavations (R.S. Bisht)"
   },
   {
    "id": "hs-keezhadi-excavations",
    "title": "Keezhadi Excavations",
    "blurb": "A Sangam-age city found.",
    "minutes": 6,
    "tag": "Local History · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Tamil Nadu archaeology"
   },
   {
    "id": "hs-the-chipko-women",
    "title": "The Chipko Women",
    "blurb": "Gaura Devi hugs the trees, 1974.",
    "minutes": 6,
    "tag": "Local History · Uttarakhand · Garhwali",
    "region": "Uttarakhand",
    "language": "Garhwali",
    "source": "Chipko movement history"
   },
   {
    "id": "hs-champaran-satyagraha",
    "title": "Champaran Satyagraha",
    "blurb": "Rajkumar Shukla brings Gandhi to Bihar.",
    "minutes": 6,
    "tag": "Local History · Bihar · Bhojpuri",
    "region": "Bihar",
    "language": "Bhojpuri",
    "source": "Champaran history"
   },
   {
    "id": "hs-the-salt-march",
    "title": "The Salt March",
    "blurb": "Dandi, 1930.",
    "minutes": 6,
    "tag": "Local History · Gujarat · Gujarati",
    "region": "Gujarat",
    "language": "Gujarati",
    "source": "Independence movement history"
   },
   {
    "id": "hs-kakori-train-action",
    "title": "Kakori Train Action",
    "blurb": "Bismil and Ashfaqulla, 1925.",
    "minutes": 6,
    "tag": "Local History · Uttar Pradesh · Hindi",
    "region": "Uttar Pradesh",
    "language": "Hindi",
    "source": "Revolutionary history"
   },
   {
    "id": "hs-chittagong-armoury-raid",
    "title": "Chittagong Armoury Raid",
    "blurb": "Surya Sen and Pritilata.",
    "minutes": 6,
    "tag": "Local History · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Revolutionary history"
   },
   {
    "id": "hs-vaikom-satyagraha",
    "title": "Vaikom Satyagraha",
    "blurb": "The right to walk a road.",
    "minutes": 6,
    "tag": "Local History · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Social reform history"
   },
   {
    "id": "hs-kalapani-cellular-jail",
    "title": "Kalapani: Cellular Jail",
    "blurb": "Prisoners of the Andamans.",
    "minutes": 6,
    "tag": "Local History · Andaman Islands · Hindi",
    "region": "Andaman Islands",
    "language": "Hindi",
    "source": "Cellular Jail history"
   }
  ]
 },
 {
  "id": "heritage-rituals",
  "name": "Customs, Rituals & Festivals",
  "whisper": "How India marks the turning of the year.",
  "stories": [
   {
    "id": "hs-hornbill-festival",
    "title": "Hornbill Festival",
    "blurb": "Nagaland's festival of festivals.",
    "minutes": 6,
    "tag": "Festival & Ritual · Nagaland · Nagamese",
    "region": "Nagaland",
    "language": "Nagamese",
    "source": "Nagaland tradition"
   },
   {
    "id": "hs-losar-in-ladakh",
    "title": "Losar in Ladakh",
    "blurb": "The Tibetan new year in the high desert.",
    "minutes": 6,
    "tag": "Festival & Ritual · Ladakh · Ladakhi",
    "region": "Ladakh",
    "language": "Ladakhi",
    "source": "Ladakhi Buddhist tradition"
   },
   {
    "id": "hs-hemis-tsechu",
    "title": "Hemis Tsechu",
    "blurb": "Masked dances for Guru Padmasambhava.",
    "minutes": 6,
    "tag": "Festival & Ritual · Ladakh · Ladakhi",
    "region": "Ladakh",
    "language": "Ladakhi",
    "source": "Hemis monastery tradition"
   },
   {
    "id": "hs-bihu",
    "title": "Bihu",
    "blurb": "Assam's three harvest festivals.",
    "minutes": 6,
    "tag": "Festival & Ritual · Assam · Assamese",
    "region": "Assam",
    "language": "Assamese",
    "source": "Assamese tradition"
   },
   {
    "id": "hs-ambubachi-mela",
    "title": "Ambubachi Mela",
    "blurb": "The goddess's annual menstruation.",
    "minutes": 6,
    "tag": "Festival & Ritual · Assam · Assamese",
    "region": "Assam",
    "language": "Assamese",
    "source": "Kamakhya tradition"
   },
   {
    "id": "hs-ras-leela-of-manipur",
    "title": "Ras Leela of Manipur",
    "blurb": "Krishna's dance in Meitei style.",
    "minutes": 6,
    "tag": "Festival & Ritual · Manipur · Meitei",
    "region": "Manipur",
    "language": "Meitei",
    "source": "Manipuri Vaishnava tradition"
   },
   {
    "id": "hs-lai-haraoba",
    "title": "Lai Haraoba",
    "blurb": "The merrymaking of the gods.",
    "minutes": 6,
    "tag": "Festival & Ritual · Manipur · Meitei",
    "region": "Manipur",
    "language": "Meitei",
    "source": "Sanamahi tradition"
   },
   {
    "id": "hs-cheiraoba",
    "title": "Cheiraoba",
    "blurb": "Manipuri New Year and the hill climb.",
    "minutes": 6,
    "tag": "Festival & Ritual · Manipur · Meitei",
    "region": "Manipur",
    "language": "Meitei",
    "source": "Meitei tradition"
   },
   {
    "id": "hs-chapchar-kut",
    "title": "Chapchar Kut",
    "blurb": "Mizo festival after the jungle clearing.",
    "minutes": 6,
    "tag": "Festival & Ritual · Mizoram · Mizo",
    "region": "Mizoram",
    "language": "Mizo",
    "source": "Mizo tradition"
   },
   {
    "id": "hs-nongkrem-dance",
    "title": "Nongkrem Dance",
    "blurb": "Khasi thanksgiving at Smit.",
    "minutes": 6,
    "tag": "Festival & Ritual · Meghalaya · Khasi",
    "region": "Meghalaya",
    "language": "Khasi",
    "source": "Khasi tradition"
   },
   {
    "id": "hs-behdienkhlam",
    "title": "Behdienkhlam",
    "blurb": "Driving away the plague in Jowai.",
    "minutes": 6,
    "tag": "Festival & Ritual · Meghalaya · Pnar",
    "region": "Meghalaya",
    "language": "Pnar",
    "source": "Pnar tradition"
   },
   {
    "id": "hs-kharchi-puja",
    "title": "Kharchi Puja",
    "blurb": "Cleansing the fourteen gods.",
    "minutes": 6,
    "tag": "Festival & Ritual · Tripura · Kokborok",
    "region": "Tripura",
    "language": "Kokborok",
    "source": "Tripura tradition"
   },
   {
    "id": "hs-saga-dawa-in-sikkim",
    "title": "Saga Dawa in Sikkim",
    "blurb": "Buddha's birth, enlightenment and death.",
    "minutes": 6,
    "tag": "Festival & Ritual · Sikkim · Bhutia",
    "region": "Sikkim",
    "language": "Bhutia",
    "source": "Sikkimese Buddhist tradition"
   },
   {
    "id": "hs-pang-lhabsol",
    "title": "Pang Lhabsol",
    "blurb": "Worshipping Kanchenjunga.",
    "minutes": 6,
    "tag": "Festival & Ritual · Sikkim · Bhutia",
    "region": "Sikkim",
    "language": "Bhutia",
    "source": "Sikkimese tradition"
   },
   {
    "id": "hs-durga-puja-in-kolkata",
    "title": "Durga Puja in Kolkata",
    "blurb": "Kumartuli to immersion.",
    "minutes": 6,
    "tag": "Festival & Ritual · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Bengali tradition"
   },
   {
    "id": "hs-sindoor-khela",
    "title": "Sindoor Khela",
    "blurb": "The vermilion game.",
    "minutes": 6,
    "tag": "Festival & Ritual · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Bengali tradition"
   },
   {
    "id": "hs-chhath-puja",
    "title": "Chhath Puja",
    "blurb": "Offering to the setting sun.",
    "minutes": 6,
    "tag": "Festival & Ritual · Bihar · Bhojpuri",
    "region": "Bihar",
    "language": "Bhojpuri",
    "source": "Bihari tradition"
   },
   {
    "id": "hs-sama-chakeva",
    "title": "Sama Chakeva",
    "blurb": "Brothers and sisters in Mithila.",
    "minutes": 6,
    "tag": "Festival & Ritual · Bihar · Maithili",
    "region": "Bihar",
    "language": "Maithili",
    "source": "Mithila tradition"
   },
   {
    "id": "hs-jitiya",
    "title": "Jitiya",
    "blurb": "A mother's fast.",
    "minutes": 6,
    "tag": "Festival & Ritual · Bihar · Bhojpuri",
    "region": "Bihar",
    "language": "Bhojpuri",
    "source": "Bihari tradition"
   },
   {
    "id": "hs-rath-yatra-of-puri",
    "title": "Rath Yatra of Puri",
    "blurb": "The chariots of Jagannath.",
    "minutes": 6,
    "tag": "Festival & Ritual · Odisha · Odia",
    "region": "Odisha",
    "language": "Odia",
    "source": "Puri tradition"
   },
   {
    "id": "hs-raja-parba",
    "title": "Raja Parba",
    "blurb": "When the earth rests.",
    "minutes": 6,
    "tag": "Festival & Ritual · Odisha · Odia",
    "region": "Odisha",
    "language": "Odia",
    "source": "Odia tradition"
   },
   {
    "id": "hs-nuakhai",
    "title": "Nuakhai",
    "blurb": "Eating the new rice.",
    "minutes": 6,
    "tag": "Festival & Ritual · Odisha · Sambalpuri",
    "region": "Odisha",
    "language": "Sambalpuri",
    "source": "Western Odisha tradition"
   },
   {
    "id": "hs-bali-jatra",
    "title": "Bali Jatra",
    "blurb": "Remembering the voyages to Bali.",
    "minutes": 6,
    "tag": "Festival & Ritual · Odisha · Odia",
    "region": "Odisha",
    "language": "Odia",
    "source": "Cuttack tradition"
   },
   {
    "id": "hs-karma-festival",
    "title": "Karma Festival",
    "blurb": "Dancing around the Karam branch.",
    "minutes": 6,
    "tag": "Festival & Ritual · Jharkhand · Nagpuri",
    "region": "Jharkhand",
    "language": "Nagpuri",
    "source": "Jharkhand tradition"
   },
   {
    "id": "hs-sarhul",
    "title": "Sarhul",
    "blurb": "The sal blossom festival.",
    "minutes": 6,
    "tag": "Festival & Ritual · Jharkhand · Kurukh",
    "region": "Jharkhand",
    "language": "Kurukh",
    "source": "Adivasi tradition"
   },
   {
    "id": "hs-sohrai",
    "title": "Sohrai",
    "blurb": "Painting houses for the cattle.",
    "minutes": 6,
    "tag": "Festival & Ritual · Jharkhand · Santali",
    "region": "Jharkhand",
    "language": "Santali",
    "source": "Santal & Hazaribagh tradition"
   },
   {
    "id": "hs-kumbh-mela",
    "title": "Kumbh Mela",
    "blurb": "The largest gathering on earth.",
    "minutes": 6,
    "tag": "Festival & Ritual · Uttar Pradesh · Hindi",
    "region": "Uttar Pradesh",
    "language": "Hindi",
    "source": "Kumbh tradition"
   },
   {
    "id": "hs-dev-deepawali-in-varanasi",
    "title": "Dev Deepawali in Varanasi",
    "blurb": "Lamps for the gods on the ghats.",
    "minutes": 6,
    "tag": "Festival & Ritual · Uttar Pradesh · Hindi",
    "region": "Uttar Pradesh",
    "language": "Hindi",
    "source": "Varanasi tradition"
   },
   {
    "id": "hs-ramlila-of-ramnagar",
    "title": "Ramlila of Ramnagar",
    "blurb": "A month-long Ramayana performed across a town.",
    "minutes": 6,
    "tag": "Festival & Ritual · Uttar Pradesh · Hindi",
    "region": "Uttar Pradesh",
    "language": "Hindi",
    "source": "Ramnagar tradition"
   },
   {
    "id": "hs-lathmar-holi-of-barsana",
    "title": "Lathmar Holi of Barsana",
    "blurb": "Women beat men with sticks.",
    "minutes": 6,
    "tag": "Festival & Ritual · Uttar Pradesh · Braj",
    "region": "Uttar Pradesh",
    "language": "Braj",
    "source": "Braj tradition"
   },
   {
    "id": "hs-phool-dei",
    "title": "Phool Dei",
    "blurb": "Children scatter flowers on doorsteps.",
    "minutes": 6,
    "tag": "Festival & Ritual · Uttarakhand · Kumaoni",
    "region": "Uttarakhand",
    "language": "Kumaoni",
    "source": "Kumaoni tradition"
   },
   {
    "id": "hs-nanda-devi-raj-jat",
    "title": "Nanda Devi Raj Jat",
    "blurb": "A pilgrimage once every twelve years.",
    "minutes": 6,
    "tag": "Festival & Ritual · Uttarakhand · Garhwali",
    "region": "Uttarakhand",
    "language": "Garhwali",
    "source": "Garhwal tradition"
   },
   {
    "id": "hs-kullu-dussehra",
    "title": "Kullu Dussehra",
    "blurb": "Gods carried down from every valley.",
    "minutes": 6,
    "tag": "Festival & Ritual · Himachal Pradesh · Pahari",
    "region": "Himachal Pradesh",
    "language": "Pahari",
    "source": "Kullu tradition"
   },
   {
    "id": "hs-lohri",
    "title": "Lohri",
    "blurb": "The bonfire of Dulla Bhatti.",
    "minutes": 6,
    "tag": "Festival & Ritual · Punjab · Punjabi",
    "region": "Punjab",
    "language": "Punjabi",
    "source": "Punjabi tradition"
   },
   {
    "id": "hs-hola-mohalla",
    "title": "Hola Mohalla",
    "blurb": "The Sikh warrior festival at Anandpur.",
    "minutes": 6,
    "tag": "Festival & Ritual · Punjab · Punjabi",
    "region": "Punjab",
    "language": "Punjabi",
    "source": "Sikh tradition"
   },
   {
    "id": "hs-teej",
    "title": "Teej",
    "blurb": "The swing festival of the monsoon.",
    "minutes": 6,
    "tag": "Festival & Ritual · Rajasthan · Rajasthani",
    "region": "Rajasthan",
    "language": "Rajasthani",
    "source": "Rajasthani tradition"
   },
   {
    "id": "hs-gangaur",
    "title": "Gangaur",
    "blurb": "Women pray to Gauri.",
    "minutes": 6,
    "tag": "Festival & Ritual · Rajasthan · Rajasthani",
    "region": "Rajasthan",
    "language": "Rajasthani",
    "source": "Rajasthani tradition"
   },
   {
    "id": "hs-pushkar-camel-fair",
    "title": "Pushkar Camel Fair",
    "blurb": "Kartik Purnima in the desert.",
    "minutes": 6,
    "tag": "Festival & Ritual · Rajasthan · Rajasthani",
    "region": "Rajasthan",
    "language": "Rajasthani",
    "source": "Pushkar tradition"
   },
   {
    "id": "hs-navratri-garba",
    "title": "Navratri Garba",
    "blurb": "Nine nights of dance.",
    "minutes": 6,
    "tag": "Festival & Ritual · Gujarat · Gujarati",
    "region": "Gujarat",
    "language": "Gujarati",
    "source": "Gujarati tradition"
   },
   {
    "id": "hs-uttarayan-kites",
    "title": "Uttarayan Kites",
    "blurb": "The sky over Ahmedabad.",
    "minutes": 6,
    "tag": "Festival & Ritual · Gujarat · Gujarati",
    "region": "Gujarat",
    "language": "Gujarati",
    "source": "Gujarati tradition"
   },
   {
    "id": "hs-ganesh-chaturthi-in-pune",
    "title": "Ganesh Chaturthi in Pune",
    "blurb": "How Tilak made it public.",
    "minutes": 6,
    "tag": "Festival & Ritual · Maharashtra · Marathi",
    "region": "Maharashtra",
    "language": "Marathi",
    "source": "Maharashtrian history"
   },
   {
    "id": "hs-pandharpur-wari",
    "title": "Pandharpur Wari",
    "blurb": "The walk to Vitthal.",
    "minutes": 6,
    "tag": "Festival & Ritual · Maharashtra · Marathi",
    "region": "Maharashtra",
    "language": "Marathi",
    "source": "Varkari tradition"
   },
   {
    "id": "hs-gudi-padwa",
    "title": "Gudi Padwa",
    "blurb": "Raising the gudi.",
    "minutes": 6,
    "tag": "Festival & Ritual · Maharashtra · Marathi",
    "region": "Maharashtra",
    "language": "Marathi",
    "source": "Maharashtrian tradition"
   },
   {
    "id": "hs-shigmo",
    "title": "Shigmo",
    "blurb": "Goa's spring festival.",
    "minutes": 6,
    "tag": "Festival & Ritual · Goa · Konkani",
    "region": "Goa",
    "language": "Konkani",
    "source": "Goan tradition"
   },
   {
    "id": "hs-sao-joao",
    "title": "Sao Joao",
    "blurb": "Jumping into wells in Goa.",
    "minutes": 6,
    "tag": "Festival & Ritual · Goa · Konkani",
    "region": "Goa",
    "language": "Konkani",
    "source": "Goan Catholic tradition"
   },
   {
    "id": "hs-mysuru-dasara",
    "title": "Mysuru Dasara",
    "blurb": "The golden howdah.",
    "minutes": 6,
    "tag": "Festival & Ritual · Karnataka · Kannada",
    "region": "Karnataka",
    "language": "Kannada",
    "source": "Mysore tradition"
   },
   {
    "id": "hs-kambala",
    "title": "Kambala",
    "blurb": "Buffalo races in the paddy fields.",
    "minutes": 6,
    "tag": "Festival & Ritual · Karnataka · Tulu",
    "region": "Karnataka",
    "language": "Tulu",
    "source": "Tulu Nadu tradition"
   },
   {
    "id": "hs-bhuta-kola",
    "title": "Bhuta Kola",
    "blurb": "Spirits possessing the dancer.",
    "minutes": 6,
    "tag": "Festival & Ritual · Karnataka · Tulu",
    "region": "Karnataka",
    "language": "Tulu",
    "source": "Tulu Nadu tradition"
   },
   {
    "id": "hs-yakshagana-night",
    "title": "Yakshagana Night",
    "blurb": "Drums until dawn.",
    "minutes": 6,
    "tag": "Festival & Ritual · Karnataka · Kannada",
    "region": "Karnataka",
    "language": "Kannada",
    "source": "Coastal Karnataka tradition"
   },
   {
    "id": "hs-bonalu",
    "title": "Bonalu",
    "blurb": "Offering pots to the goddess.",
    "minutes": 6,
    "tag": "Festival & Ritual · Telangana · Telugu",
    "region": "Telangana",
    "language": "Telugu",
    "source": "Telangana tradition"
   },
   {
    "id": "hs-bathukamma",
    "title": "Bathukamma",
    "blurb": "Flower towers floated on lakes.",
    "minutes": 6,
    "tag": "Festival & Ritual · Telangana · Telugu",
    "region": "Telangana",
    "language": "Telugu",
    "source": "Telangana tradition"
   },
   {
    "id": "hs-sankranti-in-andhra",
    "title": "Sankranti in Andhra",
    "blurb": "Haridasus and cockfights.",
    "minutes": 6,
    "tag": "Festival & Ritual · Andhra Pradesh · Telugu",
    "region": "Andhra Pradesh",
    "language": "Telugu",
    "source": "Andhra tradition"
   },
   {
    "id": "hs-pongal",
    "title": "Pongal",
    "blurb": "Let it boil over.",
    "minutes": 6,
    "tag": "Festival & Ritual · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Tamil tradition"
   },
   {
    "id": "hs-jallikattu",
    "title": "Jallikattu",
    "blurb": "Embracing the bull.",
    "minutes": 6,
    "tag": "Festival & Ritual · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Tamil tradition"
   },
   {
    "id": "hs-karthigai-deepam",
    "title": "Karthigai Deepam",
    "blurb": "The flame on Arunachala.",
    "minutes": 6,
    "tag": "Festival & Ritual · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Tiruvannamalai tradition"
   },
   {
    "id": "hs-aadi-perukku",
    "title": "Aadi Perukku",
    "blurb": "Thanking the river Kaveri.",
    "minutes": 6,
    "tag": "Festival & Ritual · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Tamil tradition"
   },
   {
    "id": "hs-thrissur-pooram",
    "title": "Thrissur Pooram",
    "blurb": "Elephants and umbrellas.",
    "minutes": 6,
    "tag": "Festival & Ritual · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Thrissur tradition"
   },
   {
    "id": "hs-theyyam-season",
    "title": "Theyyam Season",
    "blurb": "The god walks the village.",
    "minutes": 6,
    "tag": "Festival & Ritual · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "North Malabar tradition"
   },
   {
    "id": "hs-vishu-kani",
    "title": "Vishu Kani",
    "blurb": "The first sight of the new year.",
    "minutes": 6,
    "tag": "Festival & Ritual · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Kerala tradition"
   },
   {
    "id": "hs-aranmula-boat-race",
    "title": "Aranmula Boat Race",
    "blurb": "The snake boats of the Pamba.",
    "minutes": 6,
    "tag": "Festival & Ritual · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Aranmula tradition"
   },
   {
    "id": "hs-attukal-pongala",
    "title": "Attukal Pongala",
    "blurb": "A million women cook for the goddess.",
    "minutes": 6,
    "tag": "Festival & Ritual · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Thiruvananthapuram tradition"
   },
   {
    "id": "hs-muharram-in-lucknow",
    "title": "Muharram in Lucknow",
    "blurb": "The tazias of Awadh.",
    "minutes": 6,
    "tag": "Festival & Ritual · Uttar Pradesh · Urdu",
    "region": "Uttar Pradesh",
    "language": "Urdu",
    "source": "Lucknow tradition"
   },
   {
    "id": "hs-urs-at-ajmer",
    "title": "Urs at Ajmer",
    "blurb": "The death anniversary of Moinuddin Chishti.",
    "minutes": 6,
    "tag": "Festival & Ritual · Rajasthan · Urdu",
    "region": "Rajasthan",
    "language": "Urdu",
    "source": "Chishti tradition"
   },
   {
    "id": "hs-christmas-in-shillong",
    "title": "Christmas in Shillong",
    "blurb": "Carols in the hills.",
    "minutes": 6,
    "tag": "Festival & Ritual · Meghalaya · Khasi",
    "region": "Meghalaya",
    "language": "Khasi",
    "source": "Khasi Christian tradition"
   },
   {
    "id": "hs-navroz-of-the-parsis",
    "title": "Navroz of the Parsis",
    "blurb": "Jamshedi Navroz.",
    "minutes": 6,
    "tag": "Festival & Ritual · Maharashtra · Gujarati",
    "region": "Maharashtra",
    "language": "Gujarati",
    "source": "Parsi tradition"
   },
   {
    "id": "hs-paryushan",
    "title": "Paryushan",
    "blurb": "Eight days of Jain forgiveness.",
    "minutes": 6,
    "tag": "Festival & Ritual · Gujarat · Gujarati",
    "region": "Gujarat",
    "language": "Gujarati",
    "source": "Jain tradition"
   }
  ]
 },
 {
  "id": "heritage-heroes",
  "name": "Local Heroes & Cultural Figures",
  "whisper": "Saints, poets and ordinary people who became legends.",
  "stories": [
   {
    "id": "hs-kabir-the-weaver",
    "title": "Kabir the Weaver",
    "blurb": "Dohas from a loom in Varanasi.",
    "minutes": 6,
    "tag": "Life Story · Uttar Pradesh · Hindi",
    "region": "Uttar Pradesh",
    "language": "Hindi",
    "source": "Kabir Bijak"
   },
   {
    "id": "hs-meera-s-defiance",
    "title": "Meera's Defiance",
    "blurb": "The Rajput princess who chose Krishna.",
    "minutes": 6,
    "tag": "Life Story · Rajasthan · Rajasthani",
    "region": "Rajasthan",
    "language": "Rajasthani",
    "source": "Meera padavali"
   },
   {
    "id": "hs-surdas-the-blind-poet",
    "title": "Surdas, the Blind Poet",
    "blurb": "Krishna's childhood in song.",
    "minutes": 6,
    "tag": "Life Story · Uttar Pradesh · Braj",
    "region": "Uttar Pradesh",
    "language": "Braj",
    "source": "Sursagar"
   },
   {
    "id": "hs-tulsidas-and-the-ramcharitmanas",
    "title": "Tulsidas and the Ramcharitmanas",
    "blurb": "The Ramayana for the common people.",
    "minutes": 6,
    "tag": "Life Story · Uttar Pradesh · Awadhi",
    "region": "Uttar Pradesh",
    "language": "Awadhi",
    "source": "Ramcharitmanas"
   },
   {
    "id": "hs-guru-nanak-at-mecca",
    "title": "Guru Nanak at Mecca",
    "blurb": "Which way is God not?",
    "minutes": 6,
    "tag": "Life Story · Punjab · Punjabi",
    "region": "Punjab",
    "language": "Punjabi",
    "source": "Janamsakhi tradition"
   },
   {
    "id": "hs-bulleh-shah",
    "title": "Bulleh Shah",
    "blurb": "The Sufi who danced.",
    "minutes": 6,
    "tag": "Life Story · Punjab · Punjabi",
    "region": "Punjab",
    "language": "Punjabi",
    "source": "Bulleh Shah's kafis"
   },
   {
    "id": "hs-lal-ded",
    "title": "Lal Ded",
    "blurb": "The Kashmiri mystic who walked naked.",
    "minutes": 6,
    "tag": "Life Story · Kashmir · Kashmiri",
    "region": "Kashmir",
    "language": "Kashmiri",
    "source": "Lal Vakh"
   },
   {
    "id": "hs-nund-rishi",
    "title": "Nund Rishi",
    "blurb": "Sheikh Noor-ud-din, Kashmir's saint.",
    "minutes": 6,
    "tag": "Life Story · Kashmir · Kashmiri",
    "region": "Kashmir",
    "language": "Kashmiri",
    "source": "Shruks of Nund Rishi"
   },
   {
    "id": "hs-basavanna",
    "title": "Basavanna",
    "blurb": "The vachana poet who rejected caste.",
    "minutes": 6,
    "tag": "Life Story · Karnataka · Kannada",
    "region": "Karnataka",
    "language": "Kannada",
    "source": "Vachana literature"
   },
   {
    "id": "hs-purandara-dasa",
    "title": "Purandara Dasa",
    "blurb": "The father of Carnatic music.",
    "minutes": 6,
    "tag": "Life Story · Karnataka · Kannada",
    "region": "Karnataka",
    "language": "Kannada",
    "source": "Haridasa tradition"
   },
   {
    "id": "hs-kanaka-dasa-s-window",
    "title": "Kanaka Dasa's Window",
    "blurb": "Krishna turns to face a shepherd.",
    "minutes": 6,
    "tag": "Life Story · Karnataka · Kannada",
    "region": "Karnataka",
    "language": "Kannada",
    "source": "Udupi tradition"
   },
   {
    "id": "hs-thyagaraja",
    "title": "Thyagaraja",
    "blurb": "The saint-composer of Thiruvaiyaru.",
    "minutes": 6,
    "tag": "Life Story · Tamil Nadu · Telugu",
    "region": "Tamil Nadu",
    "language": "Telugu",
    "source": "Thyagaraja tradition"
   },
   {
    "id": "hs-andal",
    "title": "Andal",
    "blurb": "The girl who married Ranganatha.",
    "minutes": 6,
    "tag": "Life Story · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Tiruppavai"
   },
   {
    "id": "hs-thiruvalluvar",
    "title": "Thiruvalluvar",
    "blurb": "The weaver-poet of the Kural.",
    "minutes": 6,
    "tag": "Life Story · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Tirukkural"
   },
   {
    "id": "hs-avvaiyar",
    "title": "Avvaiyar",
    "blurb": "The wandering poetess.",
    "minutes": 6,
    "tag": "Life Story · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Sangam & Avvaiyar tradition"
   },
   {
    "id": "hs-karaikkal-ammaiyar",
    "title": "Karaikkal Ammaiyar",
    "blurb": "The saint who became a skeleton.",
    "minutes": 6,
    "tag": "Life Story · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Periya Puranam"
   },
   {
    "id": "hs-nandanar",
    "title": "Nandanar",
    "blurb": "The outcaste saint of Chidambaram.",
    "minutes": 6,
    "tag": "Life Story · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Periya Puranam"
   },
   {
    "id": "hs-annamacharya",
    "title": "Annamacharya",
    "blurb": "32,000 songs to Venkateswara.",
    "minutes": 6,
    "tag": "Life Story · Andhra Pradesh · Telugu",
    "region": "Andhra Pradesh",
    "language": "Telugu",
    "source": "Tallapaka copper plates"
   },
   {
    "id": "hs-vemana",
    "title": "Vemana",
    "blurb": "The rebel poet of Andhra.",
    "minutes": 6,
    "tag": "Life Story · Andhra Pradesh · Telugu",
    "region": "Andhra Pradesh",
    "language": "Telugu",
    "source": "Vemana Satakam"
   },
   {
    "id": "hs-potana",
    "title": "Potana",
    "blurb": "The farmer-poet who translated the Bhagavata.",
    "minutes": 6,
    "tag": "Life Story · Telangana · Telugu",
    "region": "Telangana",
    "language": "Telugu",
    "source": "Andhra Maha Bhagavatamu"
   },
   {
    "id": "hs-tukaram-s-floating-manuscripts",
    "title": "Tukaram's Floating Manuscripts",
    "blurb": "The abhangs returned by the river.",
    "minutes": 6,
    "tag": "Life Story · Maharashtra · Marathi",
    "region": "Maharashtra",
    "language": "Marathi",
    "source": "Tukaram Gatha"
   },
   {
    "id": "hs-dnyaneshwar",
    "title": "Dnyaneshwar",
    "blurb": "The boy who wrote the Dnyaneshwari.",
    "minutes": 6,
    "tag": "Life Story · Maharashtra · Marathi",
    "region": "Maharashtra",
    "language": "Marathi",
    "source": "Dnyaneshwari"
   },
   {
    "id": "hs-janabai",
    "title": "Janabai",
    "blurb": "The maid-poet of Pandharpur.",
    "minutes": 6,
    "tag": "Life Story · Maharashtra · Marathi",
    "region": "Maharashtra",
    "language": "Marathi",
    "source": "Varkari tradition"
   },
   {
    "id": "hs-chokhamela",
    "title": "Chokhamela",
    "blurb": "The untouchable saint buried at the temple steps.",
    "minutes": 6,
    "tag": "Life Story · Maharashtra · Marathi",
    "region": "Maharashtra",
    "language": "Marathi",
    "source": "Varkari tradition"
   },
   {
    "id": "hs-chaitanya-mahaprabhu",
    "title": "Chaitanya Mahaprabhu",
    "blurb": "The ecstatic saint of Nabadwip.",
    "minutes": 6,
    "tag": "Life Story · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Chaitanya Charitamrita"
   },
   {
    "id": "hs-lalon-fakir",
    "title": "Lalon Fakir",
    "blurb": "The Baul who asked what caste is.",
    "minutes": 6,
    "tag": "Life Story · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Lalon songs"
   },
   {
    "id": "hs-sankardev",
    "title": "Sankardev",
    "blurb": "Assam's poet, playwright and reformer.",
    "minutes": 6,
    "tag": "Life Story · Assam · Assamese",
    "region": "Assam",
    "language": "Assamese",
    "source": "Sankardev tradition"
   },
   {
    "id": "hs-jyoti-prasad-agarwala",
    "title": "Jyoti Prasad Agarwala",
    "blurb": "Assam's first filmmaker.",
    "minutes": 6,
    "tag": "Life Story · Assam · Assamese",
    "region": "Assam",
    "language": "Assamese",
    "source": "Assamese cultural history"
   },
   {
    "id": "hs-bhupen-hazarika",
    "title": "Bhupen Hazarika",
    "blurb": "The bard of the Brahmaputra.",
    "minutes": 6,
    "tag": "Life Story · Assam · Assamese",
    "region": "Assam",
    "language": "Assamese",
    "source": "Assamese cultural history"
   },
   {
    "id": "hs-narsinh-mehta",
    "title": "Narsinh Mehta",
    "blurb": "Vaishnav Jan To and the poet of Junagadh.",
    "minutes": 6,
    "tag": "Life Story · Gujarat · Gujarati",
    "region": "Gujarat",
    "language": "Gujarati",
    "source": "Narsinh Mehta tradition"
   },
   {
    "id": "hs-sri-narayana-guru",
    "title": "Sri Narayana Guru",
    "blurb": "One caste, one religion, one god.",
    "minutes": 6,
    "tag": "Life Story · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Kerala reform history"
   },
   {
    "id": "hs-ayyankali-s-bullock-cart",
    "title": "Ayyankali's Bullock Cart",
    "blurb": "Riding the road forbidden to his people.",
    "minutes": 6,
    "tag": "Life Story · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Kerala reform history"
   },
   {
    "id": "hs-thunchaththu-ezhuthachan",
    "title": "Thunchaththu Ezhuthachan",
    "blurb": "The father of Malayalam.",
    "minutes": 6,
    "tag": "Life Story · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Adhyatma Ramayanam"
   },
   {
    "id": "hs-savitribai-phule",
    "title": "Savitribai Phule",
    "blurb": "The first woman teacher.",
    "minutes": 6,
    "tag": "Life Story · Maharashtra · Marathi",
    "region": "Maharashtra",
    "language": "Marathi",
    "source": "Phule history"
   },
   {
    "id": "hs-jhalkari-bai",
    "title": "Jhalkari Bai",
    "blurb": "Lakshmibai's double.",
    "minutes": 6,
    "tag": "Life Story · Uttar Pradesh · Bundeli",
    "region": "Uttar Pradesh",
    "language": "Bundeli",
    "source": "Bundelkhand oral tradition"
   },
   {
    "id": "hs-uda-devi",
    "title": "Uda Devi",
    "blurb": "The Pasi woman who shot from a tree in 1857.",
    "minutes": 6,
    "tag": "Life Story · Uttar Pradesh · Awadhi",
    "region": "Uttar Pradesh",
    "language": "Awadhi",
    "source": "1857 history"
   },
   {
    "id": "hs-tirot-sing",
    "title": "Tirot Sing",
    "blurb": "The Khasi chief who fought the British.",
    "minutes": 6,
    "tag": "Life Story · Meghalaya · Khasi",
    "region": "Meghalaya",
    "language": "Khasi",
    "source": "Khasi history"
   },
   {
    "id": "hs-pa-togan-sangma",
    "title": "Pa Togan Sangma",
    "blurb": "The Garo warrior of 1872.",
    "minutes": 6,
    "tag": "Life Story · Meghalaya · Garo",
    "region": "Meghalaya",
    "language": "Garo",
    "source": "Garo history"
   },
   {
    "id": "hs-tilka-manjhi",
    "title": "Tilka Manjhi",
    "blurb": "The first Adivasi rebel.",
    "minutes": 6,
    "tag": "Life Story · Bihar · Santali",
    "region": "Bihar",
    "language": "Santali",
    "source": "Paharia history"
   },
   {
    "id": "hs-alluri-sitarama-raju",
    "title": "Alluri Sitarama Raju",
    "blurb": "The Rampa rebellion.",
    "minutes": 6,
    "tag": "Life Story · Andhra Pradesh · Telugu",
    "region": "Andhra Pradesh",
    "language": "Telugu",
    "source": "Andhra history"
   },
   {
    "id": "hs-komaram-bheem",
    "title": "Komaram Bheem",
    "blurb": "Jal, jungle, zameen.",
    "minutes": 6,
    "tag": "Life Story · Telangana · Gondi",
    "region": "Telangana",
    "language": "Gondi",
    "source": "Gond history"
   },
   {
    "id": "hs-tantya-bhil",
    "title": "Tantya Bhil",
    "blurb": "The Indian Robin Hood.",
    "minutes": 6,
    "tag": "Life Story · Madhya Pradesh · Bhili",
    "region": "Madhya Pradesh",
    "language": "Bhili",
    "source": "Bhil history"
   },
   {
    "id": "hs-veer-narayan-singh",
    "title": "Veer Narayan Singh",
    "blurb": "Chhattisgarh's first martyr.",
    "minutes": 6,
    "tag": "Life Story · Chhattisgarh · Chhattisgarhi",
    "region": "Chhattisgarh",
    "language": "Chhattisgarhi",
    "source": "Sonakhan history"
   },
   {
    "id": "hs-bhagat-singh-s-notebook",
    "title": "Bhagat Singh's Notebook",
    "blurb": "The jail diary of a revolutionary.",
    "minutes": 6,
    "tag": "Life Story · Punjab · Punjabi",
    "region": "Punjab",
    "language": "Punjabi",
    "source": "Jail notebook"
   },
   {
    "id": "hs-rabindranath-at-santiniketan",
    "title": "Rabindranath at Santiniketan",
    "blurb": "A school under the trees.",
    "minutes": 6,
    "tag": "Life Story · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Santiniketan history"
   },
   {
    "id": "hs-kazi-nazrul-islam",
    "title": "Kazi Nazrul Islam",
    "blurb": "The rebel poet.",
    "minutes": 6,
    "tag": "Life Story · West Bengal · Bengali",
    "region": "West Bengal",
    "language": "Bengali",
    "source": "Nazrul history"
   },
   {
    "id": "hs-subramania-bharati",
    "title": "Subramania Bharati",
    "blurb": "Poet of Tamil freedom.",
    "minutes": 6,
    "tag": "Life Story · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Bharati history"
   },
   {
    "id": "hs-kuvempu",
    "title": "Kuvempu",
    "blurb": "Universal man of Kannada.",
    "minutes": 6,
    "tag": "Life Story · Karnataka · Kannada",
    "region": "Karnataka",
    "language": "Kannada",
    "source": "Kannada literary history"
   },
   {
    "id": "hs-mahakavi-kumaran-asan",
    "title": "Mahakavi Kumaran Asan",
    "blurb": "The fallen flower.",
    "minutes": 6,
    "tag": "Life Story · Kerala · Malayalam",
    "region": "Kerala",
    "language": "Malayalam",
    "source": "Malayalam literary history"
   },
   {
    "id": "hs-teejan-bai",
    "title": "Teejan Bai",
    "blurb": "The woman who sang the Pandavani.",
    "minutes": 6,
    "tag": "Life Story · Chhattisgarh · Chhattisgarhi",
    "region": "Chhattisgarh",
    "language": "Chhattisgarhi",
    "source": "Pandavani tradition"
   },
   {
    "id": "hs-bismillah-khan",
    "title": "Bismillah Khan",
    "blurb": "Shehnai on the ghats of Banaras.",
    "minutes": 6,
    "tag": "Life Story · Uttar Pradesh · Hindi",
    "region": "Uttar Pradesh",
    "language": "Hindi",
    "source": "Musical history"
   },
   {
    "id": "hs-m-s-subbulakshmi",
    "title": "M.S. Subbulakshmi",
    "blurb": "The voice that sang at the UN.",
    "minutes": 6,
    "tag": "Life Story · Tamil Nadu · Tamil",
    "region": "Tamil Nadu",
    "language": "Tamil",
    "source": "Musical history"
   },
   {
    "id": "hs-gulabi-sapera",
    "title": "Gulabi Sapera",
    "blurb": "Born to be buried, she became a dancer.",
    "minutes": 6,
    "tag": "Life Story · Rajasthan · Rajasthani",
    "region": "Rajasthan",
    "language": "Rajasthani",
    "source": "Kalbelia history"
   },
   {
    "id": "hs-dashrath-manjhi",
    "title": "Dashrath Manjhi",
    "blurb": "The mountain man who cut a road.",
    "minutes": 6,
    "tag": "Life Story · Bihar · Magahi",
    "region": "Bihar",
    "language": "Magahi",
    "source": "Gehlaur history"
   },
   {
    "id": "hs-jadav-payeng",
    "title": "Jadav Payeng",
    "blurb": "The forest man of Majuli.",
    "minutes": 6,
    "tag": "Life Story · Assam · Mising",
    "region": "Assam",
    "language": "Mising",
    "source": "Molai forest"
   },
   {
    "id": "hs-saalumarada-thimmakka",
    "title": "Saalumarada Thimmakka",
    "blurb": "She planted 385 banyans.",
    "minutes": 6,
    "tag": "Life Story · Karnataka · Kannada",
    "region": "Karnataka",
    "language": "Kannada",
    "source": "Hulikal history"
   }
  ]
 }
];

export const HERITAGE_STORY_BY_ID: Record<string, HeritageStory> = Object.fromEntries(
  HERITAGE_SHELVES.flatMap((s) => s.stories.map((st) => [st.id, st])),
);
