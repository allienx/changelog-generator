import * as core from '@actions/core'
import * as github from '@actions/github'
import { compareCommits } from 'src/compare-commits'
import { getCommitsSummary } from 'src/get-commits-summary'

const GIT_EMPTY_TREE_SHA = '4b825dc642cb6eb9a060e54bf8d69288fbee4904'

async function run() {
  try {
    const token = core.getInput('github-token', { required: true })
    const base = core.getInput('base') || GIT_EMPTY_TREE_SHA
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
