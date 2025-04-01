Sprint3.md

- Work done in this Sprint 3
  - Updated database to MySQL (from SQLite3)
  - Set up database in AWS for Cloud access
  - Updated functions for MySQL and AWS usability
  - Updated Backend documentation and test cases
  - Updated UI 
  - Set up sending event data to backend/displayed as event cards
  - Created template profile page linking to home
  - Add button to create events
  - Added more unit tests 
  - CICD Learning and required steps documentation



Front-End:

Unit Tests:
- Test 1: "renders GatorFinder logo": tests to make sure the logo of the website is visible on the home page.
- Test 2: "search bar functionality test": tests to make sure events can be searched via the search bar.
- Test 3: "navigates from Login to Signup page": tests to make sure the sign up page can be navigates from the login page.
- Test 4: "navigates from Signup to Login page": tests to make sure the login page can be navigated from the sign up page.


Cypress Tests: 

- Test 1: "login.cy.js" : tests login functionality and navigates to sign up page.
- Test 2: "searchbar.cy.js" : tests event search via the search bar.
- Test 3: "signup.cy.js" : tests sign up functionality and navigates to log in page.
- Test 4: "create_event.cy.js" : tests creating an eventing and make sure it is displayed.



Back-End:
 - Updated the following Back-end unit tests to reflect MySQL and AWS integration:
  1. TestAddEvent
  2. TestGetEvent
  3. TestAddUser
  4. TestGetUsers
 - Updated Documentation For Backend API

Overview :

This file contains HTTP handler functions for managing events and users in the system. The handlers interact with a MySQL database (formerly SQLite3) now located on the Cloud in AWS to perform CRUD operations. Each function opens its own database connection, executes a SQL statement, and returns JSON responses indicating success or failure. Swagger-style comments are provided for API documentation, and additional inline comments explain each step in the code.

Handlers:

- AddEvent
  - Purpose: Handles POST requests to add a new event.
  - Workflow:
    - Decodes the incoming JSON payload into an Event model.
      - Incoming JSON payload should be in the following format (where "" delineates a 64 character string that may be empty):
      ```
      {
        "created": "",
        "endDate": "",
        "endTime": "",
        "eventdescription": "",
        "eventname": "",
        "image": "",
        "startDate": "",
        "startTime": "",
        "username": ""
      }
      ```
    - Opens a connection to the AWS MySQL database.
    - Prepares an INSERT SQL statement and executes it using the data from the payload.
    - Returns a JSON response with a success message if the insertion succeeds, or an error message otherwise.
  - Swagger Annotations: Annotations provide metadata for API documentation tools, indicating the endpoint, request body, response type, and HTTP method.

- GetEvent
  - Purpose: Handles GET requests to retrieve all events.
  - Workflow:
    - Opens a database connection.
    - Executes a SELECT query on the events table.
    - Iterates over the results, converting each row into a map, and aggregates the maps into a slice.
    - Sends the slice as a JSON response.
      - Outgoing JSON payload will be in the following example format (where "" delineates a 64 character string that may be empty and strings with 0 showing an "empty" date/time):
      ```
          [
            {
              "created": "0000-00-00",
              "endDate": "0000-00-00",
              "endTime": "00:00:00",
              "eventdescription": "",
              "eventname": "",
              "image": "",
              "startDate": "0000-00-00",
              "startTime": "00:00:00",
              "uid": 1,
              "username": ""
            },
            {
              ...(event info)
            },
            ...(more events)
            {
              ...(final event info)
            }
          ]
      ```
  - Error Handling: Returns HTTP 500 if there is an error connecting to the database or reading rows.

- DeleteEvent
  - Purpose: Handles DELETE requests to remove an event by its ID.
  - Workflow:
    - Opens a database connection.
    - Reads the event ID from the query parameters.
    - Prepares a DELETE statement and executes it.
    - Returns a JSON message indicating success or an error if deletion fails.

- AddUser
  - Purpose: Handles POST requests to add a new user.
  - Workflow:
    - Decodes the JSON payload into a User model.
      - Incoming JSON payload should be in the following format (where "" delineates a 64 character string that may be empty):
      ```
      {
          "email": "",
          "password": "",
          "username": ""
      }
      ```
      NOTE: username should be UNIQUE and not already existing in the database
    - Opens a database connection.
    - Prepares and executes an INSERT statement with the user data.
    - Returns a JSON success message or an error message.

