  Show User Profile

    ✓ should not be able to show a non-existing user profile
    ✓ should be able to show the user profile

  Get Balance Controller

    ✓ should be able to get a balance with statement list
    ✓ should not be able to get a balance with statement list without a valid token

  Create Statement Controller

    ✓ should be able to create a new deposit
    ✓ should not be able to create a new deposit statement without a valid token
    ✓ should not be able to create a new withdraw statement without a valid token
    ✓ should not be able to create a withdraw statement with insufficient funds

  Get Statement Operation Controller

    ✓ should be able to get a statement
    ✓ should not be able to get a non-existing statement
    ✓ should not be able to get a balance with statement list without a valid token

  Show User Profile Controller

    ✓ should be able to show a user profile
    ✓ should not be able to show user profile without a valid token

  Authenticate User Controller

    ✓ should be able to authenticate a user
    ✓ should not be able to authenticate a non-existing user
    ✓ should not be able to authenticate a user with incorrect email
    ✓ should not be able to authenticate a user with incorrect password

  Create User Controller

    ✓ should be able to create a new user
    ✓ should not be able to create a new user with same email

  Authenticate User

    ✓ should not be able to authenticate a non-existing user
    ✓ should not be able to authenticate a user with incorrect email
    ✓ should not be able to authenticate a user with incorrect password
    ✓ should be able to authenticate an user

  Get Statement Operation

    ✓ should not be able to get a non-existing statement
    ✓ should not be able to get a statement whit a non-existing user
    ✓ should be able to get a statement operation

  Create User

    ✓ should be able to create a new deposit
    ✓ should not be able to create a new user with same email

  Create Statement

    ✓ should not be able to create a new withdraw without funds
    ✓ should not be able to create a new statement when user does not exist
    ✓ should be able to create a new withdraw with funds
    ✓ should be able to create a new deposit
    ✓ should be able to create a new transfer
    ✓ should not be able to create a new transfer without funds
    ✓ should not be able to create a new transfer to a non-existing user

  Get Balance

    ✓ should be able to get the balance with statement list
    ✓ should not be able to get a balance with statement list without a valid token

---
Coverage summary
--
Statements   : 97.85% ( 456/466 )

Branches     : 93.75% ( 75/80 )

Functions    : 100% ( 33/33 )

Lines        : 97.85% ( 456/466 )

---

Test Suites: 12 passed, 12 total

Tests:       37 passed, 37 total
