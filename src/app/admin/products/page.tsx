'use client';

import { useEffect, useState, useCallback } from 'react';

interface PricingTier {
  id?: number;
  tierName: string;
  price: number;
  description: string;
  features: string[];
  isPopular: boolean;
}

interface Product {
  id: number;
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
  pricingTiers: PricingTier[];
}

const defaultTiers: PricingTier[] = [
  { tierName: 'Старт', price: 0, description: '', features: [], isPopular: false },
  { tierName: 'Бизнес', price: 0, description: '', features: [], isPopular: true },
  { tierName: 'Про', price: 0, description: '', features: [], isPopular: false },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSlogan, setHeroSlogan] = useState('');
  const [tagline, setTagline] = useState('');
  const [accentColor, setAccentColor] = useState('#00e5ff');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [kpiJson, setKpiJson] = useState('[]');
  const [painsJson, setPainsJson] = useState('[]');
  const [featuresJson, setFeaturesJson] = useState('[]');
  const [tiers, setTiers] = useState<PricingTier[]>(defaultTiers);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setError('Не удалось загрузить продукты');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const resetForm = () => {
    setName('');
    setSlug('');
    setHeroTitle('');
    setHeroSlogan('');
    setTagline('');
    setAccentColor('#00e5ff');
    setSortOrder(0);
    setIsActive(true);
    setKpiJson('[]');
    setPainsJson('[]');
    setFeaturesJson('[]');
    setTiers(defaultTiers);
  };

  const openAdd = () => {
    setEditingProduct(null);
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setSlug(product.slug);
    setHeroTitle(product.heroTitle || '');
    setHeroSlogan(product.heroSlogan || '');
    setTagline(product.tagline || '');
    setAccentColor(product.accentColor || '#00e5ff');
    setSortOrder(product.sortOrder || 0);
    setIsActive(product.isActive ?? true);
    setKpiJson(JSON.stringify(product.kpiItems || [], null, 2));
    setPainsJson(JSON.stringify(product.pains || [], null, 2));
    setFeaturesJson(JSON.stringify(product.features || [], null, 2));

    // Map pricing tiers
    const tierMap = new Map(product.pricingTiers.map((t) => [t.tierName, t]));
    setTiers(
      ['Старт', 'Бизнес', 'Про'].map((tierName) => {
        const existing = tierMap.get(tierName);
        return existing
          ? { ...existing }
          : { tierName, price: 0, description: '', features: [], isPopular: tierName === 'Бизнес' };
      })
    );
    setModalOpen(true);
  };

  const updateTier = (index: number, field: string, value: string | number | boolean | string[]) => {
    setTiers((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const handleSave = async () => {
    if (!name) {
      setError('Название обязательно');
      return;
    }
    setSaving(true);
    setError('');
    try {
      let parsedKpi, parsedPains, parsedFeatures;
      try { parsedKpi = JSON.parse(kpiJson); } catch { setError('Невалидный JSON в KPI'); setSaving(false); return; }
      try { parsedPains = JSON.parse(painsJson); } catch { setError('Невалидный JSON в Pains'); setSaving(false); return; }
      try { parsedFeatures = JSON.parse(featuresJson); } catch { setError('Невалидный JSON в Features'); setSaving(false); return; }

      const body = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9а-яё\s-]/gi, '').replace(/\s+/g, '-'),
        heroTitle,
        heroSlogan,
        tagline,
        accentColor,
        sortOrder,
        isActive,
        kpiItems: parsedKpi,
        pains: parsedPains,
        features: parsedFeatures,
        pricingTiers: tiers.map((t) => ({
          ...t,
          price: typeof t.price === 'string' ? parseInt(t.price as string) || 0 : t.price,
        })),
      };

      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
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
      setSuccess(editingProduct ? 'Продукт обновлён' : 'Продукт создан');
      fetchProducts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить продукт?')) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      setSuccess('Продукт удалён');
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
        <h2 className="text-xl font-semibold" style={{ color: '#111827' }}>Продукты</h2>
        <button onClick={openAdd} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#2563eb' }}>
          + Добавить продукт
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg text-sm" style={{ background: '#fef2f2', color: '#dc2626' }}>
          {error}
          <button onClick={() => setError('')} className="ml-2 font-medium underline">Закрыть</button>
        </div>
      )}

      {success && (
        <div className="px-4 py-3 rounded-lg text-sm" style={{ background: '#f0fdf4', color: '#16a34a' }}>{success}</div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#e5e7eb' }}>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>Название</th>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>Slug</th>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>Цвет</th>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>Тарифы</th>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>Статус</th>
                <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50" style={{ borderColor: '#f3f4f6' }}>
                  <td className="px-6 py-4 text-sm font-medium" style={{ color: '#111827' }}>{product.name}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#6b7280' }}>{product.slug}</td>
                  <td className="px-6 py-4">
                    <div className="w-6 h-6 rounded-full border" style={{ background: product.accentColor, borderColor: '#e5e7eb' }} />
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#6b7280' }}>
                    {product.pricingTiers.length} тариф(ов)
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                      style={{ background: product.isActive ? '#d1fae5' : '#f3f4f6', color: product.isActive ? '#059669' : '#6b7280' }}>
                      {product.isActive ? 'Активен' : 'Неактивен'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openEdit(product)} className="px-3 py-1.5 text-xs font-medium rounded-lg" style={{ background: '#eff6ff', color: '#2563eb' }}>
                      Редакт.
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg" style={{ background: '#fef2f2', color: '#dc2626' }}>
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center" style={{ color: '#6b7280' }}>Продуктов пока нет</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 px-4 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mb-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#e5e7eb' }}>
              <h3 className="text-lg font-semibold" style={{ color: '#111827' }}>
                {editingProduct ? 'Редактировать продукт' : 'Новый продукт'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Basic fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>Название</label>
                  <input value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: '#d1d5db', color: '#111827' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>Slug</label>
                  <input value={slug} onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: '#d1d5db', color: '#111827' }} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>Заголовок (Hero Title)</label>
                <input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: '#d1d5db', color: '#111827' }} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>Подзаголовок (Hero Slogan)</label>
                <textarea value={heroSlogan} onChange={(e) => setHeroSlogan(e.target.value)} rows={2}
                  className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: '#d1d5db', color: '#111827' }} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>Краткое описание (Tagline)</label>
                <input value={tagline} onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: '#d1d5db', color: '#111827' }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>Цвет акцента</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
                    <input value={accentColor} onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border text-sm" style={{ borderColor: '#d1d5db', color: '#111827' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>Порядок сортировки</label>
                  <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: '#d1d5db', color: '#111827' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>Активен</label>
                  <select value={isActive ? 'true' : 'false'} onChange={(e) => setIsActive(e.target.value === 'true')}
                    className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: '#d1d5db', color: '#111827' }}>
                    <option value="true">Да</option>
                    <option value="false">Нет</option>
                  </select>
                </div>
              </div>

              {/* JSON editors */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
                  KPI (JSON) <span className="text-gray-400 font-normal">— [{'{'}value, label, source{'}'}]</span>
                </label>
                <textarea value={kpiJson} onChange={(e) => setKpiJson(e.target.value)} rows={4}
                  className="w-full px-3 py-2 rounded-lg border text-sm font-mono" style={{ borderColor: '#d1d5db', color: '#111827', background: '#f9fafb' }} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
                  Проблемы (JSON) <span className="text-gray-400 font-normal">— [{'{'}title, description{'}'}]</span>
                </label>
                <textarea value={painsJson} onChange={(e) => setPainsJson(e.target.value)} rows={4}
                  className="w-full px-3 py-2 rounded-lg border text-sm font-mono" style={{ borderColor: '#d1d5db', color: '#111827', background: '#f9fafb' }} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
                  Возможности (JSON) <span className="text-gray-400 font-normal">— [{'{'}title, description, icon{'}'}]</span>
                </label>
                <textarea value={featuresJson} onChange={(e) => setFeaturesJson(e.target.value)} rows={4}
                  className="w-full px-3 py-2 rounded-lg border text-sm font-mono" style={{ borderColor: '#d1d5db', color: '#111827', background: '#f9fafb' }} />
              </div>

              {/* Pricing tiers */}
              <div className="border-t pt-5" style={{ borderColor: '#e5e7eb' }}>
                <h4 className="text-sm font-semibold mb-4" style={{ color: '#111827' }}>Тарифы</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tiers.map((tier, i) => (
                    <div key={tier.tierName} className="p-4 rounded-lg border" style={{ borderColor: tier.isPopular ? '#2563eb' : '#e5e7eb' }}>
                      <p className="text-sm font-semibold mb-3" style={{ color: '#374151' }}>
                        {tier.tierName}
                        {tier.isPopular && <span className="ml-2 text-xs text-blue-600">(популярный)</span>}
                      </p>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs mb-1" style={{ color: '#6b7280' }}>Цена (KGS)</label>
                          <input
                            type="number"
                            value={tier.price}
                            onChange={(e) => updateTier(i, 'price', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: '#d1d5db', color: '#111827' }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1" style={{ color: '#6b7280' }}>Описание</label>
                          <input
                            value={tier.description}
                            onChange={(e) => updateTier(i, 'description', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: '#d1d5db', color: '#111827' }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1" style={{ color: '#6b7280' }}>
                            Фичи <span className="text-gray-400">(по одной на строку)</span>
                          </label>
                          <textarea
                            value={(tier.features || []).join('\n')}
                            onChange={(e) => updateTier(i, 'features', e.target.value.split('\n').filter(Boolean))}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: '#d1d5db', color: '#111827' }}
                            placeholder="Фича 1&#10;Фича 2&#10;Фича 3"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: '#e5e7eb' }}>
              <button onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: '#f3f4f6', color: '#374151' }}>
                Отмена
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: '#2563eb' }}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
