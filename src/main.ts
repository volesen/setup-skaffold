import * as os from 'os'
import * as fs from 'fs'
import * as util from 'util'
import * as path from 'path'

import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'

const skaffoldExecutableName =
  os.platform() === 'win32' ? 'skaffold.exe' : 'skaffold'

type SkaffoldDownloadInfo = {
  downloadUrl: string
  filename: string
}

export function getSkaffoldDownloadInfo(version: string): SkaffoldDownloadInfo {
  const filenames = new Map([
    ['linux', 'skaffold-linux-amd64'],
    ['darwin', 'skaffold-darwin-amd64'],
    ['win32', 'skaffold-windows-amd64']
  ])

  const filename = filenames.get(os.platform())
  if (filename === undefined) {
    throw new Error('Unsupported platform')
  }

  const downloadUrl = util.format(
    'https://storage.googleapis.com/skaffold/releases/%s/%s',
    version,
    filename
  )
  return {downloadUrl, filename}
}

async function downloadSkaffold(version: string): Promise<string> {
  let cachedToolPath = tc.find('skaffold', version)

  if (!cachedToolPath) {
    const skaffoldDownloadInfo = getSkaffoldDownloadInfo(version)

    try {
      const downloadPath = await tc.downloadTool(
        skaffoldDownloadInfo.downloadUrl
      )

      // Cache downloaded skaffold executable as `skaffold`
      cachedToolPath = await tc.cacheFile(
        downloadPath,
        skaffoldExecutableName,
        'skaffold',
        version
      )
    } catch (error) {
      core.setFailed(error.message)
    }
  }

  // Make `skaffold` binary executable
  const skaffoldPath = path.join(cachedToolPath, skaffoldExecutableName)
  fs.chmodSync(skaffoldPath, '777')

  return cachedToolPath
}

async function run(): Promise<void> {
  try {
    const version = core.getInput('version')

    const cachedSkaffoldPath = await downloadSkaffold(version)

    core.addPath(cachedSkaffoldPath)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
