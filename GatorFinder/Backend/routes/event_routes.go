package routes

import (
	"backend/controllers"

	"github.com/gorilla/mux"
)

func RegisterEventRoutes(router *mux.Router) {
	router.HandleFunc("/events/add", controllers.AddEvent).Methods("POST")
	router.HandleFunc("/events/get", controllers.GetEvent).Methods("GET")
	router.HandleFunc("/events/delete", controllers.DeleteEvent).Methods("DELETE")
}
func RegisterUserRoutes(router *mux.Router) {
	router.HandleFunc("/users/add", controllers.AddUser).Methods("POST")
	router.HandleFunc("/users/get", controllers.GetUsers).Methods("GET")
	router.HandleFunc("/users/delete", controllers.DeleteUser).Methods("DELETE")

}
func RegisterLoginRoutes(router *mux.Router) {
	router.HandleFunc("/login/requestOtp", controllers.CreateOtphandler).Methods("GET")
	router.HandleFunc("/login/verifyOtp", controllers.VerifyOtpHandler).Methods("GET")

}
