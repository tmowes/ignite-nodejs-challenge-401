import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"

import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError"

let showUserProfileUseCase: ShowUserProfileUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Show User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it('should be able to show the user profile', async () => {
    const createdNewUser = await inMemoryUsersRepository.create({
      name: "User Name Test",
      email: "useremail@testexample.com",
      password: "User Password Test",
    })
    const userCreatedProfile = await showUserProfileUseCase.execute(createdNewUser.id)
    expect(userCreatedProfile).toHaveProperty('id')
    expect(userCreatedProfile).toEqual(createdNewUser)
  })

  it('should not be able to show a non-existing user profile', async () => {
    await expect(showUserProfileUseCase.execute('invalid_user_id')
    ).rejects.toEqual(new ShowUserProfileError);
  })
})
