'use client'

// Simple QR Code generator using SVG. Generates a deterministic visual QR-like pattern from a string.
// For production use, integrate a proper QR library, but this provides visual representation.

interface QRCodeProps {
  value: string
  size?: number
  className?: string
}

export function QRCode({ value, size = 180, className = '' }: QRCodeProps) {
  // Generate a deterministic pattern from the string
  const grid = 25
  const cells: boolean[] = []

  // Simple hash function for deterministic output
  let hash = 5381
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) + hash) + value.charCodeAt(i)
    hash = hash & hash
  }

  // Generate pattern
  for (let i = 0; i < grid * grid; i++) {
    hash = ((hash << 5) + hash) + i
    hash = hash & hash
    cells.push(((hash >>> 0) % 100) > 50)
  }

  // Add finder patterns (corners)
  const isFinder = (row: number, col: number) => {
    const inBox = (br: number, bc: number) =>
      row >= br && row < br + 7 && col >= bc && col < bc + 7
    return inBox(0, 0) || inBox(0, grid - 7) || inBox(grid - 7, 0)
  }

  const isFinderDark = (row: number, col: number) => {
    const inBox = (br: number, bc: number) => {
      if (row < br || row >= br + 7 || col < bc || col >= bc + 7) return null
      const r = row - br, c = col - bc
      // Outer 7x7 with inner 5x5 white and 3x3 black center
      if (r === 0 || r === 6 || c === 0 || c === 6) return true
      if (r === 1 || r === 5 || c === 1 || c === 5) return false
      return true
    }
    return inBox(0, 0) ?? inBox(0, grid - 7) ?? inBox(grid - 7, 0) ?? false
  }

  const cellSize = size / grid

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      shapeRendering="crispEdges"
    >
      <rect width={size} height={size} fill="white" />
      {Array.from({ length: grid * grid }).map((_, idx) => {
        const row = Math.floor(idx / grid)
        const col = idx % grid
        let dark = false
        if (isFinder(row, col)) {
          dark = isFinderDark(row, col)
        } else {
          dark = cells[idx]
        }
        return dark ? (
          <rect
            key={idx}
            x={col * cellSize}
            y={row * cellSize}
            width={cellSize}
            height={cellSize}
            fill="#0a0a14"
          />
        ) : null
      })}
    </svg>
  )
}

export default QRCode
