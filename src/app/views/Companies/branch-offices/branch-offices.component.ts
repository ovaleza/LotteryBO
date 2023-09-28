import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
//import { BranchService } from '../../services/branch.service';
//import { GroupService } from '../../services/group.service';
import { MasterService } from 'src/app/services/master.service';
import { IBranch, IGroup, ITerminal } from 'src/app/models/master.models';

@Component({
  selector: 'app-branch-offices',
  templateUrl: './branch-offices.component.html',
  styleUrls: ['./branch-offices.component.scss'],
})
export class BranchOfficesComponent implements OnInit {
  public list:IBranch[]=[];
  public fileGroups: IGroup[]=[] ;
  public fileUsers: any[]=[];
  public fileTerminals: ITerminal[]=[] ;
  public icons = freeSet;
  public visible = false;
  public form: FormGroup;
  public search: string = ''
  public status: string = ''
  public modalTitle: string = ''
  public id: number =0;
  public page: any
  public pages : number = 25

  constructor(private alert: AlertService , public service: MasterService) {
    this.form = new FormGroup({
      group: new FormControl(''),
      zone: new FormControl(''),
      terminal: new FormControl(''),
      code: new FormControl(''),
      name: new FormControl('', Validators.required),
      address: new FormControl(''),
      phone: new FormControl(''),
      collector: new FormControl(0),
      maxLottery: new FormControl(0),
      maxPhoneRecharge: new FormControl(0),
      maxInvoices: new FormControl(0),
      manager: new FormControl(''),
      blockView: new FormControl('False'),
      status: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.service.getList('GetUsers').subscribe(
      (response) => { this.fileUsers = response["Users"] },
      (error) => { console.log(error); });
    this.service.getList('GetGroups').subscribe(
      (response) => { this.fileGroups = response["Groups"] },
      (error) => { console.log(error); });
    this.service.getList('GetTerminals').subscribe(
      (response) => { this.fileTerminals = response["Terminals"] },
      (error) => { console.log(error); });


    this.getAll()
  }

  getAll() {
    this.service.getList('GetBranches').subscribe(
	    (response) => { this.list = response["Branches"] },
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
    this.openModal('Actualizar Banca o Sucursal')
    this.form = new FormGroup({
      group: new FormControl(data[0].Group),
      zone: new FormControl(data[0].Zone),
      terminal: new FormControl(data[0].Terminal),
      code: new FormControl(data[0].Code),
      name: new FormControl(data[0].Name, Validators.required),
      address: new FormControl(data[0].Address),
      phone: new FormControl(data[0].Phone),
      collector: new FormControl(data[0].Collector ),
      maxLottery: new FormControl(data[0].MaxLottery),
      maxPhoneRecharge:new FormControl(data[0].MaxPhoneRecharge),
      maxInvoices: new FormControl(data[0].MaxInvoices),
      manager: new FormControl(data[0].Manager),
      blockView: new FormControl(data[0].BlockView),
      status: new FormControl(data[0].Status),
    });
    this.id = id
  }

  add() {
    let obj: IBranch;
    if(this.form.valid){
      obj = {
        Id: 0,
        Cia:0,
        Group: this.form.value['group'],
        Zone: this.form.value['zone'],
        Terminal: this.form.value['terminal'],
        Code: this.form.value['code'],
        Name: this.form.value['name'],
        Address: this.form.value['address'],
        Phone: this.form.value['phone'],
        Collector: this.form.value['collector'],
        MaxLottery: this.form.value['maxLottery'],
        MaxPhoneRecharge: this.form.value['maxPhoneRecharge'],
        MaxInvoices: this.form.value['maxInvoices'],
        Manager: this.form.value['manager'],
        BlockView: this.form.value['blockView'],
        Status: this.form.value['status'],
        ResponseDescription: '',
        HasError: false
      }
      if(this.id){
        obj.Id= this.id
      }else{
        obj.Id= 0
      }
      this.service.postItem('SaveBranch',obj).subscribe({
        next: (response: any) => {
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
