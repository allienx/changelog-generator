import * as core from '@actions/core'
import * as github from '@actions/github'
import { compareCommits } from 'lib/compare-commits'
import { getCommitsSummary } from 'lib/get-commits-summary'

async function run() {
  try {
    const token = core.getInput('github-token', { required: true })
    const base = core.getInput('base', { required: true })
    const head = core.getInput('head') || 'HEAD'
    const { owner, repo } = github.context.repo

    core.info(`Owner: ${owner}`)
    core.info(`Repo: ${repo}`)
    core.info(`Base ref: ${base}`)
    core.info(`Head ref: ${head}`)

    const octokit = github.getOctokit(token)

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
