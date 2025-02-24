package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"backend/models" // Ensure correct import path

	_ "github.com/mattn/go-sqlite3"
)

// Sample events list
var events []models.Event

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
	db, err := sql.Open("sqlite3", "./test.db")
	if err != nil {
		http.Error(w, "Failed to connect to database", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	// Prepare SQL statement
	stmt, err := db.Prepare("INSERT INTO events(username, eventname, eventdescription, created, startDate, endDate, startTime, endTime, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
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
	db, err := sql.Open("sqlite3", "./test.db")
	if err != nil {
		http.Error(w, "Failed to connect to database", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM events")
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
			rowMap[colName] = values[i]
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

	db, err := sql.Open("sqlite3", "./test.db")
	if err != nil {
		http.Error(w, "Failed to connect to database", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	stmt, err := db.Prepare(`
				    DELETE FROM events 
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
