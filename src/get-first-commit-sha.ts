import type { Octokit } from '@octokit/rest'

export async function getFirstCommitSha({
  octokit,
  owner,
  repo,
  branch,
  log,
}: {
  octokit: Octokit
  owner: string
  repo: string
  branch: string
  log: (message: string) => void
}) {
  try {
    const allCommits = await octokit.paginate(
      'GET /repos/{owner}/{repo}/commits',
      {
        owner,
        repo,
        sha: branch,
      },
    )
    const firstCommit = allCommits[allCommits.length - 1]
    const sha = firstCommit?.sha || ''

    log(`First commit sha: ${sha}`)

    return sha
  } catch (err: any) {
    log(`Error getting latest release: ${err.message}`)

    return ''
  }
}
