export function mergeGroupBysToSingleField(
  data: any[],
  groupBy: string[],
  singleFieldName: string,
): any[] {
  const result: any[] = []

  data.forEach((d) => {
    const newD: any = { ...d }
    let singleFieldValue = ''
    groupBy.forEach((xField: any, i: number) => {
      if (i > 0) {
        singleFieldValue += '_' + d[xField]
      } else {
        singleFieldValue += d[xField]
      }
    })
    newD[singleFieldName] = singleFieldValue
    result.push(newD)
  })

  return result
}

export function getStackGroups(
  data: any[],
  groupBy: string[],
  stackBy: string[],
  reportValues: string[],
): { [stackId: string]: string[] } {
  const result: { [stackId: string]: string[] } = {}

  const dataRef: any = data && data.length > 0 ? data[0] : {}
  reportValues.forEach((rv) => {
    const stackGroupValues: string[] = []
    Object.keys(dataRef).forEach((k) => {
      if (k.startsWith(rv) && !(groupBy.includes(k) || stackBy.includes(k))) {
        stackGroupValues.push(k)
      }
    })

    result[rv] = stackGroupValues
  })

  return result
}

export function getTimeSpanString(durationInMs: number) {
  const h = Math.floor(durationInMs / (60 * 60 * 1000))
  const remainingM = durationInMs - h * 60 * 60 * 1000
  const m = Math.floor(remainingM / (60 * 1000))
  const remainingS = durationInMs - h * 60 * 60 * 1000 - m * 60 * 1000
  const s = Math.floor(remainingS / 1000)
  const remainingMs = durationInMs - h * 60 * 60 * 1000 - m * 60 * 1000 - s * 1000
  const ms = Math.floor(remainingMs)
  if (h > 0) {
    return `${h}h ${m}m ${s}s ${ms}ms`
  }
  if (m > 0) {
    return `${m}m ${s}s ${ms}ms`
  }
  if (s > 0) {
    return `${s}s ${ms}ms`
  }
  return `${ms}ms`
}
