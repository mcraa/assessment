var express = require('express');
import { Request, Response } from 'express';

let app = express();

app.get('/todos', (_: Request, res: Response) => {
    res.send("Hello Todo")
})

app.listen(2233)