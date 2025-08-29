import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { orpc } from '@/orpc/client'
import { useState } from 'react'

export const Route = createFileRoute('/assignments')({
  component: AssignmentList,
})

function AssignmentList() {
  const { data: assignments } = useSuspenseQuery(
    (orpc as any).exchangeCryptocurrency.list.queryOptions()
  )

  const { data: cryptocurrencies } = useSuspenseQuery(
    (orpc as any).cryptocurrency.list.queryOptions()
  )

  const { data: exchanges } = useSuspenseQuery(
    (orpc as any).exchange.list.queryOptions()
  )

  const [searchTerm, setSearchTerm] = useState('')

  const enrichedAssignments = (assignments as any).map((assignment: any) => {
    const crypto = ((cryptocurrencies as any)?.data || (cryptocurrencies as any) || []).find((c: any) => c.id === (assignment as any).cryptocurrencyId)
    const exchange = ((exchanges as any)?.data || (exchanges as any) || []).find((e: any) => e.id === (assignment as any).exchangeId)
    return {
      ...assignment,
      cryptocurrency: crypto,
      exchange: exchange
    }
  })

  const filteredAssignments = enrichedAssignments.filter((assignment: any) => 
    assignment.cryptocurrency?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.cryptocurrency?.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.exchange?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold text-gray-900">Exchange Assignments</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage cryptocurrency listings on different exchanges
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/assignments/add"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Create Assignment
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search assignments..."
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {filteredAssignments.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new assignment.
                </p>
                <div className="mt-6">
                  <Link
                    to="/assignments/add"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Assignment
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredAssignments.map((assignment: any) => (
                  <li key={(assignment as any).id}>
                    <Link
                      to="/assignments/$id"
                      params={{ id: (assignment as any).id.toString() }}
                      className="block hover:bg-gray-50 px-4 py-4 sm:px-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img 
                              className="h-10 w-10 rounded-full" 
                              src={assignment.cryptocurrency?.logo} 
                              alt={assignment.cryptocurrency?.name}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-3">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {assignment.cryptocurrency?.name} ({assignment.cryptocurrency?.symbol})
                              </p>
                              <span className="text-gray-400">→</span>
                              <p className="text-sm text-gray-500 truncate">
                                {assignment.exchange?.name}
                              </p>
                            </div>
                            <div className="text-sm text-gray-500">
                              Assignment ID: {(assignment as any).id} • Created: {new Date((assignment as any).createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}