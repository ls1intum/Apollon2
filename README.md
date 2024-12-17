# Monorepo Setup

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

4. Build all packages:

   ```bash
   npm run build
   ```

5. Start the project:
   ```bash
   npm run start
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
- **Format the project:**
  ```bash
  npm run format
  ```
- **Check formatting of the project:**
  ```bash
  npm run format:check
  ```

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
