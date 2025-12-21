import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarTransaccionPage } from './agregar-transaccion.page';

describe('AgregarTransaccionPage', () => {
  let component: AgregarTransaccionPage;
  let fixture: ComponentFixture<AgregarTransaccionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarTransaccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
