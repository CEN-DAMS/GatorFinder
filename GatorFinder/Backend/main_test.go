package main

import (
	_ "backend/docs" // Make sure this path is correct
	//"backend/controllers"
	//"database/sql"
	// "fmt"
	// "log"
	// "net/http"
	// "os"
	// "github.com/gorilla/mux"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// Helper function to set up the router
func setupRouter() *gin.Engine {
	router := gin.Default()
	router.GET("/api/message", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Hello from Go!"})
	})
	return router
}

func TestMessageEndpoint(t *testing.T) {
	router := setupRouter()

	// Create a request to the endpoint
	req, _ := http.NewRequest("GET", "/api/message", nil)
	w := httptest.NewRecorder()

	// Serve the request
	router.ServeHTTP(w, req)

	// Assertions
	assert.Equal(t, http.StatusOK, w.Code)                // Check HTTP status
	assert.Contains(t, w.Body.String(), "Hello from Go!") // Check response content
}

func TestCreateItem(t *testing.T) {
	router := gin.Default()
	router.POST("/api/item", func(c *gin.Context) {
		c.JSON(http.StatusCreated, gin.H{"status": "Item created"})
	})

	req, _ := http.NewRequest("POST", "/api/item", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Contains(t, w.Body.String(), "Item created")
}
func TestGetItem(t *testing.T) {
	router := gin.Default()
	router.POST("/api/item", func(c *gin.Context) {
		c.JSON(http.StatusCreated, gin.H{"status": "Item created"})
	})

	req, _ := http.NewRequest("POST", "/api/item", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Contains(t, w.Body.String(), "Item created")
}
