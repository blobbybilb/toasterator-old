import { exec } from 'child_process'
import { Server } from '@blobbybilb/f4/server'
import { Page, Heading, Text, Space, Button, Form, Submit, Style, Input } from '@blobbybilb/f4/ui'
// import { DBInterface, Item } from '@blobbybilb/f4/db'

// interface TimeTrackingData extends Item {
//   date: string
//   process: string
//   minutes: number
// }

// const timeTrackingDB = new DBInterface('data.sqlite').openTable<TimeTrackingData>('timetracking')

const server = new Server()

if (Bun.argv.length < 4) {
  console.error('Usage: toasterator <username> <password>')
  process.exit(1)
}

let isToasted = true
let isUserDisabled = true
const toastlist = ['java']
// const dailyTimeLimit = 30
const user = 'rblob'

const commands = {
  exit: () => exec('killall java'),
  toast: () => (isToasted = true),
  untoast: () => (isToasted = false),
  disable: () => (isUserDisabled = true),
  enable: () => (isUserDisabled = false),
}

let secondsTillAutoToast = 0

setInterval(() => {
  if (isToasted || secondsTillAutoToast <= 0) exec('killall ' + toastlist.join(' '))
  if (isUserDisabled) exec('pkill -u ' + user)

  if (secondsTillAutoToast > 0) secondsTillAutoToast -= 30
}, 30000)

const mainPage = Page(
  'Toasterator',
  [
    Heading('🍞🔥'),
    Space(),
    Button('Log in', '/login/do'),
    Space(3),
    Button('Toast', '/do/toast'),
    Space(2),
    Button('Untoast', '/do/untoast'),
    Space(2),
    Button('Exit', '/do/exit'),
    Space(2),
    Button('Disable', '/do/disable'),
    Space(2),
    Button('Enable', '/do/enable'),
    Space(3),
    Form(
      '/do/untoastfor',
      [Input('minutes', { type: 'number', placeholder: 'Time (mins)' }), Space(2), Submit('Temporary Untoast')],
      'GET',
    ),
  ],
  'flatly',
)

const donePage = Page('Toasterator', [Heading('Done - 🍞🔥'), Space(), Button('Back', '/')], 'flatly')

server.auth('/do', [{ user: Bun.argv[2], pass: Bun.argv[3] }])

server.addRoutes({
  '/': mainPage,
  '/do/untoastfor': (c) => {
    const minutesParam = c.getParams['minutes']
    if (!minutesParam) return 'Error - no minutes specified'

    const minutes = parseInt(minutesParam)
    if (isNaN(minutes)) return `Error: ${minutesParam} is not a valid amount of minutes`

    isToasted = false
    secondsTillAutoToast = minutes * 60

    return donePage
  },
  '/do/*': (c) => {
    const command = c.path[1]
    if (!Object.keys(commands).includes(command)) return 'Error'
    else (commands as any)[command]()

    return donePage
  },
})

Bun.serve({ fetch: server.fetch, port: 6010})
