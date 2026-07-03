import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CreditCard, Wallet, PiggyBank, Send, Smartphone, ShieldCheck,
  TrendingUp, Clock, MapPin, ArrowRight, Lock, BadgePercent, Briefcase,
  ChevronLeft, ChevronRight, X
} from 'lucide-react'
import PublicHeader from '../components/layout/PublicHeader.jsx'
import PublicFooter from '../components/layout/PublicFooter.jsx'
import { postPublicPedirInfo } from '../services/cuentasService.js'

const SLIDES = [
  {
    tag: 'Ahorro Digital',
    title: 'Cuenta de Ahorros Andina',
    desc: 'La cuenta de ahorros que te deposita intereses reales todos los días de manera simple.',
    badgeTitle: 'TREA de Ahorro',
    badgeValue: '4.50% Soles',
    ctaText: 'Conoce más',
    bgImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200',
  },
  {
    tag: 'Financiamiento',
    title: 'Préstamo Personal BN',
    desc: 'Dinero al instante con aprobación 100% en línea y plazos a tu medida sin colas.',
    badgeTitle: 'TCEA Preferencial',
    badgeValue: 'Desde 12.5%',
    ctaText: 'Solicitar ahora',
    bgImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200',
  },
  {
    tag: 'Inversión Segura',
    title: 'Crece seguro con Plazo Fijo',
    desc: 'La mejor rentabilidad garantizada del mercado para hacer crecer tus ahorros con tranquilidad.',
    badgeTitle: 'Tasa Efectiva Anual',
    badgeValue: 'Hasta 6.25%',
    ctaText: 'Simular depósito',
    bgImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1200',
  },
  {
    tag: 'Exclusividad',
    title: 'Nueva Tarjeta de Crédito Andina',
    desc: 'Acumula puntos en todas tus compras y viaja cómodo con accesos a salas VIP de aeropuertos.',
    badgeTitle: 'Membresía Anual',
    badgeValue: 'Cero Costo',
    ctaText: 'Pedir tarjeta',
    bgImage: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&q=80&w=1200',
  }
]

