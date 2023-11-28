import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { ILottery, ILotteryLimit } from 'src/app/models/master.models';


@Component({
  selector: 'app-lottery-limits',
  templateUrl: './lottery-limits.component.html',
  styleUrls: ['./lottery-limits.component.scss']
})
export class LotteryLimitsComponent implements OnInit {
  public option: string = '0';
  public list:ILotteryLimit[]=[];
  public fileGroups: any[]=[];
  public fileBranches: any[]=[];
  public fileLotteries: any[]=[];
  public icons = freeSet;
  public visible = false;
  public form!: FormGroup | FormGroup;
  public search: string = ''
  public modalTitle: string = ''
  public id: number = 0
  public Xmas95 = new Date();
  public page: any
  public pages : number = 25

  constructor(private alert: AlertService, public service: MasterService) {
    this.setform()

  }

  setform() {
    this.form = new FormGroup({
      code: new FormControl(''),
      group : new FormControl(0),
      branch: new FormControl(0),
      lottery : new FormControl(0),
      mode : new FormControl(''),
      limit: new FormControl(0),
      limitG: new FormControl(false),
      status: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.service.getList('GetBranches').subscribe(
      (response) => { this.fileBranches = response["Branches"] },
      (error) => { console.log(error); });

    this.service.getList('GetGroups').subscribe(
      (response) => { this.fileGroups = response["Groups"] },
      (error) => { console.log(error); });

    this.service.getList('GetLotteries').subscribe(
      (response) => { this.fileLotteries = response["Lotteries"] },
      (error) => { console.log(error); });

    this.getAll()
  }

  getAll(){
    this.service.getList('GetLotteryLimits').subscribe(
	    (response) => { this.list = response["LotteryLimits"]; },
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
       code: new FormControl(data[0].Code),
       group: new FormControl(data[0].Group),
       branch: new FormControl(data[0].Branch),
       lottery: new FormControl(data[0].Lottery),
       mode: new FormControl(data[0].Mode),
       limit: new FormControl(data[0].Limit),
       limitG: new FormControl(data[0].LimitG),
       status: new FormControl(data[0].Status),
    });
  }
  add() {
    if (this.form.value['limit']<=0) {
      this.alert.errorAlertFunction('Debe especificar el monto de limite a aplicar');
      return
    }
    this.alert
      .validationAlertFunction('¿Hacer esas limitaciones de Apuestas', 'Si, Hacer')
      .then((res) => {
        if (res.isConfirmed)
        {
          let obj: ILotteryLimit;
          if(this.form.valid){
            obj = {
              Id: 0,
              Cia:0,
              Code: this.form.value['code'],
              Group: this.form.value['group'],
              Branch: this.form.value['branch'],
              Lottery: this.form.value['lottery'],
              Mode: this.form.value['mode'],
              Limit: this.form.value['limit'],
              LimitG: this.form.value['limitG']?this.form.value['limit']:0,
              Status: this.form.value['status'],
              ResponseDescription: '',
              HasError: false
            }
            this.service.postItem('SaveLotteryLimit',obj).subscribe({
              next: (response: any) => {
                const rId:any=response.LotteryLimit.Id.toString();
                this.alert.successAlertFunction('Bien, Id: '+rId);
                this.getAll()
                this.closModal()
              },
              error: (error: any) => {
                console.log(error)
                this.alert.errorAlertFunction('Oops, algo salio mal, '
                + error.message
                );
              },
            })
          }

          this.alert.successAlertFunction('Loteria cerrada correctamente.');
        }
        // else this.alert.successAlertFunction('Loteria cerrada correctamente.');

      });

  }
}
