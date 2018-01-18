/**
 * @param {Array} array
 * @param {Nember} number
 * @returns {Number} index
 */
export function getNearestNumberOfArray (array, number) {
  let index = 0
  for (let i = index, l = array.length; i < l; i++) {
    if (Math.abs(number - array[i]) < Math.abs(number - array[index])) {
      index = i
    }
  }
  return index
}
