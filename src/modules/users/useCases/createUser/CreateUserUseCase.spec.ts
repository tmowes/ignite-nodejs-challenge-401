import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO"

import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })
  it('should be able to create a new deposit', async () => {
    const createdNewUser: ICreateUserDTO = {
      name: "User Name Test",
      email: "useremail@testexample.com",
      password: "User Password Test",
    }
    const newUserCreated = await createUserUseCase.execute(createdNewUser)
    expect(newUserCreated).toHaveProperty('id')
  })

  it('should not be able to create a new user with same email', async () => {
    const createdNewUser: ICreateUserDTO = {
      name: "User1 Name Test",
      email: "user1email@testexample.com",
      password: "User1 Password Test",
    }

    const createDuplicatedUser: ICreateUserDTO = {
      name: "User2 Name Test",
      email: "user1email@testexample.com",
      password: "User2 Password Test",
    }
    await createUserUseCase.execute(createdNewUser)

    await expect(createUserUseCase.execute(createDuplicatedUser)
    ).rejects.toEqual(new AppError('User already exists'))
  })
})
