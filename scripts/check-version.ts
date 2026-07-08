import * as fs from 'fs'
import * as path from 'path'

const DOCS_URL = 'https://developer.fnnas.com/docs/cli/fnpack/'
const ACTION_YML = path.join(__dirname, '..', 'action.yml')

async function getLatestVersion(): Promise<string> {
  const res = await fetch(DOCS_URL)
  const html = await res.text()
  const match = html.match(/fnpack-(\d+\.\d+\.\d+)-/)
  if (!match) throw new Error('Could not parse version from docs')
  return match[1]
}

function getCurrentVersion(): string {
  const content = fs.readFileSync(ACTION_YML, 'utf-8')
  const match = content.match(/default:\s*['"]?(\d+\.\d+\.\d+)['"]?/)
  if (!match) throw new Error('Could not parse current version from action.yml')
  return match[1]
}

function updateVersion(newVersion: string): void {
  let content = fs.readFileSync(ACTION_YML, 'utf-8')
  content = content.replace(
    /default:\s*['"]?\d+\.\d+\.\d+['"]?/,
    `default: '${newVersion}'`
  )
  fs.writeFileSync(ACTION_YML, content)
}

async function main() {
  const current = getCurrentVersion()
  const latest = await getLatestVersion()

  console.log(`Current: ${current}`)
  console.log(`Latest:  ${latest}`)

  if (current === latest) {
    console.log('Already up to date')
    return
  }

  console.log(`Updating to ${latest}...`)
  updateVersion(latest)
  console.log('Done')

  // Output for GitHub Actions
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `updated=true\nnew_version=${latest}\n`)
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
