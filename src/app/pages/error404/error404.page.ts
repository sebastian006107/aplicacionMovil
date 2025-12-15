import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.page.html',
  styleUrls: ['./error404.page.scss'],
  standalone: false
})
export class Error404Page implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  volverInicio() {
    this.navCtrl.navigateRoot(['/login']);
  }

}
