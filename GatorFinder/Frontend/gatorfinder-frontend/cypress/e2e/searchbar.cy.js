/// <reference types="cypress" />

describe('Home Page Search Bar', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('Search bar should filter events correctly', () => {
      cy.get('input[placeholder="Search..."]').type('event 1');
      cy.contains('.post', 'Event 1').should('be.visible');
      cy.contains('.post', 'Event 2').should('not.exist');
      cy.contains('.post', 'Event 3').should('not.exist');
    });
  });