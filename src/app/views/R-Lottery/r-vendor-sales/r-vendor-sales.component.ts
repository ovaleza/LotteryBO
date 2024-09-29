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
import { DataTableSearchPipe, NumbersPlayed } from 'src/app/pipes/data-table-search.pipe';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-r-vendor-sales',
  templateUrl: './r-vendor-sales.component.html',
  styleUrls: ['./r-vendor-sales.component.scss']
})
export class RVendorSalesComponent implements OnInit {
  public list:IReport[]=[];
  public listPdf:IReport[]=[];
  public criteria:ICriteria= {
    Name:"report_vendor_sales",
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
  pipe = new DatePipe('en-US');
  pipeNumbers = new NumbersPlayed();
  today = new Date();
  changedDate = '';
  sort=true;

  constructor(
    private excelService: ExcelService,
    private activeRouter: ActivatedRoute,
    private alert: AlertService,
    public service: MasterService,
    private pdfMaker: PdfService
  ) {
    this.activeRouter.params.subscribe((params) => {
      this.id = params['id'];
      this.name = params['name'];
    });
    this.form= new FormGroup({});
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

  sortList() {
    this.sort=!this.sort
    if (!this.sort)
      this.list.sort((a, b) => b.Id-a.Id)
    else
    this.list.sort((a, b) => a.Id-b.Id)
  }

  exportToExcel(): void {
    let ttitle = document.getElementById("tableTitle");
    let theaders = ttitle.getElementsByTagName("th");
    let columns=theaders.length
    let headers=[]
    for (let i=0; i<columns;i++) {
      headers.push(theaders[i].innerHTML)
    }
    this.excelService.generateExcel(this.listPdf, 'Ventas_por_vendedor',headers);
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
    this.listPdf=[];
    this.service.postSearch('searchReport', this.criteria).subscribe(
      (response:any) => { this.list = response["Results"];
      for (let item of this.list) {
        item.Column14=(parseFloat(item.Column7)+parseFloat(item.Column10)+parseFloat(item.Column13)).toFixed(2).toString();
        let obj2:any;
        obj2 = {
          Column1: item.Column1,
          Column2: item.Column2,
          Column3: item.Column3,
          Column4: item.Column4,
          Column5: item.Column5,
          Column6: item.Column6,
          Column7: item.Column7,
          Column8: item.Column8,
          Column9: item.Column9,
          Column10: item.Column10,
          Column11: item.Column11,
          Column12: item.Column12,
          Column13: item.Column13,
          Column14: item.Column14,
        };
        this.listPdf.push(obj2)
      }

      if (this.list.length>0) {
        let tot:any = {
        Column1 : '',
        Column2 : `Totales (${this.list.length})`,
        Column3 : this.list.reduce((acumulador, actual) => acumulador + parseFloat(actual.Column3), 0),
        Column4 : this.list.reduce((acumulador, actual) => acumulador + parseFloat(actual.Column4), 0),
        Column5 : this.list.reduce((acumulador, actual) => acumulador + parseFloat(actual.Column5), 0),
        Column6 : this.list.reduce((acumulador, actual) => acumulador + parseFloat(actual.Column6), 0),
        Column7 : this.list.reduce((acumulador, actual) => acumulador + parseFloat(actual.Column7), 0),
        Column8 : this.list.reduce((acumulador, actual) => acumulador + parseFloat(actual.Column8), 0),
        Column9 : this.list.reduce((acumulador, actual) => acumulador + parseFloat(actual.Column9), 0),
        Column10 : this.list.reduce((acumulador, actual) => acumulador + parseFloat(actual.Column10), 0),
        Column11 : this.list.reduce((acumulador, actual) => acumulador + parseFloat(actual.Column11), 0),
        Column12 : this.list.reduce((acumulador, actual) => acumulador + parseFloat(actual.Column12), 0),
        Column13 : this.list.reduce((acumulador, actual) => acumulador + parseFloat(actual.Column13), 0),
        Column14 : this.list.reduce((acumulador, actual) => acumulador + parseFloat(actual.Column14), 0),
        }
        this.list.push(tot)
        this.listPdf.push(tot)
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
    if (this.listPdf.length > 0) {
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
          obj.Loteria=Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(parseFloat(row.Column3))
          obj.Comision=Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(parseFloat(row.Column4))
          obj.LoteriaC=Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(parseFloat(row.Column5))
          obj.Premios=Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(parseFloat(row.Column6))
          obj.NetoL=Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(parseFloat(row.Column7))
          // if (parseFloat(row.Column7)<0) {obj.NetoL=`{${obj.NetoL}*}`}
          obj.Recargas=Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(parseFloat(row.Column8))
          obj.ComiR=Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(parseFloat(row.Column9))
          obj.NetoR=Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(parseFloat(row.Column10))
          obj.Facturas=Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(parseFloat(row.Column11))
          obj.ComiF=Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(parseFloat(row.Column12))
          obj.NetoF=Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(parseFloat(row.Column13))
          obj.NETO=Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(parseFloat(row.Column14))
        //  if (parseFloat(row.Column14)<0) {obj.NETO=`{${obj.NETO}*}`}
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
      let elgrupo=this.criteria.Criteria3
      elgrupo=elgrupo>'0'?' / (*'+this.service.theGroup(elgrupo)+'*)':'(TODOS LOS GRUPOS)';
      let title = `Ventas x Vendedor Del: ${this.form.value['date1']} Al: ${this.form.value['date2']} ${elgrupo}`
      //this.pdfMaker.pdfGenerate(headers, this.dataResult, title);
      this.pdfMaker.pdfGenerate(headers, this.dataResult, title,'','landscape',10);
    } else {
      this.alert.errorAlertFunction(
        '!Oops algo salio mal, el no tienes data para generar PDF.'
      );
    }
  }


}
