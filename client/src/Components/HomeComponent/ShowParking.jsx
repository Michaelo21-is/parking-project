import { Link } from "react-router";

export default function ShowParking({ parkDetails }) {
  return (
    <div className="mt-6">
      {Object.entries(parkDetails).map(([cityName, parkingLots]) => (
        <div key={cityName} className="mb-10 last:mb-0">
          <p className="mb-3 flex items-center gap-2 text-base font-semibold text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            {cityName}:
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {parkingLots.map((parkingLot) => (
              <div
                key={parkingLot.lotId}
                className="group rounded-card border border-border bg-surface shadow-card transition-all duration-200 hover:cursor-pointer hover:border-primary/40 hover:shadow-card-hover"
              >
                <Link
                  className="flex min-h-14 items-center justify-between gap-3 px-4 py-3.5 text-base font-medium text-text-primary transition-colors duration-200 group-hover:text-primary"
                  to={`/parking/${parkingLot.lotId}?parkName=${(parkingLot.name)}&parkCity=${(cityName)}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-primary-50 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-on-primary">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 11h2.5a2.5 2.5 0 000-5H12v11M4 5.5A2.5 2.5 0 016.5 3h11A2.5 2.5 0 0120 5.5v13a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 18.5v-13z"
                        />
                      </svg>
                    </span>
                    {parkingLot.name}
                  </span>

                  <svg
                    className="h-4.5 w-4.5 shrink-0 text-text-muted transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
