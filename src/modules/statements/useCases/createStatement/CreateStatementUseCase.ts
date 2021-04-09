import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '../../../users/repositories/IUsersRepository'
import { ICreateStatementDTO } from '../../dtos/ICreateStatementDTO'
import { OperationType } from '../../entities/Statement'
import { IStatementsRepository } from '../../repositories/IStatementsRepository'
import { CreateStatementError } from './CreateStatementError'

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    sender_id,
    receiver_id,
    operation_type,
    amount,
    description,
  }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(sender_id)
    if (!user) {
      throw new CreateStatementError.UserNotFound()
    }

    if (operation_type !== OperationType.DEPOSIT) {
      const { balance } = await this.statementsRepository.getUserBalance({
        user_id: sender_id,
      })

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    }

    if (operation_type === OperationType.TRANSFER && receiver_id) {
      const receiver = await this.usersRepository.findById(receiver_id)

      if (!receiver) {
        throw new CreateStatementError.ReceiverUserNotFound()
      }

      await this.statementsRepository.getUserBalance({
        user_id: receiver_id,
      })

      const statementTransferOperation = await this.statementsRepository.create(
        {
          sender_id,
          receiver_id: receiver.id,
          operation_type,
          description,
          amount,
        }
      )
      return statementTransferOperation
    }

    const statementOperation = await this.statementsRepository.create({
      sender_id,
      operation_type,
      description,
      amount,
    })

    return statementOperation
  }
}
