export interface ParsedRequirement {
  quantity: number;
  product: string;
  budget: number;
  deliveryDays: number;
  warrantyYears: number;
  purpose: string;
}

export function parseProcurementRequest(text: string): ParsedRequirement {
  const qty = text.match(/(\d+)\s*(?:x|×)?\s*(laptops?|units?|monitors?|devices?)/i);
  const budget = text.match(/\$?\s?([\d,]{3,})(?:\s*(?:dollars|usd|budget|max))?/i);
  const days = text.match(/(\d+)\s*-?\s*day/i);
  const warranty = text.match(/(\d+)\s*-?\s*year/i);

  return {
    quantity: qty ? Number(qty[1]) : 30,
    product: /monitor/i.test(text) ? "Business Monitor" : "Business Laptop",
    budget: budget ? Number(budget[1].replace(/,/g, "")) : 30000,
    deliveryDays: days ? Number(days[1]) : 10,
    warrantyYears: warranty ? Number(warranty[1]) : 3,
    purpose: "New employee onboarding",
  };
}

export type IntentTarget = {
  path: string;
  label: string;
  isProcurement?: boolean;
};

const intentRules: { test: RegExp; target: Omit<IntentTarget, "label"> & { label: string } }[] = [
  {
    test: /\b(buy|purchase|find|source)\b.*\b(laptop|laptops|monitor|monitors)\b/i,
    target: { path: "/procure", label: "Starting your procurement request", isProcurement: true },
  },
  {
    test: /waiting for approval|awaiting approval|review .*approval|need(s)? approval/i,
    target: { path: "/approvals", label: "Opening your approval queue" },
  },
  {
    test: /negotiat/i,
    target: { path: "/negotiations", label: "Opening negotiation sessions" },
  },
  {
    test: /subscription|getting more expensive|price creep/i,
    target: { path: "/subscriptions", label: "Checking your subscriptions" },
  },
  {
    test: /translator|payout|pay (my|our|everyone|the)/i,
    target: { path: "/payouts", label: "Opening the payout command center" },
  },
  {
    test: /spending increase|software spending|why did .*spend/i,
    target: { path: "/insights", label: "Pulling up your spend insights" },
  },
  {
    test: /at risk|risky|risk engine/i,
    target: { path: "/transactions", label: "Checking transaction risk" },
  },
  {
    test: /refund|dispute/i,
    target: { path: "/refunds", label: "Opening the refund referee" },
  },
  {
    test: /proof of work|verify|verification|deliverable/i,
    target: { path: "/proof-of-work", label: "Opening proof of work" },
  },
  {
    test: /agent|permission|guardrail/i,
    target: { path: "/agents", label: "Opening your AI agents" },
  },
];

export function routeForCommand(text: string): IntentTarget {
  for (const rule of intentRules) {
    if (rule.test.test(text)) {
      return rule.target;
    }
  }
  return { path: "/insights", label: "Looking into that for you" };
}

export const exampleCommands = [
  "Buy 30 business laptops under $30,000",
  "Find the best laptops for our new employees",
  "Why did our software spending increase this month?",
  "Negotiate a better price with this supplier",
  "Show me purchases waiting for approval",
  "Pay our 40 translators from this spreadsheet",
  "Check if any subscriptions are getting more expensive",
  "What payments are at risk?",
];
