import { Server } from './f4/server'
import { Page, Heading, Text, Button, Buttons, Space, Form, Input, Alert, Select, Option, Submit } from './f4/ui'

const server = new Server()

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
