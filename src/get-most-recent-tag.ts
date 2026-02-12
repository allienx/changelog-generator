import type { Octokit } from '@octokit/rest'

export async function getMostRecentTag({
  octokit,
  owner,
  repo,
  log,
}: {
  octokit: Octokit
  owner: string
  repo: string
  log: (message: string) => void
}) {
  try {
    const { data } = await octokit.rest.repos.getLatestRelease({
      owner,
      repo,
    })

    log(`Latest release tag: ${data.tag_name}`)

    return data.tag_name
  } catch (err: any) {
    log(`Error getting latest release: ${err.message}`)

    return ''
  }
}
