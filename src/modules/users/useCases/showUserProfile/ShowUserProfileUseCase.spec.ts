import { AppError } from '../../../../shared/errors/AppError'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase'

let showUserProfileUseCase: ShowUserProfileUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Show User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })
  it('should not be able to show a non-existing user profile', async () => {
    await expect(
      showUserProfileUseCase.execute('invalid_user_id')
    ).rejects.toEqual(new AppError('User not found', 404))
  })
  it('should be able to show the user profile', async () => {
    const createdNewUser = await inMemoryUsersRepository.create({
      name: 'User Name Test',
      email: 'useremail@testexample.com',
      password: 'User Password Test',
    })
    const userCreatedProfile = await showUserProfileUseCase.execute(
      createdNewUser.id
    )
    expect(userCreatedProfile).toHaveProperty('id')
    expect(userCreatedProfile).toEqual(createdNewUser)
  })
})
