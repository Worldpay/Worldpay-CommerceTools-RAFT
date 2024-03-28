export function withLocalDateTime(localDateTime?: string) {
  return {
    LocalDateTime: localDateTime ?? new Date().toISOString().slice(0, 19),
  }
}
