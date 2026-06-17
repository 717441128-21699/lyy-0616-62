import { useEffect, useState } from 'react';
import { CalendarDays, Users, Wallet, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { useWeddingStore } from '@/store/weddingStore';
import { getDaysUntil, formatDate, cn, getTimeComponents } from '@/utils';
import { statusColors, statusLabels, assigneeLabels } from '@/data/mockData';

export default function Dashboard() {
  const project = useWeddingStore((s) => s.project);
  const tasks = useWeddingStore((s) => s.tasks);
  const guests = useWeddingStore((s) => s.guests);
  const budgetCategories = useWeddingStore((s) => s.budgetCategories);
  const toggleTaskStatus = useWeddingStore((s) => s.toggleTaskStatus);

  const [time, setTime] = useState(getTimeComponents(project.weddingDate, project.weddingTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTimeComponents(project.weddingDate, project.weddingTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [project.weddingDate, project.weddingTime]);

  const daysUntil = getDaysUntil(project.weddingDate);

  const totalBudget = budgetCategories.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = budgetCategories.reduce((sum, c) => sum + c.spent, 0);
  const budgetPercent = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const taskPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const totalGuests = guests.length;
  const confirmedGuests = guests.filter((g) => g.rsvpStatus === 'confirmed').length;
  const checkedInGuests = guests.filter((g) => g.checkedIn).length;

  const urgentTasks = tasks
    .filter((t) => t.status !== 'completed')
    .filter((t) => {
      const d = getDaysUntil(t.deadline);
      return d >= 0 && d <= 7;
    })
    .sort((a, b) => getDaysUntil(a.deadline) - getDaysUntil(b.deadline));

  const overdueTasks = tasks
    .filter((t) => t.status !== 'completed')
    .filter((t) => getDaysUntil(t.deadline) < 0);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-inner-gold border border-white/30">
        <span className="font-display text-3xl md:text-4xl font-bold text-white tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-2 text-sm text-white/90 font-medium">{label}</span>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-romantic p-8 md:p-10 shadow-romantic">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-champagne-400/20 blur-3xl" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <p className="text-white/80 text-sm mb-2">💍 我们要结婚啦 💍</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
              {project.groomName} <span className="text-champagne-100">&amp;</span> {project.brideName}
            </h1>
            <p className="text-white/90 text-lg">
              {formatDate(project.weddingDate)} · {project.venue}
            </p>
          </div>

          <div className="flex justify-center items-end gap-4 md:gap-6 flex-wrap">
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-white/30 backdrop-blur-md flex items-center justify-center shadow-inner-gold border-2 border-white/40 animate-pulse-slow">
                <span className="font-display text-5xl md:text-7xl font-bold text-white">
                  {time.days}
                </span>
              </div>
              <span className="mt-3 text-white font-semibold text-lg">天</span>
            </div>
            <TimeBlock value={time.hours} label="小时" />
            <TimeBlock value={time.minutes} label="分钟" />
            <TimeBlock value={time.seconds} label="秒" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card card-hover group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 size={24} className="text-rose-500" strokeWidth={1.8} />
            </div>
            <span className="badge bg-rose-100 text-rose-700">{taskPercent.toFixed(0)}%</span>
          </div>
          <p className="text-3xl font-display font-bold text-wine-700 mb-1">
            {completedTasks}
            <span className="text-base text-champagne-500 font-normal"> / {totalTasks}</span>
          </p>
          <p className="text-sm text-champagne-600">筹备任务完成进度</p>
          <div className="mt-3 progress-bar">
            <div className="progress-fill" style={{ width: `${taskPercent}%` }} />
          </div>
        </div>

        <div className="card card-hover group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-champagne-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={24} className="text-champagne-600" strokeWidth={1.8} />
            </div>
            <span className="badge bg-champagne-100 text-champagne-700">{confirmedGuests}人确认</span>
          </div>
          <p className="text-3xl font-display font-bold text-wine-700 mb-1">{totalGuests}</p>
          <p className="text-sm text-champagne-600">受邀嘉宾总人数</p>
          <div className="mt-3 flex gap-2 text-xs">
            <span className="px-2 py-1 rounded-lg bg-green-50 text-green-700">✓ 确认 {confirmedGuests}</span>
            <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700">👥 到场 {checkedInGuests}</span>
          </div>
        </div>

        <div className="card card-hover group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet size={24} className="text-emerald-600" strokeWidth={1.8} />
            </div>
            <span className={cn(
              'badge',
              budgetPercent > 100 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
            )}>
              {budgetPercent.toFixed(0)}%
            </span>
          </div>
          <p className="text-3xl font-display font-bold text-wine-700 mb-1">
            ¥{(totalSpent / 10000).toFixed(1)}
            <span className="text-base text-champagne-500 font-normal">万 / ¥{(totalBudget / 10000).toFixed(0)}万</span>
          </p>
          <p className="text-sm text-champagne-600">预算使用情况</p>
          <div className="mt-3 progress-bar">
            <div
              className={cn('progress-fill', budgetPercent > 100 && '!bg-gradient-to-r !from-red-400 !to-red-500')}
              style={{ width: `${Math.min(budgetPercent, 100)}%` }}
            />
          </div>
        </div>

        <div className="card card-hover group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarDays size={24} className="text-purple-600" strokeWidth={1.8} />
            </div>
            <span className={cn(
              'badge',
              daysUntil <= 7 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-purple-100 text-purple-700'
            )}>
              还有{daysUntil}天
            </span>
          </div>
          <p className="text-3xl font-display font-bold text-wine-700 mb-1">{daysUntil}</p>
          <p className="text-sm text-champagne-600">距离婚礼还有</p>
          <div className="mt-3 text-xs text-champagne-600 flex items-center gap-1">
            <Clock size={14} />
            {formatDate(project.weddingDate)} {project.weddingTime}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-wine-700">紧急待办</h3>
                <p className="text-xs text-champagne-500">7天内即将到期的任务</p>
              </div>
            </div>
            <span className="badge bg-red-100 text-red-700">{urgentTasks.length + overdueTasks.length}项</span>
          </div>

          {overdueTasks.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-red-600 mb-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                已逾期 ({overdueTasks.length})
              </p>
              <div className="space-y-2">
                {overdueTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl border-l-4 border-red-500 bg-red-50/50 hover:bg-red-50 transition-colors cursor-pointer group"
                    onClick={() => toggleTaskStatus(task.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 group-hover:text-wine-700">{task.title}</p>
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-2">
                          <Clock size={12} />
                          逾期 {Math.abs(getDaysUntil(task.deadline))} 天
                          <span className="px-1.5 py-0.5 rounded bg-white/80 text-champagne-600">
                            {assigneeLabels[task.assignee]}
                          </span>
                        </p>
                      </div>
                      <span className={cn('badge flex-shrink-0', statusColors[task.status])}>
                        {statusLabels[task.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {urgentTasks.length > 0 && (
            <div>
              <p className="text-xs font-medium text-amber-600 mb-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                即将到期 ({urgentTasks.length})
              </p>
              <div className="space-y-2">
                {urgentTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl border-l-4 border-amber-400 bg-amber-50/40 hover:bg-amber-50 transition-colors cursor-pointer group"
                    onClick={() => toggleTaskStatus(task.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 group-hover:text-wine-700">{task.title}</p>
                        <p className="text-xs text-amber-700 mt-1 flex items-center gap-2">
                          <Clock size={12} />
                          剩余 {getDaysUntil(task.deadline)} 天
                          <span className="px-1.5 py-0.5 rounded bg-white/80 text-champagne-600">
                            {assigneeLabels[task.assignee]}
                          </span>
                        </p>
                      </div>
                      <span className={cn('badge flex-shrink-0', statusColors[task.status])}>
                        {statusLabels[task.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {urgentTasks.length === 0 && overdueTasks.length === 0 && (
            <div className="text-center py-12 text-champagne-500">
              <div className="text-5xl mb-3">🎉</div>
              <p className="font-medium">太棒了！暂无紧急待办事项</p>
              <p className="text-sm mt-1">所有任务都在有序进行中</p>
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-champagne-100 flex items-center justify-center">
                <Users size={20} className="text-champagne-600" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-wine-700">嘉宾出席统计</h3>
                <p className="text-xs text-champagne-500">实时更新嘉宾状态</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: '确认出席', value: confirmedGuests, total: totalGuests, color: 'from-green-400 to-emerald-500', bg: 'bg-green-50', text: 'text-green-700' },
              { label: '等待回复', value: guests.filter((g) => g.rsvpStatus === 'pending').length, total: totalGuests, color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-700' },
              { label: '无法参加', value: guests.filter((g) => g.rsvpStatus === 'declined').length, total: totalGuests, color: 'from-gray-400 to-gray-500', bg: 'bg-gray-50', text: 'text-gray-600' },
              { label: '已签到', value: checkedInGuests, total: confirmedGuests || 1, color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-50', text: 'text-blue-700' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={cn('text-sm font-medium', item.text)}>{item.label}</span>
                  <span className="text-sm text-champagne-600">
                    {item.value}
                    <span className="text-xs text-champagne-400"> / {item.label === '已签到' ? confirmedGuests : totalGuests}</span>
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700', item.color)}
                    style={{ width: `${item.total > 0 ? Math.min(100, (item.value / item.total) * 100) : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-champagne-100">
            <h4 className="text-sm font-medium text-wine-700 mb-3">最新确认嘉宾</h4>
            <div className="space-y-2">
              {guests
                .filter((g) => g.rsvpStatus === 'confirmed')
                .slice(0, 4)
                .map((guest) => (
                  <div key={guest.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-champagne-50 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-gradient-romantic flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                      {guest.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{guest.name}</p>
                      <p className="text-xs text-champagne-500">
                        {guest.relation === 'groom_side' ? '新郎方' : '新娘方'} · {guest.group || '未分组'}
                      </p>
                    </div>
                    <span className="badge bg-green-100 text-green-700 text-xs">✓ 已确认</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
