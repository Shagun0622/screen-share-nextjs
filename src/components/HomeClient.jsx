'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from './Button'
import styles from './HomeClient.module.css'

export default function HomeClient() {
  const router = useRouter()
  const [unsupported, setUnsupported] = useState(false)

  const isSupported =
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getDisplayMedia === 'function'

  function handleStart() {
    if (!isSupported) { setUnsupported(true); return }
    router.push('/screen-test')
  }

  return (
    <div className={styles.page}>
      <div className={styles.topRule} />

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logoMark}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <rect x="1" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="1.2" fill="currentColor"/>
            </svg>
          </div>
          <span className={styles.logoText}>ScreenTest</span>
        </div>
        <nav className={styles.headerRight}>
          <span className={styles.navItem}>Chrome / Edge</span>
          <span className={styles.navDivider} />
          <span className={styles.navItem}>v1.0</span>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.heroGrid}>

          {/* Left — copy */}
          <div className={styles.heroLeft}>
            <div className={styles.eyebrow}>
              <div className={styles.eyebrowDot} />
              <span>Web API · Browser Native · Next.js 14</span>
            </div>

            <h1 className={styles.headline}>
              Screen Share
              <br />
              <em className={styles.headlineItalic}>Test App</em>
            </h1>

            <div className={styles.ruleLine} />

            <p className={styles.body}>
              Verify your browser&apos;s screen-sharing capabilities,
              test every permission state, and inspect live stream
              metadata — all running locally in your browser.
            </p>

            {unsupported ? (
              <div className={styles.unsupportedBox}>
                <div className={styles.unsupportedHeader}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
                    <line x1="8" y1="5" x2="8" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="8" cy="11.5" r="0.8" fill="currentColor"/>
                  </svg>
                  <span>Browser Not Supported</span>
                </div>
                <p>
                  Your browser doesn&apos;t support{' '}
                  <code>getDisplayMedia</code>. Please switch to Chrome 72+ or Edge 79+.
                </p>
              </div>
            ) : (
              <div className={styles.ctaGroup}>
                <Button size="lg" onClick={handleStart}>
                  Start Screen Test
                </Button>
                <p className={styles.ctaNote}>No data leaves your device</p>
              </div>
            )}
          </div>

          {/* Right — mockup + features */}
          <div className={styles.heroRight}>
            <div className={styles.mockup}>
              <div className={styles.mockupScreen}>
                <div className={styles.mockupBar}>
                  <span /><span /><span />
                </div>
                <div className={styles.mockupBody}>
                  <div className={styles.mockupScanline} />
                  <div className={styles.mockupGrid}>
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className={styles.mockupCell} />
                    ))}
                  </div>
                  <div className={styles.mockupCenterIcon}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                      <circle cx="20" cy="20" r="8"  stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
                      <circle cx="20" cy="20" r="3"  fill="currentColor"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.featureList}>
              {[
                { num: '01', title: 'Permission Testing', desc: 'Distinct UI for every state — granted, denied, cancelled, error.' },
                { num: '02', title: 'Live Metadata',      desc: 'Resolution, frame rate & display type via track.getSettings().' },
                { num: '03', title: 'Lifecycle Events',   desc: 'track.onended fires instantly on browser stop button click.' },
              ].map(f => (
                <div key={f.num} className={styles.featureItem}>
                  <span className={styles.featureNum}>{f.num}</span>
                  <div className={styles.featureContent}>
                    <h3 className={styles.featureTitle}>{f.title}</h3>
                    <p className={styles.featureDesc}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <span>Built with Next.js 14 · CSS Modules · No TypeScript</span>
        <span className={styles.footerDivider}>·</span>
        <span>No backend · No tracking · No third-party APIs</span>
      </footer>

      <div className={styles.bottomRule} />
    </div>
  )
}
