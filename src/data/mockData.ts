import { WeddingProject, ChecklistTask, Guest, Table, BudgetCategory, Expense, AlbumPhoto } from '@/types';

const futureDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const pastDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

export const defaultProject: WeddingProject = {
  id: 'proj-001',
  groomName: '张明阳',
  brideName: '李思雨',
  weddingDate: futureDate(90),
  weddingTime: '18:00',
  venue: '外滩半岛酒店宴会厅',
  address: '上海市黄浦区中山东一路32号',
  theme: '浪漫香槟金',
  createdAt: pastDate(30),
};

export const defaultChecklist: ChecklistTask[] = [
  { id: 'task-001', category: 'venue', title: '预订婚礼场地', description: '确认菜单、布置方案', deadline: futureDate(60), assignee: 'groom', status: 'completed', priority: 'high', createdAt: pastDate(30) },
  { id: 'task-002', category: 'venue', title: '与场地确认布置方案', description: '桌花、背景板、灯光设计', deadline: futureDate(30), assignee: 'groom_father', status: 'in_progress', priority: 'high', createdAt: pastDate(20) },
  { id: 'task-003', category: 'dress', title: '预约婚纱拍摄', description: '选择3套内景+2套外景', deadline: futureDate(45), assignee: 'bride', status: 'in_progress', priority: 'high', createdAt: pastDate(25) },
  { id: 'task-004', category: 'dress', title: '试穿婚纱礼服', description: '主婚纱+敬酒服', deadline: futureDate(15), assignee: 'bride_mother', status: 'pending', priority: 'medium', createdAt: pastDate(15) },
  { id: 'task-005', category: 'dress', title: '定制新郎西装', description: '法式修身款', deadline: futureDate(25), assignee: 'groom', status: 'pending', priority: 'medium', createdAt: pastDate(10) },
  { id: 'task-006', category: 'catering', title: '确定宴会菜单', description: '中/西式结合，8凉8热', deadline: futureDate(20), assignee: 'groom_mother', status: 'pending', priority: 'high', createdAt: pastDate(10) },
  { id: 'task-007', category: 'catering', title: '预订婚礼蛋糕', description: '三层翻糖蛋糕', deadline: futureDate(10), assignee: 'bride', status: 'pending', priority: 'low', createdAt: pastDate(5) },
  { id: 'task-008', category: 'catering', title: '确认酒水饮料', description: '红酒、白酒、软饮', deadline: futureDate(7), assignee: 'bride_father', status: 'pending', priority: 'medium', createdAt: pastDate(5) },
  { id: 'task-009', category: 'photo', title: '选择跟拍摄影师', description: '双机位，含航拍', deadline: futureDate(40), assignee: 'groom', status: 'completed', priority: 'high', createdAt: pastDate(20) },
  { id: 'task-010', category: 'photo', title: '制作电子请柬', description: '含视频邀请函', deadline: futureDate(5), assignee: 'bride', status: 'pending', priority: 'medium', createdAt: pastDate(3) },
  { id: 'task-011', category: 'ceremony', title: '预订婚车车队', description: '主车+5辆副车', deadline: futureDate(35), assignee: 'groom_father', status: 'completed', priority: 'medium', createdAt: pastDate(15) },
  { id: 'task-012', category: 'ceremony', title: '确认司仪流程', description: '主持稿+游戏环节', deadline: futureDate(14), assignee: 'groom', status: 'pending', priority: 'high', createdAt: pastDate(10) },
  { id: 'task-013', category: 'ceremony', title: '准备婚戒', description: '定制刻字款', deadline: futureDate(3), assignee: 'groom', status: 'pending', priority: 'high', createdAt: pastDate(5) },
  { id: 'task-014', category: 'ceremony', title: '彩排婚礼流程', description: '全体参与人员', deadline: futureDate(2), assignee: 'bride', status: 'pending', priority: 'high', createdAt: pastDate(3) },
  { id: 'task-015', category: 'other', title: '购买喜糖喜烟', description: '按桌数准备2份', deadline: futureDate(8), assignee: 'bride_mother', status: 'pending', priority: 'medium', createdAt: pastDate(5) },
  { id: 'task-016', category: 'other', title: '安排客房住宿', description: '外地宾客酒店', deadline: futureDate(12), assignee: 'groom_mother', status: 'pending', priority: 'medium', createdAt: pastDate(3) },
];

