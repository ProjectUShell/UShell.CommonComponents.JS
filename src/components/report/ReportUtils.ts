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

  const dataRef: any = data[0]
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
