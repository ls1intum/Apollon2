# Apollon2 Re-Engineering

Welcome to the Apollon2 Monorepo! This repository uses **npm workspaces** to manage multiple packages (including a server, webapp, and library) in a single codebase.

## Requirements

Ensure you have the following installed:

1. **Node.js**:

   - This project uses a specific Node.js version as indicated in the `.nvmrc` file.
   - Use [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) to install/manage Node versions:
     ```bash
     brew install nvm
     ```
     Then, load `nvm` into your shell:
     ```bash
     export NVM_DIR="$HOME/.nvm"
     [ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"
     ```

   Once `nvm` is set up:

   ```bash
   nvm install
   nvm use
   ```

2. **npm**(comes with Node.js):
   - This monorepo uses npm workspaces, which are supported out-of-the-box in npm 7+.
   - Verify your npm version:
   ```bash
   npm -v
   ```

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone git@github.com:ls1intum/Apollon2.git
   cd Apollon2
   ```

2. Use the correct Node.js version:

   ```bash
   nvm install
   nvm use
   ```

3. Install dependencies for all packages:

   ```bash
   npm install
   ```

4. Create .env files for standalone/webapp and standalone/server <br>
   Check .env.examples files and create values

5. Build all packages:

   ```bash
   npm run build
   ```

6. Run Docker and start database via docker:

   ```bash
   npm run start:localdb
   ```

7. Start the project:
   ```bash
   npm run start
   ```

## Setup Instructions for iOS and Android

1. Install the latest packages

```bash
 npm i
```

2. Build the application

```bash
npm run build
```

3. For the first time, generate ios and android folder:

```bash
npm run capacitor:add:ios
```

```bash
npm run capacitor:add:android
```

4. Generate assets:

```bash
 npm run capacitor:assets:generate:ios
```

5. Sync the files

```bash
 npm run capacitor:sync
```

6. Open the App

```bash
 npm run capacitor:open:ios
```

```bash
npm run capacitor:open:android
```

## Verifying Versions

After setup, verify that you have the correct versions installed:

- **Node.js:**
  ```bash
  node -v
  ```
  This should match the version specified in the `.nvmrc` file.

## Project Structure

Here is a brief overview of the project structure:

```
apollon2/
├── standalone/
│   ├── server/
│   │   ├── src/
│   │   ├── package.json
│   │   └── ...
│   └── webapp/
│       ├── src/
│       ├── package.json
│       └── ...
├── library
│   ├── src/
│   ├── package.json
|   └── ...
│
├── .nvmrc                # Specifies the Node.js version
├── .prettierrc           # Configuration file for formating typescript files
├── commitlint.config.mj  # Checking commit messages in format
└── README.md             # Project documentation
```

## Scripts Overview

Here are the commonly used scripts defined in the monorepo:

- **Install dependencies:**
  ```bash
  npm install
  ```
- **Build all packages:**
  ```bash
  npm run build
  ```
- **Start the project:**
  ```bash
  npm run start
  ```
- **Check linting of the project :**
  ```bash
  npm run lint
  ```
- **Fixes formatting issues :**
  ```bash
  npm run format
  ```
- **Checks formatting issues without fixing them :**
  ```bash
  npm run format:check
  ```

## Dockerized web app

Webapp can be build and run with docker. Be sure docker is installed in your device.

- **Build with docker :**
  ```bash
  npm run docker:build
  ```
- **Run with docker :**
  ```bash
  npm run docker:start
  ```
  After running 'npm run docker:start' you can navigate to http://localhost:8080/ and start using the application

## Run Docker locally

Make sure Docker is up and running.

Build image with docker compose:

```bash
 docker compose -f ./docker/compose.local.yml build
```

Run the container with docker compose:

```bash
 docker compose -f ./docker/compose.local.yml up -d
```

## Publish Library in NPM
Publish a new patch or minor version of the library package to npm using npm scripts or GitHub Actions.\
Alpha prerelease versions (e.g., 4.0.3-alpha.0) are created with prepatch or preminor, later updated to stable (e.g., 4.0.3 or 4.1.0).
### Version Increments
Patch: 4.0.2 → 4.0.3-alpha.0 → 4.0.3 (bug fixes).\
Minor: 4.0.2 → 4.1.0-alpha.0 → 4.1.0 (new features).
### Local Publishing
Run from the monorepo root:
```bash
npm run publish:library:patch  # For patch (scripts/publish-library-patch.sh)
npm run publish:library:minor  # For minor (scripts/publish-library-minor.sh)
```

### GitHub Actions
Trigger the Publish Library Patch Version workflow (.github/workflows/publish-library-patch.yml) in GitHub Actions.\
Same as local script but automated.\
There is also workflow for minor version bump

Requires: NPM_TOKEN in repository secrets.\
Currently temporarily classic token from npm is used
### Notes
Alpha versions are for testing; update to stable after PR approval.

## Troubleshooting

- If you encounter issues with Node.js versions, ensure you have the correct version installed by running:
  ```bash
  nvm use
  ```
- If a package fails to build, check its individual `package.json` for specific build scripts and dependencies.

## Contributing

We welcome contributions! Please follow the steps below to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes and push them to your fork.
4. Submit a pull request.

Thank you for using and contributing to our monorepo!
