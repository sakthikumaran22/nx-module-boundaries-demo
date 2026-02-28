/**
 * @scope banking-portal (e2e)
 * @type e2e
 *
 * This E2E project demonstrates the boundary rules for type:e2e:
 *
 * ✅ ALLOWED: importing from type:shared (e.g. test utilities in shared scope)
 * ❌ BLOCKED: importing from any type:lib, type:app, or other type:e2e project
 *
 * E2E tests interact with the running application through the UI only.
 * They do NOT import from application code — that would create coupling
 * between the test suite and implementation details.
 */

describe('Banking Portal — Smoke Tests', () => {
  beforeEach(() => cy.visit('/'));

  it('should load the application', () => {
    cy.get('banking-root').should('exist');
  });

  it('should display the main navigation', () => {
    cy.get('nav').within(() => {
      cy.contains('Accounts').should('be.visible');
      cy.contains('Payments').should('be.visible');
      cy.contains('Loans').should('be.visible');
      cy.contains('Onboarding').should('be.visible');
    });
  });

  it('should navigate to the accounts dashboard', () => {
    cy.contains('Accounts').click();
    cy.url().should('include', '/accounts');
    cy.get('banking-accounts-dashboard').should('exist');
  });

  it('should navigate to the payments transfer page', () => {
    cy.contains('Payments').click();
    cy.url().should('include', '/payments');
    cy.get('banking-payments-transfer').should('exist');
  });

  it('should navigate to loan application', () => {
    cy.contains('Loans').click();
    cy.url().should('include', '/loans');
    cy.get('banking-loans-apply').should('exist');
  });

  it('should navigate to KYC onboarding', () => {
    cy.contains('Onboarding').click();
    cy.url().should('include', '/onboarding');
    cy.get('banking-kyc-onboarding').should('exist');
  });
});
