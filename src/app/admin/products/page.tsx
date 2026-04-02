'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  ScanLine, ShieldCheck, Plug, Layers, RefreshCw, Database, BrainCircuit, Activity,
  AudioLines, Star, AlertTriangle, FileText, Bot, MessageSquare, UserPlus, Globe,
  BarChart3, Cog, Route, Bell, Truck, Landmark, ShoppingCart, Factory,
  ShoppingBag, Radio, Handshake, Shield, Wrench, UtensilsCrossed, Zap,
  Brain, Headphones, MessageCircle, CheckCircle, Cpu, TrendingUp, Settings,
  type LucideIcon,
} from 'lucide-react';

// --------------- Icon registry ---------------
const ICON_MAP: Record<string, LucideIcon> = {
  ScanLine, ShieldCheck, Plug, Layers, RefreshCw, Database, BrainCircuit, Activity,
  AudioLines, Star, AlertTriangle, FileText, Bot, MessageSquare, UserPlus, Globe,
  BarChart3, Cog, Route, Bell, Truck, Landmark, ShoppingCart, Factory,
  ShoppingBag, Radio, Handshake, Shield, Wrench, UtensilsCrossed, Zap,
  Brain, Headphones, MessageCircle, CheckCircle, Cpu, TrendingUp, Settings,
};

const ICON_NAMES = Object.keys(ICON_MAP);

// --------------- Types ---------------
interface KpiItem {
  value: string;
  label: string;
  source: string;
}

interface PainItem {
  title: string;
  description: string;
}

interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

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
  kpiItems: KpiItem[];
  pains: PainItem[];
  features: FeatureItem[];
  pricingTiers: PricingTier[];
}

const defaultTiers: PricingTier[] = [
  { tierName: 'Старт', price: 0, description: '', features: [], isPopular: false },
  { tierName: 'Бизнес', price: 0, description: '', features: [], isPopular: true },
  { tierName: 'Про', price: 0, description: '', features: [], isPopular: false },
];

