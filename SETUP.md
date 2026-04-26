# Research Helper — Mac Setup Guide

## Step 1 — Install Node.js

1. Go to https://nodejs.org
2. Click the big **"LTS"** download button (the left one)
3. Open the downloaded `.pkg` file and follow the installer
4. When done, open **Terminal** (press Cmd+Space, type "Terminal", press Enter)
5. Type this and press Enter to confirm it worked:
   ```
   node --version
   ```
   You should see something like `v20.11.0`

---

## Step 2 — Get your Anthropic API Key

1. Go to https://console.anthropic.com and create a free account
2. Click **"API Keys"** in the left sidebar
3. Click **"Create Key"**, give it a name like "research-helper"
4. **Copy the key** — it starts with `sk-ant-...`
5. Save it somewhere safe — you can only see it once!

---

## Step 3 — Set up the project

1. Move the `research-helper` folder to your Desktop (or anywhere you like)
2. Open **Terminal**
3. Type this to go into the folder (adjust path if needed):
   ```
   cd ~/Desktop/research-helper
   ```
4. Install dependencies:
   ```
   npm install
   ```
5. Create your `.env` file with your API key:
   ```
   cp .env.example .env
   ```
6. Open the `.env` file in TextEdit:
   ```
   open -e .env
   ```
7. Replace `your_api_key_here` with your actual key from Step 2, save and close.

---

## Step 4 — Run it locally

In Terminal, run:
```
npm start
```

You should see:
```
✅ Research Helper running at http://localhost:3000
```

Open your browser and go to: **http://localhost:3000**

Your app is running! 🎉

To stop it, press **Ctrl+C** in Terminal.

---

## Step 5 — Put it on the internet (Railway)

1. Go to https://railway.app and sign up with your GitHub account
   - If you don't have GitHub: sign up free at https://github.com first
2. On Railway, click **"New Project"** → **"Deploy from GitHub repo"**
3. Upload your project folder to a new GitHub repo first:
   - Go to https://github.com/new
   - Create a repo called `research-helper` (set to Private)
   - Follow GitHub's instructions to upload your folder
4. Back on Railway, select your `research-helper` repo
5. Railway will detect it's a Node.js app automatically
6. Click **"Variables"** tab and add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your API key from Step 2
7. Click **Deploy** — Railway gives you a public URL like `https://research-helper-abc123.railway.app`

Share that URL with your students! 🚀

---

## Folder structure

```
research-helper/
├── public/
│   └── index.html      ← the student-facing webpage
├── server.js           ← the backend (keeps your API key safe)
├── package.json        ← project info and dependencies
├── .env                ← your secret API key (never share this!)
└── .env.example        ← template for the .env file
```

---

## Troubleshooting

**"command not found: node"** — Node.js didn't install correctly. Restart Terminal and try again.

**"Cannot find module 'express'"** — Run `npm install` again inside the project folder.

**"ANTHROPIC_API_KEY not set"** — Make sure your `.env` file exists and has the real key (not the placeholder).

**Page loads but search gives an error** — Check Terminal for the error message printed there.
