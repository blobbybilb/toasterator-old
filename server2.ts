import { exec } from 'child_process'
import { Server } from '@blobbybilb/f4/server'
import { Page, Heading, Text, Space, Button } from '@blobbybilb/f4/ui'

const server = new Server()

let isToasted = true
let isUserDisabled = true
const toastlist = 'java'
const user = 'rblob'

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
  [Heading('🍞🔥'), Space(), Text('helsjdhkajhskhasdlo'), Text('helsjdhkajhskhasdlo'), Text('helsjdhkajhskhasdlo'), Button('Toast', '/do/toast')],
  'flatly',
)

const donePage = Page('Done - Toasterator', [], 'flatly')

server.auth('/do', [{ user: 'blob', pass: 'wafflewaffle123' }])

server.addRoutes({
  '/': mainPage,
  '/do/*': (c) => {
    const command = c.path[1]
    if (!Object.keys(commands).includes(command)) return 'Error'
    else (commands as any)[command]()

    return donePage
  },
})

export default server