- GetUsers
  - Purpose: Handles GET requests to retrieve user details.
  - Workflow:
    - Opens a database connection.
    - Executes a SELECT query to retrieve all users.
    - Converts each row into a map and aggregates these maps into a slice.
    - Returns the slice as JSON.
      - Outgoing JSON payload will be in the following example format (where "" delineates a 64 character string that may be empty):
      ```
          [
            {
              "email": "test@example.com",
              "password": "password123",
              "uid": 2,
              "username": "testuser"
            },
            {
              ...(user info)
            },
            ...(more users)
            {
              ...(final user info)
            }
          ]
      ```

- DeleteUser
  - Purpose: Handles DELETE requests to remove a user by ID.
  - Workflow:
    - Opens a database connection.
    - Reads the user ID from the query parameters.
    - Prepares and executes a DELETE statement.
    - Returns a success message as JSON or an error message if deletion fails.

- Database Connections
  - Each handler opens a new connection to the MySQL database on AWS and then closes it after executing the required SQL statement. Although this approach works, for a production system it is generally better to reuse database connections (using a connection pool) and/or inject the connection as a dependency. This would make testing easier and reduce overhead.

- Swagger Annotations
  - Each handler includes Swagger annotations (such as @Summary, @Description, @Tags, etc.) which are used by tools like Swaggo to generate interactive API documentation. These annotations describe:
    - The purpose of the endpoint.
    - The expected input and output formats.
    - The HTTP method and route.
Backend unit test :



Test Suite Documentation: User and Event Controller Unit Tests

Overview  
This suite of unit tests is designed to validate the HTTP handlers in the User and Event controllers. The handlers are responsible for creating, retrieving, and deleting user and event records in the underlying MySQL database. The tests aim to ensure functional correctness, input validation, and proper error handling.

init  
Initializes the test environment. Sets Gin to test mode and initializes the global router. A database connection is created through setupTestDB() to be used during test execution.

setupTestDB  
Establishes a connection to the MySQL test database hosted on AWS RDS. If the connection fails, the function logs a fatal error and halts the test process.

TestAddEvent  
Purpose: Verifies that the /events/add endpoint correctly processes a valid event creation request.  
Behavior: Sends a valid POST request and expects a 200 OK response, indicating successful insertion of the event into the database.

TestGetEvent  
Purpose: Validates the /events/get endpoint.  
Behavior: Sends a GET request and expects a 200 OK response containing event data from the database.

TestGetUsers  
Purpose: Confirms that the /users/get endpoint correctly retrieves all user records.  
Behavior: Sends a GET request and expects a 200 OK response with a JSON array of user objects.

TestDecodeBase64  
Purpose: Unit test for the decodeBase64 helper function.  
Behavior:  
- Verifies successful decoding of a valid base64 string.  
- Asserts error handling on decoding an invalid base64 string.

TestAddUserFailed  
Purpose: Simulates a failure during user creation to test error handling in the /users/add endpoint.  
Behavior: Sends a valid POST request and expects a 500 Internal Server Error due to failure in SQL execution, such as a missing or unreachable database.

TestDeleteUser  
Purpose: Validates the /users/delete endpoint with a valid user ID.  
Behavior: Sends a DELETE request with id=123 and expects a 200 OK response, indicating successful execution of the deletion logic.

TestDeleteUser_MissingID  
Purpose: Ensures proper input validation when the required id parameter is not provided.  
Behavior: Sends a DELETE request without the id parameter and expects a 400 Bad Request response.

TestDeleteUser_NonExistentID  
Purpose: Tests how the handler behaves when attempting to delete a non-existent user.  
Behavior: Sends a DELETE request with a non-existent id value and expects a 200 OK response, assuming the handler does not check for rows affected.

TestDeleteUser_InvalidID  
Purpose: Verifies input validation when an empty or malformed id is provided.  
Behavior: Sends a DELETE request with an empty id parameter (?id=) and expects a 400 Bad Request response due to invalid input.

