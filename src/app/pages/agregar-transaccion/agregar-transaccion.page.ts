import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { TransactionService } from '../../services/transaction.service';
import { Transaction, CATEGORIAS } from '../../models/transaction.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-agregar-transaccion',
  templateUrl: './agregar-transaccion.page.html',
  styleUrls: ['./agregar-transaccion.page.scss'],
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
  fotoCapturada: string | null = null;

  constructor(
    private navCtrl: NavController,
    private transactionService: TransactionService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.filtrarCategorias();
  }

  cambiarTipo() {
    this.transaccion.tipo = this.transaccion.tipo === 'gasto' ? 'ingreso' : 'gasto';
    this.transaccion.categoria = '';
    this.filtrarCategorias();
  }

  filtrarCategorias() {
    if (this.transaccion.tipo === 'gasto') {
      this.categorias = CATEGORIAS.gastos;
    } else {
      this.categorias = CATEGORIAS.ingresos;
    }
  }

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      this.fotoCapturada = image.dataUrl || null;
      
      const alert = await this.alertController.create({
        header: '¡Foto Capturada!',
        message: 'La foto se guardará con la transacción',
        buttons: ['OK']
      });
      await alert.present();

    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo tomar la foto. Asegúrate de dar permisos de cámara.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  eliminarFoto() {
    this.fotoCapturada = null;
  }

  async guardarTransaccion() {
    // Validaciones
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

    // Crear objeto de transacción
    const nuevaTransaccion: Transaction = {
      id: Date.now().toString(),
      tipo: this.transaccion.tipo,
      monto: this.transaccion.monto,
      categoria: this.transaccion.categoria,
      descripcion: this.transaccion.descripcion,
      fecha: this.transaccion.fecha
    };

    // Agregar foto si existe
    if (this.fotoCapturada) {
      nuevaTransaccion.foto = this.fotoCapturada;
    }

    // Guardar en el servicio
    this.transactionService.addTransaction(nuevaTransaccion);

    // Mostrar alerta de éxito
    const alert = await this.alertController.create({
      header: '¡Éxito!',
      message: 'Transacción guardada correctamente',
      buttons: ['OK']
    });
    await alert.present();

    // Volver a la página anterior
    this.navCtrl.back();
  }

  cancelar() {
    this.navCtrl.back();
  }

  obtenerIcono(categoria: string): string {
    const iconos: { [key: string]: string } = {
      'Alimentación': 'fast-food-outline',
      'Transporte': 'car-outline',
      'Entretenimiento': 'game-controller-outline',
      'Salud': 'fitness-outline',
      'Salario': 'cash-outline',
      'Freelance': 'laptop-outline',
      'Inversiones': 'trending-up-outline',
      'Otros': 'ellipsis-horizontal-outline'
    };
    return iconos[categoria] || 'pricetag-outline';
  }

  obtenerColor(categoria: string): string {
    const colores: { [key: string]: string } = {
      'Alimentación': 'success',
      'Transporte': 'primary',
      'Entretenimiento': 'secondary',
      'Salud': 'danger',
      'Salario': 'success',
      'Freelance': 'tertiary',
      'Inversiones': 'warning',
      'Otros': 'medium'
    };
    return colores[categoria] || 'medium';
  }

}