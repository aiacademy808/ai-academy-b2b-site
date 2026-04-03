'use client';

import { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Upload, ImageIcon, Crop, Eraser, ArrowLeftRight } from 'lucide-react';
import ImageCropper from '@/components/ui/ImageCropper';
import BackgroundRemover from '@/components/ui/BackgroundRemover';

interface Partner {
  id: number;
  name: string;
  logoUrl: string;
  logoDarkUrl: string;
  darkMode: string;
  url: string;
  sortOrder: number;
  createdAt: string;
}

const emptyForm = {
  name: '',
  logoUrl: '',
  logoDarkUrl: '',
  darkMode: 'none',
  url: '',
  sortOrder: 0,
};

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [uploadingDark, setUploadingDark] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [cropTarget, setCropTarget] = useState<'logo' | 'logoDark'>('logo');
  const [bgRemoveImage, setBgRemoveImage] = useState<string | null>(null);
  const [bgRemoveTarget, setBgRemoveTarget] = useState<'logo' | 'logoDark'>('logo');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileDarkInputRef = useRef<HTMLInputElement>(null);

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/admin/partners');
      const data = await res.json();
      setPartners(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (partner: Partner) => {
    setForm({
      name: partner.name,
      logoUrl: partner.logoUrl,
      logoDarkUrl: partner.logoDarkUrl || '',
      darkMode: partner.darkMode || 'none',
      url: partner.url || '',
      sortOrder: partner.sortOrder,
    });
    setEditingId(partner.id);
    setModalOpen(true);
  };

  const handleSave = async () => {
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/admin/partners/${editingId}` : '/api/admin/partners';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setModalOpen(false);
    fetchPartners();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить этого партнёра?')) return;
    await fetch(`/api/admin/partners/${id}`, { method: 'DELETE' });
    fetchPartners();
  };

  const uploadFile = async (
    file: File,
    setter: (url: string) => void,
    setLoadingFn: (v: boolean) => void
  ) => {
    setLoadingFn(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setter(data.url);
      } else {
        alert(`Ошибка загрузки: ${data.error || 'Неизвестная ошибка'}`);
      }
    } catch (err) {
      alert('Ошибка сети при загрузке файла');
      console.error(err);
    } finally {
      setLoadingFn(false);
    }
  };

  const darkModeLabels: Record<string, string> = {
    none: 'Без изменений',
    dark: 'Перекрасить в тёмный',
    invert: 'Инвертировать цвета',
    white: 'Перекрасить в белый',
    separate: 'Отдельный логотип',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Партнёры</h3>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Добавить партнёра
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-5 py-3 font-medium text-gray-600">Название</th>
              <th className="px-5 py-3 font-medium text-gray-600">Лого</th>
              <th className="px-5 py-3 font-medium text-gray-600">Тёмная тема</th>
              <th className="px-5 py-3 font-medium text-gray-600">Порядок</th>
              <th className="px-5 py-3 font-medium text-gray-600">Действия</th>
            </tr>
          </thead>
          <tbody>
            {partners.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                  Нет партнёров
                </td>
              </tr>
            ) : (
              partners.map((partner) => (
                <tr key={partner.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-800 font-medium">{partner.name}</td>
                  <td className="px-5 py-3">
                    {partner.logoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="w-10 h-10 rounded-lg object-contain bg-gray-50"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <ImageIcon size={16} className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-600 text-xs">
                    {darkModeLabels[partner.darkMode] || 'Без изменений'}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{partner.sortOrder}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(partner)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(partner.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingId ? 'Редактировать партнёра' : 'Новый партнёр'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Название компании"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Логотип</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setCropTarget('logo');
                        setCropImage(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 transition mb-2 disabled:opacity-50"
                >
                  <Upload size={16} />
                  {uploading ? 'Загрузка...' : 'Загрузить лого'}
                </button>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={form.logoUrl}
                    onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    placeholder="Или вставьте URL логотипа"
                  />
                  {form.logoUrl ? (
                    <div className="relative flex-shrink-0 group/img">
                      <img
                        src={form.logoUrl}
                        alt="Preview"
                        className="w-10 h-10 rounded-lg object-contain bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => { setCropTarget('logo'); setCropImage(form.logoUrl); }}
                        className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                      >
                        <Crop size={14} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg border border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                      <ImageIcon size={16} className="text-gray-300" />
                    </div>
                  )}
                </div>
                {form.logoUrl && (
                  <div className="flex items-center gap-3 mt-1">
                    {!form.logoUrl.endsWith('.svg') && (
                      <button
                        type="button"
                        onClick={() => { setBgRemoveTarget('logo'); setBgRemoveImage(form.logoUrl); }}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Eraser size={14} />
                        Убрать фон
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, logoUrl: '' })}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Удалить
                    </button>
                  </div>
                )}
              </div>

              {/* Dark mode settings */}
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Отображение в тёмной теме
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'none', label: 'Без изменений', desc: 'Логотип отображается как есть' },
                    { value: 'dark', label: 'Перекрасить в тёмный', desc: 'Логотип станет тёмным для светлой темы' },
                    { value: 'invert', label: 'Инвертировать цвета', desc: 'Тёмное станет светлым и наоборот' },
                    { value: 'white', label: 'Перекрасить в белый', desc: 'Весь логотип станет белым' },
                    { value: 'separate', label: 'Отдельный логотип', desc: 'Загрузить другой файл для тёмной темы' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition ${
                        form.darkMode === opt.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="darkMode"
                        value={opt.value}
                        checked={form.darkMode === opt.value}
                        onChange={(e) => setForm({ ...form, darkMode: e.target.value })}
                        className="mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                        <p className="text-xs text-gray-500">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Preview */}
                {form.logoUrl && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">Светлая</p>
                      <div className="w-20 h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-2">
                        <img
                          src={form.logoUrl}
                          alt="Light"
                          className={`max-w-full max-h-full object-contain ${
                            form.darkMode === 'dark' ? 'brightness-0' : ''
                          }`}
                        />
                      </div>
                    </div>
                    {form.darkMode === 'separate' && form.logoDarkUrl && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, logoUrl: form.logoDarkUrl, logoDarkUrl: form.logoUrl })}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition mt-4"
                        title="Поменять местами"
                      >
                        <ArrowLeftRight size={16} />
                      </button>
                    )}
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">Тёмная</p>
                      <div className="w-20 h-14 bg-[#060810] border border-gray-700 rounded-lg flex items-center justify-center p-2">
                        {form.darkMode === 'separate' && form.logoDarkUrl ? (
                          <img src={form.logoDarkUrl} alt="Dark" className="max-w-full max-h-full object-contain" />
                        ) : (
                          <img
                            src={form.logoUrl}
                            alt="Dark preview"
                            className={`max-w-full max-h-full object-contain ${
                              form.darkMode === 'invert' ? 'invert' : ''
                            } ${form.darkMode === 'white' ? 'brightness-0 invert' : ''}`}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Separate dark logo upload */}
                {form.darkMode === 'separate' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Логотип для тёмной темы
                    </label>
                    <input
                      ref={fileDarkInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setCropTarget('logoDark');
                            setCropImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                        if (fileDarkInputRef.current) fileDarkInputRef.current.value = '';
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileDarkInputRef.current?.click()}
                      disabled={uploadingDark}
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 transition mb-2 disabled:opacity-50"
                    >
                      <Upload size={16} />
                      {uploadingDark ? 'Загрузка...' : 'Загрузить лого для тёмной темы'}
                    </button>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={form.logoDarkUrl}
                        onChange={(e) => setForm({ ...form, logoDarkUrl: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                        placeholder="URL логотипа для тёмной темы"
                      />
                      {form.logoDarkUrl && (
                        <div className="relative flex-shrink-0 group/img">
                          <img
                            src={form.logoDarkUrl}
                            alt="Dark preview"
                            className="w-10 h-10 rounded-lg object-contain bg-gray-900"
                          />
                          <button
                            type="button"
                            onClick={() => { setCropTarget('logoDark'); setCropImage(form.logoDarkUrl); }}
                            className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                          >
                            <Crop size={14} className="text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                    {form.logoDarkUrl && !form.logoDarkUrl.endsWith('.svg') && (
                      <button
                        type="button"
                        onClick={() => { setBgRemoveTarget('logoDark'); setBgRemoveImage(form.logoDarkUrl); }}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-1"
                      >
                        <Eraser size={14} />
                        Убрать фон
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка</label>
                <input
                  type="text"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Порядок сортировки</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {cropImage && (
        <ImageCropper
          imageSrc={cropImage}
          onCancel={() => setCropImage(null)}
          onComplete={(blob) => {
            setCropImage(null);
            const file = new File([blob], 'cropped.png', { type: 'image/png' });
            const field = cropTarget === 'logoDark' ? 'logoDarkUrl' : 'logoUrl';
            const setLoadingFn = cropTarget === 'logoDark' ? setUploadingDark : setUploading;
            uploadFile(
              file,
              (url) => setForm((prev) => ({ ...prev, [field]: url })),
              setLoadingFn
            );
          }}
        />
      )}

      {bgRemoveImage && (
        <BackgroundRemover
          imageSrc={bgRemoveImage}
          onCancel={() => setBgRemoveImage(null)}
          onComplete={(blob) => {
            setBgRemoveImage(null);
            const file = new File([blob], 'nobg.png', { type: 'image/png' });
            const field = bgRemoveTarget === 'logoDark' ? 'logoDarkUrl' : 'logoUrl';
            const setLoadingFn = bgRemoveTarget === 'logoDark' ? setUploadingDark : setUploading;
            uploadFile(
              file,
              (url) => setForm((prev) => ({ ...prev, [field]: url })),
              setLoadingFn
            );
          }}
        />
      )}
    </div>
  );
}
