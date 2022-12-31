import React from 'react'

const Statistic = React.lazy(() => import('./views/statistic/Statistic'))
const Producer = React.lazy(() => import('./views/producer/Producer'))
const Distributor = React.lazy(() => import('./views/distributor/Distributor'))
const WarrantyCenter = React.lazy(() => import('./views/warranty-center/WarrantyCenter'))
const Production = React.lazy(() => import('./views/production/Production'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Statistic },
  { path: '/producer', name: 'Producer', element: Producer },
  { path: '/distributor', name: 'Distributor', element: Distributor },
  { path: '/warranty-center', name: 'Warranty Center', element: WarrantyCenter },
  { path: '/production', name: 'Production', element: Production },
]

export default routes
