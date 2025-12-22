import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage {

  nombre: string = '';
  apellido: string = '';
  email: string = '';
  password: string = '';
  fechaNacimiento: Date | null = null;

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private storage: StorageService
  ) {}

  async registrarse() {
    // Validar campos vacíos
    if (!this.nombre || !this.apellido || !this.email || !this.password) {
      this.mostrarAlerta('Completa todos los campos');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.mostrarAlerta('Formato de correo inválido');
      return;
    }

    // Validar longitud contraseña
    if (this.password.length < 4) {
      this.mostrarAlerta('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    // Guardar usuario (SQLite o localStorage)
    await this.storage.guardarUsuario({
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      password: this.password
    });

    // Registro exitoso
    const alert = await this.alertController.create({
      header: 'Registro exitoso',
      message: 'Tu cuenta ha sido creada',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.navigateBack(['/login']);
        }
      }]
    });
    await alert.present();
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

}