import { Endpoints } from '@octokit/types'

type CompareCommitsResponse =
  Endpoints['GET /repos/{owner}/{repo}/compare/{base}...{head}']['response']

export function getCommitsSummary(
  res: CompareCommitsResponse,
  {
    owner,
    repo,
    base,
    head,
  }: {
    owner?: string
    repo?: string
    base?: string
    head?: string
  } = {},
) {
  const commits = res.data.commits.map((obj) => {
    const author = obj.author?.login
    const sha = obj.sha.substring(0, 7)
    const message = obj.commit.message.split('\n')[0]

    return author
      ? `- ${message} by @${author} in ${sha}`
      : `- ${message} in ${sha}`
  })

  const lines = ['### Changelog\n', ...commits]

  if (owner && repo && base && head) {
    lines.push(
      `\n**Compare**: https://github.com/${owner}/${repo}/compare/${base}...${head}`,
    )
  }

  return lines.join('\n')
}
