import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import Toast from './Toast'
import ProductDrawer from './ProductDrawer'
import LivePicker from './LivePicker'
import { titleFor } from '../lib/pageMeta'

/** Desktop shell: fixed sidebar + (header + scroll body). Drawers/toast mounted here. */
export default function Layout() {
  const loc = useLocation()
  const [title, sub] = titleFor(loc.pathname)

  return (
    <div className="relative flex h-full min-h-screen w-full overflow-hidden bg-bg text-ink">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={title} sub={sub} />
        <div className="ad-scroll flex-1 overflow-y-auto px-7 pb-[60px] pt-[26px]">
          <Outlet />
        </div>
      </div>

      {/* always-mounted overlays */}
      <ProductDrawer />
      <LivePicker />
      <Toast />
    </div>
  )
}
