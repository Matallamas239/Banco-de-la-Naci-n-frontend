import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Lock, ChevronDown, Menu, X } from 'lucide-react'
import Logo from '../ui/Logo.jsx'

export default function PublicHeader() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header style={{ width: '100%' }} className="gnb-public-header">
      {/* 1. Barra Superior Gris */}
      <div className="bn-header-gray">
        <div className="bn-header-gray-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', height: '100%' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🇵🇪 República del Perú
            </span>
            <div className="bn-nav-tabs-gray">
              <a href="#" className="bn-nav-tab-gray active" onClick={(e) => e.preventDefault()}>Clientes</a>
              <a href="#" className="bn-nav-tab-gray" onClick={(e) => e.preventDefault()}>Ciudadanos</a>
              <a href="#" className="bn-nav-tab-gray" onClick={(e) => e.preventDefault()}>Entidades del Gobierno</a>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a href="#" className="bn-utility-link" style={{ fontSize: '12px', fontWeight: '600', color: '#4b5563' }} onClick={(e) => e.preventDefault()}>
              Portal de Transparencia
            </a>
          </div>
        </div>
      </div>

      {/* 2. Barra Principal Blanca */}
      <div className="bn-header-white">
        <div className="bn-header-white-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <button className="lp-brand" onClick={() => navigate('/')} style={{ background: 'none', border: 'none', padding: 0 }}>
              <Logo size={42} variant="dark" />
            </button>

            {/* Desktop Navigation Links */}
            <div className="bn-menu-links" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div className="bn-menu-link-dropdown" onClick={() => navigate('/login')}>
                <span>Productos y Servicios</span>
                <ChevronDown size={14} />
              </div>
              <div className="bn-menu-link-dropdown" onClick={() => navigate('/login')}>
                <span>Canales Digitales</span>
                <ChevronDown size={14} />
              </div>
              <div className="bn-menu-link-dropdown" onClick={() => navigate('/login')}>
                <span>BN Beneficios</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4b5563', cursor: 'pointer', marginRight: '10px' }} onClick={() => navigate('/login')}>
              <Search size={18} />
              <span className="hidden md:inline" style={{ fontSize: '14px', fontWeight: '600' }}>Buscar</span>
            </div>

            {/* Págalo.pe Button */}
            <button className="bn-btn-pagalo" onClick={() => navigate('/login')}>
              págalo.pe
            </button>

            {/* Banca por Internet Button */}
            <button className="bn-btn-red" onClick={() => navigate('/login')}>
              <Lock size={14} />
              Banca por Internet
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
