import { useState, useEffect } from 'react'
import { PhoneCall, CalendarDays, ClipboardList, ShieldAlert, BadgeAlert, Scale, Trash2 } from 'lucide-react'
import { getRecuperacionesStats, getRecuperacionesCartera, registrarGestionCobranza, getHistorialCobranza, transicionarMora } from '../services/adminService.js'
import { toNumber, formatDate } from '../utils/format.js'
import PageLayout from '../components/layout/PageLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Alert from '../components/ui/Alert.jsx'
import Money from '../components/ui/Money.jsx'
import Loader from '../components/ui/Loader.jsx'
import Tabla from '../components/ui/Tabla.jsx'

const BANDAS = [
  { id: 'PREVENTIVA', label: 'Preventiva (0d)', color: '#10b981', icon: CalendarDays },
  { id: 'TEMPRANA', label: 'Temprana (1–30d)', color: '#F5A800', icon: PhoneCall },
  { id: 'TARDIA', label: 'Tardía (31–120d)', color: '#ef4444', icon: BadgeAlert },
  { id: 'JUDICIAL', label: 'Judicial (121–180d)', color: '#7c3aed', icon: Scale },
  { id: 'CASTIGO', label: 'Castigo (>180d)', color: '#374151', icon: Trash2 },
]

const TIPOS_GESTION = [
  { cod: 'LLAM', label: 'Llamada Telefónica' },
  { cod: 'SMS', label: 'Envío de SMS' },
  { cod: 'VISI', label: 'Visita Domiciliaria' },
  { cod: 'CART', label: 'Carta / Notificación' },
  { cod: 'COMP', label: 'Compromiso de Pago' },
]

