import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { ILottery } from 'src/app/models/master.models';

@Component({
  selector: 'app-lotteries',
  templateUrl: './lotteries.component.html',
  styleUrls: ['./lotteries.component.scss'],
})
export class LotteriesComponent implements OnInit {
  public visibleClose: boolean = false;
  public visibleLimit: boolean = false;
  public visibleNumber: boolean = false;
  public visibleActionTicket: boolean = false;
  public isAdm:boolean=false;
  public option: string = '0';

  public list:ILottery[]=[];
  public icons = freeSet;
  public visible = false;
  public form!: FormGroup | FormGroup;
  public search: string = ''
  //public pale : boolean= false
  public modalTitle: string = ''
  public id: number = 0
  public page: any
  public pages : number = 25

  constructor(private alert: AlertService, public service: MasterService) {
    this.setform()
  }

  setform() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.maxLength(30),Validators.required]),
      code: new FormControl('', [Validators.maxLength(3),Validators.required]),
      quiniela: new FormControl("True"),
      pale: new FormControl("True"),
      tripleta: new FormControl("True"),
      timeClose: new FormControl('13:00', Validators.required),
      timeCloseB: new FormControl('00:00'),
      timeCloseC: new FormControl(''),
      priority: new FormControl(1),
      limit: new FormControl('0'),
      status: new FormControl('a'),
      namePublic: new FormControl('', [Validators.maxLength(30)]),
    });
  }

  ngOnInit(): void {
      this.getAll()
  }

  getAll(){
    this.isAdm=this.service.setAdm();
    this.service.getList('GetLotteries').subscribe(
	    (response) => { this.list = response["Lotteries"];},
    	(error) => { console.log(error); });
  }

  openModal(title: string) {
    if (this.isAdm) {
      this.visible = true;
      this.modalTitle = title
    }
  }

  closModal() {
    this.visible = false;
    this.id = 0;
    this.form.reset()
    this.setform();
  }

  getNumberValue(page: any){
    this.pages = page.target.value;
  }


  getOne(id: any) {
    let data = this.list.filter((item: any) => item.Id == id);
    this.id = id;
    this.openModal('Actualizar Loteria')
    this.form = new FormGroup({
       name: new FormControl(data[0].Name, [Validators.maxLength(30),Validators.required]),
       code: new FormControl(data[0].Code, [Validators.maxLength(3),Validators.required]),
       quiniela: new FormControl(data[0].Quiniela),
       pale: new FormControl(data[0].Pale),
       tripleta: new FormControl(data[0].Tripleta),
       timeClose: new FormControl(data[0].TimeClose, Validators.required),
       timeCloseB: new FormControl(data[0].TimeCloseB),
       timeCloseC: new FormControl(data[0].TimeCloseC),
       priority: new FormControl(data[0].Priority),
       limit: new FormControl(data[0].Limit),
       status: new FormControl(data[0].Status),
       namePublic: new FormControl(data[0].NamePublic, [Validators.maxLength(30)]),
    });
  }
  add() {
    let obj: ILottery;
    if(this.form.valid){
      obj = {
        Id: 0,
        Cia:0,
        Name: this.form.value['name'].toUpperCase(),
        Code: this.form.value['code'].toUpperCase(),
        Quiniela: this.form.value['quiniela'],
        Pale: this.form.value['pale'],
        Tripleta: this.form.value['tripleta'],
        TimeClose: this.form.value['timeClose'],
        TimeCloseB: this.form.value['timeCloseB'],
        TimeCloseC: this.form.value['timeCloseC'],
        Priority: this.form.value['priority'],
        Limit: this.form.value['limit'],
        Status: this.form.value['status'],
        NamePublic: this.form.value['namePublic'].toUpperCase(),
        ResponseDescription: '',
        HasError: false
      }
      if (this.id) {obj.Id=this.id} else {obj.Id=0}
      this.service.postItem( 'SaveLottery',obj).subscribe({
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

  openModalOption(option: number) {
    switch (option) {
      case 1:
        this.visibleClose = true;
        break;

      case 2:
        this.visibleLimit = true;
        break;

      case 3:
        this.visibleNumber = true;
        break;

      case 4:
        this.visibleActionTicket = true;
        break;

      default:
        break;
    }
  }

  closeModalOption(option: number) {
    switch (option) {
      case 1:
        this.visibleClose = false;
        break;

      case 2:
        this.visibleLimit = false;
        break;

      case 3:
        this.visibleNumber = false;
        break;

      case 4:
        this.visibleActionTicket = false;
        break;

      default:
        break;
    }
  }

  closeLotterie() {
    this.alert
      .validationAlertFunction('¿Quieres cerrar esta loteria', 'Si, cerrar')
      .then((res) => {
        this.alert.successAlertFunction('Loteria cerrada correctamente.');
      });
  }

  limitLotterie() {
    this.alert
      .validationAlertFunction('¿Quieres limitar esta loteria', 'Si, limitar')
      .then((res) => {
        this.alert.successAlertFunction('Loteria limitada correctamente.');
      });
  }

  blockNumber() {
    this.alert
      .validationAlertFunction('¿Quieres bloquear este número', 'Si, bloquear')
      .then((res) => {
        this.alert.successAlertFunction('Número bloqueado correctamente.');
      });
  }

  restarOrCancelTicket() {
    let text: string = '';
    if (this.option == '1') {
      text = 'anular';
    } else {
      text = 'restaurar';
    }
    this.alert
      .validationAlertFunction(`¿Quieres ${text} este ticket`, `Si, ${text}`)
      .then((res) => {
        this.alert.successAlertFunction(`Ticket procesado correctamente.`);
      });
  }
}
