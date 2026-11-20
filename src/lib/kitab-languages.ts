import { additionalLanguages } from "./kitab-additions";

export type Lang = {
  name: string;
  region: string;
  speakers?: string;
  nativeName?: string;
  script?: string;
  family?: string;
  intro?: string;
  sources?: string[];
  statusSource?: string;
  status?: "Endangered" | "Vulnerable" | "Stable";
  phrase?: string;
  bcp47?: string;
  meaning?: string;
  voiceId: string;
  group?: "Indian" | "International";
};

// Each language is paired with a distinct ElevenLabs voice so every
// keeper sounds unique. IDs from the curated Top Voice list.
const rawLanguages: Array<Omit<Lang, "voiceId"> & { voiceId?: string }> = [
  { name: "Toda", region: "Nilgiris, Tamil Nadu", speakers: "~1,600", status: "Endangered", phrase: "Mox vey kox", meaning: "May the hills bless you.", bcp47: "ta-IN", voiceId: "EXAVITQu4vr4xnSDxMaL" /* Sarah */ },
  { name: "Sanketi", region: "Karnataka", speakers: "~15,000", status: "Vulnerable", phrase: "Tān ennāva sollū", meaning: "Tell me what you mean.", bcp47: "kn-IN", voiceId: "XrExE9yKIg1WjnnlVkGX" /* Matilda */ },
  { name: "Kurukh", region: "Jharkhand · Odisha", speakers: "~2.2 M", status: "Stable", phrase: "Niu kanḍ joka", meaning: "Where are you going?", bcp47: "hi-IN", voiceId: "onwK4e9ZLuTAKqWW03F9" /* Daniel */ },
  { name: "Kodava", region: "Coorg, Karnataka", speakers: "~166,000", status: "Vulnerable", phrase: "Nin enyaa ulla", meaning: "How are you keeping?", bcp47: "kn-IN", voiceId: "Xb7hH8MSUJpSbSDYk0k2" /* Alice */ },
  { name: "Mising", region: "Assam · Arunachal", speakers: "~600,000", status: "Vulnerable", phrase: "No yumké do", meaning: "Are you well?", bcp47: "as-IN", voiceId: "IKne3meq5aSn9XLyUdCD" /* Charlie */ },
  { name: "Khasi", region: "Meghalaya", speakers: "~1.4 M", status: "Stable", phrase: "Khublei shibun", meaning: "Thank you, deeply.", bcp47: "en-IN", voiceId: "FGY2WhTYpPnrIDTdsKH5" /* Laura */ },
  { name: "Bhili", region: "Madhya Pradesh · Rajasthan", speakers: "~10 M", status: "Stable", phrase: "Tu kasa che", meaning: "How are you, friend?", bcp47: "hi-IN", voiceId: "JBFqnCBsd6RMkjVDRZzb" /* George */ },
  { name: "Gondi", region: "Central India", speakers: "~3 M", status: "Vulnerable", phrase: "Niwa kana mantor", meaning: "What is your name?", bcp47: "hi-IN", voiceId: "nPczCjzI2devNBz1zQrb" /* Brian */ },
  { name: "Santali", region: "Jharkhand · Bengal · Odisha", speakers: "~7.6 M", status: "Stable", phrase: "Johar, ape do banchaw", meaning: "Greetings, may you live long.", bcp47: "hi-IN", voiceId: "cgSgspJ2msm6clMCkdW9" /* Jessica */ },
  { name: "Apatani", region: "Arunachal Pradesh", speakers: "~45,000", status: "Endangered", phrase: "Inkun nyibo dula", meaning: "Walk gently with the spirits.", bcp47: "en-IN", voiceId: "pFZP5JQG7iQjIQuC4Bku" /* Lily */ },
  { name: "Mizo", region: "Mizoram", speakers: "~830,000", status: "Stable", phrase: "I dam em?", meaning: "Are you well?", bcp47: "en-IN", voiceId: "TX3LPaxmHKxFdv7VOQHJ" /* Liam */ },
  { name: "Konyak", region: "Nagaland", speakers: "~250,000", status: "Vulnerable", phrase: "Hayem aboi", meaning: "Peace be with you.", bcp47: "en-IN", voiceId: "N2lVS1w4EtoT3dr4eOWO" /* Callum */ },
  { name: "Saurashtra", region: "Tamil Nadu", speakers: "~250,000", status: "Vulnerable", phrase: "Tu kashe che", meaning: "How do you fare today?", bcp47: "ta-IN", voiceId: "cjVigY5qzO86Huf0OWal" /* Eric */ },
  { name: "Tulu", region: "Karnataka · Kerala", speakers: "~1.8 M", status: "Vulnerable", phrase: "Encha ullar", meaning: "How are you keeping?", bcp47: "kn-IN", voiceId: "pqHfZKP75CvOlQylNhV4" /* Bill */ },
  { name: "Ho", region: "Jharkhand · Odisha", speakers: "~1.4 M", status: "Stable", phrase: "Johar, am chiloka menaiya", meaning: "Greetings, how are you?", bcp47: "hi-IN", voiceId: "CwhRBWXzGAHq8TQ4Fs17" /* Roger */ },
  { name: "Ladakhi", region: "Ladakh", speakers: "~110,000", status: "Vulnerable", phrase: "Julley, kham zang-a", meaning: "Hello, are you well?", bcp47: "hi-IN", voiceId: "SAz9YHcvj6GT2YYXdXww" /* River */ },
  // --- Scheduled Indian languages ---
  { name: "Bodo", region: "Assam", speakers: "~1.5 M", status: "Vulnerable", phrase: "खुलुमबाय", meaning: "Greetings, with respect." },
  { name: "Dogri", region: "Jammu", speakers: "~2.6 M", status: "Vulnerable", phrase: "तुस केह् हाल ओ?", meaning: "How are you?" },
  { name: "Kashmiri", region: "Kashmir Valley", speakers: "~6.8 M", status: "Stable", phrase: "توہہ چھِو ٹھیک؟", meaning: "Are you well?" },
  { name: "Konkani", region: "Goa · Konkan coast", speakers: "~2.3 M", status: "Vulnerable", phrase: "देव बरें करूं", meaning: "May God bless you (thank you)." },
  { name: "Maithili", region: "Mithila, Bihar", speakers: "~13.5 M", status: "Stable", phrase: "अहाँ केहन छी?", meaning: "How are you?" },
  { name: "Manipuri", region: "Manipur", speakers: "~1.8 M", status: "Vulnerable", phrase: "ꯈꯨꯔꯨꯝꯖꯔꯤ", meaning: "I bow to you in greeting." },
  { name: "Sanskrit", region: "Pan-Indian", speakers: "~25,000", status: "Endangered", phrase: "सर्वे भवन्तु सुखिनः", meaning: "May all beings be happy." },
  { name: "Assamese", region: "Assam", speakers: "~15 M", status: "Stable", phrase: "আপুনি কেনে আছে?", meaning: "How are you?" },
  { name: "Odia", region: "Odisha", speakers: "~37 M", status: "Stable", phrase: "ଆପଣ କେମିତି ଅଛନ୍ତି?", meaning: "How are you?" },
  { name: "Nepali", region: "Sikkim · Darjeeling", speakers: "~2.9 M (India)", status: "Stable", phrase: "नमस्कार, सन्चै हुनुहुन्छ?", meaning: "Hello, are you well?" },
  { name: "Sindhi", region: "Kutch · diaspora", speakers: "~2.7 M (India)", status: "Vulnerable", phrase: "توهان ڪيئن آهيو؟", meaning: "How are you?" },
  // --- Regional, endangered & indigenous ---
  { name: "Bhojpuri", region: "Bihar · Uttar Pradesh", speakers: "~50 M", status: "Stable", phrase: "रउआ कइसन बानी?", meaning: "How are you?" },
  { name: "Garo", region: "Meghalaya", speakers: "~1.1 M", status: "Vulnerable", phrase: "Nama gipin?", meaning: "Are you well?" },
  { name: "Kokborok", region: "Tripura", speakers: "~1 M", status: "Vulnerable", phrase: "Kwrwi bwrwi?", meaning: "How are you?" },
  { name: "Lepcha", region: "Sikkim", speakers: "~50,000", status: "Endangered", phrase: "Khamri", meaning: "Greetings to you." },
  { name: "Bhutia", region: "Sikkim", speakers: "~70,000", status: "Endangered", phrase: "Kuzu zangpo la", meaning: "Hello, with respect." },
  { name: "Nyishi", region: "Arunachal Pradesh", speakers: "~300,000", status: "Vulnerable", phrase: "Ane donyi pa", meaning: "May the Sun-Mother watch over you." },
  { name: "Ao", region: "Nagaland", speakers: "~260,000", status: "Vulnerable", phrase: "Ne kumtsü ajak?", meaning: "Are you well?" },
  { name: "Angami", region: "Nagaland", speakers: "~150,000", status: "Vulnerable", phrase: "Kuolie", meaning: "Peace and greeting." },
  { name: "Lotha", region: "Nagaland", speakers: "~180,000", status: "Vulnerable", phrase: "Ana nzan to?", meaning: "How are you?" },
  { name: "Tangkhul", region: "Manipur", speakers: "~140,000", status: "Vulnerable", phrase: "Kazat paise", meaning: "Good to see you." },
  { name: "Karbi", region: "Assam", speakers: "~500,000", status: "Vulnerable", phrase: "Kardom", meaning: "Greetings." },
  { name: "Halbi", region: "Bastar, Chhattisgarh", speakers: "~800,000", status: "Vulnerable", phrase: "Tui kemon asis?", meaning: "How are you?" },
  { name: "Korku", region: "Madhya Pradesh · Maharashtra", speakers: "~700,000", status: "Vulnerable", phrase: "Johar, iñj bes", meaning: "Greetings, I am well." },
  { name: "Mundari", region: "Jharkhand", speakers: "~1.1 M", status: "Vulnerable", phrase: "Johar, am bugin menama?", meaning: "Greetings, are you well?" },
  { name: "Irula", region: "Nilgiris, Tamil Nadu", speakers: "~200,000", status: "Endangered", phrase: "Nee eppadi irukke?", meaning: "How are you?" },
  { name: "Badaga", region: "Nilgiris, Tamil Nadu", speakers: "~130,000", status: "Vulnerable", phrase: "Nee henge idde?", meaning: "How are you?" },
  { name: "Great Andamanese", region: "Andaman Islands", speakers: "<10", status: "Endangered", phrase: "Ai-te-bo", meaning: "Hello, friend." },
  { name: "Jarawa", region: "Andaman Islands", speakers: "~400", status: "Endangered", phrase: "Ue-ue", meaning: "Welcome." },
  { name: "Bishnupriya", region: "Assam · Tripura", speakers: "~115,000", status: "Endangered", phrase: "তি কিসাদে আসত?", meaning: "How are you?" },
  // --- Major international ---
  { name: "Spanish", region: "Spain · Latin America", speakers: "~560 M", status: "Stable", phrase: "Que la paz sea contigo", meaning: "May peace be with you.", group: "International" },
  { name: "French", region: "France · Africa · Canada", speakers: "~310 M", status: "Stable", phrase: "Bienvenue, mon ami", meaning: "Welcome, my friend.", group: "International" },
  { name: "Mandarin", region: "China · Taiwan", speakers: "~1.1 B", status: "Stable", phrase: "你好，欢迎", meaning: "Hello, welcome.", group: "International" },
  { name: "Arabic", region: "Middle East · North Africa", speakers: "~380 M", status: "Stable", phrase: "السلام عليكم", meaning: "Peace be upon you.", group: "International" },
  { name: "Portuguese", region: "Brazil · Portugal · Goa", speakers: "~260 M", status: "Stable", phrase: "Seja bem-vindo", meaning: "Be welcome.", group: "International" },
  { name: "Russian", region: "Russia · Central Asia", speakers: "~255 M", status: "Stable", phrase: "Добро пожаловать", meaning: "Welcome.", group: "International" },
  { name: "Japanese", region: "Japan", speakers: "~125 M", status: "Stable", phrase: "ようこそ", meaning: "Welcome.", group: "International" },
  { name: "Swahili", region: "East Africa", speakers: "~200 M", status: "Stable", phrase: "Karibu sana", meaning: "You are very welcome.", group: "International" },
  { name: "German", region: "Germany · Austria · Switzerland", speakers: "~135 M", status: "Stable", phrase: "Herzlich willkommen", meaning: "A heartfelt welcome.", group: "International" },
  { name: "Persian", region: "Iran · Afghanistan · Tajikistan", speakers: "~110 M", status: "Stable", phrase: "خوش آمدید", meaning: "Welcome.", group: "International" },
  { name: "Indonesian", region: "Indonesia", speakers: "~200 M", status: "Stable", phrase: "Selamat datang", meaning: "Welcome.", group: "International" },
  { name: "Korean", region: "Korea", speakers: "~80 M", status: "Stable", phrase: "환영합니다", meaning: "Welcome.", group: "International" },
  { name: "Turkish", region: "Türkiye", speakers: "~90 M", status: "Stable", phrase: "Hoş geldiniz", meaning: "Welcome.", group: "International" },
  { name: "Tibetan", region: "Tibet · Himachal · Ladakh", speakers: "~1.2 M", status: "Vulnerable", phrase: "བཀྲ་ཤིས་བདེ་ལེགས།", meaning: "May all be auspicious.", group: "International" },
  { name: "Sinhala", region: "Sri Lanka", speakers: "~17 M", status: "Stable", phrase: "ආයුබෝවන්", meaning: "May you live long.", group: "International" },
  { name: "Thai", region: "Thailand", speakers: "~60 M", status: "Stable", phrase: "สวัสดีครับ", meaning: "Hello, with respect.", group: "International" },
];

