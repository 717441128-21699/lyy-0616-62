import { useState } from 'react';
import {
  Send,
  Copy,
  Check,
  Eye,
  Mail as MailIcon,
  MessageSquare,
  Share2,
  Heart,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useWeddingStore } from '@/store/weddingStore';
import { cn, formatDate } from '@/utils';

const templates = [
  {
    id: 'romantic',
    name: '浪漫玫瑰',
    bg: 'from-rose-100 via-pink-50 to-champagne-50',
    border: 'border-rose-200',
    accent: 'text-rose-600',
    accentBg: 'bg-rose-500',
  },
  {
    id: 'golden',
    name: '香槟金典',
    bg: 'from-champagne-50 via-amber-50 to-cream-50',
    border: 'border-champagne-300',
    accent: 'text-champagne-700',
    accentBg: 'bg-champagne-500',
  },
  {
    id: 'classic',
    name: '典雅白绿',
    bg: 'from-emerald-50 via-white to-cream-50',
    border: 'border-emerald-200',
    accent: 'text-emerald-700',
    accentBg: 'bg-emerald-500',
  },
  {
    id: 'dream',
    name: '梦幻粉紫',
    bg: 'from-purple-100 via-pink-50 to-rose-50',
    border: 'border-purple-200',
    accent: 'text-purple-600',
    accentBg: 'bg-purple-500',
  },
];

