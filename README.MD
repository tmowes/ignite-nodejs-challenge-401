  Show User Profile
    ✓ should not be able to show a non-existing user profile (4 ms)
    ✓ should be able to show the user profile (1 ms)

  Get Balance Controller
    ✓ should be able to get a balance with statement list (174 ms)
    ✓ should not be able to get a balance with statement list without a valid token (49 ms)

  Create Statement Controller
    ✓ should be able to create a new deposit (105 ms)
    ✓ should not be able to create a new deposit statement without a valid token (42 ms)
    ✓ should not be able to create a new withdraw statement without a valid token (45 ms)
    ✓ should not be able to create a withdraw statement with insufficient funds (46 ms)

  Get Statement Operation Controller
    ✓ should be able to get a statement (111 ms)
    ✓ should not be able to get a non-existing statement (48 ms)
    ✓ should not be able to get a balance with statement list without a valid token (57 ms)

  Show User Profile Controller
    ✓ should be able to show a user profile (95 ms)
    ✓ should not be able to show user profile without a valid token (45 ms)

  Authenticate User Controller
    ✓ should be able to authenticate a user (79 ms)
    ✓ should not be able to authenticate a non-existing user (9 ms)
    ✓ should not be able to authenticate a user with incorrect email (18 ms)
    ✓ should not be able to authenticate a user with incorrect password (36 ms)

  Create User Controller
    ✓ should be able to create a new user (55 ms)
    ✓ should not be able to create a new user with same email (11 ms)

  Authenticate User
    ✓ should not be able to authenticate a non-existing user (35 ms)
    ✓ should not be able to authenticate a user with incorrect email (18 ms)
    ✓ should not be able to authenticate a user with incorrect password (38 ms)
    ✓ should be able to authenticate an user (36 ms)

  Get Statement Operation
    ✓ should not be able to get a non-existing statement (2 ms)
    ✓ should not be able to get a statement whit a non-existing user (1 ms)
    ✓ should be able to get a statement operation (1 ms)

  Create User
    ✓ should be able to create a new deposit (33 ms)
    ✓ should not be able to create a new user with same email (17 ms)

  Create Statement
    ✓ should not be able to create a new withdraw without funds (2 ms)
    ✓ should not be able to create a new statement when user does not exist (1 ms)
    ✓ should be able to create a new deposit (1 ms)
    ✓ should be able to create a new withdraw with funds (1 ms)

  Get Balance
    ✓ should be able to get the balance with statement list (3 ms)
    ✓ should not be able to get a balance with statement list without a valid token (1 ms)

=============================== Coverage summary ===============================
Statements   : 97.57% ( 402/412 )
Branches     : 92.96% ( 66/71 )
Functions    : 100% ( 32/32 )
Lines        : 97.57% ( 402/412 )
================================================================================
Test Suites: 12 passed, 12 total
Tests:       34 passed, 34 total
