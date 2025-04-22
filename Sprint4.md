Sprint4.md

- Work done in Sprint 4
- Add login via OTP
- Add scrapper to fetch events from UF calendar
- Attempted to add scraper to fetch events from instagram (failed)



Front End:
  -Added functionality to save profile to the backend.
  -Added functionality to sign-up to an event, which updates to attending. 
  -Added OTP functionality for secure login
  -Ensures only emails ending in @ufl.edu are able to obtain an OTP

Unit Tests:
- Test 1: "renders GatorFinder logo": tests to make sure the logo of the website is visible on the home page.
- Test 2: "non ufl email login attempt": tests to make sure that non ufl email addresses cannot login.
- Test 3: "valid ufl email login attempt": tests to make sure that valid ufl email addresses can login.
- Test 4: "navigates from Signup to Login page": tests to make sure the login page can be navigated from the sign up page.
- Test 5: "navigates to profile": tests to make sure that the profile page can be navigated to.


Cypress Tests: 
- Test 1: "validlogin.cy.js" : tests to make sure that only ufl email addresses can login.
- Test 2: "searchbar.cy.js" : tests event search via the search bar.
- Test 3: "signup.cy.js" : tests sign up functionality and navigates to log in page.
- Test 4: "create_event.cy.js" : tests creating an eventing and make sure it is displayed.
- Test 5: "create_profile.cy.js": tests to make sure that profile page can be navigated to.
- Test 6: "invalidlogin.cy.js": tests to make sure that non ufl email addresses cannot login.



Back End Documentation:
# Events & Users API Reference

A collection of HTTP handlers for managing events, users, and scraping UF calendar/Instagram posts. All endpoints return JSON and assume you’re running over HTTPS in production.

> **⚠️ Security & Scalability Notes**  
> - Currently uses plain-text passwords and a single global DB connection string—avoid this in production.  
> - No authentication/authorization is enforced.  
> - Long‑running Playwright scrapes block the HTTP handler; consider a background job or caching layer.  
> - Always validate and sanitize inputs before SQL execution to prevent injection.

---

## Common Utilities

```go
// decodeBase64 decodes a Base64-encoded string.
func decodeBase64(encodedString string) (string, error)
// Dictionary is a simple map[string]string alias for JSON blobs.
type Dictionary map[string]string
// RecipeSpecs & Recipe types are declared but not exposed via HTTP.
type RecipeSpecs struct { … }
type Recipe struct { … }
```

---

## 1. Add Event

```
POST  /events/add
```

- **Swagger Annotations**

  ```go
  // @Summary Add a new event
  // @Description Adds a new event to the system
  // @Tags Events
  // @Accept json
  // @Produce json
  // @Param event body models.Event true "Event Data"
  // @Success 200 {object} map[string]string
  // @Router /events/add [post]
  ```

- **Request Body** (`models.Event`)
  
  ```jsonc
  {
    "User": "alice",
    "EventName": "Study Group",
    "EventDescription": "Weekly HCI discussion",
    "DatePosted": "2025-04-21",
    "StartDate": "2025-04-25",
    "EndDate": "2025-04-25",
    "StartTime": "18:00",
    "EndTime": "20:00",
    "ImageURL": "https://example.com/pic.jpg"
  }
  ```

- **Responses**
  - `200 OK`  
    ```json
    { "message": "Event received successfully" }
    ```
  - `400 Bad Request` for invalid JSON
  - `500 Internal Server Error` for DB failures

---

## 2. Get Events

```
GET  /events/get
```

- **Swagger Annotations**

  ```go
  // @Summary Get event details
  // @Description Retrieves event details from the system
  // @Tags Events
  // @Accept json
  // @Produce json
  // @Success 200 {array} map[string]interface{}
  // @Router /events/get [get]
  ```

- **Response**

  - `200 OK` returns an array of rows, each as a map of column→value.  
    ```json
    [
      {
        "uid": "1",
        "username": "alice",
        "eventname": "Study Group",
        … other columns …
      },
      …
    ]
    ```
  - `500 Internal Server Error` on DB failures

---

## 3. Delete Event

```
DELETE  /events/delete?id={id}
```

