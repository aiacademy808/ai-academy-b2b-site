'use client';

import { useEffect, useState, useCallback } from 'react';

interface PricingTier {
  price: string;
  description: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  heroTitle: string;
  heroSlogan: string;
  tagline: string;
  accentColor: string;
  sortOrder: number;
  isActive: boolean;
  kpiItems: unknown[];
  pains: unknown[];
  features: unknown[];
  pricingStart: PricingTier;
  pricingBusiness: PricingTier;
  pricingPro: PricingTier;
}

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  slug: '',
  heroTitle: '',
  heroSlogan: '',
  tagline: '',
  accentColor: '#00e5ff',
  sortOrder: 0,
  isActive: true,
  kpiItems: [],
  pains: [],
  features: [],
  pricingStart: { price: '', description: '' },
  pricingBusiness: { price: '', description: '' },
  pricingPro: { price: '', description: '' },
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [kpiJson, setKpiJson] = useState('[]');
  const [painsJson, setPainsJson] = useState('[]');
  const [featuresJson, setFeaturesJson] = useState('[]');

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch {
      setError('Не удалось загрузить продукты');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyProduct);
    setKpiJson('[]');
    setPainsJson('[]');
    setFeaturesJson('[]');
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      slug: product.slug,
      heroTitle: product.heroTitle || '',
      heroSlogan: product.heroSlogan || '',
      tagline: product.tagline || '',
      accentColor: product.accentColor || '#00e5ff',
      sortOrder: product.sortOrder || 0,
      isActive: product.isActive ?? true,
      kpiItems: product.kpiItems || [],
      pains: product.pains || [],
      features: product.features || [],
      pricingStart: product.pricingStart || { price: '', description: '' },
      pricingBusiness: product.pricingBusiness || { price: '', description: '' },
      pricingPro: product.pricingPro || { price: '', description: '' },
    });
    setKpiJson(JSON.stringify(product.kpiItems || [], null, 2));
    setPainsJson(JSON.stringify(product.pains || [], null, 2));
    setFeaturesJson(JSON.stringify(product.features || [], null, 2));
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      let parsedKpi, parsedPains, parsedFeatures;
      try {
        parsedKpi = JSON.parse(kpiJson);
      } catch {
        setError('Невалидный JSON в KPI Items');
        setSaving(false);
        return;
      }
      try {
        parsedPains = JSON.parse(painsJson);
      } catch {
        setError('Невалидный JSON в Pains');
        setSaving(false);
        return;
      }
      try {
        parsedFeatures = JSON.parse(featuresJson);
      } catch {
        setError('Невалидный JSON в Features');
        setSaving(false);
        return;
      }

      const body = {
        ...form,
        kpiItems: parsedKpi,
        pains: parsedPains,
        features: parsedFeatures,
      };

      const url = editingProduct
        ? `/api/admin/products?id=${editingProduct.id}`
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Ошибка сохранения');
      }

      setModalOpen(false);
      fetchProducts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить продукт?')) return;
    try {
      await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch {
      setError('Не удалось удалить продукт');
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
        <h2 className="text-xl font-semibold text-gray-900" style={{ color: '#111827' }}>Продукты</h2>
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ background: '#2563eb' }}
        >
          + Добавить продукт
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
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Название</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Slug</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Цвет</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Порядок</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Статус</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: '#6b7280' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50" style={{ borderColor: '#f3f4f6' }}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900" style={{ color: '#111827' }}>{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500" style={{ color: '#6b7280' }}>{product.slug}</td>
                  <td className="px-6 py-4">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-200"
                      style={{ background: product.accentColor, borderColor: '#e5e7eb' }}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500" style={{ color: '#6b7280' }}>{product.sortOrder}</td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        background: product.isActive ? '#d1fae5' : '#f3f4f6',
                        color: product.isActive ? '#059669' : '#6b7280',
                      }}
                    >
                      {product.isActive ? 'Активен' : 'Неактивен'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEdit(product)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                      style={{ background: '#f3f4f6', color: '#374151' }}
                    >
                      Редакт.
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                      style={{ background: '#fef2f2', color: '#dc2626' }}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500" style={{ color: '#6b7280' }}>
                    Продуктов пока нет
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
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mb-10"
            style={{ background: '#ffffff' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200" style={{ borderColor: '#e5e7eb' }}>
              <h3 className="text-lg font-semibold text-gray-900" style={{ color: '#111827' }}>
                {editingProduct ? 'Редактировать продукт' : 'Новый продукт'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Basic fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Название</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900"
                    style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Slug</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900"
                    style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Hero Title</label>
                <input
                  value={form.heroTitle}
                  onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900"
                  style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Hero Slogan</label>
                <input
                  value={form.heroSlogan}
                  onChange={(e) => setForm({ ...form, heroSlogan: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900"
                  style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Tagline</label>
                <input
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900"
                  style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.accentColor}
                      onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer border-0"
                    />
                    <input
                      value={form.accentColor}
                      onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-lg border text-sm text-gray-900"
                      style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Sort Order</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900"
                    style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Активен</label>
                  <select
                    value={form.isActive ? 'true' : 'false'}
                    onChange={(e) => setForm({ ...form, isActive: e.target.value === 'true' })}
                    className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900"
                    style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                  >
                    <option value="true">Да</option>
                    <option value="false">Нет</option>
                  </select>
                </div>
              </div>

              {/* JSON editors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>KPI Items (JSON)</label>
                <textarea
                  value={kpiJson}
                  onChange={(e) => setKpiJson(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border text-sm font-mono text-gray-900"
                  style={{ borderColor: '#d1d5db', color: '#111827', background: '#f9fafb' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Pains (JSON)</label>
                <textarea
                  value={painsJson}
                  onChange={(e) => setPainsJson(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border text-sm font-mono text-gray-900"
                  style={{ borderColor: '#d1d5db', color: '#111827', background: '#f9fafb' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>Features (JSON)</label>
                <textarea
                  value={featuresJson}
                  onChange={(e) => setFeaturesJson(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border text-sm font-mono text-gray-900"
                  style={{ borderColor: '#d1d5db', color: '#111827', background: '#f9fafb' }}
                />
              </div>

              {/* Pricing tiers */}
              <div className="border-t border-gray-200 pt-5" style={{ borderColor: '#e5e7eb' }}>
                <h4 className="text-sm font-semibold text-gray-900 mb-4" style={{ color: '#111827' }}>Тарифы</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['pricingStart', 'pricingBusiness', 'pricingPro'] as const).map((tier) => {
                    const labels = {
                      pricingStart: 'Start',
                      pricingBusiness: 'Business',
                      pricingPro: 'Pro',
                    };
                    return (
                      <div key={tier} className="p-4 rounded-lg border border-gray-200" style={{ borderColor: '#e5e7eb' }}>
                        <p className="text-sm font-medium text-gray-700 mb-3" style={{ color: '#374151' }}>{labels[tier]}</p>
                        <div className="space-y-2">
                          <input
                            placeholder="Цена"
                            value={form[tier].price}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                [tier]: { ...form[tier], price: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900"
                            style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                          />
                          <textarea
                            placeholder="Описание"
                            value={form[tier].description}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                [tier]: { ...form[tier], description: e.target.value },
                              })
                            }
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900"
                            style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200" style={{ borderColor: '#e5e7eb' }}>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ background: '#f3f4f6', color: '#374151' }}
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
                style={{ background: '#2563eb', color: '#ffffff' }}
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
