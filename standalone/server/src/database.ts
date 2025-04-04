import { LeveldbPersistence } from "y-leveldb"

const persistenceDir = process.env.YPERSISTENCE || "./persistenceDB"
export const database = new LeveldbPersistence(persistenceDir)
