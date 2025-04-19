import { LeveldbPersistence } from "y-leveldb"

const persistenceDir = process.env.YPERSISTENCE || "./dbDir"
export const database = new LeveldbPersistence(persistenceDir)
