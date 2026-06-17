import { useState, useRef } from 'react';
import {
  Upload,
  X,
  Heart,
  Share2,
  Download,
  Trash2,
  ZoomIn,
  Grid3X3,
  Image as ImageIcon,
  Edit2,
  Tag,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Link,
  Check,
} from 'lucide-react';
import { useWeddingStore } from '@/store/weddingStore';
import { AlbumPhoto } from '@/types';
import { cn, formatDate } from '@/utils';
import Modal from '@/components/common/Modal';

const sampleImages = [
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wedding%20couple%20sunset%20beach%20romantic%20golden%20light%20photography&image_size=square_hd',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wedding%20bouquet%20white%20roses%20peonies%20elegant%20champagne%20ribbon&image_size=square_hd',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bride%20getting%20ready%20morning%20light%20veil%20soft%20dreamy&image_size=square_hd',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wedding%20rings%20flowers%20macro%20photography%20sparkle%20gold&image_size=square_hd',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wedding%20table%20setting%20champagne%20gold%20candles%20elegant%20floral&image_size=square_hd',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wedding%20cake%20three%20tier%20white%20flowers%20elegant%20champagne&image_size=square_hd',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wedding%20dance%20floor%20evening%20lights%20romantic%20couple&image_size=square_hd',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wedding%20guests%20celebration%20champagne%20toast%20happy%20moment&image_size=square_hd',
];

