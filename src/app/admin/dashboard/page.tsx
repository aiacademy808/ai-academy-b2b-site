'use client';

import { useEffect, useState } from 'react';

interface Stats {
  products: number;
  applications: {
    total: number;
    new: number;
    in_progress: number;
  };
  cases: number;
  blogPosts: number;
}

interface Application {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/admin/applications?limit=5').then((r) => r.json()),
    ])
      .then(([statsData, appsData]) => {
        setStats(statsData);
        setRecentApps(Array.isArray(appsData) ? appsData : appsData.applications || []);
      })
      .catch(() => setError('Не удалось загрузить данные'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg" style={{ background: '#fef2f2', color: '#dc2626' }}>
        {error}
      </div>
    );
  }

  const statCards = [
    { label: 'Продуктов', value: stats?.products ?? 0, color: '#2563eb' },
    { label: 'Заявок (всего)', value: stats?.applications?.total ?? 0, color: '#7c3aed' },
    { label: 'Новых заявок', value: stats?.applications?.new ?? 0, color: '#2563eb' },
    { label: 'В работе', value: stats?.applications?.in_progress ?? 0, color: '#d97706' },
    { label: 'Кейсов', value: stats?.cases ?? 0, color: '#7c3aed' },
    { label: 'Постов в блоге', value: stats?.blogPosts ?? 0, color: '#0891b2' },
  ];

  const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
    new: { bg: '#dbeafe', text: '#2563eb', label: 'Новая' },
    in_progress: { bg: '#fef3c7', text: '#d97706', label: 'В работе' },
    closed: { bg: '#d1fae5', text: '#059669', label: 'Закрыта' },
  };

  return (
    <div className="space-y-8">
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
            style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
          >
            <p className="text-sm text-gray-500 mb-1" style={{ color: '#6b7280' }}>{card.label}</p>
            <p className="text-3xl font-bold" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent applications */}
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200"
        style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
      >
        <div className="px-6 py-4 border-b border-gray-200" style={{ borderColor: '#e5e7eb' }}>
          <h2 className="text-lg font-semibold text-gray-900" style={{ color: '#111827' }}>
            Последние заявки
          </h2>
        </div>
        {recentApps.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500" style={{ color: '#6b7280' }}>
            Заявок пока нет
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200" style={{ borderColor: '#e5e7eb' }}>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Имя</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Компания</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Email</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Статус</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Дата</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => {
                  const st = statusStyles[app.status] || statusStyles.new;
                  return (
                    <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50" style={{ borderColor: '#f3f4f6' }}>
                      <td className="px-6 py-4 text-sm text-gray-900" style={{ color: '#111827' }}>{app.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600" style={{ color: '#4b5563' }}>{app.company}</td>
                      <td className="px-6 py-4 text-sm text-gray-600" style={{ color: '#4b5563' }}>{app.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                          style={{ background: st.bg, color: st.text }}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500" style={{ color: '#6b7280' }}>
                        {new Date(app.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
