import React, { useState, useEffect, useRef } from 'react';
import {
  Gift,
  CheckCircle,
  Clock,
  AlertCircle,
  ShoppingBag,
  Edit2,
  Plus,
  Sparkles,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Minus,
  Smile,
  Package,
  Layers,
  ArrowUpDown,
} from 'lucide-react';

export interface RewardItem {
  id: string;
  name: string;
  category: string;
  price: number;
  icon?: string;
  imageUrl?: string;
  visualType: 'image' | 'emoji';
  totalStock: number; // Jami nechta bor (umumiy keltirilgan)
  stockCount: number; // Qanchasi qoldi (hozirgi zaxira)
  inStock: boolean;
}

export interface OrderItem {
  id: string;
  studentName: string;
  groupName: string;
  rewardName: string;
  points: number;
  orderedAt: string;
  status: 'pending' | 'delivered';
}

const DEFAULT_REWARDS: RewardItem[] = [
  {
    id: '1',
    name: 'IT-stikerlar to‘plami',
    category: 'Aksessuarlar',
    price: 50,
    icon: '🎨',
    visualType: 'emoji',
    totalStock: 50,
    stockCount: 45,
    inStock: true,
  },
  {
    id: '2',
    name: 'Dasturchi bloknoti va ruchka',
    category: 'Kantselyariya',
    price: 80,
    icon: '📓',
    visualType: 'emoji',
    totalStock: 40,
    stockCount: 30,
    inStock: true,
  },
  {
    id: '3',
    name: 'Dasturchi krujkasi (Mug)',
    category: 'Idish-tovoq',
    price: 120,
    icon: '☕',
    visualType: 'emoji',
    totalStock: 25,
    stockCount: 15,
    inStock: true,
  },
  {
    id: '4',
    name: 'CodePractice futbolkasi',
    category: 'Kiyim',
    price: 250,
    icon: '👕',
    visualType: 'emoji',
    totalStock: 15,
    stockCount: 8,
    inStock: true,
  },
  {
    id: '5',
    name: 'CodePractice xudisi (Tolstovka)',
    category: 'Kiyim',
    price: 400,
    icon: '🧥',
    visualType: 'emoji',
    totalStock: 10,
    stockCount: 4,
    inStock: true,
  },
  {
    id: '6',
    name: 'Simsiz sichqoncha (Wireless Mouse)',
    category: 'Texnika',
    price: 500,
    icon: '🖱️',
    visualType: 'emoji',
    totalStock: 8,
    stockCount: 5,
    inStock: true,
  },
];

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ord-1',
    studentName: 'Aliyev Jasur',
    groupName: 'Guruh-101',
    rewardName: 'CodePractice futbolkasi',
    points: 250,
    orderedAt: '29.10.2026 14:30',
    status: 'pending',
  },
  {
    id: 'ord-2',
    studentName: 'Karimova Malika',
    groupName: 'Guruh-101',
    rewardName: 'IT-stikerlar to‘plami',
    points: 50,
    orderedAt: '28.10.2026 18:15',
    status: 'delivered',
  },
  {
    id: 'ord-3',
    studentName: 'Saidov Bobur',
    groupName: 'Guruh-102',
    rewardName: 'Dasturchi krujkasi (Mug)',
    points: 120,
    orderedAt: '29.10.2026 16:45',
    status: 'pending',
  },
  {
    id: 'ord-4',
    studentName: 'Rustamova Nodira',
    groupName: 'Guruh-102',
    rewardName: 'Dasturchi bloknoti va ruchka',
    points: 80,
    orderedAt: '27.10.2026 11:20',
    status: 'delivered',
  },
];

const POPULAR_EMOJIS = [
  '🎁', '👕', '🧥', '☕', '🖱️', '🎧', '🎒', '📓', '🎨', '🎮',
  '⌨️', '💻', '📱', '🏆', '🎖️', '🥇', '📦', '💡', '🔋', '🧢'
];

