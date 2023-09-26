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
    let ChangedFormat = this.pipe.transform(this.today, 'dd/MM/YYYY');
    this.changedDate = ChangedFormat;
  }

  pdfGenerate(
    columnsHeaderPdf: any,
    bodyPdf: any,
    titlePdf: any,
    footerPdf: any='',
    landscape: any=''
  ) {
    
    this.changeFormat(this.today);
    let userName: string = (localStorage.getItem('user')).substring(0,10);
    let company: string = localStorage.getItem('ciaName');

    const pdfDefinition: any = {
      footer: {
        columns: [
          { text: (footerPdf?footerPdf:this.service.footerReport), style: 'tableHeader', alignment: 'left', margin: 5 },
          { text: this.changedDate, alignment: 'center', margin: 5 }   ,       
          { text: 'User:'+userName, style: 'tableHeader', alignment: 'right', margin: 5  },          
        ],
      },
      
      pageOrientation: landscape=='landscape'?'landscape':'portrait',
      content: [
        { text: company, style: 'header' },        
        { text: titlePdf, style: 'header' },        
        { text: '', margin: 5 },
        this.table(bodyPdf, columnsHeaderPdf),
      ],
      defaultStyle: {
        fontSize: 8,
        bold: false,
        alignment:'center'
      },      
      styles: {
        header: {
          fontSize: 10,
          bold: true,
          alignment: 'left',
        },
        tableHeader: {
          color: '#000',
        },
      },
    };

    const pdf = pdfMake.createPdf(pdfDefinition);
    //pdf.download();   //para descargar automaticamente
    pdf.open();
    //pdf.open({}, window)  //para abrir en la misma pagina
    //pdf.print()      // para imprimir previsualizando y escogiendo impresora
    //pdf.print({}, window) // para imprimir en la misma pagina

    // pdf.getDataUrl((dataUrl) => {     // para frame o ventana dentro de pagina
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

    body.push(columnsHeaderPdf);

    bodyPdf.forEach(function (row) {
      var dataRow = [];

      columnsHeaderPdf.forEach(function (column) {
        dataRow.push(row[column].toString());
      });

      body.push(dataRow);
    });

    return body;
  }
}
