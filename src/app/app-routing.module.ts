import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminPageComponent } from './views/G-Office/admin-page/admin-page.component';
import { BranchOfficesComponent } from './views/Companies/branch-offices/branch-offices.component';
import { DefaultLayoutComponent } from './views/default';
import { LotteriesComponent } from './views/Master/lotteries/lotteries.component';
import { GroupsComponent } from './views/Companies/groups/groups.component';
import { UsersComponent } from './views/Companies/users/users.component';
import { GroupPlansComponent } from './views/Master/group-plans/group-plans.component';
import { RolsComponent } from './views/Master/rols/rols.component';
import { PositionsComponent } from './views/Master/positions/positions.component';
import { TestComponent } from './views/test/test.component';
import { TerminalsComponent } from './views/Companies/terminals/terminals.component';
import { VendorsComponent } from './views/Companies/vendors/vendors.component';
import { MonitorBranchesComponent } from './views/supervision/monitor-branches/monitor-branches.component';
import { MostPopularComponent } from './views/supervision/most-popular/most-popular.component';
import { MonitorCollectorComponent } from './views/supervision/monitor-collector/monitor-collector.component';
import { LotteryClosingComponent } from './views/G-Lottery/lottery-closing/lottery-closing.component';
import { LotteryLimitsComponent } from './views/G-Lottery/lottery-limits/lottery-limits.component';
import { NumbersBlockComponent } from './views/G-Lottery/numbers-block/numbers-block.component';
import { TicketVoidComponent } from './views/G-Lottery/ticket-void/ticket-void.component';
import { LNVoidComponent } from './views/G-Lottery/ln-void/ln-void.component';
import { RechargeVoidComponent } from './views/G-Recharges/recharge-void/recharge-void.component';
import { RechargeBalanceComponent } from './views/G-Recharges/recharge-balance/recharge-balance.component';
import { PayPrizesComponent } from './views/G-Office/pay-prizes/pay-prizes.component';
import { CollectComponent } from './views/G-Office/collect/collect.component';
import { LotteriesResultsComponent } from './views/supervision/lotteries-results/lotteries-results.component';
import { RMostPopularComponent } from './views/R-Lottery/r-most-popular/r-most-popular.component';
import { RVendorBetsComponent } from './views/R-Lottery/r-vendor-bets/r-vendor-bets.component';
import { RVendorSalesComponent } from './views/R-Lottery/r-vendor-sales/r-vendor-sales.component';
import { RTicketWinnersComponent } from './views/R-Lottery/r-ticket-winners/r-ticket-winners.component';
import { RTicketVoidsComponent } from './views/R-Lottery/r-ticket-voids/r-ticket-voids.component';
import { RTicketUnVoidsComponent } from './views/R-Lottery/r-ticket-un-voids/r-ticket-un-voids.component';
import { RLNSalesComponent } from './views/R-Lottery/r-ln-sales/r-ln-sales.component';
import { RStatisticsComponent } from './views/R-Lottery/r-statistics/r-statistics.component';
import { RPercentsComponent } from './views/R-Lottery/r-percents/r-percents.component';
import { RLNVoidsComponent } from './views/R-Lottery/r-ln-voids/r-ln-voids.component';
import { QuotaRechargeHistoryComponent } from './views/R-Others/quota-recharge-history/quota-recharge-history.component';
import { QuotaRechargeDistributionComponent } from './views/R-Others/quota-recharge-distribution/quota-recharge-distribution.component';
import { RechargesVendorsComponent } from './views/R-Others/recharges-vendors/recharges-vendors.component';
import { CashiersBoxComponent } from './views/G-Office/cashiers-box/cashiers-box.component';
import { TransactionsComponent } from './views/G-Office/transactions/transactions.component';
import { ProfitsOthersComponent } from './views/R-Others/profits-others/profits-others.component';
import { ProfitsOthersByCompanyComponent } from './views/R-Others/profits-others-by-company/profits-others-by-company.component';
import { RechargesVoidsComponent } from './views/R-Others/recharges-voids/recharges-voids.component';
import { RCollectsComponent } from './views/R-Office/r-collects/r-collects.component';
import { RPrizePaymentComponent } from './views/R-Office/r-prize-payment/r-prize-payment.component';
import { LoginComponent } from './views/login/login.component';

