export default function QuizSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="bg-card rounded-xl shadow-lg overflow-hidden border w-full">
        <div className="p-4 sm:p-8">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <div className="h-8 w-32 rounded-full bg-secondary animate-pulse" />
          </div>

          <div className="h-8 w-full mb-3 rounded-lg bg-secondary animate-pulse" />
          <div className="h-8 w-3/4 mb-6 sm:mb-8 rounded-lg bg-secondary animate-pulse" />

          <div className="grid gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="h-16 sm:h-20 w-full rounded-xl bg-secondary animate-pulse"
              />
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-secondary flex justify-between items-center">
          <div className="ml-auto">
            <div className="h-10 w-36 rounded-md bg-primary/70 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
