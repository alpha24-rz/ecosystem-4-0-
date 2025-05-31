import { PerformanceMonitor } from "@/components/performance/performance-monitor"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Example Cards - Replace with actual dashboard cards */}
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-medium mb-2">Card 1</h2>
          <p className="text-gray-600">Some content for card 1.</p>
        </div>
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-medium mb-2">Card 2</h2>
          <p className="text-gray-600">Some content for card 2.</p>
        </div>
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-medium mb-2">Card 3</h2>
          <p className="text-gray-600">Some content for card 3.</p>
        </div>
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-medium mb-2">Card 4</h2>
          <p className="text-gray-600">Some content for card 4.</p>
        </div>

        <div className="md:col-span-2 lg:col-span-4">
          <PerformanceMonitor />
        </div>
      </div>
    </div>
  )
}
