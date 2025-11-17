import { useState } from 'react'
import './SlideOverlay.css'

interface NavigationItem {
  label: string
  id: string
}

interface SlideOverlayProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content?: React.ReactNode
  navigation?: NavigationItem[]
}

export function SlideOverlay({ isOpen, onClose, title, content, navigation }: SlideOverlayProps) {
  const [activeSection, setActiveSection] = useState<string | null>(navigation?.[0]?.id || null)

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className={`slide-overlay-backdrop ${isOpen ? 'open' : ''}`}
          onClick={onClose}
        />
      )}
      
      {/* Slide Up Panel */}
      <div className={`slide-overlay ${isOpen ? 'open' : ''}`}>
        <div className="slide-overlay-header">
          <div className="slide-overlay-title-section">
            <h2 className="slide-overlay-title">
              {title}
            </h2>
            {navigation && navigation.length > 0 && (
              <nav className="portfolio-navigation">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    className={`nav-button ${activeSection === item.id ? 'active' : ''}`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            )}
          </div>
          <button className="slide-overlay-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="slide-overlay-content">
          {content || <p>Content coming soon...</p>}
        </div>
      </div>
    </>
  )
}

