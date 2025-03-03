/// <reference types="cypress" />

describe('Signup Page', () => {
    beforeEach(() => {
        cy.visit('/signup');
    });
  
    it('should render the signup form correctly', () => {
      cy.get('.auth-container').should('be.visible');
      cy.contains('h2', 'Sign Up').should('be.visible');
      
      cy.get('input[name="username"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('input[name="confirmPassword"]').should('be.visible');
  
      cy.get('button[type="submit"]').contains('Sign Up');
    });
  
    it('should allow user to enter signup details', () => {
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="email"]').type('testuser@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="confirmPassword"]').type('password123');
  
      cy.get('input[name="username"]').should('have.value', 'testuser');
      cy.get('input[name="email"]').should('have.value', 'testuser@example.com');
      cy.get('input[name="password"]').should('have.value', 'password123');
      cy.get('input[name="confirmPassword"]').should('have.value', 'password123');
    });
  
    it('should show an error if fields are empty on submit', () => {
      cy.get('button[type="submit"]').click();
      });
  
    it('should attempt signup with valid credentials', () => {
      cy.intercept('POST', '/api/signup', {
        statusCode: 201,
        body: { success: true, message: 'User created successfully!' }
      }).as('signupRequest');
  
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="email"]').type('testuser@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="confirmPassword"]').type('password123');

      cy.get('button[type="submit"]').click();
      cy.wait('@signupRequest').its('response.statusCode').should('eq', 201);
    });
  
    it('should navigate to login page when clicking "Login" link', () => {
      cy.get('a[href="/login"]').click();
      cy.url().should('include', '/login');
    });
  });
  