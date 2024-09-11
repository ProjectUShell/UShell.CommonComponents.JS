const reportColorsDark: string[] = ['#bae1ff', '#baffc9', '#ffffba', '#ffdfba', '#ffb3ba']
const reportColors: string[] = ['#1b85b8', '#5a5255', '#559e83', '#ae5a41', '#c3cb71']
export function getReportColor(i: number, dark: boolean = false): string {
  const idx = i % reportColors.length
  return dark ? reportColorsDark[idx] : reportColors[idx]
}
