import React, { useState, useEffect } from 'react';
import { Gift, CheckCircle, Clock, AlertCircle, ShoppingBag, Edit2, Plus, Sparkles, Check, X } from 'lucide-react';

interface RewardItem {
  id: string;
  name: string;
  category: string;
  price: number;
  icon: string;
  inStock: boolean;
  stockCount: number;
}

interface OrderItem {
  id: string;
  studentName: string;
  groupName: string;
  rewardName: string;
  points: number;
  orderedAt: string;
  status: 'pending' | 'delivered';
}

const DEFAULT_REWARDS: RewardItem[] = [
  { id: '1', name: 'IT-stikerlar to‘plami', category: 'Aksessuarlar', price: 50, icon: '🎨', inStock: true, stockCount: 45 },
  { id: '2', name: 'Dasturchi bloknoti va ruchka', category: 'Kantselyariya', price: 80, icon: '📓', inStock: true, stockCount: 30 },
  { id: '3', name: 'Dasturchi krujkasi (Mug)', category: 'Idish-tovoq', price: 120, icon: '☕', inStock: true, stockCount: 15 },
  { id: '4', name: 'CodePractice futbolkasi', category: 'Kiyim', price: 250, icon: '👕', inStock: true, stockCount: 8 },
  { id: '5', name: 'CodePractice xudisi (Tolstovka)', category: 'Kiyim', price: 400, icon: '🧥', inStock: true, stockCount: 4 },
  { id: '6', name: 'Simsiz sichqoncha (Wireless Mouse)', category: 'Texnika', price: 500, icon: '🖱️', inStock: true, stockCount: 5 },
];

const INITIAL_ORDERS: OrderItem[] = [
  { id: 'ord-1', studentName: 'Aliyev Jasur', groupName: 'Guruh-101', rewardName: 'CodePractice futbolkasi', points: 250, orderedAt: '29.10.2026 14:30', status: 'pending' },
  { id: 'ord-2', studentName: 'Karimova Malika', groupName: 'Guruh-101', rewardName: 'IT-stikerlar to‘plami', points: 50, orderedAt: '28.10.2026 18:15', status: 'delivered' },
  { id: 'ord-3', studentName: 'Saidov Bobur', groupName: 'Guruh-102', rewardName: 'Dasturchi krujkasi (Mug)', points: 120, orderedAt: '29.10.2026 16:45', status: 'pending' },
  { id: 'ord-4', studentName: 'Rustamova Nodira', groupName: 'Guruh-102', rewardName: 'Dasturchi bloknoti va ruchka', points: 80, orderedAt: '27.10.2026 11:20', status: 'delivered' },
];

export const RewardsPage: React.FC = () => {
  const [rewards, setRewards] = useState<RewardItem[]>(() => {
    try {
      const saved = localStorage.getItem('cp_web_rewards');
      return saved ? JSON.parse(saved) : DEFAULT_REWARDS;
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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Aksessuarlar');
  const [newPrice, setNewPrice] = useState(100);
  const [newIcon, setNewIcon] = useState('🎁');

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

  const handleStartEdit = (r: RewardItem) => {
    setEditingId(r.id);
    setEditPrice(r.price);
  };

  const handleSavePrice = (id: string) => {
    setRewards(rewards.map((r) => (r.id === id ? { ...r, price: editPrice } : r)));
    setEditingId(null);
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

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const item: RewardItem = {
      id: String(Date.now()),
      name: newName.trim(),
      category: newCategory,
      price: Number(newPrice) || 50,
      icon: newIcon || '🎁',
      inStock: true,
      stockCount: 10,
    };
    setRewards([...rewards, item]);
    setShowAddModal(false);
    setNewName('');
    setNewPrice(100);
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Store Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Gift className="w-7 h-7 text-amber-500" />
            Sovg‘alar va ballar do‘koni boshqaruvi
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            O‘quvchilar yechgan masalalar evaziga oladigan sovg‘alar narxlari va buyurtmalar holati
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
            onClick={() => setShowAddModal(true)}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Yangi sovg‘a
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 text-2xl">
            🎁
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Mavjud sovg‘alar turlari</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{rewards.length} ta</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Kutilayotgan buyurtmalar</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">
              {orders.filter((o) => o.status === 'pending').length} ta
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Topshirilgan sovg‘alar</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">
              {orders.filter((o) => o.status === 'delivered').length} ta
            </p>
          </div>
        </div>
      </div>

      {/* Rewards Grid with Editable Prices */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-900 text-lg">Sovg‘alar ro‘yxati va ballar narxi</h3>
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Narxni o‘zgartirish uchun qalam belgisini bosing
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl p-2 bg-white rounded-xl shadow-xs border border-slate-100">
                  {r.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{r.name}</h4>
                  <span className="text-xs text-slate-500">{r.category}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                {editingId === r.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-20 h-8 px-2 border border-blue-500 rounded text-xs font-bold text-slate-900"
                    />
                    <button
                      onClick={() => handleSavePrice(r.id)}
                      className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-amber-600 font-extrabold text-base flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> {r.price} ball
                    </span>
                    <button
                      onClick={() => handleStartEdit(r)}
                      title="Narxni o‘zgartirish"
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <span className="text-xs text-slate-500">Qoldiq: {r.stockCount} dona</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">O‘quvchilarning sovg‘a so‘rovlari</h3>
            <p className="text-xs text-slate-500 mt-0.5">Topshiriqlardan yig‘ilgan ballar evaziga beriladigan sovg‘alar</p>
          </div>
          <span className="text-xs text-slate-400">Jami: {orders.length} ta buyurtma</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="px-6 py-3 font-medium">O‘quvchi</th>
                <th className="px-6 py-3 font-medium">Guruh</th>
                <th className="px-6 py-3 font-medium">Tanlangan sovg‘a</th>
                <th className="px-6 py-3 font-medium">Yechilgan ball</th>
                <th className="px-6 py-3 font-medium">Buyurtma vaqti</th>
                <th className="px-6 py-3 font-medium">Holat</th>
                <th className="px-6 py-3 font-medium text-right">Amal</th>
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        o.status === 'delivered'
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
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

      {/* Modal: Add Reward */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Yangi sovg‘a qo‘shish</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddReward} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sovg‘a nomi</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Masalan: Termos krujka"
                  className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Turkum</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-10 px-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="Aksessuarlar">Aksessuarlar</option>
                    <option value="Kiyim">Kiyim</option>
                    <option value="Kantselyariya">Kantselyariya</option>
                    <option value="Texnika">Texnika</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Emoji / Belgi</label>
                  <input
                    type="text"
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Narxi (ball)</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-10 px-4 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs"
                >
                  Qo‘shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
