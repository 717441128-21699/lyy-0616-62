import { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Building2,
  Shirt,
  UtensilsCrossed,
  Camera,
  Church,
  MoreHorizontal,
  CalendarClock,
  User,
  Flag,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useWeddingStore } from '@/store/weddingStore';
import { ChecklistTask, TaskCategory } from '@/types';
import { cn, formatShortDate, getDaysUntil, isOverdue } from '@/utils';
import {
  categoryLabels,
  categoryColors,
  statusLabels,
  statusColors,
  assigneeLabels,
  priorityLabels,
} from '@/data/mockData';
import Modal from '@/components/common/Modal';

const categoryIcons: Record<TaskCategory, typeof Building2> = {
  venue: Building2,
  dress: Shirt,
  catering: UtensilsCrossed,
  photo: Camera,
  ceremony: Church,
  other: MoreHorizontal,
};

const allCategories: TaskCategory[] = ['venue', 'dress', 'catering', 'photo', 'ceremony', 'other'];

const priorityOptions = [
  { value: 'high', label: '高优先级', color: 'text-red-600', bg: 'bg-red-100' },
  { value: 'medium', label: '中优先级', color: 'text-amber-600', bg: 'bg-amber-100' },
  { value: 'low', label: '低优先级', color: 'text-green-600', bg: 'bg-green-100' },
];

const assigneeOptions = [
  { value: 'groom', label: '新郎' },
  { value: 'bride', label: '新娘' },
  { value: 'groom_father', label: '新郎父亲' },
  { value: 'groom_mother', label: '新郎母亲' },
  { value: 'bride_father', label: '新娘父亲' },
  { value: 'bride_mother', label: '新娘母亲' },
];

