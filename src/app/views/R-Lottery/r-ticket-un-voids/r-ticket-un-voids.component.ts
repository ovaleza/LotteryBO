import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { IBranch, IGroup, IReport, IVendor, ICriteria, ILottery} from 'src/app/models/master.models';
import { ActivatedRoute } from '@angular/router';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DatePipe } from '@angular/common';
import { PdfService } from 'src/app/services/pdf.service';


@Component({
  selector: 'app-r-ticket-un-voids',
  templateUrl: './r-ticket-un-voids.component.html',
  styleUrls: ['./r-ticket-un-voids.component.scss']
})
export class RTicketUnVoidsComponent implements OnInit {
  public list:IReport[]=[];
  public criteria:ICriteria= {
    Name:"report_ticket_un_voids",
    Criteria1:'', Criteria2:'', Criteria3:'', Criteria4:'', Criteria5:'', Criteria6:'',
    Criteria7:'', Criteria8:'', Criteria9:'', Criteria10:'', Criteria11:'', Criteria12:'',
  }
  public lotteries=0;winners=0;net=0;recharges=0;invoices=0;others=0;balance=0;balanceOT=0;
  public fileGroups: IGroup[]=[] ;
  public fileVendors: IVendor[]=[] ;
  public fileBranchs: IBranch[]=[] ;
  public fileLotteries: ILottery[]=[] ;
  public icons = freeSet;
  public visible = false;
  public form: FormGroup;
  public search: string = ''
  public status: string = ''

  public modalTitle: string = ''
  public id: number =0;
  public page: any
  public pages : number = 50
  public name: string = '';
  dataResult: any = [];

  constructor(
    private activeRouter: ActivatedRoute,
    private alert: AlertService,
    public service: MasterService,
    private pdfMaker: PdfService
  ) {
    this.activeRouter.params.subscribe((params) => {
      this.id = params['id'];
      this.name = params['name'];
    });
    this.form = new FormGroup({});
    this.reset()
  }

  reset(){
    let hoy=this.service.getToday()
    let viejo=hoy
    this.form = new FormGroup({
      date1: new FormControl(viejo),
      date2: new FormControl(hoy),
      group: new FormControl(0),
      vendor: new FormControl(0),
      branch: new FormControl(0),
      mode: new FormControl(''),
      lottery: new FormControl(0),
    });
  }
  ngOnInit(): void {
    this.service.getList('GetVendors').subscribe(
      (response) => { this.fileVendors = response["Vendors"] },
      (error) => { console.log(error); });

    this.service.getList('GetGroups').subscribe(
      (response) => { this.fileGroups = response["Groups"] },
      (error) => { console.log(error); });

    this.service.getList('GetBranches').subscribe(
        (response) => { this.fileBranchs = response["Branches"] },
        (error) => { console.log(error); });

    this.service.getList('GetLotteries').subscribe(
      (response) => { this.fileLotteries = response["Lotteries"] },
      (error) => { console.log(error); });

    this.getAll()
  }

  getAll(){
this.page=1;
    this.criteria.Criteria1=this.form.value['date1']
    this.criteria.Criteria2=this.form.value['date2']
    this.criteria.Criteria3=this.form.value['group']
    this.criteria.Criteria4=this.form.value['vendor']
    this.criteria.Criteria5=this.form.value['branch']
    // this.criteria.Criteria6=this.form.value['activity']
    this.criteria.Criteria7=this.form.value['lottery']
    this.criteria.Criteria9=this.form.value['mode']

    this.service.postSearch('searchReport', this.criteria).subscribe(
      (response:any) => { this.list = response["Results"];
      this.lotteries=0;this.winners=0;this.net=0;this.recharges=0;this.invoices=0;this.others=0;this.balance=0;this.balanceOT=0;

      let tAmount=0,tPrize=0
      for (let item of this.list){
        tAmount += parseFloat(item.Column5);
        // tPrize += parseFloat(item.Column10);
      }
      if (tAmount || tPrize) {
        let tot:any = {
          Column1 : '',
          Column2 : '',
          Column3 :'',
          Column4 : `Totales (${this.list.length})`,
          Column5: tAmount,
          Column6 : '',
          Column7: tAmount,
          Column8: tAmount,
          Column9: tAmount,
        Column10: tPrize,
        }
        this.list.push(tot)
      }
       },
      (error) => { console.log(error); });
  }
  getNumberValue(page: any){
    this.pages = page.target.value;
  }

  getStatus(status: any){
    this.status = status.target.value;
  }

  getColor(value:any){
    return value <0 ? 'red' : 'black';
  }
  generatePdf() {
    if (this.list.length > 0) {
      this.dataResult=[]
      let ttitle = document.getElementById("tableTitle");
      let theaders = ttitle.getElementsByTagName("th");
      let columns=theaders.length
      let headers=[]
      for (let i=0; i<columns;i++) {
        headers.push(theaders[i].innerHTML)
      }
      let tRows:any,obj:any,row:any

      if (true){
        // con este codigo toma todos los registros de la data obtenida
        tRows = this.list
        for (let x=0; x<tRows.length; x++) {
          row = tRows[x]
          obj= {};
          for (let i=0; i<columns;i++) {
            obj[headers[i]]= Object.values(row)[i]
          }
          obj.Apostado=Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(row.Column5))
          this.dataResult.push(obj);
        };
      }
      else
      {
        // con este codigo solo toma los registros presentados en la pagina de la pantalla html
        let tb = document.getElementById("tableBody");
        tRows = tb.getElementsByTagName("tr");
        for (let x=0; x<tRows.length; x++) {
          row = tRows[x].getElementsByTagName("td")
          obj= {};
          for (let i=0; i<columns;i++) {
            obj[headers[i]]= row[i].innerHTML
          }
          this.dataResult.push(obj);
        };
      }
      let title = `Tickets Rehabilitados x Usuario, Del: ${this.form.value['date1']} Al: ${this.form.value['date2']}`
      this.pdfMaker.pdfGenerate(headers, this.dataResult, title);
    } else {
      this.alert.errorAlertFunction(
        '!Oops algo salio mal, el no tienes data para generar PDF.'
      );
    }
  }


}