export const defaultGuests: Guest[] = [
  { id: 'g-001', name: '王建国', phone: '13800138001', email: 'wjg@example.com', relation: 'groom_side', group: '新郎同事', rsvpStatus: 'confirmed', confirmedAt: pastDate(5), checkedIn: false, plusOne: false, notes: '销售总监，安排在主桌旁', tableId: 't-01', seatNumber: 2 },
  { id: 'g-002', name: '刘芳', phone: '13800138002', email: 'lf@example.com', relation: 'groom_side', group: '新郎同事', rsvpStatus: 'confirmed', confirmedAt: pastDate(5), checkedIn: true, checkedInAt: new Date().toISOString(), plusOne: true, plusOneName: '陈强', tableId: 't-01', seatNumber: 3 },
  { id: 'g-003', name: '张伟', phone: '13800138003', relation: 'groom_side', group: '新郎大学同学', rsvpStatus: 'confirmed', confirmedAt: pastDate(3), checkedIn: false, plusOne: false, tableId: 't-02', seatNumber: 1 },
  { id: 'g-004', name: '李娜', phone: '13800138004', email: 'lina@example.com', relation: 'groom_side', group: '新郎亲戚', rsvpStatus: 'pending', checkedIn: false, plusOne: false, seatPreference: '靠近主桌' },
  { id: 'g-005', name: '王磊', phone: '13800138005', relation: 'groom_side', group: '新郎大学同学', rsvpStatus: 'declined', checkedIn: false, plusOne: false, notes: '出差无法参加' },
  { id: 'g-006', name: '赵敏', phone: '13800138006', email: 'zm@example.com', relation: 'bride_side', group: '新娘闺蜜', rsvpStatus: 'confirmed', confirmedAt: pastDate(10), checkedIn: true, checkedInAt: new Date().toISOString(), plusOne: false, tableId: 't-03', seatNumber: 1 },
  { id: 'g-007', name: '孙丽', phone: '13800138007', relation: 'bride_side', group: '新娘同事', rsvpStatus: 'confirmed', confirmedAt: pastDate(8), checkedIn: false, plusOne: true, plusOneName: '周杰', tableId: 't-03', seatNumber: 2 },
  { id: 'g-008', name: '吴静', phone: '13800138008', email: 'wj@example.com', relation: 'bride_side', group: '新娘同事', rsvpStatus: 'pending', checkedIn: false, plusOne: false },
  { id: 'g-009', name: '郑海涛', phone: '13800138009', relation: 'bride_side', group: '新娘亲戚', rsvpStatus: 'confirmed', confirmedAt: pastDate(7), checkedIn: false, plusOne: false, tableId: 't-04', seatNumber: 1 },
  { id: 'g-010', name: '钱美丽', phone: '13800138010', relation: 'bride_side', group: '新娘亲戚', rsvpStatus: 'confirmed', confirmedAt: pastDate(7), checkedIn: false, plusOne: true, plusOneName: '冯伟', tableId: 't-04', seatNumber: 2 },
  { id: 'g-011', name: '陈伟', phone: '13800138011', relation: 'groom_side', group: '新郎发小', rsvpStatus: 'confirmed', confirmedAt: pastDate(12), checkedIn: true, checkedInAt: new Date().toISOString(), plusOne: false, tableId: 't-02', seatNumber: 2 },
  { id: 'g-012', name: '杨帆', phone: '13800138012', email: 'yf@example.com', relation: 'groom_side', group: '新郎发小', rsvpStatus: 'pending', checkedIn: false, plusOne: false },
];

export const defaultTables: Table[] = [
  { id: 't-main', name: '主桌', type: 'round', capacity: 12 },
  { id: 't-01', name: '1号桌', type: 'round', capacity: 10 },
  { id: 't-02', name: '2号桌', type: 'round', capacity: 10 },
  { id: 't-03', name: '3号桌', type: 'round', capacity: 10 },
  { id: 't-04', name: '4号桌', type: 'round', capacity: 10 },
  { id: 't-05', name: '5号桌', type: 'square', capacity: 8 },
  { id: 't-06', name: '6号桌', type: 'square', capacity: 8 },
];

export const defaultBudgetCategories: BudgetCategory[] = [
  { id: 'bc-01', name: '场地租赁', icon: '🏛️', budget: 80000, spent: 75000 },
  { id: 'bc-02', name: '餐饮酒水', icon: '🍽️', budget: 120000, spent: 98000 },
  { id: 'bc-03', name: '婚纱摄影', icon: '📸', budget: 35000, spent: 32000 },
  { id: 'bc-04', name: '婚纱礼服', icon: '👗', budget: 25000, spent: 28000 },
  { id: 'bc-05', name: '婚庆布置', icon: '💐', budget: 45000, spent: 42000 },
  { id: 'bc-06', name: '司仪跟拍', icon: '🎬', budget: 30000, spent: 28000 },
  { id: 'bc-07', name: '婚车车队', icon: '🚗', budget: 18000, spent: 15000 },
  { id: 'bc-08', name: '喜糖伴手礼', icon: '🎁', budget: 12000, spent: 0 },
  { id: 'bc-09', name: '珠宝首饰', icon: '💍', budget: 50000, spent: 48000 },
  { id: 'bc-10', name: '其他杂项', icon: '📦', budget: 15000, spent: 8000 },
];

