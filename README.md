# MD AI Assistant

A sleek, dark-themed AI chatbot built with Next.js and professional design components.

## Features

- 🌙 **Dark Mode by Default** - Elegant dark theme for comfortable usage
- 📱 **Responsive Sidebar** - Collapsible chat history with new chat functionality
- 🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui components
- 💬 **Chat Management** - Persistent chat history with easy navigation
- ⚡ **Fast & Optimized** - Smooth performance and quick responses
- 🔒 **No Authentication** - Instant access without any setup
- 🎭 **Smooth Animations** - Polished interactions with Framer Motion
- 📝 **Markdown Support** - Rich text rendering for AI responses

## Design System

This project uses components and design patterns from the `dezign` folder, featuring:

- Clean, modern interface inspired by professional chat applications
- Consistent spacing and typography
- Accessible color schemes
- Smooth micro-interactions
- Professional gradient backgrounds and shadows

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

The app is optimized for Vercel deployment. Simply connect your repository to Vercel and it will automatically deploy.

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Theme**: next-themes
- **Icons**: Lucide React
- **Notifications**: Sonner

## Project Structure

```
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── icons.tsx       # Custom icons
│   └── theme-provider.tsx
├── lib/                # Utility functions
├── pages/              # Next.js pages
├── styles/             # Global styles
└── dezign/             # Design system reference (excluded from build)
```