# iOS and Android Setup

This guide covers setting up the mobile applications for iOS and Android using Capacitor.

## Prerequisites

Make sure you have completed the [initial setup](../getting-started/setup.md) first.

## Setup Instructions

1. **Install the latest packages**

   ```bash
   npm i
   ```

2. **Build the application**

   ```bash
   npm run build
   ```

3. **For the first time, generate ios and android folder:**

   For iOS:

   ```bash
   npm run capacitor:add:ios
   ```

   For Android:

   ```bash
   npm run capacitor:add:android
   ```

4. **Generate assets:**

   ```bash
   npm run capacitor:assets:generate:ios
   ```

5. **Sync the files**

   ```bash
   npm run capacitor:sync
   ```

6. **Open the App**

   For iOS:

   ```bash
   npm run capacitor:open:ios
   ```

   For Android:

   ```bash
   npm run capacitor:open:android
   ```
