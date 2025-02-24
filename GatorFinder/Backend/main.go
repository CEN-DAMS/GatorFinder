package main

import (
	_ "backend/docs" // Make sure this path is correct
	"backend/routes"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"

	httpSwagger "github.com/swaggo/http-swagger"
)

func main() {
	db, err := sql.Open("sqlite3", "./test.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	sqlQueryToCreateTable :=
		`
		   				CREATE TABLE IF NOT EXISTS events (
						uid INTEGER PRIMARY KEY AUTOINCREMENT,
						username VARCHAR(64) NULL,
						eventname VARCHAR(64) NULL,
						eventdescription VARCHAR(64) NULL,
						created DATE NULL,
						startDate DATE NULL,
						endDate DATE NULL,
						startTime TIME NULL,
						endTime TIME NULL,
						image VARCHAR(64) NULL
	);`
	//_, err = db.Exec("DROP TABLE events")
	_, err = db.Exec(sqlQueryToCreateTable)


	if err != nil {
		log.Fatal(err)
	}

	var version string
	err = db.QueryRow("SELECT SQLITE_VERSION()").Scan(&version)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(version)
	StartServer()
}
func StartServer() {
	router := mux.NewRouter()

	// Register API Routes
	routes.RegisterEventRoutes(router)

	// Swagger UI route
	router.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)

	// Default homepage
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Welcome to GatorFinder API"))
	})

	// Get port from env or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
