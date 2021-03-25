import { lastUpdated } from 'src/../data/time.json'

import { DateTime } from 'luxon'

export function getLastUpdatedDate() {
  const utc = DateTime.fromISO(lastUpdated, { zone: 'UTC' })
  const local = utc.toLocal()
  return `${local.toJSDate().toLocaleString()} (${local.zoneName})`
}
