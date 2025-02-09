// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const errors = input.cart.lines
    .filter(line =>
      "product" in line.merchandise &&
      line.merchandise.product.productType === "gift_card" &&
      line.quantity > 1
    )
    .map(() => ({
      localizedMessage: "Not possible to order more than one gift card",
      target: "$.cart",
    }));

  return { errors };
}