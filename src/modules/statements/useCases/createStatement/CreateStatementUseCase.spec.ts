import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"

import { CreateStatementUseCase } from "./CreateStatementUseCase"

let createStatementUseCase: CreateStatementUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Create Statement', () => {

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })
  it('should be able to create a new deposit', async () => {
    const createdUser = await inMemoryUsersRepository.create({
      name: "User Name Test",
      email: "useremail@testexample.com",
      password: "User Password Test",
    })

    const createDepositStatement = {
      user_id: createdUser.id,
      type: OperationType.DEPOSIT,
      amount: 99,
      description: "Statement Description Test",
    }

    const depositStatementCreated = await createStatementUseCase.execute(createDepositStatement)

    expect(depositStatementCreated).toHaveProperty('id')
  })

  it('should be able to create a new withdraw with funds', async () => {
    const createdUser = await inMemoryUsersRepository.create({
      name: "User2 Name Test",
      email: "user2email@testexample.com",
      password: "User2 Password Test",
    })
    const createDepositStatement = {
      user_id: createdUser.id,
      type: OperationType.DEPOSIT,
      amount: 99,
      description: "Statement Description Test",
    }
    const createWithdrawStatement = {
      user_id: createdUser.id,
      type: OperationType.WITHDRAW,
      amount: 69,
      description: "Statement Description Test",
    }

    await createStatementUseCase.execute(createDepositStatement)
    const withdrawStatementCreated = await createStatementUseCase.execute(createWithdrawStatement)
    expect(withdrawStatementCreated).toHaveProperty('id')
  })

  it('should not be able to create a new withdraw without funds', async () => {
    const createdUser = await inMemoryUsersRepository.create({
      name: "User2 Name Test",
      email: "user2email@testexample.com",
      password: "User2 Password Test",
    })

    const createDepositStatement = {
      user_id: createdUser.id,
      type: OperationType.DEPOSIT,
      amount: 69,
      description: "Statement Description Test",
    }

    const createWithdrawStatement = {
      user_id: createdUser.id,
      type: OperationType.WITHDRAW,
      amount: 99,
      description: "Statement Description Test",
    }

    await createStatementUseCase.execute(createDepositStatement)

    await expect(createStatementUseCase.execute(createWithdrawStatement)
    ).rejects.toEqual(new CreateStatementError.InsufficientFunds);
  })

  it('should not be able to create a new statement when user does not exist', async () => {
    const createDepositStatement = {
      user_id: "invalid_user_id",
      type: OperationType.DEPOSIT,
      amount: 99,
      description: "Statement Description Test",
    }
    await expect(createStatementUseCase.execute(createDepositStatement)
    ).rejects.toEqual(new CreateStatementError.UserNotFound);
  })

})
