# AI-Powered Novel Writing Assistant

A powerful React-based writing tool that helps authors craft compelling narratives using AI assistance. Built with Lexical editor and integrated with OpenAI's GPT models.

## Features

### ✨ AI Writing Assistance
- **Expand**: Add depth, detail, sensory information, and narrative richness to your text
- **Rewrite**: Improve clarity, style, pacing, and prose quality while preserving meaning
- **Describe**: Get detailed analysis of writing techniques, strengths, and improvement suggestions

### 🎨 Tone Control
Choose from various writing tones:
- **Keep Same Tone**: Maintain your existing style
- **Improve Tone**: Enhance while keeping the same character
- **Dramatic**: Increase tension and emotional intensity
- **Lighthearted**: Add playfulness and humor
- **Formal**: Use sophisticated vocabulary and structure
- **Casual**: Simplify language for accessibility

### 🔄 Context-Aware Processing
- Uses full document context to maintain consistency
- Preserves character voices and plot elements
- Ensures narrative coherence across your entire work

### 📋 Preview & Control
- Preview all AI suggestions before accepting
- Accept or reject changes with one click
- Detailed explanations of what was changed

## Getting Started

### Prerequisites
- Node.js 20.19.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lexical-editor-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up your API keys:
Create a `.env` file in the root directory:
```bash
# OpenAI API Configuration (Required)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Gemini API Configuration (Optional)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Get your API keys:
   - **OpenAI**: Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - **Gemini**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey) (optional)

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## How to Use

1. **Start Writing**: Begin typing your novel or story in the editor
2. **Select Text**: Highlight any text you want to enhance
3. **Choose Action**: Click Expand, Rewrite, or Describe from the floating toolbar
4. **Select Tone**: Choose your preferred writing tone from the dropdown
5. **Preview**: Review the AI's suggestions in the preview modal
6. **Accept or Reject**: Keep your original text or accept the AI's enhancement

## Supported AI Models

- **OpenAI GPT-4.1-nano-2025-04-14**: Primary model for novel writing assistance
- **Google Gemini 2.5 Flash**: Alternative provider (basic functionality)

## Technology Stack

- **React 19** - Modern UI framework
- **Lexical** - Extensible text editor framework
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **OpenAI API** - AI text processing
- **Google Gemini API** - Alternative AI provider

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/
│   ├── LexicalEditor.jsx    # Main editor component
│   └── FloatingHUD.jsx      # AI assistance toolbar
├── services/
│   ├── openai.js           # OpenAI integration
│   ├── gemini.js           # Gemini integration
│   └── aiProvider.js       # AI provider abstraction
├── App.jsx                 # Main application
└── main.jsx               # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Security Notes

- API keys are only used client-side for development
- For production deployment, implement proper backend API proxying
- Never commit API keys to version control
- The `.env` file is gitignored for security

## License

This project is licensed under the MIT License.

## Support

For questions and support, please open an issue on the repository.
