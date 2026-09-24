import { Link } from "react-router-dom";

const parkingIcon = (
    <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 11h2.5a2.5 2.5 0 000-5H12v11M4 5.5A2.5 2.5 0 016.5 3h11A2.5 2.5 0 0120 5.5v13a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 18.5v-13z"
    />
);

export default function MangementNavbar(){
    return(
    <header className="sticky top-0 z-20 border-b border-border bg-surface/85 backdrop-blur-sm">
                <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-sm font-semibold text-text-primary sm:text-base"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-control bg-primary-50 text-primary">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                {parkingIcon}
                            </svg>
                        </span>
                        חניה טק
                    </Link>

                    <Link
                        to="/management"
                        className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-control border border-border bg-surface px-4 text-sm font-semibold text-text-primary shadow-card transition-all duration-200 hover:border-primary hover:text-primary hover:shadow-card-hover"
                    >
                        <svg
                            className="h-4.5 w-4.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                        חזרה לפאנל
                    </Link>
                </div>
            </header>
    );
}
