import { IGetBalanceResponseDTO } from '../dtos/IGetBalanceResponseDTO'

export class BalanceMap {
  static toDTO({ statements, balance }: IGetBalanceResponseDTO) {
    const parsedStatement = statements.map(
      ({
        id,
        sender_id,
        amount,
        description,
        operation_type,
        created_at,
        updated_at,
      }) => {
        if (operation_type === 'transfer') {
          return {
            id,
            sender_id,
            amount: Number(amount),
            description,
            operation_type,
            created_at,
            updated_at,
          }
        }
        return {
          id,
          amount: Number(amount),
          description,
          operation_type,
          created_at,
          updated_at,
        }
      }
    )

    return {
      statement: parsedStatement,
      balance: Number(balance),
    }
  }
}
