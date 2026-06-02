# Commands Cheat Sheet — for Natalie

A beginner-friendly list of every command you'll need. Run these in your **Terminal** app (on Mac: `Cmd + Space`, type "Terminal", hit Enter).

> Tip: Lines starting with `#` are comments — don't type them. Lines without `#` are the actual commands.

---

## 1. One-time setup

Do these once on your computer.

```bash
# Check you have Node.js installed (need v18 or newer)
node --version

# Check you have git installed
git --version
```

If `node --version` says "command not found", install Node from https://nodejs.org (pick the LTS version).

---

## 2. Get the project onto your computer

```bash
# Move to wherever you want the project folder to live
cd ~/Desktop

# Download (clone) the project from GitHub
git clone https://github.com/blakeschafer/tastematch.git

# Step inside the project folder
cd tastematch

# Install all the libraries the project needs
npm install
```

After `npm install` finishes (takes ~30 seconds), you're ready to go.

---

## 3. Run the app locally (every day workflow)

```bash
# Start the local development server
npm run dev
```

You'll see a message like `- Local: http://localhost:3000`.

Open **http://localhost:3000** in your browser. Save any file and the page auto-refreshes — magic.

To stop the server: press `Ctrl + C` in the terminal.

---

## 4. Make changes and save them to GitHub

This is the loop you'll repeat over and over.

```bash
# 1. See what files you've changed
git status

# 2. Stage all your changes (tell git "include these")
git add .

# 3. Save the changes with a short message describing what you did
git commit -m "Add hero image to homepage"

# 4. Send your changes up to GitHub
git push
```

That's it. Refresh GitHub.com and your changes are there.

---

## 5. Get the latest changes (if working with someone else)

```bash
# Pull down any new changes from GitHub
git pull
```

Always run `git pull` before you start working, so you don't get out of sync.

---

## 6. Branches (optional, for trying things safely)

A branch is a parallel copy where you can experiment without breaking the main version.

```bash
# Create a new branch and switch to it
git checkout -b my-new-feature

# ... make changes, then commit them as usual (git add, git commit, git push) ...

# Switch back to the main branch
git checkout main

# Delete a branch when you're done with it
git branch -d my-new-feature
```

When you push a new branch the first time, use:
```bash
git push -u origin my-new-feature
```

---

## 7. Building for production (when you're ready to deploy)

```bash
# Build an optimized version
npm run build

# Run the production build locally to test it
npm start
```

The easiest way to deploy this app online is **Vercel** — go to https://vercel.com, sign in with GitHub, and import the `tastematch` repo. It auto-deploys every time you `git push`.

---

## 8. The project structure (where things live)

```
tastematch/
├── app/                  ← Each folder = a page (URL)
│   ├── page.tsx          ← The home page (/)
│   ├── step-1/page.tsx   ← /step-1 page
│   ├── results/page.tsx  ← /results page
│   └── globals.css       ← Site-wide styles + design tokens
├── components/           ← Reusable UI pieces (cards, headers, etc.)
├── lib/
│   ├── data.ts           ← Mock restaurant list — edit this to add/change restaurants
│   └── scoring.ts        ← The matching logic
└── prd.md                ← The original product spec
```

If you want to **change a restaurant** → edit `lib/data.ts`
If you want to **change a color** → edit the top of `app/globals.css`
If you want to **change the home page text** → edit `app/page.tsx`

---

## 9. Common problems & fixes

| Problem | Fix |
|---|---|
| `npm install` fails | Try `rm -rf node_modules package-lock.json && npm install` |
| `Port 3000 already in use` | Another server is running. Close it, or run `npm run dev -- -p 3001` |
| `git push` rejected | Run `git pull` first, then `git push` again |
| Made a mistake, want to undo unsaved changes | `git checkout .` (careful — this deletes your unsaved edits) |
| The browser shows an old version | Hard refresh: `Cmd + Shift + R` |
| Don't know what a command does | Search "what does `command` do" — don't run things you don't understand |

---

## 10. Helpful resources

- **Next.js docs** (the framework): https://nextjs.org/docs
- **Tailwind CSS** (the styling): https://tailwindcss.com/docs
- **Git basics**: https://learngitbranching.js.org (interactive game — actually fun)
- **Ask Claude**: paste an error message into Claude and ask "what does this mean?"

---

## 11. The 5 commands you'll use 95% of the time

```bash
cd ~/Desktop/tastematch    # Go to the project folder
npm run dev                # Start the app
git add .                  # Stage changes
git commit -m "message"    # Save changes
git push                   # Upload to GitHub
```

Print this out, tape it to your monitor. You'll have it memorized in a week.

Good luck! 🚀
