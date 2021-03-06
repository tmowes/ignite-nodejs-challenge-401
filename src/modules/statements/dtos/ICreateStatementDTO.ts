import { Statement } from '../entities/Statement'

export type ICreateStatementDTO = Pick<
  Statement,
  'sender_id' | 'receiver_id' | 'description' | 'amount' | 'operation_type'
>