export const RewardsPage: React.FC = () => {
  const [rewards, setRewards] = useState<RewardItem[]>(() => {
    try {
      const saved = localStorage.getItem('cp_web_rewards');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all items have totalStock and stockCount
        return parsed.map((item: any) => ({
          ...item,
          totalStock: item.totalStock ?? (item.stockCount ? item.stockCount + 5 : 10),
          stockCount: item.stockCount ?? 10,
          visualType: item.visualType || (item.imageUrl ? 'image' : 'emoji'),
        }));
      }
      return DEFAULT_REWARDS;
    } catch {
      return DEFAULT_REWARDS;
    }
  });

  const [orders, setOrders] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('cp_web_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [isStoreOpen, setIsStoreOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('cp_store_open');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStockCount, setEditStockCount] = useState<number>(0);
  const [editTotalStock, setEditTotalStock] = useState<number>(0);

  // Modal State (Add or Edit)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [showModal, setShowModal] = useState(false);
  const [targetRewardId, setTargetRewardId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Aksessuarlar');
  const [formPrice, setFormPrice] = useState(100);
  const [formTotalStock, setFormTotalStock] = useState(10);
  const [formStockCount, setFormStockCount] = useState(10);
  const [formVisualType, setFormVisualType] = useState<'image' | 'emoji'>('image');
  const [formIcon, setFormIcon] = useState('🎁');
  const [formImageUrl, setFormImageUrl] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('cp_web_rewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('cp_web_orders', JSON.stringify(orders));
  }, [orders]);

  const toggleStore = () => {
    const next = !isStoreOpen;
    setIsStoreOpen(next);
    localStorage.setItem('cp_store_open', JSON.stringify(next));
  };

  // Quick Inline Edit (Price + Stock)
  const handleStartInlineEdit = (r: RewardItem) => {
    setEditingId(r.id);
    setEditPrice(r.price);
    setEditStockCount(r.stockCount);
    setEditTotalStock(r.totalStock);
  };

  const handleSaveInlineEdit = (id: string) => {
    setRewards(
      rewards.map((r) => {
        if (r.id === id) {
          const newStock = Math.max(0, editStockCount);
          const newTotal = Math.max(newStock, editTotalStock);
          return {
            ...r,
            price: Math.max(1, editPrice),
            stockCount: newStock,
            totalStock: newTotal,
            inStock: newStock > 0,
          };
        }
        return r;
      })
    );
    setEditingId(null);
  };

  // Quick increment/decrement stock buttons
  const handleQuickAdjustStock = (id: string, delta: number) => {
    setRewards(
      rewards.map((r) => {
        if (r.id === id) {
          const nextStock = Math.max(0, r.stockCount + delta);
          const nextTotal = delta > 0 && nextStock > r.totalStock ? nextStock : r.totalStock;
          return {
            ...r,
            stockCount: nextStock,
            totalStock: nextTotal,
            inStock: nextStock > 0,
          };
        }
        return r;
      })
    );
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    setTargetRewardId(null);
    setFormName('');
    setFormCategory('Aksessuarlar');
    setFormPrice(100);
    setFormTotalStock(10);
    setFormStockCount(10);
    setFormVisualType('image');
    setFormIcon('🎁');
    setFormImageUrl('');
    setShowModal(true);
  };

  // Open Full Edit Modal
  const handleOpenEditModal = (r: RewardItem) => {
    setModalMode('edit');
    setTargetRewardId(r.id);
    setFormName(r.name);
    setFormCategory(r.category);
    setFormPrice(r.price);
    setFormTotalStock(r.totalStock);
    setFormStockCount(r.stockCount);
    setFormVisualType(r.imageUrl ? 'image' : r.visualType || 'emoji');
    setFormIcon(r.icon || '🎁');
    setFormImageUrl(r.imageUrl || '');
    setShowModal(true);
  };

  // Delete Reward
  const handleDeleteReward = (id: string) => {
    if (window.confirm('Haqiqatan ham bu sovg‘ani o‘chirmoqchimisiz?')) {
      setRewards(rewards.filter((r) => r.id !== id));
    }
  };

  // Image Upload handler with auto-resize via Canvas
  const handleImageUpload = (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 320;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const optimized = canvas.toDataURL('image/jpeg', 0.85);
        setFormImageUrl(optimized);
        setFormVisualType('image');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Save Modal Form
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const total = Math.max(1, Number(formTotalStock) || 1);
    const remaining = Math.min(total, Math.max(0, Number(formStockCount) ?? total));

    if (modalMode === 'add') {
      const newItem: RewardItem = {
        id: String(Date.now()),
        name: formName.trim(),
        category: formCategory,
        price: Number(formPrice) || 50,
        visualType: formVisualType,
        icon: formVisualType === 'emoji' ? formIcon || '🎁' : undefined,
        imageUrl: formVisualType === 'image' && formImageUrl ? formImageUrl : undefined,
        totalStock: total,
        stockCount: remaining,
        inStock: remaining > 0,
      };
      setRewards([newItem, ...rewards]);
    } else if (modalMode === 'edit' && targetRewardId) {
      setRewards(
        rewards.map((r) => {
          if (r.id === targetRewardId) {
            return {
              ...r,
              name: formName.trim(),
              category: formCategory,
              price: Number(formPrice) || 50,
              visualType: formVisualType,
              icon: formVisualType === 'emoji' ? formIcon || '🎁' : undefined,
              imageUrl: formVisualType === 'image' && formImageUrl ? formImageUrl : undefined,
              totalStock: total,
              stockCount: remaining,
              inStock: remaining > 0,
            };
          }
          return r;
        })
      );
    }

    setShowModal(false);
  };

  const handleToggleDelivered = (orderId: string) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId
          ? { ...o, status: o.status === 'delivered' ? 'pending' : 'delivered' }
          : o
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Store Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Gift className="w-7 h-7 text-amber-500" />
            Sovg‘alar va ballar do‘koni boshqaruvi
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Sovg‘alar rasmi, zaxirasi (qanchasi bor va qanchasi qoldi), narxi va buyurtmalarni nazorat qilish
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleStore}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition shadow-sm ${
              isStoreOpen
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Do‘kon holati: {isStoreOpen ? 'OCHIQ' : 'YOPIQ'}
          </button>

          <button
            onClick={handleOpenAddModal}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Yangi sovg‘a qo‘shish
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 text-2xl">
            🎁
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sovg‘a turlari</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{rewards.length} ta</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Qolgan umumiy zaxira</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">
              {rewards.reduce((acc, curr) => acc + curr.stockCount, 0)} dona
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Kutilayotgan so‘rovlar</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">
              {orders.filter((o) => o.status === 'pending').length} ta
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Topshirilgan sovg‘alar</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">
              {orders.filter((o) => o.status === 'delivered').length} ta
            </p>
          </div>
        </div>
      </div>

      {/* Rewards Grid with Image / Emoji, Stock & Price Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Mavjud sovg‘alar va zaxira holati</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Har bir kartada rasm, narx, jami keltirilgan va qolgan sonini bevosita o‘zgartirishingiz mumkin
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 self-start sm:self-auto">
            <Edit2 className="w-3.5 h-3.5 text-blue-600" />
            Qalam yoki [-] [+] orqali tezkor tahrirlash
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rewards.map((r) => {
            const isEditing = editingId === r.id;
            const givenCount = Math.max(0, r.totalStock - r.stockCount);
            const stockPercent = r.totalStock > 0 ? Math.round((r.stockCount / r.totalStock) * 100) : 0;

            return (
              <div
                key={r.id}
                className={`p-5 rounded-2xl border transition flex flex-col justify-between ${
                  r.stockCount === 0
                    ? 'border-red-200 bg-red-50/20'
                    : 'border-slate-200 hover:border-blue-400 bg-white hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top: Image/Emoji + Info + Actions */}
                  <div className="flex items-start gap-4">
                    {/* Visual: Image or Emoji */}
                    <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
                      {r.imageUrl ? (
                        <img
                          src={r.imageUrl}
                          alt={r.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl select-none">{r.icon || '🎁'}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                          {r.name}
                        </h4>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleOpenEditModal(r)}
                            title="To‘liq tahrirlash (rasm, nom, narx)"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteReward(r.id)}
                            title="O‘chirish"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <span className="inline-block mt-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {r.category}
                      </span>
                    </div>
                  </div>

                  {/* Stock Information: Qanchasi bor, qanchasi qoldi */}
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Zaxira holati:</span>
                      {r.stockCount > 0 ? (
                        <span className="font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded text-[11px]">
                          {r.stockCount} dona qoldi
                        </span>
                      ) : (
                        <span className="font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded text-[11px]">
                          Tugagan (0 qoldi)
                        </span>
                      )}
                    </div>

                    {/* Visual Stock Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all rounded-full ${
                          stockPercent > 50
                            ? 'bg-emerald-500'
                            : stockPercent > 20
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, stockPercent))}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>Jami keltirilgan: <strong className="text-slate-700">{r.totalStock}</strong> dona</span>
                      <span>Topshirilgan: <strong className="text-slate-700">{givenCount}</strong> dona</span>
                    </div>
                  </div>
                </div>

                {/* Bottom: Price & Quick Stock Adjuster */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {isEditing ? (
                    /* Inline Edit Mode */
                    <div className="w-full space-y-2 bg-blue-50/60 p-2.5 rounded-xl border border-blue-200">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600">Narxi (ball)</label>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-full h-7 px-1.5 border border-slate-300 rounded text-xs font-bold bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600">Qoldi</label>
                          <input
                            type="number"
                            value={editStockCount}
                            onChange={(e) => setEditStockCount(Number(e.target.value))}
                            className="w-full h-7 px-1.5 border border-slate-300 rounded text-xs font-bold bg-white text-emerald-700"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600">Jami</label>
                          <input
                            type="number"
                            value={editTotalStock}
                            onChange={(e) => setEditTotalStock(Number(e.target.value))}
                            className="w-full h-7 px-1.5 border border-slate-300 rounded text-xs font-bold bg-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-1.5 pt-1">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs font-medium hover:bg-slate-300"
                        >
                          Bekor qilish
                        </button>
                        <button
                          onClick={() => handleSaveInlineEdit(r.id)}
                          className="px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-3 h-3" /> Saqlash
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-600 font-extrabold text-base flex items-center gap-1">
                          <Sparkles className="w-4 h-4" /> {r.price} ball
                        </span>
                        <button
                          onClick={() => handleStartInlineEdit(r)}
                          title="Narx va qoldiq sonini tahrirlash"
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quick Adjust Buttons (+ / - stock) */}
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                        <button
                          onClick={() => handleQuickAdjustStock(r.id, -1)}
                          disabled={r.stockCount <= 0}
                          title="Qoldiqni 1 taga kamaytirish (topshirildi)"
                          className="w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs disabled:opacity-40 shadow-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-1.5 text-xs font-bold text-slate-700 select-none">
                          {r.stockCount}
                        </span>
                        <button
                          onClick={() => handleQuickAdjustStock(r.id, 1)}
                          title="Qoldiqni 1 taga oshirish"
                          className="w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shadow-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">O‘quvchilarning sovg‘a so‘rovlari</h3>
            <p className="text-xs text-slate-500 mt-0.5">Topshiriqlardan yig‘ilgan ballar evaziga beriladigan sovg‘alar</p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Jami: {orders.length} ta buyurtma
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">O‘quvchi</th>
                <th className="px-6 py-3 font-semibold">Guruh</th>
                <th className="px-6 py-3 font-semibold">Tanlangan sovg‘a</th>
                <th className="px-6 py-3 font-semibold">Yechilgan ball</th>
                <th className="px-6 py-3 font-semibold">Buyurtma vaqti</th>
                <th className="px-6 py-3 font-semibold">Holat</th>
                <th className="px-6 py-3 font-semibold text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3.5 font-medium text-slate-900">{o.studentName}</td>
                  <td className="px-6 py-3.5 text-slate-600">{o.groupName}</td>
                  <td className="px-6 py-3.5 font-medium text-slate-800">{o.rewardName}</td>
                  <td className="px-6 py-3.5 text-amber-600 font-bold">{o.points} ball</td>
                  <td className="px-6 py-3.5 text-slate-500 text-xs">{o.orderedAt}</td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        o.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {o.status === 'delivered' ? 'Topshirildi' : 'Kutilmoqda'}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => handleToggleDelivered(o.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
                        o.status === 'delivered'
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {o.status === 'delivered' ? 'Qaytarish' : 'Topshirildi deb belgilash'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add or Edit Reward (With Image Upload / Emoji Tabs, Stock Count) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">
                {modalMode === 'add' ? 'Yangi sovg‘a qo‘shish' : 'Sovg‘ani tahrirlash'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Visual Chooser: Image Upload or Emoji */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Sovg‘a ko‘rinishi (Rasm yuklash yoki Emoji):
                </label>

                {/* Tabs */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-3">
                  <button
                    type="button"
                    onClick={() => setFormVisualType('image')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      formVisualType === 'image'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    Rasm yuklash
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormVisualType('emoji')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      formVisualType === 'emoji'
                        ? 'bg-white text-amber-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Smile className="w-4 h-4 text-amber-500" />
                    Emoji tanlash
                  </button>
                </div>

                {/* Image Upload Area */}
                {formVisualType === 'image' ? (
                  <div className="p-4 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl bg-slate-50 text-center transition">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      className="hidden"
                    />

                    {formImageUrl ? (
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={formImageUrl}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-xl border border-slate-200 shadow-sm"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold"
                          >
                            Rasmni almashtirish
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormImageUrl('')}
                            className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold"
                          >
                            O‘chirish
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer py-4 flex flex-col items-center justify-center text-slate-500 hover:text-blue-600"
                      >
                        <Upload className="w-8 h-8 mb-2 stroke-1 text-slate-400" />
                        <span className="text-xs font-semibold">Kompyuterdan rasm tanlash</span>
                        <span className="text-[11px] text-slate-400 mt-1">PNG, JPG, SVG, WebP (avtomatik moslashtiriladi)</span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Emoji Picker Area */
                  <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                        {formIcon || '🎁'}
                      </span>
                      <div className="flex-1">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Tanlangan emoji / belgi:
                        </label>
                        <input
                          type="text"
                          value={formIcon}
                          onChange={(e) => setFormIcon(e.target.value)}
                          placeholder="🎁"
                          className="w-full h-9 px-3 border border-slate-300 rounded-lg text-sm bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Tezkor emojilar:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setFormIcon(emoji)}
                            className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition border ${
                              formIcon === emoji
                                ? 'bg-amber-100 border-amber-400 shadow-xs'
                                : 'bg-white border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sovg'a nomi */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sovg‘a nomi</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Masalan: Termos krujka yoki CodePractice kepkasi"
                  className="w-full h-10 px-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Turkum va Narxi */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Turkum</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-300 rounded-xl text-sm bg-white"
                  >
                    <option value="Aksessuarlar">Aksessuarlar</option>
                    <option value="Kiyim">Kiyim</option>
                    <option value="Kantselyariya">Kantselyariya</option>
                    <option value="Texnika">Texnika</option>
                    <option value="Idish-tovoq">Idish-tovoq</option>
                    <option value="Kitoblar">Kitoblar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Narxi (ball)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-300 rounded-xl text-sm font-semibold text-amber-700"
                  />
                </div>
              </div>

              {/* Zaxira: Jami qancha bor va qanchasi qoldi */}
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
                <p className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-blue-600" />
                  Zaxira miqdori (Soni):
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Jami qancha keltirilgan:
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formTotalStock}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormTotalStock(val);
                        if (modalMode === 'add') setFormStockCount(val);
                      }}
                      className="w-full h-9 px-3 border border-slate-300 rounded-lg text-sm bg-white"
                      placeholder="Masalan: 20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Hozir qancha qoldi (qoldiq):
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formStockCount}
                      onChange={(e) => setFormStockCount(Number(e.target.value))}
                      className="w-full h-9 px-3 border border-slate-300 rounded-lg text-sm font-bold text-emerald-700 bg-white"
                      placeholder="Masalan: 15"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  * Agar sovg‘a yangi keltirilayotgan bo‘lsa, jami va qolgan soni bir xil bo‘ladi.
                </p>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-10 px-4 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/20"
                >
                  {modalMode === 'add' ? 'Qo‘shish' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
