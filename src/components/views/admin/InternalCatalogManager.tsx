import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { InternalProduct } from '../../../types';
import { INITIAL_INTERNAL_PRODUCTS } from '../../../lib/data/internalProducts';
import {
  Shield,
  Cpu,
  Lock,
  Phone,
  Layers,
  Search,
  Plus,
  Tag,
  CheckCircle2,
  AlertTriangle,
  X,
  SlidersHorizontal,
  Package
} from 'lucide-react';

interface InternalCatalogManagerProps {
  locale: string;
}

export function InternalCatalogManager({ locale }: InternalCatalogManagerProps) {
  const [products, setProducts] = useState<InternalProduct[]>(() => {
    try {
      const saved = localStorage.getItem('sbs_internal_products');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_INTERNAL_PRODUCTS;
  });

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: 'Hikvision',
    model: '',
    category: 'cctv',
    subcategory: 'Caméras IP',
    internalPurchasePrice: 200,
    internalSellingPrice: 280,
    stockStatus: 'En stock (Tunis)',
    spec1Key: 'Résolution',
    spec1Val: '4 MP 2K',
    spec2Key: 'Vision nocturne',
    spec2Val: 'ColorVu 30m',
  });

  const categories = [
    { id: 'ALL', labelFr: 'Tous les équipements', labelAr: 'كافة المعدات' },
    { id: 'cctv', labelFr: 'Vidéosurveillance (CCTV)', labelAr: 'كاميرات المراقبة' },
    { id: 'alarm', labelFr: 'Systèmes d\'Alarme', labelAr: 'أنظمة الإنذار' },
    { id: 'access_control', labelFr: 'Contrôle d\'Accès & Pointage', labelAr: 'التحكم في الدخول' },
    { id: 'intercom', labelFr: 'Interphonie & Visiophonie', labelAr: 'الإنتركوم المرئي' },
    { id: 'networking', labelFr: 'Réseaux & Câblage', labelAr: 'الشبكات والتمديدات' },
  ];

  const filteredProducts = products.filter((p) => {
    if (!p) return false;
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const s = (search || '').toLowerCase().trim();
    if (!s) return matchesCategory;

    const matchesSearch =
      String(p.name || '').toLowerCase().includes(s) ||
      String(p.model || '').toLowerCase().includes(s) ||
      String(p.brand || '').toLowerCase().includes(s) ||
      String(p.subcategory || '').toLowerCase().includes(s);
    return matchesCategory && matchesSearch;
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.model) return;

    const created: InternalProduct = {
      id: `prod-custom-${Date.now()}`,
      name: newProduct.name,
      brand: newProduct.brand,
      model: newProduct.model,
      category: newProduct.category,
      subcategory: newProduct.subcategory,
      technicalSpecifications: {
        [newProduct.spec1Key]: newProduct.spec1Val,
        [newProduct.spec2Key]: newProduct.spec2Val,
      },
      internalPurchasePrice: Number(newProduct.internalPurchasePrice),
      internalSellingPrice: Number(newProduct.internalSellingPrice),
      availability: 'IN_STOCK',
      stockStatus: newProduct.stockStatus,
      active: true,
      lifecycleStatus: 'ACTIVE',
      serviceTags: [newProduct.category],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [created, ...products];
    setProducts(updated);
    try {
      localStorage.setItem('sbs_internal_products', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setShowAddModal(false);
    setNewProduct({
      name: '',
      brand: 'Hikvision',
      model: '',
      category: 'cctv',
      subcategory: 'Caméras IP',
      internalPurchasePrice: 200,
      internalSellingPrice: 280,
      stockStatus: 'En stock (Tunis)',
      spec1Key: 'Résolution',
      spec1Val: '4 MP 2K',
      spec2Key: 'Vision nocturne',
      spec2Val: 'ColorVu 30m',
    });
  };

  return (
    <div className="space-y-6">
      {/* Notice regarding internal restriction */}
      <div className="p-4 rounded-xl bg-[#101318] border border-[#232934] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#E11D2A]/10 border border-[#E11D2A]/30 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-[#E11D2A]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">
              {locale === 'ar' ? 'كتالوج المعدات الداخلي المشفر (طاقم العمل فقط)' : 'Catalogue Équipements Interne (Strictement Confidentiel)'}
            </h3>
            <p className="text-xs text-[#9CA3AF]">
              {locale === 'ar'
                ? 'لا يتم عرض هذه المنتجات أو الأسعار للعموم. تُستخدم حصرياً لإعداد عروض الأسعار والدراسات الفنية.'
                : 'Conformément à la règle de discrétion SBS VISION, ces références et tarifs d\'achat/vente sont réservés aux techniciens et ingénieurs d\'affaires.'}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shrink-0"
        >
          {locale === 'ar' ? 'إضافة جهاز جديد' : 'Ajouter un équipement'}
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={locale === 'ar' ? 'بحث بالاسم، الموديل أو الماركة...' : 'Recherche modèle, marque, sous-catégorie...'}
            className="w-full pl-9 pr-4 py-2 bg-[#101318] border border-[#232934] rounded-lg text-xs sm:text-sm text-[#FFFFFF] placeholder-[#6B7280] focus:border-[#E11D2A] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors border ${
                selectedCategory === cat.id
                  ? 'bg-[#E11D2A] text-white border-[#E11D2A]'
                  : 'bg-[#101318] text-[#9CA3AF] border-[#232934] hover:text-[#FFFFFF]'
              }`}
            >
              {locale === 'ar' ? cat.labelAr : cat.labelFr}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((prod) => {
          const margin = (prod.internalSellingPrice || 0) - (prod.internalPurchasePrice || 0);
          return (
            <Card key={prod.id} hoverable className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#08090C] text-[#9CA3AF] border border-[#232934]">
                    {prod.subcategory || prod.category}
                  </span>
                  <Badge variant="neutral" className="text-[10px]">
                    {prod.stockStatus || 'En stock'}
                  </Badge>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-[#E11D2A] uppercase">
                    {prod.brand} • {prod.model}
                  </div>
                  <h4 className="text-sm font-bold text-[#FFFFFF] mt-0.5 leading-snug">
                    {prod.name}
                  </h4>
                </div>

                {prod.technicalSpecifications && (
                  <div className="space-y-1 pt-1">
                    {Object.entries(prod.technicalSpecifications).slice(0, 3).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between text-[11px] border-b border-[#232934]/40 py-1">
                        <span className="text-[#9CA3AF]">{k}</span>
                        <span className="font-semibold text-[#FFFFFF] text-right truncate max-w-[60%]">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pricing breakdown for staff */}
              <div className="pt-3 border-t border-[#232934] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#9CA3AF] block">
                    {locale === 'ar' ? 'سعر الشراء (HT)' : 'Prix d\'achat HT'}
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#9CA3AF]">
                    {prod.internalPurchasePrice} TND
                  </span>
                </div>

                <div className="text-center">
                  <span className="text-[10px] text-emerald-400 block">
                    {locale === 'ar' ? 'الهامش' : 'Marge brute'}
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    +{margin} TND
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#E11D2A] block font-semibold">
                    {locale === 'ar' ? 'سعر البيع المقترح' : 'Prix Devis HT'}
                  </span>
                  <span className="font-mono text-sm font-extrabold text-[#FFFFFF]">
                    {prod.internalSellingPrice} TND
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-[#101318] border border-[#232934] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto">
            <div className="flex items-center justify-between border-b border-[#232934] pb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#E11D2A]" />
                <h3 className="text-lg font-bold text-[#FFFFFF]">
                  {locale === 'ar' ? 'إضافة جهاز جديد للكتالوج الداخلي' : 'Ajouter une référence au catalogue interne'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg bg-[#08090C] border border-[#232934] text-[#9CA3AF] hover:text-[#FFFFFF]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#FFFFFF]">Marque *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full bg-[#08090C] border border-[#232934] rounded-lg p-2.5 text-[#FFFFFF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#FFFFFF]">Modèle / Réf *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: DS-2CD2143G2-I"
                    value={newProduct.model}
                    onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
                    className="w-full bg-[#08090C] border border-[#232934] rounded-lg p-2.5 text-[#FFFFFF]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#FFFFFF]">Désignation complète du produit *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Caméra Dôme IP 4MP Anti-Vandale IK10"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-[#08090C] border border-[#232934] rounded-lg p-2.5 text-[#FFFFFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#FFFFFF]">Catégorie</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-[#08090C] border border-[#232934] rounded-lg p-2.5 text-[#FFFFFF]"
                  >
                    <option value="cctv">Vidéosurveillance (CCTV)</option>
                    <option value="alarm">Alarme Intrusion</option>
                    <option value="access_control">Contrôle d'Accès</option>
                    <option value="intercom">Interphonie</option>
                    <option value="networking">Réseau & Câblage</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#FFFFFF]">Disponibilité Stock</label>
                  <input
                    type="text"
                    value={newProduct.stockStatus}
                    onChange={(e) => setNewProduct({ ...newProduct, stockStatus: e.target.value })}
                    className="w-full bg-[#08090C] border border-[#232934] rounded-lg p-2.5 text-[#FFFFFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#FFFFFF]">Prix d'achat HT (TND)</label>
                  <input
                    type="number"
                    value={newProduct.internalPurchasePrice}
                    onChange={(e) => setNewProduct({ ...newProduct, internalPurchasePrice: Number(e.target.value) })}
                    className="w-full bg-[#08090C] border border-[#232934] rounded-lg p-2.5 text-[#FFFFFF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#FFFFFF]">Prix de vente Devis HT (TND)</label>
                  <input
                    type="number"
                    value={newProduct.internalSellingPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, internalSellingPrice: Number(e.target.value) })}
                    className="w-full bg-[#08090C] border border-[#232934] rounded-lg p-2.5 text-[#FFFFFF]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#232934]">
                <Button variant="secondary" size="sm" type="button" onClick={() => setShowAddModal(false)}>
                  Annuler
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Enregistrer l'équipement
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
