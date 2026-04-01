'use client';

import { useEffect, useState, useCallback } from 'react';

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  clientName: string;
  productName: string;
  cost: string;
  timeline: string;
  result: string;
  quote: string;
  quoteAuthor: string;
  status: string;
  isPublished: boolean;
}

const emptyCase: Omit<CaseStudy, 'id'> = {
  title: '',
  slug: '',
  clientName: '',
  productName: '',
  cost: '',
  timeline: '',
  result: '',
  quote: '',
  quoteAuthor: '',
  status: 'draft',
  isPublished: false,
};

export default function AdminCasesPage() {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<CaseStudy | null>(null);
  const [form, setForm] = useState<Omit<CaseStudy, 'id'>>(emptyCase);
  const [saving, setSaving] = useState(false);

  const fetchCases = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/cases');
      const data = await res.json();
      setCases(Array.isArray(data) ? data : data.cases || []);
    } catch {
      setError('Не удалось загрузить кейсы');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const openAdd = () => {
    setEditingCase(null);
    setForm(emptyCase);
    setModalOpen(true);
  };

  const openEdit = (c: CaseStudy) => {
    setEditingCase(c);
    setForm({
      title: c.title,
      slug: c.slug,
      clientName: c.clientName || '',
      productName: c.productName || '',
      cost: c.cost || '',
      timeline: c.timeline || '',
      result: c.result || '',
      quote: c.quote || '',
      quoteAuthor: c.quoteAuthor || '',
      status: c.status || 'draft',
      isPublished: c.isPublished ?? false,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const url = editingCase ? `/api/admin/cases?id=${editingCase.id}` : '/api/admin/cases';
      const method = editingCase ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Ошибка сохранения');
      }
      setModalOpen(false);
      fetchCases();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить кейс?')) return;
    try {
      await fetch(`/api/admin/cases?id=${id}`, { method: 'DELETE' });
      fetchCases();
    } catch {
      setError('Не удалось удалить кейс');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900" style={{ color: '#111827' }}>Кейсы</h2>
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: '#2563eb' }}
        >
          + Добавить кейс
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm" style={{ background: '#fef2f2', color: '#dc2626' }}>
          {error}
          <button onClick={() => setError('')} className="ml-2 font-medium underline">Закрыть</button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200" style={{ borderColor: '#e5e7eb' }}>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Заголовок</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Клиент</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Продукт</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Стоимость</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Опубликован</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50" style={{ borderColor: '#f3f4f6' }}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900" style={{ color: '#111827' }}>{c.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600" style={{ color: '#4b5563' }}>{c.clientName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600" style={{ color: '#4b5563' }}>{c.productName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600" style={{ color: '#4b5563' }}>{c.cost}</td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        background: c.isPublished ? '#d1fae5' : '#f3f4f6',
                        color: c.isPublished ? '#059669' : '#6b7280',
                      }}
                    >
                      {c.isPublished ? 'Да' : 'Нет'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEdit(c)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg"
                      style={{ background: '#f3f4f6', color: '#374151' }}
                    >
                      Редакт.
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg"
                      style={{ background: '#fef2f2', color: '#dc2626' }}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
              {cases.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500" style={{ color: '#6b7280' }}>
                    Кейсов пока нет
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 px-4 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mb-10" style={{ background: '#ffffff' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200" style={{ borderColor: '#e5e7eb' }}>
              <h3 className="text-lg font-semibold text-gray-900" style={{ color: '#111827' }}>
                {editingCase ? 'Редактировать кейс' : 'Новый кейс'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Заголовок</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900" style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Slug</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900" style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Клиент</label>
                  <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900" style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Продукт</label>
                  <input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900" style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Стоимость</label>
                  <input value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900" style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Сроки</label>
                  <input value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900" style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Результат</label>
                <textarea value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900" style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Цитата</label>
                <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900" style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Автор цитаты</label>
                  <input value={form.quoteAuthor} onChange={(e) => setForm({ ...form, quoteAuthor: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900" style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Статус</label>
                  <input value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900" style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }} />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer" style={{ color: '#374151' }}>
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Опубликован
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200" style={{ borderColor: '#e5e7eb' }}>
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: '#f3f4f6', color: '#374151' }}>Отмена</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: '#2563eb', color: '#ffffff' }}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
