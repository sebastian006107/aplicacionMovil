import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.page.html',
  styleUrls: ['./recuperar-password.page.scss'],
  standalone: false
})
export class RecuperarPasswordPage {

  email: string = '';

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  async enviarCodigo() {
    if (!this.email) {
      this.mostrarAlerta('Ingresa tu correo electrónico');
      return;
    }

    // Validar formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.mostrarAlerta('Formato de correo inválido');
      return;
    }

    // Simular envío exitoso
    const alert = await this.alertController.create({
      header: 'Código enviado',
      message: 'Revisa tu correo electrónico',
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