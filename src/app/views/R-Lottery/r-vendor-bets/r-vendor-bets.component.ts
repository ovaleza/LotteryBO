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
import { DataTableSearchPipe, NumbersPlayed, DateToLocale } from 'src/app/pipes/data-table-search.pipe';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-r-vendor-bets',
  templateUrl: './r-vendor-bets.component.html',
  styleUrls: ['./r-vendor-bets.component.scss']
})
export class RVendorBetsComponent implements OnInit {
  public list:IReport[]=[];
  public listPdf:IReport[]=[];
  public criteria:ICriteria= {
    Name:"report_vendor_bets",
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
  public isAdm : boolean=false;
  public isOff : boolean=false;
  public isDay : boolean=false;
  public isOwn : boolean=false;


  public name: string = '';
  dataResult: any = [];
  pipe = new DatePipe('en-US');
  pipeNumbers = new NumbersPlayed();
  today = new Date();
  changedDate = '';


  constructor(
    private excelService: ExcelService,
    private activeRouter: ActivatedRoute,
    private alert: AlertService,
    public service:  MasterService,
    private pdfMaker: PdfService
  ) {
    this.activeRouter.params.subscribe((params) => {
      this.id = params['id'];
      this.name = params['name'];
    });
    this.form = new FormGroup({});
    this.reset()
  }

  setdate1(d1:any=new Date(),d2:any=new Date()) {
    if (d1>d2)this.form.controls['date1'].setValue(d2)
  }

  setdate2(d1:any=new Date()) {
    this.form.controls['date2'].setValue(d1)
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
      activity: new FormControl(0),
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
     //this.getAll()
  }

  exportToExcel(): void {
    let ttitle = document.getElementById("tableTitle");
    let theaders = ttitle.getElementsByTagName("th");
    let columns=theaders.length
    let headers=[]
    for (let i=0; i<columns;i++) {
      headers.push(theaders[i].innerHTML)
    }
    this.excelService.generateExcel(this.listPdf, 'Listado_Apuestas',headers);
  }

  getAll(){
    this.page=1;
    this.isAdm=this.service.setAdm()
    this.isOff=this.service.setRole()=='OFICINA'
    this.isOwn=this.service.setRole()=='ADMIN'
    this.criteria.Criteria1=this.form.value['date1']
    this.criteria.Criteria2=this.form.value['date2']
    this.criteria.Criteria3=this.form.value['group']
    this.criteria.Criteria4=this.form.value['vendor']
    this.criteria.Criteria5=this.form.value['branch']
    this.criteria.Criteria6=this.form.value['activity']
    this.criteria.Criteria7=this.form.value['lottery']
    this.criteria.Criteria9=this.form.value['mode']
    this.list=[];
    this.listPdf=[];
    this.service.postSearch('searchReport', this.criteria).subscribe(
      (response:any) => { this.list = response["Results"];
      this.lotteries=0;this.winners=0;this.net=0;this.recharges=0;this.invoices=0;this.others=0;this.balance=0;this.balanceOT=0;
      let tAmount=0,tPrize=0
      for (let item of this.list){
        let obj2: any;
        obj2 = {
          Column1: item.Column1,
          Column2: item.Column3,
          Column3: item.Column4,
          Column4: item.Column5,
          Column5: item.Column6,
          Column6: item.Column7,
          Column7 : item.Column8,
          Column8 : item.Column9,
          Column9 : item.Column10,
          Column10 : item.Column11
        };
        this.listPdf.push(obj2)
        tAmount += parseFloat(item.Column6);
        tPrize += parseFloat(item.Column11);
      }
      if (tAmount || tPrize) {
        let tot:any = {
          Column1:'',
          Column2:'',
          Column3:'',
          Column4:'',
        Column5 : `Totales (${this.list.length})`,
        Column6: tAmount,
        Column7:'',
        Column8:'',
        Column9:'',
        Column10:'',
        Column11: tPrize,
        Status: '',
        }
        let tot2:any= {
          Column1:'',
          Column2:`Totales (${this.list.length})`,
          Column3:'',
          Column4:'',
        Column5 : tAmount,
        Column6: '',
        Column7:'',
        Column8:'',
        Column9:'',
        Column10: tPrize,
        }
      this.list.push(tot)
      this.listPdf.push(tot2)
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
        tRows = this.listPdf
        for (let x=0; x<tRows.length; x++) {
          row = tRows[x]
          obj= {};
          for (let i=0; i<columns;i++) {
            obj[headers[i]]= Object.values(row)[i]
          }
          obj.Monto=Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(row.Column5))
          obj.Premio=Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(row.Column10))
          obj.Numeros=this.pipeNumbers.transform(row.Column3)
          obj.Fecha = new DateToLocale().transform(row.Column8);

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
      let title = `Apuestas x Vendedor Del: ${this.form.value['date1']} Al: ${this.form.value['date2']}`
      this.pdfMaker.pdfGenerate(headers, this.dataResult, title);
    } else {
      this.alert.errorAlertFunction(
        '!Oops algo salio mal, el no tienes data para generar PDF.'
      );
    }
  }
}
