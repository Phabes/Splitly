export const formatDecimalInput = (
  setValue: (newValue: string) => void,
  value: string,
  decimalPlaces?: number,
  canBeNegative: boolean = false,
) => {
  // 1. Replace commas with periods
  let sanitizedValue = value.replace(/,/g, ".");

  // 2. Handle leading zero replacements (e.g., "05" -> "5", "-05" -> "-5")
  sanitizedValue = sanitizedValue.replace(/^(-?)0+(?=\d)/, "$1");

  // 3. Only intercept "-." to correct it to "-0."
  if (canBeNegative && sanitizedValue.startsWith("-.")) {
    sanitizedValue = "-0." + sanitizedValue.slice(2);
  }

  // 4. Build the dynamic Regex
  const signPattern = canBeNegative ? "-?" : "";
  const decimalPattern =
    decimalPlaces !== undefined ? `\\d{0,${decimalPlaces}}` : `\\d*`;

  // The regex \d* inherently allows a string to start directly with "." (e.g., ".5")
  const regex = new RegExp(`^${signPattern}\\d*(\\.${decimalPattern})?$`);

  // 5. Update state if valid
  if (regex.test(sanitizedValue)) {
    setValue(sanitizedValue);
  }
};

export default function Index() {
  return null;
}
