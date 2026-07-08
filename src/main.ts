import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs'

const BASE_URL = 'https://static2.fnnas.com/fnpack'
const DOCS_URL = 'https://developer.fnnas.com/docs/cli/fnpack/'

export function getPlatform(platform: string = os.platform()): string {
  switch (platform) {
    case 'linux':
      return 'linux'
    case 'darwin':
      return 'darwin'
    case 'win32':
      return 'windows'
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}

export function getArch(arch: string = os.arch()): string {
  switch (arch) {
    case 'x64':
      return 'amd64'
    case 'arm64':
      return 'arm64'
    default:
      throw new Error(`Unsupported architecture: ${arch}`)
  }
}

export function buildFilename(version: string, platform: string, arch: string): string {
  const ext = platform === 'windows' ? '.exe' : ''
  return `fnpack-${version}-${platform}-${arch}${ext}`
}

export async function getLatestVersion(url: string = DOCS_URL): Promise<string> {
  const res = await fetch(url)
  const html = await res.text()
  const match = html.match(/fnpack-(\d+\.\d+\.\d+)-/)
  if (!match) throw new Error('Could not parse version from docs')
  return match[1]
}

export function getCurrentVersion(content: string): string {
  const match = content.match(/default:\s*['"]?(\d+\.\d+\.\d+)['"]?/)
  if (!match) throw new Error('Could not parse current version from action.yml')
  return match[1]
}

async function run(): Promise<void> {
  try {
    const version = core.getInput('version', { required: true })
    const dir = core.getInput('dir')
    const platform = getPlatform()
    const arch = getArch()

    if (platform === 'windows' && arch === 'arm64') {
      throw new Error('Windows ARM64 is not supported')
    }

    const ext = platform === 'windows' ? '.exe' : ''
    const filename = buildFilename(version, platform, arch)
    const url = `${BASE_URL}/${filename}`
    const cacheKey = `fnpack-${version}-${platform}-${arch}`

    let toolPath = tc.find('fnpack', version, arch)
    if (!toolPath) {
      core.info(`Cache miss for ${cacheKey}`)
      core.info(`Downloading fnpack ${version} for ${platform}-${arch}...`)
      const downloadPath = await tc.downloadTool(url)
      toolPath = await tc.cacheFile(downloadPath, `fnpack${ext}`, 'fnpack', version, arch)
      core.info(`Cached ${cacheKey} at ${toolPath}`)
    } else {
      core.info(`Cache hit for ${cacheKey}: ${toolPath}`)
    }

    const binPath = path.join(toolPath, `fnpack${ext}`)
    fs.chmodSync(binPath, 0o755)
    core.addPath(toolPath)
    core.setOutput('fnpack-path', binPath)
    if (dir) core.exportVariable('FNPACK_DIR', dir)
    core.info(`fnpack ${version} installed: ${binPath}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
