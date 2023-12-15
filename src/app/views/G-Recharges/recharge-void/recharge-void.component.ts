import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { IRecharge, IReport, ICriteria, IGroup, IVendor, IBranch } from 'src/app/models/master.models';

@Component({
  selector: 'app-recharge-void',
  templateUrl: './recharge-void.component.html',
  styleUrls: ['./recharge-void.component.scss']
})
export class RechargeVoidComponent implements OnInit {
  public option: string = '0';
  public list:IRecharge[]=[];
  public list2:IReport[]=[];
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
  public pages : number = 25
  ReadMore:boolean = true
  public isAdm : boolean=false;
  public isOff : boolean=false;
  public isDay : boolean=false;
  public isOwn : boolean=false;

  public balance: number = 0.00

  constructor(private alert: AlertService, public service: MasterService) {
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

  getAll(){
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
    this.service.postSearch('searchReport', this.criteria).subscribe(
      (response:any) => { this.list2 = response["Results"];
      let tAmount=0,tPrize=0
      for (let item of this.list2){
       let obj: any;
       obj = {
         Branch: item.Column1,
         DateEnter: item.Column2,
         Serial: item.Column3,
         PhoneNumber: item.Column4,
         Provider: item.Column5,
         Amount: parseFloat(item.Column6),
         Vendor: item.Column7,
         Status: item.Column8,
         Group:item.Column9,
         ResponseDescription: '',
         HasError: false
       };
       if (obj.Status.toUpperCase()!='N' && obj.Status.toUpperCase()!='I') {
        tAmount += parseFloat(item.Column6);
        //tPrize  += parseFloat(item.Column8);
      }
       this.list.push(obj)
      };
      if (tAmount || tPrize) {
        let tot:any = {
         Status: '',
         Branch : '*Totales*',
         Amount: tAmount,
        //  Prize: tPrize,
       }
       this.list.push(tot)
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
            this.visible=true;this.correct=(this.sta!='P')
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
        if (response.Recharge.Id.toString()=='0')
          {
              this.alert.errorAlertFunction('Oops, algo salio mal, el ID = '
              + obj.Serial);
          }
        else {
          this.alert.successAlertFunction('Bien, Id: '+obj.Serial);
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
}
