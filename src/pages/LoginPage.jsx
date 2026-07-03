import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Lock, ArrowLeft } from 'lucide-react'
import { useHBAuth } from '../hooks/useHBAuth.js'
import { extractError } from '../utils/format.js'
import Alert from '../components/ui/Alert.jsx'

const CAPTCHAS = ['DQUCV', 'RT89A', 'XP43Z', 'LK90Q', 'BN76X']

export default function LoginPage() {
  const { login, isAuthenticated } = useHBAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Número de tarjeta / usuario
  const [tarjeta, setTarjeta] = useState(location.state?.tarjeta || '')
  const [dni, setDni] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  
  // Estados para simular MultiRed
  const [numbers, setNumbers] = useState([])
  const [captchaText, setCaptchaText] = useState('DQUCV')
  const [captchaInput, setCaptchaInput] = useState('')
  const [tipoDocumento, setTipoDocumento] = useState('DNI')
  const [tipoTarjeta, setTipoTarjeta] = useState('Multired Global Débito')

  // Generar números aleatorios para el teclado virtual al cargar
  useEffect(() => {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    arr.sort(() => Math.random() - 0.5)
    setNumbers(arr)
  }, [])

  // Si ya hay sesión, va directo a la banca.
  useEffect(() => {
    if (isAuthenticated) navigate('/inicio', { replace: true })
  }, [isAuthenticated, navigate])

  const isAdmin = tarjeta.trim().toLowerCase() === 'admin'

  const handleKeyClick = (num) => {
    if (password.length < 15) {
      setPassword(prev => prev + num)
    }
  }

  const handleClear = () => {
    setPassword('')
  }

  const refreshCaptcha = () => {
    const random = CAPTCHAS[Math.floor(Math.random() * CAPTCHAS.length)]
    setCaptchaText(random)
    setCaptchaInput('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validar captcha
    if (captchaInput.trim().toUpperCase() !== captchaText) {
      setError('El texto de la imagen ingresado no es correcto.')
      return
    }

    // El DNI se valida en el front solo para clientes normales.
    if (!isAdmin && !/^\d{8}$/.test(dni.trim())) {
      setError('Ingresa un DNI válido de 8 dígitos.')
      return
    }

    setLoading(true)
    try {
      await login(tarjeta.trim(), password)
      navigate('/inicio', { replace: true })
    } catch (err) {
      setError(extractError(err, 'No se pudo iniciar sesión.'))
      // Refrescar teclado y captcha tras error
      const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      arr.sort(() => Math.random() - 0.5)
      setNumbers(arr)
      refreshCaptcha()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#eef0f2', display: 'flex', flexDirection: 'column', fontFamily: '"Outfit", "Inter", "Segoe UI", sans-serif' }}>
      
      {/* 1. HEADER DE MULTIRED VIRTUAL */}
      <header style={{
        background: '#ffffff', height: 80, borderBottom: '2px solid #dcdcdc',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 24px', width: '100%'
      }}>
        {/* Lado izquierdo: Pestaña Multired Virtual */}
        <div style={{
          background: '#c5112e', padding: '12px 28px 16px', color: '#ffffff',
          borderRadius: '0 0 16px 0', display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'center', marginTop: -6, boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1 }}>multired</span>
          <span style={{ fontSize: 13, color: '#facc15', fontStyle: 'italic', fontWeight: 600, marginTop: 2, alignSelf: 'flex-end' }}>Virtual</span>
        </div>

        {/* Lado derecho: Logo Banco de la Nación */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Logo Espiral / Símbolo Rojo de la Nación */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#c5112e" />
            <path
              d="M11 22V10L21 22V10"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', letterSpacing: -0.5 }}>Banco</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5 }}>de la Nación</span>
          </div>
        </div>
      </header>

      {/* 2. CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px' }}>
        
        {/* Zona Segura Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Lock size={20} style={{ color: '#475569' }} />
          <span style={{ fontSize: 18, color: '#334155', fontWeight: 600 }}>Usted se encuentra en una <span style={{ color: '#c5112e', fontWeight: 800 }}>zona segura</span></span>
        </div>

        {/* Tarjeta de Log In */}
        <div style={{
          background: '#ffffff', border: '1px solid #d1d5db', borderRadius: 12,
          width: '100%', maxWidth: 640, padding: 32,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)'
        }}>
          {error && <Alert tipo="error">{error}</Alert>}

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Campo 1: Seleccione Tarjeta */}
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', alignItems: 'center', gap: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, textAlign: 'right', color: '#475569' }}>Seleccione:</label>
              <select className="hb-select" style={{ maxWidth: 360 }} value={tipoTarjeta} onChange={(e) => setTipoTarjeta(e.target.value)}>
                <option value="Multired Global Débito">Multired Global Débito</option>
                <option value="Tarjeta de Ahorro">Tarjeta de Ahorro</option>
                <option value="Multired Clásica">Multired Clásica</option>
              </select>
            </div>

            {/* Campo 2: Número de Tarjeta */}
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', alignItems: 'center', gap: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, textAlign: 'right', color: '#475569' }}>Número de tarjeta:</label>
              <div style={{ position: 'relative', maxWidth: 360, width: '100%' }}>
                <input
                  id="tarjeta"
                  type="text"
                  required
                  className="hb-input"
                  placeholder="Ej. cli000001"
                  value={tarjeta}
                  onChange={(e) => setTarjeta(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* Campo 3: Tipo y N° Documento */}
            {!isAdmin && (
              <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', alignItems: 'center', gap: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 700, textAlign: 'right', color: '#475569' }}>Tipo y N° Documento:</label>
                <div style={{ display: 'flex', gap: 10, maxWidth: 360 }}>
                  <select className="hb-select" style={{ width: 140 }} value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)}>
                    <option value="DNI">DNI</option>
                    <option value="Carnet Ext.">Carnet Ext.</option>
                    <option value="RUC">RUC</option>
                  </select>
                  <input
                    id="dni"
                    type="text"
                    required
                    maxLength={8}
                    className="hb-input"
                    placeholder="8 dígitos"
                    value={dni}
                    onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
            )}

            {/* Fila Dual: Teclado Virtual a la izquierda, Contraseña e instrucciones a la derecha */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: '12px 0', borderTop: '1px dashed #e5e7eb', borderBottom: '1px dashed #e5e7eb' }}>
              
              {/* Lado Izquierdo: Teclado Virtual */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600, marginBottom: 10, textAlign: 'center' }}>
                  Ingresa tu clave usando<br />el teclado virtual:
                </span>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 42px)', gap: 8,
                  justifyContent: 'center', background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0'
                }}>
                  {numbers.slice(0, 9).map((num) => (
                    <button
                      key={num} type="button" onClick={() => handleKeyClick(num)}
                      style={{
                        height: 38, width: 42, background: '#ffffff', border: '1px solid #cbd5e1',
                        borderRadius: 4, fontWeight: 700, cursor: 'pointer', display: 'grid', placeItems: 'center',
                        fontSize: 15, color: '#334155', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        transition: 'background 0.1s'
                      }}
                      onMouseDown={(e) => e.target.style.background = '#e2e8f0'}
                      onMouseUp={(e) => e.target.style.background = '#ffffff'}
                    >
                      {num}
                    </button>
                  ))}
                  {/* Fila 4 del Teclado */}
                  <button
                    type="button" onClick={() => handleKeyClick(numbers[9])}
                    style={{
                      height: 38, width: 42, background: '#ffffff', border: '1px solid #cbd5e1',
                      borderRadius: 4, fontWeight: 700, cursor: 'pointer', display: 'grid', placeItems: 'center',
                      fontSize: 15, color: '#334155', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    {numbers[9]}
                  </button>
                  <button
                    type="button" onClick={handleClear}
                    style={{
                      gridColumn: 'span 2', height: 38, background: '#64748b', border: '1px solid #475569',
                      borderRadius: 4, fontWeight: 700, color: '#ffffff', cursor: 'pointer', fontSize: 11,
                      textTransform: 'uppercase', display: 'grid', placeItems: 'center'
                    }}
                  >
                    LIMPIAR
                  </button>
                </div>
              </div>

              {/* Lado Derecho: Input clave y link */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Clave de Internet de prueba: demo1234'); }} style={{ fontSize: 12, color: '#c5112e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                  🔑 Genera tu Clave de Internet
                </a>
                <span style={{ fontSize: 11.5, color: '#64748b' }}>
                  Ingresa tu Clave de Internet:
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  className="hb-input"
                  style={{ letterSpacing: 4, fontWeight: 700, textAlign: 'center', background: '#f8fafc' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Utilice la clave demo1234 para pruebas.'); }} style={{ fontSize: 12, color: '#c5112e', fontWeight: 600, textDecoration: 'none' }}>
                  ⚠️ Olvidé mi clave
                </a>
              </div>
            </div>

            {/* Captcha de Seguridad */}
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', alignItems: 'center', gap: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, textAlign: 'right', color: '#475569' }}>Ingresa el texto de la imagen:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{
                  background: '#f1f5f9', border: '1.5px dashed #cbd5e1', padding: '6px 16px',
                  fontFamily: 'monospace', fontSize: 20, fontWeight: 800, letterSpacing: 4,
                  textDecoration: 'line-through', fontStyle: 'italic', color: '#334155',
                  userSelect: 'none', borderRadius: 6, display: 'inline-block',
                  backgroundSize: '10px 10px', backgroundImage: 'radial-gradient(#cbd5e1 20%, transparent 20%)'
                }}>
                  {captchaText}
                </div>
                <button type="button" onClick={refreshCaptcha} style={{ background: 'none', border: 'none', color: '#c5112e', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                  🔄 Cambiar texto
                </button>
                <input
                  type="text"
                  required
                  className="hb-input"
                  style={{ width: 120 }}
                  placeholder="Código"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                />
              </div>
            </div>

            {/* Botón Ingresar */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
              <button type="submit" className="bbva-btn" style={{ background: '#c5112e', padding: '12px 48px', fontSize: 14, fontWeight: 800, textTransform: 'uppercase', borderRadius: 6, width: 'auto' }} disabled={loading}>
                {loading ? 'INGRESANDO…' : 'INGRESAR'}
              </button>
            </div>
          </form>

          {isAdmin ? (
            <p className="hb-login-hint" style={{ marginTop: 24, borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
              Acceso de administrador: tarjeta <strong>admin</strong> · clave escrita manual (tipear <strong>admin1234</strong>)
            </p>
          ) : (
            <p className="hb-login-hint" style={{ marginTop: 24, borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
              Prueba: tarjeta <strong>cli000001</strong> · DNI <strong>12345678</strong> · clave <strong>demo1234</strong>
            </p>
          )}

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--hb-muted)', fontSize: 13, textDecoration: 'none' }}>
              <ArrowLeft size={15} /> Volver al inicio
            </Link>
          </div>
        </div>

        {/* Footer Recomendaciones */}
        <div style={{ display: 'flex', justifySelf: 'center', gap: 16, marginTop: 20, fontSize: 12, color: '#64748b', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#" className="pbi-link" onClick={(e) => e.preventDefault()} style={{ textDecoration: 'none' }}>Recomendaciones de Seguridad</a>
          <span>|</span>
          <a href="#" className="pbi-link" onClick={(e) => e.preventDefault()} style={{ textDecoration: 'none' }}>Guía Cuenta de Ahorro</a>
          <span>|</span>
          <a href="#" className="pbi-link" onClick={(e) => e.preventDefault()} style={{ textDecoration: 'none' }}>Guía Cuentas Corrientes</a>
        </div>

      </main>
    </div>
  )
}

