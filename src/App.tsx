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

  return (
    <main className="pipeline-app">
      <header className="pipeline-header">
        <h1>CI Pipeline Simulator</h1>
        <p>
          Configure each stage outcome, then run the pipeline. Stages execute
          sequentially and fail fast.
        </p>
      </header>

      <section className="pipeline-controls" aria-label="Stage configuration">
        <h2>Stage Outcomes</h2>
        <ul className="stage-list">
          {PIPELINE_STAGES.map((stage) => (
            <li key={stage}>
              <label className="stage-toggle">
                <input
                  type="checkbox"
                  aria-label={`${stage} should pass`}
                  checked={outcomes[stage]}
                  onChange={() => toggleStage(stage)}
                />
                <span>{stage}</span>
                <span className="stage-outcome">
                  {outcomes[stage] ? 'pass' : 'fail'}
                </span>
              </label>
            </li>
          ))}
        </ul>
        <button type="button" className="run-button" onClick={handleRunPipeline}>
          Run Pipeline
        </button>
      </section>

      {result && (
        <section className="pipeline-results" aria-label="Pipeline results">
          <h2>Results</h2>
          <dl className="result-summary">
            <div>
              <dt>Overall status</dt>
              <dd className={`status-${result.overallStatus}`}>
                {result.overallStatus}
              </dd>
            </div>
            <div>
              <dt>Blocked stage</dt>
              <dd>{result.blockedStage ?? 'none'}</dd>
            </div>
          </dl>

          <ol className="stage-results">
            {result.stageResults.map(({ stage, status }) => (
              <li key={stage} className={`stage-result status-${status}`}>
                <span>{stage}</span>
                <span>{status}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  )
}


export default App
