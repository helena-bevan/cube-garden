import { useState } from 'react'
import { Scene } from './components/Scene'
import { SlideOverlay } from './components/SlideOverlay'
import './App.css'
import candyMachineSvg from './assets/FabConvert.com_Coral_Candy_Machine[1]+(1).svg'
import artPictureSvg from './assets/FabConvert.com_Artpicturecopy.svg'
import colourEdit101 from './assets/101 colour edit.jpg'
import colourEdit102 from './assets/102 colour edit.jpg'
import colourEdit104 from './assets/104 colour edit.jpg'
import colourEdit107 from './assets/107 colour edit.jpg'
import sharpEdit from './assets/sharpedit.jpg'
import vector108 from './assets/108 vector ver.svg'

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
        navigation={[
          { label: 'Acrylic Drawings', id: 'acrylic' },
          { label: 'Digital Editions', id: 'digital' }
        ]}
        content={
          <div className="portfolio-content">
            <img 
              src={candyMachineSvg} 
              alt="Coral Candy Machine" 
              className="portfolio-svg perspex-image floating-image"
              onClick={(e) => handleImageClick(candyMachineSvg, e)}
            />
            <img 
              src={artPictureSvg} 
              alt="Art Picture" 
              className="portfolio-svg perspex-image floating-image"
              onClick={(e) => handleImageClick(artPictureSvg, e)}
            />
            <img 
              src={colourEdit101} 
              alt="101 Colour Edit" 
              className="portfolio-svg perspex-image floating-image"
              onClick={(e) => handleImageClick(colourEdit101, e)}
            />
            <img 
              src={colourEdit102} 
              alt="102 Colour Edit" 
              className="portfolio-svg perspex-image floating-image"
              onClick={(e) => handleImageClick(colourEdit102, e)}
            />
            <img 
              src={colourEdit104} 
              alt="104 Colour Edit" 
              className="portfolio-svg perspex-image floating-image"
              onClick={(e) => handleImageClick(colourEdit104, e)}
            />
            <img 
              src={colourEdit107} 
              alt="107 Colour Edit" 
              className="portfolio-svg perspex-image floating-image"
              onClick={(e) => handleImageClick(colourEdit107, e)}
            />
            <img 
              src={sharpEdit} 
              alt="Sharp Edit" 
              className="portfolio-svg perspex-image floating-image"
              onClick={(e) => handleImageClick(sharpEdit, e)}
            />
            <img 
              src={vector108} 
              alt="108 Vector" 
              className="portfolio-svg perspex-image floating-image"
              onClick={(e) => handleImageClick(vector108, e)}
            />
          </div>
        }
      />
      
      <SlideOverlay
        isOpen={openOverlay === 'contact'}
        onClose={handleCloseOverlay}
        title="Contact"
        content={
          <div className="contact-content">
            <form className="contact-form" onSubmit={(e) => {
              e.preventDefault()
              // Handle form submission here
              alert('Thank you for your message! I\'ll get back to you soon.')
            }}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Tell me about your project or inquiry..."
                />
              </div>
              <button type="submit" className="submit-button">
                Send Message
              </button>
            </form>
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
