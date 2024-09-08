import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { ICompany} from 'src/app/models/master.models';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  public list:ICompany[]=[];
  public icons = freeSet;
  public visible = false;
  public form: FormGroup;
  public search: string = ''
  public status: string = ''
  public modalTitle: string = ''
  public id: number =0;
  public page: any
  public pages : number = 50;
  public isAdm : boolean=false;
  public isOff : boolean=false;
  public isDay : boolean=false;
  public isOwn : boolean=false;

  constructor(private alert: AlertService , public service: MasterService) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      address: new FormControl(''),
      address2: new FormControl(''),
      phone: new FormControl(''),
      phone2: new FormControl(''),
      manager: new FormControl(''),
      email: new FormControl(''),
      doc: new FormControl(''),
      maxLottery: new FormControl(0),
      maxFastPrime: new FormControl(0),
      maxRecharges: new FormControl(0),
      maxInvoices: new FormControl(0),
      fastPrime: new FormControl('False'),
      comi: new FormControl(0, [Validators.max(99)]),
      comi_Recharges: new FormControl(0, [Validators.max(99)]),
      comi_Invoices: new FormControl(0, [Validators.max(99)]),
      comi_Ln: new FormControl(0, [Validators.max(99)]),
      max_Qui: new FormControl(0),
      max_Pal: new FormControl(0),
      max_Tri: new FormControl(0),
      max_Sup: new FormControl(0),
      max_Rap: new FormControl(0),
      blockViewPrizes: new FormControl('False'),
      vendorVoid: new FormControl('False'),
      vendorVoidRecharges: new FormControl('False'),
      vendorPrintResults: new FormControl('False'),
      blockViewComission: new FormControl('False'),
      lotteryPrimesPrint: new FormControl('False'),
      voidEnabled: new FormControl('False'),
      voidRechargesEnabled: new FormControl('False'),
      payPrizesEnabled: new FormControl('False'),
      doubleSerial:new FormControl('False'),
      serialFixRelease: new FormControl('False'),
      status: new FormControl('')
    });
  }

  ngOnInit(): void {
    // this.service.getList('GetUsers').subscribe(
    //   (response) => { this.fileUsers = response["Users"] },
    //   (error) => { console.log(error); });
    //this.service.theGroupReset();
//    this.fileGroups=this.service.fileGroups;
    // this.service.getList('GetGroups').subscribe(
    //   (response) => { this.fileGroups = response["Groups"] },
    //   (error) => { console.log(error); });
    // this.service.getList('GetTerminals').subscribe(
    //   (response) => { this.fileTerminals = response["Terminals"] },
    //   (error) => { console.log(error); });
    this.getAll()
  }

  getAll() {
    this.page=1;
    this.isAdm=this.service.setAdm();
    this.isOff=this.service.setRole()=='OFICINA'
    this.isOwn=this.service.setRole()=='ADMIN'
    this.isDay=(this.isAdm || this.isOwn);
    this.service.theGroupReset();
    this.service.theUsersReset();
    this.service.getList('GetCompanies').subscribe(
	    (response) => {
        this.list = response["Companies"];
        if (this.list.length>0 && this.isAdm) {
          let tot:any = {
          Id : '',
          Name : `====> (${this.list.length})`,
          Branches : this.list.reduce((acumulador, actual) => acumulador + parseFloat(actual.Branches), 0),
          BranchesOn : this.list.reduce((acumulador, actual) => acumulador + parseFloat(actual.BranchesOn), 0),
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
  }

  getNumberValue(page: any){
    this.pages = page.target.value;
  }

  getStatus(status: any){
    this.status = status.target.value;
  }

  getOne(id: any) {
    let data = this.list.filter((item: any) => item.Id == id);
    this.openModal('Actualizar Configuracion Empresa')
    this.form = new FormGroup({
      name: new FormControl(data[0].Name, Validators.required),
      address: new FormControl(data[0].Address),
      address2: new FormControl(data[0].Address2),
      phone: new FormControl(data[0].Phone),
      phone2: new FormControl(data[0].Phone2),
      manager: new FormControl(data[0].Manager),
      email: new FormControl(data[0].Email),
      maxLottery: new FormControl(data[0].MaxLottery),
      maxFastPrime: new FormControl(data[0].MaxFastPrime),
      maxRecharges:new FormControl(data[0].MaxRecharges),
      maxInvoices: new FormControl(data[0].MaxInvoices),
      fastPrime: new FormControl(data[0].FastPrime),
      comi: new FormControl(data[0].Comi, [Validators.max(99)]),
      comi_Recharges: new FormControl(data[0].Comi_Recharges, [Validators.max(99)]),
      comi_Invoices: new FormControl(data[0].Comi_Invoices, [Validators.max(99)]),
      comi_Ln: new FormControl(data[0].Comi_Ln, [Validators.max(99)]),
      max_Qui: new FormControl(data[0].Max_Qui),
      max_Pal: new FormControl(data[0].Max_Pal),
      max_Tri: new FormControl(data[0].Max_Tri),
      max_Sup: new FormControl(data[0].Max_Sup),
      max_Rap: new FormControl(data[0].Max_Rap),
      doc: new FormControl(data[0].Doc),
      blockViewPrizes: new FormControl(data[0].BlockViewPrizes),
      vendorVoid: new FormControl(data[0].VendorVoid),
      vendorVoidRecharges: new FormControl(data[0].VendorVoidRecharges),
      vendorPrintResults: new FormControl(data[0].VendorPrintResults),
      blockViewComission: new FormControl(data[0].BlockViewComission),
      lotteryPrimesPrint: new FormControl(data[0].LotteryPrimesPrint),
      voidEnabled: new FormControl(data[0].VoidEnabled),
      voidRechargesEnabled: new FormControl(data[0].VoidRechargesEnabled),
      payPrizesEnabled: new FormControl(data[0].PayPrizesEnabled),
      doubleSerial: new FormControl(data[0].DoubleSerial),
      serialFixRelease: new FormControl(data[0].SerialFixRelease),
      status: new FormControl(data[0].Status),
    });
    this.id = id
  }

  add() {
    let obj: ICompany;
    if(this.form.valid){
      obj = {
        Id: 0,
        Cia:0,
        Name: this.form.value['name'],
        Address: this.form.value['address'],
        Address2: this.form.value['address2'],
        Phone: this.form.value['phone'],
        Phone2: this.form.value['phone2'],
        Manager: this.form.value['manager'],
        Email: this.form.value['email'],
        Doc: this.form.value['doc'],
        MaxLottery: this.form.value['maxLottery'],
        MaxFastPrime: this.form.value['maxFastPrime'],
        MaxRecharges: this.form.value['maxRecharges'],
        MaxInvoices: this.form.value['maxInvoices'],
        FastPrime: this.form.value['fastPrime'],
        Comi: this.form.value['comi'],
        Comi_Recharges: this.form.value['comi_Recharges'],
        Comi_Invoices: this.form.value['comi_Invoices'],
        Comi_Ln: this.form.value['comi_Ln'],
        Max_Qui: this.form.value['max_Qui'],
        Max_Pal: this.form.value['max_Pal'],
        Max_Tri: this.form.value['max_Tri'],
        Max_Sup: this.form.value['max_Sup'],
        Max_Rap: this.form.value['max_Rap'],
        BlockViewPrizes: this.form.value['blockViewPrizes'],
        VendorVoid: this.form.value['vendorVoid'],
        VendorVoidRecharges: this.form.value['vendorVoidRecharges'],
        VendorPrintResults: this.form.value['vendorPrintResults'],
        BlockViewComission: this.form.value['blockViewComission'],
        LotteryPrimesPrint: this.form.value['lotteryPrimesPrint'],
        VoidEnabled: this.form.value['voidEnabled'],
        VoidRechargesEnabled: this.form.value['voidRechargesEnabled'],
        PayPrizesEnabled: this.form.value['payPrizesEnabled'],
        DoubleSerial: this.form.value['doubleSerial'],
        SerialFixRelease: this.form.value['serialFixRelease'],
        Status: this.form.value['status'],
        ResponseDescription: '',
        HasError: false
      }
      if(this.id){
        obj.Id= this.id
      }else{
        obj.Id= 0
      }
      this.service.postItem('SaveCompany',obj).subscribe({
        next: (response: any) => {
          console.log(response)
          let id2=response['ResposeCode']
          let mss=response['ResposeDescription']
          if (id2!=0) this.alert.errorAlertFunction(mss);
          else {
            this.alert.successAlertFunction()
            this.getAll()
            this.closModal()
          }
        },
        error: (error: any) => {
          this.alert.errorAlertFunction(
            'Oops, algo salio mal, no fue posible registrar.'
          );
        },
      })
    }
    else this.alert.errorAlertFunction('Llene los campos obligatorios o con errores!');
  }
}
