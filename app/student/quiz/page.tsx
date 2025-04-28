import QuizApp from "@/components/quiz-app"

export default function Quiz() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-cyan-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 opacity-20">
          <Snowflake />
        </div>
        <div className="absolute top-20 right-20 w-24 h-24 opacity-20">
          <Snowflake />
        </div>
        <div className="absolute bottom-10 left-1/4 w-20 h-20 opacity-20">
          <Snowflake />
        </div>
        <div className="absolute bottom-40 right-1/3 w-16 h-16 opacity-20">
          <Snowflake />
        </div>
      </div>
      <QuizApp />
    </main>
  )
}

function Snowflake() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3V21M12 3L16 7M12 3L8 7M12 21L16 17M12 21L8 17M3 12H21M3 12L7 8M3 12L7 16M21 12L17 8M21 12L17 16M4.93 4.93L19.07 19.07M4.93 4.93L8.05 4.93M4.93 4.93L4.93 8.05M19.07 19.07L15.95 19.07M19.07 19.07L19.07 15.95M4.93 19.07L19.07 4.93M4.93 19.07L4.93 15.95M4.93 19.07L8.05 19.07M19.07 4.93L19.07 8.05M19.07 4.93L15.95 4.93"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
