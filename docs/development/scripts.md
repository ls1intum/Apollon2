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

## Docker Commands

- **Build with docker:**

  ```bash
  npm run docker:build
  ```

- **Run with docker:**
  ```bash
  npm run docker:start
  ```
  After running 'npm run docker:start' you can navigate to http://localhost:8080/ and start using the application

## Database

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
