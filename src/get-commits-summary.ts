import { Endpoints } from '@octokit/types'

type CompareCommitsResponse =
  Endpoints['GET /repos/{owner}/{repo}/compare/{base}...{head}']['response']

export function getCommitsSummary(
  res: CompareCommitsResponse,
  {
    owner,
    repo,
    releaseTag,
    base,
    head,
  }: {
    owner: string
    repo: string
    releaseTag?: string
    base?: string
    head?: string
  },
) {
  const commits = res.data.commits.map((obj) => {
    const author = obj.author?.login
    const sha = obj.sha
    const message = obj.commit.message.split('\n')[0]

    return getCommitLine({ message, sha, owner, repo, author })
  })

  const lines = ['### Changelog\n', ...commits]

  if (owner && repo && base && (releaseTag || head)) {
    lines.push(
      `\n**Compare**: https://github.com/${owner}/${repo}/compare/${base}...${releaseTag || head}`,
    )
  }

  return lines.join('\n')
}

function getCommitLine({
  message,
  sha,
  owner,
  repo,
  author,
}: {
  message: string
  sha: string
  owner: string
  repo: string
  author?: string
}) {
  const shaShort = sha.substring(0, 7)
  const shaLink = `[${shaShort}](https://github.com/${owner}/${repo}/commit/${sha})`

  return author
    ? `- ${message} by @${author} in ${shaLink}`
    : `- ${message} in ${shaLink}`
}
