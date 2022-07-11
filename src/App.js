import React, { useEffect, useState } from 'react'
import './App.css'

const titleStle = {
  fontWeight: 'bold'
}

const valueBoxStyle = {
  marginTop: 20,
  padding: 20,
  border: '1px solid #DADADA',
  wordWrap: 'break-word'
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [increaseDecimal, setIncreaseDecimal] = useState('')
  const [pi, setPi] = useState(null)
  const [circumferenceOfSun, setCircumferenceOfSun] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const circumferenceOfSunURI = process.env.REACT_APP_PI_SERVICE_URI + '/circumference/sun'
  const resetDBURI = process.env.REACT_APP_PI_SERVICE_URI + '/pi/reset'

  useEffect(() => {
    fetch(resetDBURI, { method: 'POST' })
      .then(res => res.json())
      .then(result => {
        if (result.isSuccess) {
          setIsLoading(false)
        }
      })
      .catch(error => setErrorMessage(error))
  }, [])

  const onGetCircumferenceOfSunPressed = () => {
    setIsLoading(true)
    setErrorMessage(null)

    const hasIncreaseDecimal = !!(increaseDecimal && increaseDecimal > 1)

    const getCircumferenceOfSunURI = circumferenceOfSunURI + (hasIncreaseDecimal ? `?increase=${increaseDecimal}` : '')

    fetch(getCircumferenceOfSunURI)
      .then(res => res.json())
      .then(result => {
        if (result.isSuccess) {
          setPi(result.pi)
          setCircumferenceOfSun(result.circumferenceOfSunKM)
        }
      })
      .catch(error => setErrorMessage(error))
      .finally(() => {
        setIncreaseDecimal('')
        setIsLoading(false)
      })
  }

  const onResetDBPressed = () => {
    setIsLoading(true)
    setErrorMessage(null)

    fetch(resetDBURI, { method: 'POST' })
      .then(res => res.json())
      .then(result => {
        if (result.isSuccess) {
          setPi(null)
          setCircumferenceOfSun(null)
        }
      })
      .catch(error => setErrorMessage(error))
      .finally(() => {
        setIncreaseDecimal('')
        setIsLoading(false)
      })
  }

  const renderErrorMessage = () => {
    if (!errorMessage) return null

    return (
      <span style={{ color: 'red' }}>{errorMessage}</span>
    )
  }

  const renderLoadingOverlay = () => {
    if (!isLoading) return null

    return (
      <span>
        Loading...
      </span>
    )
  }

  const handleValueChange = (event) => {
    const isNumber = /^[0-9\b]+$/.test(event.target.value)

    if (isNumber) {
      setIncreaseDecimal(Number(event.target.value))
    }
  }

  return (
    <div style={{ margin: '0 auto', width: 720, textAlign: 'center', padding: 40 }}>
      <div style={titleStle}>
        Pi
      </div>
      <div style={valueBoxStyle}>
        {pi}
      </div>
      <div style={{ marginTop: 20, marginBottom: 20, height: '1px', backgroundColor: '#DADADA' }} />
      <div style={titleStle}>
        Circumference of Sun (Kilometre)
      </div>
      <div style={valueBoxStyle}>
        {circumferenceOfSun}
      </div>
      <div style={{ marginTop: 20, marginBottom: 20, height: '1px', backgroundColor: '#DADADA' }} />
      <span style={titleStle}>Add Decimals</span>
      <input style={{ width: '100%', marginBottom: 20, textAlign: 'center' }} placeholder='e.g. 500' onChange={handleValueChange} value={increaseDecimal} disabled={isLoading} />
      <button style={{ marginRight: 10 }} onClick={onGetCircumferenceOfSunPressed}>
        Get Circumference of Sun
      </button>
      <button style={{ marginLeft: 10 }} onClick={onResetDBPressed} disabled={isLoading}>
        Reset DB
      </button>
      <div style={{ width: '100%', textAlign: 'center', marginTop: 20 }}>
        {renderLoadingOverlay()}
      </div>

      <div style={{ width: '100%', textAlign: 'center', marginTop: 20 }}>
        {renderErrorMessage()}
      </div>
    </div>
  )
}

export default App
