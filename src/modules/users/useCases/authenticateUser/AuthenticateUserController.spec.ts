import request from 'supertest'
import { Connection } from 'typeorm'

import { app } from '../../../../app'
import createConnection from '../../../../database'

let connection: Connection

describe('Authenticate User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to authenticate a user', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'User Supertest Name',
      email: 'useremail@testexample.com',
      password: 'correct_password',
    })

    const { body, status } = await request(app).post('/api/v1/sessions').send({
      email: 'useremail@testexample.com',
      password: 'correct_password',
    })

    const { token, user } = body

    expect(body).toHaveProperty('token')
    expect(body).toEqual({
      token,
      user: {
        ...user,
        name: 'User Supertest Name',
        email: 'useremail@testexample.com',
      },
    })
    expect(status).toBe(200)
  })
  it('should not be able to authenticate a non-existing user', async () => {
    const { status } = await request(app).post('/api/v1/sessions').send({
      email: 'nonexistinguseremail@testexample.com',
      password: 'correct_password',
    })
    expect(status).toBe(401)
  })
  it('should not be able to authenticate a user with incorrect email', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'User Supertest Name',
      email: 'useremail@testexample.com',
      password: 'correct_password',
    })

    const { status } = await request(app).post('/api/v1/sessions').send({
      email: 'nonexistinguseremail@testexample.com',
      password: 'correct_password',
    })
    expect(status).toBe(401)
  })
  it('should not be able to authenticate a user with incorrect password', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'User Supertest Name',
      email: 'useremail@testexample.com',
      password: 'correct_password',
    })

    const { status } = await request(app).post('/api/v1/sessions').send({
      email: 'useremail@testexample.com',
      password: 'incorrect_password',
    })
    expect(status).toBe(401)
  })
})
