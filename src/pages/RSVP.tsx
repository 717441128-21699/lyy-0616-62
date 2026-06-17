import { useState, useEffect } from 'react';
import { Heart, CheckCircle, XCircle, Calendar, Clock, MapPin, Sparkles, Check, X } from 'lucide-react';
import { useWeddingStore } from '@/store/weddingStore';
import { cn, formatDate } from '@/utils';

interface RSVPProps {
  guestId: string;
  onBack?: () => void;
}

export default function RSVP({ guestId, onBack }: RSVPProps) {
  const project = useWeddingStore((s) => s.project);
  const guests = useWeddingStore((s) => s.guests);
  const setGuestRSVP = useWeddingStore((s) => s.setGuestRSVP);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'confirmed' | 'declined' | null>(null);

  const guest = guests.find((g) => g.id === guestId);

  useEffect(() => {
    if (guest && guest.rsvpStatus !== 'pending') {
      setSubmitted(true);
      setSelectedStatus(guest.rsvpStatus);
    }
  }, [guest]);

  if (!guest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-champagne-50 flex items-center justify-center p-4">
        <div className="card text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <XCircle size={40} className="text-red-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-wine-700 mb-2">链接无效</h2>
          <p className="text-champagne-600 mb-6">抱歉，您访问的邀请链接无效或已过期。</p>
          {onBack && (
            <button onClick={onBack} className="btn-primary">
              返回首页
            </button>
          )}
        </div>
      </div>
    );
  }

  const handleSubmit = async (status: 'confirmed' | 'declined') => {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setGuestRSVP(guestId, status);
    setSelectedStatus(status);
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-champagne-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-rose-100/50 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-champagne-100/50 blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 mb-4">
                <Sparkles size={14} className="text-rose-500" />
                <span className="text-xs font-medium text-rose-600">婚礼邀请函</span>
                <Sparkles size={14} className="text-rose-500" />
              </div>
              <p className="text-xs tracking-[0.3em] uppercase mb-3 text-champagne-500">
                Wedding Invitation
              </p>
              <h1 className="font-display text-3xl font-bold text-wine-700 mb-1">
                {project.groomName}
              </h1>
              <div className="flex items-center justify-center gap-3 my-2">
                <div className="h-px w-12 bg-rose-300" />
                <Heart size={20} className="text-rose-500" fill="currentColor" />
                <div className="h-px w-12 bg-rose-300" />
              </div>
              <h1 className="font-display text-3xl font-bold text-wine-700">
                {project.brideName}
              </h1>
            </div>

            <div className="divider-gold my-6" />

            <div className="text-center mb-8">
              <p className="text-champagne-600 mb-2">尊敬的</p>
              <h2 className="font-display text-2xl font-bold text-wine-700 mb-2">
                {guest.name} 先生/女士
              </h2>
              <p className="text-gray-600 leading-relaxed">
                诚挚邀请您见证我们人生中最重要的时刻，
                <br />
                与我们共同分享这份喜悦与幸福。
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center text-white flex-shrink-0">
                  <Calendar size={22} />
                </div>
                <div>
                  <p className="text-xs text-champagne-500">婚礼日期</p>
                  <p className="font-semibold text-gray-800 text-lg">{formatDate(project.weddingDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-champagne-400 to-champagne-500 flex items-center justify-center text-white flex-shrink-0">
                  <Clock size={22} />
                </div>
                <div>
                  <p className="text-xs text-champagne-500">典礼时间</p>
                  <p className="font-semibold text-gray-800 text-lg">{project.weddingTime} 开始</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="text-xs text-champagne-500">婚礼地点</p>
                  <p className="font-semibold text-gray-800 text-lg">{project.venue}</p>
                  <p className="text-sm text-champagne-600 mt-0.5">{project.address}</p>
                </div>
              </div>
            </div>

            {!submitted ? (
              <div className="space-y-4">
                <p className="text-center text-gray-700 font-medium">请您确认是否出席：</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleSubmit('confirmed')}
                    disabled={submitting}
                    className={cn(
                      'py-4 rounded-xl font-medium flex flex-col items-center gap-2 transition-all border-2',
                      submitting
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300 hover:-translate-y-0.5'
                    )}
                  >
                    <CheckCircle size={28} />
                    <span>确认出席</span>
                  </button>
                  <button
                    onClick={() => handleSubmit('declined')}
                    disabled={submitting}
                    className={cn(
                      'py-4 rounded-xl font-medium flex flex-col items-center gap-2 transition-all border-2',
                      submitting
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:-translate-y-0.5'
                    )}
                  >
                    <XCircle size={28} />
                    <span>无法参加</span>
                  </button>
                </div>
                {submitting && (
                  <div className="text-center text-champagne-500 text-sm animate-pulse">
                    正在提交您的回复...
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div
                  className={cn(
                    'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce',
                    selectedStatus === 'confirmed' ? 'bg-green-100' : 'bg-gray-100'
                  )}
                >
                  {selectedStatus === 'confirmed' ? (
                    <Check size={40} className="text-green-500" />
                  ) : (
                    <X size={40} className="text-gray-500" />
                  )}
                </div>
                <h3 className="font-display text-xl font-bold text-wine-700 mb-2">
                  {selectedStatus === 'confirmed' ? '感谢您的确认！' : '感谢您的回复！'}
                </h3>
                <p className="text-champagne-600">
                  {selectedStatus === 'confirmed'
                    ? '我们已记录您的出席，期待在婚礼现场见到您！'
                    : '很遗憾不能在婚礼现场见到您，感谢您的祝福！'}
                </p>
                {selectedStatus === 'confirmed' && (
                  <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-100">
                    <p className="text-sm text-rose-700">
                      💡 <strong>温馨提示：</strong>婚礼当天您可以通过签到链接快速入场，我们会提前为您安排好座位。
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
