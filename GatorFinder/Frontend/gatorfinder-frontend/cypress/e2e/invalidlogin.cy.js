import '@testing-library/cypress/add-commands';
describe('Non UFL Email Login Attempt', () => {
    it('shows error for non ufl email', () => {
      cy.visit('/login');
      cy.findByLabelText(/email/i).type('test@test.com');
      cy.findByRole('button', { name: /Request OTP/i }).click();
      cy.findByText(/Only ufl\.edu email addresses are allowed\./i).should('be.visible');
    });
  });