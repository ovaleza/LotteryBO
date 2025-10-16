import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { ITicket, ITicketDetail, ITransaction, IGroup, IVendor, IBranch, IReport, ICriteria } from 'src/app/models/master.models';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DatePipe, UpperCasePipe } from '@angular/common';
import { PdfService } from 'src/app/services/pdf.service';

import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-ticket-void',
  templateUrl: './ticket-void.component.html',
  styleUrls: ['./ticket-void.component.scss']
})
export class TicketVoidComponent implements OnInit {
  public option: string = '0';
  public listDetail:ITicketDetail[]=[];
  public list:ITicket[]=[];
  public list2:IReport[]=[];
  public listPdf:IReport[]=[];
  public criteria:ICriteria= {
    Name:"view_tickets",
    Criteria1:'', Criteria2:'', Criteria3:'', Criteria4:'', Criteria5:'', Criteria6:'',
    Criteria7:'', Criteria8:'', Criteria9:'', Criteria10:'', Criteria11:'', Criteria12:'',
  }
  public fileGroups: IGroup[]=[] ;
  public fileVendors: IVendor[]=[] ;
  public fileBranchs: IBranch[]=[] ;

  public icons = freeSet;
  public id=0;visible = false; visibleParameters=false; sta = ''; win = false; pag=false; correct=false
  public form!: FormGroup | FormGroup;
  public formParameters!: FormGroup | FormGroup;
  public search: string = ''
  public modalTitle: string = ''
  public color1='red'
  public color2='green'
  public datePaid=''
  public usPaid=''
  public dateNull=''
  public usNull=''

  public page: any
  public pages : number = 50
  ReadMore:boolean = true
  public isAdm : boolean=false;
  public isOff : boolean=false;
  public isDay : boolean=false;
  public isOwn : boolean=false;
  public notNull: boolean=false;
  public notPay: boolean=false;
  public voidEnabled: boolean = (localStorage.getItem('vtick')=='True');
  public payEnabled: boolean =(localStorage.getItem('ptick')=='True');
  dataResult: any = [];
  sort=true;

  constructor(
    private excelService: ExcelService,
    private alert: AlertService,
    public service: MasterService,
    private pdfMaker: PdfService
    ) {
    this.setform()
    this.setformParameters()
  }

  setdate1(d1:any=new Date(),d2:any=new Date()) {
    if (d1>d2)this.formParameters.controls['date1'].setValue(d2)
  }

  setdate2(d1:any=new Date()) {
    this.formParameters.controls['date2'].setValue(d1)
  }


  reset(){
    this.setformParameters()
    this.getAll();
  }

