import { useState } from 'react';
import {
  Plus,
  Trash2,
  Users,
  Edit2,
  GripVertical,
  X,
  Save,
} from 'lucide-react';
import { useWeddingStore } from '@/store/weddingStore';
import { Guest, Table } from '@/types';
import { cn, getInitials } from '@/utils';
import Modal from '@/components/common/Modal';

export default function Seating() {
  const guests = useWeddingStore((s) => s.guests);
  const tables = useWeddingStore((s) => s.tables);
  const addTable = useWeddingStore((s) => s.addTable);
  const updateTable = useWeddingStore((s) => s.updateTable);
  const deleteTable = useWeddingStore((s) => s.deleteTable);
  const assignGuestSeat = useWeddingStore((s) => s.assignGuestSeat);
  const unassignGuestSeat = useWeddingStore((s) => s.unassignGuestSeat);

  const [tableModal, setTableModal] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [tableForm, setTableForm] = useState({ name: '', type: 'round' as Table['type'], capacity: 10 });
  const [draggedGuest, setDraggedGuest] = useState<Guest | null>(null);

  const unassignedGuests = guests.filter((g) => !g.tableId && g.rsvpStatus !== 'declined');

  const openAddTable = () => {
    setEditingTable(null);
    setTableForm({ name: `桌位${tables.length + 1}号`, type: 'round', capacity: 10 });
    setTableModal(true);
  };

  const openEditTable = (t: Table) => {
    setEditingTable(t);
    setTableForm({ name: t.name, type: t.type, capacity: t.capacity });
    setTableModal(true);
  };

  const handleSaveTable = () => {
    if (!tableForm.name.trim()) return;
    if (editingTable) {
      updateTable(editingTable.id, tableForm);
    } else {
      addTable(tableForm);
    }
    setTableModal(false);
  };

  const handleDropOnTable = (tableId: string) => {
    if (!draggedGuest) return;
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;
    const seatedCount = guests.filter((g) => g.tableId === tableId).length;
    const nextSeat = seatedCount + 1;
    if (nextSeat > table.capacity) {
      alert('该桌已坐满！');
      return;
    }
    assignGuestSeat(draggedGuest.id, tableId, nextSeat);
    setDraggedGuest(null);
  };

  const handleDeleteTable = (id: string) => {
    if (confirm('确定删除此桌位？该桌嘉宾将变为未分配状态。')) {
      deleteTable(id);
    }
  };

  const renderSeatedGuests = (table: Table) => {
    const seated = guests.filter((g) => g.tableId === table.id);
    const filled = seated.length;
    const total = table.capacity;

    return (
      <div className="mt-4 grid grid-cols-5 gap-2">
        {Array.from({ length: total }).map((_, idx) => {
          const guest = seated[idx];
          const seatNum = idx + 1;
          return (
            <div key={idx} className="relative group">
              {guest ? (
                <div
                  className="flex flex-col items-center cursor-move transition-transform hover:scale-110"
                  draggable
                  onDragStart={() => setDraggedGuest(guest)}
                  onDragEnd={() => setDraggedGuest(null)}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-md border-2 border-white',
                    guest.relation === 'groom_side' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-pink-400 to-rose-500'
                  )}>
                    {getInitials(guest.name)}
                  </div>
                  <p className="text-[10px] text-gray-600 mt-1 truncate w-full text-center">
                    {guest.name.slice(0, 4)}
                  </p>
                  <button
                    onClick={() => unassignGuestSeat(guest.id)}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow"
                  >
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center opacity-40">
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-champagne-300 flex items-center justify-center text-champagne-300 text-[10px]">
                    {seatNum}
                  </div>
                  <p className="text-[10px] text-champagne-300 mt-1">空位</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 animate-fade-in">
      <div className="xl:col-span-3 space-y-6">
        <div className="card !p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
                  <span className="text-gray-600">新郎方</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-400 to-rose-500" />
                  <span className="text-gray-600">新娘方</span>
                </div>
                <div className="flex items-center gap-2 text-champagne-500">
                  <GripVertical size={16} />
                  <span>可拖拽入座</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-champagne-50 text-sm">
                <Users size={16} className="text-champagne-600" />
                <span className="text-gray-700">
                  已安排 <strong className="text-wine-700">{guests.filter(g => g.tableId).length}</strong>
                  {' / '}
                  {guests.filter(g => g.rsvpStatus !== 'declined').length} 人
                </span>
              </div>
              <button onClick={openAddTable} className="btn-primary flex items-center gap-2">
                <Plus size={18} />
                添加桌位
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tables.map((table, tableIdx) => {
            const seatedCount = guests.filter((g) => g.tableId === table.id).length;
            const isFull = seatedCount >= table.capacity;
            const isMain = tableIdx === 0;

            return (
              <div
                key={table.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDropOnTable(table.id)}
                className={cn(
                  'card transition-all relative',
                  draggedGuest && !isFull && 'ring-2 ring-rose-300 bg-rose-50/50 scale-[1.01]',
                  isMain && 'border-champagne-400 border-2'
                )}
              >
                {isMain && (
                  <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-gold text-white text-xs font-medium shadow">
                    👑 主桌
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {table.type === 'round' ? (
                        <div className={cn(
                          'w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-lg',
                          isFull
                            ? 'border-green-400 bg-gradient-to-br from-green-100 to-emerald-100'
                            : 'border-champagne-300 bg-gradient-to-br from-champagne-50 to-cream-100'
                        )}>
                          <div className="text-center">
                            <p className="font-display text-xl font-bold text-wine-700">{table.name}</p>
                            <p className="text-[10px] text-champagne-600 mt-0.5">
                              {seatedCount}/{table.capacity} 人
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className={cn(
                          'w-24 h-24 rounded-xl flex items-center justify-center border-4 shadow-lg',
                          isFull
                            ? 'border-green-400 bg-gradient-to-br from-green-100 to-emerald-100'
                            : 'border-champagne-300 bg-gradient-to-br from-champagne-50 to-cream-100'
                        )}>
                          <div className="text-center">
                            <p className="font-display text-lg font-bold text-wine-700">{table.name}</p>
                            <p className="text-[10px] text-champagne-600 mt-0.5">
                              {seatedCount}/{table.capacity} 人
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="w-40 progress-bar">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            isFull
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                              : 'bg-gradient-romantic'
                          )}
                          style={{ width: `${(seatedCount / table.capacity) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-champagne-500 mt-2">
                        {table.type === 'round' ? '⭕ 圆桌' : '⬛ 方桌'} · 容量 {table.capacity}人
                      </p>
                      <p className={cn(
                        'text-xs font-medium mt-0.5',
                        isFull ? 'text-green-600' : 'text-amber-600'
                      )}>
                        {isFull ? '✓ 已坐满' : `剩余 ${table.capacity - seatedCount} 座`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditTable(table)}
                      className="w-8 h-8 rounded-lg hover:bg-champagne-100 flex items-center justify-center text-champagne-500 hover:text-wine-700 transition-all"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteTable(table.id)}
                      className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-champagne-500 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                {renderSeatedGuests(table)}
              </div>
            );
          })}
        </div>

        {tables.length === 0 && (
          <div className="card text-center py-16 text-champagne-500">
            <div className="text-5xl mb-3">🪑</div>
            <p className="font-medium">暂无桌位安排</p>
            <p className="text-sm mt-1">点击"添加桌位"开始创建座位布局</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <Users size={20} className="text-rose-500" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-wine-700">待安排</h3>
                <p className="text-xs text-champagne-500">{unassignedGuests.length} 人未分配</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
            {unassignedGuests.map((guest) => (
              <div
                key={guest.id}
                draggable
                onDragStart={() => setDraggedGuest(guest)}
                onDragEnd={() => setDraggedGuest(null)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing',
                  draggedGuest?.id === guest.id
                    ? 'border-rose-300 bg-rose-50 scale-95 opacity-50'
                    : 'border-champagne-100 hover:border-champagne-300 hover:bg-champagne-50/50 hover:shadow-sm'
                )}
              >
                <GripVertical size={16} className="text-champagne-300" />
                <div className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow',
                  guest.relation === 'groom_side'
                    ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                    : 'bg-gradient-to-br from-pink-400 to-rose-500'
                )}>
                  {getInitials(guest.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">{guest.name}</p>
                  <p className="text-xs text-champagne-500">{guest.group || guest.relation === 'groom_side' ? '新郎方' : '新娘方'}</p>
                </div>
                {guest.plusOne && (
                  <span className="badge bg-champagne-100 text-champagne-700 text-[10px]">+1</span>
                )}
              </div>
            ))}

            {unassignedGuests.length === 0 && (
              <div className="text-center py-12 text-champagne-400">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-sm">太棒了！所有嘉宾都已安排</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={tableModal}
        onClose={() => setTableModal(false)}
        title={editingTable ? '编辑桌位' : '添加桌位'}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setTableModal(false)}>取消</button>
            <button className="btn-primary flex items-center gap-2" onClick={handleSaveTable}>
              <Save size={16} />
              {editingTable ? '保存' : '添加'}
            </button>
          </>
        }
      >
        <div className="space-y-5">
          <div>
            <label className="label-field">桌位名称</label>
            <input
              type="text"
              className="input-field"
              value={tableForm.name}
              onChange={(e) => setTableForm({ ...tableForm, name: e.target.value })}
              placeholder="例如：主桌、1号桌..."
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="label-field">桌位类型</label>
              <div className="flex gap-3">
                {[
                  { v: 'round', label: '圆桌', icon: '⭕' },
                  { v: 'square', label: '方桌', icon: '⬛' },
                ].map((opt) => (
                  <button
                    key={opt.v}
                    onClick={() => setTableForm({ ...tableForm, type: opt.v as Table['type'] })}
                    className={cn(
                      'flex-1 py-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all',
                      tableForm.type === opt.v
                        ? 'border-rose-400 bg-rose-50 text-rose-700'
                        : 'border-champagne-100 hover:border-champagne-200 text-gray-600'
                    )}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="text-sm font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label-field">座位容量</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTableForm({ ...tableForm, capacity: Math.max(4, tableForm.capacity - 2) })}
                  className="w-12 h-12 rounded-xl bg-champagne-50 hover:bg-champagne-100 flex items-center justify-center text-champagne-700 text-xl font-bold transition-colors"
                >
                  −
                </button>
                <div className="flex-1 text-center">
                  <p className="font-display text-3xl font-bold text-wine-700">{tableForm.capacity}</p>
                  <p className="text-xs text-champagne-500">个座位</p>
                </div>
                <button
                  onClick={() => setTableForm({ ...tableForm, capacity: Math.min(20, tableForm.capacity + 2) })}
                  className="w-12 h-12 rounded-xl bg-champagne-50 hover:bg-champagne-100 flex items-center justify-center text-champagne-700 text-xl font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