export default function Invitations() {
  const project = useWeddingStore((s) => s.project);
  const guests = useWeddingStore((s) => s.guests);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [message, setMessage] = useState(
    '诚挚邀请您见证我们人生中最重要的时刻，\n与我们共同分享这份喜悦与幸福。'
  );
  const [copied, setCopied] = useState(false);
  const [sentCount, setSentCount] = useState<number | null>(null);

  const pendingCount = guests.filter((g) => g.rsvpStatus === 'pending').length;
  const confirmedCount = guests.filter((g) => g.rsvpStatus === 'confirmed').length;

  const toggleGuest = (id: string) => {
    setSelectedGuests((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const selectAllPending = () => {
    const pendingIds = guests.filter((g) => g.rsvpStatus === 'pending').map((g) => g.id);
    setSelectedGuests(pendingIds);
  };

  const selectAll = () => {
    setSelectedGuests(guests.map((g) => g.id));
  };

  const clearSelection = () => {
    setSelectedGuests([]);
  };

  const handleCopy = () => {
    const text = generateInvitationText('尊敬的嘉宾');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateInvitationText = (guestName: string) => {
    return `💍 结婚请柬 💍

亲爱的 ${guestName}：

${project.groomName} 先生 与 ${project.brideName} 女士

${message}

📅 婚礼日期：${formatDate(project.weddingDate)}
⏰ 典礼时间：${project.weddingTime}
📍 婚礼地点：${project.venue}
🗺️ 详细地址：${project.address}

期待您的光临，与我们共同见证这美好时刻！

—— ${project.groomName} & ${project.brideName} 敬邀`;
  };

  const handleSend = () => {
    if (selectedGuests.length === 0) {
      alert('请先选择要发送请柬的嘉宾');
      return;
    }
    setSentCount(selectedGuests.length);
    setTimeout(() => setSentCount(null), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-2 space-y-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <Sparkles size={20} className="text-rose-500" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-wine-700">选择请柬模板</h3>
              <p className="text-xs text-champagne-500">挑选您最喜欢的样式，打造专属电子请柬</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {templates.map((t) => {
              const isSelected = selectedTemplate.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t)}
                  className={cn(
                    'relative p-3 rounded-2xl border-2 transition-all',
                    isSelected
                      ? `${t.border} shadow-romantic -translate-y-1`
                      : 'border-champagne-100 hover:border-champagne-200 hover:-translate-y-0.5'
                  )}
                >
                  <div className={`h-24 rounded-xl bg-gradient-to-br ${t.bg} border ${t.border} mb-3 flex items-center justify-center`}>
                    <Heart size={28} className={cn(t.accent, 'animate-pulse')} fill="currentColor" />
                  </div>
                  <p className={cn(
                    'text-sm font-medium',
                    isSelected ? t.accent : 'text-gray-700'
                  )}>
                    {t.name}
                  </p>
                  {isSelected && (
                    <div className={cn('absolute top-2 right-2 w-6 h-6 rounded-full', t.accentBg, 'flex items-center justify-center text-white text-xs')}>
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-champagne-100 flex items-center justify-center">
              <Eye size={20} className="text-champagne-600" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-wine-700">请柬预览</h3>
              <p className="text-xs text-champagne-500">这是嘉宾收到后将看到的效果</p>
            </div>
          </div>

          <div className={`mx-auto max-w-md rounded-3xl bg-gradient-to-br ${selectedTemplate.bg} border-2 ${selectedTemplate.border} p-8 shadow-romantic relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/20 blur-2xl" />

            <div className="relative z-10">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm mb-4">
                  <Sparkles size={14} className={selectedTemplate.accent} />
                  <span className={`text-xs font-medium ${selectedTemplate.accent}`}>诚邀出席</span>
                  <Sparkles size={14} className={selectedTemplate.accent} />
                </div>
                <p className={`text-xs tracking-[0.3em] uppercase mb-2 ${selectedTemplate.accent} opacity-70`}>
                  Wedding Invitation
                </p>
                <h2 className="font-display text-3xl font-bold text-wine-700 mb-1">
                  {project.groomName}
                </h2>
                <div className="flex items-center justify-center gap-3 my-2">
                  <div className={`h-px w-12 ${selectedTemplate.bg.includes('rose') ? 'bg-rose-300' : 'bg-champagne-400'}`} />
                  <Heart size={20} className={selectedTemplate.accent} fill="currentColor" />
                  <div className={`h-px w-12 ${selectedTemplate.bg.includes('rose') ? 'bg-rose-300' : 'bg-champagne-400'}`} />
                </div>
                <h2 className="font-display text-3xl font-bold text-wine-700">
                  {project.brideName}
                </h2>
              </div>

              <div className="divider-gold my-6" />

              <div className="text-center space-y-2 text-gray-700">
                <p className="whitespace-pre-line text-sm leading-relaxed px-4">
                  {message}
                </p>
              </div>

              <div className="divider-gold my-6" />

              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/50 backdrop-blur-sm">
                  <div className={`w-10 h-10 rounded-xl ${selectedTemplate.accentBg} flex items-center justify-center text-white`}>
                    📅
                  </div>
                  <div>
                    <p className="text-xs text-champagne-500">婚礼日期</p>
                    <p className="font-semibold text-gray-800">{formatDate(project.weddingDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/50 backdrop-blur-sm">
                  <div className={`w-10 h-10 rounded-xl ${selectedTemplate.accentBg} flex items-center justify-center text-white`}>
                    ⏰
                  </div>
                  <div>
                    <p className="text-xs text-champagne-500">典礼时间</p>
                    <p className="font-semibold text-gray-800">{project.weddingTime} 开始</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 rounded-xl bg-white/50 backdrop-blur-sm">
                  <div className={`w-10 h-10 rounded-xl ${selectedTemplate.accentBg} flex items-center justify-center text-white flex-shrink-0`}>
                    📍
                  </div>
                  <div>
                    <p className="text-xs text-champagne-500">婚礼地点</p>
                    <p className="font-semibold text-gray-800">{project.venue}</p>
                    <p className="text-sm text-champagne-600 mt-0.5">{project.address}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="font-display text-lg text-wine-700 italic">
                  — {project.groomName} &amp; {project.brideName} —
                </p>
                <p className="text-xs text-champagne-500 mt-1">敬邀</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <MessageSquare size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-wine-700">个性化邀请语</h3>
              <p className="text-xs text-champagne-500">可自定义请柬中的邀请文案</p>
            </div>
          </div>
          <textarea
            className="input-field min-h-[120px] resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入您的邀请词..."
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleCopy}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? '已复制文本' : '复制请柬文本'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Send size={20} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-wine-700">发送对象</h3>
                <p className="text-xs text-champagne-500">已选 {selectedGuests.length} 人</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={selectAllPending} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors">
              选待回复 ({pendingCount})
            </button>
            <button onClick={selectAll} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
              全选 ({guests.length})
            </button>
            <button onClick={clearSelection} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
              清空
            </button>
          </div>

          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
            {guests.map((guest) => {
              const isSelected = selectedGuests.includes(guest.id);
              return (
                <button
                  key={guest.id}
                  onClick={() => toggleGuest(guest.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left',
                    isSelected
                      ? 'bg-gradient-to-r from-rose-50 to-champagne-50 border border-rose-200'
                      : 'hover:bg-champagne-50 border border-transparent'
                  )}
                >
                  <div className={cn(
                    'w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                    isSelected ? 'bg-rose-500 border-rose-500' : 'border-champagne-300'
                  )}>
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800 truncate">{guest.name}</p>
                      <span className={cn(
                        'badge text-[10px]',
                        guest.rsvpStatus === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : guest.rsvpStatus === 'declined'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-amber-100 text-amber-700'
                      )}>
                        {guest.rsvpStatus === 'confirmed' ? '已确认' : guest.rsvpStatus === 'declined' ? '婉拒' : '待回复'}
                      </span>
                    </div>
                    <p className="text-xs text-champagne-500 truncate">{guest.phone}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="divider-gold my-5" />

          <div className="space-y-3">
            <button
              onClick={handleSend}
              disabled={selectedGuests.length === 0}
              className={cn(
                'w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all',
                selectedGuests.length > 0
                  ? 'bg-gradient-romantic text-white shadow-romantic hover:-translate-y-0.5 hover:shadow-lg'
                  : 'bg-champagne-100 text-champagne-400 cursor-not-allowed'
              )}
            >
              <MessageSquare size={18} />
              发送短信请柬
            </button>
            <button
              disabled={selectedGuests.length === 0}
              className={cn(
                'w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 border-2 transition-all',
                selectedGuests.length > 0
                  ? 'border-champagne-300 text-champagne-700 hover:bg-champagne-50'
                  : 'border-champagne-100 text-champagne-300 cursor-not-allowed'
              )}
            >
              <MailIcon size={18} />
              发送邮件请柬
            </button>
            <button
              disabled={selectedGuests.length === 0}
              className={cn(
                'w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 border-2 transition-all',
                selectedGuests.length > 0
                  ? 'border-rose-300 text-rose-700 hover:bg-rose-50'
                  : 'border-champagne-100 text-champagne-300 cursor-not-allowed'
              )}
            >
              <Share2 size={18} />
              生成分享链接
            </button>
          </div>

          {sentCount !== null && (
            <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3 animate-slide-up">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Check size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800">发送成功</p>
                <p className="text-sm text-green-600">已向 {sentCount} 位嘉宾发送请柬</p>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h4 className="font-medium text-wine-700 mb-4">发送状态统计</h4>
          <div className="space-y-3">
            {[
              { label: '已确认出席', count: confirmedCount, color: 'bg-green-500' },
              { label: '等待回复', count: pendingCount, color: 'bg-amber-500' },
              { label: '未发送', count: guests.length - confirmedCount - pendingCount, color: 'bg-champagne-300' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-sm font-medium text-gray-800">{item.count} 人</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${guests.length > 0 ? (item.count / guests.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
