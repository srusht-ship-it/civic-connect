import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Translations object with common languages
const translations = {
  en: {
    // Header
    civicConnect: 'Civic Connect',
    drafts: 'Drafts',
    help: 'Help',
    
    // Dashboard
    dashboard: 'Dashboard',
    reportNewIssue: 'Report New Issue',
    viewAnalytics: 'View Analytics',
    communityForum: 'Community Forum',
    issueCategories: 'Issue Categories',
    myReports: 'My Reports',
    notifications: 'Notifications',
    profile: 'Profile',
    
    // Report Issue Form
    reportIssue: 'Report a New Issue',
    reportDescription: 'Attach a photo, confirm your location, choose a category, and describe the issue.',
    publicReport: 'Public Report',
    uploadPhoto: 'Upload Photo',
    camera: 'Camera',
    gallery: 'Gallery',
    photoHelp: 'Add at least one photo to help clarify and verify the issue.',
    location: 'Location',
    autoDetected: 'Auto-detected via GPS',
    pinned: 'Pinned',
    locationHelp: 'Move the pin in the map preview in the next step if needed.',
    category: 'Category',
    description: 'Description',
    descriptionPlaceholder: 'Describe the issue, landmarks nearby, and any safety concerns.',
    descriptionHelp: 'Keep it clear and concise. Avoid personal details.',
    submitReport: 'Submit Report',
    
    // Voice Recording
    voiceReport: 'Voice Report',
    startRecording: 'Start Recording',
    stopRecording: 'Stop Recording',
    playRecording: 'Play Recording',
    recordingHelp: 'Record your voice to describe the issue. Perfect for users who prefer speaking over typing.',
    recording: 'Recording...',
    recordingStopped: 'Recording Stopped',
    
    // Categories
    pothole: 'Pothole',
    garbage: 'Garbage',
    streetlight: 'Streetlight',
    water: 'Water',
    others: 'Others',
    
    // Status
    pending: 'Pending',
    inProgress: 'In Progress',
    resolved: 'Resolved',
    
    // Common
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Language Selector
    selectLanguage: 'Select Language',
    language: 'Language'
  },
  hi: {
    // Header
    civicConnect: 'सिविक कनेक्ट',
    drafts: 'ड्राफ्ट्स',
    help: 'सहायता',
    
    // Dashboard
    dashboard: 'डैशबोर्ड',
    reportNewIssue: 'नई समस्या रिपोर्ट करें',
    viewAnalytics: 'एनालिटिक्स देखें',
    communityForum: 'कम्युनिटी फोरम',
    issueCategories: 'समस्या श्रेणियां',
    myReports: 'मेरी रिपोर्ट्स',
    notifications: 'सूचनाएं',
    profile: 'प्रोफाइल',
    
    // Report Issue Form
    reportIssue: 'नई समस्या रिपोर्ट करें',
    reportDescription: 'फोटो अटैच करें, अपना स्थान पुष्टि करें, श्रेणी चुनें और समस्या का वर्णन करें।',
    publicReport: 'पब्लिक रिपोर्ट',
    uploadPhoto: 'फोटो अपलोड करें',
    camera: 'कैमरा',
    gallery: 'गैलरी',
    photoHelp: 'समस्या को स्पष्ट करने और सत्यापित करने के लिए कम से कम एक फोटो जोड़ें।',
    location: 'स्थान',
    autoDetected: 'GPS के द्वारा स्वतः पहचाना गया',
    pinned: 'पिन किया गया',
    locationHelp: 'यदि आवश्यक हो तो अगले चरण में मैप प्रीव्यू में पिन को हिलाएं।',
    category: 'श्रेणी',
    description: 'विवरण',
    descriptionPlaceholder: 'समस्या का वर्णन करें, आसपास के स्थलचिह्न और कोई भी सुरक्षा चिंताएं।',
    descriptionHelp: 'इसे स्पष्ट और संक्षिप्त रखें। व्यक्तिगत विवरण से बचें।',
    submitReport: 'रिपोर्ट जमा करें',
    
    // Voice Recording
    voiceReport: 'वॉइस रिपोर्ट',
    startRecording: 'रिकॉर्डिंग शुरू करें',
    stopRecording: 'रिकॉर्डिंग बंद करें',
    playRecording: 'रिकॉर्डिंग चलाएं',
    recordingHelp: 'समस्या का वर्णन करने के लिए अपनी आवाज रिकॉर्ड करें। उन उपयोगकर्ताओं के लिए बेहतर जो टाइपिंग के बजाय बोलना पसंद करते हैं।',
    recording: 'रिकॉर्डिंग...',
    recordingStopped: 'रिकॉर्डिंग बंद',
    
    // Categories
    pothole: 'गड्ढा',
    garbage: 'कचरा',
    streetlight: 'स्ट्रीट लाइट',
    water: 'पानी',
    others: 'अन्य',
    
    // Status
    pending: 'लंबित',
    inProgress: 'प्रगति में',
    resolved: 'हल हो गया',
    
    // Common
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    save: 'सेव करें',
    delete: 'मिटाएं',
    edit: 'संपादित करें',
    close: 'बंद करें',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    
    // Language Selector
    selectLanguage: 'भाषा चुनें',
    language: 'भाषा'
  },
  te: {
    // Header
    civicConnect: 'సివిక్ కనెక్ట్',
    drafts: 'డ్రాఫ్ట్‌లు',
    help: 'సహాయం',
    
    // Dashboard
    dashboard: 'డ్యాష్‌బోర్డ్',
    reportNewIssue: 'కొత్త సమస్యను నివేదించండి',
    viewAnalytics: 'విశ్లేషణలు చూడండి',
    communityForum: 'కమ్యూనిటీ ఫోరమ్',
    issueCategories: 'సమస్య వర్గాలు',
    myReports: 'నా నివేదికలు',
    notifications: 'నోటిఫికేషన్‌లు',
    profile: 'ప్రొఫైల్',
    
    // Report Issue Form
    reportIssue: 'కొత్త సమస్యను నివేదించండి',
    reportDescription: 'ఫోటోను అటాచ్ చేయండి, మీ స్థానాన్ని నిర్ధారించండి, వర్గాన్ని ఎంచుకోండి మరియు సమస్యను వివరించండి.',
    publicReport: 'పబ్లిక్ రిపోర్ట్',
    uploadPhoto: 'ఫోటో అప్‌లోడ్ చేయండి',
    camera: 'కెమెరా',
    gallery: 'గ్యాలరీ',
    photoHelp: 'సమస్యను స్పష్టం చేయడానికి మరియు ధృవీకరించడానికి కనీసం ఒక ఫోటోను జోడించండి.',
    location: 'స్థానం',
    autoDetected: 'GPS ద్వారా స్వయంచాలకంగా గుర్తించబడింది',
    pinned: 'పిన్ చేయబడింది',
    locationHelp: 'అవసరమైతే తదుపరి దశలో మ్యాప్ ప్రివ్యూలో పిన్‌ను తరలించండి.',
    category: 'వర్గం',
    description: 'వివరణ',
    descriptionPlaceholder: 'సమస్య, సమీపంలోని ల్యాండ్‌మార్క్‌లు మరియు ఏవైనా భద్రతా ఆందోళనలను వివరించండి.',
    descriptionHelp: 'దీన్ని స్పష్టంగా మరియు సంక్షిప్తంగా ఉంచండి. వ్యక్తిగత వివరాలను నివారించండి.',
    submitReport: 'నివేదికను సమర్పించండి',
    
    // Voice Recording
    voiceReport: 'వాయిస్ రిపోర్ట్',
    startRecording: 'రికార్డింగ్ ప్రారంభించండి',
    stopRecording: 'రికార్డింగ్ ఆపండి',
    playRecording: 'రికార్డింగ్ ప్లే చేయండి',
    recordingHelp: 'సమస్యను వివరించడానికి మీ వాయిస్‌ను రికార్డ్ చేయండి. టైపింగ్ కంటే మాట్లాడడాన్ని ఇష్టపడే వినియోగదారులకు ఖచ్చితంగా.',
    recording: 'రికార్డింగ్...',
    recordingStopped: 'రికార్డింగ్ ఆగిపోయింది',
    
    // Categories
    pothole: 'గొయ్యి',
    garbage: 'చెత్త',
    streetlight: 'స్ట్రీట్ లైట్',
    water: 'నీరు',
    others: 'ఇతరులు',
    
    // Status
    pending: 'పెండింగ్',
    inProgress: 'ప్రోగ్రెస్‌లో',
    resolved: 'పరిష్కరించబడింది',
    
    // Common
    submit: 'సమర్పించు',
    cancel: 'రద్దు',
    save: 'సేవ్',
    delete: 'తొలగించు',
    edit: 'సవరించు',
    close: 'మూసివేయి',
    loading: 'లోడింగ్...',
    error: 'లోపం',
    success: 'విజయం',
    
    // Language Selector
    selectLanguage: 'భాష ఎంచుకోండి',
    language: 'భాష'
  },
  ta: {
    // Header
    civicConnect: 'சிவிக் கனெக்ట்',
    drafts: 'வரைவுகள்',
    help: 'உதவி',
    
    // Dashboard
    dashboard: 'டாஷ்போர்டு',
    reportNewIssue: 'புதிய சிக்கலைப் புகாரளிக்க',
    viewAnalytics: 'பகுப்பாய்வுகளைக் காண',
    communityForum: 'சமுதாய மன்றம்',
    issueCategories: 'சிக்கல் வகைகள்',
    myReports: 'எனது அறிக்கைகள்',
    notifications: 'அறிவிப்புகள்',
    profile: 'சுயவிவரம்',
    
    // Report Issue Form
    reportIssue: 'புதிய சிக்கலைப் புகாரளிக்க',
    reportDescription: 'புகைப்படத்தை இணைக்கவும், உங்கள் இருப்பிடத்தை உறுதிப்படுத்தவும், வகையைத் தேர்வு செய்யவும் மற்றும் சிக்கலை விவரிக்கவும்.',
    publicReport: 'பொது அறிக்கை',
    uploadPhoto: 'புகைப்படத்தைப் பதிவேற்ற',
    camera: 'கேமரா',
    gallery: 'கேலரி',
    photoHelp: 'சிக்கலை தெளிவுபடுத்த மற்றும் சரிபார்க்க குறைந்தது ஒரு புகைப்படத்தை சேர்க்கவும்.',
    location: 'இடம்',
    autoDetected: 'GPS மூலம் தானாக கண்டறியப்பட்டது',
    pinned: 'பின் செய்யப்பட்டது',
    locationHelp: 'தேவைப்பட்டால் அடுத்த கட்டத்தில் வரைபட முன்னோட்டத்தில் பின்னை நகர்த்தவும்.',
    category: 'வகை',
    description: 'விளக்கம்',
    descriptionPlaceholder: 'சிக்கல், அருகிலுள்ள அடையாளங்கள் மற்றும் ஏதேனும் பாதுகாப்பு கவலைகளை விவரிக்கவும்.',
    descriptionHelp: 'இதை தெளிவாகவும் சுருக்கமாகவும் வைத்திருங்கள். தனிப்பட்ட விவரங்களைத் தவிர்க்கவும்.',
    submitReport: 'அறிக்கையைச் சமர்பிக்க',
    
    // Voice Recording
    voiceReport: 'குரல் அறிக்கை',
    startRecording: 'பதிவை தொடங்க',
    stopRecording: 'பதிவை நிறுத்த',
    playRecording: 'பதிவை இயக்க',
    recordingHelp: 'சிக்கலை விவரிக்க உங்கள் குரலைப் பதிவு செய்யவும். தட்டச்சுக்கு பதிலாக பேசுவதை விரும்பும் பயனர்களுக்கு ஏற்றது.',
    recording: 'பதிவு செய்கிறது...',
    recordingStopped: 'பதிவு நிறுத்தப்பட்டது',
    
    // Categories
    pothole: 'குழி',
    garbage: 'குப்பை',
    streetlight: 'தெரு விளக்கு',
    water: 'தண்ணீர்',
    others: 'மற்றவை',
    
    // Status
    pending: 'நிலுவையில்',
    inProgress: 'முன்னேற்றத்தில்',
    resolved: 'தீர்க்கப்பட்டது',
    
    // Common
    submit: 'சமர்ப்பிக்க',
    cancel: 'ரத்து',
    save: 'சேமிக்க',
    delete: 'அழிக்க',
    edit: 'திருத்த',
    close: 'மூட',
    loading: 'ஏற்றுகிறது...',
    error: 'பிழை',
    success: 'வெற்றி',
    
    // Language Selector
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    language: 'மொழி'
  }
};

// Supported languages
export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' }
];

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('civic-connect-language');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language preference
  const changeLanguage = (languageCode) => {
    if (translations[languageCode]) {
      setCurrentLanguage(languageCode);
      localStorage.setItem('civic-connect-language', languageCode);
    }
  };

  // Translation function
  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    supportedLanguages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;