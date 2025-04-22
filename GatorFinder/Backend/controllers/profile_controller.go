package controllers

import (
    "encoding/json"
    "fmt"
    "net/http"

    "backend/models"
)

func UpdateProfile(w http.ResponseWriter, r *http.Request) {
    var profile models.Profile
    if err := json.NewDecoder(r.Body).Decode(&profile); err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }

    fmt.Printf("Updated profile: %+v\n", profile)

    w.WriteHeader(http.StatusOK)
}
