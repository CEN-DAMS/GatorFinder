# GatorFinder

- Front End: Deep Adhikari, Ansh Kalariya
- Back End: Mario Ponte, Saiesh Prabhu

# Project Description
- A mobile/web application developed to allow University of Florida students to post and find events, including club meetings, where to find free food, and other giveaways around campus

# To run this application
Clone the repo and install dependencies.

To Run the Backend:

Go v1.23.6
From \GatorFinder\GatorFinder\Backend
Perform “go get” on the following dependencies:
-  github.com/aws/aws-sdk-go-v2 v1.36.3
-  github.com/aws/aws-sdk-go-v2/config v1.29.14
-  github.com/aws/aws-sdk-go-v2/feature/rds/auth v1.5.11
-  github.com/gin-gonic/gin v1.10.0
-  github.com/go-sql-driver/mysql v1.9.2
-  github.com/gorilla/handlers v1.5.2
-  github.com/gorilla/mux v1.8.1
-  github.com/mattn/go-sqlite3 v1.14.28
-  github.com/playwright-community/playwright-go v0.5101.0
-  github.com/stretchr/testify v1.10.0
-  github.com/swaggo/http-swagger v1.3.4
-  github.com/swaggo/swag v1.16.4

Perform “go mod tidy” -> ”go run main.go”

To Run the Frontend:
Prerequisites: 
Node.js (v16+)
npm (v8+) or Yarn (v1+)
- **React** (^19.0.0)  
- **Material UI** (@mui/material & @mui/icons-material ^6.4.9)  
- **Emotion** (@emotion/react & @emotion/styled ^11.14.0)  
- **React Router Dom** (^6.30.0)  
- **Axios** (^1.8.1)  
- **react‑otp‑input** (^3.1.1)  
- **otp-generator** (^4.0.1)  
- **nodemailer** (^6.10.1)  
- **web-vitals** (^2.1.4)

Dev‑tools:

- Babel presets (`@babel/preset-env`, `@babel/preset-react`)  
- Jest & React Testing Library  
- Cypress

-npm install(will install everything assuming package.json cloned correctly)



Run in the following directory: GatorFinder/GatorFinder/Frontend/gatorfinder-frontend
npm i
npm start


#How to use application:

Once the front and back end are running, localhost:3000 should open. You can log in with your ufl.edu email address and continue with a One-Time Password that will currently be displayed in the console. You can then press a button to pull all events in the UF calendar. Additionally, you may add your own event with a time, title, description, and image. Users may also update their information in their profile page
