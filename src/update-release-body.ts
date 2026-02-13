import { Octokit } from '@octokit/rest'

export async function updateReleaseBody({
  octokit,
  owner,
  repo,
  tagName,
  body,
}: {
  octokit: Octokit
  owner: string
  repo: string
  tagName: string
  body: string
}) {
  const release = await octokit.rest.repos.getReleaseByTag({
    owner,
    repo,
    tag: tagName,
  })

  const updatedRelease = await octokit.rest.repos.updateRelease({
    owner,
    repo,
    release_id: release.data.id,
    body,
  })

  return updatedRelease
}
