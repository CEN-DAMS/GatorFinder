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
	"github.com/gorilla/handlers"
	_ "github.com/aws/aws-sdk-go-v2/config"
    _ "github.com/aws/aws-sdk-go-v2/feature/rds/auth"
	_ "github.com/go-sql-driver/mysql"

    //"github.com/gin-contrib/cors"

	httpSwagger "github.com/swaggo/http-swagger"
)


func main() {
	db, err := sql.Open("mysql", "admin:CEN5035root@tcp(database.ctyws6uk8z2y.us-east-2.rds.amazonaws.com:3306)/test")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	pingErr := db.Ping()
	if pingErr != nil {
    	log.Fatal(pingErr)
  	}
  	fmt.Println("Connected!")
	// _, err = db.Exec("CREATE DATABASE test")
	// if err != nil {
	// 	log.Fatal(err)
	// }

	sqlQueryToCreateTable :=
		`
		   				CREATE TABLE IF NOT EXISTS Events (
						uid INTEGER PRIMARY KEY AUTO_INCREMENT,
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
	sqlQueryToCreateUserTable :=
		`
		   				CREATE TABLE IF NOT EXISTS Users (
						uid INTEGER PRIMARY KEY AUTO_INCREMENT,
						username VARCHAR(64) UNIQUE,
						email VARCHAR(64) NULL,
						password VARCHAR(64) NULL
	);`
	//_, err = db.Exec("DROP TABLE events")
	//_, err = db.Exec("DROP TABLE Users")
	_, err = db.Exec(sqlQueryToCreateTable)

	if err != nil {
		log.Fatal(err)
	}
	_, err = db.Exec(sqlQueryToCreateUserTable)
	if err != nil {
		log.Fatal(err)
	}



	var version string
	err = db.QueryRow("SELECT VERSION()").Scan(&version)
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
	routes.RegisterUserRoutes(router)
	routes.RegisterRoutes(router)

	// Swagger UI route
	router.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)

	// Default homepage
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Welcome to GatorFinder API"))
	})

	// Setup CORS
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:3000"}), // Allow React frontend
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	// Get port from env or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server running on port %s", port)
	//log.Fatal(http.ListenAndServe(":"+port, router))
	log.Fatal(http.ListenAndServe(":8080", corsHandler(router)))
}
