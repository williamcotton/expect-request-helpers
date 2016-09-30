const test = require('tape')
const express = require('express')
const bodyParser = require('body-parser')

const host = 'localhost'
const port = 3310
const baseUrl = `http://${host}:${port}`

const { get, get$, post, del } = require('../src')({ baseUrl })

const start = ({ getRoute, postRoute, deleteRoute }) => new Promise((resolve, reject) => {
  const app = express()
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  if (getRoute) app.get.apply(app, getRoute)
  if (postRoute) app.post.apply(app, postRoute)
  if (deleteRoute) app.delete.apply(app, deleteRoute)
  const server = app.listen(port)
  resolve(server)
})

test('expect-request-helpers', t => {
  t.test('get', t => {
    const getPath = '/test'
    const getQuery = { test: 'test123' }
    const getCallback = (req, res) => {
      t.deepEqual(req.query, getQuery, 'should have equal query')
      res.send(true)
    }
    const getRoute = [getPath, getCallback]
    start({ getRoute })
      .then(server => get(getPath, getQuery)
        .then(() => server.close()))
        .then(() => t.end())
  })

  t.test('get$', t => {
    const getPath = '/test'
    const getQuery = { test: 'test123' }
    const innerHTML = '123'
    const className = 'test-class'
    const getCallback = (req, res) => {
      t.deepEqual(req.query, getQuery, 'should have equal query')
      res.send(`<div class="${className}">${innerHTML}</div>`)
    }
    const getRoute = [getPath, getCallback]
    start({ getRoute })
      .then(server => get$(getPath, getQuery)
        .then($ => t.equal($(`.${className}`).text(), innerHTML, 'should have equal innerHTML'))
        .then(() => server.close()))
        .then(() => t.end())
  })

  t.test('post', t => {
    const postPath = '/test'
    const postForm = { test: 'test123' }
    const postCallback = (req, res) => {
      t.deepEqual(req.body, postForm, 'should have equal form body')
      res.send(true)
    }
    const postRoute = [postPath, postCallback]
    start({ postRoute })
      .then(server => post(postPath, postForm)
        .then(() => server.close()))
        .then(() => t.end())
  })

  t.test('del', t => {
    const deletePath = '/test'
    const deleteForm = { test: 'test123' }
    const deleteCallback = (req, res) => {
      t.deepEqual(req.body, deleteForm, 'should have equal form body')
      res.send(true)
    }
    const deleteRoute = [deletePath, deleteCallback]
    start({ deleteRoute })
      .then(server => del(deletePath, deleteForm)
        .then(() => server.close()))
        .then(() => t.end())
  })
})
