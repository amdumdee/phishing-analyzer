# ThreatScope — AI Phishing Email Analyzer

An AI-powered tool that analyzes emails for phishing indicators using Claude AI.

## Features
- Paste any email and get an instant threat analysis
- Risk score (0–100) with verdict: Phishing / Suspicious / Likely Safe
- Detailed threat indicators, red flags, and recommendations
- Terminal-style cybersecurity UI

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally
```bash
npm run dev
```
Open http://localhost:5173

### 3. Build for production
```bash
npm run build
```

## Deploy to Vercel (free)
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project → select your repo
3. Click Deploy — done!

## Deploy to Netlify (free)
1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com) → Add new site → Import from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click Deploy

## Tech Stack
- React 18 + Vite
- Claude claude-sonnet-4-6 API (claude-sonnet-4-6)
- No backend required — runs entirely in the browser
