import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { IBranch, IGroup, ITerminal } from 'src/app/models/master.models';

@Component({
  selector: 'app-terminals',
  templateUrl: './terminals.component.html',
  styleUrls: ['./terminals.component.scss']
})
export class TerminalsComponent implements OnInit {
  public list:ITerminal[]=[];
  public fileGroups: IGroup[]=[] ;
  public fileTypes: any[]=[] ;
  public filePhoneProviders: any[]=[] ;
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
      branch: new FormControl(''),
      type: new FormControl('1'),
      name: new FormControl('', Validators.required),
      phoneProvider: new FormControl(''),
      status: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.getAll()
  }

  getAll() {
    this.service.getList('GetTerminals').subscribe(
	    (response) => { this.list = response["Terminals"] },
    	(error) => { console.log(error); });

    // this.service.getList('GetGroups').subscribe(
    //   (response) => { this.fileGroups = response["Groups"] },
    //   (error) => { console.log(error); });
    this.fileGroups=this.service.getGroups();
    this.filePhoneProviders= this.service.filePhoneProviders;
    this.fileTypes= this.service.fileTerminalTypes;
  }

  elTerminalType(id:any){
    //return this.service.elGrupo(id);
    return this.fileTypes.find(element => element.Id == id)?.Name;    
  }

  elPhoneProvider(id:any){
    //return this.service.elGrupo(id);
    return this.filePhoneProviders.find(element => element.Id == id)?.Name;    
  }

  openModal(title: string) {
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
    this.openModal('Actualizar Equipo o Terminal')
    this.form = new FormGroup({
      group: new FormControl(data[0].Group),
      branch: new FormControl(data[0].Branch),
      type: new FormControl(data[0].Type),
      name: new FormControl(data[0].Name, Validators.required),
      phoneProvider: new FormControl(data[0].PhoneProvider),
      status: new FormControl(data[0].Status),
    });
    this.id = id
  }

  add() {
    let obj: any;
    if(this.form.valid){
      obj = {
        Id: 0,
        Cia:0,
        Group: this.form.value['group'],
        Branch: this.form.value['zone'],
        Type: this.form.value['type'],
        Name: this.form.value['name'],
        Trade : this.form.value['trade'],
        Model : this.form.value['model'],
        Serial : this.form.value['serial'],
        Mac : this.form.value['mac'],
        Imei : this.form.value['imei'],
        Simcard: this.form.value['simcard'],
        PhoneProvider:this.form.value['phoneProvider'],
        License: this.form.value['licence'],
        PrintFormat:this.form.value['printFormat'],
        PrintHeader:this.form.value['printHeader'],
        PrintHead1: this.form.value['printHead1'],
        PrintHead2: this.form.value['printHead2'],
        PrintHead3: this.form.value['printHead3'],
        PrintMessage: this.form.value['printMessage'],
        PrintFooter: this.form.value['printFooter'],
        PurchaseDate: this.form.value['purchaseDate'],
        Guaranty:this.form.value['guaranty'],
        GuarantyDate: this.form.value['guarantyDate'],
        Provider: this.form.value['provider'],
        ProviderEmail: this.form.value['providerEmail'],
        ProviderPhone: this.form.value['providerPhone'],
        Status: this.form.value['status'] ,
        ResponseDescription: '',
        HasError: false
      }
      if(this.id){
        obj.Id= this.id
      }else{
        obj.Id= 0
      }

      this.service.postItem( 'SaveTerminal',obj).subscribe({
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
