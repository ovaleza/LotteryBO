import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { ITicket, ILotteryLimit, ITransaction, IReport, ICriteria } from 'src/app/models/master.models';


@Component({
  selector: 'app-collect',
  templateUrl: './collect.component.html',
  styleUrls: ['./collect.component.scss']
})
export class CollectComponent implements OnInit {
  public option: string = '0';
  public list:IReport[]=[];
  public criteria:ICriteria= {
    Name:"view_monitor_collector",
    Criteria1:'', Criteria2:'', Criteria3:'', Criteria4:'', Criteria5:'', Criteria6:'',
    Criteria7:'', Criteria8:'', Criteria9:'', Criteria10:'', Criteria11:'', Criteria12:'',
  }
  public list2:ILotteryLimit[]=[];
  public fileGroups: any[]=[];
  public fileBranches: any[]=[];
  public fileVendors: any[]=[];
  public fileUsers: any[]=[];

  public icons = freeSet;
  public visible = true; correct = false; sta = ''; win=false
  public form!: FormGroup | FormGroup;
  public search: string = ''
  public modalTitle: string = ''
  public id: number = 0
  public page: any
  public pages : number = 50
  public hoy:string='';public ayer:string=''


  constructor(private alert: AlertService, public service: MasterService) {
    this.reset()
  }

  reset() {
    this.hoy=this.service.getToday()
    let ayer1=new Date()
    ayer1.setDate(ayer1.getDate()-120)
    this.ayer=this.service.getToday(ayer1)
    this.form = new FormGroup({
      serial: new FormControl(''),
      group : new FormControl('0'),
      branch: new FormControl('', Validators.required ),
      us: new FormControl(''),
      dateRef: new FormControl(this.hoy),
      vendor : new FormControl('', Validators.required ),
      collectUs : new FormControl('', Validators.required ),
      amount: new FormControl(0),
      status: new FormControl(''),
      box: new FormControl(0),
      missing: new FormControl(0),
      prizes: new FormControl(0),
      antipodal: new FormControl(false),
    });
  }

  ngOnInit(): void {
    this.service.getList('GetBranches').subscribe(
      (response) => { this.fileBranches = response["Branches"] },
      (error) => { console.log(error); });

    // this.service.getList('GetGroups').subscribe(
    //   (response) => { this.fileGroups = response["Groups"] },
    //   (error) => { console.log(error); });

    this.service.getList('GetUsers').subscribe(
      (response) => { this.fileUsers = response["Users"] },
      (error) => { console.log(error); });

    this.service.getList('GetVendors').subscribe(
      (response) => { this.fileVendors = response["Vendors"] },
      (error) => { console.log(error); });

    this.getAll()
  }

  getAll(){
    this.page=1;
      this.criteria.Criteria1=this.ayer
      this.criteria.Criteria2=this.hoy
      this.criteria.Criteria3=this.form.value['group']
      this.criteria.Criteria4=this.form.value['vendor']
      this.criteria.Criteria8=this.form.value['collectUs']
      this.service.postSearch('searchReport', this.criteria).subscribe(
        (response:any) =>
        {
          this.list = response["Results"];
          this.list.sort((a, b) =>
          parseFloat(b.Column1)-parseFloat(a.Column1)
          );
        }
        ,(error) => { console.log(error); });

  }

  openModal(title: string) {
    this.visible = true;    this.correct = false;
    this.modalTitle = title
  }

  closModal() {
    this.visible = false; this.correct=false
    this.id = 0;
    this.form.reset()
    this.reset();
  }

  getNumberValue(page: any){
    this.pages = page.target.value;
  }

  getOne() {
    if (!this.form.valid)
    {
      this.alert.errorAlertFunction('Debe definir Sucursal, Cajero y Remesador');
      return
    }

    let obj: any =
     {
      Id: 0,
      Cia:0,
      DateRef: this.form.value['dateRef'],
      Branch: this.form.value['branch'],
      Vendor: this.form.value['vendor'],
      Box : 0,
      Missing:0,
      Prizes:0,
      Amount: 0,
      ResponseDescription: '',
      HasError: false
    };
    this.service.postItem('RequestCollect',obj).subscribe({
      next: (response: any) => {
      let Tid=response.ReCollect.Id;
      if (Tid=='0')
        {
            this.alert.errorAlertFunction('Oops, algo salio mal');
        }
      else
       {
        if (response.ReCollect.Amount==0) {
          this.alert.errorAlertFunction('No hay nada que Remesar con estos parametros');
        }
        else {
          this.form.controls['box'].setValue(response.ReCollect.Box);
          this.form.controls['missing'].setValue(response.ReCollect.Missing);
          this.form.controls['prizes'].setValue(response.ReCollect.Prizes);
          this.form.controls['amount'].setValue(response.ReCollect.Amount);
          this.correct=true;
        }
       }
      },
      error: (error: any) => {
      console.log(error);
      this.alert.errorAlertFunction('Oops, algo salio mal, '
      + error.message
      );
      },
    })
    return
  }

  add() {
    if(this.form.valid){
      let obj: ITransaction;
      obj = {
        Id: this.id,
        Cia:0,
        Us:'',
        DateEnter:'',
        Type:'RR',
        Amount: this.form.value['amount'],
        Serial: this.form.value['serial'],
        Branch: this.form.value['branch'],
        CollectUs: this.form.value['collectUs'],
        Vendor: this.form.value['vendor'],
        DateRef: this.form.value['dateRef'],
        Antipodal: this.form.value['antipodal'],
        Status: this.form.value['status'],
        Note:'',
        ResponseDescription: '',
        HasError: false
      };
      this.service.postItem('SaveCollect',obj).subscribe({
        next: (response: any) => {
        let Tid=response.Transaction.Id;
        if (Tid=='0')
          {   this.alert.errorAlertFunction('Oops, algo salio mal, el ID = '
              + response.Transaction.Id);
          }
        else {
          this.alert.successAlertFunction('Bien, Id: '+Tid);
          this.search='';
          this.getAll();
          this.closModal();}
        },
        error: (error: any) => {
        console.log(error);
        this.alert.errorAlertFunction('Oops, algo salio mal, '
        + error.message
        );
        },
      })
    }
  }
  details() {
    this.alert
      .validationAlertFunction(
        '¿Quieres Ver los detalles?',
        'Si, detallar'
      )
      .then((res) => {
        if (res.isConfirmed) {
          this.alert.successAlertFunction('Aqui estan los detalles...');
        }
      });
  }
}
