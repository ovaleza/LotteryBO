import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';
import { IRecharge } from 'src/app/models/master.models';

@Component({
  selector: 'app-recharge-balance',
  templateUrl: './recharge-balance.component.html',
  styleUrls: ['./recharge-balance.component.scss']
})
export class RechargeBalanceComponent implements OnInit {
  public balanceOT: number = 0.00

  constructor(private alert: AlertService, private service: MasterService) {}

  ngOnInit(): void {
      this.getAll()
  }

  getAll(){
    let refClient=this.service.getNewReferenciaCliente();
    this.service.getRechargeBalance(refClient).subscribe(
        (res:any) => {this.balanceOT =res.Saldo.saldo},// {this.responseGetRechargeBalance(res);},
        (error: any) => {
          this.balanceOT =0;
        }
    );
  }

  responseGetRechargeBalance(data: any) {
    this.balanceOT =data.Saldo.saldo;
  }
}
