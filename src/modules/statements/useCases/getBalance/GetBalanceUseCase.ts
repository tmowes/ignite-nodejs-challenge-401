import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '../../../users/repositories/IUsersRepository'
import { Statement } from '../../entities/Statement'
import { IStatementsRepository } from '../../repositories/IStatementsRepository'
import { GetBalanceError } from './GetBalanceError'

interface IRequest {
  user_id: string
}

interface IResponse {
  statements: Statement[]
  balance: number
}

@injectable()
export class GetBalanceUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new GetBalanceError()
    }

    const balance = await this.statementsRepository.getUserBalance({
      user_id,
      with_statement: true,
    })

    return balance as IResponse
  }
}
