# Monorepo Setup

Welcome to the Monorepo project! This repository contains multiple packages managed with Yarn workspaces. Follow the guide below to set up and run the project locally.

## Requirements

Ensure you have the following installed on your system:

1. **Node.js**:
   - Use the version specified in the `.nvmrc` file.
   - Install and manage Node.js versions using [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm). On macOS, you can install nvm via Homebrew:
     ```bash
     brew install nvm
     ```
     Then, load nvm into your shell:
     ```bash
     export NVM_DIR="$HOME/.nvm"
     [ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"
     ```

2. **Yarn**:
   - Install the berry version of Yarn by running:
     ```bash
     yarn set version berry
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
   yarn 
   ```

4. Build all packages:
   ```bash
   yarn build
   ```

5. Start the project:
   ```bash
   yarn start
   ```

## Verifying Versions

After setup, verify that you have the correct versions installed:

- **Node.js:**
  ```bash
  node -v
  ```
  This should match the version specified in the `.nvmrc` file.

- **Yarn:**
  ```bash
  yarn -v
  ```
  This should match the version specified in the `.yarnrc.yaml` file.

## Project Structure

Here is a brief overview of the project structure:

```
apollon2/
├── apps/
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
├── .nvmrc            # Specifies the Node.js version
├── .yarnrc.yaml      # Specifies the Yarn version
├── package.json      # Root configuration for Yarn workspaces
├── yarn.lock         # Yarn lockfile
└── README.md         # Project documentation
```

## Scripts Overview

Here are the commonly used scripts defined in the monorepo:

- **Install dependencies:**
  ```bash
  yarn install
  ```
- **Build all packages:**
  ```bash
  yarn build
  ```
- **Start the project:**
  ```bash
  yarn start
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
