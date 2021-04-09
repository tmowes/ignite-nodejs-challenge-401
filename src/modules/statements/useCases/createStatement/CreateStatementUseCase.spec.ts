import { AppError } from '../../../../shared/errors/AppError'
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { ICreateStatementDTO } from '../../dtos/ICreateStatementDTO'
import { OperationType } from '../../entities/Statement'
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'
import { CreateStatementUseCase } from './CreateStatementUseCase'

let createStatementUseCase: CreateStatementUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    )
  })
  it('should not be able to create a new withdraw without funds', async () => {
    const createdUser = await inMemoryUsersRepository.create({
      name: 'User2 Name Test',
      email: 'user2email@testexample.com',
      password: 'User2 Password Test',
    })

    const createDepositStatement = {
      sender_id: createdUser.id,
      operation_type: OperationType.DEPOSIT,
      amount: 69,
      description: 'Statement Description Test',
    }

    const createWithdrawStatement = {
      sender_id: createdUser.id,
      operation_type: OperationType.WITHDRAW,
      amount: 99,
      description: 'Statement Description Test',
    }

    await createStatementUseCase.execute(createDepositStatement)

    await expect(
      createStatementUseCase.execute(createWithdrawStatement)
    ).rejects.toEqual(new AppError('Insufficient funds', 400))
  })

  it('should not be able to create a new statement when user does not exist', async () => {
    const createDepositStatement = {
      sender_id: 'invalid_user_id',
      operation_type: OperationType.DEPOSIT,
      amount: 99,
      description: 'Statement Description Test',
    }
    await expect(
      createStatementUseCase.execute(createDepositStatement)
    ).rejects.toEqual(new AppError('User not found', 404))
  })

  it('should be able to create a new withdraw with funds', async () => {
    const createdUser = await inMemoryUsersRepository.create({
      name: 'User2 Name Test',
      email: 'user2email@testexample.com',
      password: 'User2 Password Test',
    })
    const createDepositStatement = {
      sender_id: createdUser.id,
      operation_type: OperationType.DEPOSIT,
      amount: 99,
      description: 'Statement Description Test',
    }
    const createWithdrawStatement = {
      sender_id: createdUser.id,
      operation_type: OperationType.WITHDRAW,
      amount: 69,
      description: 'Statement Description Test',
    }

    await createStatementUseCase.execute(createDepositStatement)
    const withdrawStatementCreated = await createStatementUseCase.execute(
      createWithdrawStatement
    )
    expect(withdrawStatementCreated).toHaveProperty('id')
  })
  it('should be able to create a new deposit', async () => {
    const createdUser = await inMemoryUsersRepository.create({
      name: 'User Name Test',
      email: 'useremail@testexample.com',
      password: 'User Password Test',
    })

    const createDepositStatement = {
      sender_id: createdUser.id,
      operation_type: OperationType.DEPOSIT,
      amount: 99,
      description: 'Statement Description Test',
    }

    const depositStatementCreated = await createStatementUseCase.execute(
      createDepositStatement
    )

    expect(depositStatementCreated).toHaveProperty('id')
  })
  it('should be able to create a new transfer', async () => {
    const createdSenderUser = await inMemoryUsersRepository.create({
      name: 'User Name Test',
      email: 'useremail@testexample.com',
      password: 'User Password Test',
    })
    const createdReceiverUser = await inMemoryUsersRepository.create({
      name: 'ReceiverUser Name Test',
      email: 'receiveruseremail@testexample.com',
      password: 'ReceiverUser Password Test',
    })

    const createDepositStatement: ICreateStatementDTO = {
      sender_id: createdSenderUser.id,
      operation_type: OperationType.DEPOSIT,
      amount: 999,
      description: 'Statement Description Test',
    }

    const createTransferStatement: ICreateStatementDTO = {
      sender_id: createdSenderUser.id,
      receiver_id: createdReceiverUser.id,
      operation_type: OperationType.TRANSFER,
      amount: 99,
      description: 'Statement Description Test',
    }

    await createStatementUseCase.execute(createDepositStatement)
    const transferStatementCreated = await createStatementUseCase.execute(
      createTransferStatement
    )

    expect(transferStatementCreated).toHaveProperty('id')
  })

  it('should not be able to create a new transfer without funds', async () => {
    const createdSenderUser = await inMemoryUsersRepository.create({
      name: 'User Name Test',
      email: 'useremail@testexample.com',
      password: 'User Password Test',
    })

    const createdReceiverUser = await inMemoryUsersRepository.create({
      name: 'ReceiverUser Name Test',
      email: 'receiveruseremail@testexample.com',
      password: 'ReceiverUser Password Test',
    })

    const createDepositStatement: ICreateStatementDTO = {
      sender_id: createdSenderUser.id,
      operation_type: OperationType.DEPOSIT,
      amount: 99,
      description: 'Statement Description Test',
    }

    const createTransferStatement: ICreateStatementDTO = {
      sender_id: createdSenderUser.id,
      receiver_id: createdReceiverUser.id,
      operation_type: OperationType.TRANSFER,
      amount: 999,
      description: 'Statement Description Test',
    }

    await createStatementUseCase.execute(createDepositStatement)
    await expect(
      createStatementUseCase.execute(createTransferStatement)
    ).rejects.toEqual(new AppError('Insufficient funds', 400))
  })
  it('should not be able to create a new transfer to a non-existing user', async () => {
    const createdSenderUser = await inMemoryUsersRepository.create({
      name: 'User Name Test',
      email: 'useremail@testexample.com',
      password: 'User Password Test',
    })

    const createDepositStatement: ICreateStatementDTO = {
      sender_id: createdSenderUser.id,
      operation_type: OperationType.DEPOSIT,
      amount: 999,
      description: 'Statement Description Test',
    }

    const createTransferStatement: ICreateStatementDTO = {
      sender_id: createdSenderUser.id,
      receiver_id: 'non-existing_receiver_id',
      operation_type: OperationType.TRANSFER,
      amount: 99,
      description: 'Statement Description Test',
    }

    await createStatementUseCase.execute(createDepositStatement)
    await expect(
      createStatementUseCase.execute(createTransferStatement)
    ).rejects.toEqual(new AppError('Receiver user not found', 404))
  })
})
