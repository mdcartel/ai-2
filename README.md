# AI Assistant

A modern, clean AI chatbot built with Next.js and the design system from the dezign components.

## Features

- 🎨 Modern UI with Tailwind CSS and shadcn/ui components
- 🌙 Dark/Light theme support
- 📱 Fully responsive design
- ⚡ Fast and optimized
- 🔒 No authentication required
- 🎭 Smooth animations with Framer Motion
- 💬 Real-time chat interface
- 📝 Markdown support for rich text responses

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