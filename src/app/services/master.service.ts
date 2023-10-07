import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlApiService } from './url-api.service';
import { Observable } from 'rxjs';
import { CanActivate, Router } from '@angular/router';
//import { IGroup, IBranch } from '../models/master.models';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  private url: string = '';
  private head: any;
  private fileGroups: any[] = [];
  private fileBranches: any[] = [];
  private fileLotteries: any[] = [];
  private fileUsers: any[] = [];
  private fileProviders: any[] = [];
  private fileProvidersRecharge: any[] = [];
  private fileProvidersPack: any[] = [];
  private fileProvidersLN: any[] = [];
  private fileProvidersSS: any[] = [];
  public fileVendors: any[] = [];
  public fileTerminalTypes: any[] = [];
  public filePhoneProviders: any[] = [];
  public footerReport:string = `Valeza MultiPos V1.0`

  constructor(
    private _Http: HttpClient,
    private apiUrl: UrlApiService,
    private route: Router
  ) {

    this.url = apiUrl.apiUrl;
    this.head = this.setHead()
    //this.token //apiUrl.apiKey;

    this.getList('GetGroups').subscribe(
      (response) => {
        this.fileGroups = response['Groups'];
      },
      (error) => {
        console.log(error);
      }
    );

    this.getList('GetProviders?type=').subscribe(
      (response) => {
        this.fileProviders = response['Providers'];
      },
      (error) => {
        console.log(error);
      }
    );

    this.getList('GetProviders?type=RR').subscribe(
      (response) => {
        this.fileProvidersRecharge = response['Providers'];
      },
      (error) => {
        console.log(error);
      }
    );
    this.getList('GetProviders?type=PP').subscribe(
      (response) => {
        this.fileProvidersPack = response['Providers'];
      },
      (error) => {
        console.log(error);
      }
    );

    this.getList('GetProviders?type=LN').subscribe(
      (response) => {
        this.fileProvidersLN = response['Providers'];
      },
      (error) => {
        console.log(error);
      }
    );
    this.getList('GetProviders?type=SS').subscribe(
      (response) => {
        this.fileProvidersSS = response['Providers'];
      },
      (error) => {
        console.log(error);
      }
    );

    this.getList('GetBranches').subscribe(
      (response) => {
        this.fileBranches = response['Branches'];
      },
      (error) => {
        console.log(error);
      }
    );

    this.getList('GetLotteries').subscribe(
      (response) => {
        this.fileLotteries = response['Lotteries'];
      },
      (error) => {
        console.log(error);
      }
    );

    this.getList('GetUsers').subscribe(
      (response) => {
        this.fileUsers = response['Users'];
      },
      (error) => {
        console.log(error);
      }
    );

    this.getList('GetVendors').subscribe(
      (response) => {
        this.fileVendors = response['Vendors'];
      },
      (error) => {
        console.log(error);
      }
    );

    this.filePhoneProviders = this.getPhoneProviders();
    this.fileTerminalTypes = this.getTypeTerminals();
  }


  setHead() {
    this.head={ 'Content-Type': 'application/json','AUTH_TOKEN': String(localStorage.getItem('sessionToken'))}
    return this.head
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

  getList(endpoint: string): Observable<any> {
    const headers = this.setHead()
    let lista: any = this._Http.get(`${this.url}/${endpoint}`, { headers });
    return lista;
  }

  postItem(endpoint: string, body: any) {
    const headers = this.setHead()
    return this._Http.post(`${this.url}/${endpoint}`, body, { headers });
  }

  postSearch(endpoint: string, body: any) {
    const headers = this.setHead()
    return this._Http.post(`${this.url}/${endpoint}`, body, { headers });
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
      { Id: 3, Name: 'Recolector' },
      { Id: 4, Name: 'Tecnico' },
      { Id: 9, Name: 'Otros' },
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
  theGroup(id: any) {
    return this.fileGroups.find((element) => element.Id == id)?.Name;
  }

  theProvider(id: any) {
    return this.fileProviders.find((element) => element.Id == id)?.Name;
  }

  theBranch(id: any) {
    return this.fileBranches.find((element) => element.Id == id)?.Name;
  }

  theLottery(id: any) {
    return this.fileLotteries.find((element) => element.Id == id)?.Name;
  }

  theWinner(winer: boolean, sta: string, amo: number, pri: number) {
    sta = sta.trim();
    return winer && sta == '' && amo != 0 && pri != 0;
  }

  getUsers() {
    this.getList('GetUsers').subscribe(
      (response) => {
        this.fileUsers = response['Groups'];
      },
      (error) => {
        console.log(error);
      }
    );
    return this.fileUsers;
  }
  theUser(id: any) {
    return this.fileUsers.find((element) => element.Id == id)?.Name;
  }

  theVendor(id: any) {
    return this.fileUsers.find((element) => element.Id == id)?.Us;
  }

  theTerminalType(id: any) {
    return this.fileTerminalTypes.find((element) => element.Id == id)?.Name;
  }

  thePhoneProvider(id: any) {
    return this.filePhoneProviders.find((element) => element.Id == id)?.Name;
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
    return this._Http.post(`${this.url}/login`, data);
  }
}
