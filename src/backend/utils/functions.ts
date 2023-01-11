export function log10(num) {
  // Per http://stackoverflow.com/questions/3019278/how-can-i-specify-the-base-for-math-log-in-javascript#comment29970629_16868744
  // Handles floating-point errors log10(1000) otherwise fails at (2.99999996)
  return Math.round((Math.log(num) / Math.LN10) * 1e6) / 1e6;
}

export function sigfig(num, sigfigs_opt = 2) {
  const power10 = log10(num);
  const power10ceiling = Math.floor(power10) + 1;
  // 0 = '', 1 = 'K', 2 = 'M', 3 = 'B', 4 = 'T'
  const SUFFIXES = ["", "K", "M", "B", "T"];
  // 100: power10 = 2, suffixNum = 0, suffix = ''
  // 1000: power10 = 3, suffixNum = 1, suffix = 'K'
  const suffixNum = Math.floor(power10 / 3);

  if (suffixNum >= SUFFIXES.length) {
    return "> 999T";
  }

  const suffix = SUFFIXES[suffixNum];
  // Would be 1 for '', 1000 for 'K', 1000000 for 'M', etc.
  const suffixPower10 = Math.pow(10, suffixNum * 3);
  const base = num / suffixPower10;
  const baseRound = base.toFixed(sigfigs_opt);
  return baseRound + suffix;
}
export function formatCurrency(val: number, isChartAxis = false): string {
  if (val === 0) {
    return "Ξ0";
  } else if (val < 0.01 && val > 0) {
    return "Ξ" + val.toFixed(4);
  } else if (val < 1000 && val > -1000) {
    return "Ξ" + val.toFixed(2);
  } else if (!isChartAxis && val < 10000000 && val > -10000000) {
    return "Ξ" + val.toFixed(0).replace(/\d(?=(\d{3})+$)/g, "$&,");
  } else if (val > 999999999999999) {
    return "> Ξ999T";
  }
  return "Ξ" + sigfig(val, isChartAxis ? 1 : 2);
}

export function formatCurrencyUsd(
  val: number,
  withDollarSign = true,
  isChartAxis = false
): string {
  if (val < 0.01 && val > 0) {
    return "< $0.01";
  } else if (val < 100 && val > -100) {
    return (withDollarSign ? "$" : "") + val.toFixed(2);
  } else if (!isChartAxis && val < 10000000 && val > -10000000) {
    return (
      (withDollarSign ? "$" : "") +
      val.toFixed(0).replace(/\d(?=(\d{3})+$)/g, "$&,")
    );
  } else if (val > 999999999999999) {
    return "> $999T";
  }
  return (withDollarSign ? "$" : "") + sigfig(val, isChartAxis ? 1 : 2);
}
export function formatNumber(
  val: number,
  decimalPlaces = 0,
  { withPlusSign } = { withPlusSign: false }
): string {
  if (val > 0) {
    if (decimalPlaces === 1 && val < 0.05) {
      return "< 0.1";
    } else if (decimalPlaces === 2 && val < 0.005) {
      return "< 0.01";
    }
  } else if (val < 0) {
    if (decimalPlaces === 1 && val > -0.05) {
      return "> -0.1";
    } else if (decimalPlaces === 2 && val > -0.005) {
      return "> -0.01";
    }
  }
}
export function getStatChangeIcon(value) {
  if (value > 0) {
    return '<span class="collection-stats__item-value-arrow" data-toggle="tooltip" title="Up since 24 hours ago"><i class="fa-solid fa-arrow-up-right text-success"></i></span>';
  } else {
    return '<span class="collection-stats__item-value-arrow" data-toggle="tooltip" title="Down since 24 hours ago"><i class="fa-solid fa-arrow-down-right text-danger"></i></span>';
  }
}
