import { exit } from "process"
import server from "./server"
import { config } from "./storage"

const cmd = Bun.argv[2]

if (cmd === "server") {
  if (config.tableExists === false) {
    console.error("No config found. Run 'toasterator config' to set up a username and password.")
    exit(1)
  }

  Bun.serve(server)
} else if (cmd === "config") {
  let [user, pass] = [prompt("Enter username: "), prompt("Enter password: ")]

  if (user === null || pass === null) {
    console.error("Enter a username and password.")
    exit(1)
  }

  config.del({ name: "webui" })
  config.add({ name: "webui", user: user.trim(), pass: pass.trim() })

  console.log(`Username and password set. (User: '${user.trim()}', Pass: '${pass.trim()}'`)
} else {
  console.log("Unknown command.")
}
