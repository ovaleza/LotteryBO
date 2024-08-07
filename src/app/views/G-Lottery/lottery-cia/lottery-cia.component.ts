import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { ILottery, ILotteryCia ,ICompany} from 'src/app/models/master.models';


@Component({
  selector: 'app-lottery-cia',
  templateUrl: './lottery-cia.component.html',
  styleUrls: ['./lottery-cia.component.scss']
})
export class LotteryCiaComponent implements OnInit {
  public option: string = '0';
  public list:ILotteryCia[]=[];
  public listCias:ICompany[]=[];
  public fileGroups: any[]=[];
  public fileBranches: any[]=[];
  public fileLotteries: any[]=[];
  public companyLimits = {Max_Qui:0,Max_Pal:0,Max_Tri:0,Max_Sup:0}
  public icons = freeSet;
  public visible = false;
  public form!: FormGroup | FormGroup;
  public search: string = ''
  public modalTitle: string = ''
  public id: number = 0
  public Xmas95 = new Date();
  public page: any
  public pages : number = 50

  constructor(private alert: AlertService, public service: MasterService) {
    this.setform()

  }

  setform() {
    this.form = new FormGroup({
      group : new FormControl(0),
      branch: new FormControl(0),
      lottery : new FormControl(0),
      lotteryName : new FormControl(''),
      max_Qui: new FormControl(0),
      max_Pal: new FormControl(0),
      max_Tri: new FormControl(0),
      max_Sup: new FormControl(0),
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
    this.page=1;
    this.service.getList('GetCompanies').subscribe(
	    (response) => {
        this.listCias = response["Companies"];
        this.companyLimits.Max_Qui = this.listCias[0].Max_Qui
        this.companyLimits.Max_Pal = this.listCias[0].Max_Pal
        this.companyLimits.Max_Tri = this.listCias[0].Max_Tri
        this.companyLimits.Max_Sup = this.listCias[0].Max_Sup
      },
    	(error) => { console.log(error); });
    this.service.getList('GetLotteryCias').subscribe(
	    (response) => { this.list = response["LotteryCias"];},
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
    this.openModal('Actualizar Limites x Loteria')
    this.form = new FormGroup({
       group: new FormControl(data[0].Group),
       branch: new FormControl(data[0].Branch),
       lottery: new FormControl(data[0].Lottery),
       lotteryName: new FormControl(data[0].LotteryName),
       max_Qui: new FormControl(data[0].Max_Qui),
       max_Pal: new FormControl(data[0].Max_Pal),
       max_Tri: new FormControl(data[0].Max_Tri),
       max_Sup: new FormControl(data[0].Max_Sup),
       status: new FormControl(data[0].Status),
    });
  }
  add() {
    this.alert
      .validationAlertFunction('¿Hacer esas limitaciones de Apuestas', 'Si, Hacer')
      .then((res) => {
        if (res.isConfirmed)
        {
          let obj: ILotteryCia;
          if(this.form.valid){
            obj = {
              Id: 0,
              Cia:0,
              Group: this.form.value['group'],
              Branch: this.form.value['branch'],
              Lottery: this.form.value['lottery'],
              Max_Qui: this.form.value['max_Qui'],
              Max_Pal: this.form.value['max_Pal'],
              Max_Tri: this.form.value['max_Tri'],
              Max_Sup: this.form.value['max_Sup'],
              Status: this.form.value['status'],
              ResponseDescription: '',
              HasError: false
            }
            if(this.id){
              obj.Id= this.id
            }else{
              obj.Id= 0
            }
            this.service.postItem('SaveLotteryCia',obj).subscribe({
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
                  'Oops, algo salio mal, no fue posible registrar. '
                );
              },
            })
          }
          else this.alert.errorAlertFunction('Llene los campos obligatorios o con errores!');
        }
      });

  }
}
