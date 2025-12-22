import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { TransactionService } from '../../services/transaction.service';
import { Transaction, CATEGORIAS_CONFIG, CATEGORIAS } from '../../models/transaction.model';
import { Camera, CameraResultType } from '@capacitor/camera';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-agregar-transaccion',
  templateUrl: './agregar-transaccion.page.html',
  styleUrls: ['./agregar-transaccion.page.scss'],
  standalone: false
})
export class AgregarTransaccionPage implements OnInit {

  transaccion = {
    tipo: 'gasto' as 'ingreso' | 'gasto',
    monto: 0,
    categoria: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0]
  };

  categorias: string[] = [];
  fotoCapturada: SafeResourceUrl | null = null;
  fotoParaGuardar: string = '';

  constructor(
    private navCtrl: NavController,
    private transactionService: TransactionService,
    private alertController: AlertController,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.filtrarCategorias();
  }

  filtrarCategorias() {
    if (this.transaccion.tipo === 'gasto') {
      this.categorias = CATEGORIAS_CONFIG.gastos;
    } else {
      this.categorias = CATEGORIAS_CONFIG.ingresos;
    }
    if (!this.categorias.includes(this.transaccion.categoria)) {
      this.transaccion.categoria = '';
    }
  }

  async tomarFoto() {
    try {
      const capturedPhoto = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri
      });

      this.fotoCapturada = this.sanitizer.bypassSecurityTrustResourceUrl(
        capturedPhoto.webPath!
      );

      this.fotoParaGuardar = capturedPhoto.webPath || '';

    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo tomar la foto: ' + error,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  eliminarFoto() {
    this.fotoCapturada = null;
    this.fotoParaGuardar = '';
  }

  async guardarTransaccion() {
    if (this.transaccion.monto <= 0) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'El monto debe ser mayor a 0',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (!this.transaccion.categoria) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Debes seleccionar una categoría',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (!this.transaccion.descripcion.trim()) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'La descripción no puede estar vacía',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const usuarioEmail = localStorage.getItem('currentUser') || '';

    const nuevaTransaccion: Transaction = {
      tipo: this.transaccion.tipo,
      monto: this.transaccion.monto,
      categoria: this.transaccion.categoria,
      descripcion: this.transaccion.descripcion,
      fecha: this.transaccion.fecha,
      usuario_email: usuarioEmail
    };

    if (this.fotoParaGuardar) {
      nuevaTransaccion.foto_comprobante = this.fotoParaGuardar;
    }

    await this.transactionService.guardarTransaccion(nuevaTransaccion);

    const alert = await this.alertController.create({
      header: '¡Éxito!',
      message: 'Transacción guardada correctamente',
      buttons: ['OK']
    });
    await alert.present();

    this.navCtrl.back();
  }

  cancelar() {
    this.navCtrl.back();
  }

  obtenerIcono(categoria: string): string {
    const cat = CATEGORIAS.find(c => c.nombre === categoria);
    return cat?.icono || 'pricetag-outline';
  }

  obtenerColor(categoria: string): string {
    const cat = CATEGORIAS.find(c => c.nombre === categoria);
    return cat?.color || '#B2BEC3';
  }

}