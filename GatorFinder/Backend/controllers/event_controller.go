package controllers

import (
	"database/sql"
	"encoding/json"
	"encoding/base64"
	"bytes"
	"fmt"
	"log"
	"net/http"
	"context"
	"backend/models" // Ensure correct import path
	//"os"
	"io"

	_ "github.com/aws/aws-sdk-go-v2/aws"
	_ "github.com/mattn/go-sqlite3"

	"github.com/aws/aws-sdk-go-v2/config"
    _ "github.com/aws/aws-sdk-go-v2/feature/rds/auth"
	_ "github.com/go-sql-driver/mysql"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/aws"
	 "github.com/aws/aws-sdk-go-v2/credentials"
)


var (
	bucketName = "event-images-gatorfinder"
	region     = "us-east-2"
	db         *sql.DB
)

func getS3Client() (*s3.Client, error) {
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(region))
	if err != nil {
		return nil, err
	}
	return s3.NewFromConfig(cfg), nil
}

func uploadToS3(file io.Reader, fileName string) (string, error) {
	customProvider := credentials.NewStaticCredentialsProvider("AKIA6GSNGSWDAEXRFHXV", "KZJ7w0vmBn4xwQ3iEj1jw9pP6uVZMYLUA9ycsr1K", "")
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(region), config.WithCredentialsProvider(customProvider))
	if err != nil {
		return "", err
	}


	client := s3.NewFromConfig(cfg)


	_, err = client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(fileName),
		Body:   file,
	})
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, fileName), nil
}

func saveEvent(username, eventname, eventdescription, startDate, endDate, startTime, endTime, imageURL string) error {
	
	query := "INSERT INTO Events (username, eventname, eventdescription, startDate, endDate, startTime, endTime, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
	_, err := db.Exec(query, username, eventname, eventdescription, startDate, endDate, startTime, endTime, imageURL)
	return err
}

// Upload handler
// @Summary Upload a file
// @Tags Events
// @Description Uploads a file and stores it on the server
// @Accept image/png
// @Produce json
// @Param image formData file true "Event Image"
// @Success 200 {object} map[string]string
// @Router /events/upload [post]
func UploadHandler(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}
	var event models.Event

	// Decode JSON request

	er := r.ParseMultipartForm(10 << 20) // 10MB max file size
	if er != nil {
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}

	file, handler, err := r.FormFile("image")
	var buf bytes.Buffer
	if _, err := io.Copy(&buf, file); err != nil {
		http.Error(w, "Error reading file:", http.StatusBadRequest)
		return
	}

	if err != nil {
		http.Error(w, "File upload error", http.StatusBadRequest)
		return
	}
	defer file.Close()

	imageURL, err := uploadToS3(bytes.NewReader(buf.Bytes()), handler.Filename)
	if err != nil {

		http.Error(w, imageURL, http.StatusInternalServerError)
		return
	}
	event.ImageURL = imageURL

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, `{"message": "Upload successful", "image_url": "%s"}`, imageURL)
}

func decodeBase64(encodedString string) (string, error) {
	decodedBytes, err := base64.StdEncoding.DecodeString(encodedString)
	if err != nil {
		return "", fmt.Errorf("decoding error: %w", err)
	}
	return string(decodedBytes), nil
}

// Sample Events list
//var Events []models.Event

func checkErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

