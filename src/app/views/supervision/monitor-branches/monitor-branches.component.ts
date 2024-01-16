import { Component, OnInit } from '@angular/core';
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
  selector: 'app-monitor-branches',
  templateUrl: './monitor-branches.component.html',
  styleUrls: ['./monitor-branches.component.scss']
})
export class MonitorBranchesComponent implements OnInit {
  public list:IReport[]=[];
  public criteria:ICriteria= {
    Name:"view_monitor_bancas",
    Criteria1:'', Criteria2:'', Criteria3:'', Criteria4:'', Criteria5:'', Criteria6:'',
    Criteria7:'', Criteria8:'', Criteria9:'', Criteria10:'', Criteria11:'', Criteria12:'',
  }
  public lotteries=0;winners=0;net=0;recharges=0;invoices=0;others=0;comissions=0;balance=0;balanceOT=0;
  public visible = false; visibleParameters=false; sta = ''; win = false; pag=false; correct=false
  public fileGroups: IGroup[]=[] ;
  public fileVendors: IVendor[]=[] ;
  public fileBranchs: IBranch[]=[] ;
  public listDetail: ITicketDetail[]=[];

  public icons = freeSet;

  public visibleModal = false;
  public visibleTicket = false;
  public form: FormGroup;
  public formTicket: FormGroup;
  public search: string = ''
  public status: string = ''
  public Date1:string=''
  public Date2:string=''
  public Branch:string=''

  public modalTitle: string = ''
  public id: number =0; id2:number=0; id3:number=0;
  public idTimer: number=0;
  public page: any
  public pages : number = 25
  public barra : number =0;

  public Detail: Line[] = [];
  public line: Line;

