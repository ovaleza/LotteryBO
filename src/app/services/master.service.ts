import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UrlApiService } from './url-api.service';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { CanActivate, Router } from '@angular/router';
//import { IGroup, IBranch } from '../models/master.models';


@Injectable({
  providedIn: 'root',
})
export class MasterService {
  private url: string = '';
  private head: any;
  private fileLotteries: any[] = [];
  private fileProviders: any[] = [];
  private fileProvidersPack: any[] = [];
  private fileProvidersLN: any[] = [];
  private fileProvidersSS: any[] = [];

  public fileGroups: any[] = [];
  public fileBranches: any[] = [];
  public fileUsers: any[] = [];
  public fileProvidersRecharge: any[] = [];
  public fileVendors: any[] = [];
  public appItems:any[] = [];
  public fileTerminals:any[] = [];
  public fileTerminalTypes:any[] = [];
  public filePhoneProviders: any[] = [];
  public footerReport:string = `Valeza MultiPos V1.2`
  //public isAdm:boolean = false;

  constructor(
    private _Http: HttpClient,
    private apiUrl: UrlApiService,
    private route: Router
  ) {

    this.url = apiUrl.apiUrl;
    this.head = this.setHead()
    //this.token //apiUrl.apiKey;

    this.getList('GetProviders?type=').subscribe(
      (response) => {
        this.fileProviders = response['Providers'];
      },
      (error) => {
        console.log(error);
      }
    );

    this.getList('GetProviders?type=R').subscribe(
      (response) => {
        this.fileProvidersRecharge = response['Providers'];
      },
      (error) => {
        console.log(error);
      }
    );

    this.getList('GetProviders?type=P').subscribe(
      (response) => {
        this.fileProvidersPack = response['Providers'];
      },
      (error) => {
        console.log(error);
      }
    );

    this.getList('GetProviders?type=L').subscribe(
      (response) => {
        this.fileProvidersLN = response['Providers'];
      },
      (error) => {
        console.log(error);
      }
    );

    this.getList('GetProviders?type=S').subscribe(
      (response) => {
        this.fileProvidersSS = response['Providers'];
      },
      (error) => {
        console.log(error);
      }
    );

    this.theGroupReset()
    // this.getList('GetGroups').subscribe(
    //   (response) => {
    //     this.fileGroups = response['Groups'];
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );

