import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Calendar, MapPin, UserCheck, AlertCircle, Heart, Sparkles } from 'lucide-react';
import { useWeddingStore } from '@/store/weddingStore';
import { cn, formatDate, getInitials } from '@/utils';

interface GuestCheckInProps {
  guestId: string;
  onBack?: () => void;
}

export default function GuestCheckIn({ guestId, onBack }: GuestCheckInProps) {
  const project = useWeddingStore((s) => s.project);
  const guests = useWeddingStore((s) => s.guests);
  const tables = useWeddingStore((s) => s.tables);
  const toggleGuestCheckIn = useWeddingStore((s) => s.toggleGuestCheckIn);

  const [processing, setProcessing] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const guest = guests.find((g) => g.id === guestId);

  useEffect(() => {
    if (guest && guest.checkedIn) {
      setCheckedIn(true);
    }
  }, [guest]);

  const getTableInfo = () => {
    if (!guest || !guest.tableId) return null;
    const table = tables.find((t) => t.id === guest.tableId);
    return table ? { name: table.name, seatNumber: guest.seatNumber } : null;
  };

  const handleCheckIn = async () => {
    if (!guest) return;

    if (guest.rsvpStatus !== 'confirmed') {
      setShowError(true);
      setErrorMessage('您尚未确认出席，无法签到。请先通过邀请链接确认出席。');
      return;
    }

    if (guest.checkedIn) {
      setShowError(true);
      setErrorMessage('您已经完成签到，无需重复签到。');
      return;
    }

    setProcessing(true);
    setShowError(false);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toggleGuestCheckIn(guestId);
    setCheckedIn(true);
    setProcessing(false);
  };

  if (!guest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-champagne-50 flex items-center justify-center p-4">
        <div className="card text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <XCircle size={40} className="text-red-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-wine-700 mb-2">签到失败</h2>
          <p className="text-champagne-600 mb-6">未找到对应的嘉宾信息，请确认二维码是否正确。</p>
          {onBack && (
            <button onClick={onBack} className="btn-primary">
              返回首页
            </button>
          )}
        </div>
      </div>
    );
  }

  const tableInfo = getTableInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-champagne-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-emerald-100/50 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-champagne-100/50 blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 mb-4">
                <Sparkles size={14} className="text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">婚礼签到</span>
                <Sparkles size={14} className="text-emerald-600" />
              </div>
              <p className="text-xs tracking-[0.3em] uppercase mb-2 text-champagne-500">
                Welcome to Our Wedding
              </p>
              <h1 className="font-display text-2xl font-bold text-wine-700">
                {project.groomName} &amp; {project.brideName}
              </h1>
              <div className="flex items-center justify-center gap-2 my-2">
                <Heart size={16} className="text-rose-400" fill="currentColor" />
              </div>
            </div>

            <div className="divider-gold my-5" />

            <div className="text-center mb-6">
              <div className={cn(
                'w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg mx-auto mb-4',
                guest.relation === 'groom_side'
                  ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                  : 'bg-gradient-to-br from-pink-400 to-rose-500'
              )}>
                {getInitials(guest.name)}
              </div>
              <h2 className="font-display text-2xl font-bold text-wine-700 mb-1">{guest.name}</h2>
              <p className="text-champagne-600">
                {guest.relation === 'groom_side' ? '新郎方嘉宾' : '新娘方嘉宾'}
              </p>
              {guest.plusOne && guest.plusOneName && (
                <p className="text-sm text-champagne-500 mt-1">
                  +1: {guest.plusOneName}
                </p>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center text-white flex-shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-champagne-500">婚礼日期</p>
                  <p className="font-medium text-gray-800">{formatDate(project.weddingDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-champagne-400 to-champagne-500 flex items-center justify-center text-white flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-champagne-500">婚礼地点</p>
                  <p className="font-medium text-gray-800">{project.venue}</p>
                </div>
              </div>
              {tableInfo && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-rose-50 to-champagne-50 border border-rose-200">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                    🪑
                  </div>
                  <div>
                    <p className="text-xs text-champagne-500">您的座位</p>
                    <p className="font-medium text-gray-800">
                      {tableInfo.name} · 第 {tableInfo.seatNumber} 号
                    </p>
                  </div>
                </div>
              )}
            </div>

            {showError && (
              <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">签到提示</p>
                  <p className="text-sm text-amber-700">{errorMessage}</p>
                </div>
              </div>
            )}

            {!checkedIn ? (
              <div className="space-y-4">
                <button
                  onClick={handleCheckIn}
                  disabled={processing}
                  className={cn(
                    'w-full py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-3 transition-all',
                    processing
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl'
                  )}
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      签到中...
                    </>
                  ) : (
                    <>
                      <UserCheck size={24} />
                      确认签到
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h3 className="font-display text-xl font-bold text-wine-700 mb-2">
                  签到成功！
                </h3>
                <p className="text-champagne-600 mb-4">
                  欢迎您的到来，祝您度过愉快的时光！
                </p>
                {guest.checkedInAt && (
                  <p className="text-sm text-champagne-500 mb-4">
                    签到时间：{new Date(guest.checkedInAt).toLocaleString('zh-CN', {
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
                {tableInfo && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
                    <p className="text-sm text-rose-700">
                      🪑 <strong>您的座位：</strong>{tableInfo.name} 第 {tableInfo.seatNumber} 号
                    </p>
                  </div>
                )}
                {onBack && (
                  <button onClick={onBack} className="btn-secondary mt-6">
                    返回管理系统
                  </button>
                )}
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="font-display text-lg text-wine-700 italic">
                — {project.groomName} &amp; {project.brideName} —
              </p>
              <p className="text-xs text-champagne-500 mt-1">敬邀</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
