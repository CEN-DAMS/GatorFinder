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
	_ "github.com/mattn/go-sqlite3"
)

var testRouter *gin.Engine

// Initialize only once
func init() {
	fmt.Println("Settin")
	gin.SetMode(gin.TestMode)
	setupTestDB()
	testRouter = gin.Default()
}

// Setup test database
func setupTestDB() *sql.DB {
	db, err := sql.Open("sqlite3", "./test.db")
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	return db
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
func TestAddUser(t *testing.T) {
	user := models.User{
		Username: "testuser",
		Email:    "test@example.com",
		Password: "password123",
	}

	jsonData, _ := json.Marshal(user)
	req, _ := http.NewRequest("POST", "/users/add", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(AddUser)
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", rr.Code)
	}
}

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
