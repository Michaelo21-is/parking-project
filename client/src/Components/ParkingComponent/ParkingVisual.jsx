import { useEffect, useMemo, useRef, useState } from "react";

/* מפת חניון בתצוגת-על (top-down): כל חניה היא תא מסומן בקווי צביעה,
   ורכב מצויר בתוכה כשהיא תפוסה. הרכיב לא טוען מידע בעצמו — הוא מקבל
   את אותו מערך spots שכבר קיים בדף החניון, ומקבץ אותו לפי קומות. */

const SPOT_MIN_WIDTH = 84; // רוחב מינימלי לחניה, קובע כמה חניות נכנסות בשורה
const MIN_COLUMNS = 2;
const MAX_COLUMNS = 10;

const SPOT_TYPES = {
  regular: { label: "רגיל", tint: "bg-white/[0.03]", carColorIndexed: true },
  disabled: { label: "נכה", tint: "bg-primary/20", carColor: "#3b82f6" },
  dean: { label: "דיקן", tint: "bg-amber-400/15", carColor: "#f59e0b" },
};

// גוונים ניטרליים לרכבים רגילים, כדי שהחניון לא ייראה משוכפל
const REGULAR_CAR_COLORS = ["#cbd5e1", "#64748b", "#94a3b8", "#7dd3fc", "#f87171"];

function spotTypeOf(spot) {
  return SPOT_TYPES[spot?.type] ? spot.type : "regular";
}

function carColorOf(spot) {
  const type = spotTypeOf(spot);
  const typeStyle = SPOT_TYPES[type];

  if (!typeStyle.carColorIndexed) {
    return typeStyle.carColor;
  }

  const spotNumber = Number(spot?.spot) || 0;
  return REGULAR_CAR_COLORS[spotNumber % REGULAR_CAR_COLORS.length];
}

function chunkIntoRows(items, size) {
  const rows = [];

  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }

  return rows;
}

/* מספר החניות בשורה נגזר מרוחב האזור בפועל ולא מנקודות שבירה קבועות,
   כך שהשורות והמעברים נשארים מסודרים בכל גודל מסך. */
function useColumnCount(containerRef) {
  const [columnCount, setColumnCount] = useState(MIN_COLUMNS);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      const availableWidth = entry.contentRect.width;
      const fittingColumns = Math.floor(availableWidth / SPOT_MIN_WIDTH);

      setColumnCount(
        Math.max(MIN_COLUMNS, Math.min(MAX_COLUMNS, fittingColumns))
      );
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [containerRef]);

  return columnCount;
}

