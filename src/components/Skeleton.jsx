export function Skeleton({ w = '100%', h = 16, r = 10, style }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: r, ...style }} />
}

export function SkeletonCard() {
  return (
    <div className="glass-card skeleton-card">
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <Skeleton w={52} h={52} r={999} />
        <div style={{ flex: 1, display: 'grid', gap: 8 }}>
          <Skeleton w="60%" h={16} />
          <Skeleton w="40%" h={12} />
        </div>
      </div>
      <Skeleton h={12} />
      <Skeleton w="85%" h={12} />
      <div style={{ display: 'flex', gap: 8 }}>
        <Skeleton w={70} h={26} r={999} />
        <Skeleton w={70} h={26} r={999} />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="senior-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}