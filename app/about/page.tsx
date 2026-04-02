export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ background: '#141414' }}>
      <h1 style={{
        fontFamily: 'var(--font-rinter)',
        fontWeight: 400,
        fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
        color: 'rgba(255,255,255,0.92)',
        letterSpacing: '-0.01em',
        lineHeight: 1.1,
        padding: '8rem 2.5rem 0',
      }}>
        About
      </h1>
    </main>
  )
}
