export class CurrencyFormatter {
  private static regularPriceFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  private static lessThanOnePriceFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 100,
  });

  private static amountFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
  });

  static formatPrice(price: number): string {
    if (price < 1) {
      return this.lessThanOnePriceFormatter.format(price);
    }
    return this.regularPriceFormatter.format(price);
  }

  static formatAmount(amount: number): string {
    return this.amountFormatter.format(amount);
  }
}
