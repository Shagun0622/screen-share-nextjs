'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Button from './Button'
import { useScreenShare } from '@/hooks/useScreenShare'
import styles from './ScreenTestClient.module.css'

export default function ScreenTestClient() {
  const router = useRouter()
  const videoRef = useRef(null)
  const { status, stream, metadata, errorMessage, startSharing, stopSharing, reset } =
    useScreenShare()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (stream && status === 'active') {
      video.srcObject = stream
      video.play().catch(() => {})
    } else {
      video.srcObject = null
    }
  }, [stream, status])

  function handleRetry() { reset(); startSharing() }
  function handleBack()  { reset(); router.push('/') }

  return (
    <div className={styles.page}>
      <div className={styles.topRule} />

      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbDim}>ScreenTest</span>
          <span className={styles.breadcrumbSep}>/</span>
          <span>screen-test</span>
        </div>

        <StatusBadge status={status} />
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <p className={styles.sidebarLabel}>Test Progress</p>
          <StepTracker status={status} />

          <div className={styles.sidebarDivider} />

          <div className={styles.sidebarInfo}>
            <p className={styles.sidebarInfoLabel}>API Used</p>
            <code className={styles.sidebarCode}>getDisplayMedia()</code>
          </div>
          <div className={styles.sidebarInfo}>
            <p className={styles.sidebarInfoLabel}>Audio</p>
            <code className={styles.sidebarCode}>false</code>
          </div>
          <div className={styles.sidebarInfo}>
            <p className={styles.sidebarInfoLabel}>Frame Rate</p>
            <code className={styles.sidebarCode}>ideal: 30</code>
          </div>
        </aside>

        <main className={styles.stage}>
          {status === 'idle'       && <IdleState onStart={startSharing} />}
          {status === 'requesting' && <RequestingState />}
          {status === 'active'     && (
            <ActiveState videoRef={videoRef} metadata={metadata} onStop={stopSharing} />
          )}
          {['stopped','cancelled','denied','error'].includes(status) && (
            <EndState status={status} errorMessage={errorMessage} onRetry={handleRetry} onBack={handleBack} />
          )}
        </main>
      </div>
    </div>
  )
}

/* ─── Status Badge ─── */
function StatusBadge({ status }) {
  const map = {
    idle:       { label: 'Ready',      cls: 'neutral' },
    requesting: { label: 'Requesting', cls: 'warning' },
    active:     { label: 'Live',       cls: 'success' },
    cancelled:  { label: 'Cancelled',  cls: 'warning' },
    denied:     { label: 'Denied',     cls: 'danger'  },
    stopped:    { label: 'Stopped',    cls: 'neutral' },
    error:      { label: 'Error',      cls: 'danger'  },
  }
  const { label, cls } = map[status]
  return (
    <div className={`${styles.badge} ${styles[`badge_${cls}`]}`}>
      <span className={styles.badgeDot} />
      {label}
    </div>
  )
}

