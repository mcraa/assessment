import { expect } from 'chai';
import 'mocha'

const fs = require('fs');
const request = require('supertest');

import main from '../src'

describe("Todo endpoints", () => {

    after(() => {
        try {
            main.app.stop()
        } catch (error) {
            console.log("Can't stop server");            
        }
        
        try {
            fs.unlink(main.storage.getPath())
            fs.unlink(`${main.storage.getPath()}.que`)
        } catch (error) {
            
        }
    })

    it("GET /todos should return todos", (done) => {
        request(main.app.express)
            .get("/todos")
            .expect('Content-Type', /json/)
            .expect(200, done)
    });

    it('POST /todos should create todo', (done) => {
        request(main.app.express)
          .post('/todos')
          .send({ text: "hello" })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(function(res) {
              res.body.id = 'generated'
          })
          .expect(200, { id: "generated", text: "hello", priority: 3, done: false }, done)
    });

    it('GET /todos/id should get a todo', (done) => {
        const todos = [{ id: "id", text: "bubu" }, { id: "id2", text: "yogi" }];
        fs.writeFileSync(main.storage.getPath(), JSON.stringify(todos))
        request(main.app.express)
          .get('/todos/id')
          .expect('Content-Type', /json/)
          .expect(200, todos[0], done)
    });

    it('DELETE /todos/id should delete a todo', (done) => {
        const todos = [{ id: "id", text: "bubu" }, { id: "id2", text: "yogi" }];
        fs.writeFileSync(main.storage.getPath(), JSON.stringify(todos));
        
        request(main.app.express)
          .delete('/todos/id')
          .expect(200)
          .then((res) => {
              fs.readFile(main.storage.getPath(), (err, data) => {                  
                  expect(JSON.parse(data.toString())).to.be.eql([todos[1]])
                  done();              
              })
          })
    });

    it('PUT /todos/id should update a todo', (done) => {
        const todos = [{ id: "id", text: "bubu" }, { id: "id2", text: "yogi" }];
        fs.writeFileSync(main.storage.getPath(), JSON.stringify(todos));
        fs.writeFileSync(`${main.storage.getPath()}.que`, JSON.stringify({}));
        
        request(main.app.express)
          .put('/todos/id')
          .send({ text: "Laci"})
          .expect(200)
          .then((res) => {
              fs.readFile(main.storage.getPath(), (err, data) => { 
                  let parsed = JSON.parse(data.toString())                 
                  expect(parsed[0].text).to.be.eql("Laci")
                  done();              
              })
          })
    });
})