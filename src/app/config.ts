//ESTE ARCHIVO ESTA AQUI, SOLO PARA REFERENCIAS
//DE COMO HE REALIZADO ALGUNAS COSAS EN OTROS PROYECTOS
//(ODULIO 5 MAY 2023)


import Swal from 'sweetalert2';

export interface ICar {
  id: number;
  client: number;
  brand: string;
  model: string;
  year: number;
  color: string;
}

export interface ITech {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface IClient extends ITech {}

export interface IServiceType {
  Id: number;
  Name: string;
  Description: string;
  Status: string;
}

export interface IRol extends IServiceType{};

export interface IService {
  id: number;
  date: string;
  time:  string;
  client: number;
  car: number;
  tech: number;
  service: number;
  amount: number;
  note  : string;
}

export interface IUser {
  id: number;
  user: string;
  pass : string;
  registered: string;
  email: string;
  role: number;
  client: number;
  tech: number;
}

interface IConfig {
  title: string;
  owner: string;
  login_user: IUser[];
  aUsers: IUser[];
  aRols: IRol[];
  aTechs: ITech[];
  aServices: IService[];
  aClients: IClient[];
  aCars: ICar[];
}

export var configdefault:IConfig = {
  title: "Vehiculos",
  owner:'Odulio Valeza',
  login_user:[{id:0,user:'admin',pass:'',registered:'',email:'', role:1, client:0, tech:0}],
  aUsers : [
    {
      id: 1,
      user: 'admin',
      pass: 'admin',
      registered: '2020-01-01',
      email: 'anpch@example.com',
      role : 1,
      client: 0,
      tech : 0
    },
    {
      id: 2,
      user: 'user',
      pass: 'user',
      registered: '2020-01-01',
      email: 'anpch@example.com',
      role : 2,
      client: 0,
      tech : 0
    },
  ],
  aRols :  [
    {
    Id:1,
    Name:'admin',
    Description:'Administrador del Sistema',
    Status:''
    },
  ],
  aTechs : [
    {
      id: 1,
      name: 'Mecanico 1',
      address: 'Calle 123',
      email: 'efpyi@example.com',
      phone: '123456789'
    },
    {
      id: 2,
      name: 'Mecanico 2',
      address: 'Calle 456',
      email: 'efpyi@example.com',
      phone: '123456789'
    },
  ],
  aServices : [
    {
      id: 1,
      date : '2023-12-12',
      time : '12:00',
      client: 1,
      car: 1,
      tech: 1,
      service: 2,
      amount: 1200,
      note : 'Esta ea la primera vez',
    },
    {
      id: 2,
      date : '2023-12-12',
      time : '12:00',
      client: 2,
      car: 2,
      tech: 2,
      service: 2,
      amount: 1200,
      note : 'Esta ea la segunda vez',
    },
  ],
  aClients :  [
    {
      id: 1,
      name: 'Juan 1',
      address: 'Calle 1',
      email: 'kenaa@example.com',
      phone: '123456789'
    },
    {
      id: 2,
      name: 'Jose 2',
      address: 'Calle 2',
      email: 'kena2@example.com',
      phone: '123456789'
    },
  ],
  aCars :[
    {
      id: 1,
      client: 1,
      brand: 'Ford 1',
      model: 'Mustang',
      year: 2017,
      color: 'Red',
    },
    {
      id: 2,
      client: 2,
      brand: 'BMW 2',
      model: 'X5',
      year: 2017,
      color: 'Black',
    },
  ]
}

export function configLoad():IConfig {
  if (window.localStorage.getItem('perfil') == undefined)
   {
    localStorage.setItem('perfil',JSON.stringify(configdefault));
  }
  let config2=JSON.parse(localStorage.getItem('perfil') || 'IConfig[]');

return config2;;
}

export function configSave(){
  localStorage.setItem('perfil',JSON.stringify(config));
}

export var config:IConfig = configLoad();

export function msgAlert(accion='G'){
Swal.fire({
  title: (accion=='D'?'Borrado':'Guardado!'),
  text : 'Realizado Exitosamente',
  width: '25% auto',
  icon : (accion=='D'?'info':'success'),
  timer:1500,
});
}
