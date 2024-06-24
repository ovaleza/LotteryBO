import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  ButtonGroupModule,
  ButtonModule,
  BadgeModule,
  CardModule,
  GridModule,
  TableModule,
  ModalModule,
  FormModule,
  TooltipModule,
  PaginationModule,
} from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { DataTableSearchPipe, StringToBooleanPipe,StatusLong,BoooleanToNumberPipe,ZeroToOtros,NumbersPlayed,DateToLocale } from '../pipes/data-table-search.pipe';
import {NgxPaginationModule} from 'ngx-pagination';

import { BranchOfficesComponent } from './Companies/branch-offices/branch-offices.component';
import { AdminPageComponent } from './G-Office/admin-page/admin-page.component';
import { LotteriesComponent } from './Master/lotteries/lotteries.component';
import { GroupsComponent } from './Companies/groups/groups.component';
import { GroupPlansComponent } from './Master/group-plans/group-plans.component';
import { TerminalsComponent } from './Companies/terminals/terminals.component';
import { RolsComponent } from './Master/rols/rols.component';
import { PositionsComponent } from './Master/positions/positions.component';
import { TestComponent } from './test/test.component';
import { VendorsComponent } from './Companies/vendors/vendors.component';
import { MonitorBranchesComponent } from './supervision/monitor-branches/monitor-branches.component';
import { MostPopularComponent } from './supervision/most-popular/most-popular.component';
import { MonitorCollectorComponent } from './supervision/monitor-collector/monitor-collector.component';
import { UsersComponent } from './Companies/users/users.component';
import { CollectComponent } from './G-Office/collect/collect.component';
import { LotteryClosingComponent } from './G-Lottery/lottery-closing/lottery-closing.component';
import { LotteryLimitsComponent } from './G-Lottery/lottery-limits/lottery-limits.component';
import { NumbersBlockComponent } from './G-Lottery/numbers-block/numbers-block.component';
import { TicketVoidComponent } from './G-Lottery/ticket-void/ticket-void.component';
import { LNVoidComponent } from './G-Lottery/ln-void/ln-void.component';
import { RechargeVoidComponent } from './G-Recharges/recharge-void/recharge-void.component';
import { RechargeBalanceComponent } from './G-Recharges/recharge-balance/recharge-balance.component';
import { RMostPopularComponent } from './R-Lottery/r-most-popular/r-most-popular.component';
import { RVendorBetsComponent } from './R-Lottery/r-vendor-bets/r-vendor-bets.component';
import { RVendorSalesComponent } from './R-Lottery/r-vendor-sales/r-vendor-sales.component';
import { RTicketWinnersComponent } from './R-Lottery/r-ticket-winners/r-ticket-winners.component';
import { RTicketVoidsComponent } from './R-Lottery/r-ticket-voids/r-ticket-voids.component';
import { RTicketUnVoidsComponent } from './R-Lottery/r-ticket-un-voids/r-ticket-un-voids.component';
import { RLNSalesComponent } from './R-Lottery/r-ln-sales/r-ln-sales.component';
import { RStatisticsComponent } from './R-Lottery/r-statistics/r-statistics.component';
import { RPercentsComponent } from './R-Lottery/r-percents/r-percents.component';
import { RLNVoidsComponent } from './R-Lottery/r-ln-voids/r-ln-voids.component';
import { QuotaRechargeHistoryComponent } from './R-Others/quota-recharge-history/quota-recharge-history.component';
import { QuotaRechargeDistributionComponent } from './R-Others/quota-recharge-distribution/quota-recharge-distribution.component';
import { RechargesVendorsComponent } from './R-Others/recharges-vendors/recharges-vendors.component';
import { PayPrizesComponent } from './G-Office/pay-prizes/pay-prizes.component';
import { CashiersBoxComponent } from './G-Office/cashiers-box/cashiers-box.component';
import { TransactionsComponent } from './G-Office/transactions/transactions.component';
import { ProfitsOthersComponent } from './R-Others/profits-others/profits-others.component';
import { ProfitsOthersByCompanyComponent } from './R-Others/profits-others-by-company/profits-others-by-company.component';
import { RechargesVoidsComponent } from './R-Others/recharges-voids/recharges-voids.component';
import { RCollectsComponent } from './R-Office/r-collects/r-collects.component';
import { RPrizePaymentComponent } from './R-Office/r-prize-payment/r-prize-payment.component';
import { LotteriesResultsComponent } from './supervision/lotteries-results/lotteries-results.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer'
import  {  PdfViewerModule  }  from  'ng2-pdf-viewer';
import { LoginComponent } from './login/login.component';
import { InvoiceVoidComponent } from './G-Recharges/invoice-void/invoice-void.component';


@NgModule({
  declarations: [
    DataTableSearchPipe, StringToBooleanPipe, StatusLong, BoooleanToNumberPipe, ZeroToOtros, NumbersPlayed, DateToLocale,
    BranchOfficesComponent,
    AdminPageComponent,
    LotteriesComponent,
    GroupsComponent,
    GroupPlansComponent,
    TerminalsComponent,
    RolsComponent,
    TestComponent,
    VendorsComponent,
    MonitorBranchesComponent,
    MostPopularComponent,
    MonitorCollectorComponent,
    UsersComponent,
    CollectComponent,
    LotteryClosingComponent,
    LotteryLimitsComponent,
    NumbersBlockComponent,
    TicketVoidComponent,
    LNVoidComponent,
    RechargeVoidComponent,
    RechargeBalanceComponent,
    RMostPopularComponent,
    RVendorBetsComponent,
    RVendorSalesComponent,
    RTicketWinnersComponent,
    RTicketVoidsComponent,
    RTicketUnVoidsComponent,
    RLNSalesComponent,
    RStatisticsComponent,
    RPercentsComponent,
    RLNVoidsComponent,
    QuotaRechargeHistoryComponent,
    QuotaRechargeDistributionComponent,
    RechargesVendorsComponent,
    PayPrizesComponent,
    CashiersBoxComponent,
    TransactionsComponent,
    ProfitsOthersComponent,
    ProfitsOthersByCompanyComponent,
    RechargesVoidsComponent,
    RPrizePaymentComponent,
    LotteriesResultsComponent,
    RCollectsComponent,
    LoginComponent,
    PositionsComponent,
    InvoiceVoidComponent,
  ],
  imports: [
    CommonModule,
    CardModule,
    GridModule,
    BadgeModule,
    ButtonGroupModule,
    ButtonModule,
    TableModule,
    IconModule,
    ModalModule,
    FormModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    PaginationModule,
    NgxPaginationModule,
    NgxExtendedPdfViewerModule,
    PdfViewerModule,
  ],
})
export class CommonModuleModule {}
