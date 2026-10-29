import React, { useState, useEffect } from 'react';
import { TitleBar } from '../components/TitleBar';
import { TopHeader } from '../components/TopHeader';
import { Sidebar } from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';
import {
  Gift,
  Coins,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  Package,
  ArrowRight,
  Flame,
  Search,
  Filter,
  ShoppingBag,
  ExternalLink,
  X,
  AlertCircle,
  Truck,
  Shirt,
  Headphones,
  Laptop,
  BookOpen,
  ShieldCheck,
  Edit3,
  Plus,
  Trash2,
  Power,
  RotateCcw,
  Check,
  Tag,
  Lock,
} from 'lucide-react';

interface Props {
  onNavigateTab: (tab: any) => void;
  onRequestExit: () => void;
}

export interface RewardItem {
  id: string;
  title: string;
  category: 'merch' | 'gadgets' | 'digital' | 'books';
  categoryLabel: string;
  description: string;
  priceCoins: number;
  inStock: number;
  tag?: string;
  iconName: 'shirt' | 'laptop' | 'headphones' | 'package' | 'book' | 'award' | 'sparkles' | 'gift';
  color: string;
  bgGradient: string;
}

const defaultCatalogRewards: RewardItem[] = [
  {
    id: 'rew-1',
    title: 'CodePractice Maxsus Xudisi ("Clean Code")',
    category: 'merch',
    categoryLabel: 'Kiyim & Merch',
    description: 'Yuqori sifatli paxtadan tayyorlangan, CodePractice brendli qulay dasturchi xudisi (S, M, L, XL).',
    priceCoins: 1200,
    inStock: 8,
    tag: 'Ommabop',
    iconName: 'shirt',
    color: 'text-blue-400',
    bgGradient: 'from-blue-600/20 to-indigo-600/10',
  },
  {
    id: 'rew-2',
    title: 'Mexanik Klaviatura (RGB Gamer & Programmer)',
    category: 'gadgets',
    categoryLabel: 'Elektronika',
    description: 'Tez va qulay kod yozish uchun maxsus mexanik tugmachalar va RGB yoritgichli klaviatura.',
    priceCoins: 2500,
    inStock: 3,
    tag: 'Super Sovg‘a',
    iconName: 'laptop',
    color: 'text-purple-400',
    bgGradient: 'from-purple-600/20 to-pink-600/10',
  },
  {
    id: 'rew-3',
    title: 'CodePractice Maxsus Futbolkasi ("Code. Sleep. Repeat")',
    category: 'merch',
    categoryLabel: 'Kiyim & Merch',
    description: '100% paxta, nafas oluvchi va zamonaviy printli dasturchilar futbolkasi.',
    priceCoins: 600,
    inStock: 15,
    tag: 'Zo‘r tanlov',
    iconName: 'shirt',
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-600/20 to-blue-600/10',
  },
  {
    id: 'rew-4',
    title: 'Simsiz Quloqchin (Wireless TWS Earbuds)',
    category: 'gadgets',
    categoryLabel: 'Elektronika',
    description: 'Darslarni shovqinsiz eshitish va kod yozayotganda diqqatni jamlash uchun qulay quloqchin.',
    priceCoins: 1800,
    inStock: 5,
    tag: 'Premium',
    iconName: 'headphones',
    color: 'text-amber-400',
    bgGradient: 'from-amber-600/20 to-orange-600/10',
  },
  {
    id: 'rew-5',
    title: 'Brendli Termos / Suv idishi (Harorat ko‘rsatuvchi)',
    category: 'merch',
    categoryLabel: 'Aksessuarlar',
    description: '500ml sig‘imli, haroratni saqlovchi va sensorli ekranli zamonaviy metall termos.',
    priceCoins: 450,
    inStock: 12,
    tag: 'Foydali',
    iconName: 'package',
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-600/20 to-teal-600/10',
  },
  {
    id: 'rew-6',
    title: 'Python & Algoritmlar bo‘yicha Amaliy Kitob',
    category: 'books',
    categoryLabel: 'Kitoblar',
    description: 'Dasturlash sirlari va Olimpiada masalalarini o‘zbek tilida tushuntiruvchi sara kitob.',
    priceCoins: 500,
    inStock: 10,
    iconName: 'book',
    color: 'text-rose-400',
    bgGradient: 'from-rose-600/20 to-orange-600/10',
  },
  {
    id: 'rew-7',
    title: 'Oltin Profil Nishoni va VIP Ramka (Digital)',
    category: 'digital',
    categoryLabel: 'Raqamli Sovg‘a',
    description: 'CodePractice profilingiz uchun maxsus porlovchi oltin ramka va 1 oylik "A‘lochi Dasturchi" statusi.',
    priceCoins: 300,
    inStock: 999,
    tag: 'Tezkor',
    iconName: 'award',
    color: 'text-amber-400',
    bgGradient: 'from-amber-500/20 to-yellow-500/10',
  },
  {
    id: 'rew-8',
    title: 'CodePractice Dasturchi Stikerlari to‘plami (30 dona)',
    category: 'merch',
    categoryLabel: 'Aksessuarlar',
    description: 'Noutbuk va telefon g‘iloflari uchun suvga chidamli dasturchilar stikerlari to‘plami.',
    priceCoins: 150,
    inStock: 40,
    tag: 'Oson',
    iconName: 'sparkles',
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-500/20 to-cyan-500/10',
  },
];

