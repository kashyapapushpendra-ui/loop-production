# 🎬 AI Loop — Production Ready Video Generator

**AI Loop** is an intelligent, self-healing storytelling-to-animation video platform with multi-language support, advanced AI features, and enterprise-grade stability.

## ✨ Key Features

### 🎯 Core Video Generation
- **Story to Animation**: Convert narrative text into animated scenes
- **Multi-Format Export**: 720p, 1080p, 2K, 4K support
- **Dual Aspect Ratios**: 16:9 Landscape & 9:16 YouTube Shorts
- **Real-time Preview**: See animations before rendering
- **Fast & Slow Render Paths**: WebCodecs (fast) + MediaRecorder (fallback)

### 🧠 AI-Powered Features
- **Automatic Scene Detection**: Claude AI breaks story into scenes
- **AI Voice Narration**: Text-to-speech with multiple voices
- **AI Subtitle Generation**: Auto SRT/VTT generation
- **YouTube SEO**: Title, description, hashtag generation
- **Thumbnail Creator**: AI-powered thumbnail suggestions
- **Content Safety Check**: Inappropriate content detection

### 🌍 Multi-Language Support
- Hindi (हिन्दी)
- English
- Sanskrit (संस्कृत)
- Easily extensible for more languages

### 💾 Smart Persistence
- **Auto Save**: Every 30 seconds to IndexedDB
- **Project Management**: Save, load, organize projects
- **Crash Recovery**: Automatic session restoration
- **Render Checkpoint**: Resume failed renders

### 🛡️ Self-Healing System
- **Automatic Error Recovery**: Detects and fixes common issues
- **Sync Verification**: Audio-video sync validation
- **Memory Management**: Automatic cleanup and optimization
- **Health Monitoring**: Real-time system diagnostics
- **Performance Tuning**: Adaptive bitrate and quality selection

### 📱 Cross-Device Support
- Mobile-first responsive design
- Touch-friendly controls
- Low-memory device optimization
- Tablet & desktop full support

### 🔒 Security & Privacy
- Input validation & sanitization
- XSS protection
- CORS-safe API calls
- Rate limiting
- No sensitive data persistence

---

## 🚀 Getting Started

### Prerequisites
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Internet connection (for Claude API)
- Microphone (optional, for narration)

### Installation

```bash
git clone https://github.com/kashyapapushpendra-ui/loop-production.git
cd loop-production
# Open index.html in a browser
```

### Configuration

1. Set Claude API key in `.env` or use browser settings
2. Configure language preferences
3. Adjust quality/performance based on device

---

## 📊 System Architecture

```
┌────────────────────────────────────────────┐
│   AI Loop Interface (UI)                   │
├────────────────────────────────────────────┤
│  Story Input → Scene Generation            │
│  Media Upload → Processing                 │
│  Settings & Preferences                    │
├────────────────────────────────────────────┤
│   AI Services Layer                        │
│  • Claude API (Scene generation)           │
│  • TTS Engine (Voice narration)            │
│  • ML Models (Safety, thumbnails)          │
├────────────────────────────────────────────┤
│   Core Engine                              │
│  • Animation Renderer                      │
│  • Audio Processor                         │
│  • Video Encoder (WebCodecs)               │
│  • Self-Healing Manager                    │
├────────────────────────────────────────────┤
│   Persistence Layer                        │
│  • IndexedDB (Projects, cache)             │
│  • LocalStorage (Settings)                 │
│  • Blob Storage (Temporary media)          │
└────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
loop-production/
├── index.html                 # Main application entry point
├── config/
│   ├── env.js                # Environment variables
│   ├── languages.js          # Multi-language definitions
│   └── constants.js          # Global constants
├── core/
│   ├── engine.js             # Main video rendering engine
│   ├── scene-generator.js    # Story-to-scene conversion
│   ├── audio-processor.js    # Audio handling & sync
│   ├── video-encoder.js      # WebCodecs & encoding
│   └── self-healer.js        # Auto-recovery system
├── ai/
│   ├── claude-api.js         # Claude integration
│   ├── tts-engine.js         # Text-to-speech
│   ├── subtitle-gen.js       # Subtitle generation
│   └── content-safety.js     # Safety checking
├── services/
│   ├── storage.js            # IndexedDB management
│   ├── project-manager.js    # Project persistence
│   ├── cache-manager.js      # Caching system
│   └── health-monitor.js     # System diagnostics
├── ui/
│   ├── components.js         # Reusable UI components
│   ├── theme.css             # Styling system
│   └── responsive.css        # Mobile optimization
├── utils/
│   ├── validators.js         # Input validation
│   ├── converters.js         # Format conversion
│   ├── logger.js             # Logging system
│   └── metrics.js            # Performance tracking
├── workers/
│   ├── audio-processor.worker.js   # Audio synthesis offload
│   ├── video-encoder.worker.js     # Encoding offload
│   └── analysis.worker.js          # Data analysis
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## ⚙️ Configuration

Create `.env` or set in browser settings:

```env
CLAUDE_API_KEY=your_api_key_here
DEFAULT_LANGUAGE=hi
MAX_PROJECT_SIZE=500MB
AUTO_SAVE_INTERVAL=30000
RENDER_TIMEOUT=600000
MIN_MEMORY_THRESHOLD=100MB
```

---

## 📈 Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Story to Scenes (4 min) | < 15s | ✅ |
| Scene Editing | Instant | ✅ |
| Preview Start | < 2s | ✅ |
| 1080p Export (4 min) | < 60s | ✅ |
| 4K Export (4 min) | < 180s | ✅ |
| Memory Usage (idle) | < 50MB | ✅ |
| Memory Usage (rendering) | < 300MB | ✅ |
| Auto-save Overhead | < 100ms | ✅ |

---

## 🐛 Known Issues & Roadmap

### Current Release (v1.0)
- ✅ Scene generation from stories
- ✅ Basic animation rendering
- ✅ Audio/video sync
- ✅ Multi-format export
- ✅ Auto-save system
- ✅ Self-healing basics

### Planned (v1.1)
- 🔄 AI Voice cloning
- 🔄 Advanced subtitle styling
- 🔄 Character consistency engine
- 🔄 Scene consistency checker

### Future (v2.0)
- 📅 Collaborative editing
- 📅 Cloud storage integration
- 📅 Advanced analytics
- 📅 Custom animation library

---

## 📞 Support & Feedback

- **Issues**: Report bugs on GitHub
- **Suggestions**: Feature requests welcome
- **Documentation**: See `/docs` folder
- **Contact**: support@ailoop.dev

---

## 📄 License

MIT License — See LICENSE file for details

---

## 🙏 Acknowledgments

- Claude API by Anthropic
- WebCodecs standard
- Open-source community

---

**AI Loop** — *Turn Your Ideas Into Videos* 🚀
