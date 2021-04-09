import { getRepository, Repository } from 'typeorm'

import { ICreateUserDTO } from '../dtos/ICreateUserDTO'
import { User } from '../entities/User'
import { IUsersRepository } from './IUsersRepository'

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>

  constructor() {
    this.repository = getRepository(User)
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({
      email,
    })
  }

  async findById(user_id: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { id: user_id } })
  }

  async create({ name, email, password }: ICreateUserDTO): Promise<User> {
    const user = this.repository.create({ name, email, password })

    return this.repository.save(user)
  }
}
