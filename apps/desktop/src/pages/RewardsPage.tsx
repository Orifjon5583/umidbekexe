import React, { useState } from 'react';
import { TitleBar } from '../components/TitleBar';
import { TopHeader } from '../components/TopHeader';
import { Sidebar, DesktopNavTab } from '../components/Sidebar';
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
} from 'lucide-react';

interface Props {
  onNavigateTab: (tab: any) => void;
  onRequestExit: () => void;
}

interface RewardItem {
  id: string;
  title: string;
  category: 'merch' | 'gadgets' | 'digital' | 'books';
  categoryLabel: string;
  description: string;
  priceCoins: number;
  inStock: number;
  tag?: string;
  icon: any;
  color: string;
  bgGradient: string;
}

export const RewardsPage: React.FC<Props> = ({ onNavigateTab, onRequestExit }) => {
  const { theme } = useTheme();

  // Student balance
  const [studentCoins, setStudentCoins] = useState<number>(850);
  const [studentXp, setStudentXp] = useState<number>(1240);

  // Active view tab: 'catalog' | 'my_rewards'
  const [activeTab, setActiveTab] = useState<'catalog' | 'my_rewards'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected reward for claim modal
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

  const catalogRewards: RewardItem[] = [
    {
      id: 'rew-1',
      title: 'CodePractice Maxsus Xudisi ("Clean Code")',
      category: 'merch',
      categoryLabel: 'Kiyim & Merch',
      description: 'Yuqori sifatli paxtadan tayyorlangan, CodePractice brendli qulay dasturchi xudisi (S, M, L, XL).',
      priceCoins: 1200,
      inStock: 8,
      tag: 'Ommabop',
      icon: Shirt,
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
      icon: Laptop,
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
      icon: Shirt,
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
      icon: Headphones,
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
      icon: Package,
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
      icon: BookOpen,
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
      icon: Award,
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
      icon: Sparkles,
      color: 'text-emerald-400',
      bgGradient: 'from-emerald-500/20 to-cyan-500/10',
    },
  ];

  const filteredRewards = catalogRewards.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenClaimModal = (reward: RewardItem) => {
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

    // Deduct coins
    setStudentCoins((prev) => prev - selectedReward.priceCoins);

    // Add to claimed rewards
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CODEPRACTICE SOVG‘ALAR VA MERCH DO‘KONI</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                Bilimingiz evaziga qimmatbaho sovg‘alarni qo‘lga kiriting!
              </h1>
              <p className={`text-xs md:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Uy vazifalarini to‘liq bajaring, kunlik seriyani saqlang va to‘plangan tangalaringizni brendli kiyimlar, dasturchilar aksessuarlari va gadjetlarga almashtiring.
              </p>
            </div>

            {/* Balance cards */}
            <div className="flex items-center gap-3 relative z-10">
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
            </div>
          </div>

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
                  const Icon = item.icon;
                  const canAfford = studentCoins >= item.priceCoins;
                  const progressPct = Math.min(100, Math.round((studentCoins / item.priceCoins) * 100));

                  return (
                    <div
                      key={item.id}
                      className={`p-5 rounded-3xl border flex flex-col justify-between transition-all duration-200 group hover:shadow-2xl hover:-translate-y-1 ${
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

                          {item.tag && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                              {item.tag}
                            </span>
                          )}
                        </div>

                        {/* Icon / Image preview box */}
                        <div
                          className={`w-full h-36 rounded-2xl bg-gradient-to-br ${item.bgGradient} flex items-center justify-center p-4 border border-white/5 transition-transform group-hover:scale-105 duration-300`}
                        >
                          <Icon className={`w-16 h-16 ${item.color} drop-shadow-md`} />
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

                        {/* Progress toward goal */}
                        {!canAfford && (
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

                        {/* Action Button */}
                        <button
                          onClick={() => handleOpenClaimModal(item)}
                          disabled={!canAfford || item.inStock <= 0}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                            canAfford
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                              : theme === 'dark'
                              ? 'bg-white/5 text-slate-500 border border-white/5'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {canAfford ? (
                            <>
                              <Gift className="w-3.5 h-3.5" />
                              <span>Sovg‘ani olish</span>
                            </>
                          ) : (
                            <span>Yana tanga kerak</span>
                          )}
                        </button>
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

      {/* ===================== CLAIM CONFIRMATION MODAL ===================== */}
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
