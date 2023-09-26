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
  // CiaName : number;
  // GroupName : string;
  // PositionName: string;
}

export interface IVendor extends IUser {
}


export interface IBranch  extends IAll{
  Group: number;
  Zone: number;
  Terminal: number;
  Code: string;
  Address: string;
  Phone: string;
  Collector: number;
  MaxLottery:  number;
  MaxPhoneRecharge:  number;
  MaxInvoices:  number;
  Manager: number;
  // LastActivity: string;
}

export interface IGroup extends IAll{
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
  Code: string;
  Quiniela?: boolean;
  Pale?: boolean;
  Tripleta?: boolean;
  TimeClose?: string;
  TimeCloseB?: string;
  TimeCloseC?: string;
  Priority?: string;
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
  Group: number;
  Branch: number;
  Lottery: number;
  Mode : string;
  Limit : number;
  LimitG : number;
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
}

export interface IRecharge extends IAll,ITrans {
  Provider: number;
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
