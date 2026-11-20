/** An empty end year means the role is current. */
export function formatYears(start, end) {
  if (end == null) return `${start} to now`;
  if (start === end) return `${start}`;
  return `${start} to ${end}`;
}

export function companyYears(roles) {
  if (!roles?.length) {
    throw new Error('An experience company needs at least one role');
  }
  const start = Math.min(...roles.map((role) => role.start));
  const end = roles.some((role) => role.end == null)
    ? null
    : Math.max(...roles.map((role) => role.end));
  return { start, end };
}
