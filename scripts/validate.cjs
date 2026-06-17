const { spawnSync } = require('child_process')

const stages = [
  { name: 'Lint', cmd: 'npm', args: ['run', 'lint'] },
  { name: 'Tests', cmd: 'npm', args: ['run', 'test'] },
  { name: 'Build', cmd: 'npm', args: ['run', 'build'] },
]

const results = []
let blocked = false

for (const stage of stages) {
  if (blocked) {
    results.push({ name: stage.name, status: 'Not Executed' })
    continue
  }

  const result = spawnSync(stage.cmd, stage.args, { stdio: 'inherit', shell: true })

  if (result.status === 0) {
    results.push({ name: stage.name, status: 'Passed' })
  } else {
    results.push({ name: stage.name, status: 'Failed' })
    blocked = true
  }
}

const divider = '====================================='
const pad = (label) => label.padEnd(7)

console.log('\n' + divider)
console.log('Pipeline Summary')
console.log(divider + '\n')

for (const { name, status } of results) {
  console.log(pad(name) + status)
}

console.log('')

if (blocked) {
  console.log('Push Blocked')
  process.exit(1)
} else {
  console.log('Push Allowed')
  process.exit(0)
}
