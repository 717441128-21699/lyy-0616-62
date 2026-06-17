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
  ExternalLink,
  AlertCircle,
  Loader2,
  QrCode,
} from 'lucide-react';
import { useWeddingStore } from '@/store/weddingStore';
import { Guest } from '@/types';
import { cn, formatDate } from '@/utils';
import Modal from '@/components/common/Modal';

const templates = [
  { id: 'romantic', name: '浪漫玫瑰', bg: 'from-rose-100 via-pink-50 to-champagne-50', border: 'border-rose-200', accent: 'text-rose-600', accentBg: 'bg-rose-500' },
  { id: 'golden', name: '香槟金典', bg: 'from-champagne-50 via-amber-50 to-cream-50', border: 'border-champagne-300', accent: 'text-champagne-700', accentBg: 'bg-champagne-500' },
  { id: 'classic', name: '典雅白绿', bg: 'from-emerald-50 via-white to-cream-50', border: 'border-emerald-200', accent: 'text-emerald-700', accentBg: 'bg-emerald-500' },
  { id: 'dream', name: '梦幻粉紫', bg: 'from-purple-100 via-pink-50 to-rose-50', border: 'border-purple-200', accent: 'text-purple-600', accentBg: 'bg-purple-500' },
];

type SendChannel = 'sms' | 'email' | 'link';
type SendStatus = 'idle' | 'sending' | 'success' | 'partial' | 'failed';

interface SendResult {
  guestId: string;
  guestName: string;
  status: 'success' | 'failed';
  message: string;
}

