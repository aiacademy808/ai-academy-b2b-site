'use client';

import { useEffect, useState, useCallback } from 'react';
import { extractYouTubeId } from '@/lib/youtube';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  videoUrl: string;
  isPublished: boolean;
  createdAt: string;
}

const emptyPost: Omit<BlogPost, 'id' | 'createdAt'> = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  videoUrl: '',
  isPublished: false,
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<Omit<BlogPost, 'id' | 'createdAt'>>(emptyPost);
  const [saving, setSaving] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/blog');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : data.posts || []);
    } catch {
      setError('Не удалось загрузить посты');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const openAdd = () => {
    setEditingPost(null);
    setForm(emptyPost);
    setModalOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content || '',
      excerpt: post.excerpt || '',
      videoUrl: post.videoUrl || '',
      isPublished: post.isPublished ?? false,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const url = editingPost ? `/api/admin/blog/${editingPost.id}` : '/api/admin/blog';
      const method = editingPost ? 'PUT' : 'POST';
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
      fetchPosts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить пост?')) return;
    try {
      await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      fetchPosts();
    } catch {
      setError('Не удалось удалить пост');
    }
  };

  const videoId = extractYouTubeId(form.videoUrl);

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
        <h2 className="text-xl font-semibold text-gray-900" style={{ color: '#111827' }}>Блог</h2>
        <button onClick={openAdd} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#2563eb' }}>
          + Добавить пост
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
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Slug</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Видео</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Опубликован</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Дата</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50" style={{ borderColor: '#f3f4f6' }}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900" style={{ color: '#111827' }}>{post.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500" style={{ color: '#6b7280' }}>{post.slug}</td>
                  <td className="px-6 py-4">
                    {post.videoUrl ? (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                        style={{ background: '#fef3c7', color: '#d97706' }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#fff"/></svg>
                        YouTube
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400" style={{ color: '#9ca3af' }}>-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        background: post.isPublished ? '#d1fae5' : '#f3f4f6',
                        color: post.isPublished ? '#059669' : '#6b7280',
                      }}
                    >
                      {post.isPublished ? 'Да' : 'Нет'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500" style={{ color: '#6b7280' }}>
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString('ru-RU') : '-'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openEdit(post)} className="px-3 py-1.5 text-xs font-medium rounded-lg" style={{ background: '#f3f4f6', color: '#374151' }}>
                      Редакт.
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg" style={{ background: '#fef2f2', color: '#dc2626' }}>
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500" style={{ color: '#6b7280' }}>
                    Постов пока нет
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
                {editingPost ? 'Редактировать пост' : 'Новый пост'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Заголовок</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900" style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900" style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Краткое описание</label>
                <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900" style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }} />
              </div>

              {/* YouTube Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>
                  Видео YouTube (ссылка)
                </label>
                <input
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900"
                  style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                />
                {videoId && (
                  <div className="mt-3 rounded-lg overflow-hidden border" style={{ borderColor: '#e5e7eb' }}>
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="YouTube preview"
                      />
                    </div>
                  </div>
                )}
                {form.videoUrl && !videoId && (
                  <p className="mt-1 text-xs" style={{ color: '#dc2626' }}>
                    Не удалось распознать YouTube-ссылку. Поддерживаются форматы: youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/...
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Содержимое</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12} className="w-full px-3 py-2 rounded-lg border text-sm font-mono text-gray-900" style={{ borderColor: '#d1d5db', color: '#111827', background: '#f9fafb' }} />
              </div>
              <div
                className="flex items-center justify-between rounded-xl px-5 py-4 cursor-pointer select-none"
                style={{
                  background: form.isPublished ? '#ecfdf5' : '#f9fafb',
                  border: form.isPublished ? '2px solid #10b981' : '2px solid #e5e7eb',
                }}
                onClick={() => setForm({ ...form, isPublished: !form.isPublished })}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{
                      background: form.isPublished ? '#10b981' : '#d1d5db',
                    }}
                  >
                    {form.isPublished ? '✓' : ''}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: form.isPublished ? '#065f46' : '#374151' }}>
                      {form.isPublished ? 'Опубликован' : 'Черновик'}
                    </div>
                    <div className="text-xs" style={{ color: form.isPublished ? '#059669' : '#9ca3af' }}>
                      {form.isPublished ? 'Пост виден на сайте' : 'Пост скрыт от посетителей'}
                    </div>
                  </div>
                </div>
                <div
                  className="relative w-12 h-7 rounded-full transition-colors duration-200"
                  style={{ background: form.isPublished ? '#10b981' : '#d1d5db' }}
                >
                  <div
                    className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200"
                    style={{ transform: form.isPublished ? 'translateX(22px)' : 'translateX(2px)' }}
                  />
                </div>
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
