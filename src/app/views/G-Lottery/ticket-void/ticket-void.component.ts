import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { ITicket, ITicketDetail, ITransaction, IGroup, IVendor, IBranch, IReport, ICriteria } from 'src/app/models/master.models';

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

  public page: any
  public pages : number = 25
  ReadMore:boolean = true
  public isAdm : boolean=false;
  public isOff : boolean=false;
  public isDay : boolean=false;
  public isOwn : boolean=false;

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

  getAll() {
     this.isAdm=this.service.setAdm()
     this.isOff=this.service.setRole()=='OFICINA'
     this.isOwn=this.service.setRole()=='ADMIN'
     let day=this.formParameters.value['date1']
     this.isDay=(this.isAdm || this.isOwn || (this.service.setDayEnabled(day) && this.isOff));

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
          Winner : item.Column7=="True",
          Prize : parseFloat(item.Column8),
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


  getOne(id: any, que:number=0) {
    if (parseInt(id)!=0){
      let data:ITicket;
      this.service.getList('GetTicketBySerial?serial='+id).subscribe(
        (response) => {
           data = response["Ticket"];
           this.listDetail = response["Ticket"]['TicketDetail'];
           if (data.Id){
            this.sta = data.Status
            this.win = data.Winner
            this.visible=true;
            if (que==2)
            {
              this.pag = this.service.theWinner(this.win,this.sta,data.Amount,data.Prize)
              if (!this.pag)
              {
                if     (this.sta=='i') this.alert.errorAlertFunction('Ese Ticket esta Anulado o Inactivo '+data.Status)
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
            this.id = data.Id;
            this.openModal(que==2?'PAGAR TICKET PREMIADO':'Ver / Anular / Habilitar Ticket');
            this.form = new FormGroup({
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

  void() {
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
        if (!response.Ticket.Id || response.Ticket.Id.toString()=='0' )
          {
              this.alert.errorAlertFunction('Oops, algo salio mal, el ID = '
              + obj.Serial);
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

  pay() {
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

}
