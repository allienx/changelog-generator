import { Octokit } from '@octokit/rest'
import { getCommitsSummary } from 'src/get-commits-summary'
import { getReleaseCommits } from 'src/get-release-commits'
import { updateReleaseBody } from 'src/update-release-body'

const token = process.env.GITHUB_TOKEN

if (!token) {
  console.error('GITHUB_TOKEN environment variable is required')
  process.exit(1)
}

const args = process.argv.slice(2)

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag)
  return idx !== -1 ? args[idx + 1] : ''
}

const owner = getArg('--owner')
const repo = getArg('--repo')
const branch = getArg('--branch') ?? 'main'

if (!owner || !repo) {
  console.error(
    'Usage: tsx scripts/update-all-releases.ts --owner <owner> --repo <repo> [--branch <branch>]',
  )
  process.exit(1)
}

main({ owner, repo, branch }).catch(console.error)

async function main({
  owner,
  repo,
  branch,
}: {
  owner: string
  repo: string
  branch: string
}) {
  const octokit = new Octokit({ auth: token })

  const releaseInfos = await getReleaseCommits({
    octokit,
    owner,
    repo,
    branch,
    log: console.log,
  })

  console.log(`\nFound ${releaseInfos.length} release(s) to update\n`)

  for (const info of releaseInfos) {
    const summary = getCommitsSummary(info.res, {
      owner,
      repo,
      releaseTag: info.head,
      base: info.base,
      head: info.head,
    })

    console.log(`Updating ${info.head}:\n${summary}\n`)

    await updateReleaseBody({
      octokit,
      owner,
      repo,
      tagName: info.head,
      body: summary,
    })

    console.log(`Updated ${info.head}\n`)
  }
}
