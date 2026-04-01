'use client';

import { useEffect, useState } from 'react';

const settingKeys = [
  { key: 'siteName', label: 'Название сайта' },
  { key: 'phone', label: 'Телефон' },
  { key: 'email', label: 'Email' },
  { key: 'address', label: 'Адрес' },
  { key: 'whatsappNumber', label: 'WhatsApp номер' },
  { key: 'heroTitle', label: 'Hero заголовок' },
  { key: 'heroSubtitle', label: 'Hero подзаголовок' },
  { key: 'instagramUrl', label: 'Instagram URL' },
  { key: 'linkedinUrl', label: 'LinkedIn URL' },
];

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        const mapped: Record<string, string> = {};
        if (Array.isArray(data)) {
          data.forEach((item: { key: string; value: string }) => {
            mapped[item.key] = item.value;
          });
        } else if (data && typeof data === 'object') {
          Object.assign(mapped, data);
        }
        setValues(mapped);
      })
      .catch(() => setError('Не удалось загрузить настройки'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Ошибка сохранения');
      }
      setSuccess('Настройки сохранены');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
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
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-semibold text-gray-900" style={{ color: '#111827' }}>Настройки</h2>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm" style={{ background: '#fef2f2', color: '#dc2626' }}>
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm" style={{ background: '#ecfdf5', color: '#059669' }}>
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
        <div className="space-y-5">
          {settingKeys.map((setting) => (
            <div key={setting.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" style={{ color: '#374151' }}>
                {setting.label}
              </label>
              <input
                value={values[setting.key] || ''}
                onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                placeholder={setting.key}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end" style={{ borderColor: '#e5e7eb' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-colors"
            style={{ background: '#2563eb', color: '#ffffff' }}
          >
            {saving ? 'Сохранение...' : 'Сохранить все'}
          </button>
        </div>
      </div>
    </div>
  );
}
