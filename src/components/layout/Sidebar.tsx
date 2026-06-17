import {
  LayoutDashboard,
  HeartHandshake,
  ListTodo,
  Users,
  Mail,
  Table2,
  Wallet,
  QrCode,
  Images,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/utils';
import { PageKey } from '@/types';

interface NavItem {
  key: PageKey;
  label: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { key: 'dashboard', label: '首页仪表盘', icon: LayoutDashboard },
  { key: 'project', label: '婚礼项目', icon: HeartHandshake },
  { key: 'checklist', label: '筹备清单', icon: ListTodo },
  { key: 'guests', label: '嘉宾管理', icon: Users },
  { key: 'invitations', label: '电子请柬', icon: Mail },
  { key: 'seating', label: '桌位安排', icon: Table2 },
  { key: 'budget', label: '预算管理', icon: Wallet },
  { key: 'checkin', label: '婚礼签到', icon: QrCode },
  { key: 'album', label: '回忆相册', icon: Images },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: PageKey) => void;
  groomName: string;
  brideName: string;
  weddingDate: string;
}

export default function Sidebar({ currentPage, onNavigate, groomName, brideName, weddingDate }: SidebarProps) {
  const formatWeddingDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <aside className="w-64 h-screen bg-white/80 backdrop-blur-md border-r border-champagne-200 flex flex-col sticky top-0">
      <div className="p-6 border-b border-champagne-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-romantic flex items-center justify-center shadow-romantic">
            <span className="text-white text-lg">💒</span>
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold text-wine-700">婚礼管家</h1>
            <p className="text-xs text-champagne-600">完美策划·幸福启程</p>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-gradient-rose border border-rose-100">
          <p className="font-display text-sm font-medium text-wine-700 text-center mb-1">
            {groomName} &amp; {brideName}
          </p>
          <p className="text-xs text-center text-champagne-600">
            {formatWeddingDate(weddingDate)}
          </p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={cn('nav-item w-full justify-between group', isActive && 'nav-item-active')}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={20}
                  strokeWidth={1.8}
                  className={cn('transition-transform duration-200', isActive && 'scale-110')}
                />
                <span className="text-sm">{item.label}</span>
              </div>
              <ChevronRight
                size={16}
                className={cn(
                  'opacity-0 transition-all duration-200',
                  isActive ? 'opacity-100 text-rose-500' : 'group-hover:opacity-50'
                )}
              />
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-champagne-100">
        <div className="p-3 rounded-xl bg-gradient-to-br from-champagne-50 to-cream-100 border border-champagne-100">
          <p className="text-xs text-champagne-700 text-center font-medium">
            ✨ 愿你们的爱情如钻石般永恒 ✨
          </p>
        </div>
      </div>
    </aside>
  );
}
