import {Hono} from "hono";
import {getCookie, setCookie} from "hono/cookie";


const app = new Hono()

//app.get('/auth/page', (c) => {
//    return c.text(getCookie(c, 'authToken'))
//})
//
//app.get('/a', (c) => {
//    setCookie(c, "authToken", 'it-is-ve-secret')
//    return c.text("hi")
//})

app.get('/posts/:id/comment/:comment_id', (c) => {
    const x = c.req.query()
    console.log(Object.fromEntries(Object.entries(x)))
    return c.text("hi")
})

export default app

//console.log({"hi": "hello", "345jh": "hihihi", "jsdhf": "b"})