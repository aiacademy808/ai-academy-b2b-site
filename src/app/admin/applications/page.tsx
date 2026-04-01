'use client';

import { useEffect, useState, useCallback } from 'react';

interface Application {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  products: string[];
  status: string;
  createdAt: string;
}

const statusOptions: { value: string; label: string; bg: string; text: string }[] = [
  { value: 'new', label: 'Новая', bg: '#dbeafe', text: '#2563eb' },
  { value: 'in_progress', label: 'В работе', bg: '#fef3c7', text: '#d97706' },
  { value: 'closed', label: 'Закрыта', bg: '#d1fae5', text: '#059669' },
];

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/applications');
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : data.applications || []);
    } catch {
      setError('Не удалось загрузить заявки');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/admin/applications?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
    } catch {
      setError('Не удалось обновить статус');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить заявку?')) return;
    try {
      await fetch(`/api/admin/applications?id=${id}`, { method: 'DELETE' });
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch {
      setError('Не удалось удалить заявку');
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
      <h2 className="text-xl font-semibold text-gray-900" style={{ color: '#111827' }}>Заявки</h2>

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
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Имя</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Компания</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Телефон</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Email</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Продукты</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Статус</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Дата</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const st = statusOptions.find((s) => s.value === app.status) || statusOptions[0];
                return (
                  <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50" style={{ borderColor: '#f3f4f6' }}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900" style={{ color: '#111827' }}>{app.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600" style={{ color: '#4b5563' }}>{app.company}</td>
                    <td className="px-6 py-4 text-sm text-gray-600" style={{ color: '#4b5563' }}>{app.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600" style={{ color: '#4b5563' }}>{app.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600" style={{ color: '#4b5563' }}>
                      {(app.products || []).join(', ') || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="rounded-full px-3 py-1 text-xs font-medium border-0 cursor-pointer"
                        style={{ background: st.bg, color: st.text }}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500" style={{ color: '#6b7280' }}>
                      {new Date(app.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                        style={{ background: '#fef2f2', color: '#dc2626' }}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                );
              })}
              {applications.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500" style={{ color: '#6b7280' }}>
                    Заявок пока нет
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
