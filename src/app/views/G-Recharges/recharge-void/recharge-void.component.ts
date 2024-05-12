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

@Component({
  selector: 'app-recharge-void',
  templateUrl: './recharge-void.component.html',
  styleUrls: ['./recharge-void.component.scss']
})
export class RechargeVoidComponent implements OnInit {
  public option: string = '0';
  public list:IRecharge[]=[];
  public list2:IReport[]=[];
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
  public visible = false; visibleParameters=false; public sta = ''; public win = false; public correct=false
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
  dataResult: any = [];
  sort=true;

  public balanceOT: number = 0.00

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
    let refClient=this.getNewReferenciaCliente();
    this.service.getRechargeBalance(refClient).subscribe(
        (res) => {
            this.responseGetRechargeBalance(res);
        },
        (error: any) => {
          this.balanceOT =0;
           //this.alert.errorAlertFunction("para obtener saldo para recargas ---"+error);
        }
    );
}

responseGetRechargeBalance(data: any) {
  this.balanceOT =data.Saldo.saldo;
  if (data.Saldo.saldo < 1000) {
    //this.alert.soloAlert('Recargar lo antes posible, tu balance es esta en el minimo!!!');
  }
}

sortList() {
  this.sort=!this.sort
  if (!this.sort)
    this.list.sort((a, b) => b.Id-a.Id)
  else
  this.list.sort((a, b) => a.Id-b.Id)
}

exportToExcel(): void {
  this.excelService.generateExcel(this.list, 'user_data');
}

getNewReferenciaCliente(){
  var date: any = new Date()
  date = date.getFullYear().toString() +
  (date.getMonth() + 1).toString().padStart(2, '0') +
  date.getDate().toString().padStart(2, '0')+
  date.getSeconds().toString().padStart(2, '0')+
  date.getUTCMilliseconds().toString().padStart(2, '0')
  let huella='001';
  if (huella.length>3) huella=huella.substring(0,3);
  return date+huella
}

  getAll(){
    this.page=1;
    this.sort=true;
    this.getRechargeBalance();
    this.isAdm=this.service.setAdm()
    this.isOff=this.service.setRole()=='OFICINA'
    this.isOwn=this.service.setRole()=='ADMIN'
    let day=this.formParameters.value['date1']
    this.isDay=(this.isAdm || this.isOwn || (this.service.setDayEnabled(day) && this.isOff));
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
        Couumn4: item.Column4,
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
    if (this.list.length > 0) {

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
      let title = `Listado Recargas, Del: ${this.formParameters.value['date1']} Al: ${this.formParameters.value['date2']} (${activities[this.formParameters.value['activity']]})`
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
        '¿Realmente quiere Alterar esta Recarga?',
        'Si, Alterar'
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
