import {getSkaffoldDownloadInfo} from '../src/main'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

let os = {} as any

beforeAll(() => {
  os.platform = 'aix'
})

test('Throws on unsupported platforms', async () => {
  expect(getSkaffoldDownloadInfo('latest')).resolves.toThrow
})
