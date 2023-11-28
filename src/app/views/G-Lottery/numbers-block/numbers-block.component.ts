import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
//import { BranchService } from '../../services/branch.service';
//import { GroupService } from '../../services/group.service';
import { MasterService } from 'src/app/services/master.service';
import { IBlockNumber, IGroup, IBranch, ILottery, IBasic } from 'src/app/models/master.models';

@Component({
  selector: 'app-numbers-block',
  templateUrl: './numbers-block.component.html',
  styleUrls: ['./numbers-block.component.scss']
})
export class NumbersBlockComponent implements OnInit {
  public list:IBlockNumber[]=[];
  public fileGroups: IBasic[]=[] ;
  public fileBranches: IBasic[]=[] ;
  public fileModes: any[]=[] ;
  public fileLotteries: ILottery[]=[] ;
  public icons = freeSet;
  public visible = false;
  public form!: FormGroup;
  public search: string = ''
  public status: string = ''
  public modalTitle: string = ''
  public id: number =0;
  public page: any
  public pages : number = 25

  constructor(private alert: AlertService , public service: MasterService) {
   this.formReset()
  }

  formReset(){
    this.form = new FormGroup({
      group: new FormControl('0'),
      branch: new FormControl('0'),
      dateEnter: new FormControl(''),
      mode: new FormControl('0'),
      lottery: new FormControl('0'),
      numbers: new FormControl('0'),
      note: new FormControl(''),
      action: new FormControl(''),
      status: new FormControl('')
    })
  }
  ngOnInit(): void {
    this.service.getList('GetGroups').subscribe(
      (response) => { this.fileGroups = response["Groups"] },
      (error) => { console.log(error); });

    this.service.getList('GetBranches').subscribe(
      (response) => { this.fileBranches = response["Branches"] },
      (error) => { console.log(error); });
    this.service.getList('GetLotteries').subscribe(
      (response) => { this.fileLotteries = response["Lotteries"] },
     (error) => { console.log(error); });

    this.fileModes=this.service.getModes()
    // this.fileModes.push({Id: 'Q',Name: 'Quiniela'})
    //this.fileModes.push({Id:'0',Name:"Todos"})
    this.getAll()
  }

  getAll() {
    this.service.getList('GetBlockNumbers').subscribe(
	    (response) => { this.list = response["BlockNumbers"] },
    	(error) => { console.log(error); });
  }

  openModal(title: string) {
    this.visible = true;
    this.modalTitle = title
    this.formReset;
  }

  closModal() {
    this.visible = false;
    this.id = 0;
    this.form.reset()
    this.formReset;
  }

  getNumberValue(page: any){
    this.pages = page.target.value;
  }

  getStatus(status: any){
    this.status = status.target.value;
  }

  getOne(id: any) {
    let data = this.list.filter((item: any) => item.Id == id);
    this.openModal('Actualizar Bloqueo Numero')
    this.form = new FormGroup({
      group: new FormControl(data[0].Group),
      branch: new FormControl(data[0].Branch),
      dateEnter: new FormControl(data[0].DateEnter),
      mode: new FormControl(data[0].Mode),
      lottery: new FormControl(data[0].Lottery),
      numbers: new FormControl(data[0].Numbers),
      note: new FormControl(data[0].Note ),
      action: new FormControl(data[0].Action),
      status: new FormControl(data[0].Status),
    });
    this.id = id
  }

  add() {
    const nn=this.form.value['numbers']
    const nt=this.form.value['note']
    if (nn && nn && nn<100){
    let obj: IBlockNumber;
    if(this.form.valid){
      obj = {
        Id: 0,
        Cia:0,
        Group: this.form.value['group'],
        Branch: this.form.value['branch'],
        DateEnter: '',
        Mode: this.form.value['mode'],
        Lottery: this.form.value['lottery'],
        Numbers: this.form.value['numbers'],
        Note: this.form.value['note'],
        Action: this.form.value['action'],
        Status: this.form.value['status'],
        ResponseDescription: '',
        HasError: false
      }
      if(this.id){
        obj.Id= this.id
      }else{
        obj.Id= 0
      }

      this.service.postItem('SaveBlockNumber',obj).subscribe({
        next: (response: any) => {
          this.alert.successAlertFunction('Bloqueo creado correctamente');
          this.getAll()
          this.closModal()
        },
        error: (error: any) => {
          this.alert.errorAlertFunction(
            'Oops, algo salio mal, valide que todos los campos esten llenos.'
          );
        },
      })
    }
  }
  else this.alert.errorAlertFunction('Debe especificar un numero y una Nota.')
}



}
