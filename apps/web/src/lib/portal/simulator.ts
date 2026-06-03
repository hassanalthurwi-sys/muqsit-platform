// Pure simulation math for the investor capital growth simulator.
// No I/O. No randomness. Same inputs → same outputs.

export type RiskProfile = "conservative" | "balanced" | "growth";
export type PeriodKey = "sixM" | "oneY" | "twoY" | "threeY";

const MONTHLY_RATE: Record<RiskProfile, number> = {
  // Indicative-only monthly net rates for the prototype simulator.
  conservative: 0.008,
  balanced: 0.011,
  growth: 0.014,
};

const PERIOD_MONTHS: Record<PeriodKey, number> = {
  sixM: 6,
  oneY: 12,
  twoY: 24,
  threeY: 36,
};

export interface SimulationInputs {
  capital: number;
  period: PeriodKey;
  risk: RiskProfile;
  reinvest: boolean;
}

export interface SimulationPoint {
  month: number;
  value: number;
}

export interface SimulationResult {
  currentCapital: number;
  expectedValue: number;
  cumulativeReturn: number;
  path: SimulationPoint[];
}

export function simulate({ capital, period, risk, reinvest }: SimulationInputs): SimulationResult {
  const months = PERIOD_MONTHS[period];
  const rate = MONTHLY_RATE[risk];
  const path: SimulationPoint[] = [{ month: 0, value: capital }];

  let value = capital;
  for (let m = 1; m <= months; m += 1) {
    if (reinvest) {
      value = value * (1 + rate);
    } else {
      value = capital + capital * rate * m;
    }
    path.push({ month: m, value });
  }

  const expectedValue = path[path.length - 1]?.value ?? capital;
  return {
    currentCapital: capital,
    expectedValue,
    cumulativeReturn: expectedValue - capital,
    path,
  };
}

export function monthsForPeriod(period: PeriodKey): number {
  return PERIOD_MONTHS[period];
}
