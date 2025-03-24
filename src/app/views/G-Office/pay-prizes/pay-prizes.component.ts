import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { ITicket, ITransaction, ITicketDetail } from 'src/app/models/master.models';

@Component({
  selector: 'app-pay-prizes',
  templateUrl: './pay-prizes.component.html',
  styleUrls: ['./pay-prizes.component.scss']
})
export class PayPrizesComponent implements OnInit {
  public option: string = '0';
  public list:ITicketDetail[]=[];
  public icons = freeSet;
  public visible = false; correct = false; sta = ''; win=false
  public form!: FormGroup | FormGroup;
  public search: string = ''
  public modalTitle: string = ''
  public id: number = 0
  public page: any
  public pages : number = 50

  constructor(private alert: AlertService, public service: MasterService) {
    this.setform()
  }

  setform() {
    this.form = new FormGroup({
      serial: new FormControl(''),
      branch: new FormControl(''),
      us: new FormControl(''),
      dateEnter: new FormControl(''),
      winner : new FormControl(false),
      amount: new FormControl(0),
      status: new FormControl(''),
      inBranch: new FormControl(false),
      retencion: new FormControl(0),
      note: new FormControl(''),
      prize:  new FormControl(0),
    });
  }

  ngOnInit(): void {
      this.getAll()
  }

  getAll(){

  }

  openModal(title: string) {
    this.visible = true;    this.correct = false;
    this.modalTitle = title
  }

  closModal() {
    this.visible = false; this.correct=false
    this.id = 0;
    this.form.reset()
    this.setform();
  }

  getNumberValue(page: any){
    this.pages = page.target.value;
  }


  getOne(id: any) {
    if (parseInt(id)!=0){
      let data:ITicket;
      this.service.getList('GetTicketBySerial?serial='+id).subscribe(
        (response) => {
          console.log(response)
           data = response["Ticket"];
           this.list = response["Ticket"]['TicketDetail'];
           if (data.Id){
            this.id = data.Id;
            this.form = new FormGroup({
              serial: new FormControl(data.Serial),
              branch: new FormControl(this.service.theBranch(data.Branch)),
               dateEnter: new FormControl(data.DateEnter),
               winner :  new FormControl(data.Winner),
               status: new FormControl(data.Status),
               amount: new FormControl(data.Amount),
               prize: new FormControl(data.Prize),
            });
            this.sta = data.Status
            this.win = data.Winner.toString()=='True'
            this.visible=true;this.correct=false
            if (this.sta=='' && this.win==true)
              {this.correct=this.win}
            else
              {
              if     (this.sta=='i') this.alert.errorAlertFunction('Ese Ticket esta Anulado o Inactivo '+data.Status)
              else if(this.sta=='P') this.alert.errorAlertFunction('Ese Ticket YA FUE PAGADO!')
              else if(this.sta=='N') this.alert.errorAlertFunction('Ese Ticket ESTA ANULADO!!!!')
              else if(!this.win) this.alert.errorAlertFunction('Ese Ticket NO ES GANADOR!')
              }
          }
          else
          {
            this.closModal()
            this.alert.errorAlertFunction('Ese Numero de Ticket no Existe');
          }
        },
        (error) => { console.log(error); });
    }
  }

  add() {
    this.alert
      .validationAlertFunction(
        '¿Realmente quiere Pagar este Ticket?',
        'Si, Pagar'
      )
      .then((res) => {
        if (res.isConfirmed) {
          if(this.form.valid && this.id!=0){
            let obj: ITransaction;
            obj = {
              Id: this.id,
              Cia:0,
              Us : '',
              Branch:0,
              Type: 'PP',
              Serial: this.form.value['serial'],
              Amount: this.form.value['amount'],
              Retention : this.form.value['retention'],
              Note: this.form.value['note'],
              DateEnter: this.form.value['dateEnter'],
              Antipodal: this.form.value['antipodal'],
              Status: this.form.value['status'],
              ResponseDescription: '',
              HasError: false
            };
            this.service.postItem('PayTicket?serial='+obj.Serial,obj).subscribe({
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
