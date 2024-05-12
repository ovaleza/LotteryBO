import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { IRecharge } from 'src/app/models/master.models';

@Component({
  selector: 'app-recharge-balance',
  templateUrl: './recharge-balance.component.html',
  styleUrls: ['./recharge-balance.component.scss']
})
export class RechargeBalanceComponent implements OnInit {
  public option: string = '0';
  public list:IRecharge[]=[];
  public icons = freeSet;
  public visible = false;
  public form!: FormGroup | FormGroup;
  public search: string = ''
  public balance: number = 1234567.89
  public modalTitle: string = ''
  public id: number = 0
  public page: any
  public pages : number = 50

  constructor(private alert: AlertService, private service: MasterService) {
    this.setform()
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
    });
  }

  ngOnInit(): void {
      this.getAll()
  }

  getAll(){
    this.page=1;
    this.service.getList('GetRecharges').subscribe(
	    (response) => { this.list = response["Recharges"]; },
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


  getOne(id: any) {
    if (parseInt(id)!=0){
      let data = this.list.filter((item: any) => item.Serial == id);
      if (data[0]){
        this.id = id;
        this.openModal('Anular / Habilitar RECARGAS');
        this.form = new FormGroup({
          serial: new FormControl(data[0].Serial),
          branch: new FormControl(this.service.theBranch(data[0].Branch)),
          dateEnter: new FormControl(data[0].DateEnter),
          provider: new FormControl(this.service.theProvider(data[0].Provider)),
          phoneNumber: new FormControl(data[0].PhoneNumber),
          plan: new FormControl(data[0].Plan),
          amount: new FormControl(data[0].Amount),
          status: new FormControl(data[0].Status),
        });
      }
      else
      {
        this.alert.errorAlertFunction('Ese Numero de RECARGA no Existe');
      }
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
      this.service.postItem('VoidRecharge',obj).subscribe({
        next: (response: any) => {
        if (response.Recharge.Id.toString()=='0')
          {
              this.alert.errorAlertFunction('Oops, algo salio mal, el ID = '
              + response.Recharge.Id);
          }
        else {
          this.alert.successAlertFunction('Bien, Id: '+response.Recharge.Id.toString());
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
