describe('Registro Page', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:8100/registro');
  });

  it('Debe cargar la página de registro', () => {
    cy.url().should('include', '/registro');
  });

  it('Debe mostrar alerta con email inválido', () => {
    cy.get('ion-input[type="text"]').eq(0).type('Juan', { delay: 100 });
    cy.get('ion-input[type="text"]').eq(1).type('Pérez', { delay: 100 });
    cy.get('ion-input[type="email"]').type('correo-invalido', { delay: 100 });
    cy.get('ion-input[type="password"]').type('12345', { delay: 100 });
    cy.get('.register-button').click();
    
    cy.get('ion-alert').should('be.visible');
    cy.contains('Formato de correo inválido').should('be.visible');
    cy.wait(2000);
    cy.get('ion-alert button').contains('OK').click();
  });

  it('Debe mostrar alerta cuando la contraseña tiene menos de 4 caracteres', () => {
    cy.get('ion-input[type="text"]').eq(0).type('Juan', { delay: 100 });
    cy.get('ion-input[type="text"]').eq(1).type('Pérez', { delay: 100 });
    cy.get('ion-input[type="email"]').type('juan@test.com', { delay: 100 });
    cy.get('ion-input[type="password"]').type('123', { delay: 100 });
    cy.get('.register-button').click();
    
    cy.get('ion-alert').should('be.visible');
    cy.contains('La contraseña debe tener al menos 4 caracteres').should('be.visible');
    cy.wait(2000);
    cy.get('ion-alert button').contains('OK').click();
  });

  it('Debe registrar un usuario correctamente', () => {
    cy.get('ion-input[type="text"]').eq(0).type('Juan', { delay: 100 });
    cy.get('ion-input[type="text"]').eq(1).type('Pérez', { delay: 100 });
    cy.get('ion-input[type="email"]').type('nuevo@test.com', { delay: 100 });
    cy.get('ion-input[type="password"]').type('1234', { delay: 100 });
    
    cy.get('input[matInput]').type('01/15/2000', { delay: 100 });
    cy.wait(500);
    
    cy.get('.register-button').click();
    
    cy.get('ion-alert').should('be.visible');
    cy.contains('Registro exitoso').should('be.visible');
    cy.wait(2000);
    cy.get('ion-alert button').contains('OK').click();
  });

});