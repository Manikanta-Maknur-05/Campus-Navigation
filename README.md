# Anurag University Campus Navigation System

MERN stack project, built in stages.
**Current stage: Stage 1 - Project Setup** (React + Vite frontend, Express backend, health check).
MongoDB, authentication, maps and routing are NOT included yet.

## Requirements (Windows)

1. **Node.js 20 LTS** - download from https://nodejs.org and install with default options.
2. **Visual Studio Code** - https://code.visualstudio.com
3. Verify in a terminal:

   ```powershell
   node -v
   npm -v
   ```

   `node -v` should show v18 or higher (v20 recommended).

## Setup (VS Code on Windows)

1. Unzip `campus-navigation.zip`. In VS Code, choose **File -> Open Folder** and select the `campus-navigation` folder.
2. Open the terminal: **Terminal -> New Terminal** (PowerShell).
3. Install all dependencies (root, server and client):

   ```powershell
   npm run install-all
   ```

4. Create the environment files from the examples:

   ```powershell
   Copy-Item server\.env.example server\.env
   Copy-Item client\.env.example client\.env
   ```

5. Start both apps with one command:

   ```powershell
   npm run dev
   ```

6. Open these in your browser:
   - Frontend: http://localhost:5173
   - Backend health check: http://localhost:5000/api/health

Stop everything with `Ctrl + C` in the terminal.

## Running separately (two terminals)

```powershell
npm run server    # backend on http://localhost:5000
npm run client    # frontend on http://localhost:5173
```

## Environment variables

| File | Variable | Default | Purpose |
|------|----------|---------|---------|
| `server/.env` | `PORT` | `5000` | Backend port |
| `server/.env` | `CLIENT_URL` | `http://localhost:5173` | Allowed frontend origin (CORS) |
| `client/.env` | `VITE_API_BASE_URL` | `http://localhost:5000/api` | Backend API base URL |

Never commit real `.env` files. Only `.env.example` files are committed.
After changing `client/.env`, restart the frontend.

## Troubleshooting

- **Port already in use:** change `PORT` in `server/.env` and update `VITE_API_BASE_URL` in `client/.env` to match.
- **Page says "Cannot reach the backend":** make sure the server is running and `client/.env` exists.
- **`npm` is not recognized:** reinstall Node.js, then restart VS Code.