  setform() {
    this.id=0;this.visible = false; this.sta = ''; this.win = false; this.pag=false; this.correct=false;
    this.form = new FormGroup({
      id: new FormControl(0),
      serial: new FormControl(''),
      serialShow:new FormControl(''),
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
    const input:HTMLElement | null  = document.getElementById("search");
    const btn:HTMLElement | null  = document.getElementById("btnSearch");
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

  sortList() {
    this.sort=!this.sort
    if (!this.sort)
      this.list.sort((a, b) => b.Id-a.Id)
    else
    this.list.sort((a, b) => a.Id-b.Id)
  }

  exportToExcel(): void {
    let ttitle = document.getElementById("tableTitle") as HTMLElement;
    let theaders = ttitle.getElementsByTagName("th");
    let columns=theaders.length
    let headers:string[] =[]
    for (let i=0; i<columns;i++) {
      headers.push(theaders[i].innerHTML)
    }
    this.excelService.generateExcel(this.listPdf, 'Listado_Tickets',headers);
  }


  getAll(){
     this.page=1;
     this.isAdm=this.service.setAdm()
     this.isOff=this.service.setRole()=='OFICINA'
     this.isOwn=this.service.setRole()=='ADMIN'
     let day=this.formParameters.value['date1']
     this.isDay=(this.isAdm || (this.service.setDayEnabled(day) && (this.isOff || this.isOwn)));
     if (!this.isOwn && !this.isAdm) this.isDay=this.voidEnabled;
     this.notPay=(!this.isOwn && !this.isAdm && !this.payEnabled)
     this.criteria.Criteria1=this.formParameters.value['date1']
     this.criteria.Criteria2=this.formParameters.value['date2']
     this.criteria.Criteria3=this.formParameters.value['group']
     this.criteria.Criteria4=this.formParameters.value['vendor']
     this.criteria.Criteria5=this.formParameters.value['branch']
     this.criteria.Criteria6=this.formParameters.value['activity']
     this.list=[];
     this.listPdf=[];
     this.list2=[];
     this.service.postSearch('searchReport', this.criteria).subscribe((response:any) => { this.list2 = response["Results"];
      let tAmount=0,tPrize=0
      let x=0;
      this.list=[];
      for (let item of this.list2){
        x++
        let obj: any;
        let obj2: any;
        obj = {
          Id:item.Column10,
          Branch: item.Column1,
          DateEnter: item.Column2,
          Serial: item.Column3,
          Amount: parseFloat(item.Column4),
          Vendor: item.Column5,
          Status: item.Column6,
          Winner : item.Column7=="True",
          Prize : parseFloat(item.Column8),
          Group:item.Column9,
        };
        obj2 = {
          Column1: item.Column2,
          Column2: item.Column1,
          //Column3: this.isOff?item.Column10:item.Column3,
          Column3: item.Column10,
          Column4: item.Column4,
          Column5: item.Column5,
          Column6: this.service.theStatus(item.Column6),
          // Winner : item.Column7=="True",
          Column7 : item.Column8,
          Column8 : '',
          Column9 : item.Column9
        };
        //obj2.Column4=Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(obj2.Column4))
        //obj2.Column7=Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(obj2.Column7))
        if (obj.Status.toUpperCase()!='N' && obj.Status.toUpperCase()!='I') {
          tAmount += parseFloat(item.Column4);
          tPrize  += parseFloat(item.Column8);
        }
        this.list.push(obj)
        this.listPdf.push(obj2)
      }
      this.listPdf.sort((a, b) => a.Column9.localeCompare(b.Column9) || a.Column2.localeCompare(b.Column2) );
      if (tAmount || tPrize) {
        let tot:any = {
          Status: '',
          Branch : `Totales (${this.list.length})`,
          Amount: tAmount,
          Prize: tPrize,
        }
        let tot2:any = {
          Column1 : `Totales (${this.list.length})`,
          Column2 : '',
          Column3 :'',
          Column4 : Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tAmount),
          Column5: '',
          Column6 : '',
          Column7: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tPrize),
          Column8: '',
          Column9: '',
          Column10: '',
        }


        let listBlank:any = {
          Column1 : '.',
          Column2 : '',
          Column3 :'',
          Column4 : '',
          Column5: '',
          Column6 : '',
          Column7: '',
          Column8: '',
          Column9: '',
          Column10: '',
        }

        tAmount=0;tPrize=0
        this.list.push(tot)
        let newListPdf = this.listPdf, sl=0;
        this.listPdf=[];
        let mg=newListPdf[0].Column9;
        for (let item of newListPdf){
          if (item.Column9!=mg){
            let subTot:any = {
              Column1 : '',
              Column2 : '',
              Column3 :'',
              Column4 : '',
              Column5: '',
              Column6 : '',
              Column7: '',
              Column8: '',
              Column9: '',
              Column10: '',
            }
            subTot.Column1 =mg.toString()+`(${sl})`
            subTot.Column4 =Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tAmount)
            subTot.Column7 =Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tPrize)
            this.listPdf.push(subTot)
            this.listPdf.push(listBlank)

            tAmount=0;tPrize=0;sl=0
            mg=item.Column9
          }
          sl++
          tAmount += parseFloat(item.Column4);
          tPrize  += parseFloat(item.Column7);
        item.Column4=Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(item.Column4))
        item.Column7=Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(item.Column7))

          // console.log(item.Column7)
          this.listPdf.push(item)
        }
        let subTot:any = {
          Column1 : '',
          Column2 : '',
          Column3 :'',
          Column4 : '',
          Column5: '',
          Column6 : '',
          Column7: '',
          Column8: '',
          Column9: '',
          Column10: '',
        }
        subTot.Column1 =mg+`(${sl})`
        subTot.Column4 =Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tAmount)
        subTot.Column7 =Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tPrize)
        this.listPdf.push(subTot)
        this.listPdf.push(listBlank)

        this.listPdf.push(tot2)
        // console.log(this.listPdf)
      }
     },
       (error) => { console.log(error); });
  }

  openModal(title: string) {
    this.visible = true;
    this.modalTitle = title
  }

  closModal() {
    this.form.reset()
    this.setform();
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
      let activities=['Todos','Ganadores','Anulados','NO PAGADOS']
      let headers=[]
      for (let i=0; i<columns;i++) {
        if (i!=3 || this.isOff )
          {
            headers.push(theaders[i].innerHTML)
          }
      }
      console.log(headers)
       headers.push('Grupo')
       columns++
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
          obj.Grupo = row.Column9
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
      let title = `Listado Tickets Seleccionados, Del: ${this.formParameters.value['date1']} Al: ${this.formParameters.value['date2']} (${activities[this.formParameters.value['activity']]})`
      this.pdfMaker.pdfGenerate(headers, this.dataResult, title);
    } else {
      this.alert.errorAlertFunction(
        '!Oops algo salio mal, el no tienes data para generar PDF.'
      );
    }
  }

  getOne(id: any, que:number=0) {
    if (parseInt(id)!=0){
      let data:ITicket;
      this.service.getList('GetTicketBySerial?serial='+id).subscribe(
        (response) => {
           data = response["Ticket"];
           this.listDetail = response["Ticket"]['TicketDetail'];
           if (data.Id){
            this.sta = data.Status
            this.win = data.Winner==null?false:data.Winner.toString().toUpperCase()=='TRUE'
            this.datePaid=data.DatePaid
            this.usPaid=data.UsPaid
            this.dateNull=data.DateNull
            this.usNull=data.UsNull

            this.visible=true;
            this.pag = this.service.theWinner(this.win,this.sta,data.Amount,data.Prize)
            this.correct=false;
            if (que==2)
            {
              //this.pag = this.service.theWinner(this.win,this.sta,data.Amount,data.Prize)
              if (!this.pag)
              {
                if (this.sta.toUpperCase()=='I') this.alert.errorAlertFunction('Ese Ticket esta Anulado o Inactivo '+data.Status)
                else if(this.sta=='P') this.alert.errorAlertFunction('Ese Ticket YA FUE PAGADO!')
                else if(this.sta=='N') this.alert.errorAlertFunction('Ese Ticket ESTA ANULADO!!!!')
                else if(!this.win) this.alert.errorAlertFunction('Ese Ticket NO ES GANADOR!')
              }
            }
            else
            {
              this.correct=(this.sta!='P' && !this.pag)
              if (this.sta=='P') this.alert.errorAlertFunction('Ese Ticket YA FUE PAGADO!');
            }
            if (this.notPay) this.pag=false;
            this.notNull=(!this.correct || !this.isDay || (this.win && !this.isAdm))
            this.id = data.Id;
            this.openModal(que==2?'PAGAR TICKET PREMIADO':'Ver / Anular / Habilitar Ticket');
            this.form = new FormGroup({
              serial: new FormControl(data.Serial),
              id: new FormControl(data.Id),
              serialShow: new FormControl(this.isOff?data.Id:data.Serial),
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

  void() {
    this.alert
      .validationAlertFunction(
        '¿Realmente quiere Modificar este Ticket?',
        'Si, Modificar'
      )
      .then((res) => {
        if (res.isConfirmed) {
//          this.alert.successAlertFunction('Aqui estan los detalles...');
          if(this.form.valid && this.id!=0){
            let obj: ITicket;
            obj = {
              Id: this.id,
              Cia:0,
              Us : '',
              Amount: this.form.value['amount'],
              Serial: this.form.value['serial'],
              Branch: this.form.value['branch'],
              DateEnter: this.form.value['dateEnter'],
              Winner : this.form.value['winner'],
              Prize : this.form.value['prize'],
              Status: this.form.value['status'],
              ResponseDescription: '',
              HasError: false
            };
            // this.alert.soloAlert(obj.Serial);
            this.service.postItem('VoidTicket?serial='+obj.Serial,obj).subscribe({
              next: (response: any) => {
                //console.log(response)
              if (!response.Ticket.Id || response.Ticket.Id.toString()=='0' )
                {
                  this.alert.errorAlertFunction(response['ResposeDescription']);
                    // this.alert.errorAlertFunction('Oops, algo salio mal, el ID = '
                    // + obj.Serial);
                }
              else {
                this.alert.successAlertFunction('Bien, Id: '+obj.Serial.toString());
                //this.search='';
                this.getAll();
                this.closModal();}
              } ,
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

  pay() {
    this.alert
      .validationAlertFunction(
        '¿Realmente quiere Pagar este Ticket?',
        'Si, Pagar'
      )
      .then((res) => {
        if (res.isConfirmed) {
//          this.alert.successAlertFunction('Aqui estan los detalles...');
          if(this.form.valid && this.id!=0){
            let obj: ITransaction;
            obj = {
              Id: this.id,
              Cia:0,
              Us : '',
              Branch:0,
              Type: 'PP',
              Serial: this.form.value['serial'],
              Amount: this.form.value['prize'],
              Retention : this.form.value['retention'],
              Note: this.form.value['note'],
              DateEnter: this.form.value['dateEnter'],
              Antipodal: this.form.value['inBranch'],
              Status: this.form.value['status'],
              ResponseDescription: '',
              HasError: false
            };
            this.service.postItem('PayTicket',obj).subscribe({
            //this.service.postItem('PayTicket?serial='+obj.Serial,obj).subscribe({
      //      this.service.postItem('PayTicket',obj.Serial).subscribe({
              next: (response: any) => {
              let Tid=response.Transaction.Id.toString()
              if (Tid=='0')
                {
                    this.alert.errorAlertFunction('Oops, algo salio mal, el ID = '
                    + Tid);
                }
              else {
                this.alert.successAlertFunction('Bien, Id: '+obj.Serial);
                this.search='';
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
