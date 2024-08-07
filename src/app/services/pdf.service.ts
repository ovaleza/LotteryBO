import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MasterService } from 'src/app/services/master.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  changedDate = '';
  pipe = new DatePipe('en-US');
  today = new Date();
  constructor(
    public service: MasterService,
  ) {}

  changeFormat(today) {
    let ChangedFormat = this.pipe.transform(this.today, 'dd/MM/YYYY hh:mm');
    this.changedDate = ChangedFormat;
  }

  pdfGenerate(
    columnsHeaderPdf: any,
    bodyPdf: any,
    titlePdf: any,
    footerPdf: any='',
    landscape: any='',
    fontsize: any=8
  ) {

    this.changeFormat(this.today);
    let userName: string = (localStorage.getItem('user')).substring(0,10);
    let company: string = localStorage.getItem('ciaName');
    let generatedDate=this.changedDate

    footerPdf=footerPdf?footerPdf:this.service.footerReport
    const pdfDefinition: any = {
      // footer: {
      //   columns: [
      //     { text: (footerPdf?footerPdf:this.service.footerReport), style: 'tableHeader', alignment: 'left', margin: 5 },
      //     { text: this.changedDate, alignment: 'center', margin: 5 }   ,
      //     { text: 'User:'+userName, style: 'tableHeader', alignment: 'right', margin: 5  },
      //   ],
      // },
      footer: function(currentPage, pageCount) {
        return { columns: [footerPdf,'User:'+userName,generatedDate,{text:'Pagina: '+currentPage.toString() + '/' + pageCount.toString(),aligment:'left',marginRight:20}]}
       },
      header: function(currentPage, pageCount, pageSize) {
       // you can apply any logic and return any valid pdfmake element
        return [
          { text: '..', alignment: (currentPage % 2) ? 'left' : 'right' },
          { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
        ]
      },
      pageOrientation: landscape=='landscape'?'landscape':'portrait',
      content: [
        { text: company, style: 'header' },
        { text: titlePdf, style: 'header' },
        { text: '', margin: 0 },
        this.table(bodyPdf, columnsHeaderPdf),
      ],
      defaultStyle: {
        fontSize: fontsize,
        bold: false,
        alignment:'right'
      },
      styles: {
        header: {
          fontSize: fontsize*1.1,
          bold: true,
          alignment: 'left',
        },
        tableHeader: {
          color: '#000',
          bold: true,
          fillColor: 'lightgray',
          alignment: 'center',
        },
        tableRow: {
//          color: '#000',
          alignment: 'right',
        },
      },
    };

    const pdf = pdfMake.createPdf(pdfDefinition);
    //pdf.download();   //para descargar automaticamente
    //pdf.open();
    //pdf.open({}, window)  //para abrir en la misma pagina
    pdf.print()      // para imprimir previsualizando y escogiendo impresora
    //pdf.print({}, window) // para imprimir en la misma pagina

    // pdf.getDataUrl((dataUrl) => {     // para frame o ventana dentro de pagina
    //   console.log(dataUrl)
    //   const targetElement = document.querySelector('#iframeContainer');
    //   const iframe = document.createElement('iframe');
    //   iframe.src = dataUrl;
    //   targetElement.appendChild(iframe);
    // });
  }

  table(bodyPdf, columnsHeaderPdf) {
    return {
      table: {
        headerRows: 1,
        noBorders: true,
        headerLineOnly: true,
        //widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: this.buildTableBody(bodyPdf, columnsHeaderPdf),
      },
    };
  }

  buildTableBody(bodyPdf, columnsHeaderPdf) {
    var body = [];

    var dataRowHeader = [];
    columnsHeaderPdf.forEach(function (column) {
      dataRowHeader.push({
        text: column.toString(),
        style : 'tableHeader',
      })
    });
    //body.push(columnsHeaderPdf);
    body.push(dataRowHeader)

    bodyPdf.forEach(function (row) {
      var dataRow = [];
      let styleRow=(JSON.stringify(row).toString().toUpperCase().includes('TOTAL'))?'tableHeader':'tableRow'
      columnsHeaderPdf.forEach(function (column) {
        let text=row[column].toString()
        dataRow.push({ text: text, style: styleRow, color: text.includes('-$')?'red':'#000' })
      });
      body.push(dataRow);
    });

    return body;
  }
}
