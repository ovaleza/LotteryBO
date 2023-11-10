import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { IBranch, IGroup, IReport, IVendor, ICriteria, ILottery} from 'src/app/models/master.models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lotteries-results',
  templateUrl: './lotteries-results.component.html',
  styleUrls: ['./lotteries-results.component.scss']
})
export class LotteriesResultsComponent implements OnInit {
  public list:any[]=[];
  public fileLotteries: ILottery[]=[] ;
  public icons = freeSet;
  public visible = false;
  public form: FormGroup;
  public search: string = ''
  public status: string = ''
  public fec1: string='';
  public fec_result: string='';
  public modalTitle: string = ''
  public id: number =0;
  public page: any
  public pages : number = 25
  public name: string = '';
  public barra : number =0;
  public hoy: string=this.service.getToday()
  public isAdm : boolean=false;
  public isOff : boolean=false;
  public isDay : boolean=false;
  public isOwn : boolean=false;
//  public isCiaUno:boolean=false;

  constructor(
    private activeRouter: ActivatedRoute,
    private alert: AlertService,
    public service:  MasterService
  ) {
    this.activeRouter.params.subscribe((params) => {
      this.id = params['id'];
      this.name = params['name'];
    });
    this.reset()
  }

reset(){
  this.form = new FormGroup({
    date1: new FormControl(this.hoy),
    lottery: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"),]),
    created: new FormControl(''),
    n1: new FormControl('', Validators.required),
    n2: new FormControl('', Validators.required),
    n3: new FormControl('', Validators.required),
  });
}

  onclick()
  {
    this.visible = !this.visible
  }

  ngOnInit(): void {
    setInterval(() => this.myTimer(), 15000);
    this.service.getList('GetLotteries').subscribe(
      (response) => { this.fileLotteries = response["Lotteries"];
      this.fileLotteries=this.fileLotteries.filter((item) => item.Status.toUpperCase()!= 'N' && item.Status.toUpperCase()!='I' && item.Id!=99);
     },
      (error) => { console.log(error); });

    this.getAll()
  }

  myTimer() {
    this.barra++;
    if (this.barra>=30) {this.barra=0;this.getAll();}
  }

  getAll() {
    this.isAdm=this.service.setAdm()
    this.isOff=this.service.setRole()=='OFICINA'
    this.isOwn=this.service.setRole()=='ADMIN'
    this.fec1=this.form.value['date1']
    let day=this.fec1
    let days=this.service.getDaysBack(day)
    this.isDay=(this.isAdm || (this.service.setCiaUno() && (days<=1 && days>=0) && (this.isOff || this.isOwn) ));


    this.list=[];
    this.service.getList('GetPrizeNums?dateRef='+this.fec1).subscribe(
      (response) => { this.list = response["PrizeNums"]; this.fec_result=this.fec1},
      (error) => { console.log(error); });
  }

  openModal(title: string) {
    this.visible = true;
    this.modalTitle = title

  }

  closModal() {
    this.visible = false;
    this.id = 0;
    this.status='';
    //this.reset()
    this.getAll()
  }

  getNumberValue(page: any){
    this.pages = page.target.value;
  }

  getStatus(status: any){
    this.status = status.target.value;
  }

  addOne(title: string) {
    let hoy=this.form.value['date1']
    this.form.controls['date1'].setValue(hoy);
    this.openModal(title)
    this.id = 0
  }


  getOne(id: any) {
    let data = this.list.filter((item: any) => item.Id == id);
    this.openModal('Actualizar Numeros Ganadores')
    let hoy=this.form.value['date1']
    this.form = new FormGroup({
      date1: new FormControl(hoy),
      lottery: new FormControl(data[0].LotteryId, Validators.required),
      n1: new FormControl(data[0].N1, Validators.required),
      n2: new FormControl(data[0].N2, Validators.required),
      n3: new FormControl(data[0].N3, Validators.required),
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
        DateEnter: '',
        DateRef: this.form.value['date1'],
        Lottery: this.form.value['lottery'],
        N1: this.form.value['n1'],
        N2: this.form.value['n2'],
        N3: this.form.value['n3'],
        Status: this.form.value['status'],
        ResponseDescription: '',
        HasError: false
      }
      this.service.postItem( 'SavePrizeNum',obj).subscribe({
        next: (response: any) => {
          let id2=response['ResposeCode']
          let mss=response['ResposeDescription']
          if (id2!=0) this.alert.errorAlertFunction(mss);
          else {
            this.alert.successAlertFunction()
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
