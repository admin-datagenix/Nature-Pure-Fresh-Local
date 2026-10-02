export function delay(ms = 80) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
