import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataTableSearch'
})


export class DataTableSearchPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;

    args = args.toLowerCase();

    return value.filter((item: any) => {
      return JSON.stringify(item).toLocaleLowerCase().includes(args);
    });
  }
}
@Pipe({name: 'activeBlocked'})
export class ActiveBlockedPipe implements PipeTransform {
    transform(value:any) {
        return value ? 'Active' : 'Blocked';
    }
}

@Pipe({
  name: 'siNo'
})
export class StringToBooleanPipe implements PipeTransform {
  transform(value:any) {
    return value=='True' ? 'Si' : 'No';
  }
}

@Pipe({
  name: 'noSi'
})
export class StringToBooleanNotPipe implements PipeTransform {
  transform(value:any) {
    return value!='True' ? 'Si' : 'No';
  }
}

@Pipe({
  name: 'todos'
})
export class ZeroToOtros implements PipeTransform {
  transform(value:any, value2:string) {
    return value=='0' ? 'Todos' : value2;
  }
}

@Pipe({
  name: '1_0'
})
export class BoooleanToNumberPipe implements PipeTransform {
  transform(value:any) {
    return value=='True' ? 1 : 0;
  }
}


@Pipe({
  name: 'status'
})
export class StatusLong implements PipeTransform {
  transform(value:any) {
    value=value.toUpperCase()
    let sta =value;
    switch (value) {
      case 'A' :
        sta ='';
        break;
      case 'I' :
        sta='Inactivo';
        break;
      case 'P' :
        sta='Premio Pagado';
        break;
      case 'N' :
        sta='Anulado';
        break;
      case 'R' :
          sta='ReHabilitado';
          break;
      default:
        sta='';
        break
    }
    return sta;
  }
}

@Pipe({
  name: 'datePrint'
})
export class DateToLocale implements PipeTransform {
  transform(value:any) {
    let d = new Date(value);
    if ( d instanceof Date &&isFinite( d.getTime()) ) {
      value=d.toLocaleString();
     }
    //return isNaN(value.substring(0,2))? d.toLocaleString():value;
    return value
  }
}

@Pipe({
  name:'numeros'
})
export class NumbersPlayed implements PipeTransform {
  transform(value: string) {
    let lvalue = value.length;
    switch (lvalue) {
        case 4:
            value = value.substring(0, 2) + '-' + value.substring(2, 4);
            break;
        case 6:
            value =
                value.substring(0, 2) +
                '-' +
                value.substring(2, 4) +
                '-' +
                value.substring(4, 6);
            break;
    }
    return value;
  }
}
