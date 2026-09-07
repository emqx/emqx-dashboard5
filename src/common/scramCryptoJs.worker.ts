import type { ScramProofInput, ScramWorkerResponse } from '@/types/scram'
import { deriveScramProofWithCryptoJs } from './scramCryptoJs'

self.onmessage = ({ data }: MessageEvent<ScramProofInput>) => {
  let response: ScramWorkerResponse
  try {
    response = { result: deriveScramProofWithCryptoJs(data) }
  } catch (error) {
    response = {
      error: error instanceof Error ? error.message : 'SCRAM password derivation failed.',
    }
  }
  self.postMessage(response)
}

export {}
