import { describe, expect, expectTypeOf, it, bef, beforeEach } from "vitest";
import {
  getCoupons,
  calculateDiscount,
  validateUserInput,
  isPriceInRange,
  isValidUsername,
  canDrive,
  fetchData,
  Stack,
  createProduct,
  isStrongPassword,
} from "../src/core";

describe("getCoupons", () => {
  it("should return an array of coupons", () => {
    const coupons = getCoupons();
    expectTypeOf(coupons).toBeArray();
    expect(coupons).toEqual([
      { code: "SAVE20NOW", discount: 0.2 },
      { code: "DISCOUNT50OFF", discount: 0.5 },
    ]);
  });
});

describe("calculateDiscount", () => {
  describe("Negative testing", () => {
    it("should return 'Invalid price' if price is not a number", () => {
      expect(calculateDiscount("price", "SAVE10")).toEqual("Invalid price");
    });
    it("should return 'Invalid price' if price is less than or equal to 0", () => {
      expect(calculateDiscount(0, "SAVE10")).toEqual("Invalid price");
    });
    it("should return 'Invalid discount code' if discountCode is not a string", () => {
      expect(calculateDiscount(100, 10)).toEqual("Invalid discount code");
    });
    it("should return the price if discountCode is not 'SAVE10' or 'SAVE20'", () => {
      expect(calculateDiscount(100, "SAVE30")).toEqual(100);
    });
  });

  describe("Positive testing", () => {
    it("should return the price with a 10% discount if discountCode is 'SAVE10'", () => {
      expect(calculateDiscount(100, "SAVE10")).toEqual(90);
    });
    it("should return the price with a 20% discount if discountCode is 'SAVE20'", () => {
      expect(calculateDiscount(100, "SAVE20")).toEqual(80);
    });
    it("should handle floating point numbers", () => {
      expect(calculateDiscount(100.5, "SAVE10")).toBeCloseTo(90.45);
    });
  });
});

describe("validateUserInput", () => {
  describe("Negative testing", () => {
    it("should return 'Invalid username' if username is invalid", () => {
      expect(validateUserInput(123, 18)).toEqual("Invalid username");
    });
    it("should return 'Invalid username' if username is less than 3 characters", () => {
      expect(validateUserInput("ry", 18)).toEqual("Invalid username");
    });
    it("should return 'Invalid age' if age is invalid", () => {
      expect(validateUserInput("ryan", "age")).toEqual("Invalid age");
    });
    it("should return 'Invalid age' if age is less than 18", () => {
      expect(validateUserInput("ryan", 17)).toEqual("Invalid age");
    });
    it("should return 'Invalid username, Invalid age' if both username and age are invalid", () => {
      expect(validateUserInput(123, "age")).toEqual(
        "Invalid username, Invalid age"
      );
    });
  });
  describe("Positive testing", () => {
    it("should return 'Validation successful' if both username and age are valid", () => {
      expect(validateUserInput("ryan", 18)).toEqual("Validation successful");
    });
  });
});

describe("isPrinceInRange", () => {
  describe("General cases", () => {
    it("should return true if price is in range", () => {
      expect(isPriceInRange(100, 50, 150)).toBe(true);
    });
    it("should return false if price is less than min", () => {
      expect(isPriceInRange(25, 50, 150)).toBe(false);
    });
    it("should return false if price is greater than max", () => {
      expect(isPriceInRange(200, 50, 150)).toBe(false);
    });
    it("should return false if price is not a number", () => {
      expect(isPriceInRange("price", 50, 150)).toBe(false);
    });
    it("should throw error if min greater than max", () => {
      const testFunction = () => isPriceInRange(50, 75, 25);
      expect(testFunction).toThrow(
        "Invalid range: min cannot be greater than max"
      );
    });
  });

  describe("Boundary cases", () => {
    it("should return true if price is equal to min", () => {
      expect(isPriceInRange(50, 50, 150)).toBe(true);
    });
    it("should return true if price is equal to max", () => {
      expect(isPriceInRange(150, 50, 150)).toBe(true);
    });
    it("should return true is price equals max and min", () => {
      expect(isPriceInRange(50, 50, 50)).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should return false if price is NaN", () => {
      expect(isPriceInRange(NaN, 50, 150)).toBe(false);
    });
    it("should return false if price is Infinity", () => {
      expect(isPriceInRange(Infinity, 50, 150)).toBe(false);
    });
  });
});

