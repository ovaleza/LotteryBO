import { Component, Input, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { HeaderComponent } from '@coreui/angular';
import { AlertService } from '../../app/services/alert-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {
  @Input() sidebarId: string = 'sidebar';
  public visible: boolean = false;
  public ciaName:string | null="Valeza Bank"
  public usrName:string | null="Odulio G Valeza"
  public usrInitials:string | null="OV"

  localTimer = 5000 *60*120; // 120 minutos = 2 horas
  isActivity = false;
  isMouseMove: any;

  constructor(private alert: AlertService, private router: Router) {
    super();
    this.countDown();
  }


  @HostListener('document:mousemove', ['$event']) onMosusemove(e: MouseEvent) {
    this.countDown();
  }

  countDown() {
    clearInterval(this.isMouseMove);
    this.isMouseMove = setInterval(() => {
      clearInterval(this.isMouseMove);
      this.closeSesionAuto()
    }, this.localTimer);
  }

  ngOnInit(): void {
    this.setValues();
    this.myReloj();
    setInterval(this.myReloj, 1000);
  }

  myReloj() {
    let input: HTMLElement | null = document.getElementById('reloj');
    if (input){
    let el1: HTMLElement = input!;
    const d = new Date();
    el1.innerHTML = d.toLocaleString();
    //this.alert.soloAlert(d.toLocaleTimeString())
    }
  }

  setValues(){
    this.ciaName=localStorage.getItem('ciaName')
    this.usrName=localStorage.getItem('usrName')
    this.usrInitials=''
    var cadena:string = String(this.usrName)
    var separador = " ", // un espacio en blanco
    arregloDeSubCadenas = cadena.split(separador); // SEPARA EL NOMBRE EN CADENAS INDIVIDUALES
    for (let x=0;x<arregloDeSubCadenas.length;x++){
        this.usrInitials  = this.usrInitials+arregloDeSubCadenas[x].substring(0, 1);
    }
  }

async closeSesionAuto() {
  this.alert.errorAlertFunction('Se va a cerrar la sesion',5000)
  .then((res) => {
    if (res.isConfirmed || res.isDismissed) {
      //|| res.isDismissed
      this.visible = false;
      //location.reload();
      this.router.navigate([`/login`]);
      localStorage.clear();

    }
  });
}

  async closeSesion() {
    this.alert
      .validationAlertFunction(
        '¿Quieres cerrar la sesión?',
        'Si, cerrar sesión',
      )
      .then((res) => {
        if (res.isConfirmed) {
          this.visible = false;
          this.router.navigate([`/login`]);
          localStorage.clear();

        }
      });
  }
}
