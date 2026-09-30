export function applyBrandName(value = "") {
  return typeof value === "string"
    ? value.replace(/\btanuenterprise\b/gi, "Tanushree Infrastructure")
    : value;
}
