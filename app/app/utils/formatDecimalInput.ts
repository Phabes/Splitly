export const formatDecimalInput = (
  newValue: string,
  previousValue: string, // Need this to "cancel" invalid keystrokes
  decimalPlaces?: number,
  canBeNegative: boolean = false,
): string => {
  // 1. Replace commas with periods
  let sanitizedValue = newValue.replace(/,/g, ".");

  // 2. Handle leading zero replacements
  sanitizedValue = sanitizedValue.replace(/^(-?)0+(?=\d)/, "$1");

  // 3. Handle dot replacements for empty integer parts
  if (canBeNegative && sanitizedValue.startsWith("-.")) {
    sanitizedValue = "-0." + sanitizedValue.slice(2);
  } else if (!canBeNegative && sanitizedValue.startsWith(".")) {
    sanitizedValue = "0" + sanitizedValue;
  }

  // 4. Build the dynamic Regex
  const signPattern = canBeNegative ? "-?" : "";
  const decimalPattern =
    decimalPlaces !== undefined ? `\\d{0,${decimalPlaces}}` : `\\d*`;
  const regex = new RegExp(`^${signPattern}\\d*(\\.${decimalPattern})?$`);

  // 5. Return the new value if valid, otherwise return the old value
  if (regex.test(sanitizedValue)) {
    return sanitizedValue;
  }

  return previousValue;
};

export default function Index() {
  return null;
}
