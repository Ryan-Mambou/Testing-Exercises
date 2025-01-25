import { vi, expect, it, describe, beforeEach, afterEach } from "vitest";
import {
  getPriceInCurrency,
  getShippingInfo,
  renderPage,
  submitOrder,
  signUp,
  login,
  isOnline,
  getDiscount,
} from "../src/mocking";
import * as currencyModule from "../src/libs/currency";
import * as emailModule from "../src/libs/email";
import * as securityModule from "../src/libs/security";
import { getShippingQuote } from "../src/libs/shipping";
import { getExchangeRate } from "../src/libs/currency";
import { trackPageView } from "../src/libs/analytics";
import { charge } from "../src/libs/payment";

// *Using vi.fn*
// getExchangeRateRate = vi.fn((from, to) => {
//   if (from === "USD" && to === "EUR") return 0.9; // Example exchange rate
//   if (from === "USD" && to === "GBP") return 0.8;
//   return 1; // Default fallback rate
// });

// *Using vi.spyOn*
vi.spyOn(currencyModule, "getExchangeRate").mockImplementation((from, to) => {
  if (from === "USD" && to === "EUR") return 0.9; // Example exchange rate
  if (from === "USD" && to === "GBP") return 0.8;
  return 1; // Default fallback rate
});

// *Using vi.mock*
vi.mock("../src/libs/shipping.js", () => ({
  getShippingQuote: vi.fn((destination) => {
    if (destination === "US") return { cost: 10, estimatedDays: 2 };
    if (destination === "EU") return { cost: 20, estimatedDays: 4 };
    return null;
  }),
}));

vi.mock("../src/libs/analytics.js", () => ({
  trackPageView: vi.fn(async (pagePath) => {
    console.log(`Mocked trackPageView for path ${pagePath}`);
    return await Promise.resolve();
  }),
}));

vi.mock("../src/libs/payment.js", () => ({
  charge: vi.fn(async (creditCardInfo, amount) => {
    console.log(
      `Mocked charge function with amount: ${amount} and credit card info: ${creditCardInfo}`
    );
    return { status: "success" };
  }),
}));

vi.spyOn(emailModule, "sendEmail").mockImplementation(async (to, message) => {
  console.log(`Mocked sendEmail to ${to} with message: ${message}`);
  return await Promise.resolve();
});

describe("getPriceInCurrency", () => {
  it("should calculate the price in the target currency using the exchange rate", () => {
    const priceInUSD = 100;

    const resultEUR = getPriceInCurrency(priceInUSD, "EUR");
    expect(resultEUR).toEqual(90);

    const resultGBP = getPriceInCurrency(priceInUSD, "GBP");
    expect(resultGBP).toEqual(80);
  });

  it("should return the same price if the exchange rate is 1", () => {
    const priceInUSD = 100;
    const result = getPriceInCurrency(priceInUSD, "USD");
    expect(result).toEqual(100);
  });
});

describe("getShippingInfo", () => {
  it("should return the correct shipping cost and estimated days. That is 10 for US", () => {
    const result = getShippingInfo("US");
    const cost = result.match(/\d+/)[0];
    expect(result).toEqual("Shipping Cost: $10 (2 Days)");
    expect(cost).toEqual("10");
  });

  it("should return the correct shipping cost and estimated days. That is 20 for EU", () => {
    const result = getShippingInfo("EU");
    const cost = result.match(/\d+/)[0];
    expect(result).toEqual("Shipping Cost: $20 (4 Days)");
    expect(cost).toEqual("20");
  });

  it("should return 'Shipping Unavailable' if the quote is null", () => {
    const result = getShippingInfo("CA");
    expect(result).toEqual("Shipping Unavailable");
  });
});

describe("renderPage", () => {
  it("should render the page content and call trackPageView with '/home'", async () => {
    const result = await renderPage();
    expect(trackPageView).toHaveBeenCalledTimes(1);
    expect(trackPageView).toHaveBeenCalledWith("/home");
    expect(result).toEqual("<div>content</div>");
  });
});

describe("submitOrder", () => {
  it("should return success if the payment is successful", async () => {
    const creditCard = { creditCardNumber: "1234" };
    const order = { totalAmount: 100 };

    const result = await submitOrder(order, creditCard);
    expect(result).toEqual({ success: true });
    expect(charge).toHaveBeenCalledTimes(1);
    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
  });

  it("should return error if the payment is failed", async () => {
    const creditCard = { creditCardNumber: "1234" };
    const order = { totalAmount: 100 };
    charge.mockResolvedValue({ status: "failed" });

    const result = await submitOrder(order, creditCard);
    expect(result).toEqual({ success: false, error: "payment_error" });
  });
});

describe("signUp", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Ensure clean mocks for every test
  });
  it("should return true if the email is valid and send an email", async () => {
    const email = "ryanmambou@gmail.com";
    const result = await signUp(email);
    expect(result).toBe(true);
    expect(emailModule.sendEmail).toHaveBeenCalledTimes(1);
    expect(emailModule.sendEmail).toHaveBeenCalledWith(
      email,
      "Welcome aboard!"
    );
  });

  it("should return false if the email is invalid", async () => {
    const email = "invalid-email";
    const result = await signUp(email);
    expect(result).toBe(false);
    expect(emailModule.sendEmail.mock.calls.length).toBe(0);
  });
});

describe("login", () => {
  it("should send an email with the security code", async () => {
    const email = "ryanmambou@gmail.com";
    await login(email);
    expect(emailModule.sendEmail).toHaveBeenCalledTimes(1);
    expect(emailModule.sendEmail).toHaveBeenCalledWith(
      email,
      expect.any(String)
    );
  });
});

describe("isOnline", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });
  it("should return true if the current hour is within the available hours", () => {
    const date = new Date(2025, 1, 25, 10); // 10 AM
    vi.setSystemTime(date);
    // vi.spyOn(global, "Date").mockImplementation(() => date); You could also do this
    expect(isOnline()).toBe(true);
  });

  it("should return false if the current hour is outside the available hours", () => {
    const date = new Date(2025, 1, 25, 21); // 9 PM
    vi.setSystemTime(date);
    expect(isOnline()).toBe(false);
  });
});

describe("getDiscount", () => {
  it("should return 0.2 if today is Christmas", () => {
    const date = new Date(2025, 11, 25); // Christmas day
    vi.setSystemTime(date);
    expect(getDiscount()).toBe(0.2);
  });

  it("should return 0 if today is not Christmas", () => {
    const date = new Date(2025, 11, 24); // Not Christmas day
    vi.setSystemTime(date);
    expect(getDiscount()).toBe(0);
  });
});
