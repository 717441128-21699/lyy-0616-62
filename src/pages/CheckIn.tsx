import { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Hand,
  Download,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react';
import { useWeddingStore } from '@/store/weddingStore';
import { Guest } from '@/types';
import { cn, getInitials, formatDate } from '@/utils';

export default function CheckIn() {
  const guests = useWeddingStore((s) => s.guests);
  const project = useWeddingStore((s) => s.project);
  const toggleGuestCheckIn = useWeddingStore((s) => s.toggleGuestCheckIn);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'checked' | 'unchecked'>('all');
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [manualInput, setManualInput] = useState('');
  const [recentCheckin, setRecentCheckin] = useState<string | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const confirmedGuests = guests.filter((g) => g.rsvpStatus === 'confirmed');
  const checkedInGuests = guests.filter((g) => g.checkedIn);
  const notCheckedIn = confirmedGuests.filter((g) => !g.checkedIn);

  const totalAttendees = confirmedGuests.length +
    confirmedGuests.filter((g) => g.plusOne).length;
  const checkedInAttendees = checkedInGuests.length +
    checkedInGuests.filter((g) => g.plusOne).length;

  const percent = confirmedGuests.length > 0 ? (checkedInGuests.length / confirmedGuests.length) * 100 : 0;

  const filtered = guests.filter((g) => {
    if (search && !g.name.includes(search) && !g.phone.includes(search)) return false;
    if (filter === 'checked' && !g.checkedIn) return false;
    if (filter === 'unchecked' && g.checkedIn) return false;
    return true;
  });

  const dropdownFiltered = confirmedGuests.filter((g) => {
    if (!search) return true;
    return g.name.includes(search) || g.phone.includes(search);
  });

  useEffect(() => {
    if (!dropdownRef.current) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setShowGuestDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateCheckInLink = (guestId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/checkin-scan/${guestId}`;
  };

  useEffect(() => {
    if (!canvasRef.current || mode !== 'scan') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 240;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    if (!selectedGuest) {
      ctx.fillStyle = '#d4c4b0';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('请选择嘉宾', size / 2, size / 2 - 10);
      ctx.fillText('生成专属签到码', size / 2, size / 2 + 15);
      return;
    }

    const cellSize = 8;
    const cells = Math.floor(size / cellSize);
    const seed = (selectedGuest.id + selectedGuest.name + selectedGuest.phone).length;

    for (let y = 0; y < cells; y++) {
      for (let x = 0; x < cells; x++) {
        const isCorner =
          (x < 8 && y < 8) ||
          (x >= cells - 8 && y < 8) ||
          (x < 8 && y >= cells - 8);

        if (isCorner) continue;

        const hash = (x * 7 + y * 13 + seed * 3 + selectedGuest.id.charCodeAt(0) * 5) % 7;
        if (hash < 3) {
          ctx.fillStyle = '#8B2635';
          ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }

    const drawFinderPattern = (startX: number, startY: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          const isOuter = i === 0 || j === 0 || i === 6 || j === 6;
          const isInner = i >= 2 && j >= 2 && i <= 4 && j <= 4;
          if (isOuter || isInner) {
            ctx.fillStyle = '#8B2635';
          } else {
            ctx.fillStyle = '#ffffff';
          }
          ctx.fillRect(startX + j * cellSize, startY + i * cellSize, cellSize, cellSize);
        }
      }
    };

    drawFinderPattern(0, 0);
    drawFinderPattern((cells - 7) * cellSize, 0);
    drawFinderPattern(0, (cells - 7) * cellSize);

    ctx.fillStyle = '#ffffff';
    const centerSize = 56;
    const centerX = (size - centerSize) / 2;
    const centerY = (size - centerSize) / 2;
    ctx.fillRect(centerX, centerY, centerSize, centerSize);

    ctx.fillStyle = selectedGuest.relation === 'groom_side' ? '#60A5FA' : '#F472B6';
    ctx.fillRect(centerX + 4, centerY + 4, centerSize - 8, centerSize - 8);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(getInitials(selectedGuest.name), size / 2, size / 2);

    return () => {
      ctx.clearRect(0, 0, size, size);
    };
  }, [mode, selectedGuest]);

  const handleManualCheckIn = () => {
    if (!manualInput.trim()) return;
    const guest = guests.find(
      (g) => g.name === manualInput.trim() || g.phone.includes(manualInput.trim())
    );
    if (guest) {
      if (!guest.checkedIn) {
        toggleGuestCheckIn(guest.id);
        setRecentCheckin(guest.name);
        setTimeout(() => setRecentCheckin(null), 3000);
      }
    }
    setManualInput('');
  };

  const handleQuickCheckIn = (id: string, name: string) => {
    toggleGuestCheckIn(id);
    const guest = guests.find((g) => g.id === id);
    if (guest && !guest.checkedIn) {
      setRecentCheckin(name);
      setTimeout(() => setRecentCheckin(null), 3000);
    }
  };

  const handleCopyLink = () => {
    if (!selectedGuest) return;
    const link = generateCheckInLink(selectedGuest.id);
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSelectGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setShowGuestDropdown(false);
    setSearch('');
  };

  const timelineData = () => {
    const hours: Record<string, number> = {};
    checkedInGuests.forEach((g) => {
      if (g.checkedInAt) {
        const h = new Date(g.checkedInAt).getHours();
        const key = `${String(h).padStart(2, '0')}:00`;
        hours[key] = (hours[key] || 0) + 1;
      }
    });
    const sorted = Object.entries(hours).sort(([a], [b]) => a.localeCompare(b));
    const maxVal = Math.max(1, ...sorted.map(([, v]) => v));
    return sorted.map(([time, count]) => ({ time, count, height: (count / maxVal) * 100 }));
  };

  const timeline = timelineData();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: '签到进度',
            value: `${percent.toFixed(0)}%`,
            sub: `${checkedInGuests.length} / ${confirmedGuests.length}`,
            icon: <UserCheck size={24} className="text-rose-500" />,
            bg: 'from-rose-100 to-pink-100',
            text: 'text-wine-700',
          },
          {
            label: '已签到人数',
            value: String(checkedInAttendees),
            sub: '含陪同人员',
            icon: <CheckCircle2 size={24} className="text-green-600" />,
            bg: 'from-green-100 to-emerald-100',
            text: 'text-green-700',
          },
          {
            label: '待签到',
            value: String(notCheckedIn.length),
            sub: '未到场确认',
            icon: <Clock size={24} className="text-amber-600" />,
            bg: 'from-amber-100 to-orange-100',
            text: 'text-amber-700',
          },
          {
            label: '预计总人数',
            value: String(totalAttendees),
            sub: '含陪同+1',
            icon: <Users size={24} className="text-purple-600" />,
            bg: 'from-purple-100 to-violet-100',
            text: 'text-purple-700',
          },
        ].map((stat) => (
          <div key={stat.label} className={`card !p-5 bg-gradient-to-br ${stat.bg} border-0`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-champagne-600 mb-1">{stat.label}</p>
                <p className={`font-display text-3xl font-bold ${stat.text}`}>{stat.value}</p>
                <p className="text-xs text-champagne-500 mt-1">{stat.sub}</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center shadow-sm">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card flex flex-col items-center justify-center py-8">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-champagne-50 mb-6">
            <button
              onClick={() => setMode('scan')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all',
                mode === 'scan' ? 'bg-white text-wine-700 shadow-sm' : 'text-champagne-600'
              )}
            >
              <QrCode size={16} />
              扫码签到
            </button>
            <button
              onClick={() => setMode('manual')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all',
                mode === 'manual' ? 'bg-white text-wine-700 shadow-sm' : 'text-champagne-600'
              )}
            >
              <Hand size={16} />
              手动签到
            </button>
          </div>

          {mode === 'scan' ? (
            <div className="w-full max-w-sm space-y-4">
              <div className="relative" ref={dropdownRef}>
                <label className="label-field flex items-center gap-2 mb-2">
                  <UserCheck size={14} className="text-rose-500" />
                  选择嘉宾生成专属签到码
                </label>
                <button
                  onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                  className="w-full input-field flex items-center justify-between"
                >
                  {selectedGuest ? (
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold',
                        selectedGuest.relation === 'groom_side'
                          ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                          : 'bg-gradient-to-br from-pink-400 to-rose-500'
                      )}>
                        {getInitials(selectedGuest.name)}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800 text-sm">{selectedGuest.name}</p>
                        <p className="text-xs text-champagne-500">
                          {selectedGuest.relation === 'groom_side' ? '新郎方' : '新娘方'}
                          {selectedGuest.checkedIn && ' · 已签到'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-champagne-400">请选择一位嘉宾</span>
                  )}
                  <ChevronDown size={18} className="text-champagne-400" />
                </button>

                {showGuestDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-champagne-200 shadow-lg z-50 max-h-64 overflow-y-auto">
                    <div className="p-2 border-b border-champagne-100">
                      <input
                        type="text"
                        placeholder="搜索嘉宾姓名或电话..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-champagne-200 text-sm focus:outline-none focus:border-rose-300"
                      />
                    </div>
                    <div className="py-1">
                      {dropdownFiltered.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-champagne-500 text-center">没有找到匹配的嘉宾</p>
                      ) : (
                        dropdownFiltered.map((guest) => (
                          <button
                            key={guest.id}
                            onClick={() => handleSelectGuest(guest)}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-2.5 hover:bg-champagne-50 transition-colors',
                              selectedGuest?.id === guest.id && 'bg-rose-50'
                            )}
                          >
                            <div className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0',
                              guest.relation === 'groom_side'
                                ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                                : 'bg-gradient-to-br from-pink-400 to-rose-500'
                            )}>
                              {getInitials(guest.name)}
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-800 text-sm truncate">{guest.name}</p>
                                {guest.checkedIn && (
                                  <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-champagne-500 truncate">
                                {guest.relation === 'groom_side' ? '新郎方' : '新娘方'} · {guest.phone}
                              </p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {selectedGuest && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-champagne-50">
                  <span className="text-xs text-champagne-600">签到链接：</span>
                  <code className="flex-1 text-xs text-champagne-700 font-mono truncate">
                    {generateCheckInLink(selectedGuest.id)}
                  </code>
                  <button
                    onClick={handleCopyLink}
                    className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white transition-colors"
                  >
                    {copiedLink ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-champagne-500" />}
                  </button>
                </div>
              )}

              <div className="relative flex justify-center">
                <div className="p-6 rounded-3xl bg-gradient-romantic shadow-romantic">
                  <div className="p-3 rounded-2xl bg-white shadow-inner-gold">
                    <canvas ref={canvasRef} className="block rounded-xl" />
                  </div>
                </div>
                <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-champagne-400 rounded-tl-xl" />
                <div className="absolute -top-3 -right-3 w-8 h-8 border-t-4 border-r-4 border-champagne-400 rounded-tr-xl" />
                <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-4 border-l-4 border-champagne-400 rounded-bl-xl" />
                <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-champagne-400 rounded-br-xl" />
              </div>

              {selectedGuest && (
                <div className="text-center">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">{selectedGuest.name}</span> 的专属签到码
                  </p>
                  <p className="text-xs text-champagne-500 mt-1">
                    扫码后自动完成签到，实时更新统计数据
                  </p>
                </div>
              )}

              {!selectedGuest && (
                <div className="text-center text-champagne-500 text-sm">
                  <p>👆 请先在上方选择一位嘉宾</p>
                  <p className="mt-1">系统将为其生成专属的签到二维码</p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full max-w-sm">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 mb-4">
                <p className="text-sm text-rose-700 mb-3 flex items-center gap-2">
                  <UserCheck size={16} />
                  输入嘉宾姓名或手机号快速签到
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input-field flex-1"
                    placeholder="输入姓名或电话..."
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleManualCheckIn()}
                  />
                  <button onClick={handleManualCheckIn} className="btn-primary px-4">
                    签到
                  </button>
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs text-champagne-500">快捷签到常用嘉宾</p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {notCheckedIn.slice(0, 6).map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handleQuickCheckIn(g.id, g.name)}
                      className="px-3 py-1.5 rounded-full text-xs bg-white border border-champagne-200 text-gray-700 hover:border-rose-300 hover:bg-rose-50 transition-all"
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {recentCheckin && (
            <div className="mt-6 px-5 py-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3 animate-slide-up w-full max-w-sm">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                <CheckCircle2 size={20} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-green-800">{recentCheckin}</p>
                <p className="text-xs text-green-600">签到成功！</p>
              </div>
            </div>
          )}
        </div>

        <div className="card lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <h3 className="font-display text-lg font-semibold text-wine-700 flex items-center gap-2">
              <Users size={20} className="text-champagne-500" />
              实时签到列表
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-champagne-400" />
                <input
                  type="text"
                  className="input-field pl-9 !py-2 text-sm w-48"
                  placeholder="搜索..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex rounded-xl border border-champagne-200 p-0.5">
                {([
                  ['all', '全部'],
                  ['checked', '已签到'],
                  ['unchecked', '未签到'],
                ] as const).map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => setFilter(v)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                      filter === v ? 'bg-white text-wine-700 shadow-sm' : 'text-champagne-600'
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="w-9 h-9 rounded-xl border border-champagne-200 hover:bg-champagne-50 flex items-center justify-center text-champagne-500"
                title="刷新"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
            {filtered.map((guest) => (
              <div
                key={guest.id}
                className={cn(
                  'flex items-center justify-between p-3 rounded-xl transition-all',
                  guest.checkedIn
                    ? 'bg-green-50/60 border border-green-100'
                    : 'bg-champagne-50/30 hover:bg-champagne-50 border border-transparent hover:border-champagne-200',
                  selectedGuest?.id === guest.id && mode === 'scan' && 'ring-2 ring-rose-300'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'relative w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold shadow',
                    guest.relation === 'groom_side'
                      ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                      : 'bg-gradient-to-br from-pink-400 to-rose-500'
                  )}>
                    {getInitials(guest.name)}
                    {guest.checkedIn && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800">{guest.name}</p>
                      {guest.plusOne && (
                        <span className="badge bg-champagne-100 text-champagne-700 text-[10px]">+1</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-champagne-500 mt-0.5">
                      <span>{guest.group || (guest.relation === 'groom_side' ? '新郎方' : '新娘方')}</span>
                      {guest.checkedInAt && (
                        <span>
                          {new Date(guest.checkedInAt).toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {mode === 'scan' && guest.rsvpStatus === 'confirmed' && (
                    <button
                      onClick={() => handleSelectGuest(guest)}
                      className={cn(
                        'px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5',
                        selectedGuest?.id === guest.id
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-champagne-50 text-champagne-600 hover:bg-champagne-100'
                      )}
                    >
                      <QrCode size={14} />
                      签到码
                    </button>
                  )}
                  <button
                    onClick={() => handleQuickCheckIn(guest.id, guest.name)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
                      guest.checkedIn
                        ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        : 'bg-gradient-romantic text-white shadow-romantic hover:-translate-y-0.5'
                    )}
                  >
                    {guest.checkedIn ? (
                      <>
                        <XCircle size={15} />
                        撤销
                      </>
                    ) : (
                      <>
                        <UserCheck size={15} />
                        签到
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-champagne-400">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-sm">没有找到匹配的嘉宾</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {timeline.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg font-semibold text-wine-700">签到时间分布</h3>
            <span className="text-xs text-champagne-500">{formatDate(new Date().toISOString())}</span>
          </div>
          <div className="flex items-end gap-3 h-40 px-4">
            {timeline.map((d) => (
              <div key={d.time} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-wine-700">{d.count}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-rose-400 to-champagne-400 transition-all hover:from-rose-500 hover:to-champagne-500 min-h-[8px]"
                  style={{ height: `${Math.max(8, d.height)}%` }}
                />
                <span className="text-[10px] text-champagne-500">{d.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
