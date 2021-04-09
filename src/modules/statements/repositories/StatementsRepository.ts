import { getRepository, Repository } from 'typeorm'

import { ICreateStatementDTO } from '../dtos/ICreateStatementDTO'
import { IGetBalanceDTO } from '../dtos/IGetBalanceDTO'
import { IGetBalanceResponseDTO } from '../dtos/IGetBalanceResponseDTO'
import { IGetStatementOperationDTO } from '../dtos/IGetStatementOperationDTO'
import { OperationType, Statement } from '../entities/Statement'
import { IStatementsRepository } from './IStatementsRepository'

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>

  constructor() {
    this.repository = getRepository(Statement)
  }

  async create({
    sender_id,
    receiver_id,
    amount,
    description,
    operation_type,
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      sender_id,
      receiver_id,
      amount,
      description,
      operation_type,
    })

    return this.repository.save(statement)
  }

  async findStatementOperation({
    statement_id,
    user_id,
  }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { sender_id: user_id },
    })
  }

  async getUserBalance({
    user_id,
    with_statement = false,
  }: IGetBalanceDTO): Promise<{ balance: number } | IGetBalanceResponseDTO> {
    const statementsSender = await this.repository
      .createQueryBuilder('statements')
      .where('statements.sender_id = :user_id', { user_id })
      .orWhere('statements.receiver_id = :user_id', { user_id })
      .getMany()

    const statements = [...statementsSender]

    const balance = statements.reduce((acc, operation) => {
      if (
        operation.operation_type === OperationType.DEPOSIT ||
        (operation.operation_type === OperationType.TRANSFER &&
          operation.receiver_id === user_id)
      ) {
        return acc + Number(operation.amount)
      }
      return acc - Number(operation.amount)
    }, 0)

    if (with_statement) {
      return {
        balance,
        statements,
      }
    }

    return { balance }
  }
}
