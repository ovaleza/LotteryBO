import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { IBranch, ITerminal, IGroup } from 'src/app/models/master.models';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  public list:IGroup[]=[];
  public icons = freeSet;
  public visible = false;
  public form: FormGroup;
  public search: string = ''
  public status: string = ''
  public modalTitle: string = ''
  public id: number = 0
  public page: any
  public pages : number = 50

  constructor(private alert: AlertService , private service: MasterService) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      userMaster: new FormControl(''),
      phone: new FormControl(''),
      email: new FormControl(''),
      saleYes: new FormControl(0),
      saleLimiter: new FormControl(0),
      saleMax: new FormControl(0),
      planType: new FormControl(0),
      maxLottery: new FormControl(0),
      maxFastPrime: new FormControl(0),
      maxRecharges: new FormControl(0),
      maxInvoices: new FormControl(0),
      blockViewComission: new FormControl('False'),
      fastPrime: new FormControl('False'),
      payPending: new FormControl('True'),
      comi: new FormControl(0, [Validators.max(99)]),
      comi_Recharges: new FormControl(0, [Validators.max(99)]),
      comi_Invoices: new FormControl(0, [Validators.max(99)]),
      comi_Ln: new FormControl(0, [Validators.max(99)]),
      max_Qui: new FormControl(0),
      max_Pal: new FormControl(0),
      max_Tri: new FormControl(0),
      max_Sup: new FormControl(0),
      max_Rap: new FormControl(0),
      status: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.getAll()
  }

  getAll(){
    this.page=1
    this.service.getList('GetGroups').subscribe(
	    (response) => { this.list = response['Groups']; console.log(this.list) },
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
  }
  getNumberValue(page: any){
    this.pages = page.target.value;
  }

  getStatus(status: any){
    this.status = status.target.value;
  }

  getOne(id: any) {
    let data = this.list.filter((item: any) => item.Id == id);
    this.openModal('Actualizar Grupo')
    this.form = new FormGroup({
      name: new FormControl(data[0].Name, Validators.required),
      userMaster: new FormControl(data[0].UserMaster),
      phone: new FormControl(data[0].Phone),
      email: new FormControl(data[0].Email),
      saleYes: new FormControl(data[0].SaleYes),
      saleLimiter: new FormControl(data[0].SaleLimiter),
      saleMax: new FormControl(data[0].SaleMax),
      planType: new FormControl(data[0].PlanType),
      maxLottery: new FormControl(data[0].MaxLottery),
      maxFastPrime: new FormControl(data[0].MaxFastPrime),
      maxRecharges:new FormControl(data[0].MaxRecharges),
      maxInvoices: new FormControl(data[0].MaxInvoices),
      blockViewComission: new FormControl(data[0].BlockViewComission),
      fastPrime: new FormControl(data[0].FastPrime),
      payPending: new FormControl(data[0].PayPending),
      comi: new FormControl(data[0].Comi, [Validators.max(99)]),
      comi_Recharges: new FormControl(data[0].Comi_Recharges, [Validators.max(99)]),
      comi_Invoices: new FormControl(data[0].Comi_Invoices, [Validators.max(99)]),
      comi_Ln: new FormControl(data[0].Comi_Ln, [Validators.max(99)]),
      max_Qui: new FormControl(data[0].Max_Qui),
      max_Pal: new FormControl(data[0].Max_Pal),
      max_Tri: new FormControl(data[0].Max_Tri),
      max_Sup: new FormControl(data[0].Max_Sup),
      max_Rap: new FormControl(data[0].Max_Rap),
      status: new FormControl(data[0].Status),
    });
    this.id = id
  }

  add() {
    let obj: IGroup;
    if(this.form.valid){
      obj = {
        Id: 0,
        Cia: 0,
        Name: this.form.value['name'],
        UserMaster: this.form.value['userMaster'],
        Phone: this.form.value['phone'],
        Email: this.form.value['email'],
        SaleYes: this.form.value['saleYes'],
        SaleLimiter: this.form.value['saleLimiter'],
        SaleMax: this.form.value['saleMax'],
        PlanType: this.form.value['planType'],
        MaxLottery: this.form.value['maxLottery'],
        MaxFastPrime: this.form.value['maxFastPrime'],
        MaxRecharges: this.form.value['maxRecharges'],
        MaxInvoices: this.form.value['maxInvoices'],
        BlockViewComission: this.form.value['blockViewComission'],
        FastPrime: this.form.value['fastPrime'],
        PayPending: this.form.value['payPending'],
        Comi: this.form.value['comi'],
        Comi_Recharges: this.form.value['comi_Recharges'],
        Comi_Invoices: this.form.value['comi_Invoices'],
        Comi_Ln: this.form.value['comi_Ln'],
        Max_Qui: this.form.value['max_Qui'],
        Max_Pal: this.form.value['max_Pal'],
        Max_Tri: this.form.value['max_Tri'],
        Max_Sup: this.form.value['max_Sup'],
        Max_Rap: this.form.value['max_Rap'],
        Status: this.form.value['status'],
        ResponseDescription: '',
        HasError: false
      }
      if(this.id){
        obj.Id= this.id
      }else{
        obj.Id= 0
      }

      this.service.postItem('SaveGroup',obj).subscribe({
        next: (response: any) => {
          this.alert.successAlertFunction('Realizado correctamente');
          this.getAll()
          this.closModal()
        },
        error: (error: any) => {
          this.alert.errorAlertFunction(
            'Oops, algo salio mal, valide que todos los campos esten llenos.'
          );
        },
      })
    }
    else this.alert.errorAlertFunction('Llene los campos obligatorios o con errores!');
  }
}
