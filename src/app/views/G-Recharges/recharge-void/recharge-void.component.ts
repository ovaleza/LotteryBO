import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { IRecharge, IReport, ICriteria, IGroup, IVendor, IBranch } from 'src/app/models/master.models';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DatePipe } from '@angular/common';
import { PdfService } from 'src/app/services/pdf.service';

import { ExcelService } from 'src/app/services/excel.service';
import * as moment from 'moment';

@Component({
  selector: 'app-recharge-void',
  templateUrl: './recharge-void.component.html',
  styleUrls: ['./recharge-void.component.scss']
})
export class RechargeVoidComponent implements OnInit {
  public option: string = '0';
  public list:IRecharge[]=[];
  public list2:IReport[]=[];
  public listBanks:any[]=[];
  public listDepos:any[]=[];
  public listPdf:IReport[]=[];
  public criteria:ICriteria= {
    Name:"view_recharges",
    Criteria1:'', Criteria2:'', Criteria3:'', Criteria4:'', Criteria5:'', Criteria6:'',
    Criteria7:'', Criteria8:'', Criteria9:'', Criteria10:'', Criteria11:'', Criteria12:'',
  }
  public fileGroups: IGroup[]=[] ;
  public fileVendors: IVendor[]=[] ;
  public fileBranchs: IBranch[]=[] ;

  public icons = freeSet;
  public visible = false; visibleBanks=false; visibleParameters=false; public sta = ''; public win = false; public correct=false
  public form!: FormGroup | FormGroup;
  public formParameters!: FormGroup | FormGroup;
  public search: string = ''
  public modalTitle: string = ''
  public id: number = 0
  public page: any
  public pages : number = 50
  ReadMore:boolean = true
  public isAdm : boolean=false;
  public isOff : boolean=false;
  public isDay : boolean=false;
  public isOwn : boolean=false;
  public voidEnabled: boolean = (localStorage.getItem('vrech')=='True');
  public rehargesEnabled: boolean = (localStorage.getItem('rech')=='True' || localStorage.getItem('invo')=='True');

  dataResult: any = [];
  sort=true;

  public balanceOT:any;underLimit=false;

  constructor(
    private excelService: ExcelService,
    private alert: AlertService,
    public service: MasterService,
    private pdfMaker: PdfService)
  {
    this.setform()
    this.setformParameters()
  }

  setform() {
    this.form = new FormGroup({
      serial: new FormControl(''),
      branch: new FormControl(''),
      us: new FormControl(''),
      dateEnter: new FormControl(''),
      provider : new FormControl(0),
      phoneNumber : new FormControl(''),
      plan: new FormControl(''),
      amount: new FormControl(0),
      status: new FormControl(''),
      collectDate : new FormControl(''),
      vendor : new FormControl(''),
    });
  }

  reset(){
    this.setformParameters()
    this.getAll();
  }

  setformParameters(){
    let hoy=this.service.getToday();
    let viejo=hoy
    this.formParameters = new FormGroup({
      date1: new FormControl(viejo),
      date2: new FormControl(hoy),
      group: new FormControl(0),
      vendor: new FormControl(0),
      branch: new FormControl(0),
      activity: new FormControl(0),
    });
  }

  ngOnInit(): void {
    const input:HTMLElement | null  = document.getElementById("searchR");
    const btn:HTMLElement | null  = document.getElementById("btnSearchR");
    const el1:HTMLElement =input!;
    const btn1:HTMLElement =btn!;
    el1.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        btn1.click();
      }
    });
    this.service.getList('GetVendors').subscribe(
      (response) => { this.fileVendors = response["Vendors"]},
      (error) => { console.log(error); });

    this.service.getList('GetGroups').subscribe(
      (response) => { this.fileGroups = response["Groups"] },
      (error) => { console.log(error); });

    this.service.getList('GetBranches').subscribe(
        (response) => { this.fileBranchs = response["Branches"] },
        (error) => { console.log(error); });
      this.getAll()
  }

  getRechargeBalance() {
    this.balanceOT=(localStorage.getItem('RechargeBalance'))
    this.balanceOT=isNaN(parseFloat(this.balanceOT))?0:parseFloat(this.balanceOT);
  }

sortList() {
  this.sort=!this.sort
  if (!this.sort)
    this.list.sort((a, b) => b.Id-a.Id)
  else
  this.list.sort((a, b) => a.Id-b.Id)
}

