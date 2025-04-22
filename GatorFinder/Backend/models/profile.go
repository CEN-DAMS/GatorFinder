package models

type Profile struct {
    Username string `json:"username"`
    Email    string `json:"email"`
    Role     string `json:"role"`
    Bio      string `json:"bio"`
    Image    string `json:"image"`
}
