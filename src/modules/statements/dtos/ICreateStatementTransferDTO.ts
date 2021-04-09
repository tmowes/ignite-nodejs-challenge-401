import { Statement } from '../entities/Statement'

export type ICreateStatementDTO = Pick<
  Statement,
  'sender_id' | 'description' | 'amount' | 'operation_type' | 'receiver_id'
>
