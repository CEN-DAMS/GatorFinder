package routes

import (

    "github.com/gorilla/mux"
    "backend/controllers"
)

func RegisterRoutes(router *mux.Router) {
    router.HandleFunc("/api/user/profile", controllers.UpdateProfile).Methods("PUT")
}
