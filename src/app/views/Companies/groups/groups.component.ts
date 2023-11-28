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
  public pages : number = 25

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
      status: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.getAll()
  }

  getAll(){
    this.service.getList('GetGroups').subscribe(
	    (response) => { this.list = response['Groups']; },
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
