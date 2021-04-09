import { ICreateStatementDTO } from '../../dtos/ICreateStatementDTO'
import { IGetBalanceDTO } from '../../dtos/IGetBalanceDTO'
import { IGetBalanceResponseDTO } from '../../dtos/IGetBalanceResponseDTO'
import { IGetStatementOperationDTO } from '../../dtos/IGetStatementOperationDTO'
import { OperationType, Statement } from '../../entities/Statement'
import { IStatementsRepository } from '../IStatementsRepository'

export class InMemoryStatementsRepository implements IStatementsRepository {
  private statements: Statement[] = []

  async create(data: ICreateStatementDTO): Promise<Statement> {
    const statement = new Statement()

    Object.assign(statement, data)

    this.statements.push(statement)

    return statement
  }

  async findStatementOperation({
    statement_id,
    user_id,
  }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.statements.find(
      (operation) =>
        operation.id === statement_id && operation.sender_id === user_id
    )
  }

  async getUserBalance({
    user_id,
    with_statement = false,
  }: IGetBalanceDTO): Promise<{ balance: number } | IGetBalanceResponseDTO> {
    const statements = this.statements.filter(
      (operation) => operation.sender_id === user_id
    )

    const balance = statements.reduce((acc, operation) => {
      if (operation.operation_type === OperationType.DEPOSIT) {
        return acc + Number(operation.amount)
      }
      return acc - Number(operation.amount)
    }, 0)

    if (with_statement) {
      return {
        statements,
        balance,
      }
    }

    return { balance }
  }
}
