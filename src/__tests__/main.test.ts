import { describe, it, expect } from 'vitest'
import { getPlatform, getArch, buildFilename, getCurrentVersion } from '../main'

describe('getPlatform', () => {
  it('returns linux for linux', () => {
    expect(getPlatform('linux')).toBe('linux')
  })

  it('returns darwin for darwin', () => {
    expect(getPlatform('darwin')).toBe('darwin')
  })

  it('returns windows for win32', () => {
    expect(getPlatform('win32')).toBe('windows')
  })

  it('throws for unsupported platform', () => {
    expect(() => getPlatform('freebsd')).toThrow('Unsupported platform')
  })
})

describe('getArch', () => {
  it('returns amd64 for x64', () => {
    expect(getArch('x64')).toBe('amd64')
  })

  it('returns arm64 for arm64', () => {
    expect(getArch('arm64')).toBe('arm64')
  })

  it('throws for unsupported arch', () => {
    expect(() => getArch('ia32')).toThrow('Unsupported architecture')
  })
})

describe('buildFilename', () => {
  it('builds linux filename', () => {
    expect(buildFilename('1.2.3', 'linux', 'amd64')).toBe('fnpack-1.2.3-linux-amd64')
  })

  it('builds windows filename with .exe', () => {
    expect(buildFilename('1.2.3', 'windows', 'amd64')).toBe('fnpack-1.2.3-windows-amd64.exe')
  })

  it('builds darwin arm64 filename', () => {
    expect(buildFilename('1.2.3', 'darwin', 'arm64')).toBe('fnpack-1.2.3-darwin-arm64')
  })
})

describe('getCurrentVersion', () => {
  it('parses version from action.yml content', () => {
    const content = `inputs:
  version:
    description: 'fnpack version to install'
    required: false
    default: '1.2.3'`
    expect(getCurrentVersion(content)).toBe('1.2.3')
  })

  it('parses version without quotes', () => {
    const content = `default: 1.2.3`
    expect(getCurrentVersion(content)).toBe('1.2.3')
  })

  it('throws for missing version', () => {
    expect(() => getCurrentVersion('no version here')).toThrow('Could not parse')
  })
})
