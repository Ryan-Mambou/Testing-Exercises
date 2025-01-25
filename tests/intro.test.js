import { describe, it, test, expect } from "vitest";
import { max, fizzBuzz, calculateAverage, factorial } from "../src/intro";

describe("max", () => {
  it("should return the first number if it is greater", () => {
    expect(max(2, 1)).toBe(2);
  });
  it("should return the second number if it is greater", () => {
    expect(max(1, 2)).toBe(2);
  });
  it("should return the first number if they are equal", () => {
    expect(max(2, 2)).toBe(2);
  });
});

describe("fizzBuzz", () => {
  it("should return Fizz if the number is divisible by 3", () => {
    expect(fizzBuzz(3)).toBe("Fizz");
  });
  it("should return Buzz if the number is divisible by 5", () => {
    expect(fizzBuzz(5)).toBe("Buzz");
  });
  it("should return FizzBuzz if the number is divisible by 3 and 5", () => {
    expect(fizzBuzz(15)).toBe("FizzBuzz");
  });
  it("should return the number as a string if it is not divisible by 3 or 5", () => {
    expect(fizzBuzz(7)).toBe("7");
  });
});

describe("calculate the average", () => {
  it("should return the average of the numbers", () => {
    expect(calculateAverage([1, 2, 3])).toBe(2);
  });
  it("should return the average of the numbers", () => {
    expect(calculateAverage([1, 2, 3, 4])).toBe(2.5);
  });
  it("should return zero if the array is empty", () => {
    expect(calculateAverage([])).toBe(0);
  });
});

describe("factorial", () => {
  it("should return the factorial of the number", () => {
    expect(factorial(5)).toBe(120);
  });
  it("should return factorial does not exist for negative numbers", () => {
    expect(factorial(-1)).toBe("factorial does not exist for negative numbers");
  });
  it("should return 1 for 0", () => {
    expect(factorial(0)).toBe(1);
  });
});
