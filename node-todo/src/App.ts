import { Express, Router, RequestHandler } from 'express'
import { Server } from 'http';

export class App {
    constructor(
        public express: Express,
        private port: string
    ) { }

    mountRoutes(path: string, router: Router) {
        return this.express.use(path, router)
    }

    useMiddleware(fn: RequestHandler) {
        return this.express.use(fn);
    }

    start(): Server {        
        return this.express.listen(this.port, () => { console.log(`App started with ${this.port}`); })
    }
}