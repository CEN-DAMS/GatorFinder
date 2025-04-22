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
    });
  });