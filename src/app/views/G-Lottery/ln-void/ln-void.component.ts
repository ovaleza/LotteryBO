import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { IInvoice,ITicket, ITicketDetail, ITransaction, IGroup, IVendor, IBranch, IReport, ICriteria } from 'src/app/models/master.models';

@Component({
  selector: 'app-ln-void',
  templateUrl: './ln-void.component.html',
  styleUrls: ['./ln-void.component.scss']
})
export class LNVoidComponent implements OnInit {
  public option: string = '0';
  public list:IInvoice[]=[];
  public list2:IReport[]=[];
  public criteria:ICriteria= {
    Name:"view_invoices",
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


  public page: any
  public pages : number = 25
  ReadMore:boolean = true

  constructor(private alert: AlertService, public service: MasterService) {
    this.setform()
    this.setformParameters()
  }

  reset(){
    this.setformParameters()
    this.getAll();
  }

  setform() {
    this.id=0;this.visible = false; this.sta = ''; this.win = false; this.pag=false; this.correct=false;
    this.form = new FormGroup({
      serial: new FormControl(''),
      type: new FormControl(''),
      branch: new FormControl(''),
      reference : new FormControl(''),
      us: new FormControl(''),
      provider : new FormControl(0),
      dateEnter: new FormControl(''),
      winner : new FormControl(false),
      status: new FormControl(''),
      amount:  new FormControl(0),
      collectDate :new FormControl(''),
      vendor :new FormControl(''),
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

  getAll() {
    this.criteria.Criteria1=this.formParameters.value['date1']
    this.criteria.Criteria2=this.formParameters.value['date2']
    this.criteria.Criteria3=this.formParameters.value['group']
    this.criteria.Criteria4=this.formParameters.value['vendor']
    this.criteria.Criteria5=this.formParameters.value['branch']
    this.criteria.Criteria6=this.formParameters.value['activity']
    this.list=[];
    this.service.postSearch('searchReport', this.criteria).subscribe(
      (response:any) => { this.list2 = response["Results"];
      for (let item of this.list2){
       let obj: any;
       obj = {
         Branch: item.Column1,
         DateEnter: item.Column2,
         Serial: item.Column3,
         Amount: parseFloat(item.Column4),
         Vendor: item.Column5,
         Status: item.Column6,
        //  Winner : item.Column7=="True",
        //  Prize : parseFloat(item.Column8),
         Group:item.Column9,
         ResponseDescription: '',
         HasError: false
       };
       this.list.push(obj)
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


  getOne(id: any) {
    if (parseInt(id)!=0){
      let data:IInvoice;
      this.service.getList('GetInvoiceBySerial?serial='+id).subscribe(
        (response) => {
           data = response["Invoice"];
           if (data.Id){
            if (data.Type!='LL') {this.alert.errorAlertFunction('Serie no es de Billete LN!, es del tipo: '+data.Type); return}
            this.sta = data.Status
            this.win = data.Winner
            this.visible=true;this.correct=(this.sta!='P')
            if (!this.correct) this.alert.errorAlertFunction('Ese Ticket YA FUE PAGADO!');
            this.id = data.Id;
            this.openModal('Anular / Habilitar Billete LN');
            this.form = new FormGroup({
              serial: new FormControl(data.Serial),
              type: new FormControl(data.Type),
              branch: new FormControl(this.service.theBranch(data.Branch)),
              provider: new FormControl(this.service.theProvider(data.Provider)),
              reference: new FormControl(data.Reference),
               dateEnter: new FormControl(data.DateEnter),
               winner :  new FormControl(data.Winner),
               status: new FormControl(data.Status),
               amount: new FormControl(data.Amount),
               collectDate :new FormControl(data.CollectDate),
               vendor :new FormControl(this.service.theVendor(data.Vendor)),
            });
           // this.alert.soloAlert(data.Vendor?.toString())
          }
          else
          {
            //this.closModal()
            this.alert.errorAlertFunction('Ese Numero de Billete LN no Existe');
          }
        },
        (error) => { console.log(error); });
    }
  }

  add() {
    this.alert
      .validationAlertFunction(
        '¿Realmente quiere Alterar esta Factura?',
        'Si, Alterar'
      )
      .then((res) => {
        if (res.isConfirmed) {
          if(this.form.valid && this.id!=0){
            let obj: IInvoice;
            obj = {
              Id: this.id,
              Cia:0,
              Us : '',
              Amount: this.form.value['amount'],
              Serial: this.form.value['serial'],
              Type: this.form.value['type'],
              Branch: this.form.value['branch'],
              Reference: this.form.value['reference'],
              DateEnter: this.form.value['dateEnter'],
              Winner : this.form.value['winner'],
              Provider: this.form.value['provider'],
              Status: this.form.value['status'],
              ResponseDescription: '',
              HasError: false
            };
            this.service.postItem('VoidInvoice?serial='+obj.Serial,obj).subscribe({
              next: (response: any) => {
              if (response.Invoice.Id.toString()=='0')
                {   this.alert.errorAlertFunction('Oops, algo salio mal, el ID = '
                    + obj.Serial);
                }
              else {
                this.alert.successAlertFunction('Bien, Id: '+obj.Serial.toString());
                //this.search='';
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