  dataResult: any = [];
  pipe = new DatePipe('en-US');
  today = new Date();
  changedDate = '';

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
    this.formTicket = new FormGroup({});
    this.reset()
  }

  onclick()
  {
    this.visible = !this.visible
  }

  reset(){
    let hoy=this.service.getToday();
    //hoy='2023-12-14'
    let viejo=hoy
    this.form = new FormGroup({
      date1: new FormControl(viejo),
      date2: new FormControl(hoy),
      group: new FormControl(0),
      vendor: new FormControl(0),
      branch: new FormControl(0),
      activity: new FormControl(0),
    });

    this.id=0;this.visible = false; this.sta = ''; this.win = false; this.pag=false; this.correct=false;
    this.formTicket = new FormGroup({
      serial: new FormControl(''),
      branch: new FormControl(''),
      us: new FormControl(''),
      dateEnter: new FormControl(''),
      winner : new FormControl(false),
      amount: new FormControl(0),
      inBranch: new FormControl(false),
      retention: new FormControl(0),
      note: new FormControl(''),
      prize: new FormControl(0),
      collectDate : new FormControl(''),
      vendor : new FormControl(''),
      status: new FormControl(''),
    });


    this.getAll();
  }

  ngOnInit(): void {
    this.service.getList('GetVendors').subscribe(
      (response) => { this.fileVendors = response["Vendors"]},
      (error) => { console.log(error); });

    this.service.getList('GetGroups').subscribe(
      (response) => { this.fileGroups = response["Groups"] },
      (error) => { console.log(error); });

    this.service.getList('GetBranches').subscribe(
        (response) => { this.fileBranchs = response["Branches"] },
        (error) => { console.log(error); });

    setInterval(() => this.myTimer(), 1000);

  }

  showHide(scores:any) {
    scores.visible = !scores.visible;
  }
  public name: string = '';

  myTimer() {
    this.barra++;
    if (this.barra>=30) {this.barra=0;this.getAll();}
  }

  getAll() {
    // let yoyo = this.service.encriptar('Hola que tal')
    //this.alert.errorAlertFunction(this.service.setRole().toUpperCase())

    this.Date1=this.form.value['date1']
    this.Date2=this.form.value['date2']

   this.lotteries=0;
    this.criteria.Criteria1=this.form.value['date1']
    this.criteria.Criteria2=this.form.value['date2']
    this.criteria.Criteria3=this.form.value['group']
    this.criteria.Criteria4=this.form.value['vendor']
    this.criteria.Criteria5=this.form.value['branch']
    this.criteria.Criteria6=this.form.value['activity']

    this.service.postSearch('searchReport', this.criteria).subscribe(
      (response:any) => { this.list = response["Results"];
      this.lotteries=0;this.winners=0;this.net=0;this.recharges=0;this.invoices=0;this.others=0;this.comissions=0;this.balance=0;this.balanceOT=0;
      for (let item of this.list){
        this.lotteries=this.lotteries+(isNaN(parseFloat(item.Column2))?0:parseFloat(item.Column2))
        this.winners=this.winners+(isNaN(parseFloat(item.Column3))?0:parseFloat(item.Column3))
        this.others=this.others+(isNaN(parseFloat(item.Column7))?0:parseFloat(item.Column7))
        this.comissions=this.comissions+(isNaN(parseFloat(item.Column18))?0:parseFloat(item.Column18))
      };
      this.net=this.lotteries-this.winners;
      this.balance = this.net+this.others-this.comissions;
      this.balanceOT=0.00;
      if (this.lotteries || this.others || this.balance) {
        let tot:any = {
          Column1 : `Totales (${this.list.length})`,
          Column2: this.lotteries,
          Column3: this.winners,
          Column7: this.others,
          Column18: this.comissions,
          Column8: this.balance,
          Column10:'',
          Column11:'',
          Column9:''
        }
        this.list.push(tot)
        }
      },
      (error) => { console.log(error); });
  }

  generatePdf() {
    if (this.list.length > 0) {
      this.dataResult=[]
      let ttitle = document.getElementById("tableTitle");
      let theaders = ttitle.getElementsByTagName("th");
      let columns=theaders.length
      let headers=[]
      for (let i=0; i<columns;i++) {
        headers.push(theaders[i].innerHTML)
      }
      let tRows:any,obj:any,row:any

      if (true){
        // con este codigo toma todos los registros de la data obtenida
        tRows = this.list
        for (let x=0; x<tRows.length; x++) {
          row = tRows[x]
          obj= {};
          for (let i=0; i<columns;i++) {
            obj[headers[i]]= Object.values(row)[i]
          }
          obj.Banca=row.Column1
          obj.Loterias=Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(row.Column2))
          obj.Premios=Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(row.Column3))
          obj.Otros=Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(row.Column7))
          obj.Comisiones=Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(row.Column18))
          obj.Neto=Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(row.Column8))
          obj.Estatus=row.Column10
          obj['Ult. Actividad']=row.Column11
          obj.Cajero=row.Column9
          //console.log(obj)
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
      let title = `Cuadre por Bancas, Del: ${this.form.value['date1']} Al: ${this.form.value['date2']}`
      console.log(headers)
      console.log(this.dataResult)
      console.log(title)
      this.pdfMaker.pdfGenerate(headers, this.dataResult, title);
    } else {
      this.alert.errorAlertFunction(
        '!Oops algo salio mal, el no tienes data para generar PDF.'
      );
    }
  }

  openModal(title: string, vendor:string='1') {
    this.getDetails(vendor);
    this.visibleModal = true;
    this.modalTitle = title
  }

  // openTicket(id: string) {
  //   this.getOne(id);
  //   this.visibleTicket = true;
  //   // this.modalTitle = title
  // }

  getOne(id: any, que:number=0) {
    if (parseInt(id)!=0){
      let data:ITicket;
      this.service.getList('GetTicketById?id='+id).subscribe(
        (response) => {
           data = response["Ticket"];
           this.listDetail = response["Ticket"]['TicketDetail'];
           if (data.Id){
            this.sta = data.Status
            this.win = data.Winner
            this.visible=true;
            // if (que==2)
            // {
            //   this.pag = this.service.theWinner(this.win,this.sta,data.Amount,data.Prize)
            //   if (!this.pag)
            //   {
            //     if     (this.sta=='i') this.alert.errorAlertFunction('Ese Ticket esta Anulado o Inactivo '+data.Status)
            //     else if(this.sta=='P') this.alert.errorAlertFunction('Ese Ticket YA FUE PAGADO!')
            //     else if(this.sta=='N') this.alert.errorAlertFunction('Ese Ticket ESTA ANULADO!!!!')
            //     else if(!this.win) this.alert.errorAlertFunction('Ese Ticket NO ES GANADOR!')
            //   }
            // }
            // else
            // {
            //   this.correct=(this.sta!='P' && !this.pag)
            //   if (this.sta=='P') this.alert.errorAlertFunction('Ese Ticket YA FUE PAGADO!');
            // }
            this.id = data.Id;
            //this.openModal(que==2?'PAGAR TICKET PREMIADO':'Anular / Habilitar Ticket');
            this.visibleTicket=true;
            this.formTicket = new FormGroup({
              serial: new FormControl(data.Serial),
              branch: new FormControl(this.service.theBranch(data.Branch)),
               dateEnter: new FormControl(data.DateEnter),
               winner :  new FormControl(data.Winner),
               inBranch: new FormControl(false),
               retention: new FormControl(0),
               note: new FormControl(''),
               status: new FormControl(data.Status),
               amount: new FormControl(data.Amount),
               prize: new FormControl(data.Prize),
               collectDate :new FormControl(data.CollectDate),
               vendor :new FormControl(this.service.theVendor(data.Vendor)),
            });
          }
          else
          {
            this.alert.errorAlertFunction('Ese Numero de Ticket no Existe');
          }
        },
        (error) => { console.log(error); });
    }
  }


  closeModal() {
    this.visibleModal = false;
    this.id = 0;
    this.status='';
    //this.reset()
    this.getAll()
  }

  closeTicket() {
    this.visibleTicket = false;
//    this.id = 0;
//    this.status='';
    //this.reset()
//    this.getAll()
  }

  getNumberValue(page: any){
    this.pages = page.target.value;
  }

  getStatus(status: any){
    this.status = status.target.value;
  }

  getColor(value:any){
    return value <0 ? 'red' : 'black';
  }

  block(id:any) {
    let data = this.fileBranchs.filter((item: any) => item.Id == id);
    let obj: IBranch;
    obj = data[0];
    this.alert
      .validationAlertFunction(
        (obj.Status=='i')?'Quieres HABILITAR esta Caja':'¿Quieres BLOQUEAR esta Caja?',
        'Si, Cambiar'
      )
      .then((res) => {
        if (res.isConfirmed) {
          obj.Status=obj.Status=='i'?'':'i';
          this.service.postItem('SaveBranch',obj).subscribe({
            next: (response: any) => {
              this.alert.successAlertFunction('Proceso creado correctamente');
              this.getAll()
            },
            error: (error: any) => {
              this.alert.errorAlertFunction(
                'Oops, algo salio mal, valide que todos los campos esten llenos.'
              );
            },
          })
          this.alert.successAlertFunction('Caja Cambiada');
        }
      });
  }


  getDetails(vendor:string='1') {
    let obj:any = {
        Date1: this.Date1,
        Date2: this.Date2,
        Vendor: vendor,
    };
    this.service.postItem( 'RequestCollect',obj).subscribe({
      next: (response: any) => {
        let id2=response['ResposeCode']
        let mss=response['ResposeDescription']
        this.responseGetAll([response]);
      },
      error: (error: any) => {
        this.alert.errorAlertFunction(
          'Oops, algo salio mal, no fue posible registrar.'
        );
      },
    })
  }

