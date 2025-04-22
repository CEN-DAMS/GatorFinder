describe('profile check', () => {
    beforeEach(() => {
      cy.visit('/home');
    });
    it('navigates to profile', () => {
      cy.get('[aria-label="Profile"]').click();
      cy.contains('Your Profile').should('be.visible');
    });
  });