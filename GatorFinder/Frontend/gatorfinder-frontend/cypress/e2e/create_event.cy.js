describe('Event Creation', () => {
    beforeEach(() => {
      cy.visit('/home');
    });
  
    it('create a new event and be visible on home page', () => {
      cy.get('[aria-label="add"]').click();
      cy.contains('Create Event').should('be.visible');
      cy.get('.MuiDialogContent-root input').eq(0).type('sample');
      cy.get('.MuiDialogContent-root textarea').eq(0).type('sample description');
      cy.contains('button', 'Create').click();
      cy.contains('Create Event').should('not.exist');
      cy.contains('sample').should('be.visible');
      cy.contains('sample description').should('be.visible');
      cy.get('.MuiCard-root')
        .contains('sample')
        .closest('.MuiCard-root')
        .within(() => {
          cy.contains('sample description');
        });
    });
  });