import { type Octokit } from '@octokit/rest'
import { type Endpoints } from '@octokit/types'

type CompareCommitsResponse =
  Endpoints['GET /repos/{owner}/{repo}/compare/{base}...{head}']['response']

export async function compareCommits({
  octokit,
  owner,
  repo,
  base,
  head,
}: {
  octokit: Octokit
  owner: string
  repo: string
  base: string
  head: string
}): Promise<CompareCommitsResponse> {
  return octokit.rest.repos.compareCommits({
    owner,
    repo,
    base,
    head,
  })
}
