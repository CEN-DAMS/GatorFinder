Sprint4.md

- Work done in Sprint 4
- Add login via OTP
- Add scrapper to fetch events from UF calender



Front End:

Unit tests:

Cypress tests:



Back End Documentation:


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
