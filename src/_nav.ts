import { INavData } from '@coreui/angular';

let userName: string | null = localStorage.getItem('user');
let role: string | null = localStorage.getItem('Roberlenter');
if (role==null) role='';
if (userName==null) userName='';
let isAdm:boolean = role.toUpperCase()=='aiDMimesN'.toUpperCase()
let isOff:boolean = role.toUpperCase()=='oberFimesCimesNai'.toUpperCase()

export const navItems: INavData[] =
  (userName=='admin' || true)?
  [
  {
    name: 'Supervisión',
    iconComponent: { name: 'cil-task' },
    children: [
      { name: '- Monitoreo Bancas', url: '/monitor-branches' },
      { name: '- Resultados de Loterias', url: '/lotteries-results' },
      { name: '- Numeros mas jugados', url: '/most-popular'  },
      // { name: '- Monitor Remesas', url: '/monitor-collector'  },
      // { name: '- TEST', url: '/test' },
    ]
  },
  (isAdm || isOff)?
  {
    name: 'Gestión / Operaciones',
    iconComponent: { name: 'cil-calculator' },
    children: [
      { name: '- Gestión de Tickets', url: '/ticket-void'  },
      // { name: '- Bce Recargas', url: '/recharge-balance'},
      { name: '- Gestión Recargas', url: '/recharge-void'},
      { name: '- Gestión Facturas', url: '/invoice-void'},
      // { name: 'Registrar Remesa', url: '/collect' },
      { name: '- Pagar Premiados', url: '/pay-prizes' },
      { name: '- Limites Bancas', url: '/branches-limits'  },
      // { name: '- Otros Controles', url: '/office-others' },
      // { name: '- Gestion Billetes LN', url: '/ln-void'  },
      //{ name: '- Cierres Loterias', url: '/lottery-closing'  },
    ]

  }:{},
  // {
  //   name: 'Gestión Recargas',
  //   url: '/recharge-void',
  //   iconComponent: { name: 'cil-devices' },
  //   // children: [
  //   //   { name: '- Anular Recargas', url: '/recharge-void'  },
  //   //   { name: '- Balance Recargas', url: '/recharge-balance'},
  //   // ]
  // },
  // {
  //   name: 'Gestión Oficina',
  //   iconComponent: { name: 'cil-layers' },
  //   children: [

  //     // { name: '- Admin-Page', url: '/adminPage' },
  //     // { name: 'PIN de Remesas', url: '/test' },
  //     //{ name: '- Bloqueo numeros', url: '/numbers-block'  },
  //     { name: 'Registrar Remesa', url: '/collect' },
  //     { name: 'Pagar Premiados', url: '/pay-prizes' },
  //     //{ name: 'xxx Caja Usuario', url: '/cashiers-box' },
  //     //{ name: 'xxx Registrar Movimiento', url: '/transactions' },
  //     // { name: 'xxx Area Contable', url: '/test' },
  //   ]
  // },

  (isAdm || isOff)?{
    name: 'Informes', url: '/reports',
    iconComponent: { name: 'cil-chart' },
    children: [
      { name: 'De Loteria',
      children:[
        { name: '... Numeros mas Jugados', url: '/r-most-popular' },
        { name: '... Apuesta x Vendedor', url: '/r-vendor-bets' },
        { name: '... Tickets Ganadores', url: '/r-ticket-winners' },
        { name: '... Tickets Anulados', url: '/r-ticket-voids' },
        { name: '... Tickets Habilitados', url: '/r-ticket-un-voids' },
        // { name: '... Vtas Lot. Nacional', url: '/r-ln-sales' },
        // { name: 'x... Estadisticas Modalidad', url: '/r...statistics' },
        // { name: 'x... % Vtas/Premios x Loteria', url: '/r...percents' },
        // { name: '... Tickets Anulados LN', url: '/r-ln-voids' },
      ]},
      { name: 'Recargas y Facturas',
      children:[
        // { name: '- Hist. Cupo Recargas', url: '/r-quota-recharge-history' },
        // { name: '- Dist. Cupo Recargas', url: '/r-quota-recharge-distribution' },
        { name: '... Recargas x Vendedor', url: '/r-recharges-vendors' },
        { name: '... Facturas x Vendedor', url: '/r-invoices-vendors' },
        { name: '... Utilidad y Comision', url: '/r-profits-others' },
        // { name: '- Utilidad Otros Productos x Compania', url: '/r-profits-others-by-company' },
        // { name: '... Recargas Anuladas', url: '/r-recharges-voids' },
      ]},
      { name: 'Administrativos',
      children:[
        // { name: '- Transacciones Bancas', url: '/r-branches-transactions' },
        // { name: '- Envio de Perdidas', url: '/r-loss-shipping' },
        // { name: '... Remesas de Cajas', url: '/r-collects' },
        { name: '... Ventas por Vendedor', url: '/r-vendor-sales' },
        { name: '... Pagos a Premiados', url: '/r-prize-payment' },
        // { name: '- Ventas y Gastos', url: '/r-sales-expenses' },
        //{ name: '... Cuadre x Usuario', url: '/r-balance-per-user' },
        //{ name: '... Extracto Remesas', url: '/r-collect-extract' },
      ]},

    ]
  }:{},
  (isAdm)?
  {
    name: 'Configuración Empresa',
    iconComponent: { name: 'cil-people' },
    children: [
      { name: '- Empresa', url: '/company', },
      { name: '- Configura Loterias', url: '/lottery-cia'  },
      { name: '- Grupos', url: '/groups', },
      { name: '- Bancas', url: '/branchOffices', },
      // { name: '- Equipos y Terminales', url: '/terminals' },
      { name: '- Usuarios', url: '/users' },
      { name: '- Cajeros', url: '/vendors'},
    ]
  }:{},
  (!isAdm && !isOff)?
  {
    name: 'Configuración Empresa',
    iconComponent: { name: 'cil-people' },
    children: [
      // { name: '- Empresa', url: '/company', },
      // { name: '- Configura Loterias', url: '/lottery-cia'  },
      { name: '- Grupos', url: '/groups', },
      { name: '- Bancas', url: '/branchOffices', },
      // { name: '- Equipos y Terminales', url: '/terminals' },
      // { name: '- Usuarios', url: '/users' },
      { name: '- Cajeros', url: '/vendors'},
    ]
  }:{},
  (userName=='admin')?
  {
    name: 'Master System', url: '/parameters',
    iconComponent: { name: 'cil-lan' },
    children: [
      { name: '- Roles', url: '/roles' },
      // { name: '- Cargos', url: '/positions' },
      {
        name: '- Loterias',
        url: '/lotteries',
      },
      // {
      //   name: '- Planes para Grupos',
      //   url: '/group-plans',
      // },
    //   { name: 'xxx Seguridad',
    //   children: [
    //     { name: 'xxx Permisos Usuarios', url: '/test' },
    //     // { name: 'xxx Horario laboral', url: '/test' },
    //     { name: 'xxx Clave del dia', url: '/test' },
    //   ]
    // },

    ]
  }:{},
]
:
[

  {
    name: 'Informes', url: '/reports',
    iconComponent: { name: 'cil-chart' },
    children: [
      { name: 'De Loteria',
      children:[
        { name: '... Numeros mas Jugados', url: '/r-most-popular' },
        { name: '... Apuesta x Vendedor', url: '/r-vendor-bets' },
        { name: '... Tickets Ganadores', url: '/r-ticket-winners' },
        { name: '... Tickets Anulados', url: '/r-ticket-voids' },
        { name: '... Tickets Habilitados', url: '/r-ticket-un-voids' },
        { name: '... Vtas Lot. Nacional', url: '/r-ln-sales' },
        // { name: 'x... Estadisticas Modalidad', url: '/r...statistics' },
        // { name: 'x... % Vtas/Premios x Loteria', url: '/r...percents' },
        { name: '... Tickets Anulados LN', url: '/r-ln-voids' },
      ]},
      { name: 'Facturas y Otros',
      children:[
        // { name: '- Hist. Cupo Recargas', url: '/r-quota-recharge-history' },
        // { name: '- Dist. Cupo Recargas', url: '/r-quota-recharge-distribution' },
        { name: '... Recargas x Vendedor', url: '/r-recharges-vendors' },
        { name: '... Facturas x Vendedor', url: '/r-invoices-vendors' },
        // { name: '- Utilidad Vta Otros Productos', url: '/r-profits-others' },
        // { name: '- Utilidad Otros Productos x Compania', url: '/r-profits-others-by-company' },
        { name: '... Recargas Anuladas', url: '/r-recharges-voids' },
      ]},
      { name: 'Administrativos',
      children:[
        // { name: '- Transacciones Bancas', url: '/r-branches-transactions' },
        // { name: '- Envio de Perdidas', url: '/r-loss-shipping' },
        // { name: '... Remesas de Cajas', url: '/r-collects' },
        { name: '... Ventas por Vendedor', url: '/r-vendor-sales' },
        { name: '... Pagos a Premiados', url: '/r-prize-payment' },
        // { name: '- Ventas y Gastos', url: '/r-sales-expenses' },
        //{ name: '... Cuadre x Usuario', url: '/r-balance-per-user' },
        //{ name: '... Extracto Remesas', url: '/r-collect-extract' },
      ]},
    ]
  },

];
