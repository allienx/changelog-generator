import { Octokit } from '@octokit/rest'
import { Endpoints } from '@octokit/types'
import { compareCommits } from 'src/compare-commits'
import { getFirstCommitSha } from 'src/get-first-commit-sha'

type CompareCommitsResponse =
  Endpoints['GET /repos/{owner}/{repo}/compare/{base}...{head}']['response']

interface ReleasePair {
  base: string | null
  head: string
}

interface ReleaseInfo extends ReleasePair {
  base: string
  res: CompareCommitsResponse
}

export async function getReleaseCommits({
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
}): Promise<ReleaseInfo[]> {
  const releases = await octokit.paginate(
    'GET /repos/{owner}/{repo}/releases',
    {
      owner,
      repo,
      per_page: 100,
    },
  )

  const tags = releases.map((release) => release.tag_name)

  // Reverse the tags so the oldest one is first.
  tags.reverse()

  console.log('Tags:', tags)

  if (tags.length < 1) {
    return []
  }

  const pairs: ReleasePair[] = []

  if (tags.length > 1) {
    pairs.push({
      base: null,
      head: tags[0],
    })
  }

  if (tags.length > 2) {
    for (let i = 0; i < tags.length - 1; i++) {
      pairs.push({
        base: tags[i],
        head: tags[i + 1],
      })
    }
  }

  const infos: ReleaseInfo[] = []

  for (const pair of pairs) {
    let base = pair.base

    if (!base) {
      base = await getFirstCommitSha({
        octokit,
        owner,
        repo,
        branch,
        log,
      })
    }

    const res = await compareCommits({
      octokit,
      owner,
      repo,
      base,
      head: pair.head,
    })

    infos.push({
      base,
      head: pair.head,
      res,
    })
  }

  return infos
}