- **Swagger Annotations**

  ```go
  // @Summary Delete an event
  // @Description Deletes an event from the system by ID
  // @Tags Events
  // @Accept json
  // @Produce json
  // @Param id query int true "Event ID"
  // @Success 200 {object} map[string]string
  // @Router /events/delete [delete]
  ```

- **Query Parameters**
  - `id` (integer, required): the `uid` of the event

- **Responses**
  - `200 OK`  
    ```json
    { "message": "Event received successfully" }
    ```
  - `400 Bad Request` if `id` missing
  - `500 Internal Server Error` on DB errors

---

## 4. Add User

```
POST  /users/add
```

- **Swagger Annotations**

  ```go
  // @Summary Add a new User
  // @Description Adds a new User to the system
  // @Tags Users
  // @Accept json
  // @Produce json
  // @Param event body models.User true "User Data"
  // @Success 200 {object} map[string]string
  // @Router /users/add [post]
  ```

- **Request Body** (`models.User`)
  
  ```jsonc
  {
    "Username": "alice",
    "Email": "alice@example.com",
    "Password": "plaintext123"
  }
  ```

- **Responses**
  - `200 OK`  
    ```json
    { "message": "User received successfully" }
    ```
  - `400 Bad Request` for invalid JSON
  - `500 Internal Server Error` for DB failures

---

## 5. Get Users

```
GET  /users/get
```

- **Swagger Annotations**

  ```go
  // @Summary Get user details
  // @Description Retrieves user details from the system
  // @Tags Users
  // @Accept json
  // @Produce json
  // @Success 200 {array} map[string]interface{}
  // @Router /users/get [get]
  ```

- **Response**

  - `200 OK` returns an array of user records as maps:
    ```json
    [
      { "uid":"1", "username":"alice", "email":"alice@example.com" },
      …
    ]
    ```
  - `500 Internal Server Error` on DB failures

---

## 6. Delete User

```
DELETE  /users/delete?id={id}
```

- **Swagger Annotations**

  ```go
  // @Summary Delete a User
  // @Description Deletes a User from the system by ID
  // @Tags Users
  // @Accept json
  // @Produce json
  // @Param id query int true "User ID"
  // @Success 200 {object} map[string]string
  // @Router /users/delete [delete]
  ```

- **Query Parameters**
  - `id` (integer, required): the `uid` of the user

- **Responses**
  - `200 OK`  
    ```json
    { "message": "User received successfully" }
    ```
  - `400 Bad Request` if `id` missing
  - `500 Internal Server Error` on DB errors

---

## 7. Get Calendar & Instagram Events

```
GET  /users/getcalender
```

- **Swagger Annotations**

  ```go
  // @Summary Get scrape details
  // @Description Retrieves calendar events from the UF calendar and Instagram
  // @Tags Users
  // @Accept json
  // @Produce json
  // @Success 200 {array} []string
  // @Router /users/getcalender [get]
  ```

- **Behavior**
  1. Launches Playwright in headless mode
  2. Scrapes today’s UF calendar (`.lw_events_summary`, `.lw_events_time`, `.lw_events_title`)
  3. Re-launches Playwright (non‑headless) to log into Instagram using `IG_PASSWORD` env var
  4. Visits the target profile and collects post descriptions as dummy “events”
  5. Returns a combined `[][]string` of `[summary, time, title]` or `[description, time, title]` per item

- **Response**
  - `200 OK`  
    ```json
    [
      ["Lecture: AI Ethics", "10:00 AM", "AI Seminar"],
      ["No description", "No Time info", "Event 1"],
      …
    ]
    ```



# OTP Authentication Service

A simple in‑memory one‑time‑password (OTP) microservice with two endpoints:

- Request OTP: generates and “sends” a 6‑digit code to the user’s email (stubbed).
- Verify OTP: checks the code provided against the most recently generated one.

>  Note: This implementation stores a single global OTP in memory (`correctOTP`) and is intended for demonstration only. In production, you would persist OTPs per‑user (e.g. in Redis or your database), enforce expiration, rate‑limit requests, and secure the transport channel (HTTPS).

---

## Common Types

