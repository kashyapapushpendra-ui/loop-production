/**
 * AI Loop - Multi-Language Support System
 * Centralized language definitions and management
 */

export const SUPPORTED_LANGUAGES = {
  hi: {
    code: 'hi',
    name: 'हिन्दी',
    nativeName: 'Hindi',
    direction: 'ltr',
    region: 'IN',
    fonts: {
      primary: "'Hind', sans-serif",
      serif: "'Tiro Devanagari Hindi', serif",
    },
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    region: 'US',
    fonts: {
      primary: "'Inter', 'Hind', sans-serif",
      serif: "'Georgia', serif",
    },
  },
  sa: {
    code: 'sa',
    name: 'संस्कृत',
    nativeName: 'Sanskrit',
    direction: 'ltr',
    region: 'IN',
    fonts: {
      primary: "'Hind', sans-serif",
      serif: "'Tiro Devanagari Sanskrit', serif",
    },
  },
};

/**
 * Complete translation strings for all languages
 */
export const TRANSLATIONS = {
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.create': 'बनाएं',
    'nav.projects': 'परियोजनाएं',
    'nav.settings': 'सेटिंग्स',
    'nav.help': 'मदद',

    // Main Form
    'form.title': 'वीडियो का शीर्षक',
    'form.title.placeholder': 'जैसे — निमोरी की रात',
    'form.story': 'कहानी / आइडिया',
    'form.story.placeholder': 'यहाँ अपनी कहानी या दृश्यों का विवरण लिखें...',
    'form.duration': 'वीडियो की लंबाई (मिनट)',
    'form.quality': 'वीडियो क्वालिटी',
    'form.quality.720p': 'HD (720p) — तेज़, हल्की फ़ाइल',
    'form.quality.1080p': 'Full HD (1080p) — संतुलित',
    'form.quality.2k': '2K (1440p) — उच्च गुणवत्ता',
    'form.quality.4k': '4K (2160p) — सबसे बेहतर, धीमा हो सकता है',
    'form.audio': 'आवाज़',
    'form.audio.silent': 'बिना आवाज़',
    'form.audio.music': 'हल्का माहौल-संगीत (अपने आप बनेगा)',
    'form.audio.mic': 'मेरी अपनी आवाज़ में सुनाना (लाइव रिकॉर्डिंग)',
    'form.aspectRatio': 'पहलू अनुपात',
    'form.aspectRatio.landscape': '16:9 लैंडस्केप',
    'form.aspectRatio.shorts': '9:16 YouTube Shorts',

    // Buttons
    'btn.generate': 'स्टोरीबोर्ड बनाएं',
    'btn.preview': 'बिना रिकॉर्ड किए प्रीव्यू देखें',
    'btn.render': 'वीडियो बनाएं',
    'btn.download': 'वीडियो डाउनलोड करें',
    'btn.save': 'सहेजें',
    'btn.load': 'लोड करें',
    'btn.delete': 'हटाएं',
    'btn.export': 'निर्यात करें',
    'btn.cancel': 'रद्द करें',

    // Status Messages
    'status.generating': 'स्टोरीबोर्ड तैयार किया जा रहा है...',
    'status.generated': 'दृश्य तैयार हुए। नीचे देखें और चाहें तो बदलें।',
    'status.previewing': 'प्रीव्यू चल रहा है (रिकॉर्ड नहीं हो रहा)...',
    'status.rendering': 'वीडियो बन रही है...',
    'status.rendering_fast': 'तेज़ मोड में वीडियो बन रही है...',
    'status.rendering_normal': 'सामान्य मोड में वीडियो बन रही है...',
    'status.complete': 'तैयार है।',
    'status.error': 'त्रुटि हुई',
    'status.saving': 'सहेजा जा रहा है...',
    'status.loading': 'लोड किया जा रहा है...',

    // Errors
    'error.no_story': 'पहले कहानी लिखें।',
    'error.api_failed': 'API कॉल विफल हुआ।',
    'error.encoding_failed': 'वीडियो एन्कोडिंग विफल।',
    'error.no_scenes': 'कोई दृश्य नहीं मिला।',
    'error.storage_full': 'स्टोरेज भर गई है।',
    'error.memory_low': 'मेमोरी कम है। कृपया प्रतीक्षा करें।',
    'error.invalid_input': 'अमान्य इनपुट।',
    'error.network': 'नेटवर्क कनेक्शन विफल।',
    'error.timeout': 'ऑपरेशन समय सीमा से अधिक हो गया।',

    // Scenes
    'scenes.title': 'दृश्य',
    'scenes.edit': 'दृश्य — चाहें तो बदल लें',
    'scenes.add': 'दृश्य जोड़ें',
    'scenes.remove': 'दृश्य हटाएं',
    'scenes.count': 'कुल दृश्य',
    'scenes.duration': 'अवधि (सेकंड)',

    // Projects
    'project.new': 'नई परियोजना',
    'project.save': 'परियोजना सहेजें',
    'project.load': 'परियोजना लोड करें',
    'project.delete': 'परियोजना हटाएं',
    'project.saved': 'परियोजना सहेजी गई।',
    'project.loaded': 'परियोजना लोड हुई।',

    // Settings
    'settings.language': 'भाषा',
    'settings.theme': 'थीम',
    'settings.autoSave': 'स्वत: सहेजें',
    'settings.notifications': 'सूचनाएं',
    'settings.performance': 'प्रदर्शन',
    'settings.advanced': 'उन्नत विकल्प',

    // Health & Monitoring
    'health.title': 'सिस्टम स्वास्थ्य',
    'health.check': 'स्वास्थ्य जांच',
    'health.status': 'स्थिति',
    'health.memory': 'मेमोरी उपयोग',
    'health.cpu': 'CPU उपयोग',
    'health.disk': 'डिस्क स्पेस',
    'health.ok': 'ठीक है',
    'health.warning': 'चेतावनी',
    'health.error': 'त्रुटि',

    // Help & Support
    'help.title': 'मदद',
    'help.faq': 'अक्सर पूछे जाने वाले प्रश्न',
    'help.tutorial': 'ट्यूटोरियल',
    'help.contact': 'संपर्क करें',
    'help.about': 'के बारे में',
  },

  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.create': 'Create',
    'nav.projects': 'Projects',
    'nav.settings': 'Settings',
    'nav.help': 'Help',

    // Main Form
    'form.title': 'Video Title',
    'form.title.placeholder': 'e.g., The Night of Dreams',
    'form.story': 'Story / Idea',
    'form.story.placeholder': 'Write your story or scene descriptions here...',
    'form.duration': 'Video Length (Minutes)',
    'form.quality': 'Video Quality',
    'form.quality.720p': 'HD (720p) — Fast, Light File',
    'form.quality.1080p': 'Full HD (1080p) — Balanced',
    'form.quality.2k': '2K (1440p) — High Quality',
    'form.quality.4k': '4K (2160p) — Best Quality, Slower',
    'form.audio': 'Audio',
    'form.audio.silent': 'Silent',
    'form.audio.music': 'Ambient Music (Auto-Generated)',
    'form.audio.mic': 'My Own Voice (Live Recording)',
    'form.aspectRatio': 'Aspect Ratio',
    'form.aspectRatio.landscape': '16:9 Landscape',
    'form.aspectRatio.shorts': '9:16 YouTube Shorts',

    // Buttons
    'btn.generate': 'Generate Storyboard',
    'btn.preview': 'Preview without Recording',
    'btn.render': 'Render Video',
    'btn.download': 'Download Video',
    'btn.save': 'Save',
    'btn.load': 'Load',
    'btn.delete': 'Delete',
    'btn.export': 'Export',
    'btn.cancel': 'Cancel',

    // Status Messages
    'status.generating': 'Generating storyboard...',
    'status.generated': 'Scenes generated. Review and edit below.',
    'status.previewing': 'Preview running (not recording)...',
    'status.rendering': 'Rendering video...',
    'status.rendering_fast': 'Rendering in fast mode...',
    'status.rendering_normal': 'Rendering in normal mode...',
    'status.complete': 'Complete.',
    'status.error': 'Error occurred',
    'status.saving': 'Saving...',
    'status.loading': 'Loading...',

    // Errors
    'error.no_story': 'Please write a story first.',
    'error.api_failed': 'API call failed.',
    'error.encoding_failed': 'Video encoding failed.',
    'error.no_scenes': 'No scenes found.',
    'error.storage_full': 'Storage is full.',
    'error.memory_low': 'Low memory. Please wait.',
    'error.invalid_input': 'Invalid input.',
    'error.network': 'Network connection failed.',
    'error.timeout': 'Operation timed out.',

    // Scenes
    'scenes.title': 'Scenes',
    'scenes.edit': 'Scenes — Edit if needed',
    'scenes.add': 'Add Scene',
    'scenes.remove': 'Remove Scene',
    'scenes.count': 'Total Scenes',
    'scenes.duration': 'Duration (Seconds)',

    // Projects
    'project.new': 'New Project',
    'project.save': 'Save Project',
    'project.load': 'Load Project',
    'project.delete': 'Delete Project',
    'project.saved': 'Project saved.',
    'project.loaded': 'Project loaded.',

    // Settings
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.autoSave': 'Auto Save',
    'settings.notifications': 'Notifications',
    'settings.performance': 'Performance',
    'settings.advanced': 'Advanced Options',

    // Health & Monitoring
    'health.title': 'System Health',
    'health.check': 'Health Check',
    'health.status': 'Status',
    'health.memory': 'Memory Usage',
    'health.cpu': 'CPU Usage',
    'health.disk': 'Disk Space',
    'health.ok': 'OK',
    'health.warning': 'Warning',
    'health.error': 'Error',

    // Help & Support
    'help.title': 'Help',
    'help.faq': 'Frequently Asked Questions',
    'help.tutorial': 'Tutorial',
    'help.contact': 'Contact',
    'help.about': 'About',
  },

  sa: {
    // Navigation
    'nav.home': 'गृहम्',
    'nav.create': 'सृज्यताम्',
    'nav.projects': 'कार्यानि',
    'nav.settings': 'सेटिङ्ग्स',
    'nav.help': 'सहायता',

    // Main Form
    'form.title': 'चलचित्रस्य नाम',
    'form.title.placeholder': 'यथा — स्वप्नानि रात्रेः',
    'form.story': 'कथा / विचारः',
    'form.story.placeholder': 'अत्र कथां लिखत...',
    'form.duration': 'चलचित्रदीर्घता (मिनिटानि)',
    'form.quality': 'चलचित्रगुणवत्ता',
    'form.quality.720p': 'HD (720p) — तीव्रम्',
    'form.quality.1080p': 'Full HD (1080p) — संतुलितम्',
    'form.quality.2k': '2K (1440p) — उच्चगुणवत्तम्',
    'form.quality.4k': '4K (2160p) — सर्वोत्तमम्',
    'form.audio': 'ध्वनिः',
    'form.audio.silent': 'निरवम्',
    'form.audio.music': 'संगीतम्',
    'form.audio.mic': 'मदीयः स्वरः',
    'form.aspectRatio': 'दृश्यानुपातः',
    'form.aspectRatio.landscape': '16:9 क्षैतिजम्',
    'form.aspectRatio.shorts': '9:16 YouTube',

    // Buttons
    'btn.generate': 'कथाचित्रं सृज्यताम्',
    'btn.preview': 'पूर्वदर्शनम्',
    'btn.render': 'चलचित्रं सृज्यताम्',
    'btn.download': 'चलचित्रं अवतरयताम्',
    'btn.save': 'संरक्षयताम्',
    'btn.load': 'भारयताम्',
    'btn.delete': 'मार्जयताम्',
    'btn.export': 'निर्यातयताम्',
    'btn.cancel': 'रद्दीकुर्यात्',

    // Status Messages
    'status.generating': 'कथाचित्रं सृज्यते...',
    'status.generated': 'दृश्याः सृष्टाः।',
    'status.previewing': 'पूर्वदर्शनं भवति...',
    'status.rendering': 'चलचित्रः सृज्यते...',
    'status.rendering_fast': 'तीव्रमोडे सृज्यते...',
    'status.rendering_normal': 'सामान्यमोडे सृज्यते...',
    'status.complete': 'समाप्तम्।',
    'status.error': 'त्रुटिः',
    'status.saving': 'संरक्षीयते...',
    'status.loading': 'भार्यते...',

    // Errors
    'error.no_story': 'प्रथमं कथां लिख।',
    'error.api_failed': 'API विफलम्।',
    'error.encoding_failed': 'एन्कोडिङ्ग विफलम्।',
    'error.no_scenes': 'कोऽपि दृश्यं नास्ति।',
    'error.storage_full': 'भण्डारम् पूर्णम्।',
    'error.memory_low': 'स्मृतिः न्यूनम्।',
    'error.invalid_input': 'अयुक्तं निवेशनम्।',
    'error.network': 'नेटवर्क विफलम्।',
    'error.timeout': 'कालसीमा अतिक्रान्तः।',

    // Scenes
    'scenes.title': 'दृश्याः',
    'scenes.edit': 'दृश्याः — संपादनं कुर्यात्',
    'scenes.add': 'दृश्यं योजयताम्',
    'scenes.remove': 'दृश्यं मार्जयताम्',
    'scenes.count': 'कुलदृश्याः',
    'scenes.duration': 'अवधिः (क्षणाः)',

    // Projects
    'project.new': 'नवकार्यम्',
    'project.save': 'कार्यं संरक्षयताम्',
    'project.load': 'कार्यं भारयताम्',
    'project.delete': 'कार्यं मार्जयताम्',
    'project.saved': 'कार्यं संरक्षितम्।',
    'project.loaded': 'कार्यं भारितम्।',

    // Settings
    'settings.language': 'भाषा',
    'settings.theme': 'विषयः',
    'settings.autoSave': 'स्वसंरक्षणम्',
    'settings.notifications': 'सूचनाः',
    'settings.performance': 'कार्यक्षमता',
    'settings.advanced': 'उन्नतविकल्पाः',

    // Health & Monitoring
    'health.title': 'तन्त्रस्वास्थ्यम्',
    'health.check': 'स्वास्थ्यपरीक्षा',
    'health.status': 'स्थितिः',
    'health.memory': 'स्मृत्युपयोगः',
    'health.cpu': 'CPU उपयोगः',
    'health.disk': 'डिस्कस्थानम्',
    'health.ok': 'शोभनम्',
    'health.warning': 'सावधानी',
    'health.error': 'त्रुटिः',

    // Help & Support
    'help.title': 'सहायता',
    'help.faq': 'प्रायः प्रश्नाः',
    'help.tutorial': 'शिक्षा',
    'help.contact': 'संपर्कम्',
    'help.about': 'विषये',
  },
};

