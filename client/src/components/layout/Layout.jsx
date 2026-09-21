import { Outlet } from 'react-router-dom';
import MarqueeBar from '../home/MarqueeBar';
import ScrollToTop from '../routing/ScrollToTop';
import LockHorizontalScroll from '../routing/LockHorizontalScroll';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="layout-shell flex min-h-screen w-full min-w-0 flex-col">
      <LockHorizontalScroll />
      <ScrollToTop />
      <MarqueeBar />
      <Header />
      <main className="layout-main min-w-0 w-full flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