```go
// VerifyOTPResponse is the JSON response for verification attempts.
type VerifyOTPResponse struct {
    Message string `json:"message"`
}
```

---

## 1. Request OTP

```
GET  /login/requestOtp?email={email}
```

- **Query Parameters**
  - `email` (string, required): user’s email or identifier

- **Response Codes**
  - `200 OK`  
    - Body: `{ "message":"OTP sent successfully" }`
  - `400 Bad Request`  
    - Missing or empty `email` parameter  
    - Body: plain-text error

- **Behavior**
  1. Generates a random 6‑digit code.
  2. Stores it in memory (`correctOTP`).
  3. Logs it to stdout (for demo).
  4. Calls `sendEmail(email, otp)` (stub).

- **Example Request**

    ```bash
    curl "http://localhost:8080/login/requestOtp?email=user@example.com"
    ```

- **Example Console Log**

    ```
    Generated OTP for user@example.com: 482915
    ```

- **Example Response**

    ```json
    HTTP/1.1 200 OK
    Content-Type: application/json

    {"message":"OTP sent successfully"}
    ```

---

## 2. Verify OTP

```
GET  /login/verifyOtp?otp={otp}
```

- **Query Parameters**
  - `otp` (string, required): the 6‑digit code to verify

- **Response Codes**
  - `200 OK`  
    - Valid code  
    - Body:  
      ```json
      { "message": "OTP verified successfully" }
      ```
  - `400 Bad Request`  
    - Missing or empty `otp` parameter  
    - Body: plain-text error (“OTP is required”)
  - `401 Unauthorized`  
    - Code does not match  
    - Body:  
      ```json
      { "message": "Invalid OTP" }
      ```

- **Behavior**
  1. Reads `otp` from the query string.
  2. Returns **400** if missing.
  3. Compares against `correctOTP`.
  4. Returns **200** if equal; **401** otherwise.

- **Example Request**

    ```bash
    curl "http://localhost:8080/login/verifyOtp?otp=482915"
    ```

- **Example Successful Response**

    ```json
    HTTP/1.1 200 OK
    Content-Type: application/json

    { "message": "OTP verified successfully" }
    ```

- **Example Failure Response (wrong code)**

    ```json
    HTTP/1.1 401 Unauthorized
    Content-Type: application/json

    { "message": "Invalid OTP" }
    ```

---

## Swagger Annotations

These already appear atop your handlers to generate OpenAPI specs:

```go
// @Summary Request OTP
// @Description Generates and sends OTP to the user
// @Tags OTP
// @Accept json
// @Produce json
// @Param email query string true "Email or User Identifier" example("user@example.com")
// @Success 200 {object} map[string]string "OTP sent successfully"
// @Failure 400 {object} map[string]string "Missing or invalid parameters"
// @Router /login/requestOtp [get]
func CreateOtphandler(…)

// @Summary Verify OTP
// @Description Verifies the OTP provided by the user
// @Tags OTP
// @Accept json
// @Produce json
// @Param otp query string true "OTP" example("123456")
// @Success 200 {object} VerifyOTPResponse "OTP verification success"
// @Failure 400 {object} VerifyOTPResponse "OTP is required"
// @Failure 401 {object} VerifyOTPResponse "Invalid OTP"
// @Router /login/verifyOtp [get]
func VerifyOtpHandler(…)
```


Unit test for backend

Overview  
This controllers test suite verifies HTTP handlers in the Gin-based backend, ensuring that event- and user-related endpoints behave correctly and that utility functions (like base64 decoding) work as expected. It uses Go’s testing package for structuring tests and the net/http/httptest package to simulate HTTP requests and responses. A test database connection is established via database/sql before routes are exercised in test mode.

Dependencies  
Imports and their purposes:  
- bytes: build in-memory request bodies  
- database/sql: open and manage the test DB connection  
- encoding/json: serialize and deserialize JSON payloads  
- fmt: formatted I/O for logging and test setup messages  
- log: fatal errors during DB connection setup  
- net/http: define HTTP status codes and request types  
- net/http/httptest: create test servers and recorders  
- testing: test framework (TestXxx functions and assertions)  
- github.com/gin-gonic/gin: configure Gin in test mode and route handlers  
- github.com/go-sql-driver/mysql: MySQL driver for database/sql connection  
- backend/models: application data structures (Event, User, etc.)