export default function ParkingVisual({ spots = [], currentFloor = null }) {
  // קיבוץ לפי קומה — כשנבחרה קומה בדף החניון יתקבל ממילא רק אשכול אחד
  const floors = useMemo(() => {
    const spotsByFloor = new Map();

    for (const spot of spots) {
      const floor = spot?.floor ?? currentFloor ?? 1;
      const floorSpots = spotsByFloor.get(floor) ?? [];

      floorSpots.push(spot);
      spotsByFloor.set(floor, floorSpots);
    }

    return [...spotsByFloor.entries()]
      .sort(([firstFloor], [secondFloor]) => Number(firstFloor) - Number(secondFloor))
      .map(([floor, floorSpots]) => ({
        floor,
        spots: [...floorSpots].sort(
          (firstSpot, secondSpot) => Number(firstSpot.spot) - Number(secondSpot.spot)
        ),
      }));
  }, [spots, currentFloor]);

  return (
    <section className="mt-8 rounded-card border border-border bg-surface p-5 shadow-card sm:mt-10 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-text-primary sm:text-xl">
          <svg
            className="h-5 w-5 shrink-0 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
            />
          </svg>
          מפת החניון
        </h2>

        <span className="rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-semibold text-text-muted sm:text-sm">
          {currentFloor !== null ? `קומה ${currentFloor}` : "כל הקומות"}
        </span>
      </div>

      <Legend />

      {floors.length === 0 ? (
        <p className="mt-5 rounded-card border border-dashed border-border bg-surface-muted/60 px-4 py-8 text-center text-sm font-medium text-text-muted">
          אין חניות להצגה כרגע
        </p>
      ) : (
        <div className="mt-5 flex flex-col gap-6">
          {floors.map((floorGroup) => (
            <FloorLot
              key={floorGroup.floor}
              floor={floorGroup.floor}
              spots={floorGroup.spots}
              showFloorTitle={floors.length > 1 || currentFloor === null}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function Legend() {
  return (
    <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-text-muted sm:text-sm">
      <li className="flex items-center gap-1.5">
        <span
          className="h-3 w-3 shrink-0 rounded-[3px] border border-border-strong bg-surface-muted"
          aria-hidden="true"
        />
        פנויה
      </li>
      <li className="flex items-center gap-1.5">
        <span
          className="h-3 w-3 shrink-0 rounded-[3px] bg-text-secondary"
          aria-hidden="true"
        />
        תפוסה
      </li>
      <li className="flex items-center gap-1.5">
        <span className="h-3 w-3 shrink-0 rounded-[3px] bg-primary" aria-hidden="true" />
        נכה
      </li>
      <li className="flex items-center gap-1.5">
        <span className="h-3 w-3 shrink-0 rounded-[3px] bg-amber-500" aria-hidden="true" />
        דיקן
      </li>
    </ul>
  );
}

function FloorLot({ floor, spots, showFloorTitle }) {
  const lotRef = useRef(null);
  const fittingColumns = useColumnCount(lotRef);

  // שורה בודדת לא משאירה חניה ריקה בקצה
  const columnCount = Math.min(fittingColumns, Math.max(spots.length, MIN_COLUMNS));
  const rows = chunkIntoRows(spots, columnCount);

  const freeSpots = spots.filter((spot) => spot.status !== "occupied").length;

  return (
    <div>
      {showFloorTitle && (
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-sm font-bold text-text-secondary sm:text-base">
            <svg
              className="h-4 w-4 shrink-0 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            קומה {floor}
          </h3>

          <span className="rounded-full border border-border bg-surface-muted px-2.5 py-0.5 text-xs font-semibold tabular-nums text-text-muted">
            {freeSpots} פנויות מתוך {spots.length}
          </span>
        </div>
      )}

      <div
        ref={lotRef}
        className="lot-asphalt overflow-hidden rounded-card border border-text-primary/70 p-3 shadow-card sm:p-4"
      >
        {rows.map((rowSpots, rowIndex) => (
          <div key={rowSpots[0].spot}>
            <ul
              className="grid gap-1.5 sm:gap-2"
              style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
            >
              {rowSpots.map((spot) => (
                <ParkingSpot key={spot.spot} spot={spot} />
              ))}
            </ul>

            {rowIndex < rows.length - 1 && <DrivingLane />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* מעבר נסיעה בין שורות החניה — נותן את תחושת החניון מלמעלה */
function DrivingLane() {
  return (
    <div className="relative h-7 sm:h-9" aria-hidden="true">
      <span className="lot-lane-line absolute inset-x-2 top-1/2 h-0.5 -translate-y-1/2 rounded-full opacity-70" />
    </div>
  );
}

function ParkingSpot({ spot }) {
  const type = spotTypeOf(spot);
  const isOccupied = spot.status === "occupied";
  const typeStyle = SPOT_TYPES[type];

  return (
    <li
      className={`lot-stall relative flex aspect-3/5 min-h-[104px] items-center justify-center rounded-b-md ${typeStyle.tint}`}
    >
      <p className="sr-only">
        חניה {spot.spot}, {typeStyle.label}, {isOccupied ? "תפוסה" : "פנויה"}
      </p>

      {/* סימון סוג החניה צבוע על הרצפה, נראה כשהחניה פנויה */}
      {!isOccupied && type !== "regular" && (
        <span className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
          <GroundSymbol type={type} />
        </span>
      )}

      {isOccupied && (
        <span className="pointer-events-none absolute inset-x-[14%] bottom-[6%] top-[20%]">
          <CarTopDown color={carColorOf(spot)} />
        </span>
      )}

      {/* שורת הכותרת נשארת מעל הרכב, כך שהמספר והסוג נראים גם בחניה תפוסה */}
      <span className="pointer-events-none absolute inset-x-1 top-1 flex items-start justify-between gap-1">
        <span className="rounded bg-text-primary/70 px-1.5 py-0.5 text-[11px] font-bold leading-none tabular-nums text-white/95">
          {spot.spot}
        </span>

        {type !== "regular" && <TypeBadge type={type} />}
      </span>

      {!isOccupied && (
        <span className="pointer-events-none absolute inset-x-1 bottom-1 flex justify-center">
          <span className="rounded bg-success/90 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
            פנוי
          </span>
        </span>
      )}
    </li>
  );
}

function TypeBadge({ type }) {
  if (type === "dean") {
    return (
      <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-text-primary">
        דיקן
      </span>
    );
  }

  return (
    <span
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary text-white"
      aria-hidden="true"
    >
      <WheelchairGlyph className="h-3.5 w-3.5" />
    </span>
  );
}

function GroundSymbol({ type }) {
  if (type === "dean") {
    return (
      <svg
        className="h-7 w-7 text-amber-300/60"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M11.48 3.5a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    );
  }

  return <WheelchairGlyph className="h-8 w-8 text-primary-100/70" />;
}

function WheelchairGlyph({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.5 4.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 8.5V13h4l2.5 6.5M14.5 15.5a4.5 4.5 0 11-4.6-4.5"
      />
    </svg>
  );
}

/* רכב בתצוגת-על: חזית הרכב פונה לראש החניה */
function CarTopDown({ color }) {
  return (
    <svg
      viewBox="0 0 44 80"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full drop-shadow-[0_3px_5px_rgba(2,6,23,0.55)]"
      aria-hidden="true"
    >
      <rect x="2" y="16" width="5" height="13" rx="2.5" fill="#111827" />
      <rect x="37" y="16" width="5" height="13" rx="2.5" fill="#111827" />
      <rect x="2" y="52" width="5" height="13" rx="2.5" fill="#111827" />
      <rect x="37" y="52" width="5" height="13" rx="2.5" fill="#111827" />

      <rect x="1.5" y="30" width="4" height="4.5" rx="1.5" fill={color} />
      <rect x="38.5" y="30" width="4" height="4.5" rx="1.5" fill={color} />

      <rect
        x="4.5"
        y="2"
        width="35"
        height="76"
        rx="13"
        fill={color}
        stroke="#0f172a"
        strokeOpacity="0.35"
      />

      <path d="M10.5 28.5C14 22 30 22 33.5 28.5Z" fill="#0f172a" fillOpacity="0.7" />
      <rect x="10" y="28.5" width="24" height="23" rx="4" fill="#ffffff" fillOpacity="0.14" />
      <path d="M10.5 51.5C14 58 30 58 33.5 51.5Z" fill="#0f172a" fillOpacity="0.6" />

      <rect x="8" y="3.5" width="8" height="3.5" rx="1.75" fill="#fef9c3" />
      <rect x="28" y="3.5" width="8" height="3.5" rx="1.75" fill="#fef9c3" />
      <rect x="8" y="73" width="8" height="3" rx="1.5" fill="#ef4444" />
      <rect x="28" y="73" width="8" height="3" rx="1.5" fill="#ef4444" />
    </svg>
  );
}
