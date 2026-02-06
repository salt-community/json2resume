import { useState, useEffect } from 'react'

export const useScreenWidth = () => {
  const [screenWidth, setScreenWidth] = useState({
    width: window.innerWidth,
    //height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth({
        width: window.innerWidth,
        //height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return screenWidth
}
