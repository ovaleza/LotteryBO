import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { ILottery, ILotteryClosing } from 'src/app/models/master.models';


@Component({
  selector: 'app-lottery-closing',
  templateUrl: './lottery-closing.component.html',
  styleUrls: ['./lottery-closing.component.scss']
})
export class LotteryClosingComponent implements OnInit {
  public option: string = '0';
  public list:ILotteryClosing[]=[];
  public fileDays: any[]=[];
  public icons = freeSet;
  public visible = false;
  public form!: FormGroup | FormGroup;
  public search: string = ''
  public modalTitle: string = ''
  public id: number = 0
  public Xmas95 = new Date();
  public day = (this.Xmas95.getDay()+1).toString();
  public page: any
  public pages : number = 50

  constructor(private alert: AlertService, private service: MasterService) {
    this.setform()

  }

  setform() {
    this.form = new FormGroup({
      name: new FormControl(''),
      code: new FormControl(''),
      timeClose: new FormControl('13:00'),
      priority: new FormControl(1),
      dayName:new FormControl(''),
      day:  new FormControl(''),
      status: new FormControl('a'),
    });
  }

  ngOnInit(): void {
      this.fileDays=this.service.getWeedDays();
      this.getAll()
  }

  getAll(){
    this.page=1;
    this.service.getList('GetLotteryClosing').subscribe(
	    (response) => { this.list = response["LotteryClosing"].filter((item: any) => item.Day == this.day);
      this.list.sort((a, b) =>
      parseFloat(a.TimeClose)-parseFloat(b.TimeClose)
      // {
      //  let da:Date=new Date(a.TimeClose)
      //  let db:Date=new Date(b.TimeClose)

      //  return db.getDate()-da.getDate();
      // }
      );
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
    this.setform();
  }

  getNumberValue(page: any){
    this.pages = page.target.value;
  }

  // getDayValue(day: any){
  //   this.day = parseInt(day.target.value).toString();
  // }
  theDay(id:any){
    return this.fileDays[parseInt(id)-1].Name
  }

  getOne(id: any) {
    let data = this.list.filter((item: any) => item.Id == id);
    this.id = id;
    this.openModal('Actualizar Loteria')
    this.form = new FormGroup({
       name: new FormControl(data[0].Name, [Validators.maxLength(50),Validators.required]),
       code: new FormControl(data[0].Code, [Validators.maxLength(3),Validators.required]),
       timeClose: new FormControl(data[0].TimeClose),
       priority: new FormControl(data[0].Priority),
       dayName: new FormControl(this.theDay(data[0].Day)),
       day : new FormControl(data[0].Day),
       status: new FormControl(data[0].Status),
    });
  }

  add() {
    let obj: ILotteryClosing;
    if(this.form.valid && this.id!=0){
      obj = {
        Id: this.id,
        Cia:0,
        Code: this.form.value['code'],
        Name: this.form.value['name'],
        Day: this.form.value['day'],
        TimeClose: this.form.value['timeClose'],
        Priority: this.form.value['priority'],
        Status: this.form.value['status'],
        ResponseDescription: '',
        HasError: false
      }

      this.service.postItem('SaveLotteryClosing',obj).subscribe({
        next: (response: any) => {
          if (response.LotteryClosing.Id.toString()=='0')
            { this.alert.errorAlertFunction('Oops, algo salio mal, el ID = '
                + response.LotteryClosing.Id);
            }
          else {
          this.alert.successAlertFunction('Bien, Id: '+response.LotteryClosing.Id.toString());
          this.getAll()
          this.closModal()}
        },
        error: (error: any) => {
          console.log(error)
          this.alert.errorAlertFunction('Oops, algo salio mal, '
          + error.message
          );
        },
      })
    }
  }
}
