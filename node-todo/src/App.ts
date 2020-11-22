import { Express, Router } from 'express'
import { Server } from 'http';

export class App {
    constructor(
        private express: Express,
        private port: string
    ) { }

    mountRoutes(path: string, router: Router) {
        return this.express.use(path, router)
    }

    start(): Server {
        return this.express.listen(this.port, () => { console.log(`App started with ${this.port}`); })
    }
}