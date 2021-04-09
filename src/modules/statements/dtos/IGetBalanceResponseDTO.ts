import { Statement } from '../entities/Statement'

export interface IGetBalanceResponseDTO {
  balance: number
  statements: Statement[]
}
