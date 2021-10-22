function snowflakeToUTCDateTime(snowflake) {
  return timestampToUTCDateTime(BigInt(snowflake) / 4194304000n + 1420070400n);
}

function timestampToUTCDateTime(timestamp) {
  const s = BigInt(timestamp);
  let date = s / 86400n + 146816528n;
  let year = (date / 146097n - 1000n) * 400n;
  date = date % 146097n - 1n;
  let tmp = date / 36524n;
  let leap = !tmp;
  year += tmp * 100n;
  date = date % 36524n + 1n;
  tmp = date / 1461n;
  leap = leap || !!tmp;
  year += tmp * 4n;
  date = date % 1461n - 1n;
  tmp = date / 365n;
  leap = leap && !tmp;
  year += tmp;
  date %= 365n;
  year = Number(year), date = Number(date);

  if (leap) date++;
  let month = 3;
  if (58 + leap < date) {
    date -= 58 + leap;
    for (let i = 2; i < 12; i++) {
      const days = !~-i ? 28 : !(i % 2) ^ (6 < i) ? 31 : 30;
      if (days >= date) break;
      date -= days;
      month++;
    }
  } else if (date < 31) {
    month = 1;
    date++;
  } else {
    month = 2;
    date -= 30;
  }

  return {
    year, month, date,
    hours: Number(s / 3600n % 24n),
    minutes: Number(s / 60n % 60n),
    seconds: Number(s % 60n),
  };
}
