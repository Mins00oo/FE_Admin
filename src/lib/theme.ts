// Theme color hex values (backoffice.dc.html line 26) — for inline styles where
// a raw color is needed (gradients, dynamic status colors).
export const COLORS = {
  bg: '#F5F3EF',
  card: '#FFFFFF',
  ink: '#28231D',
  muted: '#948C81',
  line: '#EAE4DA',
  soft: '#F3EFE8',
  accent: '#E4572E',
  accentSoft: 'rgba(228,87,46,.1)',
  ok: '#1F8A5B',
  okSoft: 'rgba(31,138,91,.12)',
  sky: '#2A6FDB',
  skySoft: 'rgba(42,111,219,.12)',
  amber: '#B26A00',
  amberSoft: 'rgba(178,106,0,.12)',
  del: '#D6402E',
  delSoft: 'rgba(214,64,46,.1)',
  body: '#6b6355',
} as const

/** map a status-meta token name to a raw hex/rgba color. */
export function tokenColor(name: string): string {
  if (name in COLORS) return COLORS[name as keyof typeof COLORS]
  return name // already a hex like #8A8075
}
