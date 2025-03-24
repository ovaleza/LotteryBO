import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import {
  IBranch,
  IGroup,
  IReport,
  IVendor,
  ICriteria,
  ILottery,
} from 'src/app/models/master.models';
import { ActivatedRoute } from '@angular/router';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DatePipe } from '@angular/common';
import { PdfService } from 'src/app/services/pdf.service';
import { DataTableSearchPipe, NumbersPlayed } from 'src/app/pipes/data-table-search.pipe';

@Component({
  selector: 'app-r-most-popular',
  templateUrl: './r-most-popular.component.html',
  styleUrls: ['./r-most-popular.component.scss'],
})
export class RMostPopularComponent implements OnInit {
  public list: IReport[] = [];
  public criteria: ICriteria = {
    Name: 'view_most_popular',
    Criteria1: '',
    Criteria2: '',
    Criteria3: '',
    Criteria4: '',
    Criteria5: '',
    Criteria6: '',
    Criteria7: '',
    Criteria8: '',
    Criteria9: '',
    Criteria10: '',
    Criteria11: '',
    Criteria12: '',
  };
  public fileGroups: IGroup[] = [];
  public fileVendors: IVendor[] = [];
  public fileBranchs: IBranch[] = [];
  public fileLotteries: ILottery[] = [];
  public icons = freeSet;
  public visible = false;
  public form: FormGroup;
  public search: string = '';
  public colSearch: string = 'Column3';
  public status: string = '';

  public modalTitle: string = '';
  public id: number = 0;
  public page: any;
  public pages: number = 50;
  public name: string = '';
  public ReadMore: boolean = true;
  dataResult: any = [];
  pipe = new DatePipe('en-US');
  pipeNumbers = new NumbersPlayed();
  today = new Date();
  changedDate = '';

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

    //this.form = new FormGroup({});
  }

  ngOnInit(): void {
    this.service.getList('GetVendors').subscribe(
      (response) => {
        this.fileVendors = response['Vendors'];
      },
      (error) => {
        console.log(error);
      }
    );

    this.service.getList('GetGroups').subscribe(
      (response) => {
        this.fileGroups = response['Groups'];
      },
      (error) => {
        console.log(error);
      }
    );

    this.service.getList('GetBranches').subscribe(
      (response) => {
        this.fileBranchs = response['Branches'];
      },
      (error) => {
        console.log(error);
      }
    );

    this.service.getList('GetLotteries').subscribe(
      (response) => {
        this.fileLotteries = response['Lotteries'];
      },
      (error) => {
        console.log(error);
      }
    );
    this.reset()
  }

  reset() {
    let today = this.service.getToday();
    let oldDay = today;
    this.form = new FormGroup({
      date1: new FormControl(oldDay),
      date2: new FormControl(today),
      group: new FormControl(0),
      vendor: new FormControl(0),
      branch: new FormControl(0),
      mode: new FormControl(''),
      lottery: new FormControl(0),
    });
    //this.getAll();
  }

  getAll(){
this.page=1;
    this.criteria.Criteria1 = this.form.value['date1'];
    this.criteria.Criteria2 = this.form.value['date2'];
    this.criteria.Criteria3 = this.form.value['group'];
    this.criteria.Criteria4 = this.form.value['vendor'];
    this.criteria.Criteria5 = this.form.value['branch'];
    // this.criteria.Criteria6=this.form.value['activity']
    this.criteria.Criteria7 = this.form.value['lottery'];
    this.criteria.Criteria9 = this.form.value['mode'];

    this.service.postSearch('searchReport', this.criteria).subscribe(
      (response: any) => {
        this.list = response['Results'];

        let tAmount=0,tPrize=0
        for (let item of this.list){
          tAmount += parseFloat(item.Column4);
        }
        if (tAmount || tPrize) {
          let tot:any = {
          Column1 : `Totales (${this.list.length})`,
          Column2:'',
          Column3:'',
          Column4: tAmount,
          Column5:'',
          Column6:'',
          Status: '',
        }
        this.list.push(tot)
        }

      },
      (error) => {
        console.log(error);
      }
    );

  }

  getNumberValue(page: any) {
    this.pages = page.target.value;
  }

  getStatus(status: any) {
    this.status = status.target.value;
  }

  getColor(value: any) {
    return value < 0 ? 'red' : 'black';
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
          obj['Total Venta']=Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(row.Column4))
          obj.Numeros=this.pipeNumbers.transform(row.Column3)
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
      let title = `Numeros Mas Jugados Del: ${this.form.value['date1']} Al: ${this.form.value['date2']}`
      this.pdfMaker.pdfGenerate(headers, this.dataResult, title);
    } else {
      this.alert.errorAlertFunction(
        '!Oops algo salio mal, el no tienes data para generar PDF.'
      );
    }
  }

  generatePdf2() {
    let obj: any = {};
    let index: number = 0;

    this.list.forEach((element) => {
      obj = {
        No: (index += 1),
        Modalidad: element.Column2,
        Veces: element.Column3,
        Numeros: element.Column4,
        TotalVenta: element.Column5,
        UltimaJugada: element.Column6,
        EnDias: element.Column7,
      };
      this.dataResult.push(obj);
    });
    if (this.dataResult.length > 0) {
      let headers = [
        'No',
        'Modalidad',
        'Veces',
        'Numeros',
        'TotalVenta',
        'UltimaJugada',
        'EnDias',
      ];
      let title = `Numeros mas jugados Del: ${this.form.value['date1']} Al: ${this.form.value['date2']}`
      this.pdfMaker.pdfGenerate(headers, this.dataResult, title);
    } else {
      this.alert.errorAlertFunction(
        '!Oops algo salio mal, el no tienes data para generar PDF.'
      );
    }
  }
}