// --------------- Icon Picker Component ---------------
function IconPicker({
  value,
  onChange,
  onClose,
}: {
  value: string;
  onChange: (icon: string) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const filtered = ICON_NAMES.filter((n) =>
    n.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: '#e5e7eb' }}>
          <h4 className="text-sm font-semibold" style={{ color: '#111827' }}>Выберите иконку</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <div className="px-5 pt-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ borderColor: '#d1d5db', color: '#111827' }}
          />
        </div>

        <div className="p-5 grid grid-cols-6 gap-2 max-h-[340px] overflow-y-auto">
          {filtered.map((iconName) => {
            const Icon = ICON_MAP[iconName];
            const isSelected = value === iconName;
            return (
              <button
                key={iconName}
                onClick={() => {
                  onChange(iconName);
                  onClose();
                }}
                title={iconName}
                className="flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-colors"
                style={{
                  background: isSelected ? '#dbeafe' : '#f9fafb',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #e5e7eb',
                  color: isSelected ? '#2563eb' : '#374151',
                }}
              >
                <Icon size={20} />
                <span className="truncate w-full text-center" style={{ fontSize: '10px' }}>{iconName}</span>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="col-span-6 text-center text-sm py-4" style={{ color: '#9ca3af' }}>Ничего не найдено</p>
          )}
        </div>
      </div>
    </div>
  );
}

// --------------- Main Page ---------------
export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  // Basic form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSlogan, setHeroSlogan] = useState('');
  const [tagline, setTagline] = useState('');
  const [accentColor, setAccentColor] = useState('#00e5ff');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Structured data state
  const [kpiItems, setKpiItems] = useState<KpiItem[]>([]);
  const [pains, setPains] = useState<PainItem[]>([]);
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [tiers, setTiers] = useState<PricingTier[]>(defaultTiers);

  // Icon picker state
  const [iconPickerIndex, setIconPickerIndex] = useState<number | null>(null);

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
    setKpiItems([]);
    setPains([]);
    setFeatures([]);
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

    // Parse structured data (handle both array and raw formats gracefully)
    setKpiItems(
      Array.isArray(product.kpiItems)
        ? product.kpiItems.map(// eslint-disable-next-line @typescript-eslint/no-explicit-any
(k: any) => ({
            value: String(k.value ?? ''),
            label: String(k.label ?? ''),
            source: String(k.source ?? ''),
          }))
        : []
    );
    setPains(
      Array.isArray(product.pains)
        ? product.pains.map(// eslint-disable-next-line @typescript-eslint/no-explicit-any
(p: any) => ({
            title: String(p.title ?? ''),
            description: String(p.description ?? ''),
          }))
        : []
    );
    setFeatures(
      Array.isArray(product.features)
        ? product.features.map(// eslint-disable-next-line @typescript-eslint/no-explicit-any
(f: any) => ({
            title: String(f.title ?? ''),
            description: String(f.description ?? ''),
            icon: String(f.icon ?? ''),
          }))
        : []
    );

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

  // --------------- KPI helpers ---------------
  const addKpi = () => setKpiItems((prev) => [...prev, { value: '', label: '', source: '' }]);
  const removeKpi = (i: number) => setKpiItems((prev) => prev.filter((_, idx) => idx !== i));
  const updateKpi = (i: number, field: keyof KpiItem, val: string) =>
    setKpiItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)));

  // --------------- Pains helpers ---------------
  const addPain = () => setPains((prev) => [...prev, { title: '', description: '' }]);
  const removePain = (i: number) => setPains((prev) => prev.filter((_, idx) => idx !== i));
  const updatePain = (i: number, field: keyof PainItem, val: string) =>
    setPains((prev) => prev.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)));

  // --------------- Features helpers ---------------
  const addFeature = () => setFeatures((prev) => [...prev, { title: '', description: '', icon: '' }]);
  const removeFeature = (i: number) => setFeatures((prev) => prev.filter((_, idx) => idx !== i));
  const updateFeature = (i: number, field: keyof FeatureItem, val: string) =>
    setFeatures((prev) => prev.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)));

  // --------------- Tier helpers ---------------
  const updateTier = (index: number, field: string, value: string | number | boolean | string[]) => {
    setTiers((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  };

  // --------------- Save ---------------
  const handleSave = async () => {
    if (!name) {
      setError('Название обязательно');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const body = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9а-яё\s-]/gi, '').replace(/\s+/g, '-'),
        heroTitle,
        heroSlogan,
        tagline,
        accentColor,
        sortOrder,
        isActive,
        kpiItems,
        pains,
        features,
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

  // --------------- Section header helper ---------------
  const SectionHeader = ({ title, onAdd }: { title: string; onAdd: () => void }) => (
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-sm font-semibold" style={{ color: '#111827' }}>{title}</h4>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        style={{ background: '#eff6ff', color: '#2563eb' }}
      >
        + Добавить
      </button>
    </div>
  );

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
              {/* ==================== Basic fields ==================== */}
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

              {/* ==================== KPI Items ==================== */}
              <div className="border-t pt-5" style={{ borderColor: '#e5e7eb' }}>
                <SectionHeader title="KPI" onAdd={addKpi} />
                {kpiItems.length === 0 && (
                  <p className="text-sm py-3 text-center" style={{ color: '#9ca3af' }}>
                    Нет KPI. Нажмите &laquo;+ Добавить&raquo; чтобы создать.
                  </p>
                )}
                <div className="space-y-3">
                  {kpiItems.map((kpi, i) => (
                    <div key={i} className="relative p-4 rounded-lg border" style={{ borderColor: '#e5e7eb', background: '#f9fafb' }}>
                      <button
                        type="button"
                        onClick={() => removeKpi(i)}
                        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium transition-colors"
                        style={{ background: '#fef2f2', color: '#dc2626' }}
                        title="Удалить"
                      >
                        &times;
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-8">
                        <div>
                          <label className="block text-xs mb-1" style={{ color: '#6b7280' }}>Значение</label>
                          <input
                            value={kpi.value}
                            onChange={(e) => updateKpi(i, 'value', e.target.value)}
                            placeholder="например, 40%"
                            className="w-full px-3 py-2 rounded-lg border text-sm"
                            style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1" style={{ color: '#6b7280' }}>Подпись</label>
                          <input
                            value={kpi.label}
                            onChange={(e) => updateKpi(i, 'label', e.target.value)}
                            placeholder="например, рост выручки"
                            className="w-full px-3 py-2 rounded-lg border text-sm"
                            style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1" style={{ color: '#6b7280' }}>Источник</label>
                          <input
                            value={kpi.source}
                            onChange={(e) => updateKpi(i, 'source', e.target.value)}
                            placeholder="например, McKinsey 2024"
                            className="w-full px-3 py-2 rounded-lg border text-sm"
                            style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ==================== Pains ==================== */}
              <div className="border-t pt-5" style={{ borderColor: '#e5e7eb' }}>
                <SectionHeader title="Проблемы" onAdd={addPain} />
                {pains.length === 0 && (
                  <p className="text-sm py-3 text-center" style={{ color: '#9ca3af' }}>
                    Нет проблем. Нажмите &laquo;+ Добавить&raquo; чтобы создать.
                  </p>
                )}
                <div className="space-y-3">
                  {pains.map((pain, i) => (
                    <div key={i} className="relative p-4 rounded-lg border" style={{ borderColor: '#e5e7eb', background: '#f9fafb' }}>
                      <button
                        type="button"
                        onClick={() => removePain(i)}
                        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium transition-colors"
                        style={{ background: '#fef2f2', color: '#dc2626' }}
                        title="Удалить"
                      >
                        &times;
                      </button>
                      <div className="space-y-3 pr-8">
                        <div>
                          <label className="block text-xs mb-1" style={{ color: '#6b7280' }}>Заголовок</label>
                          <input
                            value={pain.title}
                            onChange={(e) => updatePain(i, 'title', e.target.value)}
                            placeholder="Краткий заголовок проблемы"
                            className="w-full px-3 py-2 rounded-lg border text-sm"
                            style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1" style={{ color: '#6b7280' }}>Описание</label>
                          <textarea
                            value={pain.description}
                            onChange={(e) => updatePain(i, 'description', e.target.value)}
                            rows={2}
                            placeholder="Подробное описание проблемы"
                            className="w-full px-3 py-2 rounded-lg border text-sm"
                            style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ==================== Features ==================== */}
              <div className="border-t pt-5" style={{ borderColor: '#e5e7eb' }}>
                <SectionHeader title="Возможности" onAdd={addFeature} />
                {features.length === 0 && (
                  <p className="text-sm py-3 text-center" style={{ color: '#9ca3af' }}>
                    Нет возможностей. Нажмите &laquo;+ Добавить&raquo; чтобы создать.
                  </p>
                )}
                <div className="space-y-3">
                  {features.map((feat, i) => {
                    const SelectedIcon = feat.icon ? ICON_MAP[feat.icon] : null;
                    return (
                      <div key={i} className="relative p-4 rounded-lg border" style={{ borderColor: '#e5e7eb', background: '#f9fafb' }}>
                        <button
                          type="button"
                          onClick={() => removeFeature(i)}
                          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium transition-colors"
                          style={{ background: '#fef2f2', color: '#dc2626' }}
                          title="Удалить"
                        >
                          &times;
                        </button>
                        <div className="space-y-3 pr-8">
                          <div className="flex items-start gap-3">
                            {/* Icon picker button */}
                            <div className="flex-shrink-0">
                              <label className="block text-xs mb-1" style={{ color: '#6b7280' }}>Иконка</label>
                              <button
                                type="button"
                                onClick={() => setIconPickerIndex(i)}
                                className="w-12 h-12 flex items-center justify-center rounded-lg border transition-colors"
                                style={{
                                  borderColor: feat.icon ? '#2563eb' : '#d1d5db',
                                  background: feat.icon ? '#eff6ff' : '#ffffff',
                                  color: feat.icon ? '#2563eb' : '#9ca3af',
                                }}
                                title={feat.icon || 'Выбрать иконку'}
                              >
                                {SelectedIcon ? <SelectedIcon size={22} /> : <span className="text-lg">+</span>}
                              </button>
                              {feat.icon && (
                                <p className="text-center mt-0.5" style={{ fontSize: '9px', color: '#6b7280' }}>{feat.icon}</p>
                              )}
                            </div>

                            <div className="flex-1 space-y-3">
                              <div>
                                <label className="block text-xs mb-1" style={{ color: '#6b7280' }}>Заголовок</label>
                                <input
                                  value={feat.title}
                                  onChange={(e) => updateFeature(i, 'title', e.target.value)}
                                  placeholder="Название возможности"
                                  className="w-full px-3 py-2 rounded-lg border text-sm"
                                  style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                                />
                              </div>
                              <div>
                                <label className="block text-xs mb-1" style={{ color: '#6b7280' }}>Описание</label>
                                <textarea
                                  value={feat.description}
                                  onChange={(e) => updateFeature(i, 'description', e.target.value)}
                                  rows={2}
                                  placeholder="Описание возможности"
                                  className="w-full px-3 py-2 rounded-lg border text-sm"
                                  style={{ borderColor: '#d1d5db', color: '#111827', background: '#ffffff' }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ==================== Pricing tiers ==================== */}
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

      {/* Icon Picker Modal */}
      {iconPickerIndex !== null && (
        <IconPicker
          value={features[iconPickerIndex]?.icon || ''}
          onChange={(icon) => updateFeature(iconPickerIndex, 'icon', icon)}
          onClose={() => setIconPickerIndex(null)}
        />
      )}
    </div>
  );
}
