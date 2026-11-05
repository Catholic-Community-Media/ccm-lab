import { describe, expect, it } from 'vitest'
import { contrastRatio, luminance, parseHex, parseRootTokens } from '@/styles/contrast'
import { CONTRAST_PAIRS, TOKEN_NAMES } from '@/styles/tokenContract'

describe('contrast', () => {
  it('parses #rrggbb only', () => {
    expect(parseHex('#d13239')).toEqual([209, 50, 57])
    expect(() => parseHex('#fff')).toThrow()
    expect(() => parseHex('rgb(0,0,0)')).toThrow()
  })
  it('computes WCAG ratios', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 1)
    expect(contrastRatio('#3954a5', '#ffffff')).toBeCloseTo(7.03, 1)
    expect(contrastRatio('#ffbd00', '#0b1220')).toBeCloseTo(11.17, 1)
    expect(contrastRatio('#a', '#b')).toBeNaN()
  })
  it('luminance is 0 for black and 1 for white', () => {
    expect(luminance('#000000')).toBe(0)
    expect(luminance('#ffffff')).toBeCloseTo(1, 5)
  })
  it('parses the :root block including double-dash names', () => {
    const css = ':root {\n  --color-bg: #0e1014;\n  --step--1: 0.875rem;\n}\n.x { --color-bg: #fff; }'
    expect(parseRootTokens(css)).toEqual({ '--color-bg': '#0e1014', '--step--1': '0.875rem' })
  })
})

describe('token contract', () => {
  it('has no duplicates and every pair references contract tokens', () => {
    expect(new Set(TOKEN_NAMES).size).toBe(TOKEN_NAMES.length)
    for (const p of CONTRAST_PAIRS) {
      expect(TOKEN_NAMES).toContain(p.fg)
      expect(TOKEN_NAMES).toContain(p.bg)
    }
  })
})
