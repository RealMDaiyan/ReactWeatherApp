import React, {useState} from 'react'
import './Component Styles/WeatherStyles.css'


const Footer = ({onSearch, isVisible}) => {
  // Search Function
  const [city, setCity] = useState("");

  // Handles the city submission and clears it
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(city)
    
    setCity("")
  }
  return (
    <footer className='bg-light text-center py-3'>
      <div className='container'>
        <form onSubmit={handleSubmit} className={`d-flex justify-content-center`}>
          <input type="text" className="form-control me-2" placeholder='Search for a City' value={city} onChange={e => setCity(e.target.value)} required></input>
          <button type="submit" className='btn btn-primary'><i className="bi bi-search"></i></button>
        </form>
      </div>
      
    </footer>
  )
}

export default Footer