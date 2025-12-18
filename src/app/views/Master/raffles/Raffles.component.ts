import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
//import { BranchService } from '../../services/branch.service';
//import { GroupService } from '../../services/group.service';
import { MasterService } from 'src/app/services/master.service';
import { IRaffle, IGroup, ITerminal } from 'src/app/models/master.models';

@Component({
  selector: 'app-Raffles',
  templateUrl: './Raffles.component.html',
  styleUrls: ['./Raffles.component.scss']
})
export class RafflesComponent implements OnInit {
  public list:IRaffle[]=[];
//  public fileGroups: IGroup[]=[] ;
  // public fileUsers: any[]=[];
//  public fileTerminals: ITerminal[]=[] ;
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
      provider: new FormControl(''),
      name: new FormControl('', Validators.required),
      details: new FormControl(''),
      prize1: new FormControl(0),
      prize2: new FormControl(0),
      prize3: new FormControl(0),
      subprize1: new FormControl(0),
      subprize2: new FormControl(0),
      price: new FormControl(0),
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
//    this.service.theTerminalsReset();
    this.service.getList('GetRaffles').subscribe(

	    (response) => {
        console.log(response);
        this.list = response["Raffles"];
        this.list.forEach((element) => {
          element.ProviderName=this.service.theProvider(element.Provider);
        })
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
    this.openModal('Actualizar Banca o Sucursal')
    this.form = new FormGroup({
      provider: new FormControl(data[0].Provider),
      name: new FormControl(data[0].Name, Validators.required),
      details: new FormControl(data[0].Details),
      prize1: new FormControl(data[0].Prize1),
      prize2: new FormControl(data[0].Prize2),
      prize3: new FormControl(data[0].Prize3),
      subprize1: new FormControl(data[0].SubPrize1),
      subprize2: new FormControl(data[0].SubPrize2),
      price: new FormControl(data[0].Price),
      status: new FormControl(data[0].Status),
    });
    this.id = id
  }

  add() {
    let obj: IRaffle;
    if(this.form.valid){
      obj = {
        Id: 0,
        Cia:0,
        Provider: this.form.value['group'],
        Name: this.form.value['name'],
        Details: this.form.value['details'],
        Prize1: this.form.value['prize1'],
        Prize2: this.form.value['prize2'],
        Prize3: this.form.value['prize3'],
        SubPrize1: this.form.value['subprize1'],
        SubPrize2: this.form.value['subprize2'],
        Price: this.form.value['price'],
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
