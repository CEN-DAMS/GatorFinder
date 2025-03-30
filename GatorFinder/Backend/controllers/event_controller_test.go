package controllers

import (
	"backend/models"
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

var testRouter *gin.Engine

func init() {
	fmt.Println("Setting up test router")
	gin.SetMode(gin.TestMode)
	setupTestDB()
	testRouter = gin.Default()
}

// Setup test database
func setupTestDB() *sql.DB {
	db, err := sql.Open("mysql", "admin:CEN5035root@tcp(database.ctyws6uk8z2y.us-east-2.rds.amazonaws.com:3306)/test")
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	return db
}

// Test AddEvent
func TestAddEvent(t *testing.T) {
	event := models.Event{
		User:             "testUser",
		EventName:        "test@example.com",
		EventDescription: "description",
		DatePosted:       "",
		StartDate:        "",
		EndDate:          "",
		StartTime:        "",
		EndTime:          "",
		ImageURL:         "",
	}

	jsonData, _ := json.Marshal(event)
	req, _ := http.NewRequest("POST", "/events/add", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(AddEvent)
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", rr.Code)
	}
}

// Test GetEvent
func TestGetEvent(t *testing.T) {
	req, _ := http.NewRequest("GET", "/events/get", nil)
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(GetEvent)
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", rr.Code)
		t.Logf("Response Body: %s", rr.Body.String())
	}
}

// Test AddUser

// Test GetUsers
func TestGetUsers(t *testing.T) {
	req, _ := http.NewRequest("GET", "/users/get", nil)
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(GetUsers)
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", rr.Code)
	}
}

// Test DecodeBase64
func TestDecodeBase64(t *testing.T) {
	// Valid case
	encoded := "aGVsbG8gd29ybGQ=" // "hello world"
	expected := "hello world"

	decoded, err := decodeBase64(encoded)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}
	if decoded != expected {
		t.Errorf("Expected %s, got %s", expected, decoded)
	}

	// Invalid case
	invalid := "###INVALID###"
	_, err = decodeBase64(invalid)
	if err == nil {
		t.Errorf("Expected an error for invalid base64 input, got nil")
	}
}

// Assume decodeBase64 is defined in the same package if not imported
func TestAddUserFailed(t *testing.T) {
	// Create test user data
	user := models.User{
		Username: "testuser",
		Email:    "test@example.com",
		Password: "password123",
	}

	// Convert to JSON
	jsonData, err := json.Marshal(user)
	if err != nil {
		t.Fatalf("Failed to marshal user data: %v", err)
	}

	// Create the HTTP request
	req, err := http.NewRequest("POST", "/users/add", bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatalf("Failed to create HTTP request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Use httptest to record the response
	rr := httptest.NewRecorder()

	// Directly use the handler (if you're not using Gin router)
	handler := http.HandlerFunc(AddUser)
	handler.ServeHTTP(rr, req)

	// Expect 200 OK
	if rr.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 500, got %d", rr.Code)
		t.Logf("Response body: %s", rr.Body.String()) // Log the response body for debugging
	}
}
func TestDeleteUser(t *testing.T) {
	// Construct the request with a dummy user ID (make sure this ID exists in your DB)
	req, err := http.NewRequest("DELETE", "/users/delete?id=123", nil)
	if err != nil {
		t.Fatalf("Could not create request: %v", err)
	}

	rr := httptest.NewRecorder()

	// Directly call the DeleteUser handler
	DeleteUser(rr, req)

	// Check status code
	if rr.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", rr.Code)
		t.Logf("Response body: %s", rr.Body.String())
	}
}
func TestDeleteUser_MissingID(t *testing.T) {
	req, err := http.NewRequest("DELETE", "/users/delete", nil)
	if err != nil {
		t.Fatalf("Could not create request: %v", err)
	}

	rr := httptest.NewRecorder()
	DeleteUser(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", rr.Code)
		t.Logf("Response body: %s", rr.Body.String())
	}
}
func TestDeleteUser_NonExistentID(t *testing.T) {
	req, err := http.NewRequest("DELETE", "/users/delete?id=999999", nil) // assuming 999999 doesn't exist
	if err != nil {
		t.Fatalf("Could not create request: %v", err)
	}

	rr := httptest.NewRecorder()
	DeleteUser(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("Expected status 200 (even if user doesn't exist), got %d", rr.Code)
		t.Logf("Response body: %s", rr.Body.String())
	}
}
func TestDeleteUser_InvalidID(t *testing.T) {
	req, err := http.NewRequest("DELETE", "/users/delete?id=", nil) // ID should be numeric
	if err != nil {
		t.Fatalf("Could not create request: %v", err)
	}

	rr := httptest.NewRecorder()
	DeleteUser(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("Expected status 500 due to query failure, got %d", rr.Code)
		t.Logf("Response body: %s", rr.Body.String())
	}
}