exportToExcel(): void {
  let ttitle = document.getElementById("tableTitle");
  let theaders = ttitle.getElementsByTagName("th");
  let columns=theaders.length
  let headers=[]
  for (let i=0; i<columns;i++) {
    headers.push(theaders[i].innerHTML)
  }
  this.excelService.generateExcel(this.listPdf, 'Listado_Recargas',headers);
}

getAll2() {
  let hoy=this.service.getToday();
  //let viejo=this.service.getMonthIni();
  let viejo = moment(hoy).subtract(30,'d')
  this.form = new FormGroup({
    date1: new FormControl(viejo),
    date2: new FormControl(hoy),
    activity: new FormControl('A'),
  });
  this.getBanks();
  this.getTransactions();
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
    numResultados:'',
    totales:'1'
  }
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

  getAll(){
    this.page=1;
    this.sort=true;
    this.getRechargeBalance();
    this.isAdm=this.service.setAdm()
    this.isOff=this.service.setRole()=='OFICINA'
    this.isOwn=this.service.setRole()=='ADMIN'
    let day=this.formParameters.value['date1']
    this.isDay=(this.isAdm || this.isOwn || (this.service.setDayEnabled(day) && this.isOff));
    if (!this.isOwn && !this.isAdm) this.isDay=this.voidEnabled;
    //this.isDay=false;

    this.criteria.Criteria1=this.formParameters.value['date1']
    this.criteria.Criteria2=this.formParameters.value['date2']
    this.criteria.Criteria3=this.formParameters.value['group']
    this.criteria.Criteria4=this.formParameters.value['vendor']
    this.criteria.Criteria5=this.formParameters.value['branch']
    this.criteria.Criteria6=this.formParameters.value['activity']
    this.list=[];
    this.listPdf=[];
    this.service.postSearch('searchReport', this.criteria).subscribe(
      (response:any) => { this.list2 = response["Results"];
      let tAmount=0,tPrize=0
      let x=0;
      for (let item of this.list2){
        x++
       let obj: any;
       let obj2: any;
       obj = {
         Id:x,
         Branch: item.Column1,
         DateEnter: item.Column2,
         Serial: item.Column3,
         PhoneNumber: item.Column4,
         Provider: item.Column5,
         Amount: parseFloat(item.Column6),
         Vendor: item.Column7,
         Status: item.Column8,
         Group:item.Column9,
//         ResponseDescription: '',
//         HasError: false
       };
       obj2 = {
        Column1: item.Column1,
        Column2: item.Column2,
        Column3: item.Column3,
        Column4: item.Column4,
        Column5: item.Column5,
        Column6: item.Column6,
        Column7: this.service.theStatus(item.Column8),
        Column8: item.Column7,
        Column9: item.Column9,
      };
      obj2.Column6=Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(obj2.Column6))
       if (obj.Status.toUpperCase()!='N' && obj.Status.toUpperCase()!='I') {
        tAmount += parseFloat(item.Column6);
        //tPrize  += parseFloat(item.Column8);
      }
       this.list.push(obj)
       this.listPdf.push(obj2)
      };
      if (tAmount || tPrize) {
        let tot:any = {
         Status: '',
         Provider : `Totales (${this.list.length})`,
         Amount: tAmount,
        //  Prize: tPrize,
       }
       let tot2:any = {
        Column1 : `Totales (${this.list.length})`,
        Column2 : '',
        Column3 :'',
        Column4 : Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tAmount),
        Column5: '',
        Column6 : '',
        Column7: '',
        Column8: '',
        Column9: '',
        Column10: '',
      }

       this.list.push(tot)
       this.listPdf.push(tot2)
     }
       },
      (error) => { console.log(error); });
  }

  openModal(title: string) {
    this.visible = true;
    this.modalTitle = title
  }

  closModal() {
    this.visible = false;
    this.id = 0;
    this.form.reset()
    this.setform();
  }

  openModalBanks(title: string='') {
    this.getAll2();
    this.visibleBanks = true;
  }

  closModalBanks() {
    this.visibleBanks = false;
  }

  getNumberValue(page: any){
    this.pages = page.target.value;
  }

  onclick()
  {
    this.ReadMore = !this.ReadMore; //not equal to condition
    this.visibleParameters = !this.visibleParameters
    if (!this.visibleParameters) this.reset()
  }

  generatePdf() {
    if (this.listPdf.length > 0) {
      this.dataResult=[]
      let ttitle = document.getElementById("tableTitle");
      let theaders = ttitle.getElementsByTagName("th");
      let columns=theaders.length
      let activities=['Todos','Anulados']
      let headers=[]
      for (let i=0; i<columns;i++) {
        headers.push(theaders[i].innerHTML)
      }
      let tRows:any,obj:any,row:any
      if (true){
        // con este codigo toma todos los registros de la data obtenida
        tRows = this.listPdf
        for (let x=0; x<tRows.length; x++) {
          row = tRows[x]
          obj= {};
          for (let i=0; i<columns;i++) {
            obj[headers[i]]= Object.values(row)[i]
          }
          obj.Apostado=Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(row.Column5))
          this.dataResult.push(obj);
        };
      }
      else
      {
        // con este codigo solo toma los registros presentados en la pagina de la pantalla html
        let tb = document.getElementById("tableBody");
        tRows = tb.getElementsByTagName("tr");
        for (let x=0; x<tRows.length; x++) {
          row = tRows[x].getElementsByTagName("td")
          obj= {};
          for (let i=0; i<columns;i++) {
            obj[headers[i]]= row[i].innerHTML
          }
          this.dataResult.push(obj);
        };
      }
      let elgrupo=this.criteria.Criteria3
      elgrupo=elgrupo>'0'?' / (*'+this.service.theGroup(elgrupo)+'*)':'(TODOS LOS GRUPOS)';
      let title = `Listado Recargas, Del: ${this.formParameters.value['date1']} Al: ${this.formParameters.value['date2']} (${activities[this.formParameters.value['activity']]}) ${elgrupo}`
      this.pdfMaker.pdfGenerate(headers, this.dataResult, title);
    } else {
      this.alert.errorAlertFunction(
        '!Oops algo salio mal, el no tienes data para generar PDF.'
      );
    }
  }

  getOne(id: any) {
    if (parseInt(id)!=0){
      let data:IRecharge;
      this.service.getList('GetRechargeBySerial?serial='+id).subscribe(
        (response) => {
           data = response["Recharge"];
//           this.list = response["Ticket"]['TicketDetail'];
           if (data.Id){
            this.sta = data.Status
            //this.win = data.Winner
            this.visible=true;this.correct=(this.sta!='P' && this.sta!='N')
            if (!this.correct) this.alert.errorAlertFunction('Esta Recarga ya no se puede Anular');
            this.id = data.Id;
            this.openModal('Anular / Habilitar Recarga');
            this.form = new FormGroup({
              serial: new FormControl(data.Serial),
              branch: new FormControl(this.service.theBranch(data.Branch)),
              dateEnter: new FormControl(data.DateEnter),
              provider: new FormControl(this.service.theProvider(data.Provider)),
               phoneNumber :  new FormControl(data.PhoneNumber),
               plan : new FormControl(data.Plan),
               amount: new FormControl(data.Amount),
               status: new FormControl(data.Status),
               collectDate :new FormControl(data.CollectDate),
               vendor :new FormControl(this.service.theVendor(data.Vendor)),

            });
          }
          else
          {
            //this.closModal()
            this.alert.errorAlertFunction('Ese Numero de Ticket no Existe');
          }
        },
        (error) => { console.log(error); });
    }
  }

  add() {
    this.alert
      .validationAlertFunction(
        '¿Realmente quiere Modificar esta Recarga?',
        'Si, Modificar'
      )
      .then((res) => {
        if (res.isConfirmed) {
          if(this.form.valid && this.id!=0){
            let obj: IRecharge;
            obj = {
              Id: this.id,
              Cia:0,
              Us : '',
              Serial: this.form.value['serial'],
              Branch: this.form.value['branch'],
              DateEnter: this.form.value['dateEnter'],
              Provider: this.form.value['provider'],
              PhoneNumber: this.form.value['phoneNumber'],
              Plan : this.form.value['plan'],
              Amount: this.form.value['amount'],
              Status: this.form.value['status'],
              ResponseDescription: '',
              HasError: false
            };
            this.service.postItem('VoidRecharge?serial='+obj.Serial,obj).subscribe({
              next: (response: any) => {
              if (response.Recharge.Status!='N')
                {
                    this.alert.errorAlertFunction(response['ResposeDescription']);
                }
              else {
                this.alert.successAlertFunction('Bien, Id: '+obj.Serial);
                this.getAll();
                this.closModal();}
              },
              error: (error: any) => {
              console.log(error);
              this.alert.errorAlertFunction('Oops, algo salio mal, '
              + error.message
              );
              },
            })
          }
        }
      });
    }
}
