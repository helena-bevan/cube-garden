import './SlideOverlay.css'

interface SlideOverlayProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content?: React.ReactNode
}

export function SlideOverlay({ isOpen, onClose, title, content }: SlideOverlayProps) {
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
          <h2 className="slide-overlay-title">
            {title}
          </h2>
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

