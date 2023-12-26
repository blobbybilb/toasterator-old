import { Item } from './db.ts'
import { Form, Input, Page, Space, Submit } from './ui.ts'
import { Context, Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { serveStatic } from 'hono/bun'

interface User extends Item {
  user: string
  pass: string
}

interface ReqData {
  url: URL
  path: string[]
  getParams: Record<string, string>
  postParams: Record<string, string>
  login?: User
}

const loginPage = (path: string) =>
  Page('Login', [
    Space(),
    Form(
      '/login' + path,
      [
        Input('username', { placeholder: 'Username' }),
        Space(2),
        Input('password', { placeholder: 'Password', type: 'password' }),
        Space(2),
        Submit('Login'),
      ],
      'POST',
    ),
  ])

export class Server {
  h = new Hono()
  fetch = this.h.fetch as any

  constructor(staticDir = 'static') {
    this.h.get('/logout', (c) => {
      deleteCookie(c, 'loginCredentials')
      return c.redirect('/')
    })
    if (staticDir !== '') this.h.use(`/${staticDir}/*`, serveStatic({ root: './' }))
  }

  auth<T extends User>(route: string, loginsData: T[] | (() => T[])): Server {
    route = route.at(-2) == '/' || route.at(-1) == '/' ? route : route + '/'
    route = route.at(-1) == '*' ? route : route + '*'
    route = route.at(0) == '/' ? route : route + '/'
    let logins = ((typeof loginsData == 'function' ? loginsData() : loginsData) as T[]).map(
      (e) => e.user + '|' + e.pass,
    )

    this.h.get('/login' + route.substring(0, route.length - 2), (c) => {
      return c.html(loginPage(route.substring(0, route.length - 2)))
    })

    this.h.use(route, async (c, next) => {
      logins = ((typeof loginsData == 'function' ? loginsData() : loginsData) as T[]).map((e) => e.user + '|' + e.pass)
      const loginCookie = getCookie(c, 'loginCredentials')
      console.log(2, loginCookie)
      if (loginCookie == undefined) return c.text('Not logged in.')
      if (!logins.includes(loginCookie)) return c.text('Incorrect username/password.')
      await next()
    })

    this.h.post('/login' + route.substring(0, route.length - 2), async (c) => {
      logins = ((typeof loginsData == 'function' ? loginsData() : loginsData) as T[]).map((e) => e.user + '|' + e.pass)
      const formData = await c.req.formData()
      const toBeCookie = formData.get('username') + '|' + formData.get('password')
      if (!logins.includes(toBeCookie)) return c.text('Incorrect username/password.')
      setCookie(c, 'loginCredentials', toBeCookie, { path: '/' })
      console.log(1, getCookie(c, 'loginCredentials'))
      return c.text('Logged in')
    })

    return this
  }

  #getResponseType(c: Context, resp: string) {
    switch (resp.trim().at(0)) {
      case '<':
        return c.html(resp.trim())
      case '{':
        return c.json(resp.trim())
      default:
        return c.text(resp)
    }
  }

  addRoutes(routes: { [k: string]: ((data: ReqData) => string) | string }) {
    Object.keys(routes).forEach((k) => {
      const path =
        '/' +
        k
          .split('/')
          .filter((e) => e !== '')
          .map((e, i) => (e === '_' ? ':p' + i : e))
          .join('/')

      const resp = routes[k]
      if (typeof resp === 'string' && resp.startsWith('file://')) {
        this.h.use(path, serveStatic({ path: resp.replace('file://', '') }))
        return
      }

      this.h.all(path, async (c) => {
        console.log(getCookie(c, 'loginCredentials'))
        if (typeof resp === 'string') return this.#getResponseType(c, resp)

        const loginCookie: string | undefined = getCookie(c, 'loginCredentials')
        let login: User | undefined = undefined
        if (loginCookie !== undefined) {
          const [a, b] = loginCookie.split('|')
          login = { user: a, pass: b }
        }

        return this.#getResponseType(
          c,
          resp({
            url: new URL(c.req.url),
            path: c.req.path.split('/').filter((e) => e !== ''),
            getParams: Object.fromEntries(Object.entries(c.req.query())),
            postParams: Object.fromEntries(Object.entries(await c.req.parseBody())) as any,
            login: login,
          }),
        )
      })
    })
  }
}
