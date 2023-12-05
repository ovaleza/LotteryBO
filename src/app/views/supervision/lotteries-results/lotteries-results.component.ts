import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { IBranch, IGroup, IReport, IVendor, ICriteria, ILottery} from 'src/app/models/master.models';
import { ActivatedRoute } from '@angular/router';
import { LotteryClosingComponent } from '../../G-Lottery/lottery-closing/lottery-closing.component';

@Component({
  selector: 'app-lotteries-results',
  templateUrl: './lotteries-results.component.html',
  styleUrls: ['./lotteries-results.component.scss']
})
export class LotteriesResultsComponent implements OnInit {
  public list:any[]=[];
  public list2:any[]=[];
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
  public new : boolean = false;
  public score:[0,0,0];
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
    //this.reset()
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
  this.getAll()
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

    this.reset()
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
    this.list2=[];

    this.service.getList('GetPrizeNums?dateRef='+this.fec1).subscribe(
      (response) => {
        this.list = response["PrizeNums"]; this.fec_result=this.fec1;
        this.service.getList('GetDominicanas').subscribe(
          (response) => {
            this.list2 = response["Dominicanas"];
            this.list.forEach((item) =>{
              this.list2.forEach((item2) => {
                if (item.NamePublic==item2.game_title.toUpperCase() && this.getColor(item2.date)==='blue') item.score=item2.score
              });
              if (!item.N1 && item.score)
              {
                item.new=true
              }
              else {
                if(item.score)
                  item.new=(parseInt(item.N1)!=parseInt(item.score[0]) || parseInt(item.N2)!=parseInt(item.score[1]) || parseInt(item.N3)!=parseInt(item.score[2]))
                else
                  item.new=false
              }
              //console.log(this.list,item.new, item.score,item.N1,item.N2,item.N3)
              //item.new=(item.N1>50 && item.score)
            });
            // console.log(this.list)
          },
          (error) => { console.log(error); });
      },
      (error) => { console.log(error); });

  }

  openModal(title: string) {
    this.visible = true;
    this.modalTitle = title
  }

  getColor(value:any){
    let day=parseInt(value.substring(0,2))
    let month=parseInt(value.substring(3))
    let today = new Date().getDate();
    let fday=parseInt(this.fec1.substring(8))
    let fmonth=parseInt(this.fec1.substring(5))
    let days=this.service.getDaysBack(day)
    return fday==day && fmonth==month ? 'blue' : 'gray';
  }

  getBackColor(value:any){
    return value?'lightblue':'lightgray'
  }


  closModal() {
    this.visible = false;
    this.id = 0;
    this.status='';
    this.new=false;
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

  importar() {
    //window.alert(this.score)
    this.alert
      .validationAlertFunction(
        '¿Realmente desea Importar los Numeros Publicados en el otro portal?',
        'Si, Importar'
      )
      .then((res) => {
        if (res.isConfirmed) {
          this.form.controls['n1'].setValue(this.score[0]);
          this.form.controls['n2'].setValue(this.score[1]);
          this.form.controls['n3'].setValue(this.score[2]);
        }
      });
  }

  getOne(id: any,lotteryId:any=0) {
    this.new=false;
    this.score=[0,0,0]
    let data = this.list.filter((item: any) => item.Id == id && item.LotteryId==lotteryId);
//    console.log(data)
    //console.log(lotteryId,data[0].LotteryId)
    if (lotteryId!=data[0].LotteryId) data[0].LotteryId=lotteryId;
    //console.log(lotteryId,data[0].LotteryId)
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
    this.new= data[0].new
  //  window.alert(this.new)
    this.score=data[0].score
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
