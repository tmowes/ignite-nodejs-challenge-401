import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetStatementOperationError } from "./GetStatementOperationError"

import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let getStatementOperationUseCase: GetStatementOperationUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Get Statement Operation', () => {

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it('should not be able to get a non-existing statement', async () => {
    const createdUser = await inMemoryUsersRepository.create({
      name: "User2 Name Test",
      email: "user2email@testexample.com",
      password: "User2 Password Test",
    })

    await expect(getStatementOperationUseCase.execute({ user_id: createdUser.id, statement_id: 'invalid_statement_id' })
    ).rejects.toEqual(new AppError('Statement not found', 404))
  })

  it('should not be able to get a statement whit a non-existing user', async () => {
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

    await expect(getStatementOperationUseCase.execute({ user_id: "invalid_user_id", statement_id: createDepositStatement.id })
    ).rejects.toEqual(new AppError('User not found', 404))
  })
  it('should be able to get a statement operation', async () => {
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

    const getStatementOperation = await getStatementOperationUseCase.execute({
      user_id: createdUser.id,
      statement_id: createDepositStatement.id
    })

    expect(getStatementOperation).toHaveProperty('id')
    expect(getStatementOperation).toEqual(createDepositStatement)
  })

})