export const defaultExpenses: Expense[] = [
  { id: 'e-001', categoryId: 'bc-01', title: '场地定金', amount: 40000, date: pastDate(60), payee: '半岛酒店' },
  { id: 'e-002', categoryId: 'bc-01', title: '场地布置定金', amount: 35000, date: pastDate(30), payee: '半岛酒店' },
  { id: 'e-003', categoryId: 'bc-02', title: '餐费定金（50人）', amount: 60000, date: pastDate(45), payee: '半岛酒店餐饮部' },
  { id: 'e-004', categoryId: 'bc-02', title: '酒水采购', amount: 38000, date: pastDate(15), payee: '洋河酒业' },
  { id: 'e-005', categoryId: 'bc-03', title: '婚纱照定金', amount: 15000, date: pastDate(50), payee: '巴黎婚纱' },
  { id: 'e-006', categoryId: 'bc-03', title: '婚纱照尾款', amount: 17000, date: pastDate(20), payee: '巴黎婚纱' },
  { id: 'e-007', categoryId: 'bc-04', title: '主纱定制', amount: 18000, date: pastDate(40), payee: 'Vera Wang' },
  { id: 'e-008', categoryId: 'bc-04', title: '新郎西装+敬酒服', amount: 10000, date: pastDate(25), payee: 'Armani' },
  { id: 'e-009', categoryId: 'bc-05', title: '花艺布置定金', amount: 25000, date: pastDate(35), payee: '繁花婚庆' },
  { id: 'e-010', categoryId: 'bc-05', title: '灯光音响设备', amount: 17000, date: pastDate(10), payee: '声光电科技' },
  { id: 'e-011', categoryId: 'bc-06', title: '司仪团队', amount: 15000, date: pastDate(55), payee: '金牌司仪-李老师' },
  { id: 'e-012', categoryId: 'bc-06', title: '双机位摄像', amount: 13000, date: pastDate(50), payee: '时光影像' },
  { id: 'e-013', categoryId: 'bc-07', title: '婚车租赁', amount: 15000, date: pastDate(35), payee: '尊驰租车' },
  { id: 'e-014', categoryId: 'bc-09', title: '对戒定制', amount: 28000, date: pastDate(60), payee: 'Cartier' },
  { id: 'e-015', categoryId: 'bc-09', title: '三金首饰', amount: 20000, date: pastDate(50), payee: '周大福' },
  { id: 'e-016', categoryId: 'bc-10', title: '请柬印刷', amount: 3000, date: pastDate(20), payee: '风雅印务' },
  { id: 'e-017', categoryId: 'bc-10', title: '红包袋/签到本', amount: 2000, date: pastDate(10), payee: '淘宝' },
  { id: 'e-018', categoryId: 'bc-10', title: '客房预订（5间）', amount: 3000, date: pastDate(5), payee: '半岛酒店' },
];

export const defaultAlbumPhotos: AlbumPhoto[] = [
  { id: 'p-001', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20wedding%20couple%20outdoor%20photoshoot%20golden%20hour%20champagne%20dress%20romantic&image_size=square_hd', caption: '订婚仪式', uploadedAt: pastDate(120), category: '订婚照' },
  { id: 'p-002', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=romantic%20wedding%20photography%20bride%20groom%20rose%20garden%20sunset%20cinematic&image_size=square_hd', caption: '玫瑰花园', uploadedAt: pastDate(90), category: '婚纱照' },
  { id: 'p-003', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wedding%20dress%20hanging%20on%20window%20soft%20morning%20light%20elegant%20champagne&image_size=square_hd', caption: '晨曦中的婚纱', uploadedAt: pastDate(60), category: '婚纱照' },
  { id: 'p-004', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wedding%20ring%20on%20satin%20pillow%20gold%20champagne%20sparkle%20macro&image_size=square_hd', caption: '对戒特写', uploadedAt: pastDate(45), category: '婚纱照' },
  { id: 'p-005', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wedding%20venue%20ballroom%20champagne%20gold%20decoration%20floral%20elegant%20tablescape&image_size=square_hd', caption: '宴会厅预览', uploadedAt: pastDate(30), category: '场地' },
  { id: 'p-006', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wedding%20bouquet%20peonies%20roses%20eucalyptus%20champagne%20ribbon%20close%20up&image_size=square_hd', caption: '手捧花', uploadedAt: pastDate(20), category: '花艺' },
];

export const assigneeLabels: Record<string, string> = {
  groom: '新郎',
  bride: '新娘',
  groom_father: '新郎父亲',
  groom_mother: '新郎母亲',
  bride_father: '新娘父亲',
  bride_mother: '新娘母亲',
};

export const categoryLabels: Record<string, string> = {
  venue: '场地预订',
  dress: '婚纱礼服',
  catering: '餐饮酒水',
  photo: '摄影摄像',
  ceremony: '婚礼仪式',
  other: '其他事项',
};

export const categoryColors: Record<string, string> = {
  venue: 'bg-blue-100 text-blue-700',
  dress: 'bg-pink-100 text-pink-700',
  catering: 'bg-orange-100 text-orange-700',
  photo: 'bg-purple-100 text-purple-700',
  ceremony: 'bg-green-100 text-green-700',
  other: 'bg-gray-100 text-gray-700',
};

export const priorityLabels: Record<string, string> = {
  low: '低',
  medium: '中',
  high: '高',
};

export const statusLabels: Record<string, string> = {
  pending: '待开始',
  in_progress: '进行中',
  completed: '已完成',
};

export const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
};
