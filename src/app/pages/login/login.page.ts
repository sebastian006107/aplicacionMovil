import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {

  username: string = '';
  password: string = '';

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private storage: StorageService
  ) {}

  async login() {
    // Validar campos vacíos
    if (!this.username) {
      this.mostrarAlerta('El campo de usuario no puede estar vacío');
      return;
    }

    if (!this.password) {
      this.mostrarAlerta('El campo de contraseña no puede estar vacío');
      return;
    }

    // Validar longitud mínima
    if (this.password.length < 4) {
      this.mostrarAlerta('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    // Validar con usuarios guardados
    if (this.storage.validarLogin(this.username, this.password)) {
      // Login exitoso - guardar sesión
      localStorage.setItem('currentUser', this.username);
      this.navCtrl.navigateForward(['/tabs/home']);
    } else {
      this.mostrarAlerta('Usuario o contraseña incorrectos');
    }
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  recuperarPassword() {
    this.navCtrl.navigateForward(['/recuperar-password']);
  }

  registro() {
    this.navCtrl.navigateForward(['/registro']);
  }

}
