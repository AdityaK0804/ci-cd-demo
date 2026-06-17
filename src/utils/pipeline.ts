export const PIPELINE_STAGES = ['Lint', 'Tests', 'Build'] as const

export type PipelineStage = (typeof PIPELINE_STAGES)[number]
export type StageStatus = 'passed' | 'failed' | 'skipped'
export type OverallStatus = 'passed' | 'failed'

export interface StageResult {
  stage: PipelineStage
  status: StageStatus
}

export interface PipelineResult {
  overallStatus: OverallStatus
  blockedStage: PipelineStage | null
  stageResults: StageResult[]
}

export type StageOutcomes = Record<PipelineStage, boolean>

export function runPipeline(outcomes: StageOutcomes): PipelineResult {
  const stageResults: StageResult[] = []
  let blockedStage: PipelineStage | null = null

  for (const stage of PIPELINE_STAGES) {
    if (blockedStage !== null) {
      stageResults.push({ stage, status: 'skipped' })
      continue
    }

    if (outcomes[stage]) {
      stageResults.push({ stage, status: 'passed' })
      continue
    }

    stageResults.push({ stage, status: 'failed' })
    blockedStage = stage
  }

  return {
    overallStatus: blockedStage === null ? 'passed' : 'failed',
    blockedStage,
    stageResults,
  }
}