Test Setup  
The init function calls setupTestDB to open a MySQL test database using sql.Open, logs a fatal error on failure, and sets Gin to TestMode (disabling logging and recovery middleware). setupTestDB returns a *sql.DB ready for use by handler functions.

Test Cases  
TestAddEvent:  
Purpose is to ensure POST /events/add accepts a valid Event JSON and returns 200 OK. It marshals a dummy Event, builds an HTTP request, uses httptest.NewRecorder, invokes AddEvent handler directly, and checks for a 200 status code.

TestGetEvent:  
Purpose is to verify GET /events/get returns 200 OK and a list of events. It creates a GET request, uses a recorder, calls GetEvent, and asserts on the status code, logging the response body on failure.

TestGetUsers:  
Purpose is to confirm GET /users/get returns 200 OK with a user list. It follows the same pattern as TestGetEvent.

TestDecodeBase64:  
Purpose is to validate the helper function decodeBase64. In the valid case, the string “aGVsbG8gd29ybGQ=” decodes to “hello world.” In the invalid case, “###INVALID###” returns an error. It uses Go’s encoding/base64 package.

TestAddUserFailed:  
Purpose is to ensure the AddUser handler gracefully handles database insertion errors by returning a 500 Internal Server Error. It posts invalid or conflicting payloads and expects a 500 status code.

TestDeleteUser (and variants):  
Purpose is to check DELETE /users/delete?id=<id> returns 200 OK even if the user does not exist. Edge cases include missing id (expect 400 Bad Request), non-numeric or empty id (expect 400 or 500 depending on query-parsing logic).

Running the Tests  
Navigate to the controllers directory and run “go test -v”. This executes all *_test.go files and functions named TestXxx.

Summary of Coverage  
This suite covers HTTP endpoints for events and users (add, get, delete) as well as utility logic for Base64 decoding, ensuring both successful responses and error handling paths are validated.

Overview  
This test suite uses Go’s built‑in testing framework together with Gin’s HTTP router and the Testify assertion library to verify simple API endpoints. It defines a helper function to create a Gin engine with predefined routes, then exercises those GET and POST routes using httptest recorders. Each test ensures the correct HTTP status code and response body content.  

Dependencies  
The suite imports the following packages:  
• “github.com/gin-gonic/gin” for setting up the router and registering handlers.  
• “net/http” for HTTP status codes and request construction.  
• “net/http/httptest” to create in‑memory HTTP recorders and simulate requests.  
• “testing” to structure the tests as TestXxx functions using Go’s standard test runner.  
• “github.com/stretchr/testify/assert” to provide easy‑to‑read assertions like Equal and Contains.  

Test Setup  
A helper function called setupRouter returns a *gin.Engine. It calls gin.Default() to create a new router, registers a GET route at /api/message that responds with JSON `{"message":"Hello from Go!"}`, and then returns the configured router.  

Test Cases  
TestMessageEndpoint  
This test calls setupRouter, builds an HTTP GET request to /api/message, and records the response. It asserts that the status code is 200 (http.StatusOK) and that the response body contains the text “Hello from Go!”.  

TestCreateItem  
This test creates a new Gin router inline, registers a POST route at /api/item that responds with status code 201 (http.StatusCreated) and JSON `{"status":"Item created"}`, then sends an empty POST request to that route. It asserts a 201 status code and that the response body includes “Item created”.  

TestGetItem  
Currently duplicating the behavior of TestCreateItem, this test again registers the same POST /api/item handler, sends a POST request, and checks for the same 201 status and response content. It can be renamed or adjusted later to test a GET endpoint once implemented.  

Running the Tests  
Run all tests in this package by executing `go test -v`. The -v flag enables verbose output, listing each test’s name and whether it passed.  

Summary  
By combining Gin in test mode, httptest for HTTP simulation, and Testify for clear assertions, this suite provides a straightforward pattern for testing REST endpoints. Additional tests can be added following the same structure: register a route on a router, build a request, serve it with ServeHTTP, and assert on the recorder’s Code and Body.
