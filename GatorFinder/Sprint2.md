Sprint2.md
Detail work you've completed in Sprint 2
List unit tests and Cypress test for frontend
List unit tests for backend
Add documentation for your backend API 


1. Add unit tests for backend go
Added : 
1 TestGetEvent
2 TestAddUser
3 TestGetUsers

2. Add Front-end tests

3. Work done in this Sprint2
Add unit tests for backend and frontend
( Make progress on issues uncompleted in Sprint 1 )

4. Documentation For Backend API
Overview :
This file contains HTTP handler functions for managing events and users in the system. The handlers interact with a SQLite database (located at ./test.db) to perform CRUD operations. Each function opens its own database connection, executes a SQL statement, and returns JSON responses indicating success or failure. Swagger-style comments are provided for API documentation, and additional inline comments explain each step in the code.

Handlers
AddEvent

Purpose:
Handles POST requests to add a new event.
Workflow:
Decodes the incoming JSON payload into an Event model.
Opens a connection to the SQLite database.
Prepares an INSERT SQL statement and executes it using the data from the payload.
Returns a JSON response with a success message if the insertion succeeds, or an error message otherwise.
Swagger Annotations:
Annotations provide metadata for API documentation tools, indicating the endpoint, request body, response type, and HTTP method.
GetEvent

Purpose:
Handles GET requests to retrieve all events.
Workflow:
Opens a database connection.
Executes a SELECT query on the events table.
Iterates over the results, converting each row into a map, and aggregates the maps into a slice.
Sends the slice as a JSON response.
Error Handling:
Returns HTTP 500 if there is an error connecting to the database or reading rows.
DeleteEvent

Purpose:
Handles DELETE requests to remove an event by its ID.
Workflow:
Opens a database connection.
Reads the event ID from the query parameters.
Prepares a DELETE statement and executes it.
Returns a JSON message indicating success or an error if deletion fails.
AddUser

Purpose:
Handles POST requests to add a new user.
Workflow:
Decodes the JSON payload into a User model.
Opens a database connection.
Prepares and executes an INSERT statement with the user data.
Returns a JSON success message or an error message.
GetUsers

Purpose:
Handles GET requests to retrieve user details.
Workflow:
Opens a database connection.
Executes a SELECT query to retrieve all users.
Converts each row into a map and aggregates these maps into a slice.
Returns the slice as JSON.
DeleteUser

Purpose:
Handles DELETE requests to remove a user by ID.
Workflow:
Opens a database connection.
Reads the user ID from the query parameters.
Prepares and executes a DELETE statement.
Returns a success message as JSON or an error message if deletion fails.
Database Connections
Each handler opens a new connection to the SQLite database at ./test.db and then closes it after executing the required SQL statement. Although this approach works, for a production system it is generally better to reuse database connections (using a connection pool) and/or inject the connection as a dependency. This would make testing easier and reduce overhead.

Swagger Annotations
Each handler includes Swagger annotations (such as @Summary, @Description, @Tags, etc.) which are used by tools like Swaggo to generate interactive API documentation. These annotations describe:

The purpose of the endpoint.
The expected input and output formats.
The HTTP method and route.