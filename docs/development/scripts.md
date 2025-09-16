# Scripts Overview

Here are the commonly used scripts defined in the monorepo:

## Installation and Dependencies

- **Install dependencies:**
  ```bash
  npm install
  ```

## Building

- **Build all packages:**
  ```bash
  npm run build
  ```

## Running the Application

- **Start the project:**
  ```bash
  npm run start
  ```

## Code Quality

- **Check linting of the project:**

  ```bash
  npm run lint
  ```

- **Fixes formatting issues:**

  ```bash
  npm run format
  ```

- **Checks formatting issues without fixing them:**
  ```bash
  npm run format:check
  ```

## Dockerized local Database

- **Start local database:**
  ```bash
  npm run start:localdb
  ```

## Library Publishing

- **Publish patch version:**

  ```bash
  npm run publish:library:patch
  ```

- **Publish minor version:**
  ```bash
  npm run publish:library:minor
  ```