export default function Checklist() {
  const tasks = useWeddingStore((s) => s.tasks);
  const addTask = useWeddingStore((s) => s.addTask);
  const updateTask = useWeddingStore((s) => s.updateTask);
  const deleteTask = useWeddingStore((s) => s.deleteTask);
  const toggleTaskStatus = useWeddingStore((s) => s.toggleTaskStatus);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ChecklistTask | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  const today = new Date();
  const defaultDeadline = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [form, setForm] = useState({
    category: 'venue' as TaskCategory,
    title: '',
    description: '',
    deadline: defaultDeadline.toISOString().split('T')[0],
    assignee: 'groom' as ChecklistTask['assignee'],
    priority: 'medium' as ChecklistTask['priority'],
    status: 'pending' as ChecklistTask['status'],
  });

  const openAddModal = (category?: TaskCategory) => {
    setEditingTask(null);
    setForm({
      category: category || 'venue',
      title: '',
      description: '',
      deadline: defaultDeadline.toISOString().split('T')[0],
      assignee: 'groom',
      priority: 'medium',
      status: 'pending',
    });
    setModalOpen(true);
  };

  const openEditModal = (task: ChecklistTask) => {
    setEditingTask(task);
    setForm({
      category: task.category,
      title: task.title,
      description: task.description || '',
      deadline: task.deadline,
      assignee: task.assignee,
      priority: task.priority,
      status: task.status,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editingTask) {
      updateTask(editingTask.id, form);
    } else {
      addTask(form);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除此任务吗？')) {
      deleteTask(id);
    }
  };

  const toggleCategory = (cat: string) => {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredTasks = tasks.filter((t) => filter === 'all' || t.status === filter);

  const groupedTasks = allCategories.map((cat) => ({
    category: cat,
    items: filteredTasks.filter((t) => t.category === cat),
  }));

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <h3 className="font-display text-3xl font-bold text-wine-700">{completedCount}</h3>
                <span className="text-champagne-500">/ {totalCount} 项已完成</span>
              </div>
              <div className="w-64 h-2.5 progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex rounded-xl border border-champagne-200 p-1 bg-champagne-50/50">
              {(['all', 'pending', 'in_progress', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                    filter === f
                      ? 'bg-white text-wine-700 shadow-sm'
                      : 'text-champagne-600 hover:text-wine-700'
                  )}
                >
                  {f === 'all' ? '全部' : statusLabels[f]}
                </button>
              ))}
            </div>
            <button onClick={() => openAddModal()} className="btn-primary flex items-center gap-2">
              <Plus size={18} />
              添加任务
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {groupedTasks.map(({ category, items }) => {
          const Icon = categoryIcons[category];
          const isCollapsed = collapsed[category];
          const completedInCat = items.filter((i) => i.status === 'completed').length;

          return (
            <div key={category} className="card overflow-hidden !p-0">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-5 hover:bg-champagne-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', categoryColors[category])}>
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-display text-lg font-semibold text-wine-700">
                      {categoryLabels[category]}
                    </h4>
                    <p className="text-xs text-champagne-500">
                      {completedInCat}/{items.length} 项完成
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {items.length > 0 && (
                    <div className="w-32 progress-bar hidden md:block">
                      <div
                        className="progress-fill"
                        style={{ width: `${items.length > 0 ? (completedInCat / items.length) * 100 : 0}%` }}
                      />
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openAddModal(category);
                    }}
                    className="w-9 h-9 rounded-lg border border-champagne-200 hover:border-rose-300 hover:bg-rose-50 flex items-center justify-center text-champagne-500 hover:text-rose-600 transition-all"
                  >
                    <Plus size={16} />
                  </button>
                  {isCollapsed ? (
                    <ChevronDown size={20} className="text-champagne-500" />
                  ) : (
                    <ChevronUp size={20} className="text-champagne-500" />
                  )}
                </div>
              </button>

              {!isCollapsed && items.length > 0 && (
                <div className="border-t border-champagne-100 divide-y divide-champagne-50">
                  {items
                    .sort((a, b) => {
                      const priorityOrder = { high: 0, medium: 1, low: 2 };
                      return priorityOrder[a.priority] - priorityOrder[b.priority];
                    })
                    .map((task) => {
                      const daysLeft = getDaysUntil(task.deadline);
                      const isUrgent = daysLeft >= 0 && daysLeft <= 7;
                      const taskOverdue = isOverdue(task.deadline);
                      const isDone = task.status === 'completed';

                      return (
                        <div
                          key={task.id}
                          className={cn(
                            'p-4 flex items-start gap-4 transition-all hover:bg-cream-50',
                            isDone && 'opacity-60'
                          )}
                        >
                          <button
                            onClick={() => toggleTaskStatus(task.id)}
                            className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
                          >
                            {isDone ? (
                              <CheckSquare size={22} className="text-green-500" fill="currentColor" />
                            ) : (
                              <Square
                                size={22}
                                className={cn(
                                  'text-champagne-300 hover:text-rose-400',
                                  taskOverdue && 'text-red-400'
                                )}
                                strokeWidth={1.5}
                              />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div className="flex-1 min-w-0">
                                <h5 className={cn(
                                  'font-medium text-gray-800 mb-1',
                                  isDone && 'line-through text-gray-500'
                                )}>
                                  {task.title}
                                </h5>
                                {task.description && (
                                  <p className="text-sm text-champagne-500 line-clamp-1">
                                    {task.description}
                                  </p>
                                )}
                                <div className="mt-2 flex items-center gap-2 flex-wrap">
                                  <span className={cn('badge', statusColors[task.status])}>
                                    {statusLabels[task.status]}
                                  </span>
                                  <span className={cn(
                                    'badge',
                                    priorityOptions.find((p) => p.value === task.priority)?.bg,
                                    priorityOptions.find((p) => p.value === task.priority)?.color
                                  )}>
                                    <Flag size={11} className="mr-1" />
                                    {priorityLabels[task.priority]}
                                  </span>
                                  <span className={cn(
                                    'badge flex items-center gap-1',
                                    taskOverdue
                                      ? 'bg-red-100 text-red-700'
                                      : isUrgent
                                      ? 'bg-amber-100 text-amber-700'
                                      : 'bg-blue-50 text-blue-700'
                                  )}>
                                    <CalendarClock size={11} />
                                    {formatShortDate(task.deadline)}
                                    {taskOverdue
                                      ? ` · 逾期${Math.abs(daysLeft)}天`
                                      : daysLeft >= 0
                                      ? ` · 剩${daysLeft}天`
                                      : ''}
                                  </span>
                                  <span className="badge bg-gray-100 text-gray-600 flex items-center gap-1">
                                    <User size={11} />
                                    {assigneeLabels[task.assignee]}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                  onClick={() => openEditModal(task)}
                                  className="w-9 h-9 rounded-lg hover:bg-champagne-100 flex items-center justify-center text-champagne-500 hover:text-wine-700 transition-all"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(task.id)}
                                  className="w-9 h-9 rounded-lg hover:bg-red-50 flex items-center justify-center text-champagne-500 hover:text-red-500 transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {!isCollapsed && items.length === 0 && (
                <div className="p-8 text-center border-t border-champagne-100 text-champagne-400">
                  <p className="text-sm">暂无任务，点击右上角 + 添加</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? '编辑任务' : '添加新任务'}
        size="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>
              取消
            </button>
            <button className="btn-primary" onClick={handleSave}>
              {editingTask ? '保存修改' : '添加任务'}
            </button>
          </>
        }
      >
        <div className="space-y-5">
          <div>
            <label className="label-field">任务分类</label>
            <select
              className="input-field"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as TaskCategory })}
            >
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {categoryLabels[c]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-field">任务名称 *</label>
            <input
              type="text"
              className="input-field"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="例如：预订酒店婚房"
            />
          </div>

          <div>
            <label className="label-field">详细说明</label>
            <textarea
              className="input-field min-h-[90px] resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="补充任务的详细要求和注意事项"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label-field">截止日期</label>
              <input
                type="date"
                className="input-field"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
            <div>
              <label className="label-field">负责人</label>
              <select
                className="input-field"
                value={form.assignee}
                onChange={(e) => setForm({ ...form, assignee: e.target.value as ChecklistTask['assignee'] })}
              >
                {assigneeOptions.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label-field">优先级</label>
              <div className="flex gap-2">
                {priorityOptions.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setForm({ ...form, priority: p.value as ChecklistTask['priority'] })}
                    className={cn(
                      'flex-1 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all',
                      form.priority === p.value
                        ? `${p.bg} ${p.color} border-current shadow-sm`
                        : 'border-champagne-100 text-champagne-500 hover:border-champagne-200'
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label-field">当前状态</label>
              <select
                className="input-field"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ChecklistTask['status'] })}
              >
                <option value="pending">待开始</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