const renderIcon = (name: string, className: string) => {
  switch (name) {
    case 'shirt':
      return <Shirt className={className} />;
    case 'laptop':
      return <Laptop className={className} />;
    case 'headphones':
      return <Headphones className={className} />;
    case 'package':
      return <Package className={className} />;
    case 'book':
      return <BookOpen className={className} />;
    case 'award':
      return <Award className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    default:
      return <Gift className={className} />;
  }
};

export const RewardsPage: React.FC<Props> = ({ onNavigateTab, onRequestExit }) => {
  const { theme } = useTheme();

  // Student balance
  const [studentCoins, setStudentCoins] = useState<number>(850);
  const [studentXp, setStudentXp] = useState<number>(1240);

  // Active view tab: 'catalog' | 'my_rewards'
  const [activeTab, setActiveTab] = useState<'catalog' | 'my_rewards'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // ===================== ADMIN STATE =====================
  // 1. Admin mode toggle
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminPinInput, setAdminPinInput] = useState<string>('');
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [adminAuthError, setAdminAuthError] = useState<boolean>(false);

  // 2. Store Open/Close state (persisted in localStorage)
  const [isStoreOpen, setIsStoreOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('cp_rewards_store_open');
    return saved !== null ? saved === 'true' : true;
  });

  // 3. Rewards Catalog (persisted in localStorage)
  const [rewards, setRewards] = useState<RewardItem[]>(() => {
    const saved = localStorage.getItem('cp_rewards_catalog');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return defaultCatalogRewards;
  });

  // Save to localStorage whenever catalog changes
  useEffect(() => {
    localStorage.setItem('cp_rewards_catalog', JSON.stringify(rewards));
  }, [rewards]);

  // Save store open/close state
  const handleToggleStore = () => {
    const newState = !isStoreOpen;
    setIsStoreOpen(newState);
    localStorage.setItem('cp_rewards_store_open', String(newState));
  };

  // Reset to default catalog
  const handleResetCatalog = () => {
    if (confirm('Barcha sovg‘alar narxlari va ro‘yxatini standart holatga qaytarishni tasdiqlaysizmi?')) {
      setRewards(defaultCatalogRewards);
      localStorage.setItem('cp_rewards_catalog', JSON.stringify(defaultCatalogRewards));
      setIsStoreOpen(true);
      localStorage.setItem('cp_rewards_store_open', 'true');
    }
  };

  // ===================== EDIT PRICE MODAL =====================
  const [editingReward, setEditingReward] = useState<RewardItem | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<number>(0);
  const [editStockValue, setEditStockValue] = useState<number>(0);
  const [editTagValue, setEditTagValue] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const handleOpenEditModal = (reward: RewardItem) => {
    setEditingReward(reward);
    setEditPriceValue(reward.priceCoins);
    setEditStockValue(reward.inStock);
    setEditTagValue(reward.tag || '');
    setIsEditModalOpen(true);
  };

  const handleSaveEditedReward = () => {
    if (!editingReward) return;
    const newPrice = Math.max(1, Number(editPriceValue) || 1);
    const newStock = Math.max(0, Number(editStockValue) || 0);

    setRewards((prev) =>
      prev.map((item) =>
        item.id === editingReward.id
          ? {
              ...item,
              priceCoins: newPrice,
              inStock: newStock,
              tag: editTagValue.trim() || undefined,
            }
          : item
      )
    );

    setIsEditModalOpen(false);
    setEditingReward(null);
  };

  // Delete reward
  const handleDeleteReward = (id: string, title: string) => {
    if (confirm(`Haqiqatan ham "${title}" sovg‘asini o‘chirmoqchimisiz?`)) {
      setRewards((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // ===================== ADD NEW REWARD MODAL =====================
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'merch' | 'gadgets' | 'digital' | 'books'>('merch');
  const [newPrice, setNewPrice] = useState<number>(500);
  const [newStock, setNewStock] = useState<number>(10);
  const [newTag, setNewTag] = useState('Yangi');
  const [newDesc, setNewDesc] = useState('');

  const handleAddNewReward = () => {
    if (!newTitle.trim()) {
      alert('Iltimos, sovg‘a nomini kiriting!');
      return;
    }

    const catLabels: Record<string, string> = {
      merch: 'Kiyim & Merch',
      gadgets: 'Elektronika & Gadjetlar',
      digital: 'Raqamli Sovg‘a',
      books: 'Kitoblar & Qo‘llanmalar',
    };

    const newId = `rew-${Date.now()}`;
    const newReward: RewardItem = {
      id: newId,
      title: newTitle.trim(),
      category: newCategory,
      categoryLabel: catLabels[newCategory] || 'Sovg‘a',
      description: newDesc.trim() || 'CodePractice maxsus mukofoti',
      priceCoins: Math.max(1, Number(newPrice) || 100),
      inStock: Math.max(1, Number(newStock) || 1),
      tag: newTag.trim() || undefined,
      iconName: newCategory === 'merch' ? 'shirt' : newCategory === 'gadgets' ? 'laptop' : newCategory === 'books' ? 'book' : 'award',
      color: newCategory === 'gadgets' ? 'text-purple-400' : 'text-blue-400',
      bgGradient: 'from-blue-600/20 to-indigo-600/10',
    };

    setRewards((prev) => [newReward, ...prev]);
    setIsAddModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewDesc('');
    setNewPrice(500);
    setNewStock(10);
    setNewTag('Yangi');
  };

  // ===================== STUDENT CLAIM MODAL =====================
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // My claimed rewards history
  const [claimedRewards, setClaimedRewards] = useState<Array<{
    id: string;
    rewardTitle: string;
    costCoins: number;
    claimedDate: string;
    status: 'tayyor' | 'yetkazilmoqda' | 'topshirildi';
    statusLabel: string;
    code: string;
  }>>([
    {
      id: 'claim-1',
      rewardTitle: 'CodePractice Dasturchi Stikerlari to‘plami (20 dona)',
      costCoins: 150,
      claimedDate: '24-Oktabr, 16:30',
      status: 'topshirildi',
      statusLabel: 'Topshirildi',
      code: 'CP-STK-9021',
    },
    {
      id: 'claim-2',
      rewardTitle: 'CodePractice Maxsus Bloknot va Ruchka',
      costCoins: 250,
      claimedDate: '27-Oktabr, 11:20',
      status: 'tayyor',
      statusLabel: 'Olib ketishga tayyor (O‘quv markazi)',
      code: 'CP-NOTE-4412',
    },
  ]);

  const handleOpenClaimModal = (reward: RewardItem) => {
    if (!isStoreOpen) {
      alert("Sovg'alar do'koni vaqtincha yopilgan!");
      return;
    }
    setSelectedReward(reward);
    setClaimSuccess(false);
    setIsClaimModalOpen(true);
  };

  const handleConfirmClaim = () => {
    if (!selectedReward) return;
    if (studentCoins < selectedReward.priceCoins) {
      alert("Tangalaringiz yetarli emas! Masalalarni yechishda davom etib ko'proq tanga to'plang.");
      return;
    }

    setStudentCoins((prev) => prev - selectedReward.priceCoins);

    // Reduce stock
    setRewards((prev) =>
      prev.map((r) =>
        r.id === selectedReward.id ? { ...r, inStock: Math.max(0, r.inStock - 1) } : r
      )
    );

    const newClaim = {
      id: `claim-${Date.now()}`,
      rewardTitle: selectedReward.title,
      costCoins: selectedReward.priceCoins,
      claimedDate: 'Hozirgina',
      status: 'tayyor' as const,
      statusLabel: 'Olib ketishga tayyor (O‘quv markazi)',
      code: `CP-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setClaimedRewards((prev) => [newClaim, ...prev]);
    setClaimSuccess(true);
  };

  // Admin auth check
  const handleAdminAuthSubmit = () => {
    if (adminPinInput.trim() === '4826' || adminPinInput.trim() === 'admin') {
      setIsAdminMode(true);
      setIsAdminAuthModalOpen(false);
      setAdminPinInput('');
      setAdminAuthError(false);
    } else {
      setAdminAuthError(true);
    }
  };

  const filteredRewards = rewards.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className={`h-screen w-screen flex flex-col overflow-hidden font-sans select-none transition-colors duration-200 ${
        theme === 'dark' ? 'mesh-bg-dark text-slate-100' : 'mesh-bg-light text-slate-900'
      }`}
    >
      <TitleBar />
      <TopHeader
        studentName="Aliyev Asliddin"
        grade="9-A sinf"
        breadcrumb="Sovg‘alar va Yutuqlar do‘koni"
        onRequestExit={onRequestExit}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentTab="rewards"
          onNavigate={onNavigateTab}
          onRequestExit={onRequestExit}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Header Banner & Student Balance */}
          <div
            className={`p-6 md:p-8 rounded-3xl border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-purple-950/40 border-blue-500/20 shadow-2xl'
                : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-sm'
            }`}
          >
            {/* Background decorative glow */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-2 relative z-10 max-w-xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>CODEPRACTICE SOVG‘ALAR VA MERCH DO‘KONI</span>
                </span>

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                    isStoreOpen
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isStoreOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                  <span>{isStoreOpen ? 'DO‘KON OCHIQ' : 'DO‘KON VAQTINCHA YOPIQ'}</span>
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                Bilimingiz evaziga qimmatbaho sovg‘alarni qo‘lga kiriting!
              </h1>
              <p className={`text-xs md:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Uy vazifalarini to‘liq bajaring, kunlik seriyani saqlang va to‘plangan tangalaringizni brendli kiyimlar, dasturchilar aksessuarlari va gadjetlarga almashtiring.
              </p>
            </div>

            {/* Right Side: Balances & Admin Mode Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10">
              {/* Tangalar (Coins) */}
              <div
                className={`p-4 rounded-2xl border text-center min-w-[130px] ${
                  theme === 'dark'
                    ? 'bg-[#0A0E1D]/90 border-amber-500/30 shadow-lg shadow-amber-500/10'
                    : 'bg-white border-amber-300 shadow-md'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-bold">
                  <Coins className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>Tangalaringiz</span>
                </div>
                <div className="text-2xl md:text-3xl font-black font-mono text-amber-400 mt-1">
                  {studentCoins}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">CP Coin</div>
              </div>

              {/* XP ballari */}
              <div
                className={`p-4 rounded-2xl border text-center min-w-[130px] ${
                  theme === 'dark'
                    ? 'bg-[#0A0E1D]/90 border-blue-500/30 shadow-lg shadow-blue-500/10'
                    : 'bg-white border-blue-300 shadow-md'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-xs text-blue-400 font-bold">
                  <Award className="w-4 h-4 text-blue-400" />
                  <span>Jami Tajriba</span>
                </div>
                <div className="text-2xl md:text-3xl font-black font-mono text-blue-500 mt-1">
                  {studentXp}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Umumiy XP</div>
              </div>

              {/* Admin Mode Toggle Button */}
              <button
                onClick={() => {
                  if (isAdminMode) {
                    setIsAdminMode(false);
                  } else {
                    setIsAdminAuthModalOpen(true);
                  }
                }}
                className={`h-full min-h-[76px] px-3.5 py-3 rounded-2xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition cursor-pointer ${
                  isAdminMode
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/25'
                    : theme === 'dark'
                    ? 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-300'
                    : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-sm'
                }`}
                title={isAdminMode ? 'Admin rejimidan chiqish' : 'Admin boshqaruv panelini ochish'}
              >
                <ShieldCheck className={`w-5 h-5 ${isAdminMode ? 'text-slate-950' : 'text-amber-400'}`} />
                <span className="text-[11px] whitespace-nowrap">
                  {isAdminMode ? 'Admin: FAOL' : 'Admin Rejimi'}
                </span>
              </button>
            </div>
          </div>

          {/* ===================== ADMIN MANAGEMENT TOOLBAR (Visible in Admin Mode) ===================== */}
          {isAdminMode && (
            <div
              className={`p-5 rounded-3xl border space-y-4 animate-in fade-in duration-200 ${
                theme === 'dark'
                  ? 'bg-amber-950/25 border-amber-500/30 shadow-xl'
                  : 'bg-amber-50/80 border-amber-300 shadow-md'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold tracking-tight flex items-center gap-2">
                      <span>Administrator Sovg‘alar Boshqaruv Paneli</span>
                      <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">
                        ADMIN
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Sovg‘alar do‘konini yopish/ochish, narxlarini (bahosini) almashtirish va yangi sovg‘alar kiritish
                    </p>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* DO'KONNI YOPIB / OCHISH TUGMASI */}
                  <button
                    onClick={handleToggleStore}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md active:scale-95 cursor-pointer ${
                      isStoreOpen
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    <span>{isStoreOpen ? 'Do‘konni yopish (O‘chirish)' : 'Do‘konni ochish (Yoqish)'}</span>
                  </button>

                  {/* YANGI SOVG'A QO'SHISH */}
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 active:scale-95 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yangi sovg‘a qo‘shish</span>
                  </button>

                  {/* RESET CATALOG */}
                  <button
                    onClick={handleResetCatalog}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/10'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-300'
                    }`}
                    title="Barcha narxlarni standart holatga qaytarish"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Asliga qaytarish</span>
                  </button>
                </div>
              </div>

              {/* Admin Info Banner */}
              <div
                className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                  theme === 'dark'
                    ? 'bg-[#0E1528] border-white/10 text-slate-300'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-amber-400 font-bold">Holat:</span>
                  <span>
                    Do‘kon hozirda <strong>{isStoreOpen ? 'barcha o‘quvchilar uchun ochiq va faol' : 'vaqtincha yopilgan (o‘quvchilar buyurtma bera olmaydi)'}</strong>.
                    Har bir sovg‘a kartasidagi <strong className="text-blue-400">"Bahosini o‘zgartirish"</strong> tugmasi orqali narxlarni o‘zgartirishingiz mumkin.
                  </span>
                </div>
                <div className="font-mono text-xs font-bold text-slate-400 whitespace-nowrap">
                  {rewards.length} ta mahsulot
                </div>
              </div>
            </div>
          )}

          {/* STORE CLOSED NOTICE (If store is closed and not admin) */}
          {!isStoreOpen && !isAdminMode && (
            <div className="p-5 rounded-3xl border border-rose-500/30 bg-rose-500/10 text-rose-300 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white">Sovg‘alar do‘koni vaqtincha yopilgan</h3>
                <p className="text-xs text-slate-300">
                  Administrator yangi sovg‘alar va narxlarni yangilamoqda. Tez orada qayta ochiladi. To‘plangan tangalaringiz o‘z joyida saqlanadi!
                </p>
              </div>
            </div>
          )}

          {/* Nav Tabs & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : theme === 'dark'
                    ? 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Gift className="w-4 h-4" />
                <span>Sovg‘alar katalogi</span>
              </button>

              <button
                onClick={() => setActiveTab('my_rewards')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                  activeTab === 'my_rewards'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : theme === 'dark'
                    ? 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Mening sovg‘alarim ({claimedRewards.length})</span>
              </button>
            </div>

            {/* Qidiruv */}
            {activeTab === 'catalog' && (
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Sovg‘a nomini qidiring..."
                  style={{
                    color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                    WebkitTextFillColor: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                  }}
                  className={`w-full h-9 pl-9 pr-4 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition ${
                    theme === 'dark'
                      ? 'bg-[#0A0F1E] border-white/10 placeholder-slate-500'
                      : 'bg-slate-100 border-slate-300 placeholder-slate-400 focus:bg-white'
                  }`}
                />
              </div>
            )}
          </div>

          {/* ======================= CATALOG TAB ======================= */}
          {activeTab === 'catalog' && (
            <div className="space-y-6">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'Barcha sovg‘alar' },
                  { id: 'merch', label: 'Kiyim & Merch' },
                  { id: 'gadgets', label: 'Elektronika & Gadjetlar' },
                  { id: 'books', label: 'Kitoblar & Qo‘llanmalar' },
                  { id: 'digital', label: 'Raqamli imtiyozlar' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                        : theme === 'dark'
                        ? 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Grid of Reward Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredRewards.map((item) => {
                  const canAfford = studentCoins >= item.priceCoins;
                  const progressPct = Math.min(100, Math.round((studentCoins / item.priceCoins) * 100));

                  return (
                    <div
                      key={item.id}
                      className={`p-5 rounded-3xl border flex flex-col justify-between transition-all duration-200 group hover:shadow-2xl hover:-translate-y-1 relative ${
                        theme === 'dark'
                          ? 'glass-card-dark border-white/10 hover:border-blue-500/40'
                          : 'glass-card-light border-slate-200 hover:border-blue-500/50 shadow-sm'
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Top tag and category */}
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                            theme === 'dark' ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                          }`}>
                            {item.categoryLabel}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {item.tag && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                {item.tag}
                              </span>
                            )}

                            {/* Admin Delete Icon */}
                            {isAdminMode && (
                              <button
                                onClick={() => handleDeleteReward(item.id, item.title)}
                                className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/15 transition cursor-pointer"
                                title="Sovg‘ani o‘chirish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Icon / Image preview box */}
                        <div
                          className={`w-full h-36 rounded-2xl bg-gradient-to-br ${item.bgGradient} flex items-center justify-center p-4 border border-white/5 transition-transform group-hover:scale-105 duration-300`}
                        >
                          {renderIcon(item.iconName, `w-16 h-16 ${item.color} drop-shadow-md`)}
                        </div>

                        {/* Details */}
                        <div>
                          <h3 className="text-sm font-extrabold tracking-tight group-hover:text-blue-400 transition">
                            {item.title}
                          </h3>
                          <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Bottom action & price */}
                      <div className="pt-4 mt-3 border-t border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Coins className="w-4 h-4 text-amber-400" />
                            <span className="text-base font-black font-mono text-amber-400">
                              {item.priceCoins}
                            </span>
                            <span className="text-[10px] text-slate-400">tanga</span>
                          </div>

                          <span className="text-[10px] text-slate-400 font-mono">
                            Qoldi: <strong className="text-slate-200 dark:text-slate-100">{item.inStock} ta</strong>
                          </span>
                        </div>

                        {/* Progress toward goal (for students) */}
                        {!isAdminMode && !canAfford && isStoreOpen && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>To‘plandi: {progressPct}%</span>
                              <span>Yana {item.priceCoins - studentCoins} kerak</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* ADMIN BUTTONS */}
                        {isAdminMode ? (
                          <div className="space-y-2 pt-1">
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition active:scale-95 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Bahosini o‘zgartirish</span>
                            </button>
                          </div>
                        ) : (
                          /* STUDENT ACTION BUTTON */
                          <button
                            onClick={() => handleOpenClaimModal(item)}
                            disabled={!isStoreOpen || !canAfford || item.inStock <= 0}
                            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                              !isStoreOpen
                                ? 'bg-slate-800 text-slate-500 border border-white/5'
                                : canAfford
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                                : theme === 'dark'
                                ? 'bg-white/5 text-slate-500 border border-white/5'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {!isStoreOpen ? (
                              <span>Do‘kon yopiq</span>
                            ) : canAfford ? (
                              <>
                                <Gift className="w-3.5 h-3.5" />
                                <span>Sovg‘ani olish</span>
                              </>
                            ) : (
                              <span>Yana tanga kerak</span>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================= MY REWARDS TAB ======================= */}
          {activeTab === 'my_rewards' && (
            <div
              className={`p-6 rounded-3xl border space-y-4 ${
                theme === 'dark' ? 'glass-card-dark border-white/10' : 'glass-card-light border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-extrabold tracking-tight">Buyurtma qilingan sovg‘alar tarixi</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Sovg‘ani o‘quv markazingizdagi o‘qituvchingizdan qabul qilib oling</p>
                </div>
                <div className="text-xs font-mono text-emerald-400 font-bold">
                  Jami: {claimedRewards.length} ta yutuq
                </div>
              </div>

              <div className="divide-y divide-white/5 space-y-3">
                {claimedRewards.map((cl) => (
                  <div key={cl.id} className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                        <Gift className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold">{cl.rewardTitle}</h4>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                          <span className="font-mono text-amber-400 font-bold">{cl.costCoins} tanga</span>
                          <span>•</span>
                          <span>{cl.claimedDate}</span>
                          <span>•</span>
                          <span className="font-mono font-bold text-blue-400">Kodi: {cl.code}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                          cl.status === 'topshirildi'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {cl.statusLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===================== ADMIN AUTH PIN MODAL ===================== */}
      {isAdminAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 text-center animate-in fade-in zoom-in-95 duration-200 border ${
              theme === 'dark'
                ? 'glass-card-dark border-white/10 text-white'
                : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold">Admin Boshqaruvi</h3>
              <p className="text-xs text-slate-400 mt-1">
                Sovg‘alar narxi va do‘kon holatini boshqarish uchun o‘qituvchi/admin parolini kiriting
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="password"
                autoFocus
                value={adminPinInput}
                onChange={(e) => {
                  setAdminPinInput(e.target.value);
                  setAdminAuthError(false);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminAuthSubmit()}
                placeholder="Parolni kiriting (4826)"
                style={{
                  color: theme === 'dark' ? '#FFFFFF' : '#0F172A',
                  WebkitTextFillColor: theme === 'dark' ? '#FFFFFF' : '#0F172A',
                }}
                className={`w-full h-11 px-4 text-center font-mono text-base font-bold rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition ${
                  theme === 'dark'
                    ? 'bg-[#0E1528] border-white/10 placeholder-slate-500'
                    : 'bg-slate-100 border-slate-300 placeholder-slate-400'
                }`}
              />

              <div className="text-[11px] text-slate-400 font-mono">
                Standart parol: <strong className="text-amber-400">4826</strong>
              </div>

              {adminAuthError && (
                <p className="text-xs text-rose-500 font-medium">Noto‘g‘ri parol! (Parol: 4826)</p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleAdminAuthSubmit}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
              >
                Kirish
              </button>
              <button
                onClick={() => {
                  setIsAdminAuthModalOpen(false);
                  setAdminPinInput('');
                  setAdminAuthError(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white font-semibold text-xs transition cursor-pointer"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== EDIT REWARD PRICE MODAL ===================== */}
      {isEditModalOpen && editingReward && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 border ${
              theme === 'dark'
                ? 'glass-card-dark border-white/10 text-white'
                : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base">Sovg‘a bahosini tahrirlash</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Sovg‘a nomi:</label>
                <input
                  type="text"
                  disabled
                  value={editingReward.title}
                  className="w-full h-9 px-3 rounded-xl border border-white/10 bg-white/5 text-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-amber-400 block mb-1 font-bold flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    <span>Yangi bahosi (tanga):</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editPriceValue}
                    onChange={(e) => setEditPriceValue(Number(e.target.value))}
                    style={{
                      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                      WebkitTextFillColor: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                    }}
                    className={`w-full h-10 px-3 rounded-xl font-mono text-base font-black border focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${
                      theme === 'dark' ? 'bg-[#0E1528] border-amber-500/40 text-amber-400' : 'bg-slate-100 border-amber-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Ombordagi soni (ta):</label>
                  <input
                    type="number"
                    min="0"
                    value={editStockValue}
                    onChange={(e) => setEditStockValue(Number(e.target.value))}
                    style={{
                      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                      WebkitTextFillColor: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                    }}
                    className={`w-full h-10 px-3 rounded-xl font-mono text-base font-bold border focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                      theme === 'dark' ? 'bg-[#0E1528] border-white/15' : 'bg-slate-100 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Maxsus yorliq (Badge):</label>
                <input
                  type="text"
                  placeholder="Masalan: Ommabop, Chegirma -30%, Yangi"
                  value={editTagValue}
                  onChange={(e) => setEditTagValue(e.target.value)}
                  style={{
                    color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                    WebkitTextFillColor: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                  }}
                  className={`w-full h-9 px-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    theme === 'dark' ? 'bg-[#0E1528] border-white/10' : 'bg-slate-100 border-slate-300'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <button
                onClick={handleSaveEditedReward}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
              >
                Bahoni Saqlash
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white font-semibold text-xs transition cursor-pointer"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== ADD NEW REWARD MODAL ===================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 border ${
              theme === 'dark'
                ? 'glass-card-dark border-white/10 text-white'
                : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <h3 className="font-extrabold text-base">Yangi sovg‘a qo‘shish</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Sovg‘a nomi *:</label>
                <input
                  type="text"
                  placeholder="Masalan: Dasturchi ryukzaki, Smart soat..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                    WebkitTextFillColor: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                  }}
                  className={`w-full h-9 px-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    theme === 'dark' ? 'bg-[#0E1528] border-white/10' : 'bg-slate-100 border-slate-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Toifasi:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className={`w-full h-9 px-3 rounded-xl border focus:outline-none ${
                      theme === 'dark' ? 'bg-[#0E1528] border-white/10 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="merch">Kiyim & Merch</option>
                    <option value="gadgets">Elektronika & Gadjet</option>
                    <option value="books">Kitoblar</option>
                    <option value="digital">Raqamli Sovg‘a</option>
                  </select>
                </div>

                <div>
                  <label className="text-amber-400 block mb-1 font-bold">Narxi (tangada) *:</label>
                  <input
                    type="number"
                    min="1"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    style={{
                      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                      WebkitTextFillColor: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                    }}
                    className={`w-full h-9 px-3 rounded-xl font-mono font-bold border focus:outline-none ${
                      theme === 'dark' ? 'bg-[#0E1528] border-amber-500/40 text-amber-400' : 'bg-slate-100 border-amber-400'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Ombordagi soni:</label>
                  <input
                    type="number"
                    min="1"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    style={{
                      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                      WebkitTextFillColor: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                    }}
                    className={`w-full h-9 px-3 rounded-xl font-mono border focus:outline-none ${
                      theme === 'dark' ? 'bg-[#0E1528] border-white/10' : 'bg-slate-100 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Yorliq (Tag):</label>
                  <input
                    type="text"
                    placeholder="Masalan: Yangi, Top"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    style={{
                      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                      WebkitTextFillColor: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                    }}
                    className={`w-full h-9 px-3 rounded-xl border focus:outline-none ${
                      theme === 'dark' ? 'bg-[#0E1528] border-white/10' : 'bg-slate-100 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Qisqacha tavsifi:</label>
                <textarea
                  rows={2}
                  placeholder="Sovg‘a haqida qisqacha ma’lumot..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{
                    color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                    WebkitTextFillColor: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                  }}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none resize-none ${
                    theme === 'dark' ? 'bg-[#0E1528] border-white/10' : 'bg-slate-100 border-slate-300'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <button
                onClick={handleAddNewReward}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Qo‘shish
              </button>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white font-semibold text-xs transition cursor-pointer"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== CLAIM CONFIRMATION MODAL (Student) ===================== */}
      {isClaimModalOpen && selectedReward && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 border transition-all ${
              theme === 'dark'
                ? 'glass-card-dark border-white/10 glow-blue text-white'
                : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
            }`}
          >
            {!claimSuccess ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider font-mono">
                    <Gift className="w-4 h-4" />
                    <span>Sovg‘ani tasdiqlash</span>
                  </div>
                  <button
                    onClick={() => setIsClaimModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center space-y-2 py-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
                    <Coins className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black">{selectedReward.title}</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Ushbu sovg‘ani olish uchun hisobingizdan <strong className="text-amber-400">{selectedReward.priceCoins} tanga</strong> yechiladi.
                  </p>
                </div>

                <div className={`p-3 rounded-2xl border text-xs space-y-2 ${
                  theme === 'dark' ? 'bg-[#0A0E1D] border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Joriy balansingiz:</span>
                    <span className="font-mono font-bold text-amber-400">{studentCoins} tanga</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Sovg‘a narxi:</span>
                    <span className="font-mono font-bold text-rose-400">-{selectedReward.priceCoins} tanga</span>
                  </div>
                  <div className="pt-1.5 border-t border-white/10 flex items-center justify-between font-bold">
                    <span>Qoladigan balans:</span>
                    <span className="font-mono text-emerald-400">{studentCoins - selectedReward.priceCoins} tanga</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleConfirmClaim}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition cursor-pointer"
                  >
                    Tasdiqlayman va Olaman
                  </button>
                  <button
                    onClick={() => setIsClaimModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 font-semibold text-xs text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-emerald-400">Tabriklaymiz! Sovg‘a buyurtma qilindi!</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Sizning buyurtmangiz muvaffaqiyatli qabul qilindi. Tez orada o‘qituvchingiz yoki administrator sovg‘angizni taqdim etadi.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsClaimModalOpen(false);
                      setActiveTab('my_rewards');
                    }}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    Mening sovg‘alarim bo‘limiga o‘tish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
