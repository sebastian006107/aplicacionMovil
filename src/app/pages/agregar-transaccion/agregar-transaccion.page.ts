import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { TransactionService } from '../../services/transaction.service';
import { Transaction, CATEGORIAS_CONFIG, CATEGORIAS } from '../../models/transaction.model';

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
  fotoCapturada: string | null = null;

  constructor(
    private navCtrl: NavController,
    private transactionService: TransactionService,
    private alertController: AlertController
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
    // Resetear categoría si ya no es válida para el nuevo tipo
    if (!this.categorias.includes(this.transaccion.categoria)) {
      this.transaccion.categoria = '';
    }
  }

  async tomarFoto() {
    const alert = await this.alertController.create({
      header: 'Función no disponible',
      message: 'La cámara solo funciona en dispositivos móviles. Por ahora puedes continuar sin foto.',
      buttons: ['OK']
    });
    await alert.present();
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

    // Obtener usuario actual
    const usuarioEmail = localStorage.getItem('currentUser') || '';

    // Crear objeto de transacción
    const nuevaTransaccion: Transaction = {
      tipo: this.transaccion.tipo,
      monto: this.transaccion.monto,
      categoria: this.transaccion.categoria,
      descripcion: this.transaccion.descripcion,
      fecha: this.transaccion.fecha,
      usuario_email: usuarioEmail
    };

    // Agregar foto si existe
    if (this.fotoCapturada) {
      nuevaTransaccion.foto_comprobante = this.fotoCapturada;
    }

    // Guardar en el servicio
    this.transactionService.guardarTransaccion(nuevaTransaccion);

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
    const cat = CATEGORIAS.find(c => c.nombre === categoria);
    return cat?.icono || 'pricetag-outline';
  }

  obtenerColor(categoria: string): string {
    const cat = CATEGORIAS.find(c => c.nombre === categoria);
    return cat?.color || '#B2BEC3';
  }

}
