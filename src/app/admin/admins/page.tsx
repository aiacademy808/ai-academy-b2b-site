'use client';

import { useEffect, useState, useCallback } from 'react';

interface Admin {
  id: number;
  username: string;
  name: string;
  role: string;
}

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', name: '' });
  const [saving, setSaving] = useState(false);

  // Edit state
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null);
  const [editData, setEditData] = useState({ username: '', name: '', password: '' });
  const [editSaving, setEditSaving] = useState(false);

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/admins');
      const data = await res.json();
      setAdmins(Array.isArray(data) ? data : data.admins || []);
    } catch {
      setError('Не удалось загрузить список админов');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Auto-hide success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleAdd = async () => {
    if (!formData.username || !formData.password) {
      setError('Логин и пароль обязательны');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Ошибка создания');
      }
      setFormData({ username: '', password: '', name: '' });
      setShowForm(false);
      setSuccess('Админ успешно создан');
      fetchAdmins();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка создания');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditAdmin(admin);
    setEditData({ username: admin.username, name: admin.name, password: '' });
    setError('');
  };

  const handleSaveEdit = async () => {
    if (!editAdmin) return;
    if (!editData.username) {
      setError('Логин обязателен');
      return;
    }
    setEditSaving(true);
    setError('');
    try {
      const payload: Record<string, string> = {
        username: editData.username,
        name: editData.name,
      };
      if (editData.password) {
        payload.password = editData.password;
      }

      const res = await fetch(`/api/admin/admins/${editAdmin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Ошибка обновления');
      }
      setEditAdmin(null);
      setSuccess('Данные обновлены' + (editData.password ? '. Пароль изменён.' : ''));
      fetchAdmins();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления');
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (!confirm(`Удалить админа "${username}"?`)) return;
    try {
      const res = await fetch(`/api/admin/admins/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Ошибка удаления');
      }
      setSuccess('Админ удалён');
      fetchAdmins();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить админа');
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
        <h2 className="text-xl font-semibold text-gray-900" style={{ color: '#111827' }}>Админы</h2>
        <button
          onClick={() => { setShowForm(!showForm); setEditAdmin(null); }}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: '#2563eb' }}
        >
          {showForm ? 'Отмена' : '+ Добавить админа'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm" style={{ background: '#fef2f2', color: '#dc2626' }}>
          {error}
          <button onClick={() => setError('')} className="ml-2 font-medium underline">Закрыть</button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm" style={{ background: '#f0fdf4', color: '#16a34a' }}>
          {success}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
          <h3 className="text-sm font-semibold text-gray-900 mb-4" style={{ color: '#111827' }}>Новый администратор</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Логин</label>
              <input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900"
                style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                placeholder="admin2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Пароль</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900"
                style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                placeholder="********"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Имя</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900"
                style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                placeholder="Имя Фамилия"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
              style={{ background: '#2563eb', color: '#ffffff' }}
            >
              {saving ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </div>
      )}

      {/* Edit form */}
      {editAdmin && (
        <div className="bg-white rounded-lg shadow-sm border-2 border-blue-400 p-6" style={{ background: '#ffffff', borderColor: '#60a5fa' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-900" style={{ color: '#111827' }}>
              Редактирование: {editAdmin.username}
            </h3>
            <button
              onClick={() => setEditAdmin(null)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Отмена
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Логин</label>
              <input
                value={editData.username}
                onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900"
                style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Имя</label>
              <input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900"
                style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>
                Новый пароль <span className="text-gray-400 font-normal">(оставьте пустым, если не менять)</span>
              </label>
              <input
                type="password"
                value={editData.password}
                onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900"
                style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                placeholder="Новый пароль"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveEdit}
              disabled={editSaving}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
              style={{ background: '#2563eb', color: '#ffffff' }}
            >
              {editSaving ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200" style={{ borderColor: '#e5e7eb' }}>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Логин</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Имя</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Роль</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50" style={{ borderColor: '#f3f4f6' }}>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono" style={{ color: '#6b7280' }}>
                    {admin.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900" style={{ color: '#111827' }}>{admin.username}</td>
                  <td className="px-6 py-4 text-sm text-gray-600" style={{ color: '#4b5563' }}>{admin.name || '-'}</td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                      style={{ background: '#eff6ff', color: '#2563eb' }}
                    >
                      {admin.role || 'admin'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(admin)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg"
                      style={{ background: '#eff6ff', color: '#2563eb' }}
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id, admin.username)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg"
                      style={{ background: '#fef2f2', color: '#dc2626' }}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500" style={{ color: '#6b7280' }}>
                    Админов пока нет
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
