import { useState } from 'react';
import { Heart, MapPin, Calendar, Clock, Palette, Save, Sparkles } from 'lucide-react';
import { useWeddingStore } from '@/store/weddingStore';
import { formatDate } from '@/utils';

const themeOptions = [
  { id: 'champagne', name: '浪漫香槟金', colors: 'from-champagne-300 to-rose-300' },
  { id: 'rose', name: '典雅玫瑰粉', colors: 'from-rose-300 to-pink-400' },
  { id: 'pearl', name: '纯净珍珠白', colors: 'from-gray-200 to-champagne-200' },
  { id: 'forest', name: '清新森林绿', colors: 'from-green-300 to-emerald-400' },
  { id: 'ocean', name: '梦幻海洋蓝', colors: 'from-blue-300 to-indigo-400' },
  { id: 'sunset', name: '璀璨夕阳橙', colors: 'from-orange-300 to-amber-400' },
];

export default function Project() {
  const project = useWeddingStore((s) => s.project);
  const updateProject = useWeddingStore((s) => s.updateProject);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    groomName: project.groomName,
    brideName: project.brideName,
    weddingDate: project.weddingDate,
    weddingTime: project.weddingTime,
    venue: project.venue,
    address: project.address,
    theme: project.theme,
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProject(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const currentTheme = themeOptions.find((t) => t.name === form.theme) || themeOptions[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-3xl p-8 shadow-romantic border border-champagne-100"
        style={{
          background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.colors} opacity-20`} />
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-white/40 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="text-wine-700 animate-pulse" fill="currentColor" size={24} />
            <h1 className="font-display text-3xl md:text-4xl font-bold text-wine-700">我们的婚礼项目</h1>
            <Heart className="text-wine-700 animate-pulse" fill="currentColor" size={24} />
          </div>
          <p className="text-center text-champagne-600">
            填写你们的婚礼基本信息，开启浪漫的筹备之旅
          </p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
            <Sparkles size={20} className="text-rose-500" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-wine-700">新人信息</h3>
            <p className="text-xs text-champagne-500">留下你们的名字，这将显示在请柬和首页</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label-field flex items-center gap-2">
              <span className="text-xl">🤵</span> 新郎姓名
            </label>
            <input
              type="text"
              className="input-field"
              value={form.groomName}
              onChange={(e) => handleChange('groomName', e.target.value)}
              placeholder="请输入新郎姓名"
            />
          </div>
          <div>
            <label className="label-field flex items-center gap-2">
              <span className="text-xl">👰</span> 新娘姓名
            </label>
            <input
              type="text"
              className="input-field"
              value={form.brideName}
              onChange={(e) => handleChange('brideName', e.target.value)}
              placeholder="请输入新娘姓名"
            />
          </div>
        </div>

        <div className="divider-gold my-8" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-champagne-100 flex items-center justify-center">
            <Calendar size={20} className="text-champagne-600" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-wine-700">婚礼时间</h3>
            <p className="text-xs text-champagne-500">
              选择良辰吉日 · 目前倒计时到 {formatDate(form.weddingDate)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label-field">婚礼日期</label>
            <input
              type="date"
              className="input-field"
              value={form.weddingDate}
              onChange={(e) => handleChange('weddingDate', e.target.value)}
            />
          </div>
          <div>
            <label className="label-field flex items-center gap-1">
              <Clock size={14} /> 典礼时间
            </label>
            <input
              type="time"
              className="input-field"
              value={form.weddingTime}
              onChange={(e) => handleChange('weddingTime', e.target.value)}
            />
          </div>
        </div>

        <div className="divider-gold my-8" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <MapPin size={20} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-wine-700">婚礼场地</h3>
            <p className="text-xs text-champagne-500">记录你们喜结连理的神圣地点</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="label-field">场地名称</label>
            <input
              type="text"
              className="input-field"
              value={form.venue}
              onChange={(e) => handleChange('venue', e.target.value)}
              placeholder="例如：外滩半岛酒店宴会厅"
            />
          </div>
          <div>
            <label className="label-field">详细地址</label>
            <input
              type="text"
              className="input-field"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="请输入详细地址，方便嘉宾导航"
            />
          </div>
        </div>

        <div className="divider-gold my-8" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Palette size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-wine-700">主题风格</h3>
            <p className="text-xs text-champagne-500">选择你们喜欢的婚礼主题色调</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {themeOptions.map((theme) => {
            const isSelected = form.theme === theme.name;
            return (
              <button
                key={theme.id}
                onClick={() => handleChange('theme', theme.name)}
                className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left group
                  ${isSelected
                    ? 'border-wine-500 shadow-romantic -translate-y-1'
                    : 'border-champagne-100 hover:border-champagne-300 hover:-translate-y-0.5'}
                `}
              >
                <div className={`h-16 rounded-xl mb-3 bg-gradient-to-br ${theme.colors} shadow-inner transition-transform group-hover:scale-105`} />
                <p className={`font-medium text-sm ${isSelected ? 'text-wine-700' : 'text-gray-700'}`}>
                  {theme.name}
                </p>
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-wine-500 flex items-center justify-center text-white text-xs shadow">
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="divider-gold my-8" />

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-champagne-600">
            {saved ? (
              <span className="text-green-600 font-medium flex items-center gap-1">
                ✓ 已保存成功
              </span>
            ) : (
              <span>所有修改将自动同步到其他模块</span>
            )}
          </p>
          <button
            onClick={handleSave}
            className="btn-primary flex items-center gap-2"
          >
            <Save size={18} />
            保存修改
          </button>
        </div>
      </div>
    </div>
  );
}
