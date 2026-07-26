import test from 'node:test'
import assert from 'node:assert/strict'

import { buildPredictionPayload } from './api.js'

test('buildPredictionPayload maps assessment answers to the backend schema', () => {
  const payload = buildPredictionPayload({
    symptoms: 'dry skin and anxiety',
    assessment: { 0: 'Thin', 1: 'Irregular', 2: 'Light', 3: 'Dry', 4: 'Restless' },
    ocrText: 'prescription note',
  })

  assert.equal(payload.symptoms, 'dry skin and anxiety')
  assert.deepEqual(payload.assessment, {
    body_build: 'Thin',
    appetite: 'Irregular',
    sleep: 'Light',
    skin: 'Dry',
    personality: 'Restless',
  })
  assert.equal(payload.ocr_text, 'prescription note')
})
