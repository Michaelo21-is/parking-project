import ActionCard from "../Components/MangeComponent/ActionCard";
import { signOutRequest } from "../api/signOut";
import { useNavigate, Link } from "react-router-dom";

const actions = [
  {
    to: "/add-user",
    title: "הוספת משתמש",
    desc: "יצירת חשבון משתמש חדש למערכת",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
      />
    ),
  },
  {
    to: "/add-park",
    title: "הוספת חניון",
    desc: "הוספת חניון חדש למערכת, כולל קומות ומספר מקומות חניה",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 4v16m8-8H4"
      />
    ),
  },
  {
    to: "/edit-parking",
    title: "עריכת חניון",
    desc: "עדכון הפרטים של חניון קיים במערכת",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    ),
  },
  {
    to: "/remove-parking",
    title: "הסרת חניון",
    desc: "מחיקת חניון מהמערכת באופן סופי",
    danger: true,
    note: "פעולה בלתי הפיכה",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    ),
  },
];



const signOutIcon = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
  />
);



export default function ManagementPage() {
  const navigate = useNavigate();
  async function handleOnSignOut(){
    try {
      await signOutRequest();
      navigate("/");
    } catch (error) {
      console.error("sign out request failed: ", error);
      alert("ההתנתקות נכשלה, אנא נסה שוב");
    }
  }
  return (
    <div dir="rtl" className="flex min-h-dvh flex-col bg-canvas">

      <header className="sticky top-0 z-20 border-b border-border bg-surface/85 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to={"/"}
          className="flex items-center gap-2 text-sm font-semibold text-text-primary sm:text-base">
            <span className="flex h-9 w-9 items-center justify-center rounded-control bg-primary text-on-primary">
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
            חניה טק
          </Link>

          <span className="rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-semibold text-text-muted sm:text-sm">
            פאנל ניהול
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="animate-fade-in">
          <div className="mb-8 sm:mb-10">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              פאנל ניהול
            </h1>
            <p className="mt-1.5 text-sm text-text-muted sm:text-base">
              ברוך הבא, בחר פעולה מתוך הרשימה
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
            {actions.map((action) => (
              <ActionCard key={action.to} {...action} />
            ))}

            <ActionCard
              title="התנתקות"
              desc="יציאה מאובטחת מחשבון הניהול"
              icon={signOutIcon}
              danger
              cta="התנתק"
              onClick={handleOnSignOut}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
