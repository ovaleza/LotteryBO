import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { IBranch, IGroup, IReport, IVendor, ICriteria, ILottery} from 'src/app/models/master.models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-monitor-collector',
  templateUrl: './monitor-collector.component.html',
  styleUrls: ['./monitor-collector.component.scss']
})
export class MonitorCollectorComponent implements OnInit {
  public list:IReport[]=[];
  public criteria:ICriteria= {
    Name:"view_monitor_collector",
    Criteria1:'', Criteria2:'', Criteria3:'', Criteria4:'', Criteria5:'', Criteria6:'',
    Criteria7:'', Criteria8:'', Criteria9:'', Criteria10:'', Criteria11:'', Criteria12:'',
  }
  public fileGroups: any[]=[] ;
  public fileUsers: any[]=[] ;
  public fileVendors: any[]=[] ;
  public icons = freeSet;
  public visible = false;
  public form: FormGroup;
  public search: string = ''
  public status: string = ''
  public modalTitle: string = ''
  public id: number =0;
  public page: any
  public pages : number = 50
  public barra : number =0;
  public name: string = '';

  constructor(
    private activeRouter: ActivatedRoute,
    private alert: AlertService,
    public service:  MasterService
  ) {
    this.activeRouter.params.subscribe((params) => {
      this.id = params['id'];
      this.name = params['name'];

    });
    this.form = new FormGroup({})
    this.reset()
  }

  onclick()
  {
    this.visible = !this.visible
  }

  reset() {
    let hoy=this.service.getToday()
    let viejo=hoy
    this.form = new FormGroup({
      date1: new FormControl(viejo),
      date2: new FormControl(hoy),
      group: new FormControl(0),
      vendor: new FormControl(0),
      collectUs: new FormControl(0),
      branch: new FormControl(0),
      activity: new FormControl(0),
      lottery: new FormControl(0),
    });
    this.getAll()
  }

  ngOnInit(): void {
    this.service.getList('GetUsers').subscribe(
      (response) => { this.fileUsers = response["Users"] },
      (error) => { console.log(error); });

    this.service.getList('GetVendors').subscribe(
        (response) => { this.fileVendors = response["Vendors"] },
        (error) => { console.log(error); });

    this.service.getList('GetGroups').subscribe(
      (response) => { this.fileGroups = response["Groups"] },
      (error) => { console.log(error); });

    setInterval(() => this.myTimer(), 1000);

  }

  myTimer() {
    this.barra++;
    if (this.barra>=30) {this.barra=0;this.getAll();}
  }

  getAll(){
this.page=1;
    this.criteria.Criteria1=this.form.value['date1']
    this.criteria.Criteria2=this.form.value['date2']
    this.criteria.Criteria3=this.form.value['group']
    this.criteria.Criteria4=this.form.value['vendor']
    this.criteria.Criteria8=this.form.value['collectUs']
    // this.alert.soloAlert(this.criteria.Criteria5)

    this.service.postSearch('searchReport', this.criteria).subscribe(
      (response:any) => { this.list = response["Results"]},
      (error) => { console.log(error); });
  }

  getNumberValue(page: any){
    this.pages = page.target.value;
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
