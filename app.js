const express = require('express')
const {open} = require('sqlite')
const path = require('path')
const sqlite3 = require('sqlite3')
const nodemon = require('nodemon')
const app = express()
app.use(express.json)

let db = null

const dbPath = path.join(__dirname, 'todoApplication.db')

const initializeDBAndServe = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000')
    })
  } catch (error) {
    console.log(`DB ERROR: ${error.message}`)
  }
}

initializeDBAndServe()

app.get('/todos/', async (request, response) => {
  //get status TO Do list
  const {status} = request.query
  const statusQuery = `SELECT * FROM todo WHERE status='${status}';`
  const statusToDoList = await db.all(statusQuery)
  response.send(statusToDoList)
})

app.get('/todos/', async (request, response) => {
  //get priority to list
  const {priority} = request.query
  const priorityQuery = `SELECT * FROM todo WHERE priority='${priority}';`
  const priorityHighList = await db.all(priorityQuery)
  response.send(priorityHighList)
})

app.get('/todos/', async (request, response) => {
  //get priority and status to list
  const {priority, status} = request.query
  const priorityAndStautusQuery = `SELECT * FROM todo WHERE priority='${priority}' AND status='${status}';`
  const priorityAndStautusList = await db.all(priorityAndStautusQuery)
  response.send(priorityAndStautusList)
})

app.get('/todos/', async (request, response) => {
  //get search word to list
  const {search_q} = request.query
  const searchQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%';`
  const searchWordList = await db.all(searchQuery)
  response.send(searchWordList)
})

app.get('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const getTodoQuery = `SELECT * FROM todo WHERE id=${todoId};`
  const getTodo = await db.get(getTodoQuery)
  response.send(getTodo)
})

app.post('/todos/', async (request, response) => {
  const {id, todo, priority, status} = request.body
  const postTodoQuery = `INSTERT INTO todo (id, todo, priority, status) VALUES (${id},'${todo}','${priority}','${status}')`
  await db.run(postTodoQuery)
  response.send('Todo Successfully Added')
})

app.put('/todos/:todoId/', async (response, request) => {
  const {todo, priority, status} = request.body
  switch (true) {
    case status !== undefined:
      const putStatusQuery = `UPDATE todo SET (status='${status}')`
      await db.run(putStatusQuery)
      response.send('Status Updated')
    case priority !== undefined:
      const putPriorityQuery = `UPDATE todo SET (priority='${priority}')`
      await db.run(putPriorityQuery)
      response.send('Priority Updated')
    case status !== undefined:
      const putTodoQuery = `UPDATE todo SET (todo='${todo}')`
      await db.run(putTodoQuery)
      response.send('Todo Updated')
  }
})

app.get('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const deleteTodoQuery = `  DELETE FROM todo WHERE id=${todoId};`
  const deleteTodo = await db.get(deleteTodoQuery)
  response.send('Todo Deleted')
})
