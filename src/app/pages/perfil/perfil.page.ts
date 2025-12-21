import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {

  usuario = {
    nombre: '',
    apellido: '',
    email: ''
  };

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  ionViewWillEnter() {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    const email = localStorage.getItem('currentUser');
    const usuarios = localStorage.getItem('usuarios');
    
    if (email && usuarios) {
      const usuariosArray = JSON.parse(usuarios);
      const usuarioEncontrado = usuariosArray.find((u: any) => u.email === email);
      
      if (usuarioEncontrado) {
        this.usuario = {
          nombre: usuarioEncontrado.nombre || 'Usuario',
          apellido: usuarioEncontrado.apellido || '',
          email: usuarioEncontrado.email
        };
      }
    }
  }

  async editarPerfil() {
    const alert = await this.alertController.create({
      header: 'Editar Perfil',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre',
          value: this.usuario.nombre
        },
        {
          name: 'apellido',
          type: 'text',
          placeholder: 'Apellido',
          value: this.usuario.apellido
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.nombre && data.apellido) {
              this.actualizarDatos(data.nombre, data.apellido);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  actualizarDatos(nombre: string, apellido: string) {
    const email = localStorage.getItem('currentUser');
    const usuarios = localStorage.getItem('usuarios');
    
    if (email && usuarios) {
      const usuariosArray = JSON.parse(usuarios);
      const index = usuariosArray.findIndex((u: any) => u.email === email);
      
      if (index !== -1) {
        usuariosArray[index].nombre = nombre;
        usuariosArray[index].apellido = apellido;
        localStorage.setItem('usuarios', JSON.stringify(usuariosArray));
        
        this.usuario.nombre = nombre;
        this.usuario.apellido = apellido;
        
        this.mostrarMensaje('Perfil actualizado correctamente');
      }
    }
  }

  async cambiarPassword() {
    const alert = await this.alertController.create({
      header: 'Cambiar Contraseña',
      inputs: [
        {
          name: 'passwordActual',
          type: 'password',
          placeholder: 'Contraseña actual'
        },
        {
          name: 'passwordNueva',
          type: 'password',
          placeholder: 'Nueva contraseña'
        },
        {
          name: 'passwordConfirmar',
          type: 'password',
          placeholder: 'Confirmar contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cambiar',
          handler: (data) => {
            if (data.passwordNueva !== data.passwordConfirmar) {
              this.mostrarMensaje('Las contraseñas no coinciden');
              return false;
            }
            if (data.passwordNueva.length < 4) {
              this.mostrarMensaje('La contraseña debe tener al menos 4 caracteres');
              return false;
            }
            this.actualizarPassword(data.passwordActual, data.passwordNueva);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  actualizarPassword(passwordActual: string, passwordNueva: string) {
    const email = localStorage.getItem('currentUser');
    const usuarios = localStorage.getItem('usuarios');
    
    if (email && usuarios) {
      const usuariosArray = JSON.parse(usuarios);
      const usuario = usuariosArray.find((u: any) => u.email === email);
      
      if (usuario && usuario.password === passwordActual) {
        const index = usuariosArray.findIndex((u: any) => u.email === email);
        usuariosArray[index].password = passwordNueva;
        localStorage.setItem('usuarios', JSON.stringify(usuariosArray));
        this.mostrarMensaje('Contraseña actualizada correctamente');
      } else {
        this.mostrarMensaje('Contraseña actual incorrecta');
      }
    }
  }

  async verAcercaDe() {
    const alert = await this.alertController.create({
      header: 'Acerca de',
      message: '<strong>Mi Billetera</strong><br>Versión 1.0.0<br><br>Aplicación de gestión de finanzas personales',
      buttons: ['OK']
    });

    await alert.present();
  }

  async cerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Deseas salir de tu cuenta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salir',
          handler: () => {
            localStorage.removeItem('currentUser');
            this.navCtrl.navigateRoot(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

  async mostrarMensaje(mensaje: string) {
    const alert = await this.alertController.create({
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

}
