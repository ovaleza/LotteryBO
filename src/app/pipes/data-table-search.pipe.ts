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
    let sta ='';
    switch (value) {
      case value=='A' || value=='' :
        sta ='';
        break;
      case value= 'I':
        sta='Inactivo';
        break;
      case value='P' :
        sta='Premio Pagado';
        break;
      case value='N' :
        sta='Anulado';
        break;
      default:
        sta='';
    }
    return sta;
  }
}
