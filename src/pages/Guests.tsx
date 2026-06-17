import { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  UserPlus,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  MessageSquare,
} from 'lucide-react';
import { useWeddingStore } from '@/store/weddingStore';
import { Guest } from '@/types';
import { cn, getInitials, formatShortDate } from '@/utils';
import Modal from '@/components/common/Modal';

const rsvpColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  declined: 'bg-gray-100 text-gray-600',
};

const rsvpLabels: Record<string, string> = {
  pending: '待回复',
  confirmed: '已确认',
  declined: '无法参加',
};

export default function Guests() {
  const guests = useWeddingStore((s) => s.guests);
  const addGuest = useWeddingStore((s) => s.addGuest);
  const updateGuest = useWeddingStore((s) => s.updateGuest);
  const deleteGuest = useWeddingStore((s) => s.deleteGuest);
  const setGuestRSVP = useWeddingStore((s) => s.setGuestRSVP);

  const [search, setSearch] = useState('');
  const [relationFilter, setRelationFilter] = useState<'all' | 'groom_side' | 'bride_side'>('all');
  const [rsvpFilter, setRsvpFilter] = useState<'all' | Guest['rsvpStatus']>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Guest | null>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    relation: 'groom_side' as Guest['relation'],
    group: '',
    seatPreference: '',
    rsvpStatus: 'pending' as Guest['rsvpStatus'],
    plusOne: false,
    plusOneName: '',
    notes: '',
  });

  const openAddModal = () => {
    setEditing(null);
    setForm({
      name: '',
      phone: '',
      email: '',
      relation: 'groom_side',
      group: '',
      seatPreference: '',
      rsvpStatus: 'pending',
      plusOne: false,
      plusOneName: '',
      notes: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (guest: Guest) => {
    setEditing(guest);
    setForm({
      name: guest.name,
      phone: guest.phone,
      email: guest.email || '',
      relation: guest.relation,
      group: guest.group || '',
      seatPreference: guest.seatPreference || '',
      rsvpStatus: guest.rsvpStatus,
      plusOne: guest.plusOne || false,
      plusOneName: guest.plusOneName || '',
      notes: guest.notes || '',
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    if (editing) {
      updateGuest(editing.id, form);
    } else {
      addGuest(form);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除此嘉宾信息吗？')) {
      deleteGuest(id);
    }
  };

  const filtered = useMemo(() => {
    return guests.filter((g) => {
      if (search && !g.name.includes(search) && !g.phone.includes(search)) return false;
      if (relationFilter !== 'all' && g.relation !== relationFilter) return false;
      if (rsvpFilter !== 'all' && g.rsvpStatus !== rsvpFilter) return false;
      return true;
    });
  }, [guests, search, relationFilter, rsvpFilter]);

  const stats = {
    total: guests.length,
    groomSide: guests.filter((g) => g.relation === 'groom_side').length,
    brideSide: guests.filter((g) => g.relation === 'bride_side').length,
    confirmed: guests.filter((g) => g.rsvpStatus === 'confirmed').length,
    pending: guests.filter((g) => g.rsvpStatus === 'pending').length,
    declined: guests.filter((g) => g.rsvpStatus === 'declined').length,
    plusOne: guests.filter((g) => g.plusOne).length,
    totalAttendees:
      guests.filter((g) => g.rsvpStatus === 'confirmed').length +
      guests.filter((g) => g.rsvpStatus === 'confirmed' && g.plusOne).length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '总嘉宾数', value: stats.total, icon: '👥', color: 'from-rose-100 to-pink-100', text: 'text-wine-700' },
          { label: '新郎方', value: stats.groomSide, icon: '🤵', color: 'from-blue-100 to-indigo-100', text: 'text-blue-700' },
          { label: '新娘方', value: stats.brideSide, icon: '👰', color: 'from-pink-100 to-rose-100', text: 'text-pink-700' },
          { label: '预计出席', value: stats.totalAttendees, icon: '✓', color: 'from-green-100 to-emerald-100', text: 'text-green-700' },
        ].map((s) => (
          <div key={s.label} className={`card !p-4 bg-gradient-to-br ${s.color} border-0`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-champagne-600 mb-1">{s.label}</p>
                <p className={`font-display text-3xl font-bold ${s.text}`}>{s.value}</p>
              </div>
              <span className="text-3xl">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-champagne-400" />
              <input
                type="text"
                className="input-field pl-11"
                placeholder="搜索嘉宾姓名或电话..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-champagne-50 border border-champagne-100">
              <Filter size={16} className="text-champagne-500 mx-2" />
              <select
                className="bg-transparent text-sm py-1.5 px-2 outline-none text-gray-700"
                value={relationFilter}
                onChange={(e) => setRelationFilter(e.target.value as any)}
              >
                <option value="all">全部关系</option>
                <option value="groom_side">新郎方</option>
                <option value="bride_side">新娘方</option>
              </select>
              <select
                className="bg-transparent text-sm py-1.5 px-2 outline-none text-gray-700"
                value={rsvpFilter}
                onChange={(e) => setRsvpFilter(e.target.value as any)}
              >
                <option value="all">全部状态</option>
                <option value="pending">待回复</option>
                <option value="confirmed">已确认</option>
                <option value="declined">无法参加</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary flex items-center gap-2 text-sm">
              <Download size={16} />
              导出
            </button>
            <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
              <Plus size={18} />
              添加嘉宾
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 rounded-2xl bg-gradient-to-r from-cream-50 to-champagne-50 border border-champagne-100">
          {[
            { label: '已确认出席', value: stats.confirmed, color: 'text-green-600', bg: 'bg-green-500' },
            { label: '等待回复', value: stats.pending, color: 'text-amber-600', bg: 'bg-amber-500' },
            { label: '无法参加', value: stats.declined, color: 'text-gray-600', bg: 'bg-gray-400' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <div className={`w-3 h-3 rounded-full ${item.bg} ${item.label === '等待回复' ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-xs text-champagne-600">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto -mx-2 scrollbar-thin">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b-2 border-champagne-100">
                <th className="text-left py-3 px-2 text-xs font-semibold text-champagne-600 uppercase tracking-wider">嘉宾信息</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-champagne-600 uppercase tracking-wider">联系方式</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-champagne-600 uppercase tracking-wider">分组</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-champagne-600 uppercase tracking-wider">RSVP状态</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-champagne-600 uppercase tracking-wider">快速操作</th>
                <th className="text-right py-3 px-2 text-xs font-semibold text-champagne-600 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-champagne-50">
              {filtered.map((guest) => (
                <tr key={guest.id} className="hover:bg-cream-50 transition-colors group">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-romantic flex items-center justify-center text-white font-semibold shadow-romantic flex-shrink-0">
                        {getInitials(guest.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-800 truncate">{guest.name}</p>
                          <span className={cn(
                            'badge text-xs',
                            guest.relation === 'groom_side' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                          )}>
                            {guest.relation === 'groom_side' ? '新郎方' : '新娘方'}
                          </span>
                        </div>
                        {guest.plusOne && (
                          <p className="text-xs text-champagne-500 flex items-center gap-1 mt-0.5">
                            <UserPlus size={11} />
                            +1 陪同: {guest.plusOneName || '宾客'}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-700 flex items-center gap-1.5">
                        <Phone size={13} className="text-champagne-500" />
                        {guest.phone}
                      </p>
                      {guest.email && (
                        <p className="text-sm text-champagne-500 flex items-center gap-1.5 truncate">
                          <Mail size={13} className="text-champagne-500" />
                          <span className="truncate">{guest.email}</span>
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <p className="text-sm text-gray-700">{guest.group || '—'}</p>
                    {guest.seatPreference && (
                      <p className="text-xs text-champagne-500 mt-0.5 flex items-center gap-1">
                        💺 {guest.seatPreference}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <span className={cn('badge', rsvpColors[guest.rsvpStatus])}>
                      {guest.rsvpStatus === 'confirmed' && <CheckCircle size={12} className="mr-1" />}
                      {guest.rsvpStatus === 'declined' && <XCircle size={12} className="mr-1" />}
                      {guest.rsvpStatus === 'pending' && <Clock size={12} className="mr-1" />}
                      {rsvpLabels[guest.rsvpStatus]}
                    </span>
                    {guest.confirmedAt && (
                      <p className="text-xs text-champagne-400 mt-1 ml-1">
                        {formatShortDate(guest.confirmedAt)}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {guest.rsvpStatus !== 'confirmed' && (
                        <button
                          onClick={() => setGuestRSVP(guest.id, 'confirmed')}
                          className="px-2.5 py-1 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium transition-colors"
                        >
                          确认出席
                        </button>
                      )}
                      {guest.rsvpStatus !== 'pending' && (
                        <button
                          onClick={() => setGuestRSVP(guest.id, 'pending')}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-medium transition-colors"
                        >
                          待回复
                        </button>
                      )}
                      <button
                        className="w-8 h-8 rounded-lg hover:bg-champagne-100 flex items-center justify-center text-champagne-500 hover:text-champagne-700 transition-all"
                        title="发送提醒"
                      >
                        <MessageSquare size={15} />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(guest)}
                        className="w-8 h-8 rounded-lg hover:bg-champagne-100 flex items-center justify-center text-champagne-500 hover:text-wine-700 transition-all"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(guest.id)}
                        className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-champagne-500 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-champagne-500">
            <div className="text-5xl mb-3">👥</div>
            <p className="font-medium">暂无嘉宾信息</p>
            <p className="text-sm mt-1">点击"添加嘉宾"开始录入受邀名单</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? '编辑嘉宾信息' : '添加新嘉宾'}
        size="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>取消</button>
            <button className="btn-primary" onClick={handleSave}>
              {editing ? '保存修改' : '添加嘉宾'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="label-field">嘉宾姓名 *</label>
            <input
              type="text"
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="请输入嘉宾姓名"
            />
          </div>
          <div>
            <label className="label-field">联系电话 *</label>
            <input
              type="tel"
              className="input-field"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="13800138000"
            />
          </div>
          <div>
            <label className="label-field">电子邮箱</label>
            <input
              type="email"
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="guest@example.com"
            />
          </div>
          <div>
            <label className="label-field">关系方</label>
            <div className="flex gap-2">
              <button
                onClick={() => setForm({ ...form, relation: 'groom_side' })}
                className={cn(
                  'flex-1 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all',
                  form.relation === 'groom_side'
                    ? 'bg-blue-50 text-blue-700 border-blue-300'
                    : 'border-champagne-100 text-champagne-500 hover:border-champagne-200'
                )}
              >
                🤵 新郎方
              </button>
              <button
                onClick={() => setForm({ ...form, relation: 'bride_side' })}
                className={cn(
                  'flex-1 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all',
                  form.relation === 'bride_side'
                    ? 'bg-pink-50 text-pink-700 border-pink-300'
                    : 'border-champagne-100 text-champagne-500 hover:border-champagne-200'
                )}
              >
                👰 新娘方
              </button>
            </div>
          </div>
          <div>
            <label className="label-field">分组标签</label>
            <input
              type="text"
              className="input-field"
              value={form.group}
              onChange={(e) => setForm({ ...form, group: e.target.value })}
              placeholder="例如：同事/亲戚/大学同学"
            />
          </div>
          <div>
            <label className="label-field">RSVP状态</label>
            <select
              className="input-field"
              value={form.rsvpStatus}
              onChange={(e) => setForm({ ...form, rsvpStatus: e.target.value as Guest['rsvpStatus'] })}
            >
              <option value="pending">待回复</option>
              <option value="confirmed">确认出席</option>
              <option value="declined">无法参加</option>
            </select>
          </div>
          <div>
            <label className="label-field">座位偏好</label>
            <input
              type="text"
              className="input-field"
              value={form.seatPreference}
              onChange={(e) => setForm({ ...form, seatPreference: e.target.value })}
              placeholder="例如：靠近主桌"
            />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-champagne-100 hover:border-champagne-200 transition-colors">
              <input
                type="checkbox"
                checked={form.plusOne}
                onChange={(e) => setForm({ ...form, plusOne: e.target.checked })}
                className="w-5 h-5 rounded text-rose-500 focus:ring-rose-400"
              />
              <span className="font-medium text-gray-700">此嘉宾可携带1位陪同人员</span>
            </label>
          </div>
          {form.plusOne && (
            <div className="md:col-span-2 !-mt-3">
              <label className="label-field">陪同人员姓名</label>
              <input
                type="text"
                className="input-field"
                value={form.plusOneName}
                onChange={(e) => setForm({ ...form, plusOneName: e.target.value })}
                placeholder="请输入陪同人员姓名（选填）"
              />
            </div>
          )}
          <div className="md:col-span-2">
            <label className="label-field">备注</label>
            <textarea
              className="input-field min-h-[80px] resize-none"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="其他需要记录的信息"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
