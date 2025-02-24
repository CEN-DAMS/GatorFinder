package models

// Event struct represents an event
type Event struct {
	ID               string `json:"id"`
	User             string `json:"username"`
	EventName        string `json:"name"`
	EventDescription string `json:"description"`
	DatePosted             string `json:"datePosted"`
	StartDate             string `json:"startDate"`
	EndDate             string `json:"endDate"`
	StartTime             string `json:"startTime"`
	EndTime             string `json:"endTime"`
	ImageURL string `json:"image"`
}
