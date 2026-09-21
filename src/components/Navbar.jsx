import React from 'react';
import { Recycle, MapPin, ShoppingBag, User, Wallet, Bell, Search } from 'lucide-react';

export default function Navbar({ setActiveTab, activeTab, saldo }) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="bg-emerald-600 p-2.5 rounded-2xl shadow-md shadow-emerald-600/20">
              <Recycle className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-gray-900">REVALUE</span>
              <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-widest">Digital Waste Bank</p>
            </div>
          </div>

          {/* Menu Navigasi Tengah */}
          <div className="hidden md:flex items-center space-x-1 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('dropoff')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'dropoff' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Drop-Off Map
            </button>
            <button 
              onClick={() => setActiveTab('setor')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'setor' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Pilah & Setor
            </button>
            <button 
              onClick={() => setActiveTab('marketplace')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'marketplace' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Kompos Store
            </button>
          </div>

          {/* Sisi Kanan: Saldo & Profil */}
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl flex items-center space-x-3">
              <div className="bg-emerald-600 p-1.5 rounded-xl text-white">
                <Wallet className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-emerald-600 leading-none">Saldo Dompet</p>
                <span className="text-xs font-bold text-gray-900">Rp {saldo ? saldo.toLocaleString('id-ID') : '0'}</span>
              </div>
            </div>

            <div className="relative cursor-pointer bg-gray-50 border border-gray-100 p-2.5 rounded-2xl hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-emerald-600 rounded-full"></span>
            </div>

            <div className="flex items-center space-x-3 pl-2 border-l border-gray-100">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-emerald-600/20">
                CP
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}