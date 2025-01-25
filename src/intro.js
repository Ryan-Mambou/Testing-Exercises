// Lesson: Writing your first tests
export function max(a, b) {
  if (a > b) return a;
  else if (b > a) return b;
  return a;
}

// Exercise
export function fizzBuzz(n) {
  if (n % 3 === 0 && n % 5 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return n.toString();
}

export function calculateAverage(numbers) {
  if (numbers.length === 0) return 0;
  return numbers.reduce((a, b) => a + b) / numbers.length;
}

export function factorial(n) {
  if (n < 0) return "factorial does not exist for negative numbers";
  if (n === 0) return 1;
  return n * factorial(n - 1);
}
