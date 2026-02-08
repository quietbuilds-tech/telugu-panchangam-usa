export type Lang = 'en' | 'te';

export const LANGS: Lang[] = ['en', 'te'];

export const translations: Record<Lang, {
  brandTitle: string;
  locationSub: string;
  nav: { today: string; month: string; festivals: string; about: string };
  common: {
    previous: string;
    next: string;
    year: string;
    thisMonth: string;
    noFestivals: string;
    festivalsNotes: string;
    noteMissingSun: string;
    timesInET: string;
  };
  fields: {
    samvatsaram: string;
    ayanam: string;
    ruthuvu: string;
    masam: string;
    paksham: string;
    tithi: string;
    nakshatra: string;
    durmuhurtham: string;
    varjyam: string;
    none: string;
    unknown: string;
    until: string;
  };
  week: { sun: string; mon: string; tue: string; wed: string; thu: string; fri: string; sat: string };
  about: {
    title: string;
    blurb: string;
    sourceTitle: string;
    sourceText: string;
    includesTitle: string;
    includes: string[];
    disclaimerTitle: string;
    disclaimerText: string;
  };
}> = {
  en: {
    brandTitle: 'Telugu Panchangam USA',
    locationSub: 'New Jersey (Eastern Time)',
    nav: { today: 'Today', month: 'Month', festivals: 'Festivals', about: 'About' },
    common: {
      previous: '‹ Previous',
      next: 'Next ›',
      year: 'Year',
      thisMonth: 'This month',
      noFestivals: 'No festivals listed.',
      festivalsNotes: 'Festivals',
      noteMissingSun: 'Note: Sunrise/Sunset/Rahu Kalam are not included in the MVP data source.',
      timesInET: 'Times shown in Eastern Time (ET)',
    },
    fields: {
      samvatsaram: 'Samvatsaram',
      ayanam: 'Ayanam',
      ruthuvu: 'Ruthuvu',
      masam: 'Masam',
      paksham: 'Paksham',
      tithi: 'Tithi',
      nakshatra: 'Nakshatra',
      durmuhurtham: 'Durmuhurtham',
      varjyam: 'Varjyam',
      none: 'None',
      unknown: 'Unknown',
      until: 'until',
    },
    week: { sun: 'Su', mon: 'Mo', tue: 'Tu', wed: 'We', thu: 'Th', fri: 'Fr', sat: 'Sa' },
    about: {
      title: 'About Telugu Panchangam USA',
      blurb:
        'This website provides daily Telugu Panchangam for New Jersey (Eastern Time), presented in a clean informational UI.',
      sourceTitle: 'Source of Data',
      sourceText: 'Based on NJ temple Panchangam. Times shown in Eastern Time (ET).',
      includesTitle: 'Data Includes',
      includes: [
        'Samvatsaram, Ayanam, Ruthuvu, Paksham',
        'Tithi, Masam, Nakshatra (with timings)',
        'Durmuhurtham, Varjyam',
        'Festivals',
      ],
      disclaimerTitle: 'Disclaimer',
      disclaimerText: 'For important rituals, please confirm with your local temple.',
    },
  },
  te: {
    brandTitle: 'తెలుగు పంచాంగం USA',
    locationSub: 'న్యూజెర్సీ (ఈస్ట్రన్ టైమ్)',
    nav: { today: 'ఈ రోజు', month: 'నెల', festivals: 'పండుగలు', about: 'గురించి' },
    common: {
      previous: '‹ ముందు రోజు',
      next: 'తర్వాత రోజు ›',
      year: 'సంవత్సరం',
      thisMonth: 'ఈ నెల',
      noFestivals: 'పండుగలు లేవు.',
      festivalsNotes: 'పండుగలు',
      noteMissingSun: 'గమనిక: సూర్యోదయం/సూర్యాస్తమయం/రాహుకాలం వివరాలు ఈ MVP డేటాలో లేవు.',
      timesInET: 'సమయాలు ఈస్ట్రన్ టైమ్ (ET) లో చూపబడతాయి',
    },
    fields: {
      samvatsaram: 'సంవత్సరం',
      ayanam: 'అయనం',
      ruthuvu: 'ఋతువు',
      masam: 'మాసం',
      paksham: 'పక్షం',
      tithi: 'తిథి',
      nakshatra: 'నక్షత్రం',
      durmuhurtham: 'దుర్ముహూర్తం',
      varjyam: 'వర్జ్యం',
      none: 'లేదు',
      unknown: 'తెలియదు',
      until: 'వరకు',
    },
    week: { sun: 'ఆ', mon: 'సో', tue: 'మం', wed: 'బు', thu: 'గు', fri: 'శు', sat: 'శ' },
    about: {
      title: 'తెలుగు పంచాంగం USA గురించి',
      blurb:
        'ఈ వెబ్‌సైట్ న్యూజెర్సీ (ఈస్ట్రన్ టైమ్) కోసం రోజువారీ తెలుగు పంచాంగం వివరాలను శుభ్రంగా మరియు సమాచారాత్మకంగా చూపిస్తుంది.',
      sourceTitle: 'డేటా మూలం',
      sourceText: 'NJ టెంపుల్ పంచాంగం ఆధారంగా. సమయాలు ఈస్ట్రన్ టైమ్ (ET) లో చూపబడతాయి.',
      includesTitle: 'డేటాలో ఉన్నవి',
      includes: [
        'సంవత్సరం, అయనం, ఋతువు, పక్షం',
        'తిథి, మాసం, నక్షత్రం (సమయాలతో)',
        'దుర్ముహూర్తం, వర్జ్యం',
        'పండుగలు',
      ],
      disclaimerTitle: 'డిస్క్లైమర్',
      disclaimerText: 'ముఖ్యమైన వ్రతాలు/పూజల కోసం మీ స్థానిక ఆలయంతో నిర్ధారించుకోండి.',
    },
  },
};
