export function getShuffled<T> (array: T[]): T[] {
  const copy: T[] = [...array] 

  for (let i = copy.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1))

    ;[copy[i], copy[j]] = [copy[j], copy[i]] 
  }

  return copy
}
