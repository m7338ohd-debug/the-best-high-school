export interface LateFeeRule {
  enabled: boolean;
  gracePeriodDays: number;
  feeType: 'FIXED' | 'PERCENTAGE';
  amount: number;
}

export interface DiscountRule {
  scholarshipPercentage?: number;
  siblingDiscountPercentage?: number;
  earlyBirdDiscountAmount?: number;
}

export class RuleEngineService {
  /**
   * Calculates late fee penalty based on grace period and due date.
   */
  public static calculateLateFee(dueDate: Date, originalAmount: number, rule: LateFeeRule): number {
    if (!rule.enabled) return 0;

    const now = new Date();
    const diffTime = Math.max(0, now.getTime() - dueDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= rule.gracePeriodDays) {
      return 0;
    }

    if (rule.feeType === 'FIXED') {
      return rule.amount;
    }

    return (originalAmount * rule.amount) / 100;
  }

  /**
   * Calculates total net fee after applying discount & scholarship rules.
   */
  public static calculateNetFee(grossFee: number, discounts: DiscountRule): { netFee: number; totalDiscount: number } {
    let totalDiscount = 0;

    if (discounts.scholarshipPercentage) {
      totalDiscount += (grossFee * discounts.scholarshipPercentage) / 100;
    }

    if (discounts.siblingDiscountPercentage) {
      totalDiscount += (grossFee * discounts.siblingDiscountPercentage) / 100;
    }

    if (discounts.earlyBirdDiscountAmount) {
      totalDiscount += discounts.earlyBirdDiscountAmount;
    }

    const netFee = Math.max(0, grossFee - totalDiscount);
    return { netFee, totalDiscount };
  }

  /**
   * Generates formatted sequential receipt number (e.g. REC-2026-000142).
   */
  public static generateReceiptNumber(prefix = 'REC', sequence: number, academicYear = '2026'): string {
    const padded = String(sequence).padStart(6, '0');
    return `${prefix}-${academicYear}-${padded}`;
  }
}
