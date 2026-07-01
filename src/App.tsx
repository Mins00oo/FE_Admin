import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Catalog from './pages/Catalog'
import Lives from './pages/Lives'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Exceptions from './pages/Exceptions'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/lives" element={<Lives />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/exceptions" element={<Exceptions />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
