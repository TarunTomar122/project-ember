# Lexical Editor with AI Text Expansion

A rich text editor built with Lexical that includes AI-powered text expansion using multiple AI providers (OpenAI GPT-3.5 and Google Gemini).

## Features

- Rich text editing with Lexical
- Floating HUD that appears when text is selected
- AI-powered text expansion using multiple providers:
  - **OpenAI GPT-3.5-turbo**
  - **Google Gemini 1.0 Pro**
- Dynamic provider switching
- Modern UI with Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up AI API keys (configure at least one):
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key: `VITE_OPENAI_API_KEY=your_openai_api_key_here`
   - Add your Gemini API key: `VITE_GEMINI_API_KEY=your_gemini_api_key_here`
   
3. Start the development server:
```bash
npm run dev
```

## Usage

1. Type some text in the editor
2. Select any text to see the floating HUD
3. If multiple AI providers are configured, use the dropdown to switch between them
4. Click "Expand" to use AI to expand and enhance the selected text
5. Click "Rewrite" for basic text replacement (placeholder functionality)

## AI Provider Configuration

### OpenAI
- Get your API key from: https://platform.openai.com/
- Add to `.env`: `VITE_OPENAI_API_KEY=your_key_here`

### Google Gemini
- Get your API key from: https://makersuite.google.com/app/apikey
- Add to `.env`: `VITE_GEMINI_API_KEY=your_key_here`

## Technology Stack

- **React** - UI framework
- **Lexical** - Rich text editor framework
- **OpenAI** - AI text expansion provider
- **Google Gemini 2.5 Flash** - AI text expansion provider
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
