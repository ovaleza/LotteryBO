export interface IAll {
  Id : number;
  Cia : number;
  Name?: string;
  Status: string,
  ResponseDescription: string;
  HasError: boolean
}

export interface IBasic {
  Id: number;
  Name: string;
}

export interface IUser extends IAll {
  Us: string;
  Ps: string;
  Pin: string;
  Doc : number;
  Address : number;
  Phone: string;
  Email: string;
  Position : number;
  Group : number;
  Role : number;
  Created : string;
  Level: number;
  Branch : number;
  Serial? : string;
  SerialFix? : boolean;
  // CiaName : number;
  // GroupName : string;
  // PositionName: string;
}

export interface IVendor extends IUser {
}

export interface IGlobal {
  Lottery? : boolean;
  FastPrime? : boolean;
  Ln? : boolean;
  Recharges?: boolean,
  Invoices?  : boolean,

  MaxLottery?:  number;
  MaxFastPrime?:  number;
  MaxRecharges?:  number;
  MaxInvoices?:  number;

  Comi?: number;
  Comi_Recharges?: number;
  Comi_Invoices?: number;
  Comi_Ln?: number;

  Max_Qui?: number;
  Max_Pal?: number;
  Max_Tri?: number;
  Max_Sup?: number;
  Max_Rap?: number;

  BlockViewComission? : boolean;
  PayPending?: boolean;
  LotteryPrimesPrint? : boolean;
  VoidEnabled? : boolean;
}

export interface IBranch  extends IAll, IGlobal{
  Group: number;
  Zone?: number;
  Terminal?: number;
  Code?: string;
  Address?: string;
  Address2?: string;
  Phone?: string;
  Collector?: number;
  Manager?: number;
  LastDateActivity? :string;
  LastActivity?: string;
  Serial?:string;
  SerialHard?:string;
  SimCard?:string;
  AppVersion?:string;
  GroupName?:void ;
}


export interface ICompany  extends IAll, IGlobal{
  Address?: string;
  Address2?: string;
  Phone?: string;
  Phone2?: string;
  Manager?: string;
  Email?: string;
  Doc?:string;
  BlockViewPrizes?: boolean;
  VendorVoid?: boolean;
  VendorVoidRecharges?: boolean;
  VendorPrintResults?: boolean;
  BlockViewComission?: boolean;
  LotteryPrimesPrint?: boolean;
  VoidEnabled?: boolean;
  VoidRechargesEnabled?: boolean;
  PayPrizesEnabled?:boolean;
  DoubleSerial?:boolean;
  SerialFixRelease?: boolean;
  DShideBalance?: boolean;
  Branches?:string;
  BranchesOn?:string;
}

export interface IGroup extends IAll, IGlobal{
  UserMaster: string;
  Phone: string;
  Email: string;
  SaleYes: boolean;
  SaleLimiter : string;
  SaleMax:  number;
  PlanType : string;
}

export interface IGroupPlan extends IAll{
  Factor : number;
}

export interface ITerminal extends IAll {
  Group : number;
  Branch : number;
  Type : number;
  Trade : number;
  Model : number;
  Serial : string;
  Mac : string;
  Imei : string;
  Simcard: string;
  PhoneProvider: number;
  License: string;
  PrintFormat: number;
  PrintHeader: number;
  PrintHead1: string;
  PrintHead2: string;
  PrintHead3: string;
  PrintMessage: string;
  PrintFooter: string;
  PurchaseDate: string;
  Guaranty: number;
  GuarantyDate: string;
  Provider: string;
  ProviderEmail: string;
  ProviderPhone: string;
}

export interface ILottery extends IAll {
  Code?: string;
  Quiniela?: boolean;
  Pale?: boolean;
  Tripleta?: boolean;
  TimeClose?: string;
  TimeCloseB?: string;
  TimeCloseC?: string;
  Priority?: string;
  Limit?:number;
  Origin?: string;
  NamePublic?: string;
}

export interface ILotteryClosing extends ILottery {
  TimeClose: string;
  Day: string;
}

export interface IBlockNumber extends IAll {
  Group: number;
  Branch: number;
  DateEnter: string;
  Mode : string;
  Lottery: number;
  Numbers: string;
  Note : string;
  Action : number;
}

export interface ILotteryLimit extends ILottery {
  Lottery: number;
  Group: number;
  Branch: number;
  Mode : string;
  Limit : number;
  LimitG : number;
}

export interface ILotteryCia extends ILottery {
  Lottery: number;
  LotteryName?: string;
  Group?: number;
  Branch?: number;
  Limit? : number;
  Max_Qui?: number;
  Max_Pal?: number;
  Max_Tri?: number;
  Max_Sup?: number;
}

export interface IRol extends IAll{
  Description: string;
};

export interface IPosition extends IRol{
};

export interface IProvider extends IAll {
  Type: string;
 }

export interface ITrans extends IAll {
  Us : string;
  Serial : string;
  Branch : number;
  Vendor? : number;
  DateEnter? : string;
  Amount : number;
  CollectDate? : string;
  CollectUs? : number;
  CollectId? : number;
}

export interface ITransaction extends IAll,ITrans {
  DateRef? : string;
  Type : string;
  Branch2? : string;
  Antipodal? : boolean;
  Note? : string;
  Retention? : number;
}

export interface ITicket extends IAll,ITrans {
  Client? : string;
  Winner : boolean;
  Prize : number;
  PayPrizeId? : number;
  Maxtime? : string;
  MaxtimeB? : string;
  DatePaid? : string;
  UsPaid? : string;
  DateNull? : string;
  UsNull? : string;
}

export interface ITicketDetail extends IAll {
  IdTicket : number;
  Serial : string;
  Branch : number;
  BranchB? : number;
  Us : string;
  DateEnter: string;
  Numbers : string;
  Amount : number;
  Lottery : string;
  Mode : string;
  Winner : boolean;
}

export interface IInvoice extends IAll,ITrans {
  Type : string;
  Reference?: string;
  Client? : string;
  Winner : boolean;
  Provider: number;
  ReferenciaProveedor : string;
}

export interface IRecharge extends IAll,ITrans {
  Provider: number;
  ReferenciaProveedor : string;
  ProviderName? : string;
  PhoneNumber: string;
  Plan : string;
}

export interface IReport extends IAll {
  Column1: string;
  Column2: string;
  Column3: string;
  Column4: string;
  Column5: string;
  Column6: string;
  Column7: string;
  Column8: string;
  Column9: string;
  Column10: string;
  Column11: string;
  Column12: string;
  Column13: string;
  Column14: string;
  Column15: string;
  Column16: string;
  Column17: string;
  Column18: string;
  Column19: string;
  Column20: string;
  Column21: string;
  Column22: string;
  Column23: string;
  Column24: string;
  Column25: string;
}


export interface ICriteria {
  Name: string;
  Criteria1: string;
  Criteria2: string;
  Criteria3: string;
  Criteria4: string;
  Criteria5: string;
  Criteria6: string;
  Criteria7: string;
  Criteria8: string;
  Criteria9: string;
  Criteria10: string;
  Criteria11: string;
  Criteria12: string;
}
