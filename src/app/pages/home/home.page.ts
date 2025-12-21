import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { TransactionService } from 'src/app/services/transaction.service';
import { DolarService } from 'src/app/services/dolar.service';
import { Transaction, CATEGORIAS } from '../../models/transaction.model';
import { DetalleTransaccionComponent } from '../../components/detalle-transaccion/detalle-transaccion.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  balance = {
    ingresos: 0,
    gastos: 0,
    total: 0
  };

  transacciones: Transaction[] = [];
  ultimasTransacciones: Transaction[] = [];
  gastosPorCategoria: { categoria: string, monto: number, porcentaje: number, color: string }[] = [];
  
  usuarioEmail: string = '';

  valorDolar: number = 0;
  cargandoDolar: boolean = false;
  balanceEnDolares: number = 0;

  constructor(
    private navCtrl: NavController,
    private transactionService: TransactionService,
    private alertController: AlertController,
    private dolarService: DolarService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.cargarDatos();
    this.cargarValorDolar();
  }

  ionViewWillEnter() {
    this.cargarDatos();
    this.cargarValorDolar();
  }

  cargarDatos() {
    this.usuarioEmail = localStorage.getItem('currentUser') || '';
    this.balance = this.transactionService.calcularBalance();
    this.transacciones = this.transactionService.obtenerTransacciones();
    
    this.ultimasTransacciones = this.transacciones
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5);
    
    this.calcularGastosPorCategoria();
    this.calcularBalanceEnDolares();
  }

  async cargarValorDolar() {
    this.cargandoDolar = true;
    try {
      this.valorDolar = await this.dolarService.obtenerDolarSync();
      this.calcularBalanceEnDolares();
    } catch (error) {
      console.error('Error cargando dólar:', error);
      this.valorDolar = 0;
    } finally {
      this.cargandoDolar = false;
    }
  }

  calcularBalanceEnDolares() {
    if (this.valorDolar > 0) {
      this.balanceEnDolares = this.balance.total / this.valorDolar;
    }
  }

  async refrescarDolar(event?: any) {
    await this.cargarValorDolar();
    if (event) {
      event.target.complete();
    }
  }

  calcularGastosPorCategoria() {
    const gastos = this.transactionService.obtenerGastosPorCategoria();
    const totalGastos = this.balance.gastos;
    
    this.gastosPorCategoria = Object.keys(gastos).map(categoria => {
      const monto = gastos[categoria];
      const porcentaje = totalGastos > 0 ? (monto / totalGastos) * 100 : 0;
      const categoriaInfo = CATEGORIAS.find(c => c.nombre === categoria);
      const color = categoriaInfo?.color || '#B2BEC3';
      
      return { categoria, monto, porcentaje, color };
    }).sort((a, b) => b.monto - a.monto);
  }

  agregarTransaccion() {
    this.mostrarAlertaTemporal('Próximamente: Agregar transacción');
  }

  async verDetalle(transaccion: Transaction) {
    const modal = await this.modalController.create({
      component: DetalleTransaccionComponent,
      componentProps: {
        transaccion: transaccion
      }
    });

    await modal.present();
  }

  async eliminarTransaccion(transaction: Transaction) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Deseas eliminar esta transacción?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            if (transaction.id) {
              this.transactionService.eliminarTransaccion(transaction.id);
              this.cargarDatos();
              this.mostrarToast('Transacción eliminada');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async cerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Deseas salir de tu cuenta?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
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

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);
    
    if (date.toDateString() === hoy.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === ayer.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' });
    }
  }

  formatearMoneda(monto: number): string {
    return `$${monto.toLocaleString('es-CL')}`;
  }

  formatearDolares(monto: number): string {
    return `USD $${monto.toFixed(2)}`;
  }

  obtenerIcono(categoria: string): string {
    const cat = CATEGORIAS.find(c => c.nombre === categoria);
    return cat?.icono || 'ellipsis-horizontal';
  }

  obtenerColor(categoria: string): string {
    const cat = CATEGORIAS.find(c => c.nombre === categoria);
    return cat?.color || '#B2BEC3';
  }

  async mostrarAlertaTemporal(mensaje: string) {
    const alert = await this.alertController.create({
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  async mostrarToast(mensaje: string) {
    const alert = await this.alertController.create({
      message: mensaje,
      cssClass: 'toast-success'
    });
    await alert.present();
  }
}