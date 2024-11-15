export type Timeline = number[];

/**
 * Expand the timeline to the maxTime, this function will mutate the timeline in place *
 * @example
 * ```js
 * const timeline = [3, 5, 8];
 * const expandedTimeline = expandTimelineTo(timeline, 20); // [3, 5, 8, 11, 16]
 * ```
 */
export function expandTimelineTo(
  timeline: Timeline,
  maxTime: number,
): Timeline {
  const last = timeline[timeline.length - 1];
  let i = 0;
  while (last + timeline[i] <= maxTime) {
    timeline.push(last + timeline[i]);
    i++;
  }
  return timeline;
}

/**
 * Merge timelines to be a single timeline
 *
 * @example
 * ```js
 * const timeline1 = [0, 1, 2, 3];
 * const timeline2 = [0, 2, 4, 6];
 * const mergedTimeline = createMergedTimeline([timeline1, timeline2]); // [0, 1, 2, 3, 4, 6]
 * ```
 */
export function createMergedTimeline(timelines: Timeline[]): Timeline {
  const maxTime = timelines.reduce((acc, timeline) => {
    return Math.max(acc, timeline[timeline.length - 1]);
  }, 0);

  if (maxTime === 0) {
    return [0];
  }

  for (const timeline of timelines) {
    // expanding exist timeline to nearset the maxTime
    expandTimelineTo(timeline, maxTime);
  }
  const timelineSet = new Set<number>();
  for (const timeline of timelines) {
    for (const time of timeline) {
      timelineSet.add(time);
    }
  }

  return Array.from(timelineSet).sort((a, b) => a - b);
}
