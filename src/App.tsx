import { useState } from 'react'
import {
  PIPELINE_STAGES,
  type PipelineResult,
  type PipelineStage,
  type StageOutcomes,
  runPipeline,
} from './utils/pipeline'
import './App.css'

const defaultOutcomes: StageOutcomes = {
  Lint: true,
  Tests: true,
  Build: true,
}

const STAGE_ICONS: Record<string, string> = {
  passed: '✓',
  failed: '✗',
  skipped: '⏭',
}

const AUTOMATION_STEPS = [
  { label: 'Developer', sub: 'Writes and commits code' },
  { label: 'Husky Pre-Commit', sub: 'Runs lint on staged files' },
  { label: 'Husky Pre-Push', sub: 'Runs lint, tests, and build' },
  { label: 'GitHub Actions', sub: 'Re-runs full validation on CI' },
  { label: 'Branch Protection', sub: 'Blocks merge if checks fail' },
  { label: 'Merge Allowed', sub: 'All gates passed' },
]

function App() {
  const [outcomes, setOutcomes] = useState<StageOutcomes>(defaultOutcomes)
  const [result, setResult] = useState<PipelineResult | null>(null)

  function toggleStage(stage: PipelineStage) {
    setOutcomes((current) => ({
      ...current,
      [stage]: !current[stage],
    }))
  }

  function handleRunPipeline() {
    setResult(runPipeline(outcomes))
  }

  function getResultStatus(stage: PipelineStage) {
    return result?.stageResults.find((entry) => entry.stage === stage)?.status
  }

  return (
    <main className="pipeline-app">
      {/* ── Header ────────────────────────────────────────── */}
      <header className="pipeline-header">
        <div className="pipeline-header-badge">CI/CD</div>
        <h1 aria-label="CI Pipeline Simulator">Automated CI/CD Pipeline</h1>
        <p className="pipeline-header-sub">
          Fail-fast validation · Husky hooks · GitHub Actions · Branch protection
        </p>
      </header>

      {/* ── Pipeline Configuration ────────────────────────── */}
      <section className="panel" aria-label="Stage configuration">
        <h2 className="panel-title">Simulate Pipeline Stages</h2>
        <p className="panel-hint">
          Toggle each stage to simulate pass or fail, then run the pipeline to see fail-fast behavior.
        </p>

        <div className="flow" role="group" aria-label="Stage toggles">
          {PIPELINE_STAGES.map((stage, index) => (
            <div key={stage} className="flow-segment">
              <button
                type="button"
                className={`flow-node ${outcomes[stage] ? 'flow-node-pass' : 'flow-node-fail'}`}
                onClick={() => toggleStage(stage)}
                aria-pressed={outcomes[stage]}
                aria-label={`${stage}: click to toggle ${outcomes[stage] ? 'fail' : 'pass'}`}
              >
                <span className="flow-node-label">{stage}</span>
                <span className="flow-node-meta">
                  {outcomes[stage] ? 'pass' : 'fail'}
                </span>
              </button>
              {index < PIPELINE_STAGES.length - 1 && (
                <span className="flow-connector" aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>

        {/* Hidden accessible checkboxes for screen readers */}
        <div className="sr-only">
          {PIPELINE_STAGES.map((stage) => (
            <input
              key={stage}
              type="checkbox"
              aria-label={`${stage} should pass`}
              checked={outcomes[stage]}
              onChange={() => toggleStage(stage)}
            />
          ))}
        </div>

        <div className="run-row">
          <button type="button" className="run-button" onClick={handleRunPipeline}>
            Run Pipeline
          </button>
        </div>
      </section>

      {/* ── Results (shown after first run) ──────────────── */}
      {result && (
        <section aria-label="Pipeline results">
          {/* Verdict — primary visual focus */}
          <div
            className={`verdict ${result.overallStatus === 'passed' ? 'verdict-approved' : 'verdict-blocked'}`}
            aria-live="polite"
          >
            <span className="verdict-icon" aria-hidden="true">
              {result.overallStatus === 'passed' ? '✓' : '✗'}
            </span>
            <div className="verdict-body">
              <p className="verdict-label">Merge decision</p>
              <h2 className="verdict-title">
                {result.overallStatus === 'passed' ? 'Commit Approved' : 'Commit Blocked'}
              </h2>
              <p className="verdict-detail">
                {result.overallStatus === 'passed'
                  ? 'All stages passed. The change is ready to merge.'
                  : `Pipeline stopped at ${result.blockedStage}. Remaining stages were skipped.`}
              </p>
            </div>
          </div>

          {/* Execution Summary */}
          <div className="panel exec-panel" aria-label="Execution summary">
            <h2 className="panel-title">Execution Summary</h2>
            <ul className="exec-summary" role="list">
              {PIPELINE_STAGES.map((stage) => {
                const status = getResultStatus(stage) ?? 'passed'
                return (
                  <li key={stage} className={`exec-row exec-row-${status}`}>
                    <span className="exec-icon" aria-hidden="true">
                      {STAGE_ICONS[status]}
                    </span>
                    <span className="exec-stage">{stage}</span>
                    <span className={`exec-status status-${status}`}>
                      {status}
                    </span>
                    {status === 'skipped' && (
                      <span className="exec-note">skipped due to fail-fast</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Accessible screen reader summary */}
          <p className="sr-only">
            Overall status {result.overallStatus}. Blocked stage{' '}
            {result.blockedStage ?? 'none'}.
          </p>
        </section>
      )}

      {/* ── Real Automation Flow ──────────────────────────── */}
      <section className="panel panel-muted" aria-label="Real automation flow">
        <h2 className="panel-title">Real Automation Flow</h2>
        <p className="panel-hint">
          Validation runs automatically on every push and pull request.
        </p>
        <ol className="automation-steps" role="list">
          {AUTOMATION_STEPS.map((step, index) => (
            <li key={step.label} className="automation-step">
              <div className="automation-step-content">
                <span className="automation-step-label">{step.label}</span>
                <span className="automation-step-sub">{step.sub}</span>
              </div>
              {index < AUTOMATION_STEPS.length - 1 && (
                <span className="automation-step-arrow" aria-hidden="true">↓</span>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* ── Informational Note ────────────────────────────── */}
      <aside className="info-note" aria-label="About this simulator">
        <span className="info-note-icon" aria-hidden="true">ℹ</span>
        <p>
          This simulator visualizes the same fail-fast validation logic used by the actual Husky
          hooks and GitHub Actions workflow. Real validation runs automatically during{' '}
          <code>git push</code> and pull request events.
        </p>
      </aside>
    </main>
  )
}

export default App
