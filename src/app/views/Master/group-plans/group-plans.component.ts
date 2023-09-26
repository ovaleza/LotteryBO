import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { IGroupPlan } from 'src/app/models/master.models';

@Component({
  selector: 'app-group-plans',
  templateUrl: './group-plans.component.html',
  styleUrls: ['./group-plans.component.scss']
})
export class GroupPlansComponent implements OnInit {
  public list:IGroupPlan[]=[];
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
      factor: new FormControl('', [Validators.required]),
      status: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.getAll()
  }

  getAll(){
    this.service.getList('GetGroupPlans').subscribe(
	    (response) => { this.list = response['GroupPlans']; },
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
    this.openModal('Actualizar Plan')
    this.form = new FormGroup({
      name: new FormControl(data[0].Name),
      factor: new FormControl(data[0].Factor),
      status: new FormControl(data[0].Status),
    });
    this.id = id
  }

  add() {
    let obj: any = []
    if(this.form.valid){
      obj = {
        Id: 0,
        Cia:0,
        Name: this.form.value['name'],
        Factor: this.form.value['factor'],
        Status: this.form.value['status'] ,
        ResponseDescription: '',
        HasError: false
      }      
      if(this.id){
        obj.Id= this.id
      }else{
        obj.Id= 0
      }
      this.service.postItem('SaveGroupPlan',obj).subscribe({
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
  }
}
