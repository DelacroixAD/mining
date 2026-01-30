# How to run

Folder structure: `/server` (Express) and `/client` (Vite + React). Backend on port 3001, frontend on port 5173.

## Commands (run from project root)

**1. Install dependencies (once):**
```bash
npm run install:all
```

**2. Terminal 1 – start backend:**
```bash
npm start
```
→ Backend: http://localhost:3001

**3. Terminal 2 – start frontend:**
```bash
npm run dev
```
→ Frontend: http://localhost:5173

**4. Open in browser:** http://localhost:5173

---

If `npm run install:all` fails on Windows, run:
```bash
npm install --prefix server
npm install --prefix client
```
Then run `npm start` and `npm run dev` as above.
