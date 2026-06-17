import { Bell, Settings, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useWeddingStore } from '@/store/weddingStore';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const resetAll = useWeddingStore((s) => s.resetAll);
  const [showReset, setShowReset] = useState(false);

  return (
    <header className="h-16 bg-white/70 backdrop-blur-md border-b border-champagne-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div>
        <h2 className="font-display text-xl font-semibold text-wine-700">{title}</h2>
        {subtitle && <p className="text-sm text-champagne-600">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowReset(true)}
          className="w-10 h-10 rounded-xl hover:bg-champagne-50 flex items-center justify-center text-champagne-600 hover:text-wine-700 transition-all duration-200"
          title="重置所有数据"
        >
          <RotateCcw size={18} strokeWidth={1.8} />
        </button>
        <button className="w-10 h-10 rounded-xl hover:bg-champagne-50 flex items-center justify-center text-champagne-600 hover:text-wine-700 transition-all duration-200 relative">
          <Bell size={18} strokeWidth={1.8} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        </button>
        <button className="w-10 h-10 rounded-xl hover:bg-champagne-50 flex items-center justify-center text-champagne-600 hover:text-wine-700 transition-all duration-200">
          <Settings size={18} strokeWidth={1.8} />
        </button>
        <div className="ml-2 flex items-center gap-2 pl-4 border-l border-champagne-100">
          <div className="w-9 h-9 rounded-full bg-gradient-romantic flex items-center justify-center text-white text-sm font-medium shadow-romantic">
            新
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-wine-700">新人中心</p>
            <p className="text-xs text-champagne-500">管理员</p>
          </div>
        </div>
      </div>

      {showReset && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-romantic animate-slide-up">
            <h3 className="font-display text-xl font-semibold text-wine-700 mb-3">确认重置</h3>
            <p className="text-gray-600 mb-6">
              确定要重置所有数据吗？此操作将清除您所有的婚礼项目、嘉宾、预算等信息，且无法恢复。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowReset(false)}
                className="btn-secondary"
              >
                取消
              </button>
              <button
                onClick={() => {
                  resetAll();
                  setShowReset(false);
                }}
                className="btn-primary"
              >
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
