export function setCandidates (state,data ) {
  state.candidates = data
}
export function setCandidate (state,data ) {
  state.candidate = data
}
export function removeCandidate (state,index ) {
  state.candidates.splice(index,1)
}
