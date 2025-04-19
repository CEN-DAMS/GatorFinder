package controllers

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"time"
)

// VerifyOTPResponse is a struct to represent the response message
type VerifyOTPResponse struct {
	Message string `json:"message"`
}

var correctOTP string

// Generate a random 6-digit OTP
func generateOTP() string {
	rand.Seed(time.Now().UnixNano())
	otp := rand.Intn(900000) + 100000 // Generates a 6-digit number
	return strconv.Itoa(otp)
}

// Verify OTP (without DB) - stored in-memory
func verifyOTP(otp string) bool {

	return correctOTP == otp
}

func sendEmail(email, otp string) {

}

// @Summary Request OTP
// @Description Generates and sends OTP to the user
// @Tags OTP
// @Accept  json
// @Produce  json
// @Param email query string true "Email or User Identifier" example("user@example.com")
// @Success 200 {object} map[string]string "OTP sent successfully"
// @Failure 400 {object} map[string]string "Missing or invalid parameters"
// @Router /login/requestOtp [get]
func CreateOtphandler(w http.ResponseWriter, r *http.Request) {
	// Get user identifier (e.g., email or phone number) from query parameters
	userIdentifier := r.URL.Query().Get("email")
	if userIdentifier == "" {
		http.Error(w, "Missing email or user identifier", http.StatusBadRequest)
		return
	}

	// Generate a new OTP
	otp := generateOTP()

	// Store the OTP in memory with user identifier
	correctOTP = otp

	// For demonstration, we'll log the OTP.
	fmt.Printf("Generated OTP for %s: %s\n", userIdentifier, otp)

	// Respond with a success message
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	sendEmail(userIdentifier, otp)
}

// @Summary Verify OTP
// @Description Verifies the OTP provided by the user
// @Tags OTP
// @Accept  json
// @Produce  json
// @Param otp query string true "OTP" example("123456")
// @Success 200 {object} VerifyOTPResponse "OTP verification success"
// @Failure 400 {object} VerifyOTPResponse "OTP is required"
// @Failure 401 {object} VerifyOTPResponse "Invalid OTP"
// @Router /login/verifyOtp [get]
func VerifyOtpHandler(w http.ResponseWriter, r *http.Request) {
	// Get the OTP from the query string
	otp := r.URL.Query().Get("otp")

	fmt.Println("HERE")
	if otp == "" {
		// If no OTP is provided in the query parameter, return an error
		http.Error(w, "OTP is required", http.StatusBadRequest)
		return
	}

	// Verify the OTP
	if verifyOTP(otp) {
		// If OTP is valid, send a success response
		w.WriteHeader(http.StatusOK)
		response := VerifyOTPResponse{Message: "OTP verified successfully"}
		json.NewEncoder(w).Encode(response)
	} else {
		// If OTP is invalid, send a failure response
		w.WriteHeader(http.StatusUnauthorized)
		response := VerifyOTPResponse{Message: "Invalid OTP"}
		json.NewEncoder(w).Encode(response)
	}
}