describe("isValidUsername", () => {
  describe("General cases", () => {
    it("should return true if username is within the length range", () => {
      expect(isValidUsername("ryanmambou")).toBe(true);
    });
    it("should return false if username is less than the minimum length", () => {
      expect(isValidUsername("ryan")).toBe(false);
    });
    it("should return false if username is greater than the maximum length", () => {
      expect(isValidUsername("ryan mambou djemt")).toBe(false);
    });
  });

  describe("Boundary cases", () => {
    it("should return true if username is equal to the minimum length", () => {
      expect(isValidUsername("ryann")).toBe(true);
    });
    it("should return true if username is equal to the maximum length", () => {
      expect(isValidUsername("ryanmamboudjemt")).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should return false if username is an empty string", () => {
      expect(isValidUsername("")).toBe(false);
    });
  });
});

describe("canDrive", () => {
  describe("General cases", () => {
    it("should return true if age is greater than legal driving age for US", () => {
      expect(canDrive(18, "US")).toBe(true);
    });
    it("should return true if age is greater than legal driving age for UK", () => {
      expect(canDrive(18, "UK")).toBe(true);
    });
    it("should return false if age is less than legal driving age for US", () => {
      expect(canDrive(15, "US")).toBe(false);
    });
    it("should return false if age is less than legal driving age for UK", () => {
      expect(canDrive(16, "UK")).toBe(false);
    });
  });

  describe("Boundary cases", () => {
    it("should return true if age is equal to legal driving age for US", () => {
      expect(canDrive(16, "US")).toBe(true);
    });
    it("should return true if age is equal to legal driving age for UK", () => {
      expect(canDrive(17, "UK")).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should return false if age is NaN", () => {
      expect(canDrive(NaN, "US")).toBe(false);
    });
    it("should return false if age is negative", () => {
      expect(canDrive(-10, "US")).toBe(false);
    });
    it("should return 'Invalid country code' if country code is not US or UK", () => {
      expect(canDrive(18, "FR")).toBe("Invalid country code");
    });
  });
});

describe("fetchData", () => {
  it("should return the data from the API", async () => {
    const data = await fetchData();
    expectTypeOf(data).toBeObject();
    expectTypeOf(data).toBeArray();
    expect(data).toBeDefined();
    expect(data).toEqual([1, 2, 3]);
  });
});

describe("Stack", () => {
  let stack;

  beforeEach(() => {
    stack = new Stack();
  });

  describe("initialization", () => {
    it("should check if stack instance is created", () => {
      expect(stack).toBeDefined();
    });
  });

  describe("methods", () => {
    it("should check if stack is empty", () => {
      expect(stack.isEmpty()).toBe(true);
    });

    it("should push an item to the stack", () => {
      stack.push(1);
      expect(stack.isEmpty()).toBe(false);
      expect(stack.items).toEqual([1]);
    });

    describe("pop", () => {
      it("should throw an error if stack is empty", () => {
        expect(() => stack.pop()).toThrow("Stack is empty");
      });
      it("should pop an item from the stack", () => {
        stack.push(1);
        expect(stack.pop()).toBe(1);
      });
    });

    describe("peek", () => {
      it("should throw an error if stack is empty", () => {
        expect(() => stack.peek()).toThrow("Stack is empty");
      });

      it("should return the top item of the stack", () => {
        stack.push(1);
        stack.push(2);
        stack.push(3);
        expect(stack.peek()).toBe(3);
      });
    });

    it("should return the size of the stack", () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      expect(stack.size()).toBe(3);
    });

    it("should clear the stack", () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      stack.clear();
      expect(stack.isEmpty()).toBe(true);
    });
  });
});

describe("createProduct", () => {
  describe("positive testing", () => {
    it("should return success message if product name and price are valid", () => {
      const product = { name: "Laptop", price: 1000 };
      expect(createProduct(product)).toEqual({
        success: true,
        message: "Product was successfully published",
      });
    });
  });

  describe("negative testing", () => {
    it("should return error message if product name is missing", () => {
      const product = { price: 1000 };
      expect(createProduct(product)).toEqual({
        success: false,
        error: { code: "invalid_name", message: "Name is missing" },
      });
    });

    it("should return error message if product price is missing", () => {
      const product = { name: "Laptop", price: -1000 };
      expect(createProduct(product)).toEqual({
        success: false,
        error: { code: "invalid_price", message: "Price is missing" },
      });
    });
  });
});

describe("isStrongPassword", () => {
  describe("positive testing", () => {
    it("should return true if password is strong", () => {
      expect(isStrongPassword("Aigle1234@")).toBe(true);
    });
  });

  describe("negative testing", () => {
    it("should return false if password is less than 8 characters", () => {
      expect(isStrongPassword("Rya123@")).toBe(false);
    });
    it("should return false if password does not contain an uppercase character", () => {
      expect(isStrongPassword("aigle1234")).toBe(false);
    });
    it("should return false if password does not contain a lowercase character", () => {
      expect(isStrongPassword("AIGLE1234")).toBe(false);
    });
    it("should return false if password does not contain a number", () => {
      expect(isStrongPassword("Aiglemambou@")).toBe(false);
    });
  });
});