const PRODUCTOS = [
  { icon: PiggyBank, titulo: 'Cuenta de Ahorros', desc: 'Maneja tu dinero sin costo de mantenimiento y gana intereses todos los días.' },
  { icon: Wallet, titulo: 'Cuenta Sueldo', desc: 'Recibe tu sueldo, retira sin comisiones y accede a beneficios exclusivos.' },
  { icon: TrendingUp, titulo: 'Crédito de Consumo', desc: 'El efectivo que necesitas con tasas preferenciales y cuotas a tu medida.' },
  { icon: Briefcase, titulo: 'Crédito Microempresa', desc: 'Impulsa tu negocio con financiamiento ágil pensado para emprendedores.' },
  { icon: Send, titulo: 'Transferencias', desc: 'Mueve tu dinero entre tus cuentas al instante, las 24 horas del día.' },
  { icon: CreditCard, titulo: 'Tarjeta de Débito', desc: 'Paga y compra en todo el país, en tiendas y por internet, con total seguridad.' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [infoModalOpen, setInfoModalOpen] = useState(false)
  const [infoForm, setInfoForm] = useState({ nombre: '', email: '', telefono: '', producto: 'Cuenta de Ahorros', mensaje: '' })
  const [submittingInfo, setSubmittingInfo] = useState(false)
  const [infoSuccess, setInfoSuccess] = useState(false)
  const [infoError, setInfoError] = useState(null)

  const openInfoModal = (prodTitle) => {
    setInfoForm({ nombre: '', email: '', telefono: '', producto: prodTitle || 'Cuenta de Ahorros', mensaje: '' })
    setInfoSuccess(false)
    setInfoError(null)
    setInfoModalOpen(true)
  }

  const handleInfoSubmit = async (e) => {
    e.preventDefault()
    setSubmittingInfo(true)
    setInfoError(null)
    try {
      await postPublicPedirInfo(infoForm)
      setInfoSuccess(true)
      setTimeout(() => {
        setInfoModalOpen(false)
      }, 2500)
    } catch (err) {
      setInfoError(err?.response?.data?.detail || 'Ocurrió un error al registrar la solicitud.')
    } finally {
      setSubmittingInfo(false)
    }
  }

  const setInfoField = (k) => (e) => setInfoForm((f) => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="lp-page">
      <PublicHeader />

      {/* ===== RED CURVED HERO SECTION ===== */}
      <section className="bn-hero-curved">
        <div className="bn-hero-red-bg">
          <div className="bn-hero-red-bg-content">
            <span style={{
              display: 'inline-block',
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '16px'
            }}>
              {SLIDES[currentSlide].tag}
            </span>
            <h1 className="bn-hero-title">{SLIDES[currentSlide].title}</h1>
            <p className="bn-hero-subtitle">{SLIDES[currentSlide].desc}</p>
            <button className="bn-hero-btn-white" onClick={() => openInfoModal(SLIDES[currentSlide].title)}>
              {SLIDES[currentSlide].ctaText}
            </button>
          </div>
        </div>

        {/* Slide indicators bottom-left */}
        <div className="bn-hero-indicators">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              className={`bn-hero-indicator ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="bn-hero-image-side">
          <img src={SLIDES[currentSlide].bgImage} alt={SLIDES[currentSlide].title} />
        </div>
      </section>

      {/* ===== PRODUCTOS PENSADOS EN TI ===== */}
      <section className="bn-products-section">
        <h2 className="bn-products-title">Productos pensados en ti</h2>
        <div className="bn-products-grid">
          {PRODUCTOS.map((prod, idx) => {
            const Icon = prod.icon
            return (
              <div key={idx} className="bn-product-card" onClick={() => openInfoModal(prod.titulo)}>
                <div className="bn-product-icon-wrap">
                  <Icon size={26} />
                </div>
                <h4>{prod.titulo}</h4>
                <p>{prod.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ===== RECOMENDACIONES DE SEGURIDAD ===== */}
      <section className="lp-section" style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800', margin: '0 0 10px' }}>Tu Seguridad es Nuestra Prioridad</h2>
          <p style={{ color: '#6b7280', margin: 0 }}>El Banco nunca te solicitará claves, números de tarjeta o datos personales por correo, SMS o llamada.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0a2e5c' }}>
              <ShieldCheck size={20} />
              Banca Segura
            </h3>
            <p style={{ fontSize: '13.5px', color: '#6b7280', margin: 0, lineSelf: 'stretch', lineHeight: '1.5' }}>
              Realiza tus operaciones desde computadoras personales o celulares propios. Evita cabinas públicas de internet.
            </p>
          </div>
 
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0a2e5c' }}>
              <Smartphone size={20} />
              Banca Móvil
            </h3>
            <p style={{ fontSize: '13.5px', color: '#6b7280', margin: 0, lineSelf: 'stretch', lineHeight: '1.5' }}>
              Utiliza siempre nuestra aplicación oficial descargada únicamente desde App Store o Google Play.
            </p>
          </div>
 
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0a2e5c' }}>
              <Lock size={20} />
              Claves Secretas
            </h3>
            <p style={{ fontSize: '13.5px', color: '#6b7280', margin: 0, lineSelf: 'stretch', lineHeight: '1.5' }}>
              Cambia tus claves de internet periódicamente y no utilices fechas de nacimiento o números fáciles de adivinar.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FLOATING WHATSAPP CHAT ASSISTANT ===== */}
      <div className="bn-whatsapp-widget" onClick={() => openInfoModal('Contacto Asesor WhatsApp')}>
        <div className="bn-whatsapp-bubble">
          <div className="bn-whatsapp-avatar-wrap">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" 
              alt="Asistente Virtual" 
              className="bn-whatsapp-avatar" 
            />
            <span className="bn-whatsapp-status-dot"></span>
          </div>
          <div className="bn-whatsapp-text">
            <span className="bn-whatsapp-name">Asistente Virtual</span>
            <span className="bn-whatsapp-subtitle">En línea ahora</span>
          </div>
        </div>
        <div className="bn-whatsapp-icon-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.054L2 22l5.106-1.341a9.9 9.9 0 004.901 1.298h.005c5.507 0 9.99-4.474 9.991-9.985A9.99 9.99 0 0012.012 2zm5.795 14.243c-.276.773-1.606 1.405-2.196 1.493-.538.08-1.247.146-3.612-.832-3.023-1.251-4.936-4.321-5.086-4.522-.15-.2-.149-.534.092-.919.24-.384.53-.478.706-.576.176-.098.24-.136.353-.27.112-.135.156-.258.077-.417-.078-.16-.706-1.698-.968-2.327-.255-.615-.515-.532-.706-.541-.18-.009-.387-.01-.593-.01-.207 0-.543.078-.826.385-.283.308-1.082 1.057-1.082 2.578s1.1 2.99 1.25 3.195c.15.205 2.164 3.305 5.241 4.632.732.316 1.303.504 1.748.646.736.234 1.408.201 1.94.122.593-.088 1.822-.746 2.08-1.43.256-.684.256-1.27.18-1.393-.077-.123-.284-.197-.594-.352z"/>
          </svg>
        </div>
      </div>

      {/* Modal Pedir Información */}
      {infoModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
          display: 'grid', placeItems: 'center', zIndex: 9999, padding: 20
        }}>
          <div style={{
            background: '#ffffff', borderRadius: 16, width: '100%', maxWidth: 480,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden', border: '1px solid #e2e8f0', animation: 'fadeIn 0.2s ease-out'
          }}>
            {/* Header del Modal */}
            <div style={{
              background: 'var(--hb-grad)', color: '#ffffff', padding: '20px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Solicitar Información</h3>
                <span style={{ fontSize: 12, opacity: 0.9 }}>Déjanos tus datos y un asesor te contactará</span>
              </div>
              <button 
                onClick={() => setInfoModalOpen(false)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#ffffff', borderRadius: '50%', width: 32, height: 32, display: 'grid', placeItems: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Cuerpo del Modal */}
            <div style={{ padding: 24 }}>
              {infoSuccess ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#e6f4ea', color: '#137333', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
                    <ShieldCheck size={32} />
                  </div>
                  <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#137333' }}>¡Solicitud Recibida!</h4>
                  <p style={{ margin: 0, fontSize: 13.5, color: '#475569', lineHeight: 1.5 }}>
                    Hemos registrado tus datos correctamente. Un asesor financiero del Banco GNB se comunicará contigo a la brevedad.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {infoError && (
                    <div style={{ backgroundColor: '#fdeaea', border: '1px solid #f5c2c2', color: '#bd0e20', padding: '10px 12px', borderRadius: 8, fontSize: 13 }}>
                      {infoError}
                    </div>
                  )}

                  <div className="hb-field" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: '#475569' }}>Nombre Completo</label>
                    <input 
                      type="text" required className="hb-input" placeholder="Ej. Juan Pérez"
                      value={infoForm.nombre} onChange={setInfoField('nombre')} 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="hb-field" style={{ marginBottom: 0 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: '#475569' }}>Correo Electrónico</label>
                      <input 
                        type="email" required className="hb-input" placeholder="juan@correo.com"
                        value={infoForm.email} onChange={setInfoField('email')} 
                      />
                    </div>
                    <div className="hb-field" style={{ marginBottom: 0 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: '#475569' }}>Celular / Teléfono</label>
                      <input 
                        type="tel" required className="hb-input" placeholder="999888777"
                        value={infoForm.telefono} onChange={setInfoField('telefono')} 
                      />
                    </div>
                  </div>

                  <div className="hb-field" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: '#475569' }}>Producto de Interés</label>
                    <select 
                      className="hb-select" value={infoForm.producto} onChange={setInfoField('producto')}
                    >
                      <option value="Cuenta de Ahorros">Cuenta de Ahorros GNB</option>
                      <option value="Cuenta Sueldo">Cuenta Sueldo</option>
                      <option value="Crédito de Consumo">Crédito de Consumo</option>
                      <option value="Crédito Microempresa">Crédito Microempresa</option>
                      <option value="Depósito Plazo Fijo">Depósito a Plazo Fijo</option>
                      <option value="Tarjeta de Crédito">Tarjeta de Crédito GNB</option>
                    </select>
                  </div>

                  <div className="hb-field" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: '#475569' }}>Mensaje o Consulta (Opcional)</label>
                    <textarea 
                      className="hb-input" style={{ minHeight: 60, resize: 'vertical', padding: '8px 12px' }} placeholder="¿Tienes alguna duda en particular?"
                      value={infoForm.mensaje} onChange={setInfoField('mensaje')} 
                    />
                  </div>

                  <button 
                    type="submit" disabled={submittingInfo}
                    className="bbva-btn"
                    style={{ marginTop: 8, padding: '12px', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}
                  >
                    {submittingInfo ? 'Enviando...' : 'Enviar Solicitud'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <PublicFooter />
    </div>
  )
}
