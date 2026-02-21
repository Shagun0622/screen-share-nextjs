'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

function getDisplaySurfaceLabel(surface) {
  switch (surface) {
    case 'browser': return 'Browser Tab'
    case 'window':  return 'Application Window'
    case 'monitor': return 'Entire Screen'
    default:        return 'Screen'
  }
}

export function useScreenShare() {
  const [status, setStatus]           = useState('idle')
  const [stream, setStream]           = useState(null)
  const [metadata, setMetadata]       = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const streamRef = useRef(null)

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.onended = null
        track.stop()
      })
      streamRef.current = null
    }
    setStream(null)
    setMetadata(null)
  }, [])

  const stopSharing = useCallback(() => {
    cleanup()
    setStatus('stopped')
  }, [cleanup])

  const reset = useCallback(() => {
    cleanup()
    setStatus('idle')
    setErrorMessage(null)
  }, [cleanup])

  const startSharing = useCallback(async () => {
    cleanup()
    setStatus('requesting')
    setErrorMessage(null)

    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 30 } },
        audio: false,
      })

      const videoTrack = mediaStream.getVideoTracks()[0]
      if (!videoTrack) {
        mediaStream.getTracks().forEach(t => t.stop())
        setStatus('error')
        setErrorMessage('No video track found in stream.')
        return
      }

      const settings = videoTrack.getSettings()
      const meta = {
        width:          settings.width ?? 0,
        height:         settings.height ?? 0,
        frameRate:      Math.round(settings.frameRate ?? 0),
        displaySurface: getDisplaySurfaceLabel(settings.displaySurface),
        label:          videoTrack.label || 'Unknown Source',
      }

      // Detect browser UI "Stop sharing" click
      videoTrack.onended = () => {
        setStatus('stopped')
        setStream(null)
        setMetadata(null)
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => {
            t.onended = null
            t.stop()
          })
          streamRef.current = null
        }
      }

      streamRef.current = mediaStream
      setStream(mediaStream)
      setMetadata(meta)
      setStatus('active')

    } catch (err) {
      cleanup()

      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          const isDenied =
            err.message.toLowerCase().includes('permission denied') ||
            err.message.toLowerCase().includes('not allowed')
          if (isDenied) {
            setStatus('denied')
            setErrorMessage('Screen sharing permission was denied by the browser or system settings.')
          } else {
            setStatus('cancelled')
            setErrorMessage('You closed the screen picker without selecting a source.')
          }
        } else if (err.name === 'NotFoundError') {
          setStatus('error')
          setErrorMessage('No screen source is available to share.')
        } else if (err.name === 'NotReadableError') {
          setStatus('error')
          setErrorMessage('The screen source could not be read. Another app may be blocking access.')
        } else {
          setStatus('error')
          setErrorMessage(`Unexpected error: ${err.message}`)
        }
      } else {
        setStatus('error')
        setErrorMessage('An unknown error occurred while requesting screen access.')
      }
    }
  }, [cleanup])

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup()
  }, [cleanup])

  return { status, stream, metadata, errorMessage, startSharing, stopSharing, reset }
}
