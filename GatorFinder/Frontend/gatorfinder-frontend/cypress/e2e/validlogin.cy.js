import '@testing-library/cypress/add-commands';

describe('Valid UFL Email Login Attempt', () => {
  it('navigates to the OTP screen when a valid UFL email is entered', () => {
    cy.intercept('GET', '**/events/get', { statusCode: 200, body: {} });
    cy.visit('/login');
    cy.findByLabelText(/email/i).type('@ufl.edu');
    cy.findByRole('button', { name: /Request OTP/i }).click();
    cy.findByText(/Enter OTP/i).should('be.visible');
  });
});