/// <reference types="cypress" />

describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/login'); 
    });
  
    it('Render the login form correctly', () => {
      cy.get('.auth-container').should('be.visible');
      cy.get('h2').contains('Login');
      cy.get('input[name="usernameEmail"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').contains('Login');
    });
  
    it('Allow user to enter username/email and password', () => {
      cy.get('input[name="usernameEmail"]').type('testuser@example.com');
      cy.get('input[name="password"]').type('password123');
  
      cy.get('input[name="usernameEmail"]').should('have.value', 'testuser@example.com');
      cy.get('input[name="password"]').should('have.value', 'password123');
    });
  
    it('Show an error if fields are empty on submit', () => {
      cy.get('button[type="submit"]').click();
            //potential addition for error fields later on
    });
  
    it('Attempt login when valid credentials are entered', () => {
      cy.intercept('POST', '/api/login', {
        statusCode: 200,
        body: { success: true, token: 'fake-jwt-token' }
      }).as('loginRequest');
  
      cy.get('input[name="usernameEmail"]').type('testuser@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    });
  
    it('Navigate to signup page when clicking Sign Up', () => {
      cy.get('a[href="/signup"]').click();
      cy.url().should('include', '/signup');
    });
  });
  