const routes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: 'login',
  // },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '', // redirectTo: 'menuViews',
    redirectTo: 'monitor-branches',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'monitor-branches',
        component: MonitorBranchesComponent,
      },
      {
        path: 'r-prize-payment',
        component: RPrizePaymentComponent,
      },
      {
        path: 'r-collects',
        component: RCollectsComponent,
      },
      {
        path: 'r-recharges-voids',
        component: RechargesVoidsComponent,
      },
      {
        path: 'r-recharges-vendors',
        component: RechargesVendorsComponent,
      },
      {
        path: 'r-ticket-winners',
        component: RTicketWinnersComponent,
      },
      {
        path: 'r-ticket-voids',
        component: RTicketVoidsComponent,
      },
      {
        path: 'r-ticket-un-voids',
        component: RTicketUnVoidsComponent,
      },
      {
        path: 'r-ln-sales',
        component: RLNSalesComponent,
      },
      {
        path: 'r-ln-voids',
        component: RLNVoidsComponent,
      },
      {
        path: 'lotteries-results',
        component: LotteriesResultsComponent,
        data: {
          title: 'Resultados Loterias',
        },
      },
      {
        path: 'most-popular',
        component: MostPopularComponent,
        data: {
          title: 'Mas Jugados',
        },
      },
      {
        path: 'monitor-collector',
        component: MonitorCollectorComponent,
        data: {
          title: 'Monitor Remesas',
        },
      },
      {
        path: 'collect',
        component: CollectComponent,
      },
      {
        path: 'lottery-closing',
        component: LotteryClosingComponent,
      },
      {
        path: 'lottery-limits',
        component: LotteryLimitsComponent,
      },
      {
        path: 'numbers-block',
        component: NumbersBlockComponent,
      },
      {
        path: 'ticket-void',
        component: TicketVoidComponent,
      },
      {
        path: 'ln-void',
        component: LNVoidComponent,
      },
      {
        path: 'recharge-void',
        component: RechargeVoidComponent,
      },
      {
        path: 'recharge-balance',
        component: RechargeBalanceComponent,
      },
      {
        path: 'pay-prizes',
        component: PayPrizesComponent,
      },
      // {
      //   data:{
      //     title:'Informes',
      //     // children: [],
      //   }
      // },
      {
        path: 'r-most-popular',
        component: RMostPopularComponent,
        data: {
          title: 'Reporte Mas Jugados',
        },
      },
      {
        path: 'r-vendor-bets',
        component: RVendorBetsComponent,
        data: {
          title: 'Reporte Apuestas x Vendedor',
        },
      },
      {
        path: 'r-vendor-sales',
        component: RVendorSalesComponent,
        data: {
          title: 'Reporte Vtas x Vendedor',
        },
      },
      //RVendorSalesComponent
      {
        path: 'test',
        component: TestComponent,
      },
      {
        path: 'terminals',
        component: TerminalsComponent,
      },
      {
        path: 'vendors',
        component: VendorsComponent,
      },
      {
        path: 'adminPage',
        component: AdminPageComponent,
      },
      {
        path: 'lotteries',
        component: LotteriesComponent,
        data: {
          title: 'Loterias',
        },
      },
      {
        path: 'groups',
        component: GroupsComponent,
        data: {
          title: 'Grupos',
        },
      },
      {
        path: 'group-plans',
        component: GroupPlansComponent,
        data: {
          title: 'Planes de Grupos',
        },
      },
      {
        path: 'branchOffices',
        component: BranchOfficesComponent,
        data: {
          title: 'Bancas',
        },
      },
      {
        path: 'roles',
        component: RolsComponent,
        data: {
          title: 'Roles',
        },
      },
      {
        path: 'positions',
        component: PositionsComponent,
        data: {
          title: 'Positions',
        },
      },

      // {
      //   path: 'branchOfficesDetail/:id/:name',
      //   component: BranchOfficesDetailComponent,
      //   data: {
      //     title: 'Detalle sucursal',
      //   },
      // },
      {
        path: 'users',
        component: UsersComponent,
        data: {
          title: 'Usuarios',
        },
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