    this.theBranchesReset()
    // this.getList('GetBranches').subscribe(
    //   (response) => {
    //     this.fileBranches = response['Branches'];
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );

    this.theLotteriesReset()
    // this.getList('GetLotteries').subscribe(
    //   (response) => {
    //     this.fileLotteries = response['Lotteries'];
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );

    this.theUsersReset()
    // this.getList('GetUsers').subscribe(
    //   (response) => {
    //     this.fileUsers = response['Users'];
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );

    this.theVendorsReset()
    // this.getList('GetVendors').subscribe(
    //   (response) => {
    //     this.fileVendors = response['Vendors'];
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );

    this.theTerminalsReset();

    this.theAppItemsReset();
    // this.getList('GetAppItems').subscribe(
    //   (response) => {
    //     this.appItems = response;
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );

    this.filePhoneProviders = this.getPhoneProviders();
    this.fileTerminalTypes = this.getTypeTerminals();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Algo pasa con la conexion; favor trate mas tarde.'));
  }

  getUrl(){
    return this.url.substring(7,25);
  }

  encriptar (texto:string){return texto.replace(/e/gi, "enter").replace(/i/gi, "imes").replace(/a/gi, "ai").replace(/o/gi, "ober").replace(/u/gi, "ufat");}
  desencriptar (texto:string){ return texto.replace(/enter/gi, "e").replace(/imes/gi, "i").replace(/ai/gi, "a").replace(/ober/gi, "o").replace(/ufat/gi, "u");}

  setHead() {
    this.head={ 'Content-Type': 'application/json','AUTH_TOKEN': String(localStorage.getItem('sessionToken'))}
    return this.head
  }

  setAdm() {
    return (String(localStorage.getItem('user')).toUpperCase()=='ADMIN' && String(localStorage.getItem('usrName')).toUpperCase()=='ADMINISTRADOR DEL SISTEMA')
  }

  setCiaUno() {
    return (String(localStorage.getItem('ciaName')).substring(0,12)=='Banca Wilson')
  }

  public setRole() {
    return (String(this.desencriptar(localStorage.getItem(this.encriptar('Role'))))).toUpperCase();
  }

  setDayEnabled(date1:any=this.getToday()) {
    return (date1==this.getToday())
  }

  getDaysBack(date1:any=this.getToday()) {
    var dateInit = new Date(date1).getTime();
    var dateFinal    = new Date(this.getToday()).getTime();
    var diff = dateFinal - dateInit;
    var days = diff/(1000*60*60*24) // (1000*60*60*24) --> milisegundos -> segundos -> minutos -> horas -> días
    return days;
  }

  getToday(date: any = new Date()) {
    return (
      date.getFullYear().toString() +
      '-' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      date.getDate().toString().padStart(2, '0')
    );
  }

  getMonthIni(date: any = new Date()) {
    return (
      date.getFullYear().toString() +
      '-' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '-' + '01'
    );
  }

  getList(endpoint: string): Observable<any> {
    const headers = this.setHead()
    let lista: any = this._Http.get(`${this.url}/${endpoint}`, { headers });
    return lista;
  }

  getNewReferenciaCliente(){
    var date: any = new Date()
    date = date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    date.getDate().toString().padStart(2, '0')+
    date.getSeconds().toString().padStart(2, '0')+
    date.getUTCMilliseconds().toString().padStart(2, '0')
    let huella='001';
    if (huella.length>3) huella=huella.substring(0,3);
    return date+huella
  }

  getRechargeBalance(referenciaCliente:string="oficina123456") {
    const headers = this.setHead()
    referenciaCliente='oficina123456'
    return this._Http.get(`${this.url}/GetSaldoRecargas?referenciaCliente=${referenciaCliente}`, { headers })
      .pipe(retry(3), catchError(this.handleError));
  }

  getBanks(referenciaCliente:string="1234567890123456") {
    const headers = this.setHead()
    return this._Http.get(`${this.url}/GetDSBancos?referenciaCliente=${referenciaCliente}`, { headers })
      .pipe(retry(3), catchError(this.handleError));
  }

  postItem(endpoint: string, body: any) {
    const headers = this.setHead()
    return this._Http.post(`${this.url}/${endpoint}`, body, { headers })
    .pipe(retry(3), catchError(this.handleError));
  }

  postSearch(endpoint: string, body: any) {
    const headers = this.setHead()
    return this._Http.post(`${this.url}/${endpoint}`, body, { headers })
    .pipe(retry(3), catchError(this.handleError));
  }

  getPhoneProviders(): any {
    return [
      { Id: 1, Name: 'Claro' },
      { Id: 2, Name: 'Altice' },
      { Id: 3, Name: 'Viva' },
      { Id: 9, Name: 'Otros' },
    ];
  }

  getTypeTerminals(): any[] {
    return [
      { Id: 1, Name: 'PC' },
      { Id: 2, Name: 'Movil' },
      { Id: 9, Name: 'Otros' },
    ];
  }

  getTypeVendors(): any[] {
    return [
      { Id: 1, Name: 'Mixto' },
      { Id: 2, Name: 'Web' },
      { Id: 3, Name: 'Movil' },
      { Id: 9, Name: 'Otros' },
    ];
  }
  theTypeVendor(id: any) {
    return this.getTypeVendors().find((element) => element.Id == id)?.Name;
  }

  getPositionUsers(): any[] {
    return [
      { Id: 1, Name: 'Administrador' },
      { Id: 2, Name: 'Oficinista' },
      { Id: 3, Name: 'Supervisor' },
      { Id: 4, Name: 'Cajero' },
      { Id: 5, Name: 'Visita' },
      { Id: 6, Name: 'Otros' },
    ];
  }

  getLevelUsers(): any[] {
    return [
      { Id: 1, Name: 'Total' },
      { Id: 2, Name: 'Agregar' },
      { Id: 3, Name: 'Consultar' },
      { Id: 9, Name: 'Nada' },
    ];
  }
  getModes(): any[] {
    return [
      { Id: 'Q', Name: 'Quiniela' },
      { Id: 'P', Name: 'Pale' },
      { Id: 'T', Name: 'Tripleta' },
      { Id: 'S', Name: 'SuperPale' },
      { Id: '4', Name: '4Numeros' },
      { Id: 'O', Name: 'Otros!' },
    ];
  }
  theMode(id: any) {
    id = id.substring(0, 1);
    return this.getModes().find((element) => element.Id == id)?.Name;
  }

  getWeedDays(): any[] {
    return [
      { Id: 1, Name: 'Domingo' },
      { Id: 2, Name: 'Lunes' },
      { Id: 3, Name: 'Martes' },
      { Id: 4, Name: 'Miercoles' },
      { Id: 5, Name: 'Jueves' },
      { Id: 6, Name: 'Viernes' },
      { Id: 7, Name: 'Sabado' },
    ];
  }

  getGroups() {
    this.getList('GetGroups').subscribe(
      (response) => {
        this.fileGroups = response['Groups'];
      },
      (error) => {
        console.log(error);
      }
    );
    return this.fileGroups;
  }

  theGroupReset(){
    this.getList('GetGroups').subscribe(
      (response) => {
        this.fileGroups = response['Groups'];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  theGroup(id: any) {
    return this.fileGroups.find((element) => element.Id == id)?.Name;
  }

  theProvider(id: any) {
    return this.fileProviders.find((element) => element.Id == id)?.Name;
  }

  theBranchesReset() {
    this.getList('GetBranches').subscribe(
      (response) => {
        this.fileBranches = response['Branches'];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  theBranch(id: any) {
    return this.fileBranches.find((element) => element.Id == id)?.Name;
  }

  theLotteriesReset(){
    this.getList('GetLotteries').subscribe(
      (response) => {
        this.fileLotteries = response['Lotteries'];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  theLottery(id: any) {
    return this.fileLotteries.find((element) => element.Id == id)?.Name;
  }

  theWinner(winer: boolean, sta: string, amo: number, pri: number) {
    sta = sta.trim();
    sta = sta=='R'?'':sta;
    return winer && sta == '' && amo != 0 && pri != 0;
  }

  theStatus(value:any){
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
          sta='Pagado';
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
  getUsers()  {
    this.getList('GetUsers').subscribe(
      (response) => {
        this.fileUsers = response['Users'];
      },
      (error) => {
        console.log(error);
      }
    );
    return this.fileUsers;
  }

  theUsersReset() {
    this.getList('GetUsers').subscribe(
      (response) => {
        this.fileUsers = response['Users'];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  theVendorsReset() {
    this.getList('GetVendors').subscribe(
      (response) => {
        this.fileVendors = response['Vendors'];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  theTerminalsReset(){
    this.getList('GetTerminals').subscribe(
      (response) => { this.fileTerminals = response["Terminals"] },
      (error) => { console.log(error); });
  }

  theUser(id: any) {
    return this.fileUsers.find((element) => element.Id == id)?.Name;
  }

  theVendor(id: any) {
    return this.fileVendors.find((element) => element.Id == id)?.Name;
  }

  theTerminalType(id: any) {
    return this.fileTerminalTypes.find((element) => element.Id == id)?.Name;
  }

  thePhoneProvider(id: any) {
    return this.filePhoneProviders.find((element) => element.Id == id)?.Name;
  }

  theAppItemsReset(){
    this.getList('GetAppItems').subscribe(
      (response) => {
        this.appItems = response;
      },
      (error) => {
        console.log(error);
      }
    );

  }

  getColor(value: any) {
    return value < 0 ? 'red' : 'black';
  }

  // deleteItem(id: any) {
  //   return this._Http.delete(`${this.url}/lotteries/${id}`);
  // }

  // getItem(id: any) {
  //   return this._Http.get(`${this.url}/lotteries/${id}`);
  // }

  // patchItem(id: number, body: any) {
  //   return this._Http.patch(`${this.url}/lotteries/${id}`, body);
  // }

  canActivate(): any {
    if (localStorage.getItem('sessionStart') == 'Done') {
      return true;
    } else {
      this.route.navigate(['/login']);
      return false;
    }
  }

  login(data: any) {
    return this._Http.post(`${this.url}/login`, data)
    .pipe(retry(3), catchError(this.handleError));
  }

  // appItems(data: any) {
  //   return this._Http.post(`${this.url}/login`, data)
  //   .pipe(retry(3), catchError(this.handleError));
  // }

}
