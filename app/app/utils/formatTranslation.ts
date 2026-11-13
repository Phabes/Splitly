export const formatTranslation = (
  template: string | undefined,
  variables: Record<string, string | number>,
): string => {
  if (!template) {
    return "";
  }

  return template.replace(/\$\{([^}]+)\}/g, (_, key) => {
    return variables[key] !== undefined ? String(variables[key]) : `\${${key}}`;
  });
};

export default function Index() {
  return null;
}
