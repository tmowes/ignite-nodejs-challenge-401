import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceError } from "./GetBalanceError"

import { GetBalanceUseCase } from "./GetBalanceUseCase"

let getBalanceUseCase: GetBalanceUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })
  it('should be able to get the balance with statement list', async () => {
    const createdUser = await inMemoryUsersRepository.create({
      name: "User Name Test",
      email: "useremail@testexample.com",
      password: "User Password Test",
    })

    const createDepositStatement = await inMemoryStatementsRepository.create({
      user_id: createdUser.id,
      type: OperationType.DEPOSIT,
      amount: 99,
      description: "Statement Description Test",
    })

    const createWithdrawStatement = await inMemoryStatementsRepository.create({
      user_id: createdUser.id,
      type: OperationType.WITHDRAW,
      amount: 69,
      description: "Statement Description Test",
    })

    const getBalance = await getBalanceUseCase.execute({ user_id: createdUser.id })

    expect(getBalance).toHaveProperty('balance')
    expect(getBalance.balance).toBe(createDepositStatement.amount - createWithdrawStatement.amount)
    expect(getBalance.statement).toEqual([createDepositStatement, createWithdrawStatement])
    expect(getBalance).toEqual({
      balance: createDepositStatement.amount - createWithdrawStatement.amount,
      statement: [createDepositStatement, createWithdrawStatement]
    })
  })

  it('should not be able to get a balance with statement list without a valid token', async () => {
    const createdUser = await inMemoryUsersRepository.create({
      name: "User2 Name Test",
      email: "user2email@testexample.com",
      password: "User2 Password Test",
    })

    const createDepositStatement = await inMemoryStatementsRepository.create({
      user_id: createdUser.id,
      type: OperationType.DEPOSIT,
      amount: 99,
      description: "Statement Description Test",
    })

    await expect(getBalanceUseCase.execute({ user_id: "invalid_user_id" })
    ).rejects.toEqual(new GetBalanceError);
  })

})