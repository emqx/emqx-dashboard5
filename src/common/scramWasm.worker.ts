import type { ScramProofInput, ScramWorkerResponse } from '@/types/scram'
import { deriveScramProofWithWasm } from './scramWasm'

self.onmessage = async ({ data }: MessageEvent<ScramProofInput>) => {
  let response: ScramWorkerResponse
  try {
    response = { result: await deriveScramProofWithWasm(data) }
  } catch (error) {
    response = {
      error: error instanceof Error ? error.message : 'SCRAM password derivation failed.',
    }
  }
  self.postMessage(response)
}

export {}