const VOICE_POOL = ["EXAVITQu4vr4xnSDxMaL","XrExE9yKIg1WjnnlVkGX","onwK4e9ZLuTAKqWW03F9","Xb7hH8MSUJpSbSDYk0k2","IKne3meq5aSn9XLyUdCD","FGY2WhTYpPnrIDTdsKH5","JBFqnCBsd6RMkjVDRZzb","nPczCjzI2devNBz1zQrb","cgSgspJ2msm6clMCkdW9","pFZP5JQG7iQjIQuC4Bku","TX3LPaxmHKxFdv7VOQHJ","N2lVS1w4EtoT3dr4eOWO","cjVigY5qzO86Huf0OWal","pqHfZKP75CvOlQylNhV4","CwhRBWXzGAHq8TQ4Fs17","SAz9YHcvj6GT2YYXdXww"];
const catalogue: Array<Omit<Lang, "voiceId"> & { voiceId?: string }> = [...rawLanguages, ...additionalLanguages];
export const languages: Lang[] = catalogue.map((l, i) => ({ ...l, group: l.group ?? "Indian", voiceId: l.voiceId ?? VOICE_POOL[i % VOICE_POOL.length] ?? VOICE_POOL[0] ?? "EXAVITQu4vr4xnSDxMaL" }));

export type Filter = "All" | "Indian" | "Endangered" | "International";
export const FILTERS: Filter[] = ["All", "Indian", "Endangered", "International"];


export const LANGUAGE_COUNT = languages.length;

export function filterLanguages(filter: Filter) {
  return languages.filter((l) => filter === "All" || (filter === "Endangered" ? l.status === "Endangered" : l.group === filter));
}
