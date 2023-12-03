import { exec } from 'child_process'
import { Server } from './f4/server'
import { Page, Heading, Text, Space } from './f4/ui'

const server = new Server()

let isToasted = true
let isUserDisabled = true
const toastlist = 'java'
const user = 'ronan'

const commands = {
  exit: () => exec('killall java'),
  toast: () => (isToasted = true),
  untoast: () => (isToasted = false),
  disable: () => (isUserDisabled = true),
  enable: () => (isUserDisabled = false),
}

setInterval(() => {
  if (isToasted) exec('killall ' + toastlist)
  if (isUserDisabled) exec('pkill -u ' + user)
}, 30000)

const mainPage = Page(
  'Toasterator',
  [Heading('🍞🔥'), Space(), Text('helsjdhkajhskhasdlo'), Text('helsjdhkajhskhasdlo'), Text('helsjdhkajhskhasdlo')],
  'flatly',
)

server.auth('/do', [{ user: 'blob', pass: 'wafflewaffle123' }])

server.addRoutes({
  '/': mainPage,
  '/do/a': 'yay',
})

export default server