// @Summary Add a new event
// @Description Adds a new event to the system
// @Tags Events
// @Accept  json
// @Produce  json
// @Param event body models.Event true "Event Data"
// @Success 200 {object} models.Event
// @Router /events/add [post]
func AddEvent(w http.ResponseWriter, r *http.Request) {
	var event models.Event

	// Decode JSON request
	err := json.NewDecoder(r.Body).Decode(&event)
	if err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	// Open database connection
	db, err := sql.Open("mysql", "admin:CEN5035root@tcp(database.ctyws6uk8z2y.us-east-2.rds.amazonaws.com:3306)/test")
	if err != nil {
		http.Error(w, "Failed to connect to database", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	// Prepare SQL statement
	stmt, err := db.Prepare("INSERT INTO Events(username, eventname, eventdescription, created, startDate, endDate, startTime, endTime, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
	if err != nil {
		http.Error(w, "Failed to prepare SQL statement", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	// Execute the statement with values from the request
	_, err = stmt.Exec(event.User, event.EventName, event.EventDescription, event.DatePosted, event.StartDate, event.EndDate, event.StartTime, event.EndTime, event.ImageURL)
	if err != nil {
		http.Error(w, "Failed to insert event", http.StatusInternalServerError)
		return
	}

	// Send success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Event received successfully"})
}

// @Summary Get event details
// @Description Retrieves event details from the system
// @Tags  Events
// @Accept  json
// @Produce  json
// @Success 200 {array} models.Event
// @Router /events/get [get]
func GetEvent(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("mysql", "admin:CEN5035root@tcp(database.ctyws6uk8z2y.us-east-2.rds.amazonaws.com:3306)/test")
	if err != nil {
		http.Error(w, "Failed to connect to database", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM Events")
	if err != nil {
		http.Error(w, "Failed to fetch events", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var events []map[string]interface{}
	cols, _ := rows.Columns()
	for rows.Next() {
		values := make([]interface{}, len(cols))
		pointers := make([]interface{}, len(cols))
		for i := range values {
			pointers[i] = &values[i]
		}

		if err := rows.Scan(pointers...); err != nil {
			http.Error(w, "Error scanning row", http.StatusInternalServerError)
			return
		}

		rowMap := make(map[string]interface{})
		for i, colName := range cols {
   			//rowMap[colName] = values[i]
			val := values[i]

			// Convert []byte to string for readability
			if b, ok := val.([]byte); ok {
				rowMap[colName] = string(b)
			} else {
				rowMap[colName] = val
			}
		}
		events = append(events, rowMap)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(events)
}

// @Summary Delete an event
// @Description Deletes an event from the system by ID
// @Tags Events
// @Accept  json
// @Produce  json
// @Param id query int true "Event ID"
// @Success 200 {string} string "Event deleted successfully"
// @Router /events/delete [delete]
func DeleteEvent(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Delete function called")

	db, err := sql.Open("mysql", "admin:CEN5035root@tcp(database.ctyws6uk8z2y.us-east-2.rds.amazonaws.com:3306)/test")
	if err != nil {
		http.Error(w, "Failed to connect to database", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	stmt, err := db.Prepare(`
				    DELETE FROM Events
    				WHERE uid = ?
					`)

	if err != nil {
		http.Error(w, "Failed to delete events", http.StatusInternalServerError)
		return
	}

	defer stmt.Close()
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "Missing event ID", http.StatusBadRequest)
		return
	}
	fmt.Println(id)
	_, err = stmt.Exec(id)
	if err != nil {
		http.Error(w, "Failed to insert event", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Event received successfully"})

}

// @Summary Add a new User
// @Description Adds a new User to the system
// @Tags Users
// @Accept  json
// @Produce  json
// @Param event body models.User true "User Data"
// @Success 200 {object} models.User
// @Router /users/add [post]
func AddUser(w http.ResponseWriter, r *http.Request) {
	var user models.User

	// Decode JSON request
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	// Open database connection
	db, err := sql.Open("mysql", "admin:CEN5035root@tcp(database.ctyws6uk8z2y.us-east-2.rds.amazonaws.com:3306)/test")
	if err != nil {
		http.Error(w, "Failed to connect to database", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	// Prepare SQL statement
	stmt, err := db.Prepare("INSERT INTO Users(username, email, password) VALUES (?, ?, ?)")
	if err != nil {
		http.Error(w, "Failed to prepare SQL statement", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	// Execute the statement with values from the request
	_, err = stmt.Exec(user.Username, user.Email, user.Password)
	if err != nil {
		http.Error(w, "Failed to insert user", http.StatusInternalServerError)
		return
	}

	// Send success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "User received successfully"})
}

// @Summary Get user details
// @Description Retrieves user details from the system
// @Tags  Users
// @Accept  json
// @Produce  json
// @Success 200 {array} models.User
// @Router /users/get [get]
func GetUsers(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("mysql", "admin:CEN5035root@tcp(database.ctyws6uk8z2y.us-east-2.rds.amazonaws.com:3306)/test")
	if err != nil {
		http.Error(w, "Failed to connect to database", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM Users")
	if err != nil {
		http.Error(w, "Failed to fetch users", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var users []map[string]interface{}
	cols, _ := rows.Columns()
	for rows.Next() {
		values := make([]interface{}, len(cols))
		pointers := make([]interface{}, len(cols))
		for i := range values {
			pointers[i] = &values[i]
		}

		if err := rows.Scan(pointers...); err != nil {
			http.Error(w, "Error scanning row", http.StatusInternalServerError)
			return
		}

		rowMap := make(map[string]interface{})
		for i, colName := range cols {
			//rowMap[colName] = values[i]
			val := values[i]

			// Convert []byte to string for readability
			if b, ok := val.([]byte); ok {
				rowMap[colName] = string(b)
			} else {
				rowMap[colName] = val
			}
		}
		users = append(users, rowMap)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

// @Summary Delete a User
// @Description Deletes a User from the system by ID
// @Tags Users
// @Accept  json
// @Produce  json
// @Param id query int true "User ID"
// @Success 200 {string} string "User deleted successfully"
// @Router /users/delete [delete]
func DeleteUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Delete function called")

	db, err := sql.Open("mysql", "admin:CEN5035root@tcp(database.ctyws6uk8z2y.us-east-2.rds.amazonaws.com:3306)/test")
	if err != nil {
		http.Error(w, "Failed to connect to database", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	stmt, err := db.Prepare(`
				    DELETE FROM Users 
    				WHERE uid = ?
					`)

	if err != nil {
		http.Error(w, "Failed to delete user", http.StatusInternalServerError)
		return
	}

	defer stmt.Close()
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "Missing user ID", http.StatusBadRequest)
		return
	}
	fmt.Println(id)
	_, err = stmt.Exec(id)
	if err != nil {
		http.Error(w, "Failed to insert user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "User received successfully"})

}
