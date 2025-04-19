package controllers

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"backend/models" // Ensure correct import path

	_ "github.com/aws/aws-sdk-go-v2/aws"
	"github.com/playwright-community/playwright-go"

	_ "github.com/mattn/go-sqlite3"
)

type InstagramData struct {
	GraphQL struct {
		User struct {
			EdgeOwnerToTimelineMedia struct {
				Edges []struct {
					Node Post `json:"node"`
				} `json:"edges"`
			} `json:"edge_owner_to_timeline_media"`
		} `json:"user"`
	} `json:"graphql"`
}

func decodeBase64(encodedString string) (string, error) {
	decodedBytes, err := base64.StdEncoding.DecodeString(encodedString)
	if err != nil {
		return "", fmt.Errorf("decoding error: %w", err)
	}
	return string(decodedBytes), nil
}

type Dictionary map[string]string

type RecipeSpecs struct {
	difficulty, prepTime, cookingTime, servingSize, priceTier string
}

type Recipe struct {
	url, name      string
	ingredients    []Dictionary
	specifications RecipeSpecs
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

var foodKeywords = []string{
	"free food", "pizza", "snacks", "refreshments",
	"lunch", "dinner", "coffee", "cookies", "food provided",
}

type Post struct {
	Caption  string
	ImageURL string
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

// @Summary Get scrape details
// @Description Retrieves calender events from the uf calender
// @Tags  Users
// @Accept  json
// @Produce  json
// @Success 200 {array} models.User
// @Router /users/getcalender [get]
func GetCalenderEvents(w http.ResponseWriter, r *http.Request) {
	pw, err := playwright.Run()
	length := 0
	if err != nil {
		log.Fatalf("could not start Playwright: %v", err)
	}
	defer pw.Stop()

	browser, err := pw.Chromium.Launch(playwright.BrowserTypeLaunchOptions{
		Headless: playwright.Bool(true), // Headless mode (no GUI)
	})
	if err != nil {
		log.Fatalf("could not launch browser: %v", err)
	}
	defer browser.Close()

	context, err := browser.NewContext(playwright.BrowserNewContextOptions{
		UserAgent: playwright.String("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"),
	})
	if err != nil {
		log.Fatalf("could not create context: %v", err)
	}
	page, err := context.NewPage()
	if err != nil {
		log.Fatalf("could not create page: %v", err)
	}

	_, err = page.Goto("https://calendar.ufl.edu/day")
	if err != nil {
		log.Fatalf("could not navigate: %v", err)
	}

	time.Sleep(1 * time.Second)

	summary, err := page.Locator(".lw_events_summary").AllTextContents()
	if err != nil {
		log.Fatalf("could not extract event summary: %v", err)
	}

	time, err := page.Locator(".lw_events_time").AllTextContents()
	if err != nil {
		log.Fatalf("could not extract event time: %v", err)
	}

	title, err := page.Locator(".lw_events_title").AllTextContents()
	if err != nil {
		log.Fatalf("could not extract event title: %v", err)
	}

	// Ensure we have the same number of entries in each list
	if len(summary) != len(time) || len(time) != len(title) {
		length = max(len(summary), len(time), len(title))
	}

	// Store events as a list of lists containing [summary, time, title]
	var events [][]string
	for i := 0; i < length; i++ {
		summaryValue := ""
		// Check if summary is empty, and if so, set it to ""
		if i >= len(summary) || summary[i] == "" {
			summaryValue = ""
		} else {
			summaryValue = summary[i]
		}

		// Create a new event and append it to the events list
		event := []string{summaryValue, time[i], title[i]}
		events = append(events, event)
	}

	// Print the events
	log.Println("Extracted events:")
	for i, event := range events {
		fmt.Printf("Event #%d: [Summary: %s, Time: %s, Title: %s]\n", i+1, event[0], event[1], event[2])
	}
	fmt.Println(len(events))
	log.Println("Scraping and extraction complete.")
	json.NewEncoder(w).Encode(events)

}
