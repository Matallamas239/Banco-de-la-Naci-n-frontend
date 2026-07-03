import React from 'react'

/**
 * Logo oficial de Banco GNB Perú.
 * Presenta las letras "BANCO GNB" con la fuente y colores oficiales,
 * el isotipo del árbol verde y la palabra "PERÚ" debajo.
 *
 * @param {Object} props
 * @param {number}  [props.size=44]          Tamaño/escala del logotipo.
 * @param {string}  [props.variant='dark']   Variante de color ('dark' o 'light').
 */
export default function Logo({ size = 44, variant = 'dark' }) {
  const scale = size / 44
  const isLight = variant === 'light'
  
  const textColorBanco = isLight ? 'rgba(255, 255, 255, 0.9)' : '#4b5563'
  const textColorGnb = isLight ? '#ffffff' : '#c5112e' // Rojo corporativo
  const textColorPeru = isLight ? 'rgba(255, 255, 255, 0.75)' : '#1f2937'
  
  const circleColor = isLight ? '#ffffff' : '#c5112e'
  const iconStrokeColor = isLight ? '#c5112e' : '#ffffff'

  return (
    <div 
      style={{ 
        display: 'inline-flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        lineHeight: 1,
        fontFamily: '"Outfit", "Inter", "Segoe UI", sans-serif',
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: `${6 * scale}px` }}>
        <span 
          style={{ 
            fontWeight: 300, 
            fontSize: `${16 * scale}px`, 
            color: textColorBanco,
            letterSpacing: '0.5px'
          }}
        >
          BANCO DE LA
        </span>
        <span 
          style={{ 
            fontWeight: 800, 
            fontSize: `${16 * scale}px`, 
            color: textColorGnb,
            letterSpacing: '0.5px',
            marginRight: `${2 * scale}px`
          }}
        >
          NACIÓN
        </span>
        
        {/* Isotipo: Banco de la Nación (Círculo rojo con N blanca) */}
        <svg
          width={Math.round(24 * scale)}
          height={Math.round(24 * scale)}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', flexShrink: 0 }}
        >
          <circle cx="12" cy="12" r="10" fill={circleColor} />
          <path
            d="M8.5 16.5V7.5L15.5 16.5V7.5"
            stroke={iconStrokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      <span 
        style={{ 
          fontWeight: 600, 
          fontSize: `${9 * scale}px`, 
          color: textColorPeru,
          letterSpacing: `${4.5 * scale}px`,
          paddingLeft: `${3 * scale}px`,
          marginTop: `-${1 * scale}px`,
          alignSelf: 'stretch',
          textAlign: 'center'
        }}
      >
        PERÚ
      </span>
    </div>
  )
}
