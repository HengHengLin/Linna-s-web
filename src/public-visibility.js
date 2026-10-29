// Public presentation is independent of internal review metadata.
export const visitorEntries = entries => entries.filter(e => e.kind !== 'journal' && e.status !== 'demo');
// Older cloud snapshots can still contain the retired journal type during rollout.
// Remove it before validation/state assignment; never render or persist its contents.
export function withoutRetiredContent(snapshot) {
  return Array.isArray(snapshot?.entries) ? {...snapshot, entries:snapshot.entries.filter(e => e?.kind !== 'journal')} : snapshot;
}
