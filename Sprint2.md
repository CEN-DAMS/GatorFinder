Sprint2.md

- Work done in this Sprint2
  - Added User table to database
  - Added POST, GET, DELETE User functions
  - Connected front and back end
  - Implemented Cross-Origin Resourse Sharing
  - Converted the front-end to use React
  - Set up and implemented basic unit and Cypress tests.

Front-End: 

Unit Tests: 

- Test 1 - "navigates from Login to Signup page": This unit test navigates to the login page, clicks on the Sign Up hyperlink where it says "Don't have an account? Sign Up" and then successfully navigates to the Sign Up page.

- Test 2 - "navigates from Signup to Login page": This unit test navigates to the sign up page, clicks on the Login hyperlink where it says "Already have an account? Login" and then successfully navigates to the Log in page.

- Test 3- "search bar functionality test": This unit tests searches "event 1" in the search bar and makes sure that information regarding only event 1 is displayed while information about the other events are not displayed whatsoever.

Cypress Tests: 

- Test 1 - "login.cy.js" :  This cypress test visits the login page, enters sample user information to log in, show an error if the login fields are empty, attempt to login, and navigate to the sign up page when the hyperlink is clicked on the bottom of the screen.

- Test 2-  "searchbar.cy.js" : This cypress test searches "event 1" in the search bar and ensures that only event 1 is disaplyed on the screen while the rest of the events are not displayed.

- Test 3 - "signup.cy.js" : This cypress test visits the sign up page, enters sample user information to sign up, show an error if the sign up fields are empty, attempt to sign up, and navigate to the log in page when the hyperlink is clicked on the bottom of the screen.


- Added Back-end tests:
  1. TestAddEvent
  2. TestGetEvent
  3. TestAddUser
  4. TestGetUsers


6. Documentation For Backend API
Overview :

This file contains HTTP handler functions for managing events and users in the system. The handlers interact with a SQLite database (located at ./test.db) to perform CRUD operations. Each function opens its own database connection, executes a SQL statement, and returns JSON responses indicating success or failure. Swagger-style comments are provided for API documentation, and additional inline comments explain each step in the code.

**Handlers:**
- AddEvent
  - Purpose: Handles POST requests to add a new event.
  - Workflow:
    - Decodes the incoming JSON payload into an Event model.
    - Opens a connection to the SQLite database.
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
   

- DeleteUser
  - Purpose: Handles DELETE requests to remove a user by ID.
  - Workflow:
    - Opens a database connection.
    - Reads the user ID from the query parameters.
    - Prepares and executes a DELETE statement.
    - Returns a success message as JSON or an error message if deletion fails.
  
- Database Connections
  - Each handler opens a new connection to the SQLite database at ./test.db and then closes it after executing the required SQL statement. Although this approach works, for a production system it is generally better to reuse database connections (using a connection pool) and/or inject the connection as a dependency. This would make testing easier and reduce overhead.

- Swagger Annotations
  - Each handler includes Swagger annotations (such as @Summary, @Description, @Tags, etc.) which are used by tools like Swaggo to generate interactive API documentation. These annotations describe:
    - The purpose of the endpoint.
    - The expected input and output formats.
    - The HTTP method and route.
