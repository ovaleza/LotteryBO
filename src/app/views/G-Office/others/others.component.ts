import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { IBranch, IGroup, IReport, IVendor, ICriteria, ITicketDetail, ITicket} from 'src/app/models/master.models';
import { ActivatedRoute } from '@angular/router';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DatePipe } from '@angular/common';
import { PdfService } from 'src/app/services/pdf.service';

export interface Line {
  Column1?: string | "";
  Column2?: string | "";
  Column3?: string | "";
  Column4?: string | "";
}

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss']
})
export class OthersComponent implements OnInit {
  public listBanks:any[]=[];
  public listDepos:any[]=[];
  public listPdf:any[]=[];
  public criteria:ICriteria= {
    Name:"view_monitor_bancas",
    Criteria1:'', Criteria2:'', Criteria3:'', Criteria4:'', Criteria5:'', Criteria6:'',
    Criteria7:'', Criteria8:'', Criteria9:'', Criteria10:'', Criteria11:'', Criteria12:'',
  }
  public form: FormGroup;


  public balanceOT=0;underLimit=false;

  public branchesTotal:any
  public modalTitle: string = ''
  public id: number =0; id2:number=0; id3:number=0;
  public idTimer: number=0;
  public name: string = '';

  constructor(
    private activeRouter: ActivatedRoute,
    private alert: AlertService,
    private service:  MasterService,
    private pdfMaker: PdfService
  ) {
    this.activeRouter.params.subscribe((params) => {
      this.id = params['id'];
      this.name = params['name'];
    });
    this.form = new FormGroup({});
    this.reset();
   }

  ngOnInit(): void {
  }

  reset(){
    let hoy=this.service.getToday();
    let viejo=this.service.getMonthIni();
    this.form = new FormGroup({
      date1: new FormControl(viejo),
      date2: new FormControl(hoy),
      activity: new FormControl('A'),
    });
    this.getAll();
  }


  getAll() {
    this.getRechargeBalance();
    this.getBanks()
    this.getTransactions();
  }

  getRechargeBalance() {
    let refClient=this.service.getNewReferenciaCliente();
    this.service.getRechargeBalance(refClient).subscribe(
        (res:any) => { this.balanceOT =res.Saldo.saldo;
          this.underLimit = this.balanceOT<=750*this.branchesTotal?true:false},
        (error: any) => {this.balanceOT =0;}
    );
  }

  getBanks() {
    let refClient=this.service.getNewReferenciaCliente();
    this.service.getBanks(refClient).subscribe(
        (res:any) => {
          this.listBanks=[]
          res.Bancos.forEach((element:any)=> {
            let obj = {
              Column1: element.entidadField,
              Column2: element.cccField,
              Column3: element.imagenField,
              Column4: element.imagenPeqField
            }
            this.listBanks.push(obj)
          })
        },
        (error: any) => {console.log(error);}
    );
  }
//   PropertyChanged: null
// cajeroField: "True"
// cccField: "758577084"
// enlaceField: "https://www.popularenlinea.com"
// entidadField: "Banco Popular"
// imagenField: "https://www.disashopimg.com/repositorioImagenesCDN/bancos/DO/250/1.png"
// imagenPeqField: "https://www.disashopimg.com/repositorioImagenesCDN/bancos/DO/24/1.png"
// transferenciaField: "True"
// ventanillaField: "True"

  getTransactions() {
    let refClient=this.service.getNewReferenciaCliente();
    let obj ={
      fechaInicio : this.form.value['date1'],
      fechaFin: this.form.value['date2'],
      tipoTransaccion:'A',
      numResultados:'100',
      totales:'1'
    }
    //this.criteria.Criteria1=this.form.value['date1']
    //this.criteria.Criteria2=this.form.value['date2']
    this.service.postSearch('GetDSTransacciones', obj).subscribe(
        (res:any) => {
          this.listDepos=[]
          let tot=0;
          res.Transacciones.forEach((element:any)=> {
            let ff=element.fechaHoraField
            let obj = {
              Column1: ff.substring(6,8)+'-'+ff.substring(4,6)+ '-'+ff.substring(0,4),
              Column2: element.nombreProductoField,
              Column3: element.importeField,
              Column4: element.saldoField
            }
            this.listDepos.push(obj)
            tot=tot+(isNaN(parseFloat(element.importeField))?0:parseFloat(element.importeField))
          })
          // let obj={
          //   Column1: '',
          //   Column2: 'Total',
          //   Column3: tot,
          //   Column4: ''
          // }
          // this.listDepos.push(obj)
        },
        (error: any) => {console.log(error);}
    );
  }
  // PropertyChanged: null
  // baseImponibleComisionField: "0.000000"
  // baseImponibleField: "0.000000"
  // comisionField: "0.000000"
  // enlaceField: ""
  // estadoField: "OK"
  // fechaHoraField: "20240916 15:30:15"
  // importeComisionField: "0.000000"
  // importeField: "1000000.000000"
  // importeImpuestosField: "0.000000"
  // nombreProductoField: "BANRESERVAS (CUENTA CORRIENTE)"
  // numeroTicketField: "0"
  // productoField: "        "
  // referenciaClienteField: ""
  // referenciaPagoTarjetaField: ""
  // referenciaProveedorRecargaField: ""
  // saldoField: "1103880.280000"
  // telefonoField: ""
  // tipoTransaccionField: "A"

}
