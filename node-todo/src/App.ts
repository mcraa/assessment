import { Express, Router, RequestHandler } from 'express'
import { Server } from 'http';

export class App {
    private server: Server
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
        this.server = this.express.listen(this.port, () => { console.log(`App started with ${this.port}`); })
        return this.server;
    }

    stop(): void {
        this.server.close();
    }
}