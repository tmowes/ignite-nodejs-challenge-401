import request from 'supertest'
import { Connection } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'

import { app } from '../../../../app'
import createConnection from '../../../../database'

let connection: Connection

describe('Get Statement Operation Controller', () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to get a statement', async () => {
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

    const {
      body: { id: statement_id },
    } = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        description: 'Deposit Statement Supertest Description',
        amount: 100,
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    const { status, body } = await request(app)
      .get(`/api/v1/statements/${statement_id}`)
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('sender_id')
    expect(body.operation_type).toEqual('deposit')
    expect(body.amount).toBe('100.00')
    expect(body.description).toBe('Deposit Statement Supertest Description')
    expect(status).toBe(200)
  })
  it('should not be able to get a non-existing statement', async () => {
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

    const statement_id = uuidV4()

    const { status } = await request(app)
      .get(`/api/v1/statements/${statement_id}`)
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(status).toBe(404)
  })

  it('should not be able to get a balance with statement list without a valid token', async () => {
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

    const {
      body: { id: statement_id },
    } = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        description: 'Deposit Statement Supertest Description',
        amount: 100,
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    const { status } = await request(app)
      .get(`/api/v1/statements/${statement_id}`)
      .set({
        Authorization: `Bearer invalid_token`,
      })

    expect(status).toBe(401)
  })
})
