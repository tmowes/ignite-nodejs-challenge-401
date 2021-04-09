import { ICreateStatementDTO } from '../dtos/ICreateStatementDTO'
import { IGetBalanceDTO } from '../dtos/IGetBalanceDTO'
import { IGetBalanceResponseDTO } from '../dtos/IGetBalanceResponseDTO'
import { IGetStatementOperationDTO } from '../dtos/IGetStatementOperationDTO'
import { Statement } from '../entities/Statement'

export interface IStatementsRepository {
  create: (data: ICreateStatementDTO) => Promise<Statement>
  findStatementOperation: (
    data: IGetStatementOperationDTO
  ) => Promise<Statement | undefined>
  getUserBalance: (
    data: IGetBalanceDTO
  ) => Promise<{ balance: number } | IGetBalanceResponseDTO>
}
