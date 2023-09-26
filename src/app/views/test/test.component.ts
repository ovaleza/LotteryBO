import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert-service';
import  {  PdfViewerModule  }  from  'ng2-pdf-viewer';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  public newpage:any
  public ventana_secundaria:any
  constructor( public alert:AlertService
  ) {
    
   }

  ngOnInit(): void {
  }


          
  abrirVentana(){
      //guardo la referencia de la ventana para poder utilizarla luego
      this.ventana_secundaria = window.open("http://diariolibre.com","miventana","width=300,height=200,menubar=no")
      this.ventana_secundaria.document.cookie='jose=josefa3'
  }
  
  cerrarVentana(){
      //la referencia de la ventana es el objeto window del popup. Lo utilizo para acceder al método close
      this.ventana_secundaria.close()

  }

  verCookies(){
    document.cookie='hola=bien2'
    let ventanita:any;
    ventanita=document.getElementById("ventana")
    ventanita.cookie='ownerDocument=ddd'
    var lasCookies = ventanita.cookie;    
    this.alert.soloAlert(lasCookies)    
    //this.ventana_secundaria.document.cookie="comida_favorita=arroz; max-age=3600; path=/";
    //this.ventana_secundaria.document.cookie="BCSessionID=33; max-age=3600; path=/";    
   

}



}
