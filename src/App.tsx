import { useState, useEffect } from 'react';
import { useWeddingStore } from '@/store/weddingStore';
import { PageKey } from '@/types';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Dashboard from '@/pages/Dashboard';
import Project from '@/pages/Project';
import Checklist from '@/pages/Checklist';
import Guests from '@/pages/Guests';
import Invitations from '@/pages/Invitations';
import Seating from '@/pages/Seating';
import Budget from '@/pages/Budget';
import CheckIn from '@/pages/CheckIn';
import Album from '@/pages/Album';
import RSVP from '@/pages/RSVP';
import GuestCheckIn from '@/pages/GuestCheckIn';

const pageTitles: Record<PageKey, { title: string; subtitle: string }> = {
  dashboard: { title: '首页仪表盘', subtitle: '婚礼筹备总览 · 一切尽在掌握' },
  project: { title: '婚礼项目', subtitle: '设置你们的婚礼基本信息' },
  checklist: { title: '筹备清单', subtitle: '跟踪每一项任务，确保万无一失' },
  guests: { title: '嘉宾管理', subtitle: '管理所有受邀嘉宾信息' },
  invitations: { title: '电子请柬', subtitle: '设计精美请柬，发送甜蜜邀请' },
  seating: { title: '桌位安排', subtitle: '巧妙安排，让每位宾至如归' },
  budget: { title: '预算管理', subtitle: '精打细算，每一分钱都有价值' },
  checkin: { title: '婚礼签到', subtitle: '欢迎每一位见证幸福的嘉宾' },
  album: { title: '回忆相册', subtitle: '珍藏每一个美好的瞬间' },
};

export default function App() {
  const project = useWeddingStore((s) => s.project);
  const currentPage = useWeddingStore((s) => s.currentPage) as PageKey;
  const setCurrentPage = useWeddingStore((s) => s.setCurrentPage);

  const [externalRoute, setExternalRoute] = useState<{ type: 'rsvp' | 'checkin'; guestId: string } | null>(null);

  useEffect(() => {
    const parseRoute = () => {
      const path = window.location.pathname;
      const rsvpMatch = path.match(/^\/rsvp\/(.+)$/);
      const checkinMatch = path.match(/^\/checkin-scan\/(.+)$/);

      if (rsvpMatch) {
        setExternalRoute({ type: 'rsvp', guestId: rsvpMatch[1] });
      } else if (checkinMatch) {
        setExternalRoute({ type: 'checkin', guestId: checkinMatch[1] });
      } else {
        setExternalRoute(null);
      }
    };

    parseRoute();

    const handlePopState = () => parseRoute();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleBackToDashboard = () => {
    window.history.pushState({}, '', '/');
    setExternalRoute(null);
    setCurrentPage('dashboard');
  };

  if (externalRoute) {
    if (externalRoute.type === 'rsvp') {
      return <RSVP guestId={externalRoute.guestId} onBack={handleBackToDashboard} />;
    }
    if (externalRoute.type === 'checkin') {
      return <GuestCheckIn guestId={externalRoute.guestId} onBack={handleBackToDashboard} />;
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'project':
        return <Project />;
      case 'checklist':
        return <Checklist />;
      case 'guests':
        return <Guests />;
      case 'invitations':
        return <Invitations />;
      case 'seating':
        return <Seating />;
      case 'budget':
        return <Budget />;
      case 'checkin':
        return <CheckIn />;
      case 'album':
        return <Album />;
      default:
        return <Dashboard />;
    }
  };

  const pageMeta = pageTitles[currentPage] || pageTitles.dashboard;

  return (
    <div className="min-h-screen flex bg-cream-50">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        groomName={project.groomName}
        brideName={project.brideName}
        weddingDate={project.weddingDate}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={pageMeta.title} subtitle={pageMeta.subtitle} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin">
          <div className="max-w-[1600px] mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
