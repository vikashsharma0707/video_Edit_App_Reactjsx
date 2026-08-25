// Render pipeline — manages the frame-by-frame rendering process

export const PIPELINE_STAGES = [
  'preparing',
  'rendering',
  'encoding',
  'finalizing',
];

export function getStageLabel(stage) {
  const labels = {
    preparing: 'Preparing render',
    rendering: 'Rendering frames',
    encoding: 'Encoding video',
    finalizing: 'Finalizing output',
    done: 'Export complete',
  };
  return labels[stage] || stage;
}

export function estimateRemainingTime(progress, elapsedMs) {
  if (progress <= 0 || progress >= 100) return 0;
  const totalEstimate = (elapsedMs / progress) * 100;
  return Math.max(0, totalEstimate - elapsedMs);
}
