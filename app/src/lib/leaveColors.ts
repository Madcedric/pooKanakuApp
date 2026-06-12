export const leaveColorMap: Record<string, string> = {
  "Full Leave": "#9CA3AF", // gray
  "Half Day": "#F59E0B", // amber/yellow
  "Custom": "#FB923C", // orange
  "Festival Holiday": "#9CA3AF",
  "Stock Unavailable": "#F59E0B",
  "Transport Issue": "#FB923C",
  "Emergency Closure": "#9CA3AF",
}

export function colorForLeave(type?: string) {
  if (!type) return "#9CA3AF"
  return leaveColorMap[type] || "#FB923C"
}