/* ─── Step Tracker ─── */
function StepTracker({ status }) {
  const steps = [
    { label: 'Permission',   active: status === 'requesting',                                  doneWhen: ['active','stopped','cancelled','denied','error'] },
    { label: 'Live Preview', active: status === 'active',                                      doneWhen: ['stopped'] },
    { label: 'Lifecycle',    active: ['stopped','cancelled','denied','error'].includes(status), doneWhen: [] },
  ]

  return (
    <div className={styles.steps}>
      {steps.map((s, i) => {
        const isDone = s.doneWhen.includes(status)
        const state  = isDone ? 'done' : s.active ? 'active' : 'pending'
        return (
          <div key={s.label} className={`${styles.step} ${styles[`step_${state}`]}`}>
            <div className={styles.stepLeft}>
              <div className={styles.stepBullet}>
                {isDone ? (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1 4.5L3.5 7L8 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              {i < 2 && <div className={styles.stepLine} />}
            </div>
            <span className={styles.stepLabel}>{s.label}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Idle ─── */
function IdleState({ onStart }) {
  return (
    <div className={styles.stateCard}>
      <div className={styles.stateIconWrap}>
        <div className={styles.idleRing} />
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" className={styles.idleIcon}>
          <rect x="4" y="10" width="44" height="30" rx="4" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="26" cy="25" r="8" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="26" cy="25" r="3" fill="currentColor"/>
          <path d="M20 38L26 44L32 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="26" y1="38" x2="26" y2="44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      <div className={styles.stateText}>
        <h2 className={styles.stateHeadline}>Ready to Test</h2>
        <p className={styles.stateBody}>
          Click the button below to open the browser screen picker.
          You can share a tab, a window, or your entire screen.
        </p>
      </div>

      <Button size="lg" onClick={onStart}>Start Screen Sharing</Button>

      <div className={styles.capGrid}>
        {['Permission states','Live preview','Stream metadata','Lifecycle detection'].map(c => (
          <div key={c} className={styles.capItem}>
            <div className={styles.capCheck}>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1 4.5L3.5 7L8 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {c}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Requesting ─── */
function RequestingState() {
  return (
    <div className={styles.stateCard}>
      <div className={styles.loaderWrap}>
        <div className={styles.loaderRingOuter} />
        <div className={styles.loaderRingInner} />
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className={styles.loaderIcon}>
          <rect x="2" y="5" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </div>

      <div className={styles.stateText}>
        <h2 className={styles.stateHeadline}>Waiting for Permission</h2>
        <p className={styles.stateBody}>
          The screen picker is open. Select a source to begin sharing.
        </p>
      </div>

      <div className={styles.shimmerBar}>
        <div className={styles.shimmerFill} />
      </div>

      <p className={styles.hintText}>
        No picker appeared? Check for a blocked popup in Chrome&apos;s address bar.
      </p>
    </div>
  )
}

/* ─── Active ─── */
function ActiveState({ videoRef, metadata, onStop }) {
  return (
    <div className={styles.activeWrap}>
      <div className={styles.liveBar}>
        <div className={styles.liveDot} />
        <span>Stream Active</span>
        {metadata && <span className={styles.liveSource}>{metadata.displaySurface}</span>}
      </div>

      <div className={styles.videoWrap}>
        <video ref={videoRef} className={styles.video} autoPlay muted playsInline />
        <div className={styles.cornerTL} />
        <div className={styles.cornerTR} />
        <div className={styles.cornerBL} />
        <div className={styles.cornerBR} />
        <div className={styles.videoScanline} />
      </div>

      {metadata && (
        <div className={styles.metaStrip}>
          <MetaItem label="Display Type" value={metadata.displaySurface} />
          <div className={styles.metaDivider} />
          <MetaItem label="Resolution"   value={`${metadata.width} × ${metadata.height}px`} />
          <div className={styles.metaDivider} />
          <MetaItem label="Frame Rate"   value={`${metadata.frameRate} fps`} />
          <div className={styles.metaDivider} />
          <MetaItem label="Source"       value={metadata.label} truncate />
        </div>
      )}

      <Button variant="danger" onClick={onStop}>Stop Sharing</Button>
    </div>
  )
}

function MetaItem({ label, value, truncate }) {
  return (
    <div className={styles.metaItem}>
      <span className={styles.metaLabel}>{label}</span>
      <span className={`${styles.metaValue} ${truncate ? styles.metaTrunc : ''}`} title={value}>
        {value || '—'}
      </span>
    </div>
  )
}

/* ─── End State ─── */
function EndState({ status, errorMessage, onRetry, onBack }) {
  const configs = {
    stopped: {
      bg: styles.endCard_neutral,
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
          <rect x="16" y="16" width="16" height="16" rx="3" fill="currentColor" opacity="0.6"/>
        </svg>
      ),
      title: 'Screen Sharing Stopped',
      desc:  'The stream ended. Start a fresh test or go back to the homepage.',
    },
    cancelled: {
      bg: styles.endCard_warning,
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
          <path d="M16 16L32 32M32 16L16 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Picker Dismissed',
      desc:  'You closed the screen picker without selecting a source.',
    },
    denied: {
      bg: styles.endCard_danger,
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
          <path d="M24 14V26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="24" cy="33" r="2.5" fill="currentColor"/>
        </svg>
      ),
      title: 'Permission Denied',
      desc:  'Screen sharing was blocked. Check your browser or system settings.',
    },
    error: {
      bg: styles.endCard_danger,
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M24 8L44 40H4L24 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.3"/>
          <path d="M24 20V30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="24" cy="36" r="2.5" fill="currentColor"/>
        </svg>
      ),
      title: 'An Error Occurred',
      desc:  errorMessage || 'Something went wrong requesting screen access.',
    },
  }

  const cfg = configs[status]

  return (
    <div className={`${styles.endCard} ${cfg.bg}`}>
      <div className={styles.endIcon}>{cfg.icon}</div>
      <div className={styles.endText}>
        <h2 className={styles.endTitle}>{cfg.title}</h2>
        <p className={styles.endDesc}>{cfg.desc}</p>
        {status === 'denied' && (
          <div className={styles.tipBox}>
            <p className={styles.tipTitle}>How to fix in Chrome</p>
            <ul>
              <li>Click the 🔒 icon in the address bar</li>
              <li>Set &quot;Window management&quot; → Allow</li>
              <li>Reload the page and try again</li>
            </ul>
          </div>
        )}
      </div>
      <div className={styles.endActions}>
        <Button variant="primary"   onClick={onRetry}>Retry Screen Test</Button>
        <Button variant="secondary" onClick={onBack}>Back to Home</Button>
      </div>
    </div>
  )
}
