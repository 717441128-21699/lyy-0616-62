import { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  AlertTriangle,
  Wallet,
  CheckCircle,
  Download,
  PieChart,
  Receipt,
  Save,
} from 'lucide-react';
import { useWeddingStore } from '@/store/weddingStore';
import { BudgetCategory, Expense } from '@/types';
import { cn, formatDate, formatMoney } from '@/utils';
import Modal from '@/components/common/Modal';

export default function Budget() {
  const categories = useWeddingStore((s) => s.budgetCategories);
  const expenses = useWeddingStore((s) => s.expenses);
  const addExpense = useWeddingStore((s) => s.addExpense);
  const updateExpense = useWeddingStore((s) => s.updateExpense);
  const deleteExpense = useWeddingStore((s) => s.deleteExpense);
  const updateCategoryBudget = useWeddingStore((s) => s.updateCategoryBudget);

  const [expenseModal, setExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenseForm, setExpenseForm] = useState({
    categoryId: categories[0]?.id || '',
    title: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    payee: '',
    notes: '',
  });

  const [categoryModal, setCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const [categoryBudget, setCategoryBudget] = useState(0);

  const totalBudget = categories.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const remaining = totalBudget - totalSpent;
  const overBudget = totalSpent > totalBudget;
  const percentUsed = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;

  const overCategories = categories.filter((c) => c.spent > c.budget);
  const atRiskCategories = categories.filter(
    (c) => c.budget > 0 && c.spent <= c.budget && (c.spent / c.budget) >= 0.85
  );

  const openAddExpense = () => {
    setEditingExpense(null);
    setExpenseForm({
      categoryId: categories[0]?.id || '',
      title: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      payee: '',
      notes: '',
    });
    setExpenseModal(true);
  };

  const openEditExpense = (e: Expense) => {
    setEditingExpense(e);
    setExpenseForm({
      categoryId: e.categoryId,
      title: e.title,
      amount: e.amount,
      date: e.date,
      payee: e.payee || '',
      notes: e.notes || '',
    });
    setExpenseModal(true);
  };

  const handleSaveExpense = () => {
    if (!expenseForm.title.trim() || expenseForm.amount <= 0) return;
    if (editingExpense) {
      updateExpense(editingExpense.id, expenseForm);
    } else {
      addExpense(expenseForm);
    }
    setExpenseModal(false);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('确定删除这笔支出记录吗？')) {
      deleteExpense(id);
    }
  };

  const openEditCategory = (c: BudgetCategory) => {
    setEditingCategory(c);
    setCategoryBudget(c.budget);
    setCategoryModal(true);
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      updateCategoryBudget(editingCategory.id, categoryBudget);
    }
    setCategoryModal(false);
  };

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card !p-5 bg-gradient-to-br from-rose-100 to-pink-100 border-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-champagne-600 mb-1">总预算</p>
              <p className="font-display text-3xl font-bold text-wine-700">{formatMoney(totalBudget)}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center">
              <Wallet size={22} className="text-wine-700" />
            </div>
          </div>
        </div>

        <div className={`card !p-5 ${overBudget ? 'bg-gradient-to-br from-red-100 to-orange-100 border-0' : 'bg-gradient-to-br from-emerald-100 to-green-100 border-0'}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-champagne-600 mb-1">已支出</p>
              <p className={cn('font-display text-3xl font-bold', overBudget ? 'text-red-700' : 'text-emerald-700')}>
                {formatMoney(totalSpent)}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center">
              <TrendingUp size={22} className={overBudget ? 'text-red-700' : 'text-emerald-700'} />
            </div>
          </div>
        </div>

        <div className={`card !p-5 ${remaining < 0 ? 'bg-gradient-to-br from-red-100 to-pink-100 border-0' : 'bg-gradient-to-br from-blue-100 to-indigo-100 border-0'}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-champagne-600 mb-1">剩余可用</p>
              <p className={cn('font-display text-3xl font-bold', remaining < 0 ? 'text-red-700' : 'text-blue-700')}>
                {remaining < 0 ? '-' : ''}{formatMoney(Math.abs(remaining))}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center">
              {remaining < 0 ? (
                <AlertTriangle size={22} className="text-red-700" />
              ) : (
                <CheckCircle size={22} className="text-blue-700" />
              )}
            </div>
          </div>
        </div>

        <div className="card !p-5 bg-gradient-to-br from-purple-100 to-violet-100 border-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-champagne-600 mb-1">预算使用率</p>
              <p className="font-display text-3xl font-bold text-purple-700">{percentUsed.toFixed(1)}%</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center">
              <PieChart size={22} className="text-purple-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-xl font-semibold text-wine-700">总体预算进度</h3>
            <span className={cn(
              'badge',
              overBudget ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-green-100 text-green-700'
            )}>
              {overBudget ? `⚠️ 已超支 ${formatMoney(totalSpent - totalBudget)}` : '✓ 预算可控'}
            </span>
          </div>
          <div className="relative h-6 rounded-full bg-champagne-100 overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-700',
                percentUsed > 100
                  ? 'bg-gradient-to-r from-amber-400 via-red-400 to-red-500'
                  : percentUsed > 85
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                  : 'bg-gradient-romantic'
              )}
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            />
            {percentUsed > 100 && (
              <div
                className="absolute inset-y-0 right-0 bg-gradient-to-l from-red-500/80 to-red-400/40"
                style={{ width: `${percentUsed - 100}%` }}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white drop-shadow">
              {formatMoney(totalSpent)} / {formatMoney(totalBudget)}
            </div>
          </div>
        </div>
      </div>

      {(overCategories.length > 0 || atRiskCategories.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {overCategories.length > 0 && (
            <div className="card !p-5 border-red-200 bg-red-50/30">
              <div className="flex items-center gap-2 mb-3 text-red-700">
                <AlertTriangle size={20} className="animate-pulse" />
                <h4 className="font-semibold">超支预警</h4>
                <span className="badge bg-red-100 text-red-700">{overCategories.length}项</span>
              </div>
              <div className="space-y-2">
                {overCategories.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-white">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{c.icon}</span>
                      <div>
                        <p className="font-medium text-sm text-gray-800">{c.name}</p>
                        <p className="text-xs text-red-600">
                          超支 {formatMoney(c.spent - c.budget)}
                        </p>
                      </div>
                    </div>
                    <span className="badge bg-red-100 text-red-700">
                      {((c.spent / c.budget) * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {atRiskCategories.length > 0 && (
            <div className="card !p-5 border-amber-200 bg-amber-50/30">
              <div className="flex items-center gap-2 mb-3 text-amber-700">
                <AlertTriangle size={20} />
                <h4 className="font-semibold">即将超支</h4>
                <span className="badge bg-amber-100 text-amber-700">{atRiskCategories.length}项</span>
              </div>
              <div className="space-y-2">
                {atRiskCategories.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-white">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{c.icon}</span>
                      <div>
                        <p className="font-medium text-sm text-gray-800">{c.name}</p>
                        <p className="text-xs text-amber-600">
                          剩余 {formatMoney(c.budget - c.spent)}
                        </p>
                      </div>
                    </div>
                    <span className="badge bg-amber-100 text-amber-700">
                      {((c.spent / c.budget) * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-champagne-100 flex items-center justify-center">
              <Receipt size={20} className="text-champagne-600" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-wine-700">预算分类明细</h3>
              <p className="text-xs text-champagne-500">点击编辑按钮可调整各类别预算</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm flex items-center gap-1.5">
              <Download size={15} />
              导出报表
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {categories.map((cat) => {
            const percent = cat.budget > 0 ? Math.min(100, (cat.spent / cat.budget) * 100) : 0;
            const isOver = cat.spent > cat.budget;
            const diff = cat.budget - cat.spent;

            return (
              <div key={cat.id} className="p-4 rounded-2xl bg-cream-50/50 border border-champagne-100 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl">
                      {cat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-800">{cat.name}</h4>
                        {isOver && (
                          <span className="badge bg-red-100 text-red-700 animate-pulse text-[10px]">超支</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-champagne-600 flex-wrap">
                        <span>预算：{formatMoney(cat.budget)}</span>
                        <span>已花：<strong className={isOver ? 'text-red-600' : 'text-gray-700'}>{formatMoney(cat.spent)}</strong></span>
                        <span>
                          {isOver
                            ? `超支: ${formatMoney(cat.spent - cat.budget)}`
                            : `剩余: ${formatMoney(diff)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className={cn(
                        'font-display text-xl font-bold',
                        isOver ? 'text-red-600' : percent > 85 ? 'text-amber-600' : 'text-green-600'
                      )}>
                        {percent.toFixed(0)}%
                      </p>
                    </div>
                    <button
                      onClick={() => openEditCategory(cat)}
                      className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-champagne-500 hover:text-wine-700 transition-all"
                    >
                      <Edit2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="progress-bar !h-2.5">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      isOver
                        ? 'bg-gradient-to-r from-red-400 to-red-500'
                        : percent > 85
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                        : 'bg-gradient-romantic'
                    )}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Wallet size={20} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-wine-700">支出记录</h3>
              <p className="text-xs text-champagne-500">共 {expenses.length} 笔支出记录</p>
            </div>
          </div>
          <button onClick={openAddExpense} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            记录支出
          </button>
        </div>

        <div className="overflow-x-auto -mx-2 scrollbar-thin">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-champagne-100">
                <th className="text-left py-3 px-2 text-xs font-semibold text-champagne-600 uppercase">日期</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-champagne-600 uppercase">类别</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-champagne-600 uppercase">支出项目</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-champagne-600 uppercase">收款方</th>
                <th className="text-right py-3 px-2 text-xs font-semibold text-champagne-600 uppercase">金额</th>
                <th className="text-right py-3 px-2 text-xs font-semibold text-champagne-600 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-champagne-50">
              {sortedExpenses.slice(0, 20).map((exp) => {
                const cat = categories.find((c) => c.id === exp.categoryId);
                return (
                  <tr key={exp.id} className="hover:bg-cream-50 transition-colors">
                    <td className="py-3 px-2 text-sm text-gray-600 whitespace-nowrap">{formatDate(exp.date)}</td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        <span>{cat?.icon}</span>
                        <span className="text-gray-700">{cat?.name}</span>
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm font-medium text-gray-800">{exp.title}</td>
                    <td className="py-3 px-2 text-sm text-champagne-600">{exp.payee || '—'}</td>
                    <td className="py-3 px-2 text-right">
                      <span className="font-semibold text-wine-700">{formatMoney(exp.amount)}</span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditExpense(exp)}
                          className="w-8 h-8 rounded-lg hover:bg-champagne-100 flex items-center justify-center text-champagne-500 hover:text-wine-700 transition-all"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-champagne-500 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={expenseModal}
        onClose={() => setExpenseModal(false)}
        title={editingExpense ? '编辑支出' : '记录新支出'}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setExpenseModal(false)}>取消</button>
            <button className="btn-primary flex items-center gap-2" onClick={handleSaveExpense}>
              <Save size={16} />
              {editingExpense ? '保存' : '添加'}
            </button>
          </>
        }
      >
        <div className="space-y-5">
          <div>
            <label className="label-field">支出类别</label>
            <select
              className="input-field"
              value={expenseForm.categoryId}
              onChange={(e) => setExpenseForm({ ...expenseForm, categoryId: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">支出项目 *</label>
            <input
              type="text"
              className="input-field"
              value={expenseForm.title}
              onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
              placeholder="例如：场地定金"
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="label-field">金额 (元) *</label>
              <input
                type="number"
                min="0"
                className="input-field text-lg font-medium"
                value={expenseForm.amount || ''}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="label-field">支出日期</label>
              <input
                type="date"
                className="input-field"
                value={expenseForm.date}
                onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label-field">收款方</label>
            <input
              type="text"
              className="input-field"
              value={expenseForm.payee}
              onChange={(e) => setExpenseForm({ ...expenseForm, payee: e.target.value })}
              placeholder="例如：XX酒店"
            />
          </div>
          <div>
            <label className="label-field">备注</label>
            <textarea
              className="input-field min-h-[80px] resize-none"
              value={expenseForm.notes}
              onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
              placeholder="备注信息"
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={categoryModal}
        onClose={() => setCategoryModal(false)}
        title="调整预算"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setCategoryModal(false)}>取消</button>
            <button className="btn-primary flex items-center gap-2" onClick={handleSaveCategory}>
              <Save size={16} />
              保存
            </button>
          </>
        }
      >
        {editingCategory && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-champagne-50">
              <div className="text-3xl">{editingCategory.icon}</div>
              <div>
                <h4 className="font-semibold text-gray-800">{editingCategory.name}</h4>
                <p className="text-sm text-champagne-600">
                  当前已支出 {formatMoney(editingCategory.spent)}
                </p>
              </div>
            </div>
            <div>
              <label className="label-field">预算金额 (元)</label>
              <input
                type="number"
                min="0"
                className="input-field text-xl font-medium"
                value={categoryBudget || ''}
                onChange={(e) => setCategoryBudget(Number(e.target.value))}
              />
            </div>
            <div className="p-3 rounded-xl bg-rose-50 text-sm text-rose-700">
              调整预算将影响整体预算完成率和超支预警。
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
