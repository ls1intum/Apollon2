import packageJson from "../../package.json"

export const appVersion = packageJson.version
export const apollonLibraryVersion =
  packageJson.dependencies["@tumaet/apollon"] || "" // Replace with your desired package name
export const apollon2RepositoryLink = "https://github.com/ls1intum/apollon2"
