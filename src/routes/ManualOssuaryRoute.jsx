import React, { useMemo } from "react";

const OSSUARY_CONCORDS = [
  "Desire & Conspire",
  "Pleasure & Treasure",
  "Brood & Feud",
  "Zeal & Steel",
  "Tears & Spears",
  "Veils & Sails",
  "Laurels & Quarrels",
  "Wit & Spit"
];

function shuffleWithSeed(array, seed) {
  const result = [...array];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const OSSUARY_SCHEDULE = [
  { time: "3:30", slot: "team 1" },
  { time: "3:50", slot: "team 2" },
  { time: "4:10", slot: "team 3" },
  { time: "4:30", slot: "team 4" },
  { time: "4:50", slot: "break" },
  { time: "5:10", slot: "team 5" },
  { time: "5:30", slot: "team 6" },
  { time: "5:50", slot: "team 7" },
  { time: "6:10", slot: "team 8" }
];

export function ManualOssuaryRoute({ getPathFromRoute, onNavigate }) {
  const scheduleWithConcords = useMemo(() => {
    const shuffled = shuffleWithSeed(OSSUARY_CONCORDS, 314159);
    let concordIndex = 0;
    return OSSUARY_SCHEDULE.map((row) => {
      if (row.slot === "break") {
        return { ...row, concord: null };
      }
      return { ...row, concord: shuffled[concordIndex++] };
    });
  }, []);

  return (
    <main id="ossuary-page" className="ossuary-layout">
      <a
        href={getPathFromRoute({ page: "manual" })}
        onClick={onNavigate({ page: "manual" })}
        className="type-caps page-back-link"
      >
        <span className="type-logo page-back-arrow">‹</span>Handbook
      </a>
      <p className="type-logo ossuary-header-accent">Ossuary of Unspoken Grief</p>
      <p className="ossuary-location">The Japanese Tea House</p>
      <p className="type-body ossuary-intro">
        This is the only shrine that requires a timed entry. Please note your team's entry time and be there on time.
      </p>
      <div className="ossuary-schedule-wrap">
        <p className="type-caps ossuary-schedule-label">Entry times</p>
        <table className="ossuary-table">
          <tbody>
            {scheduleWithConcords.map((row) => (
              <tr key={row.time} className={row.slot === "break" ? "ossuary-row-break" : ""}>
                <td className="ossuary-time">{row.time}</td>
                <td className="ossuary-slot">
                  {row.concord ? row.concord : row.slot}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
