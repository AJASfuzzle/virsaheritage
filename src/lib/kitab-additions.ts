// New entries retain evidence per fact; missing facts are intentionally omitted.
export type LanguageAddition = {
  name: string;
  region: string;
  nativeName?: string;
  script?: string;
  speakers?: string;
  family?: string;
  intro?: string;
  phrase?: string;
  meaning?: string;
  status?: "Endangered" | "Vulnerable" | "Stable";
  statusSource?: string;
  group?: "Indian" | "International";
  sources: string[];
};

export const additionalLanguages: LanguageAddition[] = [
  {
    "name": "Hindi",
    "region": "Northern and central India",
    "family": "Indo-European · Indo-Aryan",
    "intro": "Hindi belongs to the Indo-European · Indo-Aryan family and is spoken in Northern and central India.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/hindi.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "हिन्दी",
    "script": "Devanagari",
    "speakers": "~322 M (India, 2011 mother tongue)",
    "phrase": "नमस्ते",
    "meaning": "Hello"
  },
  {
    "name": "Bengali",
    "region": "West Bengal · Tripura · Bangladesh",
    "family": "Indo-European · Indo-Aryan",
    "intro": "Bengali belongs to the Indo-European · Indo-Aryan family and is spoken in West Bengal · Tripura · Bangladesh.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/bengali.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "বাংলা",
    "script": "Bengali",
    "speakers": "~96.2 M (India, 2011 mother tongue)",
    "phrase": "নমস্কার",
    "meaning": "Hello"
  },
  {
    "name": "Marathi",
    "region": "Maharashtra · Goa",
    "family": "Indo-European · Indo-Aryan",
    "intro": "Marathi belongs to the Indo-European · Indo-Aryan family and is spoken in Maharashtra · Goa.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/marathi.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "मराठी",
    "script": "Devanagari",
    "speakers": "~82.8 M (India, 2011 mother tongue)",
    "phrase": "नमस्कार",
    "meaning": "Hello"
  },
  {
    "name": "Telugu",
    "region": "Andhra Pradesh · Telangana",
    "family": "Dravidian",
    "intro": "Telugu belongs to the Dravidian family and is spoken in Andhra Pradesh · Telangana.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/telugu.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "తెలుగు",
    "script": "Telugu",
    "speakers": "~80.9 M (India, 2011 mother tongue)",
    "phrase": "నమస్కారం",
    "meaning": "Hello"
  },
  {
    "name": "Tamil",
    "region": "Tamil Nadu · Sri Lanka · Singapore",
    "family": "Dravidian",
    "intro": "Tamil belongs to the Dravidian family and is spoken in Tamil Nadu · Sri Lanka · Singapore.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/tamil.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "தமிழ்",
    "script": "Tamil",
    "speakers": "~68.9 M (India, 2011 mother tongue)",
    "phrase": "வணக்கம்",
    "meaning": "Hello"
  },
  {
    "name": "Gujarati",
    "region": "Gujarat",
    "family": "Indo-European · Indo-Aryan",
    "intro": "Gujarati belongs to the Indo-European · Indo-Aryan family and is spoken in Gujarat.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/gujarati.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "ગુજરાતી",
    "script": "Gujarati",
    "speakers": "~55 M (India, 2011 mother tongue)",
    "phrase": "નમસ્તે",
    "meaning": "Hello"
  },
  {
    "name": "Urdu",
    "region": "India · Pakistan",
    "family": "Indo-European · Indo-Aryan",
    "intro": "Urdu belongs to the Indo-European · Indo-Aryan family and is spoken in India · Pakistan.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/urdu.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "اردو",
    "script": "Perso-Arabic",
    "speakers": "~50.7 M (India, 2011 mother tongue)",
    "phrase": "السلام علیکم",
    "meaning": "Peace be upon you"
  },
  {
    "name": "Kannada",
    "region": "Karnataka",
    "family": "Dravidian",
    "intro": "Kannada belongs to the Dravidian family and is spoken in Karnataka.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/kannada.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "ಕನ್ನಡ",
    "script": "Kannada",
    "speakers": "~43.5 M (India, 2011 mother tongue)",
    "phrase": "ನಮಸ್ಕಾರ",
    "meaning": "Hello"
  },
  {
    "name": "Malayalam",
    "region": "Kerala · Lakshadweep",
    "family": "Dravidian",
    "intro": "Malayalam belongs to the Dravidian family and is spoken in Kerala · Lakshadweep.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/malayalam.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "മലയാളം",
    "script": "Malayalam",
    "speakers": "~34.8 M (India, 2011 mother tongue)",
    "phrase": "നമസ്കാരം",
    "meaning": "Hello"
  },
  {
    "name": "Punjabi",
    "region": "Punjab, India · Punjab, Pakistan",
    "family": "Indo-European · Indo-Aryan",
    "intro": "Punjabi belongs to the Indo-European · Indo-Aryan family and is spoken in Punjab, India · Punjab, Pakistan.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/punjabi.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "ਪੰਜਾਬੀ / پنجابی",
    "script": "Gurmukhi · Shahmukhi",
    "speakers": "~31.1 M (India, 2011 mother tongue)",
    "phrase": "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ",
    "meaning": "A traditional greeting"
  },
  {
    "name": "Garhwali",
    "region": "Garhwal, Uttarakhand",
    "family": "Indo-European · Indo-Aryan",
    "intro": "Garhwali belongs to the Indo-European · Indo-Aryan family and is spoken in Garhwal, Uttarakhand.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/garhwali.htm",
      "https://www.omniglot.com/language/phrases/garhwali.htm"
    ],
    "speakers": "~2.48 M (India, 2011 mother tongue)",
    "nativeName": "गढ़वळि",
    "script": "Devanagari",
    "phrase": "सेमन्या",
    "meaning": "Hello"
  },
  {
    "name": "Kumaoni",
    "region": "Kumaon, Uttarakhand",
    "family": "Indo-European · Indo-Aryan",
    "intro": "Kumaoni belongs to the Indo-European · Indo-Aryan family and is spoken in Kumaon, Uttarakhand.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/kumaoni.htm"
    ],
    "speakers": "~2.08 M (India, 2011 mother tongue)",
    "nativeName": "कुमाऊँनी",
    "script": "Devanagari"
  },
  {
    "name": "Rajasthani (Marwari)",
    "region": "Western Rajasthan",
    "family": "Indo-European · Indo-Aryan",
    "intro": "Rajasthani (Marwari) belongs to the Indo-European · Indo-Aryan family and is spoken in Western Rajasthan.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/marwari.htm"
    ],
    "speakers": "~7.83 M (India, 2011 mother tongue)",
    "nativeName": "मारवाड़ी / مارواڑى",
    "script": "Devanagari · Perso-Arabic"
  },
  {
    "name": "Chhattisgarhi",
    "region": "Chhattisgarh",
    "family": "Indo-European · Indo-Aryan",
    "intro": "Chhattisgarhi belongs to the Indo-European · Indo-Aryan family and is spoken in Chhattisgarh.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/chhattisgarhi.htm"
    ],
    "speakers": "~16.2 M (India, 2011 mother tongue)",
    "nativeName": "छत्तीसगढ़ी",
    "script": "Devanagari"
  },
  {
    "name": "Magahi",
    "region": "Bihar",
    "family": "Indo-European · Indo-Aryan",
    "intro": "Magahi belongs to the Indo-European · Indo-Aryan family and is spoken in Bihar.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/magahi.htm"
    ],
    "speakers": "~12.7 M (India, 2011 mother tongue)",
    "nativeName": "मगही",
    "script": "Devanagari"
  },
  {
    "name": "Awadhi",
    "region": "Awadh, Uttar Pradesh",
    "family": "Indo-European · Indo-Aryan",
    "intro": "Awadhi belongs to the Indo-European · Indo-Aryan family and is spoken in Awadh, Uttar Pradesh.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/awadhi.htm"
    ],
    "speakers": "~3.85 M (India, 2011 mother tongue)",
    "nativeName": "अवधी",
    "script": "Devanagari · Kaithi"
  },
  {
    "name": "Bundeli",
    "region": "Bundelkhand, Madhya Pradesh · Uttar Pradesh",
    "family": "Indo-European · Indo-Aryan",
    "intro": "Bundeli belongs to the Indo-European · Indo-Aryan family and is spoken in Bundelkhand, Madhya Pradesh · Uttar Pradesh.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://en.wikipedia.org/wiki/Bundeli_language"
    ],
    "speakers": "~5.63 M (India, 2011 mother tongue)",
    "nativeName": "बुन्देली",
    "script": "Devanagari"
  },
  {
    "name": "Haryanvi",
    "region": "Haryana",
    "family": "Indo-European · Indo-Aryan",
    "intro": "Haryanvi belongs to the Indo-European · Indo-Aryan family and is spoken in Haryana.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/haryanvi.htm"
    ],
    "speakers": "~9.81 M (India, 2011 mother tongue)",
    "nativeName": "हरयाणवी",
    "script": "Devanagari"
  },
  {
    "name": "Kinnauri",
    "region": "Kinnaur, Himachal Pradesh",
    "family": "Sino-Tibetan",
    "intro": "Kinnauri belongs to the Sino-Tibetan family and is spoken in Kinnaur, Himachal Pradesh.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.endangeredlanguages.com/elp-language/4373"
    ],
    "speakers": "~83,400 (India, 2011 mother tongue)"
  },
  {
    "name": "Sora (Saora)",
    "region": "Odisha · Andhra Pradesh",
    "family": "Austroasiatic · Munda",
    "intro": "Sora (Saora) belongs to the Austroasiatic · Munda family and is spoken in Odisha · Andhra Pradesh.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/sora.htm"
    ],
    "nativeName": "𑃐𑃚𑃝 / ସଉରା",
    "script": "Sorang Sompeng · Odia · Telugu · Latin"
  },
  {
    "name": "Kui",
    "region": "Odisha",
    "family": "Dravidian",
    "intro": "Kui belongs to the Dravidian family and is spoken in Odisha.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.endangeredalphabets.net/kui/"
    ],
    "speakers": "~941,000 (India, 2011 mother tongue)",
    "nativeName": "କୁଈ",
    "script": "Odia"
  },
  {
    "name": "Kuvi",
    "region": "Odisha · Andhra Pradesh",
    "family": "Dravidian",
    "intro": "Kuvi belongs to the Dravidian family and is spoken in Odisha · Andhra Pradesh.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://en.wikipedia.org/wiki/Kuvi_language"
    ],
    "nativeName": "କୁଭି / କୁୱି",
    "script": "Odia"
  },
  {
    "name": "Juang",
    "region": "Odisha",
    "family": "Austroasiatic · Munda",
    "intro": "Juang belongs to the Austroasiatic · Munda family and is spoken in Odisha.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/juang.htm"
    ],
    "speakers": "~30,400 (India, 2011 mother tongue)",
    "nativeName": "ଜୁଆଙ୍",
    "script": "Odia"
  },
  {
    "name": "Birhor",
    "region": "Jharkhand and adjoining states",
    "family": "Austroasiatic · Munda",
    "intro": "Birhor belongs to the Austroasiatic · Munda family and is spoken in Jharkhand and adjoining states.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/dec/doc2025125718201.pdf",
      "https://wikitongues.org/languages/biy/",
      "https://en.wikipedia.org/wiki/Birhor_language"
    ],
    "status": "Endangered",
    "statusSource": "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/dec/doc2025125718201.pdf",
    "nativeName": "बिरहोर",
    "script": "Devanagari"
  },
  {
    "name": "Asur",
    "region": "Jharkhand",
    "family": "Austroasiatic · Munda",
    "intro": "Asur belongs to the Austroasiatic · Munda family and is spoken in Jharkhand.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.endangeredlanguages.com/elp-language/1579"
    ]
  },
  {
    "name": "Kharia",
    "region": "Jharkhand · Odisha",
    "family": "Austroasiatic · Munda",
    "intro": "Kharia belongs to the Austroasiatic · Munda family and is spoken in Jharkhand · Odisha.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/kharia.htm"
    ],
    "speakers": "~294,000 (India, 2011 mother tongue)",
    "nativeName": "खड़िया / ଖଡ଼ିଯା / খরিযা",
    "script": "Devanagari · Odia · Bengali"
  },
  {
    "name": "Malto",
    "region": "Rajmahal Hills, Jharkhand",
    "family": "Dravidian",
    "intro": "Malto belongs to the Dravidian family and is spoken in Rajmahal Hills, Jharkhand.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/malto.htm"
    ]
  },
  {
    "name": "Sadri (Nagpuri)",
    "region": "Jharkhand and adjoining eastern India",
    "family": "Indo-European · Indo-Aryan",
    "intro": "Sadri and Nagpuri names occur in eastern India; Census records Sadan/Sadri and Nagpuria separately.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/sadri.htm"
    ],
    "nativeName": "सादरी / সাদরী / ସାଦରୀ",
    "script": "Devanagari · Bengali · Odia · Latin"
  },
  {
    "name": "Lambadi (Banjara)",
    "region": "Karnataka · Telangana · Deccan",
    "family": "Indo-European · Indo-Aryan",
    "intro": "The language of Banjara communities; Census reports Lambadi, Banjari and Sugali under separate labels.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/lambadi.htm"
    ],
    "nativeName": "बंजारा / లంబాడి / ಲಂಬಾಣಿ",
    "script": "Devanagari · Telugu · Kannada"
  },
  {
    "name": "Kota",
    "region": "Nilgiris, Tamil Nadu",
    "family": "Dravidian",
    "intro": "Kota belongs to the Dravidian family and is spoken in Nilgiris, Tamil Nadu.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.endangeredlanguages.com/elp-language/4369"
    ],
    "status": "Endangered",
    "statusSource": "https://www.endangeredlanguages.com/elp-language/4369"
  },
  {
    "name": "Kurumba",
    "region": "Nilgiris, Tamil Nadu · Kerala · Karnataka",
    "family": "Dravidian",
    "intro": "Kurumba is a cover term for several distinct Southern Dravidian languages of the Nilgiris.",
    "sources": [
      "https://dobes.mpi.nl/posters/print/eurasia-kurumba-print.pdf"
    ]
  },
  {
    "name": "Paniya",
    "region": "Kerala · Nilgiris",
    "family": "Dravidian",
    "intro": "Paniya belongs to the Dravidian family and is spoken in Kerala · Nilgiris.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://en.wikipedia.org/wiki/Paniya_language"
    ],
    "nativeName": "പണിയ"
  },
  {
    "name": "Beary",
    "region": "Coastal Karnataka · Northern Kerala",
    "family": "Dravidian",
    "intro": "Beary belongs to the Dravidian family and is spoken in Coastal Karnataka · Northern Kerala.",
    "sources": [
      "https://www.omniglot.com/writing/beary.htm",
      "https://www.omniglot.com/writing/beary.htm"
    ],
    "nativeName": "ಬ್ಯಾರಿ",
    "script": "Kannada · Arabic"
  },
  {
    "name": "Adi",
    "region": "Arunachal Pradesh",
    "family": "Sino-Tibetan · Tani",
    "intro": "Adi belongs to the Sino-Tibetan · Tani family and is spoken in Arunachal Pradesh.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/adi.htm"
    ],
    "nativeName": "Adi",
    "script": "Latin"
  },
  {
    "name": "Galo",
    "region": "Arunachal Pradesh · Assam",
    "family": "Sino-Tibetan · Tani",
    "intro": "Galo belongs to the Sino-Tibetan · Tani family and is spoken in Arunachal Pradesh · Assam.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/galo.htm",
      "https://www.omniglot.com/language/phrases/galo.htm"
    ],
    "nativeName": "gallo",
    "script": "Latin",
    "phrase": "Aldure",
    "meaning": "Hello (Karka dialect)"
  },
  {
    "name": "Monpa",
    "region": "Western Arunachal Pradesh",
    "family": "Sino-Tibetan",
    "intro": "Monpa is a community label covering distinct language varieties in western Arunachal Pradesh.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf"
    ]
  },
  {
    "name": "Wancho",
    "region": "Longding, Arunachal Pradesh",
    "family": "Sino-Tibetan",
    "intro": "Wancho belongs to the Sino-Tibetan family and is spoken in Longding, Arunachal Pradesh.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/wancho.htm"
    ],
    "speakers": "~59,200 (India, 2011 mother tongue)",
    "nativeName": "वांचो",
    "script": "Wancho · Devanagari · Latin"
  },
  {
    "name": "Nocte",
    "region": "Tirap, Arunachal Pradesh",
    "family": "Sino-Tibetan",
    "intro": "Nocte belongs to the Sino-Tibetan family and is spoken in Tirap, Arunachal Pradesh.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf"
    ],
    "speakers": "~29,800 (India, 2011 mother tongue)"
  },
  {
    "name": "Tangsa",
    "region": "Arunachal Pradesh · Assam · Myanmar",
    "family": "Sino-Tibetan",
    "intro": "Tangsa covers multiple Sino-Tibetan varieties across northeastern India and Myanmar.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/tangsa.htm"
    ],
    "script": "Latin · Tangsa (Mossang variety)"
  },
  {
    "name": "Sherdukpen",
    "region": "West Kameng, Arunachal Pradesh",
    "family": "Sino-Tibetan",
    "intro": "Sherdukpen belongs to the Sino-Tibetan family and is spoken in West Kameng, Arunachal Pradesh.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/language/numbers/sherdukpen.htm"
    ],
    "nativeName": "Mey nyuk"
  },
  {
    "name": "Thadou (Kuki)",
    "region": "Manipur and adjoining northeastern states",
    "family": "Sino-Tibetan",
    "intro": "Thadou (Kuki) belongs to the Sino-Tibetan family and is spoken in Manipur and adjoining northeastern states.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/thadou.htm"
    ],
    "speakers": "~227,000 (India, 2011 mother tongue)",
    "nativeName": "Thadou pao",
    "script": "Latin"
  },
  {
    "name": "Hmar",
    "region": "Manipur · Mizoram · Assam",
    "family": "Sino-Tibetan",
    "intro": "Hmar belongs to the Sino-Tibetan family and is spoken in Manipur · Mizoram · Assam.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/hmar.htm",
      "https://www.omniglot.com/language/phrases/hmar.htm"
    ],
    "speakers": "~99,000 (India, 2011 mother tongue)",
    "nativeName": "Hmar Țawng",
    "script": "Latin",
    "phrase": "Chibai",
    "meaning": "Hello"
  },
  {
    "name": "Sumi (Sema)",
    "region": "Nagaland",
    "family": "Sino-Tibetan",
    "intro": "Sumi (Sema) belongs to the Sino-Tibetan family and is spoken in Nagaland.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/sumi.htm"
    ],
    "nativeName": "Sümi",
    "script": "Latin"
  },
  {
    "name": "Rengma",
    "region": "Nagaland · Assam",
    "family": "Sino-Tibetan",
    "intro": "Rengma belongs to the Sino-Tibetan family and is spoken in Nagaland · Assam.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf"
    ],
    "speakers": "~65,300 (India, 2011 mother tongue)"
  },
  {
    "name": "Dimasa",
    "region": "Assam · Nagaland",
    "family": "Sino-Tibetan",
    "intro": "Dimasa belongs to the Sino-Tibetan family and is spoken in Assam · Nagaland.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/dimasa.htm"
    ],
    "speakers": "~133,000 (India, 2011 mother tongue)",
    "nativeName": "Grao-Dima",
    "script": "Latin"
  },
  {
    "name": "Rabha",
    "region": "Assam · Meghalaya",
    "family": "Sino-Tibetan",
    "intro": "Rabha belongs to the Sino-Tibetan family and is spoken in Assam · Meghalaya.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://www.omniglot.com/writing/rabha.htm"
    ],
    "speakers": "~140,000 (India, 2011 mother tongue)",
    "nativeName": "ৰাভা",
    "script": "Assamese / Bengali · Latin"
  },
  {
    "name": "Tiwa",
    "region": "Assam · Meghalaya",
    "family": "Sino-Tibetan",
    "intro": "Tiwa belongs to the Sino-Tibetan family and is spoken in Assam · Meghalaya.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://en.wikipedia.org/wiki/Tiwa_language_(India)"
    ],
    "speakers": "~33,900 (India, 2011 mother tongue)",
    "nativeName": "তিৱা / Tiwa",
    "script": "Latin · Assamese"
  },
  {
    "name": "Toto",
    "region": "Totopara, West Bengal",
    "family": "Sino-Tibetan",
    "intro": "Toto belongs to the Sino-Tibetan family and is spoken in Totopara, West Bengal.",
    "sources": [
      "https://censusindia.mha.gov.in/nada/index.php/catalog/42458/download/46089/C-16_25062018.pdf",
      "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/dec/doc2025125718201.pdf",
      "https://www.omniglot.com/writing/toto.htm"
    ],
    "status": "Endangered",
    "statusSource": "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/dec/doc2025125718201.pdf",
    "nativeName": "তোতো",
    "script": "Bengali · Toto (limited use)"
  },
  {
    "name": "Onge",
    "region": "Little Andaman",
    "family": "Ongan",
    "intro": "Onge belongs to the Ongan family and is spoken in Little Andaman.",
    "sources": [
      "https://endangeredlanguages.com/elp-language/onge",
      "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/dec/doc2025125718201.pdf",
      "https://www.omniglot.com/writing/onge.htm"
    ],
    "status": "Endangered",
    "statusSource": "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/dec/doc2025125718201.pdf",
    "nativeName": "Öñge",
    "script": "Latin · Devanagari"
  },
  {
    "name": "Italian",
    "region": "Italy · Switzerland · San Marino · Vatican City",
    "family": "Indo-European · Romance",
    "intro": "Italian belongs to the Indo-European · Romance family and is spoken in Italy · Switzerland · San Marino · Vatican City.",
    "sources": [
      "https://www.omniglot.com/writing/italian.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "italiano",
    "script": "Latin",
    "group": "International",
    "phrase": "Ciao",
    "meaning": "Hello (informal)",
    "speakers": "~64 M (native; source undated)"
  },
  {
    "name": "Greek",
    "region": "Greece · Cyprus",
    "family": "Indo-European · Hellenic",
    "intro": "Greek belongs to the Indo-European · Hellenic family and is spoken in Greece · Cyprus.",
    "sources": [
      "https://www.omniglot.com/writing/greek.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "ελληνικά",
    "script": "Greek",
    "group": "International",
    "phrase": "Γεια σου",
    "meaning": "Hello (informal, singular)",
    "speakers": "~13.1 M (2012)"
  },
  {
    "name": "Hebrew",
    "region": "Israel · diaspora",
    "family": "Afro-Asiatic · Semitic",
    "intro": "Hebrew belongs to the Afro-Asiatic · Semitic family and is spoken in Israel · diaspora.",
    "sources": [
      "https://www.omniglot.com/writing/hebrew.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "עברית",
    "script": "Hebrew",
    "group": "International",
    "phrase": "שלום",
    "meaning": "Hello / peace",
    "speakers": "~7.4 M (source undated)"
  },
  {
    "name": "Burmese",
    "region": "Myanmar",
    "family": "Sino-Tibetan",
    "intro": "Burmese belongs to the Sino-Tibetan family and is spoken in Myanmar.",
    "sources": [
      "https://www.omniglot.com/writing/burmese.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "မြန်မာဘာသာ",
    "script": "Myanmar",
    "group": "International",
    "phrase": "မင်္ဂလာပါ",
    "meaning": "Hello",
    "speakers": "~33 M (native, 2007)"
  },
  {
    "name": "Khmer",
    "region": "Cambodia · Vietnam · Thailand",
    "family": "Austroasiatic",
    "intro": "Khmer belongs to the Austroasiatic family and is spoken in Cambodia · Vietnam · Thailand.",
    "sources": [
      "https://www.omniglot.com/writing/khmer.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "ភាសាខ្មែរ",
    "script": "Khmer",
    "group": "International",
    "phrase": "ជំរាបសួរ",
    "meaning": "Hello (formal)"
  },
  {
    "name": "Vietnamese",
    "region": "Vietnam · diaspora",
    "family": "Austroasiatic · Vietic",
    "intro": "Vietnamese belongs to the Austroasiatic · Vietic family and is spoken in Vietnam · diaspora.",
    "sources": [
      "https://www.omniglot.com/writing/vietnamese.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "tiếng Việt",
    "script": "Latin (quốc ngữ)",
    "group": "International",
    "phrase": "Xin chào",
    "meaning": "Hello",
    "speakers": "~76 M (source undated)"
  },
  {
    "name": "Malay",
    "region": "Malaysia · Brunei · Singapore · Southern Thailand",
    "family": "Austronesian · Malayic",
    "intro": "Malay belongs to the Austronesian · Malayic family and is spoken in Malaysia · Brunei · Singapore · Southern Thailand.",
    "sources": [
      "https://www.omniglot.com/writing/malay.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "Bahasa Melayu",
    "script": "Latin (Rumi) · Arabic (Jawi)",
    "group": "International",
    "phrase": "Selamat pagi",
    "meaning": "Good morning",
    "speakers": "~18 M (Standard Malay; source undated)"
  },
  {
    "name": "Filipino (Tagalog)",
    "region": "Philippines · diaspora",
    "family": "Austronesian",
    "intro": "Filipino is a standardized register based on Tagalog, with influences from other Philippine languages.",
    "sources": [
      "https://www.omniglot.com/writing/tagalog.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "Wikang Filipino / Wikang Tagalog",
    "script": "Latin",
    "group": "International",
    "phrase": "Kumusta?",
    "meaning": "How are you?",
    "speakers": "~22.5 M (Tagalog, Philippines, 2010)"
  },
  {
    "name": "Hausa",
    "region": "Nigeria · Niger · West Africa",
    "family": "Afro-Asiatic · Chadic",
    "intro": "Hausa belongs to the Afro-Asiatic · Chadic family and is spoken in Nigeria · Niger · West Africa.",
    "sources": [
      "https://www.omniglot.com/writing/hausa.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "Harshen Hausa",
    "script": "Latin (Boko) · Arabic (Ajami)",
    "group": "International",
    "phrase": "Sannu",
    "meaning": "Hello",
    "speakers": "~53.7 M (Nigeria, 2018)"
  },
  {
    "name": "Yoruba",
    "region": "Nigeria · Benin · Togo",
    "family": "Niger-Congo · Yoruboid",
    "intro": "Yoruba belongs to the Niger-Congo · Yoruboid family and is spoken in Nigeria · Benin · Togo.",
    "sources": [
      "https://www.omniglot.com/writing/yoruba.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "Èdè Yorùbá",
    "script": "Latin",
    "group": "International",
    "phrase": "Ẹ káàárọ̀",
    "meaning": "Good morning (respectful)",
    "speakers": "~43 M (source undated)"
  },
  {
    "name": "Zulu",
    "region": "South Africa, especially KwaZulu-Natal",
    "family": "Niger-Congo · Bantu",
    "intro": "Zulu belongs to the Niger-Congo · Bantu family and is spoken in South Africa, especially KwaZulu-Natal.",
    "sources": [
      "https://www.omniglot.com/writing/zulu.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "isiZulu",
    "script": "Latin",
    "group": "International",
    "phrase": "Sawubona",
    "meaning": "Hello (singular)",
    "speakers": "~11.6 M (native, South Africa; source undated)"
  },
  {
    "name": "Amharic",
    "region": "Ethiopia · diaspora",
    "family": "Afro-Asiatic · Semitic",
    "intro": "Amharic belongs to the Afro-Asiatic · Semitic family and is spoken in Ethiopia · diaspora.",
    "sources": [
      "https://www.omniglot.com/writing/amharic.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "አማርኛ",
    "script": "Ethiopic",
    "group": "International",
    "phrase": "ሰላም",
    "meaning": "Hello / peace"
  },
  {
    "name": "Quechua",
    "region": "Andes: Peru · Bolivia · Ecuador",
    "family": "Quechuan",
    "intro": "Quechua is a family of related Andean languages; the phrase here is from Cusco Quechua.",
    "sources": [
      "https://www.omniglot.com/writing/quechua.htm",
      "https://omniglot.com/language/phrases/hello.htm",
      "https://www.omniglot.com/language/phrases/quechua.php"
    ],
    "nativeName": "Runa Simi",
    "script": "Latin",
    "group": "International",
    "phrase": "Rimaykullayki",
    "meaning": "Hello (Cusco Quechua)",
    "speakers": "~7.7 M (Quechuan languages; source undated)"
  },
  {
    "name": "Māori",
    "region": "Aotearoa New Zealand",
    "family": "Austronesian · Polynesian",
    "intro": "Māori belongs to the Austronesian · Polynesian family and is spoken in Aotearoa New Zealand.",
    "sources": [
      "https://www.omniglot.com/writing/maori.htm",
      "https://omniglot.com/language/phrases/hello.htm",
      "https://figure.nz/chart/7p1Q6eUSokoVeqwv"
    ],
    "nativeName": "te reo Māori",
    "script": "Latin",
    "group": "International",
    "phrase": "Kia ora",
    "meaning": "Hello",
    "speakers": "~214,000 (NZ speaking ability, 2023)"
  },
  {
    "name": "Welsh",
    "region": "Wales",
    "family": "Indo-European · Celtic",
    "intro": "Welsh belongs to the Indo-European · Celtic family and is spoken in Wales.",
    "sources": [
      "https://www.omniglot.com/writing/welsh.htm",
      "https://omniglot.com/language/phrases/hello.htm",
      "https://www.ons.gov.uk/peoplepopulationandcommunity/culturalidentity/language/bulletins/welshlanguagewales/census2021"
    ],
    "nativeName": "Cymraeg",
    "script": "Latin",
    "group": "International",
    "phrase": "Bore da",
    "meaning": "Good morning",
    "speakers": "~538,000 (Wales, age 3+, 2021)"
  },
  {
    "name": "Irish",
    "region": "Ireland · Northern Ireland",
    "family": "Indo-European · Celtic",
    "intro": "Irish belongs to the Indo-European · Celtic family and is spoken in Ireland · Northern Ireland.",
    "sources": [
      "https://www.omniglot.com/writing/irish.htm",
      "https://omniglot.com/language/phrases/hello.htm",
      "https://www.cso.ie/en/releasesandpublications/ep/p-cpp8/censusofpopulation2022profile8-theirishlanguageandeducation/keyfindings/"
    ],
    "nativeName": "Gaeilge",
    "script": "Latin",
    "group": "International",
    "phrase": "Dia duit",
    "meaning": "Hello (singular)",
    "speakers": "~1.9 M (Republic of Ireland, reported ability, 2022)"
  },
  {
    "name": "Basque",
    "region": "Basque Country, Spain · France",
    "family": "Language isolate",
    "intro": "Basque belongs to the Language isolate family and is spoken in Basque Country, Spain · France.",
    "sources": [
      "https://www.omniglot.com/writing/basque.htm",
      "https://omniglot.com/language/phrases/hello.htm"
    ],
    "nativeName": "euskara",
    "script": "Latin",
    "group": "International",
    "phrase": "Kaixo",
    "meaning": "Hello",
    "speakers": "~751,500 (2016 reference estimate)"
  },
  {
    "name": "Ainu",
    "region": "Hokkaidō, Japan",
    "family": "Language isolate",
    "intro": "Ainu belongs to the Language isolate family and is spoken in Hokkaidō, Japan.",
    "sources": [
      "https://www.omniglot.com/writing/ainu.htm",
      "https://omniglot.com/language/phrases/hello.htm",
      "https://en.wal.unesco.org/countries/japan/languages/hokkaido-ainu",
      "https://thelanguageatlas.com/language/ainu/"
    ],
    "nativeName": "Aynu=itak / アィヌ・イタㇰ",
    "script": "Katakana · Latin",
    "group": "International",
    "phrase": "Irankarapte",
    "meaning": "Hello",
    "status": "Endangered",
    "statusSource": "https://en.wal.unesco.org/countries/japan/languages/hokkaido-ainu"
  }
];
