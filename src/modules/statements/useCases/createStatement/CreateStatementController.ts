import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { OperationType } from '../../entities/Statement'
import { CreateStatementUseCase } from './CreateStatementUseCase'

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user
    const { receiver_id } = request.params
    const { amount, description } = request.body

    const splittedPath = request.originalUrl.split('/')

    const afterStatement = splittedPath.findIndex(
      (splitvalue) => splitvalue === 'statements'
    )

    const operationTypePath = splittedPath[afterStatement + 1]

    const operation_type = String(operationTypePath) as OperationType

    const createStatement = container.resolve(CreateStatementUseCase)

    const statement = await createStatement.execute({
      sender_id: user_id,
      operation_type,
      receiver_id,
      amount,
      description,
    })

    // const formattedResponse = {
    //   id: statement.id,
    //   sender_id: statement.id,
    //   amount: statement.amount,
    //   description: statement.description,
    //   operation: statement.operation_type,
    //   created_at: statement.created_at,
    //   updated_at: statement.updated_at,
    // }

    return response.status(201).json(statement)
  }
}
