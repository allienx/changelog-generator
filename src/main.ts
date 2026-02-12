import * as core from '@actions/core'
import * as github from '@actions/github'
import { compareCommits } from 'src/compare-commits'
import { getCommitsSummary } from 'src/get-commits-summary'
import { getFirstCommitSha } from 'src/get-first-commit-sha'
import { getMostRecentTag } from 'src/get-most-recent-tag'

async function run() {
  try {
    const token = core.getInput('github-token', { required: true })
    const releaseTag = core.getInput('release-tag') || ''
    let base = core.getInput('base') || ''
    const head = core.getInput('head') || 'HEAD'

    const { owner, repo } = github.context.repo
    const branch = github.context.ref.replace('refs/heads/', '')

    core.info(`Owner: ${owner}`)
    core.info(`Repo: ${repo}`)
    core.info(`Base ref: ${base}`)
    core.info(`Head ref: ${head}`)
    core.info(`Branch: ${branch}`)

    const octokit = github.getOctokit(token)

    if (!base) {
      base = await getMostRecentTag({
        octokit,
        owner,
        repo,
        log: core.info,
      })
    }

    if (!base) {
      base = await getFirstCommitSha({
        octokit,
        owner,
        repo,
        branch,
        log: core.info,
      })
    }

    const res = await compareCommits({ octokit, owner, repo, base, head })
    const summary = getCommitsSummary(res, { owner, repo, base, head })

    core.info(summary)
    core.setOutput('summary', summary)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed('Unknown error occurred')
    }
  }
}

run()
