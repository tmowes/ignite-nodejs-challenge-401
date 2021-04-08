import request from 'supertest'
import { Connection } from 'typeorm'

import { app } from '../../../../app'
import createConnection from '../../../../database'

let connection: Connection

describe('Create Statement Controller', () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to create a new deposit', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'User Supertest Name',
        email: 'useremail@testexample.com',
        password: 'correct_password',
      })

    const { body: { token } } = await request(app).post('/api/v1/sessions').send({
      email: 'useremail@testexample.com',
      password: 'correct_password',
    })

    const { status, body } = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        description: 'Deposit Statement Supertest Description',
        amount: 100,
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('user_id')
    expect(body.type).toEqual('deposit')
    expect(body.amount).toBe(100)
    expect(body.description).toBe('Deposit Statement Supertest Description')
    expect(status).toBe(201)
  })
  it('should not be able to create a new deposit statement without a valid token', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'User Supertest Name',
        email: 'useremail@testexample.com',
        password: 'correct_password',
      })

    await request(app).post('/api/v1/sessions').send({
      email: 'useremail@testexample.com',
      password: 'correct_password',
    })

    const { status } = await request(app)
      .post('/api/v1/statements/deposit')
      .set({
        Authorization: `Bearer invalid_token`,
      })

    expect(status).toBe(401)
  })
  it('should not be able to create a new withdraw statement without a valid token', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'User Supertest Name',
        email: 'useremail@testexample.com',
        password: 'correct_password',
      })

    await request(app).post('/api/v1/sessions').send({
      email: 'useremail@testexample.com',
      password: 'correct_password',
    })

    const { status } = await request(app)
      .post('/api/v1/statements/withdraw')
      .set({
        Authorization: `Bearer invalid_token`,
      })

    expect(status).toBe(401)
  })
  it('should not be able to create a withdraw statement with insufficient funds', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'User Supertest Name',
        email: 'useremail@testexample.com',
        password: 'correct_password',
      })

    const { body: { token } } = await request(app).post('/api/v1/sessions').send({
      email: 'useremail@testexample.com',
      password: 'correct_password',
    })

    const { status, body } = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        description: 'Withdraw Statement Supertest Description',
        amount: 999,
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(status).toBe(400)
    expect(body.message).toBe('Insufficient funds')
  })
})
