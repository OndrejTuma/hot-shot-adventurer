'use client'

import { useEffect, useState } from 'react'

export default function IndianaJonesLoader() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return ''
        return prev + '.'
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="indiana-loader-container">
      <div className="indiana-loader">
        {/* Map background */}
        <div className="map-background">
          <div className="map-paper"></div>
        </div>

        {/* Compass */}
        <div className="compass-container">
          <div className="compass-outer">
            <div className="compass-inner">
              <div className="compass-needle compass-north"></div>
              <div className="compass-needle compass-south"></div>
              <div className="compass-center"></div>
            </div>
            <div className="compass-markers">
              <div className="compass-marker compass-n">N</div>
              <div className="compass-marker compass-e">E</div>
              <div className="compass-marker compass-s">S</div>
              <div className="compass-marker compass-w">W</div>
            </div>
          </div>
        </div>

        {/* Dust particles */}
        <div className="dust-particles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`dust-particle dust-${i + 1}`}></div>
          ))}
        </div>

        {/* Loading text */}
        <div className="loader-text">
          <span className="loader-title">Načítám dobyvatele</span>
          <span className="loader-dots">{dots}</span>
        </div>

        {/* Adventure elements */}
        <div className="adventure-elements">
          <div className="adventure-icon">🗺️</div>
          <div className="adventure-icon">⚱️</div>
          <div className="adventure-icon">🏺</div>
        </div>
      </div>
    </div>
  )
}