export default function Album() {
  const photos = useWeddingStore((s) => s.photos);
  const addPhoto = useWeddingStore((s) => s.addPhoto);
  const deletePhoto = useWeddingStore((s) => s.deletePhoto);
  const updatePhoto = useWeddingStore((s) => s.updatePhoto);

  const [selectedPhoto, setSelectedPhoto] = useState<AlbumPhoto | null>(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ caption: '', category: '' });
  const [shareModal, setShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const [newCaption, setNewCaption] = useState('');
  const [newCategory, setNewCategory] = useState('婚纱照');
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['全部', ...Array.from(new Set(photos.map((p) => p.category || '未分类')))];
  const [activeCategory, setActiveCategory] = useState('全部');

  const filteredPhotos = activeCategory === '全部'
    ? photos
    : photos.filter((p) => (p.category || '未分类') === activeCategory);

  const totalFavorites = photos.length;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const urls: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          urls.push(ev.target.result as string);
          if (urls.length === files.length) {
            setPreviewUrls((prev) => [...prev, ...urls]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addSamplePhotos = () => {
    setPreviewUrls((prev) => [...prev, ...sampleImages]);
  };

  const handleRemovePreview = (idx: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = () => {
    previewUrls.forEach((url, idx) => {
      addPhoto({
        url,
        caption: newCaption ? `${newCaption}${previewUrls.length > 1 ? ` ${idx + 1}` : ''}` : '',
        category: newCategory,
      });
    });
    setPreviewUrls([]);
    setNewCaption('');
    setUploadModal(false);
  };

  const handleEdit = (photo: AlbumPhoto) => {
    setSelectedPhoto(photo);
    setEditForm({
      caption: photo.caption || '',
      category: photo.category || '',
    });
    setEditModal(true);
  };

  const handleSaveEdit = () => {
    if (selectedPhoto) {
      updatePhoto(selectedPhoto.id, editForm);
    }
    setEditModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除这张照片吗？')) {
      deletePhoto(id);
      setSelectedPhoto(null);
    }
  };

  const handleShare = () => {
    setShareModal(true);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(
      `https://wedding.example.com/album/${project.groomName}-${project.brideName}`
    );
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const project = useWeddingStore((s) => s.project);

  const photoIndex = selectedPhoto ? filteredPhotos.findIndex((p) => p.id === selectedPhoto.id) : -1;

  const navigatePhoto = (dir: -1 | 1) => {
    if (photoIndex < 0) return;
    const next = (photoIndex + dir + filteredPhotos.length) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[next]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-rose-100 via-cream-100 to-champagne-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-champagne-200/40 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-rose-500" />
              <span className="text-sm font-medium text-rose-600">我们的美好回忆</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-wine-700 mb-2">
              {project.groomName} &amp; {project.brideName}
            </h1>
            <p className="text-champagne-600">{formatDate(project.weddingDate)} · {project.venue}</p>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-wine-700">
                <ImageIcon size={18} />
                <span className="font-medium">{totalFavorites}</span>
                <span className="text-champagne-500 text-sm">张照片</span>
              </div>
              <div className="flex items-center gap-2 text-rose-600">
                <Heart size={18} fill="currentColor" />
                <span className="font-medium">{categories.length - 1}</span>
                <span className="text-champagne-500 text-sm">个相册</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={handleShare} className="btn-secondary flex items-center gap-2">
              <Share2 size={18} />
              分享相册
            </button>
            <button onClick={() => setUploadModal(true)} className="btn-primary flex items-center gap-2">
              <Upload size={18} />
              上传照片
            </button>
          </div>
        </div>
      </div>

      <div className="card !p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
                  activeCategory === cat
                    ? 'bg-gradient-romantic text-white shadow-romantic'
                    : 'bg-champagne-50 text-champagne-700 hover:bg-champagne-100'
                )}
              >
                {cat !== '全部' && <Tag size={13} />}
                {cat}
                <span className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px]',
                  activeCategory === cat ? 'bg-white/20' : 'bg-white text-champagne-500'
                )}>
                  {cat === '全部' ? photos.length : photos.filter((p) => (p.category || '未分类') === cat).length}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-champagne-50">
            <button className="w-9 h-9 rounded-lg bg-white text-wine-700 shadow-sm flex items-center justify-center">
              <Grid3X3 size={16} />
            </button>
            <button className="w-9 h-9 rounded-lg text-champagne-500 flex items-center justify-center">
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>

      {filteredPhotos.length === 0 ? (
        <div className="card text-center py-20">
          <div className="w-24 h-24 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-5">
            <ImageIcon size={40} className="text-rose-400" />
          </div>
          <h3 className="font-display text-xl font-semibold text-wine-700 mb-2">还没有照片</h3>
          <p className="text-champagne-600 mb-6">上传照片开始创建属于你们的专属回忆</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button onClick={addSamplePhotos} className="btn-secondary">
              添加示例照片
            </button>
            <button onClick={() => setUploadModal(true)} className="btn-primary flex items-center gap-2">
              <Upload size={18} />
              立即上传
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-elegant hover:shadow-romantic transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={photo.url}
                alt={photo.caption || '婚礼照片'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(photo);
                  }}
                  className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(photo.id);
                  }}
                  className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-all duration-300">
                {photo.caption && (
                  <p className="text-white text-sm font-medium line-clamp-1 drop-shadow">
                    {photo.caption}
                  </p>
                )}
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-white/80 text-xs flex items-center gap-1">
                    <Tag size={10} />
                    {photo.category || '未分类'}
                  </span>
                  <span className="text-white/80 text-[10px]">
                    {formatDate(photo.uploadedAt)}
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <ZoomIn size={24} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X size={22} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigatePhoto(-1);
            }}
            className="absolute left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigatePhoto(1);
            }}
            className="absolute right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight size={28} />
          </button>

          <div
            className="max-w-5xl max-h-[85vh] mx-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption || ''}
              className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="mt-5 text-center">
              {selectedPhoto.caption && (
                <p className="font-display text-xl text-white mb-2">{selectedPhoto.caption}</p>
              )}
              <div className="flex items-center justify-center gap-4 text-white/70 text-sm">
                {selectedPhoto.category && (
                  <span className="flex items-center gap-1">
                    <Tag size={13} /> {selectedPhoto.category}
                  </span>
                )}
                <span>📅 {formatDate(selectedPhoto.uploadedAt)}</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => handleEdit(selectedPhoto)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2 transition-colors"
                >
                  <Edit2 size={15} />
                  编辑
                </button>
                <button
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2 transition-colors"
                >
                  <Download size={15} />
                  下载
                </button>
                <button
                  onClick={() => handleDelete(selectedPhoto.id)}
                  className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-sm flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={15} />
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={uploadModal}
        onClose={() => setUploadModal(false)}
        title="上传照片"
        size="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setUploadModal(false)}>取消</button>
            <button
              className="btn-primary flex items-center gap-2"
              onClick={handleUpload}
              disabled={previewUrls.length === 0}
            >
              <Upload size={16} />
              确认上传 {previewUrls.length > 0 && `(${previewUrls.length}张)`}
            </button>
          </>
        }
      >
        <div className="space-y-5">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-champagne-300 rounded-2xl p-10 text-center cursor-pointer hover:border-rose-400 hover:bg-rose-50/30 transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-romantic flex items-center justify-center mx-auto mb-4 shadow-romantic">
              <Upload size={28} className="text-white" />
            </div>
            <p className="font-medium text-wine-700 mb-1">点击或拖拽图片到此处</p>
            <p className="text-sm text-champagne-500 mb-4">支持 JPG、PNG 格式，单张不超过 10MB</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addSamplePhotos();
              }}
              className="btn-secondary text-sm"
            >
              或添加示例照片
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {previewUrls.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => handleRemovePreview(idx)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label-field">照片描述 (选填)</label>
              <input
                type="text"
                className="input-field"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                placeholder="例如：甜蜜合影"
              />
            </div>
            <div>
              <label className="label-field">分类</label>
              <select
                className="input-field"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                <option value="婚纱照">婚纱照</option>
                <option value="订婚照">订婚照</option>
                <option value="婚礼现场">婚礼现场</option>
                <option value="仪式">仪式</option>
                <option value="敬酒">敬酒</option>
                <option value="合影">亲友合影</option>
                <option value="场地">场地布置</option>
                <option value="花艺">花艺装饰</option>
                <option value="未分类">未分类</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title="编辑照片信息"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setEditModal(false)}>取消</button>
            <button className="btn-primary" onClick={handleSaveEdit}>保存</button>
          </>
        }
      >
        <div className="space-y-5">
          {selectedPhoto && (
            <div className="aspect-video rounded-xl overflow-hidden bg-champagne-50">
              <img src={selectedPhoto.url} alt="" className="w-full h-full object-contain" />
            </div>
          )}
          <div>
            <label className="label-field">照片描述</label>
            <input
              type="text"
              className="input-field"
              value={editForm.caption}
              onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
              placeholder="为这张照片添加描述"
            />
          </div>
          <div>
            <label className="label-field">分类</label>
            <input
              type="text"
              className="input-field"
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              placeholder="例如：婚纱照、仪式、合影"
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={shareModal}
        onClose={() => setShareModal(false)}
        title="分享相册给嘉宾"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-champagne-50">
            <div className="w-16 h-16 rounded-full bg-gradient-romantic flex items-center justify-center mx-auto mb-4 shadow-romantic">
              <Share2 size={28} className="text-white" />
            </div>
            <h4 className="font-display text-xl font-semibold text-wine-700 mb-1">
              {project.groomName} &amp; {project.brideName} 的婚礼相册
            </h4>
            <p className="text-sm text-champagne-600">将这份美好分享给亲朋好友</p>
          </div>

          <div>
            <label className="label-field">相册访问链接</label>
            <div className="flex gap-2">
              <div className="flex-1 input-field bg-champagne-50 text-champagne-700 font-mono text-sm truncate flex items-center">
                🔗 https://wedding.example.com/album/{project.groomName}-{project.brideName}
              </div>
              <button
                onClick={copyShareLink}
                className={cn(
                  'px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all',
                  linkCopied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gradient-romantic text-white shadow-romantic hover:-translate-y-0.5'
                )}
              >
                {linkCopied ? <Check size={16} /> : <Link size={16} />}
                {linkCopied ? '已复制' : '复制'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              { name: '微信', icon: '💬', color: 'hover:bg-green-50' },
              { name: '朋友圈', icon: '🌟', color: 'hover:bg-amber-50' },
              { name: 'QQ', icon: '🐧', color: 'hover:bg-blue-50' },
              { name: '邮件', icon: '📧', color: 'hover:bg-rose-50' },
            ].map((s) => (
              <button
                key={s.name}
                className={cn(
                  'p-4 rounded-2xl bg-white border border-champagne-100 flex flex-col items-center gap-2 hover:shadow-sm transition-all',
                  s.color
                )}
              >
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs font-medium text-gray-700">{s.name}</span>
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-champagne-50 text-sm text-champagne-600 flex items-start gap-3">
            <Sparkles size={18} className="flex-shrink-0 text-champagne-500 mt-0.5" />
            <p>嘉宾访问分享链接后可以浏览相册、留下祝福留言，无需登录即可查看。</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