/**
 * Language Manager Class
 * Handles language switching and translations
 */
export class LanguageManager {
  constructor(defaultLang = 'hi') {
    this.currentLang = this.validateLanguage(defaultLang);
    this.listeners = [];
  }

  /**
   * Validate and return supported language
   */
  validateLanguage(langCode) {
    if (SUPPORTED_LANGUAGES[langCode]) {
      return langCode;
    }
    console.warn(`Language ${langCode} not supported, falling back to English`);
    return 'en';
  }

  /**
   * Load a language
   */
  loadLanguage(langCode) {
    const validated = this.validateLanguage(langCode);
    if (validated === this.currentLang) return;
    
    this.currentLang = validated;
    this.applyLanguage();
    this.notify();
  }

  /**
   * Get translation key
   */
  t(key, defaultValue = key) {
    return TRANSLATIONS[this.currentLang]?.[key] || 
           TRANSLATIONS.en[key] || 
           defaultValue;
  }

  /**
   * Get language info
   */
  getLanguageInfo() {
    return SUPPORTED_LANGUAGES[this.currentLang];
  }

  /**
   * Apply language to UI
   */
  applyLanguage() {
    const info = this.getLanguageInfo();
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = info.direction;
    
    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      el.textContent = this.t(key);
    });
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages() {
    return Object.values(SUPPORTED_LANGUAGES);
  }

  /**
   * Subscribe to language changes
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notify all listeners
   */
  notify() {
    this.listeners.forEach(callback => callback(this.currentLang));
  }
}

export default LanguageManager;
