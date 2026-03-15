/* ========================================================
   AquaSense — Internationalization (i18n) Engine
   Telugu + English Language Support
   ======================================================== */

(function () {
  'use strict';

  const LANG_KEY = 'aquasense_lang';
  const POPUP_KEY = 'aquasense_lang_popup_dismissed';

  /* ========================================================
     TRANSLATION DICTIONARY
     ======================================================== */
  const translations = {
    en: {
      /* --- Navbar --- */
      'nav.home': 'Home',
      'nav.why': 'Why AquaSense',
      'nav.benefits': 'Benefits',
      'nav.calculator': 'Calculator',
      'nav.admin': 'Admin',
      'nav.login': 'Login',

      /* --- Hero Section --- */
      'hero.badge': 'Intelligent Irrigation',
      'hero.title': 'Smart Water Decisions for <span class="highlight">Smart Farmers</span>',
      'hero.subtitle': 'AquaSense uses crop science & real rainfall data to tell you exactly how much water your farm needs — saving water, energy, and boosting your yield.',
      'hero.cta': 'Check Your Irrigation Plan',
      'hero.learn': 'Learn More',
      'hero.stat.water': 'Water Saved',
      'hero.stat.farmers': 'Farmers Helped',
      'hero.stat.crops': 'Crop Types',
      'hero.float.water': 'Water Optimized',
      'hero.float.yield': 'Yield +20%',

      /* --- Problem Section --- */
      'problem.tag': 'The Challenge',
      'problem.title': "India's Irrigation Crisis",
      'problem.desc': "Over 80% of India's freshwater is consumed by agriculture — yet most farmers irrigate based on guesswork, leading to massive waste and poor crop health.",
      'problem.water.title': 'Water Wastage',
      'problem.water.desc': 'Traditional flood irrigation wastes up to 60% of water through evaporation and runoff, draining precious groundwater reserves.',
      'problem.energy.title': 'Energy Drain',
      'problem.energy.desc': 'Farmers pump excessive groundwater using electric or diesel motors, resulting in huge electricity bills and carbon emissions.',
      'problem.yield.title': 'Low Yield',
      'problem.yield.desc': 'Over-watering or under-watering directly impacts crop quality, reducing yield by up to 25% and hurting farmer income.',

      /* --- Solution Section --- */
      'solution.tag': 'Our Solution',
      'solution.title': 'How AquaSense Helps',
      'solution.desc': 'AquaSense is a data-driven decision support tool that calculates the precise water requirement for your crops — factoring in <strong>crop type</strong>, <strong>soil conditions</strong>, <strong>land area</strong>, and <strong>recent rainfall</strong>.',
      'solution.step1': 'Enter your crop & field details',
      'solution.step2': 'Our algorithm calculates optimal water needs',
      'solution.step3': 'Get a clear irrigation recommendation instantly',
      'solution.cta': 'Try the Calculator',
      'solution.card1.title': 'Rainfall Aware',
      'solution.card1.desc': 'Adjusts automatically based on recent rainfall data.',
      'solution.card2.title': 'Soil Adaptive',
      'solution.card2.desc': 'Sandy, loamy, or clay — each soil type factored in.',
      'solution.card3.title': 'Crop Specific',
      'solution.card3.desc': 'Each crop has its own water blueprint.',

      /* --- Benefits Section --- */
      'benefits.tag': 'Why Choose Us',
      'benefits.title': 'Benefits of AquaSense',
      'benefits.desc': 'Empowering farmers with actionable irrigation intelligence.',
      'benefit.water.title': 'Save Water',
      'benefit.water.desc': 'Reduce water usage by up to 30% with precise irrigation recommendations tailored to your exact crop and soil conditions.',
      'benefit.yield.title': 'Improve Crop Yield',
      'benefit.yield.desc': 'Optimal watering leads to healthier crops and up to 20% higher yield — directly increasing your farm income.',
      'benefit.energy.title': 'Reduce Electricity Waste',
      'benefit.energy.desc': 'Pump only what\'s needed. Cut electricity consumption from irrigation motors and lower your energy bills significantly.',
      'benefit.easy.title': 'Easy to Use',
      'benefit.easy.desc': 'Designed for simplicity. Just enter your farm details and get an actionable irrigation plan in seconds — no tech skills needed.',

      /* --- Calculator Section --- */
      'calc.tag': 'Irrigation Calculator',
      'calc.title': 'Calculate Your Irrigation Plan',
      'calc.desc': 'Fill in your farm details below and get a personalized water recommendation in seconds.',
      'calc.crop.label': 'Crop Type',
      'calc.crop.placeholder': 'Select your crop…',
      'calc.crop.rice': '🌾 Rice',
      'calc.crop.cotton': '🌿 Cotton',
      'calc.crop.groundnut': '🥜 Groundnut',
      'calc.crop.maize': '🌽 Maize',
      'calc.crop.sugarcane': '🎋 Sugarcane',
      'calc.soil.label': 'Soil Type',
      'calc.soil.placeholder': 'Select soil type…',
      'calc.soil.sandy': '🏜️ Sandy',
      'calc.soil.loamy': '🌍 Loamy',
      'calc.soil.clay': '🧱 Clay',
      'calc.land.label': 'Land Size (Acres)',
      'calc.land.placeholder': 'e.g. 2.5',
      'calc.rain.label': 'Recent Rainfall (mm)',
      'calc.rain.placeholder': 'e.g. 15',
      'calc.submit': 'Calculate Irrigation Plan',
      'calc.calculating': 'Calculating...',
      'calc.error.crop': 'Please select a crop type.',
      'calc.error.soil': 'Please select a soil type.',
      'calc.error.land': 'Enter a valid land size (> 0).',
      'calc.error.rain': 'Enter valid rainfall (≥ 0).',
      'calc.voice.tooltip': 'Speak in Telugu to fill the form',

      /* --- Results Section --- */
      'result.water.label': 'Required Water',
      'result.water.unit': 'Liters',
      'result.schedule.label': 'Next Irrigation',
      'result.rain.label': 'Rainfall Impact',
      'result.efficiency.label': 'Water Efficiency Score',
      'result.tip.label': 'Water Saving Tip',
      'result.chart.title': 'Water Requirement Comparison',
      'result.recalc': 'Recalculate',
      'result.rain.high': 'High',
      'result.rain.medium': 'Medium',
      'result.rain.low': 'Low',
      'result.eff.excellent': 'Excellent — your setup is very efficient!',
      'result.eff.good': 'Good — consider drip irrigation for improvement.',
      'result.eff.fair': 'Fair — significant water savings possible.',
      'result.schedule.3_5': 'After 3–5 days',
      'result.schedule.5_7': 'After 5–7 days (rain accounted)',
      'result.schedule.7_10': 'After 7–10 days (heavy rain)',

      /* --- Tips Section --- */
      'tips.tag': 'Pro Tips',
      'tips.title': 'Irrigation Best Practices',
      'tip1.title': 'Irrigate Early Morning',
      'tip1.desc': 'Water between 6–8 AM to minimize evaporation and maximize absorption.',
      'tip2.title': 'Check Soil Moisture',
      'tip2.desc': 'Insert a finger 2 inches into soil — if dry, it\'s time to irrigate.',
      'tip3.title': 'Use Drip Irrigation',
      'tip3.desc': 'Drip systems deliver water directly to roots, saving up to 50% water.',
      'tip4.title': 'Mulch Your Fields',
      'tip4.desc': 'A layer of mulch reduces surface evaporation and keeps soil moist longer.',

      /* --- Water Saving Tips (dynamic) --- */
      'tip.drip': 'Use drip irrigation instead of flood irrigation to save up to 50% water.',
      'tip.morning': 'Irrigate early in the morning (6–8 AM) to minimize evaporation losses.',
      'tip.mulch': 'Mulch the soil surface to reduce moisture loss and keep roots cool.',
      'tip.moisture': 'Regularly check soil moisture before irrigating — avoid overwatering.',
      'tip.rainwater': 'Consider rainwater harvesting to supplement irrigation during dry spells.',
      'tip.awd': 'Alternate wetting and drying (AWD) for rice paddies can save 25% water.',
      'tip.level': 'Level your fields carefully to ensure uniform water distribution.',
      'tip.schedule': 'Schedule irrigations in the cooler parts of the day for best absorption.',
      'tip.saving': '💧 Based on recent rainfall, you\'re saving approximately {amount} liters!',

      /* --- Footer --- */
      'footer.desc': 'Empowering Indian farmers with data-driven irrigation intelligence. A step towards sustainable agriculture.',
      'footer.links': 'Quick Links',
      'footer.project': 'Project Info',
      'footer.college': 'College Innovation Project',
      'footer.built': 'Built with HTML, CSS & JS',
      'footer.green': 'For a greener future',
      'footer.copy': '© 2026 AquaSense. Made with ❤️ for Indian Farmers.',

      /* --- Auth Modal --- */
      'auth.signin.subtitle': 'Sign in to your farmer account',
      'auth.signup.subtitle': 'Create your farmer account',
      'auth.tab.signin': 'Sign In',
      'auth.tab.signup': 'Create Account',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.name': 'Full Name',
      'auth.phone': 'Phone Number',
      'auth.village': 'Village / Location',
      'auth.signin.btn': 'Sign In',
      'auth.signup.btn': 'Create Account',
      'auth.email.placeholder': 'farmer@example.com',
      'auth.password.placeholder.login': 'Enter your password',
      'auth.password.placeholder.signup': 'Create a password (min 4 chars)',
      'auth.name.placeholder': 'e.g. Rajesh Kumar',
      'auth.phone.placeholder': 'e.g. 9876543210',
      'auth.village.placeholder': 'e.g. Anantapur, AP',
      'auth.error.fields': 'Please fill all fields.',
      'auth.error.noaccount': 'No account found with this email. Please sign up.',
      'auth.error.wrongpw': 'Incorrect password. Please try again.',
      'auth.error.required': 'Name, email and password are required.',
      'auth.error.pwlen': 'Password must be at least 4 characters.',
      'auth.error.exists': 'An account with this email already exists. Please sign in.',
      'auth.error.name': 'Name is required.',
      'auth.edit.title': 'Edit Profile',
      'auth.edit.save': 'Save Changes',
      'auth.edit.profile': 'Edit Profile',
      'auth.logout': 'Logout',

      /* --- Admin Dashboard --- */
      'admin.title': 'Admin Dashboard',
      'admin.desc': 'Overview of AquaSense platform statistics and irrigation reports.',
      'admin.stat.reports': 'Total Reports',
      'admin.stat.farmers': 'Farmers Registered',
      'admin.stat.water': 'Water Saved (L)',
      'admin.stat.efficiency': 'Avg Efficiency',
      'admin.chart.crop': 'Crop Distribution',
      'admin.chart.water': 'Water Usage Over Reports',
      'admin.table.title': 'Recent Irrigation Reports',
      'admin.table.num': '#',
      'admin.table.crop': 'Crop',
      'admin.table.soil': 'Soil',
      'admin.table.land': 'Land (ac)',
      'admin.table.rain': 'Rain (mm)',
      'admin.table.water': 'Water (L)',
      'admin.table.efficiency': 'Efficiency',
      'admin.table.impact': 'Impact',
      'admin.table.date': 'Date',
      'admin.empty': 'No irrigation reports yet. Use the calculator first!',
      'admin.error': 'Could not load data. Is the server running?',

      /* --- Offline & PWA --- */
      'offline.banner': "You're offline — calculations will sync when reconnected",
      'offline.synced': 'All data synced successfully!',
      'pwa.install': 'Install AquaSense App',

      /* --- Language Popup --- */
      'lang.popup.title': 'Would you like to use AquaSense in Telugu?',
      'lang.popup.subtitle': 'మీరు AquaSense ను తెలుగులో వాడాలనుకుంటున్నారా?',
      'lang.popup.yes': 'తెలుగులో చూడండి',
      'lang.popup.no': 'Continue in English',

      /* --- Voice --- */
      'voice.listening': 'Listening... Speak now',
      'voice.error': 'Could not recognize voice. Please try again.',
      'voice.unsupported': 'Voice input is not supported in this browser.',
    },

    te: {
      /* --- Navbar --- */
      'nav.home': 'హోమ్',
      'nav.why': 'ఎందుకు AquaSense',
      'nav.benefits': 'ప్రయోజనాలు',
      'nav.calculator': 'కాలిక్యులేటర్',
      'nav.admin': 'అడ్మిన్',
      'nav.login': 'లాగిన్',

      /* --- Hero Section --- */
      'hero.badge': 'తెలివైన నీటిపారుదల',
      'hero.title': '<span class="highlight">తెలివైన రైతుల</span> కోసం స్మార్ట్ నీటి నిర్ణయాలు',
      'hero.subtitle': 'AquaSense పంట శాస్త్రం & నిజమైన వర్షపాత డేటాను ఉపయోగించి మీ పొలానికి ఎంత నీరు అవసరమో ఖచ్చితంగా చెబుతుంది — నీటిని, శక్తిని ఆదా చేస్తుంది, దిగుబడిని పెంచుతుంది.',
      'hero.cta': 'మీ నీటిపారుదల ప్రణాళికను తనిఖీ చేయండి',
      'hero.learn': 'మరింత తెలుసుకోండి',
      'hero.stat.water': 'నీరు ఆదా',
      'hero.stat.farmers': 'రైతులకు సహాయం',
      'hero.stat.crops': 'పంట రకాలు',
      'hero.float.water': 'నీరు ఆప్టిమైజ్',
      'hero.float.yield': 'దిగుబడి +20%',

      /* --- Problem Section --- */
      'problem.tag': 'సవాలు',
      'problem.title': 'భారతదేశ నీటిపారుదల సంక్షోభం',
      'problem.desc': 'భారతదేశ మంచినీటిలో 80% కంటే ఎక్కువ వ్యవసాయం వల్ల ఉపయోగించబడుతుంది — కానీ చాలా మంది రైతులు అంచనాల ఆధారంగా నీటిపారుదల చేస్తారు, ఇది భారీ వృధా & పంట ఆరోగ్యం క్షీణతకు దారితీస్తుంది.',
      'problem.water.title': 'నీటి వృధా',
      'problem.water.desc': 'సంప్రదాయ వరద నీటిపారుదల బాష్పీభవనం & ప్రవాహం ద్వారా 60% వరకు నీటిని వృధా చేస్తుంది, విలువైన భూగర్భ జలాలను హరిస్తుంది.',
      'problem.energy.title': 'శక్తి వృధా',
      'problem.energy.desc': 'రైతులు విద్యుత్ లేదా డీజిల్ మోటార్ల ద్వారా అధిక భూగర్భ జలాలను పంప్ చేస్తారు, దీని వల్ల భారీ విద్యుత్ బిల్లులు & కార్బన్ ఉద్గారాలు వస్తాయి.',
      'problem.yield.title': 'తక్కువ దిగుబడి',
      'problem.yield.desc': 'అధిక నీరు లేదా తక్కువ నీరు పెట్టడం పంట నాణ్యతను నేరుగా ప్రభావితం చేస్తుంది, దిగుబడిని 25% వరకు తగ్గిస్తుంది & రైతు ఆదాయాన్ని నష్టపరుస్తుంది.',

      /* --- Solution Section --- */
      'solution.tag': 'మా పరిష్కారం',
      'solution.title': 'AquaSense ఎలా సహాయపడుతుంది',
      'solution.desc': 'AquaSense మీ పంటలకు ఖచ్చితమైన నీటి అవసరాన్ని లెక్కించే డేటా-ఆధారిత నిర్ణయ మద్దతు సాధనం — <strong>పంట రకం</strong>, <strong>నేల పరిస్థితులు</strong>, <strong>భూమి విస్తీర్ణం</strong>, మరియు <strong>ఇటీవలి వర్షపాతం</strong> ఇవన్నీ పరిగణనలోకి తీసుకుంటుంది.',
      'solution.step1': 'మీ పంట & పొలం వివరాలను నమోదు చేయండి',
      'solution.step2': 'మా అల్గారిథం సరైన నీటి అవసరాలను లెక్కిస్తుంది',
      'solution.step3': 'వెంటనే స్పష్టమైన నీటిపారుదల సిఫార్సు పొందండి',
      'solution.cta': 'కాలిక్యులేటర్ ప్రయత్నించండి',
      'solution.card1.title': 'వర్షపాతం తెలుసు',
      'solution.card1.desc': 'ఇటీవలి వర్షపాత డేటా ఆధారంగా స్వయంచాలకంగా సర్దుబాటు చేస్తుంది.',
      'solution.card2.title': 'నేల అనుకూలం',
      'solution.card2.desc': 'ఇసుక, సారవంత, లేదా బంకమట్టి — ప్రతి నేల రకం పరిగణించబడుతుంది.',
      'solution.card3.title': 'పంట నిర్దిష్టం',
      'solution.card3.desc': 'ప్రతి పంటకు దాని స్వంత నీటి బ్లూప్రింట్ ఉంది.',

      /* --- Benefits Section --- */
      'benefits.tag': 'ఎందుకు ఎంచుకోవాలి',
      'benefits.title': 'AquaSense ప్రయోజనాలు',
      'benefits.desc': 'రైతులకు ఆచరణయోగ్య నీటిపారుదల సమాచారంతో శక్తినిస్తుంది.',
      'benefit.water.title': 'నీటిని ఆదా చేయండి',
      'benefit.water.desc': 'మీ ఖచ్చితమైన పంట & నేల పరిస్థితులకు అనుగుణమైన ఖచ్చితమైన నీటిపారుదల సిఫార్సులతో నీటి వాడకాన్ని 30% వరకు తగ్గించండి.',
      'benefit.yield.title': 'పంట దిగుబడిని మెరుగుపరచండి',
      'benefit.yield.desc': 'సరైన నీటిపారుదల ఆరోగ్యకరమైన పంటలకు & 20% అధిక దిగుబడికి దారితీస్తుంది — మీ వ్యవసాయ ఆదాయాన్ని నేరుగా పెంచుతుంది.',
      'benefit.energy.title': 'విద్యుత్ వృధాను తగ్గించండి',
      'benefit.energy.desc': 'అవసరమైనంత మాత్రమే పంప్ చేయండి. నీటిపారుదల మోటార్ల నుండి విద్యుత్ వినియోగాన్ని తగ్గించి, మీ ఇంధన బిల్లులను గణనీయంగా తగ్గించండి.',
      'benefit.easy.title': 'ఉపయోగించడం సులభం',
      'benefit.easy.desc': 'సరళత కోసం రూపొందించబడింది. మీ పొలం వివరాలను నమోదు చేసి సెకన్లలో ఆచరణయోగ్య నీటిపారుదల ప్రణాళికను పొందండి — సాంకేతిక నైపుణ్యం అవసరం లేదు.',

      /* --- Calculator Section --- */
      'calc.tag': 'నీటిపారుదల కాలిక్యులేటర్',
      'calc.title': 'మీ నీటిపారుదల ప్రణాళికను లెక్కించండి',
      'calc.desc': 'మీ పొలం వివరాలను క్రింద నమోదు చేసి సెకన్లలో వ్యక్తిగత నీటి సిఫార్సు పొందండి.',
      'calc.crop.label': 'పంట రకం',
      'calc.crop.placeholder': 'మీ పంటను ఎంచుకోండి…',
      'calc.crop.rice': '🌾 వరి',
      'calc.crop.cotton': '🌿 పత్తి',
      'calc.crop.groundnut': '🥜 వేరుశనగ',
      'calc.crop.maize': '🌽 మొక్కజొన్న',
      'calc.crop.sugarcane': '🎋 చెరకు',
      'calc.soil.label': 'నేల రకం',
      'calc.soil.placeholder': 'నేల రకాన్ని ఎంచుకోండి…',
      'calc.soil.sandy': '🏜️ ఇసుక',
      'calc.soil.loamy': '🌍 సారవంత',
      'calc.soil.clay': '🧱 బంకమట్టి',
      'calc.land.label': 'భూమి పరిమాణం (ఎకరాలు)',
      'calc.land.placeholder': 'ఉదా. 2.5',
      'calc.rain.label': 'ఇటీవలి వర్షపాతం (మి.మీ)',
      'calc.rain.placeholder': 'ఉదా. 15',
      'calc.submit': 'స్మార్ట్ నీటిపారుదల ప్రణాళిక రూపొందించండి',
      'calc.calculating': 'లెక్కిస్తోంది...',
      'calc.error.crop': 'దయచేసి పంట రకాన్ని ఎంచుకోండి.',
      'calc.error.soil': 'దయచేసి నేల రకాన్ని ఎంచుకోండి.',
      'calc.error.land': 'చెల్లుబాటు అయ్యే భూమి పరిమాణాన్ని నమోదు చేయండి (> 0).',
      'calc.error.rain': 'చెల్లుబాటు అయ్యే వర్షపాతాన్ని నమోదు చేయండి (≥ 0).',
      'calc.voice.tooltip': 'ఫారమ్ నింపడానికి తెలుగులో మాట్లాడండి',

      /* --- Results Section --- */
      'result.water.label': 'అవసరమైన నీటి పరిమాణం',
      'result.water.unit': 'లీటర్లు',
      'result.schedule.label': 'తదుపరి నీటిపారుదల సూచన',
      'result.rain.label': 'వర్షపాత ప్రభావం',
      'result.efficiency.label': 'నీటి సామర్థ్య స్కోరు',
      'result.tip.label': 'నీటి ఆదా చిట్కా',
      'result.chart.title': 'నీటి అవసరం పోలిక',
      'result.recalc': 'మళ్ళీ లెక్కించండి',
      'result.rain.high': 'ఎక్కువ',
      'result.rain.medium': 'మధ్యస్తం',
      'result.rain.low': 'తక్కువ',
      'result.eff.excellent': 'అద్భుతం — మీ సెటప్ చాలా సమర్థవంతంగా ఉంది!',
      'result.eff.good': 'మంచిది — మెరుగుదల కోసం డ్రిప్ ఇరిగేషన్ ను పరిగణించండి.',
      'result.eff.fair': 'సరిపోతుంది — గణనీయమైన నీటి ఆదా సాధ్యం.',
      'result.schedule.3_5': '3–5 రోజుల తర్వాత',
      'result.schedule.5_7': '5–7 రోజుల తర్వాత (వర్షం పరిగణించబడింది)',
      'result.schedule.7_10': '7–10 రోజుల తర్వాత (భారీ వర్షం)',

      /* --- Tips Section --- */
      'tips.tag': 'ముఖ్య చిట్కాలు',
      'tips.title': 'నీటిపారుదల ఉత్తమ పద్ధతులు',
      'tip1.title': 'ఉదయాన్నే నీళ్ళు పెట్టండి',
      'tip1.desc': 'బాష్పీభవనాన్ని తగ్గించడానికి & శోషణను పెంచడానికి ఉదయం 6–8 గంటల మధ్య నీళ్ళు పెట్టండి.',
      'tip2.title': 'నేల తేమను తనిఖీ చేయండి',
      'tip2.desc': 'నేలలో 2 అంగుళాలు వేలు గుచ్చి — పొడిగా ఉంటే, నీటిపారుదల సమయం వచ్చింది.',
      'tip3.title': 'డ్రిప్ ఇరిగేషన్ వాడండి',
      'tip3.desc': 'డ్రిప్ వ్యవస్థలు నేరుగా వేర్లకు నీటిని అందిస్తాయి, 50% వరకు నీటిని ఆదా చేస్తాయి.',
      'tip4.title': 'మీ పొలాలను మల్చ్ చేయండి',
      'tip4.desc': 'మల్చ్ పొర ఉపరితల బాష్పీభవనాన్ని తగ్గిస్తుంది & నేలను ఎక్కువ సేపు తేమగా ఉంచుతుంది.',

      /* --- Water Saving Tips (dynamic) --- */
      'tip.drip': 'వరద నీటిపారుదలకు బదులుగా డ్రిప్ ఇరిగేషన్ వాడి 50% వరకు నీటిని ఆదా చేయండి.',
      'tip.morning': 'బాష్పీభవన నష్టాలను తగ్గించడానికి ఉదయాన్నే (6–8 AM) నీటిపారుదల చేయండి.',
      'tip.mulch': 'తేమ నష్టాన్ని తగ్గించడానికి & వేర్లను చల్లగా ఉంచడానికి నేల ఉపరితలాన్ని మల్చ్ చేయండి.',
      'tip.moisture': 'నీటిపారుదల చేయడానికి ముందు నేల తేమను క్రమం తప్పకుండా తనిఖీ చేయండి — అధిక నీటిపారుదలను నివారించండి.',
      'tip.rainwater': 'పొడి కాలాలలో నీటిపారుదలకు పూరకంగా వర్షపు నీటి సేకరణను పరిగణించండి.',
      'tip.awd': 'వరి పొలాలలో ప్రత్యామ్నాయ తడి & ఆరబెట్టడం (AWD) 25% నీటిని ఆదా చేయగలదు.',
      'tip.level': 'ఏకరీతి నీటి పంపిణీని నిర్ధారించడానికి మీ పొలాలను జాగ్రత్తగా చదును చేయండి.',
      'tip.schedule': 'ఉత్తమ శోషణ కోసం రోజులోని చల్లని సమయాల్లో నీటిపారుదలను షెడ్యూల్ చేయండి.',
      'tip.saving': '💧 ఇటీవలి వర్షపాతం ఆధారంగా, మీరు సుమారు {amount} లీటర్లు ఆదా చేస్తున్నారు!',

      /* --- Footer --- */
      'footer.desc': 'భారతీయ రైతులకు డేటా-ఆధారిత నీటిపారుదల మేధస్సుతో శక్తినిస్తోంది. స్థిరమైన వ్యవసాయం వైపు ఒక అడుగు.',
      'footer.links': 'త్వరిత లింకులు',
      'footer.project': 'ప్రాజెక్ట్ సమాచారం',
      'footer.college': 'కళాశాల ఆవిష్కరణ ప్రాజెక్ట్',
      'footer.built': 'HTML, CSS & JS తో నిర్మించబడింది',
      'footer.green': 'పచ్చని భవిష్యత్తు కోసం',
      'footer.copy': '© 2026 AquaSense. భారతీయ రైతుల కోసం ❤️ తో తయారు చేసారు.',

      /* --- Auth Modal --- */
      'auth.signin.subtitle': 'మీ రైతు ఖాతాలోకి సైన్ ఇన్ చేయండి',
      'auth.signup.subtitle': 'మీ రైతు ఖాతాను సృష్టించండి',
      'auth.tab.signin': 'సైన్ ఇన్',
      'auth.tab.signup': 'ఖాతా సృష్టించండి',
      'auth.email': 'ఇమెయిల్',
      'auth.password': 'పాస్‌వర్డ్',
      'auth.name': 'పూర్తి పేరు',
      'auth.phone': 'ఫోన్ నంబర్',
      'auth.village': 'గ్రామం / ప్రాంతం',
      'auth.signin.btn': 'సైన్ ఇన్',
      'auth.signup.btn': 'ఖాతా సృష్టించండి',
      'auth.email.placeholder': 'farmer@example.com',
      'auth.password.placeholder.login': 'మీ పాస్‌వర్డ్ నమోదు చేయండి',
      'auth.password.placeholder.signup': 'పాస్‌వర్డ్ సృష్టించండి (కనీసం 4 అక్షరాలు)',
      'auth.name.placeholder': 'ఉదా. రాజేష్ కుమార్',
      'auth.phone.placeholder': 'ఉదా. 9876543210',
      'auth.village.placeholder': 'ఉదా. అనంతపురం, AP',
      'auth.error.fields': 'దయచేసి అన్ని ఫీల్డ్‌లను నింపండి.',
      'auth.error.noaccount': 'ఈ ఇమెయిల్‌తో ఖాతా కనుగొనబడలేదు. దయచేసి సైన్ అప్ చేయండి.',
      'auth.error.wrongpw': 'తప్పు పాస్‌వర్డ్. దయచేసి మళ్ళీ ప్రయత్నించండి.',
      'auth.error.required': 'పేరు, ఇమెయిల్ మరియు పాస్‌వర్డ్ అవసరం.',
      'auth.error.pwlen': 'పాస్‌వర్డ్ కనీసం 4 అక్షరాలు ఉండాలి.',
      'auth.error.exists': 'ఈ ఇమెయిల్‌తో ఖాతా ఇప్పటికే ఉంది. దయచేసి సైన్ ఇన్ చేయండి.',
      'auth.error.name': 'పేరు అవసరం.',
      'auth.edit.title': 'ప్రొఫైల్ సవరించండి',
      'auth.edit.save': 'మార్పులు సేవ్ చేయండి',
      'auth.edit.profile': 'ప్రొఫైల్ సవరించండి',
      'auth.logout': 'లాగ్ అవుట్',

      /* --- Admin Dashboard --- */
      'admin.title': 'అడ్మిన్ డాష్‌బోర్డ్',
      'admin.desc': 'AquaSense ప్లాట్‌ఫారమ్ గణాంకాలు & నీటిపారుదల నివేదికల అవలోకనం.',
      'admin.stat.reports': 'మొత్తం నివేదికలు',
      'admin.stat.farmers': 'నమోదిత రైతులు',
      'admin.stat.water': 'ఆదా చేసిన నీరు (L)',
      'admin.stat.efficiency': 'సగటు సామర్థ్యం',
      'admin.chart.crop': 'పంట పంపిణీ',
      'admin.chart.water': 'నివేదికల్లో నీటి వాడకం',
      'admin.table.title': 'ఇటీవలి నీటిపారుదల నివేదికలు',
      'admin.table.num': '#',
      'admin.table.crop': 'పంట',
      'admin.table.soil': 'నేల',
      'admin.table.land': 'భూమి (ఎ.)',
      'admin.table.rain': 'వర్షం (మి.మీ)',
      'admin.table.water': 'నీరు (L)',
      'admin.table.efficiency': 'సామర్థ్యం',
      'admin.table.impact': 'ప్రభావం',
      'admin.table.date': 'తేదీ',
      'admin.empty': 'ఇంకా నీటిపారుదల నివేదికలు లేవు. ముందుగా కాలిక్యులేటర్ వాడండి!',
      'admin.error': 'డేటా లోడ్ చేయడం సాధ్యం కాలేదు. సర్వర్ అమలులో ఉందా?',

      /* --- Offline & PWA --- */
      'offline.banner': 'మీరు ఆఫ్‌లైన్‌లో ఉన్నారు — ఇంటర్నెట్ వచ్చాక లెక్కలు సింక్ అవుతాయి',
      'offline.synced': 'మొత్తం డేటా విజయవంతంగా సింక్ అయింది!',
      'pwa.install': 'AquaSense యాప్ ఇన్‌స్టాల్ చేయండి',

      /* --- Language Popup --- */
      'lang.popup.title': 'Would you like to use AquaSense in Telugu?',
      'lang.popup.subtitle': 'మీరు AquaSense ను తెలుగులో వాడాలనుకుంటున్నారా?',
      'lang.popup.yes': 'తెలుగులో చూడండి',
      'lang.popup.no': 'Continue in English',

      /* --- Voice --- */
      'voice.listening': 'వింటోంది... ఇప్పుడు మాట్లాడండి',
      'voice.error': 'గుర్తించడం సాధ్యం కాలేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.',
      'voice.unsupported': 'ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ సపోర్ట్ చేయదు.',
    },
  };

  /* ========================================================
     TIP KEYS (for dynamic tip translation)
     ======================================================== */
  const TIP_KEYS = [
    'tip.drip', 'tip.morning', 'tip.mulch', 'tip.moisture',
    'tip.rainwater', 'tip.awd', 'tip.level', 'tip.schedule',
  ];

  /* ========================================================
     CORE ENGINE
     ======================================================== */
  let currentLang = localStorage.getItem(LANG_KEY) || 'en';

  /** Get translation by key */
  function t(key, replacements) {
    const dict = translations[currentLang] || translations.en;
    let text = dict[key] || translations.en[key] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  }

  /** Get current language */
  function getLang() {
    return currentLang;
  }

  /** Get a random tip key */
  function getRandomTipKey() {
    return TIP_KEYS[Math.floor(Math.random() * TIP_KEYS.length)];
  }

  /** Apply translations to all [data-i18n] elements on the page */
  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const text = t(key);

      // Check if text contains HTML (bold tags, spans, etc.)
      if (text.includes('<')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });

    // Translate select options
    document.querySelectorAll('[data-i18n-option]').forEach((el) => {
      el.textContent = t(el.getAttribute('data-i18n-option'));
    });

    // Translate aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });

    // Translate title/tooltip
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      el.title = t(el.getAttribute('data-i18n-title'));
    });
  }

  /** Set language and apply to page */
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);

    // Add/remove Telugu class on body for font sizing
    document.body.classList.toggle('lang-te', lang === 'te');
    document.documentElement.lang = lang === 'te' ? 'te' : 'en';

    // Update toggle button active state
    document.querySelectorAll('.lang-toggle-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    applyTranslations();

    // Dispatch event for other modules to react
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  /* ========================================================
     LANGUAGE TOGGLE (injected into navbar)
     ======================================================== */
  function createLangToggle() {
    const toggle = document.createElement('div');
    toggle.className = 'lang-toggle';
    toggle.id = 'lang-toggle';
    toggle.innerHTML = `
      <button class="lang-toggle-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en">English</button>
      <span class="lang-divider">|</span>
      <button class="lang-toggle-btn ${currentLang === 'te' ? 'active' : ''}" data-lang="te">తెలుగు</button>
    `;

    toggle.querySelectorAll('.lang-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
      });
    });

    return toggle;
  }

  function injectLangToggle() {
    const navInner = document.querySelector('.navbar-inner');
    if (!navInner || document.getElementById('lang-toggle')) return;

    const toggle = createLangToggle();
    // Insert before the hamburger or profile wrap
    const hamburger = navInner.querySelector('.hamburger');
    const profileWrap = document.getElementById('profile-nav-wrap');

    if (profileWrap) {
      navInner.insertBefore(toggle, profileWrap);
    } else if (hamburger) {
      navInner.insertBefore(toggle, hamburger);
    } else {
      navInner.appendChild(toggle);
    }
  }

  /* ========================================================
     AUTO-DETECTION POPUP
     ======================================================== */
  function checkAutoDetect() {
    // Don't show if already dismissed or language already set to Telugu
    if (localStorage.getItem(POPUP_KEY) || currentLang === 'te') return;

    // Check navigator language
    const navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    const isTeluguDevice = navLang.startsWith('te');

    if (!isTeluguDevice) return;

    showLanguagePopup();
  }

  function showLanguagePopup() {
    const popup = document.createElement('div');
    popup.className = 'lang-popup-overlay';
    popup.id = 'lang-popup';
    popup.innerHTML = `
      <div class="lang-popup">
        <div class="lang-popup-icon">
          <i class="fas fa-globe"></i>
        </div>
        <h3 class="lang-popup-title">${t('lang.popup.title')}</h3>
        <p class="lang-popup-subtitle">${t('lang.popup.subtitle')}</p>
        <div class="lang-popup-actions">
          <button class="btn btn-primary lang-popup-yes" id="lang-popup-yes">
            <i class="fas fa-check"></i> ${t('lang.popup.yes')}
          </button>
          <button class="btn btn-outline lang-popup-no" id="lang-popup-no">
            ${t('lang.popup.no')}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(popup);
    requestAnimationFrame(() => popup.classList.add('active'));

    popup.querySelector('#lang-popup-yes').addEventListener('click', () => {
      localStorage.setItem(POPUP_KEY, 'true');
      setLanguage('te');
      closePopup(popup);
    });

    popup.querySelector('#lang-popup-no').addEventListener('click', () => {
      localStorage.setItem(POPUP_KEY, 'true');
      closePopup(popup);
    });

    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        localStorage.setItem(POPUP_KEY, 'true');
        closePopup(popup);
      }
    });
  }

  function closePopup(popup) {
    popup.classList.remove('active');
    setTimeout(() => popup.remove(), 400);
  }

  /* ========================================================
     INITIALIZATION
     ======================================================== */
  function init() {
    // Inject language toggle into navbar
    injectLangToggle();

    // Apply saved language
    if (currentLang !== 'en') {
      document.body.classList.add('lang-te');
      document.documentElement.lang = 'te';
    }
    applyTranslations();

    // Update toggle button states
    document.querySelectorAll('.lang-toggle-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });

    // Auto-detect after a short delay to not overwhelm user
    setTimeout(checkAutoDetect, 2000);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-inject toggle when auth.js re-renders profile UI (which may remove our toggle)
  const origRenderProfile = window._aquaSenseRenderProfile;
  const observer = new MutationObserver(() => {
    if (!document.getElementById('lang-toggle')) {
      injectLangToggle();
    }
  });
  const navInner = document.querySelector('.navbar-inner');
  if (navInner) {
    observer.observe(navInner, { childList: true });
  }

  /* ========================================================
     PUBLIC API
     ======================================================== */
  window.AquaSenseI18n = {
    t,
    getLang,
    setLanguage,
    applyTranslations,
    getRandomTipKey,
    TIP_KEYS,
  };

})();
