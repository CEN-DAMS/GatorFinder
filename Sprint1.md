User stories
1. User Authentication (Basic)
    As a student, I want to sign up and log in with my university email so that I can access the platform.
2. Event Posting (Basic)
    As an event organizer, I want to create a new event by adding details like title, description, location, date, and time so that students can discover it.
    As an event organizer, I want to edit or delete my posted events so that I can manage event changes.
3. Event Discovery
    As a student, I want to view a list of upcoming events so that I can find interesting activities.
    As a student, I want to filter events by category (e.g., club meetings, free food) so that I can find relevant events.
4. Basic UI & Navigation
    As a student, I want a simple and intuitive interface so that I can easily navigate the app.
    As a student, I want a search bar to look up events by name or category.
5. Database & Backend
    As a developer, I want a database to store events and user accounts so that the system persists data.
    As a developer, I want an API that allows event creation, retrieval, and deletion.
6.  Create branch protection rules
    Add basic branch protection rules which restrict merging without PR review.
7. Research CICD
    Create a write what steps needed to implement a complete CICD pipeline
    A CI/CD pipeline consists of source control, build, linting, unit and integration testing, containerization (if needed), staging deployment, manual approval (optional), production deployment, and post-deployment monitoring to ensure seamless code integration, testing, and delivery. 🚀

What issues your team planned to address
- Front end:
  - The main page to serve as a welcome page with the logo, placeholder event information, a search bar, login button, and sign up button.
  - Implement the login page along with a sign up page.
  - Implement the about page with more information about our team and a link to our repository.
  - To establish the login and sing up pages with the backend.
- Back end:
  - Create a basic skeleton for our back end and database as a starting point for the project.
  - Create event table in the database to store post information.
  - Create user table and implement user authentication.
  - Implement POST, GET, DELETE commands.

Which ones were successfully completed
- Front end:
  - Successfully implemented the welcome page of the site that currently includes the logo, a search bar to look up events, and some placeholder event cards that would have relevant event information on it.
  - The search bar is functional for the events by the title name.
  - The login and sign up pages are working.
- Back end:
  - Completed working database skeleton and SQLite connections to Swagger.
  - Created and tested Events table with relevant information for posts/events.
  - JSON and routing for POST, GET, DELETE complete.

Which ones didn't and why?
- Front end:
  - Since we were focused on prioritizing the main page of the website and cover the basic features, the login and sign up page have not been connected to the backend yet.
- Back end:
  - User table and authentication have not been implemented yet due to time constraints and still learning how to work back end with GO as well as focusing on other aspects first.

- Front End Video Link: https://youtu.be/UGWnXtQU0CY
- Back End Video Link: https://www.youtube.com/watch?v=Emn7jPdyKSY
