import { DBInterface, item } from "./db"

interface Passwords extends item {
  name: string;
  user: string;
  pass: string;
}

const db = new DBInterface("data.sqlite")
const config = db.openTable<Passwords>("config")

export {
  Passwords,
  db,
  config,
}
