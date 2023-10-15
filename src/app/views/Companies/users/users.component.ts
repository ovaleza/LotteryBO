import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { IUser, IGroup, IRol } from 'src/app/models/master.models';
import random from 'random'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public list:IUser[]=[];
  public fileGroups: IGroup[]=[];
  public fileRoles: IRol[]=[] ;
  public filePositions: any[]=[] ;
  public fileLevels: any[]=[] ;
  public icons = freeSet;
  public visible = false;
  public form: FormGroup;
  public search: string = ''
  public status: string = ''

  public modalTitle: string = ''
  public id: number =0;
  public page: any
  public pages : number = 25
  public isAdm : boolean=false;
  public isOff : boolean=false;
  public isDay : boolean=false;
  public isOwn : boolean=false;

  constructor(private alert: AlertService , private service:  MasterService) {
    this.form = new FormGroup({
      us: new FormControl('', Validators.required),
      ps: new FormControl('', Validators.required),
      pin: new FormControl(''),
      doc: new FormControl(''),
      name: new FormControl('', Validators.required),
      address: new FormControl(''),
      phone: new FormControl(''),
      email: new FormControl(''),
      position: new FormControl('0'),
      group: new FormControl('0'),
      role: new FormControl('0', Validators.required),
      created: new FormControl(''),
      level: new FormControl('0'),
      status: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.service.getList('GetGroups').subscribe(
	    (response) => { this.fileGroups = response["Groups"] },
    	(error) => { console.log(error); });
    this.service.getList('GetRoles').subscribe(
      (response) => { this.fileRoles = response["Roles"] },
      (error) => { console.log(error); });
    //this.fileRoles=this.service.getRoles();
    this.filePositions= this.service.getPositionUsers();
    this.fileLevels= this.service.getLevelUsers();

    this.getAll()
  }

  getAll() {
    this.isAdm=this.service.setAdm()
    this.isOff=this.service.setRole()=='OFICINA'
    this.isOwn=this.service.setRole()=='ADMIN'
    this.isDay=(this.isAdm || this.isOwn);

    this.service.getList('GetUsers').subscribe(
      (response) => { this.list = response["Users"] },
      (error) => { console.log(error); });

  }

  newpin(){
    //this.alert.soloAlert('220')
    var rpin =random.int(1000,9999);
    this.form.controls['pin'].setValue(rpin.toString())
  }
  laPosicion(id:any){
    //return this.service.elGrupo(id);
    return this.filePositions.find(element => element.Id == id)?.Name;
  }

  elRol(id:any){
    //return this.service.elGrupo(id);

    return this.fileRoles.find(element => element.Id == id)?.Name;
  }

  openModal(title: string) {
    this.form.controls['ps'].setValue('')
    this.visible = true;
    this.modalTitle = title
  }

  closModal() {
    this.visible = false;
    this.id = 0;
    this.status='';
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
    this.openModal('Actualizar Usuario')
    this.form = new FormGroup({
      us: new FormControl(data[0].Us, Validators.required),
      ps: new FormControl(data[0].Ps, Validators.required),
      pin : new FormControl(data[0].Pin),
      doc: new FormControl(data[0].Doc),
      name: new FormControl(data[0].Name, Validators.required),
      address: new FormControl(data[0].Address),
      phone: new FormControl(data[0].Phone),
      email: new FormControl(data[0].Email),
      position: new FormControl(data[0].Position),
      group: new FormControl(data[0].Group),
      role: new FormControl(data[0].Role, Validators.required),
      created: new FormControl(data[0].Created),
      level: new FormControl(data[0].Level),
      status: new FormControl(data[0].Status),
    });
    this.id = id
  }

  add() {
    if(this.form.valid){
      let obj: any;
      obj = {
        Id: this.id,
        Cia:0,
        Us: this.form.value['us'],
        Ps: this.form.value['ps'],
        Pin: this.form.value['pin'],
        Doc: this.form.value['doc'],
        Name: this.form.value['name'],
        Address: this.form.value['address'],
        Phone: this.form.value['phone'],
        Email: this.form.value['email'],
        Branch: 0,
        Group: this.form.value['group'],
        Role: this.form.value['role'],
        Position: this.form.value['position'],
        Level: this.form.value['level'],
        Status: this.form.value['status'],
        Created: '',
        ResponseDescription: '',
        HasError: false
      }
      obj.Role=obj.Id==1?'1':obj.Role;
      obj.Status=obj.Id==1?'':obj.Status;
      obj.Level=obj.Role=='1'?'1':obj.Level;
      obj.Pin=obj.Role>3?'':obj.Pin;
      obj.Group=obj.Role<=3?'':obj.Group;
      if (obj.Role==0) {this.alert.errorAlertFunction('Debe definir el Role');return};
      this.service.postItem( 'SaveUser',obj).subscribe({
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
    else this.alert.errorAlertFunction('LLene los Campos Obligatorios!');
  }
}