export default function Invitations() {
  const project = useWeddingStore((s) => s.project);
  const guests = useWeddingStore((s) => s.guests);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [message, setMessage] = useState(
    '诚挚邀请您见证我们人生中最重要的时刻，\n与我们共同分享这份喜悦与幸福。'
  );

  const [sendStatus, setSendStatus] = useState<SendStatus>('idle');
  const [sendResults, setSendResults] = useState<SendResult[]>([]);
  const [sendChannel, setSendChannel] = useState<SendChannel | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [copiedGuest, setCopiedGuest] = useState<string | null>(null);

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkModalGuest, setLinkModalGuest] = useState<Guest | null>(null);

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

  const generateRSVPLink = (guestId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/rsvp/${guestId}`;
  };

  const generateCheckInLink = (guestId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/checkin-scan/${guestId}`;
  };

  const generateInvitationText = (guestName: string, guestId: string) => {
    const rsvpLink = generateRSVPLink(guestId);
    return `💍 结婚请柬 💍

亲爱的 ${guestName}：

${project.groomName} 先生 与 ${project.brideName} 女士

${message}

📅 婚礼日期：${formatDate(project.weddingDate)}
⏰ 典礼时间：${project.weddingTime}
📍 婚礼地点：${project.venue}
🗺️ 详细地址：${project.address}

请点击以下链接确认是否出席：
👉 ${rsvpLink}

期待您的光临，与我们共同见证这美好时刻！

—— ${project.groomName} & ${project.brideName} 敬邀`;
  };

  const simulateSend = async (channel: SendChannel, guestList: Guest[]): Promise<SendResult[]> => {
    const results: SendResult[] = [];
    
    for (const guest of guestList) {
      await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 500));
      
      let success = true;
      let message = '';
      
      if (channel === 'sms') {
        if (!guest.phone) {
          success = false;
          message = '未提供手机号码';
        } else {
          success = Math.random() > 0.08;
          message = success ? `已发送至 ${guest.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}` : '短信发送失败，请检查号码';
        }
      } else if (channel === 'email') {
        if (!guest.email) {
          success = false;
          message = '未提供邮箱地址';
        } else {
          success = Math.random() > 0.08;
          message = success ? `邮件已发送至 ${guest.email}` : '邮件发送失败，请稍后重试';
        }
      } else {
        success = Math.random() > 0.02;
        message = success ? '链接已生成' : '链接生成失败';
      }

      results.push({
        guestId: guest.id,
        guestName: guest.name,
        status: success ? 'success' : 'failed',
        message,
      });
    }
    
    return results;
  };

  const handleSend = async (channel: SendChannel) => {
    if (selectedGuests.length === 0) {
      alert('请先选择要发送请柬的嘉宾');
      return;
    }

    setSendChannel(channel);
    setSendStatus('sending');
    setSendResults([]);

    const targetGuests = guests.filter((g) => selectedGuests.includes(g.id));
    const results = await simulateSend(channel, targetGuests);

    setSendResults(results);
    
    const successCount = results.filter((r) => r.status === 'success').length;
    if (successCount === results.length) {
      setSendStatus('success');
    } else if (successCount > 0) {
      setSendStatus('partial');
    } else {
      setSendStatus('failed');
    }
    
    setShowResultModal(true);
  };

  const handleCopyLink = (guestId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const link = generateRSVPLink(guestId);
    navigator.clipboard.writeText(link);
    setCopiedGuest(guestId);
    setTimeout(() => setCopiedGuest(null), 2000);
  };

  const handleOpenGuestLinks = (guest: Guest) => {
    setLinkModalGuest(guest);
    setShowLinkModal(true);
  };

  const getRSVPFormattedLink = (guestId: string) => {
    const link = generateRSVPLink(guestId);
    if (link.length > 50) {
      return link.slice(0, 47) + '...';
    }
    return link;
  };

  const getChannelLabel = (channel: SendChannel) => {
    return { sms: '短信', email: '邮件', link: '链接' }[channel];
  };

  const getChannelIcon = (channel: SendChannel) => {
    if (channel === 'sms') return <MessageSquare size={18} />;
    if (channel === 'email') return <MailIcon size={18} />;
    return <Share2 size={18} />;
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
                  <p className={cn('text-sm font-medium', isSelected ? t.accent : 'text-gray-700')}>
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

          <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
            {guests.map((guest) => {
              const isSelected = selectedGuests.includes(guest.id);
              return (
                <div
                  key={guest.id}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl transition-all',
                    isSelected
                      ? 'bg-gradient-to-r from-rose-50 to-champagne-50 border border-rose-200'
                      : 'hover:bg-champagne-50 border border-transparent'
                  )}
                >
                  <button
                    onClick={() => toggleGuest(guest.id)}
                    className="flex-1 flex items-center gap-3 text-left"
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
                  <button
                    onClick={(e) => handleCopyLink(guest.id, e)}
                    className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-champagne-400 hover:text-rose-500 transition-all"
                    title="复制RSVP链接"
                  >
                    {copiedGuest === guest.id ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="divider-gold my-5" />

          <div className="space-y-3">
            <button
              onClick={() => handleSend('sms')}
              disabled={selectedGuests.length === 0 || sendStatus === 'sending'}
              className={cn(
                'w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all',
                selectedGuests.length > 0 && sendStatus !== 'sending'
                  ? 'bg-gradient-romantic text-white shadow-romantic hover:-translate-y-0.5 hover:shadow-lg'
                  : 'bg-champagne-100 text-champagne-400 cursor-not-allowed'
              )}
            >
              {sendStatus === 'sending' && sendChannel === 'sms' ? (
                <><Loader2 size={18} className="animate-spin" /> 发送中...</>
              ) : (
                <><MessageSquare size={18} /> 发送短信请柬</>
              )}
            </button>

            <button
              onClick={() => handleSend('email')}
              disabled={selectedGuests.length === 0 || sendStatus === 'sending'}
              className={cn(
                'w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 border-2 transition-all',
                selectedGuests.length > 0 && sendStatus !== 'sending'
                  ? 'border-champagne-300 text-champagne-700 hover:bg-champagne-50'
                  : 'border-champagne-100 text-champagne-300 cursor-not-allowed'
              )}
            >
              {sendStatus === 'sending' && sendChannel === 'email' ? (
                <><Loader2 size={18} className="animate-spin" /> 发送中...</>
              ) : (
                <><MailIcon size={18} /> 发送邮件请柬</>
              )}
            </button>

            <button
              onClick={() => handleSend('link')}
              disabled={selectedGuests.length === 0 || sendStatus === 'sending'}
              className={cn(
                'w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 border-2 transition-all',
                selectedGuests.length > 0 && sendStatus !== 'sending'
                  ? 'border-rose-300 text-rose-700 hover:bg-rose-50'
                  : 'border-champagne-100 text-champagne-300 cursor-not-allowed'
              )}
            >
              {sendStatus === 'sending' && sendChannel === 'link' ? (
                <><Loader2 size={18} className="animate-spin" /> 生成中...</>
              ) : (
                <><Share2 size={18} /> 批量生成分享链接</>
              )}
            </button>
          </div>

          {selectedGuests.length > 0 && (
            <div className="mt-4 pt-4 border-t border-champagne-100">
              <p className="text-xs text-champagne-500 mb-3">快速获取单个嘉宾链接：</p>
              <div className="grid grid-cols-2 gap-2 max-h-[120px] overflow-y-auto scrollbar-thin">
                {guests
                  .filter((g) => selectedGuests.includes(g.id))
                  .slice(0, 6)
                  .map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handleOpenGuestLinks(g)}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white border border-champagne-100 hover:border-rose-200 hover:bg-rose-50 transition-all text-xs text-gray-700"
                    >
                      <span className="truncate">{g.name}</span>
                      <ExternalLink size={12} className="text-champagne-400 flex-shrink-0" />
                    </button>
                  ))}
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

      <Modal
        isOpen={showResultModal}
        onClose={() => {
          setShowResultModal(false);
          setSendStatus('idle');
          setSendChannel(null);
        }}
        title={`${sendChannel ? getChannelLabel(sendChannel) : ''}发送结果`}
        size="lg"
        footer={
          <button
            onClick={() => {
              setShowResultModal(false);
              setSendStatus('idle');
              setSendChannel(null);
            }}
            className="btn-primary"
          >
            确定
          </button>
        }
      >
        <div className="space-y-4">
          <div className={cn(
            'p-4 rounded-xl flex items-center gap-3',
            sendStatus === 'success' ? 'bg-green-50 border border-green-200' :
            sendStatus === 'partial' ? 'bg-amber-50 border border-amber-200' :
            'bg-red-50 border border-red-200'
          )}>
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center',
              sendStatus === 'success' ? 'bg-green-100' :
              sendStatus === 'partial' ? 'bg-amber-100' :
              'bg-red-100'
            )}>
              {sendStatus === 'success' ? (
                <Check size={24} className="text-green-600" />
              ) : sendStatus === 'partial' ? (
                <AlertCircle size={24} className="text-amber-600" />
              ) : (
                <AlertCircle size={24} className="text-red-600" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {sendStatus === 'success' ? '全部发送成功' :
                 sendStatus === 'partial' ? '部分发送成功' :
                 '发送失败'}
              </p>
              <p className="text-sm text-gray-600">
                成功 {sendResults.filter(r => r.status === 'success').length} / {sendResults.length}
                {sendChannel && ` 条${getChannelLabel(sendChannel)}`}
              </p>
            </div>
          </div>

          {sendChannel === 'link' && sendStatus !== 'failed' && (
            <div className="p-4 rounded-xl bg-champagne-50 border border-champagne-200">
              <p className="text-sm font-medium text-champagne-700 mb-3 flex items-center gap-2">
                <Share2 size={16} />
                已生成的 RSVP 链接
              </p>
              <div className="space-y-2 max-h-[240px] overflow-y-auto scrollbar-thin pr-2">
                {sendResults
                  .filter(r => r.status === 'success')
                  .map((result) => {
                    const guest = guests.find(g => g.id === result.guestId);
                    if (!guest) return null;
                    return (
                      <div key={result.guestId} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-champagne-100">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{result.guestName}</p>
                          <p className="text-xs text-champagne-500 truncate font-mono">
                            {getRSVPFormattedLink(result.guestId)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopyLink(result.guestId)}
                          className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-champagne-100 hover:bg-champagne-200 text-champagne-700 text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          {copiedGuest === result.guestId ? <Check size={12} /> : <Copy size={12} />}
                          {copiedGuest === result.guestId ? '已复制' : '复制'}
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin pr-2">
            {sendResults.map((result) => (
              <div
                key={result.guestId}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl',
                  result.status === 'success' ? 'bg-green-50/50' : 'bg-red-50/50'
                )}
              >
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                  result.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                )}>
                  {result.status === 'success' ? (
                    <Check size={14} className="text-green-600" />
                  ) : (
                    <AlertCircle size={14} className="text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{result.guestName}</p>
                  <p className="text-xs text-gray-500 truncate">{result.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        title={`${linkModalGuest?.name} 的链接`}
        size="md"
      >
        {linkModalGuest && (
          <div className="space-y-5">
            <div>
              <label className="label-field flex items-center gap-2">
                <ExternalLink size={14} className="text-rose-500" />
                RSVP 确认链接
              </label>
              <div className="flex gap-2">
                <div className="flex-1 input-field bg-champagne-50 text-champagne-700 font-mono text-sm truncate overflow-hidden">
                  {generateRSVPLink(linkModalGuest.id)}
                </div>
                <button
                  onClick={() => handleCopyLink(linkModalGuest.id)}
                  className="btn-primary px-4 flex items-center gap-2"
                >
                  {copiedGuest === linkModalGuest.id ? <Check size={16} /> : <Copy size={16} />}
                  {copiedGuest === linkModalGuest.id ? '已复制' : '复制'}
                </button>
              </div>
              <p className="text-xs text-champagne-500 mt-2">
                点击此链接嘉宾可自助确认是否出席婚礼
              </p>
            </div>

            <div>
              <label className="label-field flex items-center gap-2">
                <QrCode size={14} className="text-emerald-500" />
                签到链接
              </label>
              <div className="flex gap-2">
                <div className="flex-1 input-field bg-champagne-50 text-champagne-700 font-mono text-sm truncate overflow-hidden">
                  {generateCheckInLink(linkModalGuest.id)}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generateCheckInLink(linkModalGuest.id));
                    setCopiedGuest(linkModalGuest.id + '-checkin');
                    setTimeout(() => setCopiedGuest(null), 2000);
                  }}
                  className="btn-secondary px-4 flex items-center gap-2"
                >
                  {copiedGuest === linkModalGuest.id + '-checkin' ? <Check size={16} /> : <Copy size={16} />}
                  {copiedGuest === linkModalGuest.id + '-checkin' ? '已复制' : '复制'}
                </button>
              </div>
              <p className="text-xs text-champagne-500 mt-2">
                点击此链接可直接完成嘉宾签到（婚礼当天使用）
              </p>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
              <p className="text-sm text-rose-700">
                💡 <strong>使用提示：</strong>将 RSVP 链接发送给嘉宾后，他们确认出席的状态会自动同步到嘉宾管理列表，无需手动更新。
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