responseGetAll(data: any) {
    this.Detail = [];
    let recollect = data[0].ReCollects;
    this.Branch=this.service.theBranch(recollect[0].Branch);
    if (data[0].ResposeDescription == 'OK') {
        if (recollect[0].RechargesList) {
            this.Detail.push({Column1: 'RECARGAS TELEFONICAS',Column4: 'E',})
            this.Detail.push({Column1: 'Operador',Column2: 'Comision',Column3: 'Monto',Column4: 'S',})
            recollect[0].RechargesList.forEach((element: any) => {
                this.Detail.push({Column1: element.Provider,Column2: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(element.Comission),Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(element.Amount),Column4: 'D',})
            });
            this.setLine();
            this.Detail.push({Column1: 'RESUMEN DE RECARGAS',Column4: 'E',})
            this.Detail.push({Column1: 'Venta:',Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(recollect[0].RechargesSum[0].Amount),Column4: 'D',})
            this.Detail.push({Column1: 'Anulaciones:',Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(recollect[0].RechargesSum[0].Voids),Column4: 'D',})
            this.Detail.push({Column1: 'Comision:',Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(recollect[0].RechargesSum[0].Comission),Column4: 'D',})
            let final = parseFloat(recollect[0].RechargesSum[0].Final);
            this.Detail.push({Column1: final < 0 ? 'Perdida:' : 'Ganancias:',Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(final),Column4: 'D',})
            this.setLine();
        }
        if (recollect[0].PrizesList) {
            this.Detail.push({Column1: 'TICKETS GANADORES',Column4: 'E',})
            this.Detail.push({Column1: 'Ticket', Column2: 'Fecha',Column3: 'Monto',Column4: 'S',})
            recollect[0].PrizesList.forEach((element: any) => {this.Detail.push({Column1: element.Serial,Column2: element.DateEnter,Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(element.Prize),Column4: 'G',})});
            this.setLine();
        }

        this.Detail.push({Column1: 'RESUMEN DE LOTERIA',Column4: 'E',})
        this.Detail.push({Column1: 'Venta:',Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(recollect[0].TicketsSum[0].Amount),Column4: 'D',})
        this.Detail.push({Column1: 'Anulaciones:',Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(recollect[0].TicketsSum[0].Voids),Column4: 'D',})
        this.Detail.push({Column1: 'Comision:',Column2: '',Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(recollect[0].TicketsSum[0].Comission),Column4: 'D',})
        this.Detail.push({Column1: 'Venta Neta:',Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(recollect[0].TicketsSum[0].Net),Column4: 'D',})
        this.Detail.push({Column1: 'Ganadores:',Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(recollect[0].TicketsSum[0].Winners),Column4: 'D',})
        let final = parseFloat(recollect[0].TicketsSum[0].Final);
        this.Detail.push({Column1: final < 0 ? 'Perdida:' : 'Ganancias:',Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(final),Column4: 'D',})
        this.setLine();

        this.Detail.push({Column1: '** RESUMEN TOTAL **',Column4: 'E',})
        this.Detail.push({Column1: 'Venta:',Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(recollect[0].Totals[0].Amount),Column4: 'D',})
        this.Detail.push({Column1: 'Comision:',Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(recollect[0].Totals[0].Comission),Column4: 'D',})
        this.Detail.push({Column1: 'Venta Neta:',Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(recollect[0].Totals[0].Net),Column4: 'D',})
        this.Detail.push({Column1: 'Ganadores:',Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(recollect[0].Totals[0].Winners),Column4: 'D',})
        final = parseFloat(recollect[0].Totals[0].Final);
        this.Detail.push({Column1: final < 0 ? 'Perdida:' : 'Ganancias:',Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(final),Column4: 'D',})
        this.setLine();

        this.Detail.push({Column1: 'Total PAGADOS:',Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(recollect[0].TotalPaids),Column4: 'D',})
        this.Detail.push({Column1: 'Faltantes:',Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(recollect[0].Missing),Column4: 'D',})
        this.Detail.push({Column1: 'MONTO EN CAJA:',Column3: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(recollect[0].Box),Column4: 'D',})
    }
}

setLine(){
    this.Detail.push({ Column1: '', Column2: '', Column3: '', Column4: 'D' });
}


}
