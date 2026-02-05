import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "de.tum.cit.ase.apollonreengineering",
  appName: "Apollon Reengineering Mobile",
  webDir: "standalone/webapp/dist",
  ios: {
    contentInset: "never",
    preferredContentMode: "mobile",
  },
  plugins: {
    StatusBar: {
      style: "dark",
      backgroundColor: "#000000",
      overlaysWebView: false,
    },
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
}

export default config
