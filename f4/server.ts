import {Item} from "../db.ts"
import {Page, Text} from "./ui.ts"
import {Context, Hono} from "hono"
import {getCookie, setCookie} from "hono/cookie"
import {serveStatic} from "hono/bun";
import {password} from "bun";

interface User extends Item {
    username: string
    password: string
}


class Server {
    h = new Hono()
    fetch = this.h.fetch

    constructor(staticDir = "static") {
        this.h.get("/login/*", (c) => c.html(""))
        if (staticDir !== "") this.h.use(`/${staticDir}/*`, serveStatic({root: "./"}))
    }

    protect<T extends User>(route: string, loginsData: (T[] | (() => T[]))): Server {
        route = ((route.at(-2) == '/') || (route.at(-1) == '/')) ? route : route + '/'
        route = (route.at(-1) == '*') ? route : route + '*'
        route = (route.at(0) == '/') ? route : route + '/'
        const logins = (((typeof loginsData == "function") ? loginsData() : loginsData) as T[])
            .map(e => e.username + '|' + e.password)

        this.h.use(route, async (c, next) => {
            const loginCookie = getCookie(c, 'loginCredentials')
            if (loginCookie == undefined) return c.text("Not logged in.")
            if (!(logins.includes(loginCookie))) return c.text("Incorrect username/password.")
            await next()
        })

        this.h.post("/login" + route.substring(0, route.length - 2), async (c) => {
            const formData = await c.req.formData()
            const toBeCookie = formData.get("username") + "|" + formData.get("password")
            if (!(logins.includes(toBeCookie))) return c.text("Incorrect username/password.")
            setCookie(c, "loginCredentials", toBeCookie)
            return c.text("Logged in")
        })

        return this
    }

    #getResponseType(c: Context, resp: string) {
        switch (resp.trim().at(0)) {
            case "<":
                return c.html(resp)
            case "{":
                return c.json(resp)
            default:
                return c.text(resp)
        }
    }

    addRoutes(routes: { [k: string]: ((data: ReqData) => string) | string }) {
        Object.keys(routes).forEach((k) => {
            const path = "/" + k.split("/")
                .filter((e) => e !== "")
                .map((e, i) => e === "_" ? ":p" + i : e)
                .join("/")

            const resp = routes[k]
            if (typeof resp === "string" && resp.startsWith("file://")) {
                this.h.use(path, serveStatic({path: resp.replace("file://", ".")}))
                return
            }

            this.h.all(path, async (c) => {
                if (typeof resp === "string") return this.#getResponseType(c, resp)

                const loginCookie: string | undefined = getCookie(c, "loginCredentials")
                let login: User | undefined = undefined
                if (loginCookie !== undefined) {
                    const [a, b] = loginCookie.split("|")
                    login = {username: a, password: b}
                }

                resp({
                    url: new URL(c.req.url),
                    path: c.req.path.split("/").filter(e => e !== ""),
                    getParams: Object.fromEntries(Object.entries(c.req.query())),
                    postParams: Object.fromEntries(Object.entries(await c.req.parseBody())),
                    login: login
                })

                return c.text("hi")
            })
        })
    }
}

const routes = {
    "/": (c) => {
        Page("test", [Text("hello")])
    },
}

interface ReqData {
    url: URL
    path: string[]
    getParams: Record<string, string>
    postParams: Record<string, string>
    login?: User
}


export {User, Server}