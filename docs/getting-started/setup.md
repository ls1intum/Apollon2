# Setup Instructions

Follow these steps to set up the Apollon2 monorepo on your local machine.

## Initial Setup

1. **Clone the repository:**

   ```bash
   git clone git@github.com:ls1intum/Apollon2.git
   cd Apollon2
   ```

2. **Use the correct Node.js version:**

   ```bash
   nvm install
   nvm use
   ```

3. **Install dependencies for all packages:**

   ```bash
   npm install
   ```

4. **Create .env files for standalone/webapp and standalone/server**

   Check .env.examples files and create values

5. **Build all packages:**

   ```bash
   npm run build
   ```

6. **Run Docker and start database via docker:**

   ```bash
   npm run start:localdb
   ```

7. **Start the project:**
   ```bash
   npm run start
   ```
