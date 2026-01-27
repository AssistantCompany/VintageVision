#!/usr/bin/env npx tsx
/**
 * Run VintageVision Evaluation Harness
 */

import { runFullEvaluation, runSmokeTest, testSingleItem, formatReport } from './evaluationHarness.js'
import { GROUND_TRUTH_ITEMS } from './groundTruth.js'

async function main() {
  const args = process.argv.slice(2)
  const mode = args[0] || 'smoke'

  console.log('═══════════════════════════════════════════════════════════════')
  console.log('         VINTAGEVISION EVALUATION HARNESS')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('')

  try {
    if (mode === 'smoke') {
      console.log('Running SMOKE TEST (5 representative items)...')
      console.log('')
      const report = await runSmokeTest()
      console.log(formatReport(report))
    } else if (mode === 'full') {
      console.log('Running FULL EVALUATION (all 50 items)...')
      console.log('This will take several minutes and use OpenAI API credits.')
      console.log('')
      const report = await runFullEvaluation()
      console.log(formatReport(report))
    } else if (mode === 'single') {
      const itemId = args[1]
      if (!itemId) {
        console.error('Usage: npx tsx src/testing/runEvaluation.ts single <item-id>')
        process.exit(1)
      }
      console.log('Testing single item: ' + itemId)
      console.log('')
      const result = await testSingleItem(itemId)
      console.log('RESULT:')
      console.log('  Item: ' + result.itemId)
      console.log('  Expected: ' + result.groundTruth.expected.name)
      console.log('  AI Said: ' + (result.aiOutput?.name || 'ERROR'))
      console.log('  Overall Score: ' + result.overallScore + '%')
      console.log('')
      console.log('Scores:')
      for (const [key, score] of Object.entries(result.scores)) {
        const status = score >= 70 ? '✓' : score >= 40 ? '~' : '✗'
        console.log('  ' + status + ' ' + key + ': ' + score + '%')
      }
      if (result.failures.length > 0) {
        console.log('')
        console.log('Failures:')
        for (const failure of result.failures) {
          console.log('  • ' + failure)
        }
      }
    } else if (mode === 'list') {
      console.log('Available test items:')
      console.log('')
      for (const item of GROUND_TRUTH_ITEMS) {
        console.log('  ' + item.id + ': ' + item.expected.name + ' (' + item.expected.domainExpert + ')')
      }
    } else {
      console.error('Unknown mode: ' + mode)
      console.error('Usage: smoke | full | single <id> | list')
      process.exit(1)
    }
  } catch (error) {
    console.error('Evaluation failed:', error)
    process.exit(1)
  }
}

main()
