export function formatNumberWithSpaces(num) {
  if (num.toString().length < 4) return num;

  return num
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
