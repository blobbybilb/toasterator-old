# F4 - The Fast Friendly Functionality Framework

The simplest fairly-featureful web framework.

### Frictionless & Full-stack
- Simple layer for routing over Hono
```ts
let i = 0
server.addRoutes({
  '/': 'Hello There!',
  '/counter': () => 'Visited ' + (i++) + ' times',
  '/file': 'file://./some_file.txt',
})
```
- User auth in a single line of code
    - `server.auth('/admin', [{ user: 'username', pass: 'password' }]) // specify a single user`
    - `server.auth('/app', usersDB.get({})) // get all users from DB`
- DB interface that uses TypeScript object types to automatically manage SQLite, no SQL or manual schema definition needed
- Frontend UI helpers based on Boostrap
