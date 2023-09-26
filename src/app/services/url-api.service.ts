import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlApiService {
  public apiUrl: string = '';
  public apiKey: any;

  constructor() {
    if (true) {
      this.apiUrl = 'http://cesic.ddns.net:8075/Api';
      this.apiKey =  { 'Content-Type': 'application/json','AUTH_TOKEN': String(localStorage.getItem('sessionToken'))}
      // { 'Content-Type': 'application/json','AUTH_TOKEN':'9ry5v03+8JAqwtQcM1CPA6EH2Q6kRHZTj8/w1GsPYqB67Z6qObh0z+6Skr4WRnStku57Q67KqkJu8Vd7dHSJwf4GD+p0mjeg0mqw1cGpSoKWhCtRJ7E6B4Y/iVOSSv3d'};
    }
    else
    {
     this.apiUrl = 'http://localhost:61826/Api'
     this.apiKey =  { 'Content-Type': 'application/json','AUTH_TOKEN':'7GgDRGrfOiY972BfEMnihHOeFKZlVKNice0XQvlKvhlS2pQY6MPp6cInBAellz7b0Zj/18QAxY79a68bfFvyNl57wznv5MZqTowWDFfUCncZTrzldevDWyv6xWTLu/UX'};
    }
  }
}
