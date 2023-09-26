import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { IRol } from 'src/app/models/master.models';

@Component({
  selector: 'app-rols',
  templateUrl: './rols.component.html',
  styleUrls: ['./rols.component.scss']
})
export class RolsComponent implements OnInit {
  public listRoles:IRol[]=[];
  public icons = freeSet;
  public visible = false;
  public form: FormGroup;
  public search: string = ''
  public modalTitle: string = ''
  public id: number =0
  public page: any
  public pages : number = 25


  constructor(private alert: AlertService, private service: MasterService){
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      status: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.getAll()
  }

  getAll(){
    this.service.getList('GetRoles').subscribe(
	    (response) => { this.listRoles = response.Roles; },
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

  getOne(id: any) {
    let data = this.listRoles.filter((item: any) => item.Id == id);
    this.openModal('Actualizar Rol')

    this.form = new FormGroup({
      name: new FormControl(data[0].Name),
      status: new FormControl(data[0].Status),
      description: new FormControl(data[0].Description),
    });
    //this.form.controls['status'].setValue(data[0].Status)    
    this.id = id
  }

  add() {
    let obj: IRol;
    if(this.form.valid){
      obj = {
        Id: 0,
        Cia: 0,
        Name: this.form.value['name'],
        Description: this.form.value['description'],
        Status: this.form.value['status'],
        ResponseDescription: '',
        HasError: false
      }
      if(this.id ){
        obj.Id= this.id
      }else{
        obj.Id= 0
      }

      this.service.postItem('SaveRole',obj).subscribe({
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
