describe('Login Page', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:8100/login');
    cy.wait(1000); 
  });

  it('Debe cargar la página de login', () => {
    cy.url().should('include', '/login');
    cy.wait(1000);
  });

  it('Debe mostrar error 404 para rutas inexistentes', () => {
    cy.visit('http://localhost:8100/ldhasjd2312', { failOnStatusCode: false });
    cy.wait(1000);
    cy.contains('404').should('be.visible');
    cy.wait(2000);
  });

  it('Debe mostrar alerta cuando el usuario está vacío', () => {
    cy.get('ion-input[type="password"]').type('1234', { delay: 150 });
    cy.wait(1000);
    cy.contains('Ingresar').click();
    cy.wait(1000);
    
    cy.get('ion-alert').should('be.visible');
    cy.contains('El campo de usuario no puede estar vacío').should('be.visible');
    cy.wait(3000); 
    cy.get('ion-alert button').contains('OK').click();
    cy.wait(1000);
  });

}); 