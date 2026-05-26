
import {Link} from "react-router-dom"
function App() {

  return (
    <div dir="rtl">
    <div className="min-h-screen bg-blue-50 py-10 ">
      <div className="max-w-4xl mx-auto px-6">

        <div className="mb-12">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
           חני-טיק : מערכת חניה חכמה
          </h1>

        </div>

        <div className="bg-blue-100 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">איך אנחנו עוזרים לכם?</h2> 
          <p className="text-blue-800 text-lg leading-relaxed">
בעזרת חני-טיק תוכלו למצוא חנייה קרובה בקלות ובמהירות, עם עדכונים בזמן אמת על זמינות החניות.          </p>
        </div>

        <div>
          <Link to="/parking" className="p-4 bg-blue-500 font-semibold text-white text-md">
            למציאת חניה
          </Link>
        </div>

      </div>
     </div>
    </div>
  )
  
}

export default App
