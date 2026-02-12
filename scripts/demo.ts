import { Octokit } from '@octokit/rest'
import { compareCommits } from 'lib/compare-commits'

main().catch(console.error)

async function main() {
  const octokit = new Octokit({
    auth: '',
  })

  const owner = ''
  const repo = ''
  const base = ''
  const head = ''

  const { data } = await compareCommits({
    octokit,
    owner,
    repo,
    base,
    head,
  })

  const commits = data.commits.map((obj) => {
    const author = obj.author?.login
    const sha = obj.sha.substring(0, 7)
    const message = obj.commit.message.split('\n')[0]

    return author
      ? `- ${message} by @${author} in ${sha}`
      : `- ${message} in ${sha}`
  })

  const lines = [
    '### Changelog\n',
    ...commits,
    '',
    `**Compare**: https://github.com/${owner}/${repo}/compare/${base}...${head}`,
  ]

  console.log(lines.join('\n'))
}
