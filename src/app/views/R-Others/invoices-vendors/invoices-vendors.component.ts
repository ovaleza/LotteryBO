import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { IBranch, IGroup, IReport, IVendor, ICriteria, ILottery, IProvider} from 'src/app/models/master.models';
import { ActivatedRoute } from '@angular/router';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DatePipe } from '@angular/common';
import { PdfService } from 'src/app/services/pdf.service';
import { DataTableSearchPipe, NumbersPlayed, DateToLocale } from 'src/app/pipes/data-table-search.pipe';

@Component({
  selector: 'app-invoices-vendors',
  templateUrl: './invoices-vendors.component.html',
  styleUrls: ['./invoices-vendors.component.scss']
})
export class InvoicesVendorsComponent implements OnInit {
  public list:IReport[]=[];
  public criteria:ICriteria= {
    Name:"report_invoices_sales",
    Criteria1:'', Criteria2:'', Criteria3:'', Criteria4:'', Criteria5:'', Criteria6:'',
    Criteria7:'', Criteria8:'', Criteria9:'', Criteria10:'', Criteria11:'', Criteria12:'',
  }
  public lotteries=0;winners=0;net=0;recharges=0;invoices=0;others=0;balance=0;balanceOT=0;
  public fileGroups: IGroup[]=[] ;
  public fileVendors: IVendor[]=[] ;
  public fileBranchs: IBranch[]=[] ;
  public fileLotteries: ILottery[]=[] ;
  public fileProviders: IProvider[]=[];
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


        this.service.getList('GetProviders?type=S').subscribe(
          (response) => {
            this.fileProviders = response['Providers'];
          },
          (error) => {
            console.log(error);
          }
        );
    // this.service.getList('GetProviders').subscribe(
    //   (response) => { this.fileProviders = response["Providers"] },
    //   (error) => { console.log(error); });

    //this.fileProviders=this.service.fileProvidersRecharge
    //this.getAll()
  }

  getAll(){
this.page=1;

    this.criteria.Criteria1=this.form.value['date1']
    this.criteria.Criteria2=this.form.value['date2']
    this.criteria.Criteria3=this.form.value['group']
    this.criteria.Criteria4=this.form.value['vendor']
    this.criteria.Criteria5=this.form.value['branch']
    this.criteria.Criteria6=this.form.value['activity']
    this.criteria.Criteria7=this.form.value['lottery']
    this.criteria.Criteria9=this.form.value['mode']
    this.service.postSearch('searchReport', this.criteria).subscribe(
      (response:any) => { this.list = response["Results"];
      this.lotteries=0;this.winners=0;this.net=0;this.recharges=0;this.invoices=0;this.others=0;this.balance=0;this.balanceOT=0;
      let tAmount=0,tComi=0,tNeto=0
      const array:any []=[]
      for (let item of this.list){
        tAmount += parseFloat(item.Column3);
        tComi += parseFloat(item.Column4);
        tNeto += parseFloat(item.Column5);
        let obj = {
          data : {
            qty : item.Column3,
            id : item.Column7,
          }
        }
        array.push(obj)
      }

      // const
      // array = [
      //   { data: { qty: "5", id: "Claro"} },
      //   { data: { qty: "5", id: "Altice" } },
      //   { data: { qty: "59", id: "Viva" } },
      // ],
      let result = Object.values(
        array.reduce((r, { data }) => {
          const k = data.id;
          if (r[k]) {
            r[k].data.qty = String(Number(r[k].data.qty) + Number(data.qty));
          } else {
            r[k] = { data };
          }
          return r;
        }, {})
      );
      // console.log(result);

      if (tAmount || tComi || tNeto) {
        let tot:any = {
          Column1:'',
          Column2:`Totales (${this.list.length})`,
          Column3:tAmount,
          Column4:tComi,
        Column5 : tNeto,
        Column6: '',
        Column7:'',
        Column8:'',
        Column9:'',
        Column10:'',
        Column11: '',
        Status: '',
      }
      this.list.push(tot)
      }

      if (result) {
        let blank:any =
        {
          Column1:'',
          Column2: '',
          Column3: '',
          Column4: '',
        Column5 : '',
        Column6: '',
        Column7:'',
        Column8:'',
        Column9:'',
        Column10:'',
        Column11: '',
        Status: '',
        }
        let resu:any =
        {
          Column1:'',
          Column2: 'RESUMEN:',
          Column3: '',
          Column4: '',
        Column5 : '',
        Column6: '',
        Column7:'',
        Column8:'',
        Column9:'',
        Column10:'',
        Column11: '',
        Status: '',
        }

        this.list.push(blank)
        this.list.push(resu)

        for (let item of result){
          let tot:any = {
            Column1:'',
            Column2: item['data']['id'],
            Column3: item['data']['qty'],
            Column4: '0',
          Column5 : '0',
          Column6: '',
          Column7:'',
          Column8:'',
          Column9:'',
          Column10:'',
          Column11: '',
          Status: '',
        }
        this.list.push(tot)
      }
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
          obj.Monto=Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(row.Column3))
          obj.Comision=Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(row.Column4))
          obj.Neto=Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(row.Column5))
//          obj.Numeros=this.pipeNumbers.transform(row.Column4)
          obj.Fecha = new DateToLocale().transform(row.Column2);

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
      let title = `Recargas x Vendedor Del: ${this.form.value['date1']} Al: ${this.form.value['date2']}`
      this.pdfMaker.pdfGenerate(headers, this.dataResult, title);
    } else {
      this.alert.errorAlertFunction(
        '!Oops algo salio mal, el no tienes data para generar PDF.'
      );
    }
  }


}
