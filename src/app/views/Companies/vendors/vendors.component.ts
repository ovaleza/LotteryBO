import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { IBranch, ITerminal, IVendor } from 'src/app/models/master.models';
@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})

export class VendorsComponent implements OnInit {
  public list:IVendor[]=[];
  public fileTerminals: ITerminal[]=[] ;
  public fileBranchs: IBranch[]=[] ;
  public fileTypes: any[]=[] ;
  public icons = freeSet;
  public visible = false;
  public form!: FormGroup | FormGroup;
  public search: string = ''
  public status: string = ''

  public modalTitle: string = ''
  public id: number =0;
  public page: any
  public pages : number = 50
  public isAdm : boolean=false;
  public isOff : boolean=false;
  public isDay : boolean=false;
  public isOwn : boolean=false;

  constructor(
    private alert: AlertService ,
    public service: MasterService) {
    this.reset()
  }

  reset(){
    this.form = new FormGroup({
      created: new FormControl(''),
      doc: new FormControl(''),
      name: new FormControl('', Validators.required),
      address: new FormControl(''),
      phone: new FormControl(''),
      email: new FormControl(''),
      branch: new FormControl(0),
      us: new FormControl('', Validators.required),
      ps: new FormControl('', Validators.required),
      serialFix: new FormControl('True'),
      status: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.service.getList('GetTerminals').subscribe(
	    (response) => { this.fileTerminals = response["Terminals"] },
    	(error) => { console.log(error); });

    this.service.getList('GetBranches').subscribe(
      (response) => { this.fileBranchs = response["Branches"] },
      (error) => { console.log(error); });

    this.fileTypes= this.service.getTypeVendors();
    this.getAll()
  }

  getAll() {
    this.page=1;
    this.isAdm=this.service.setAdm()
    this.isOff=this.service.setRole()=='OFICINA'
    this.isOwn=this.service.setRole()=='ADMIN'
    this.isDay=(this.isAdm || this.isOwn);

    this.service.getList('GetVendors').subscribe(
      (response) => { this.list = response["Vendors"]},
      (error) => { console.log(error); });

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
    this.openModal('Actualizar Cajero / Vendedor')
    this.form = new FormGroup({
      created: new FormControl(data[0].Created),
      doc: new FormControl(data[0].Doc),
      name: new FormControl(data[0].Name, Validators.required),
      address: new FormControl(data[0].Address),
      phone: new FormControl(data[0].Phone),
      email: new FormControl(data[0].Email),
      branch: new FormControl(data[0].Branch),
      us: new FormControl(data[0].Us, Validators.required),
      ps: new FormControl(data[0].Ps, Validators.required),
      serialFix: new FormControl(data[0].SerialFix),
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
        Branch: this.form.value['branch'],
        SerialFix: this.form.value['serialFix'],
        Group: '',
        Role: '4',
        Position: '',
        Level: '',
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
    else this.alert.errorAlertFunction('Valide que todos los campos esten llenos.');
  }
}