export default function AdminRecuperacionesPage() {
  const [stats, setStats] = useState(null)
  const [cartera, setCartera] = useState([])
  const [activeBanda, setActiveBanda] = useState('TEMPRANA')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Modales
  const [gestionCredit, setGestionCredit] = useState(null)
  const [historialCredit, setHistorialCredit] = useState(null)
  const [historialList, setHistorialList] = useState([])
  const [cargandoHistorial, setCargandoHistorial] = useState(false)

  // Formulario de gestión
  const [form, setForm] = useState({
    codtipogestion: 'LLAM',
    resultado: '',
    compromisopago: '',
    montocomprometido: '',
  })

  // Obtener rol administrativo
  const adminRole = localStorage.getItem('hb_admin_role') || 'ASESOR'

  const cargarStats = async () => {
    try {
      const data = await getRecuperacionesStats()
      setStats(data)
    } catch (e) {
      console.error(e)
    }
  }

  const cargarCartera = async (banda) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getRecuperacionesCartera(banda)
      setCartera(data)
    } catch (e) {
      setError('Error al cargar la cartera en mora.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarStats()
    cargarCartera(activeBanda)
  }, [activeBanda])

  const handleRegistrarGestion = async (e) => {
    e.preventDefault()
    if (!form.resultado.trim()) {
      alert('Por favor ingrese el detalle del resultado de la gestión.')
      return
    }

    try {
      setLoading(true)
      await registrarGestionCobranza({
        pkcuentacredito: gestionCredit.pkcuentacredito,
        codtipogestion: form.codtipogestion,
        resultado: form.resultado,
        compromisopago: form.compromisopago || null,
        montocomprometido: form.montocomprometido ? toNumber(form.montocomprometido) : null,
      })
      alert('Gestión de cobranza registrada exitosamente.')
      setGestionCredit(null)
      setForm({ codtipogestion: 'LLAM', resultado: '', compromisopago: '', montocomprometido: '' })
      cargarCartera(activeBanda)
    } catch (err) {
      alert('Error al registrar gestión: ' + (err.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleVerHistorial = async (credito) => {
    setHistorialCredit(credito)
    try {
      setCargandoHistorial(true)
      const data = await getHistorialCobranza(credito.pkcuentacredito)
      setHistorialList(data)
    } catch (e) {
      alert('No se pudo cargar el historial.')
      setHistorialCredit(null)
    } finally {
      setCargandoHistorial(false)
    }
  }

  const handleTransicionar = async (credito, nuevoEstado) => {
    const desc = nuevoEstado === 'JUDICIAL' ? 'Cobranza Judicial' : 'Castigado'
    if (!confirm(`¿Está seguro de transicionar el crédito ${credito.codcuentacredito} a estado ${desc}?`)) return

    try {
      setLoading(true)
      const res = await transicionarMora({
        pkcuentacredito: credito.pkcuentacredito,
        nuevo_estado: nuevoEstado,
      })
      alert(res.mensaje || 'Transición exitosa.')
      cargarCartera(activeBanda)
      cargarStats()
    } catch (err) {
      alert('Error al transicionar estado: ' + (err.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  const cols = [
    { key: 'codcuentacredito', header: 'Código Crédito', render: (row) => <code>{row.codcuentacredito}</code> },
    { key: 'cliente', header: 'Cliente / Documento', render: (row) => (
      <div>
        <div style={{ fontWeight: 600 }}>{row.cliente}</div>
        <small style={{ color: 'var(--hb-text-muted)' }}>DNI/RUC: {row.nro_documento} ({row.codcliente})</small>
      </div>
    )},
    { key: 'dias_atraso', header: 'Atraso', align: 'center', render: (row) => (
      <span style={{ fontWeight: 'bold', color: row.dias_atraso > 0 ? '#ef4444' : '#10b981' }}>
        {row.dias_atraso} días
      </span>
    )},
    { key: 'capital', header: 'Capital', align: 'right', render: (row) => <Money value={row.saldo_capital} /> },
    { key: 'pendiente', header: 'Deuda Total', align: 'right', render: (row) => <Money value={row.pago_pendiente} /> },
    { key: 'estado', header: 'Estado', render: (row) => (
      <span style={{ 
        padding: '3px 8px', 
        borderRadius: '12px', 
        fontSize: '11px', 
        fontWeight: 'bold',
        background: row.pkestadocredito === 3 ? '#e0e7ff' : row.pkestadocredito === 7 ? '#f3f4f6' : '#fee2e2',
        color: row.pkestadocredito === 3 ? '#4338ca' : row.pkestadocredito === 7 ? '#374151' : '#b91c1c'
      }}>
        {row.estado_credito}
      </span>
    )},
    { key: 'acciones', header: 'Acciones', align: 'right', render: (row) => (
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
        <button 
          className="bbva-btn-ghost sm" 
          style={{ padding: '4px 8px', fontSize: '12px' }}
          onClick={() => handleVerHistorial(row)}
        >
          Historial
        </button>
        <button 
          className="bbva-btn-ghost sm" 
          style={{ padding: '4px 8px', fontSize: '12px' }}
          onClick={() => setGestionCredit(row)}
        >
          + Gestión
        </button>
        
        {/* Acciones de Transición con reglas */}
        {activeBanda === 'JUDICIAL' && row.pkestadocredito !== 3 && (
          <button 
            className="bbva-btn sm" 
            style={{ padding: '4px 8px', fontSize: '12px', background: '#7c3aed' }}
            onClick={() => handleTransicionar(row, 'JUDICIAL')}
          >
            A Judicial
          </button>
        )}
        
        {activeBanda === 'CASTIGO' && row.pkestadocredito !== 7 && (
          <button 
            className="bbva-btn sm" 
            style={{ padding: '4px 8px', fontSize: '12px', background: '#374151' }}
            onClick={() => handleTransicionar(row, 'CASTIGO')}
          >
            Castigar
          </button>
        )}
      </div>
    )},
  ]

  const histCols = [
    { key: 'fecha', header: 'Fecha', render: (row) => formatDate(row.fecha) },
    { key: 'tipo', header: 'Tipo', render: (row) => <span style={{ fontWeight: 'bold' }}>{row.tipo_gestion}</span> },
    { key: 'dias', header: 'Días Mora', align: 'center', render: (row) => `${row.dias_atraso}d` },
    { key: 'gestor', header: 'Gestor', render: (row) => <code>{row.gestor}</code> },
    { key: 'resultado', header: 'Resultado / Comentario', render: (row) => row.resultado },
    { key: 'compromiso', header: 'Compromiso', render: (row) => (
      row.compromiso_fecha ? (
        <div>
          <div>{formatDate(row.compromiso_fecha)}</div>
          <small style={{ fontWeight: 'bold', color: '#10b981' }}><Money value={row.compromiso_monto} /></small>
        </div>
      ) : '-'
    )},
  ]

  return (
    <PageLayout
      title="Módulo de Recuperaciones y Mora"
      subtitle="Administración › Cobranza y Recuperación de Cartera"
    >
      {/* 1. KPIs por Bandas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {BANDAS.map((b) => {
          const statsBanda = stats?.distribucion_bandas?.[b.id] || { cantidad: 0, monto: 0.0 }
          const active = activeBanda === b.id
          const Icon = b.icon
          return (
            <div 
              key={b.id}
              onClick={() => setActiveBanda(b.id)}
              style={{
                background: '#ffffff',
                border: active ? `2px solid ${b.color}` : '1px solid var(--hb-border)',
                borderRadius: '8px',
                padding: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: active ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                transform: active ? 'translateY(-2px)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--hb-text-muted)' }}>{b.label}</span>
                <Icon size={16} style={{ color: b.color }} />
              </div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#1f2937' }}>
                {statsBanda.cantidad} <span style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--hb-text-muted)' }}>créd.</span>
              </div>
              <div style={{ fontSize: '13px', color: b.color, fontWeight: 'bold', marginTop: '4px' }}>
                <Money value={statsBanda.monto} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Alerta del Rol de Personal Activo */}
      <Alert tipo="info" style={{ marginBottom: '20px' }}>
        <strong>Rol Administrativo Activo:</strong> <code>{adminRole}</code>. 
        {adminRole === 'ASESOR' && ' (Sólo puede registrar gestiones. Transiciones a Judicial / Castigo bloqueadas).'}
        {adminRole === 'JEFE_REGIONAL' && ' (Autorizado para transicionar a Cobranza Judicial. Castigo bloqueado).'}
        {adminRole === 'COMITE' && ' (Autorizado para transicionar a Cobranza Judicial y aplicar Castigo de cartera).'}
      </Alert>

      {/* 2. Listado de Cartera */}
      <Card title={`Cartera en Banda: ${activeBanda}`} icon={<ShieldAlert size={18} style={{ color: '#ef4444' }} />}>
        {error && <Alert tipo="error">{error}</Alert>}
        {loading && cartera.length === 0 ? (
          <Loader text="Cargando cartera morosa..." />
        ) : (
          <Tabla columns={cols} rows={cartera} rowKey={(row) => row.pkcuentacredito} emptyText="No hay créditos morosos en esta banda." />
        )}
      </Card>

      {/* Modal de Registro de Gestión */}
      {gestionCredit && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'grid', placeItems: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '500px',
            padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
              Registrar Gestión de Cobranza
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--hb-text-muted)' }}>
              Crédito: <code>{gestionCredit.codcuentacredito}</code> · Cliente: <strong>{gestionCredit.cliente}</strong>
            </p>

            <form onSubmit={handleRegistrarGestion} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="hb-field">
                <label>Tipo de Gestión *</label>
                <select 
                  className="hb-select"
                  value={form.codtipogestion}
                  onChange={(e) => setForm(f => ({ ...f, codtipogestion: e.target.value }))}
                >
                  {TIPOS_GESTION.map(t => <option key={t.cod} value={t.cod}>{t.label}</option>)}
                </select>
              </div>

              <div className="hb-field">
                <label>Resultado / Comentarios *</label>
                <textarea 
                  className="hb-input"
                  style={{ height: '80px', padding: '8px', fontSize: '13px', resize: 'none' }}
                  value={form.resultado}
                  onChange={(e) => setForm(f => ({ ...f, resultado: e.target.value }))}
                  placeholder="Detalle de la llamada, acuerdo o visita..."
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="hb-field">
                  <label>Fecha Compromiso (Opcional)</label>
                  <input 
                    className="hb-input"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={form.compromisopago}
                    onChange={(e) => setForm(f => ({ ...f, compromisopago: e.target.value }))}
                  />
                </div>
                <div className="hb-field">
                  <label>Monto Comprometido (S/)</label>
                  <input 
                    className="hb-input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.montocomprometido}
                    onChange={(e) => setForm(f => ({ ...f, montocomprometido: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="bbva-btn-ghost" onClick={() => setGestionCredit(null)}>
                  Cancelar
                </button>
                <button type="submit" className="bbva-btn" disabled={loading}>
                  {loading ? 'Guardando...' : 'Registrar Gestión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Historial de Cobranza */}
      {historialCredit && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'grid', placeItems: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '800px',
            padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
                Historial de Gestión de Cobranza
              </h3>
              <button className="bbva-btn-ghost sm" onClick={() => setHistorialCredit(null)}>Cerrar</button>
            </div>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--hb-text-muted)' }}>
              Crédito: <code>{historialCredit.codcuentacredito}</code> · Cliente: <strong>{historialCredit.cliente}</strong>
            </p>

            {cargandoHistorial ? (
              <Loader text="Cargando historial..." />
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Tabla columns={histCols} rows={historialList} rowKey={(row, idx) => idx} emptyText="No hay gestiones registradas para este crédito." />
              </div>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  )
}
