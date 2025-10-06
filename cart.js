/* 
1) TypeError in calculateTotal: loop used <=, causing items[i] to be undefined on the last iteration.
2) No validation for discountRate in applyDiscount (values outside [0,1] or NaN produce incorrect totals).
3) generateReceipt assumed total is always a number. toFixed would throw if upstream failed.

How tools helped:
- Console showed the TypeError and file:line → jumped to Sources.
- Breakpoints in calculateTotal/applyDiscount/generateReceipt exposed variable states.
- Call Stack revealed the path from top-level to calculateTotal.
- Watch expressions (i, cartItems[i], total, discountRate) made it clear when values went wrong.
*/

const cart = [
  { name: "Laptop",     price: 1000 },
  { name: "Phone",      price: 500 },
  { name: "Headphones", price: 200 }
];

/**
 * Sums item.price across the cart.
 * Set a breakpoint on the for-loop line to inspect i, item, and total.
 */
function calculateTotal(cartItems) {
  if (!Array.isArray(cartItems)) return 0;
  let total = 0;

  // debugger; // ← uncomment while debugging loops to pause each iteration
  for (let i = 0; i < cartItems.length; i++) { // FIX: < instead of <=
    const item = cartItems[i];
    // Guard against malformed items
    const price = Number(item?.price);
    total += Number.isFinite(price) ? price : 0;
  }
  return total;
}

/**
 * Applies a discount. Clamps discountRate to [0,1] and ignores invalid input.
 */
function applyDiscount(total, discountRate) {
  const t = Number(total);
  let d = Number(discountRate);

  // Validate inputs
  const safeTotal = Number.isFinite(t) ? t : 0;
  if (!Number.isFinite(d)) d = 0;
  if (d < 0) d = 0;
  if (d > 1) d = 1;

  return safeTotal - safeTotal * d;
}

/**
 * Builds a pretty receipt string. Protects against non-number totals.
 * Set a breakpoint on the return to inspect the final lines.
 */
function generateReceipt(cartItems, total) {
  const safeTotal = Number.isFinite(Number(total)) ? Number(total) : 0;

  let receipt = "Items:\n";
  (cartItems || []).forEach(item => {
    const name = String(item?.name ?? "Unknown");
    const price = Number.isFinite(Number(item?.price)) ? Number(item.price) : 0;
    receipt += `${name}: $${price.toFixed(2)}\n`;
  });
  receipt += `Total: $${safeTotal.toFixed(2)}`;
  return receipt;
}


console.log("Starting shopping cart calculation...");

// RECOMMENDED BREAKPOINTS (Sources tab):
// - On the first line in calculateTotal()
// - On the first line in applyDiscount()
// - On the return line in generateReceipt()

const total = calculateTotal(cart);
const discountedTotal = applyDiscount(total, 0.2); // 20% discount
const receipt = generateReceipt(cart, discountedTotal);

// Update DOM (format with 2 decimals)
document.getElementById("total").textContent = `Total: $${discountedTotal.toFixed(2)}`;
document.getElementById("receipt").textContent = receipt;

/* 
Open DevTools Console and run these manually to verify:

// i) Empty cart
const t0 = calculateTotal([]);
const d0 = applyDiscount(t0, 0.1);
console.log("Empty cart:", t0, d0, "\n" + generateReceipt([], d0));

// ii) One item
const t1 = calculateTotal([{ name: "USB-C Cable", price: 10 }]);
const d1 = applyDiscount(t1, 0.15);
console.log("One item:", t1, d1, "\n" + generateReceipt([{ name: "USB-C Cable", price: 10 }], d1));

// iii) discountRate of 0
const t2 = calculateTotal(cart);
const d2 = applyDiscount(t2, 0);
console.log("discount 0:", t2, d2, "\n" + generateReceipt(cart, d2));

// iv) discountRate of 1
const t3 = calculateTotal(cart);
const d3 = applyDiscount(t3, 1);
console.log("discount 1:", t3, d3, "\n" + generateReceipt(cart, d3));
 */
