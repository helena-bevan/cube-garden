import { useState } from 'react'
import { Scene } from './components/Scene'
import { SlideOverlay } from './components/SlideOverlay'
import './App.css'
import candyMachineSvg from './assets/FabConvert.com_Coral_Candy_Machine[1]+(1).svg'
import artPictureSvg from './assets/FabConvert.com_Artpicturecopy.svg'

function App() {
  const [openOverlay, setOpenOverlay] = useState<string | null>(null)
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)

  const handleOpenOverlay = (overlayType: string) => {
    setOpenOverlay(overlayType)
  }

  const handleCloseOverlay = () => {
    setOpenOverlay(null)
  }

  const handleImageClick = (imageSrc: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEnlargedImage(imageSrc)
  }

  const handleCloseEnlarged = () => {
    setEnlargedImage(null)
  }

  return (
    <div className="app-container">
      <Scene onCubeClick={handleOpenOverlay} />
      <div className="content-overlay">
        <div className="hero-content">
          <h1 className="hero-title">Helena Bevan</h1>
          <p className="hero-subtitle">
            Multidisciplinary artist and designer
          </p>
          <div className="hero-actions">
        
          </div>
        </div>
      </div>
      
      <SlideOverlay
        isOpen={openOverlay === 'portfolio'}
        onClose={handleCloseOverlay}
        title="Portfolio"
        content={
          <div className="portfolio-content">
            <img 
              src={candyMachineSvg} 
              alt="Coral Candy Machine" 
              className="portfolio-svg perspex-image"
              onClick={(e) => handleImageClick(candyMachineSvg, e)}
            />
            <img 
              src={artPictureSvg} 
              alt="Art Picture" 
              className="portfolio-svg perspex-image"
              onClick={(e) => handleImageClick(artPictureSvg, e)}
            />
          </div>
        }
      />
      
      <SlideOverlay
        isOpen={openOverlay === 'contact'}
        onClose={handleCloseOverlay}
        title="Contact"
        content={
          <div>
            <p>Your contact information goes here...</p>
          </div>
        }
      />

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="enlarged-image-overlay" onClick={handleCloseEnlarged}>
          <div className="enlarged-image-container" onClick={(e) => e.stopPropagation()}>
            <button className="enlarged-image-close" onClick={handleCloseEnlarged}>
              ×
            </button>
            <img 
              src={enlargedImage} 
              alt="Enlarged view" 
              className={`enlarged-image ${enlargedImage === candyMachineSvg ? 'flip-180' : ''}`}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
