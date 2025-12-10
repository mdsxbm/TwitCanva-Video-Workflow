# TwitCanva

A modern, AI-powered canvas application for generating and manipulating images and videos using Google's Gemini API. Built with React, TypeScript, and Vite.

![TwitCanva](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue)
![Vite](https://img.shields.io/badge/Vite-6.4.1-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **🎨 Visual Canvas Interface** - Drag-and-drop node-based workflow
- **🤖 AI Image Generation** - Powered by Google's Imagen 3
- **🎬 AI Video Generation** - Create videos from images using Veo 3.1
- **🔗 Node Connections** - Chain operations with drag-to-connect
- **⚡ Real-time Updates** - Hot module replacement for instant feedback
- **🎯 Aspect Ratio Control** - Multiple preset ratios for images
- **📹 Resolution Options** - Auto, 1080p, and 512p for videos
- **🔒 Secure API** - Backend proxy keeps API keys safe

## 🏗️ Architecture

### Frontend (`src/`)
```
src/
├── components/
│   ├── canvas/
│   │   ├── CanvasNode.tsx       # Main node component (108 lines)
│   │   ├── NodeContent.tsx      # Content display logic
│   │   ├── NodeControls.tsx     # Control panel & settings
│   │   └── NodeConnectors.tsx   # Connector buttons
│   ├── ContextMenu.tsx          # Right-click menu
│   └── Toolbar.tsx              # Top toolbar
├── hooks/
│   ├── useCanvasNavigation.ts   # Viewport/zoom/pan
│   ├── useNodeManagement.ts     # Node CRUD operations
│   ├── useConnectionDragging.ts # Connection dragging
│   ├── useNodeDragging.ts       # Node dragging
│   └── useGeneration.ts         # AI generation logic
├── utils/
│   ├── videoHelpers.ts          # Video processing
│   └── connectionHelpers.ts     # Connection calculations
├── services/
│   └── geminiService.ts         # API calls to backend
├── types.ts                     # TypeScript definitions
├── App.tsx                      # Main app component
└── index.tsx                    # Entry point
```

### Backend (`server/`)
```
server/
└── index.js                     # Express server with API proxy
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SankaiAI/TwitCanva.git
   cd TwitCanva
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   > ⚠️ **Security**: The API key is stored server-side and never exposed to the client.

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   This starts both:
   - Frontend dev server: `http://localhost:5173`
   - Backend API server: `http://localhost:3001`

## 🎮 Usage

### Creating Nodes

1. **Double-click** on the canvas to open the context menu
2. Select **"Add Nodes"** → Choose node type (Image/Video)
3. Enter a prompt describing what you want to generate
4. Click the **✨ Generate** button

### Connecting Nodes

1. **Hover** over a node to reveal connector buttons (+ icons)
2. **Click and drag** from a connector to create a connection
3. **Release** on another node or empty space to connect

### Canvas Navigation

- **Pan**: Click and drag on empty canvas space
- **Zoom**: `Ctrl/Cmd + Mouse Wheel` or use the zoom slider
- **Select**: Click on a node to select it
- **Context Menu**: Right-click for additional options

## 🛠️ Development

### Code Organization

The codebase follows a modular architecture with clear separation of concerns:

- **Components**: UI components split by responsibility
- **Hooks**: Custom React hooks for state management
- **Utils**: Pure utility functions
- **Services**: API integration layer

### Code Style

- **File Size Limits**: 
  - Components: 300 lines max
  - Hooks: 200 lines max
  - Utils: 200 lines max
- **TypeScript**: Strict typing, no `any`
- **Comments**: JSDoc for functions, section headers for organization
- **Naming**: Descriptive names, consistent conventions

See `code-style-guide.md` for detailed guidelines.

### Available Scripts

```bash
npm run dev        # Start development servers (frontend + backend)
npm run build      # Build for production
npm run preview    # Preview production build
npm run server     # Start backend server only
```

## 🔧 Configuration

### Vite Configuration

The project uses Vite for fast development and optimized builds:

- **Proxy**: API requests to `/api/*` are proxied to `http://localhost:3001`
- **React**: Fast Refresh enabled
- **Path Aliases**: `@` points to project root

### TypeScript Configuration

- **Strict Mode**: Enabled for type safety
- **JSX**: React JSX transform
- **Module Resolution**: Node-style resolution

## 📦 Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.6.2** - Type safety
- **Vite 6.4.1** - Build tool
- **Tailwind CSS** - Styling (via CDN)
- **Lucide React** - Icons

### Backend
- **Express 4.21.2** - Web server
- **Google Generative AI** - AI generation
- **CORS** - Cross-origin support
- **dotenv** - Environment variables

## 🔒 Security

- ✅ API keys stored server-side only
- ✅ `.env` file in `.gitignore`
- ✅ Backend proxy for API calls
- ✅ CORS configured properly
- ✅ No sensitive data in client code

## 📊 Project Stats

- **Total Files**: 20+ source files
- **Lines of Code**: ~2,500 lines
- **Components**: 7 components
- **Custom Hooks**: 5 hooks
- **Utilities**: 2 utility modules

### Refactoring Results

- **App.tsx**: 728 → 383 lines (47% reduction)
- **CanvasNode.tsx**: 306 → 108 lines (65% reduction)
- **Total Extracted**: 834 lines into reusable modules

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the code style guide
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini API for AI generation
- React team for the amazing framework
- Vite team for the blazing-fast build tool
- Lucide for beautiful icons

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and Google Gemini AI**
