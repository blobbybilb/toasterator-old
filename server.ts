import {Hono} from 'hono'
import {basicAuth} from 'hono/basic-auth'
import {Button, Page, Style} from './f4/ui'
import {config} from './storage'

function runServer(port: number) {
    const app = new Hono()

    const {user, pass} = config.get({name: "webui"})[0]

    app.use(
        '/do/*',
        basicAuth({
            username: user,
            password: pass,
        })
    )

    app.get('/')

    app.get('/do/page', (c) => {
        const reqURL = new URL(c.req.url)
        reqURL.username = "logout"
        reqURL.pathname = "/do"
        return c.html(Page("Test", [Button("Logout", reqURL.toString(), Style.secondary)]))
    })

    Bun.serve({fetch: app.fetch, port})
}

export {runServer}
