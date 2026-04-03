'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, ImageIcon } from 'lucide-react';

interface Partner {
  id: number;
  name: string;
  logoUrl: string;
  logoDarkUrl: string;
  darkMode: string;
  url: string;
  sortOrder: number;
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

  const darkModeLabels: Record<string, string> = {
    none: 'Без изменений',
    invert: 'Инвертировать цвета',
    white: 'Перекрасить в белый',
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
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
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
                <label className="block text-sm font-bold text-gray-700 mb-1">URL логотипа</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={form.logoUrl}
                    onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    placeholder="https://example.com/logo.png"
                  />
                  {form.logoUrl ? (
                    <img src={form.logoUrl} alt="Preview" className="w-10 h-10 rounded-lg object-contain bg-gray-50 flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg border border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                      <ImageIcon size={16} className="text-gray-300" />
                    </div>
                  )}
                </div>
                {form.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, logoUrl: '' })}
                    className="text-sm text-red-500 hover:text-red-700 mt-1"
                  >
                    Удалить
                  </button>
                )}
              </div>

              {/* Dark mode settings */}
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Отображение на сайте (тёмный фон)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'none', label: 'Без изменений', desc: 'Логотип отображается как есть' },
                    { value: 'invert', label: 'Инвертировать цвета', desc: 'Тёмное станет светлым и наоборот' },
                    { value: 'white', label: 'Перекрасить в белый', desc: 'Весь логотип станет белым' },
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

                {/* Preview on dark bg */}
                {form.logoUrl && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-1">Превью на тёмном фоне</p>
                    <div className="w-24 h-16 bg-[#060810] border border-gray-700 rounded-lg flex items-center justify-center p-2">
                      <img
                        src={form.logoUrl}
                        alt="Preview"
                        className={`max-w-full max-h-full object-contain ${
                          form.darkMode === 'invert' ? 'invert' : ''
                        } ${form.darkMode === 'white' ? 'brightness-0 invert' : ''}`}
                      />
                    </div>
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
    </div>
  );
}
