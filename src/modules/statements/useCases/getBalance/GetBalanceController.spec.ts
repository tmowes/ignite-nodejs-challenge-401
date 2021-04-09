import request from 'supertest'
import { Connection } from 'typeorm'

import { app } from '../../../../app'
import createConnection from '../../../../database'

let connection: Connection

describe('Get Balance Controller', () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to get a balance with statement list', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'User Supertest Name',
      email: 'useremail@testexample.com',
      password: 'correct_password',
    })

    const {
      body: { token },
    } = await request(app).post('/api/v1/sessions').send({
      email: 'useremail@testexample.com',
      password: 'correct_password',
    })

    const { status } = await request(app)
      .get('/api/v1/statements/balance')
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(status).toBe(200)
  })
  it('should not be able to get a balance with statement list without a valid token', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'User Supertest Name',
      email: 'useremail@testexample.com',
      password: 'correct_password',
    })

    await request(app).post('/api/v1/sessions').send({
      email: 'useremail@testexample.com',
      password: 'correct_password',
    })

    const { status } = await request(app)
      .get('/api/v1/statements/balance')
      .set({
        Authorization: `Bearer invalid_token`,
      })

    expect(status).toBe(401)
  })
})
