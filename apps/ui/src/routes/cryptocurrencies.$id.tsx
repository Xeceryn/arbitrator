import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orpc } from '@/orpc/client'
import { useState } from 'react'

export const Route = createFileRoute('/cryptocurrencies/$id')({
	component: CryptocurrencyDetail,
})

function CryptocurrencyDetail() {
	const { id } = Route.useParams()
	const router = useRouter()
	const queryClient = useQueryClient()
	const [showDeleteModal, setShowDeleteModal] = useState(false)

	const { data: cryptocurrency } = useSuspenseQuery(
		orpc.cryptocurrency.findById.queryOptions({
			input: parseInt(id)
		})
	)

	const { data: exchangeCryptocurrencies } = useSuspenseQuery(
		orpc.exchangeCryptocurrency.list.queryOptions({
			input: { cryptocurrencyId: parseInt(id) }
		})
	)

	const { data: exchanges } = useSuspenseQuery({
		queryKey: ['exchanges-for-crypto', id],
		queryFn: async () => {
			const exchangePromises = exchangeCryptocurrencies.map((ec) =>
				orpc.exchange.findById.call(ec.exchangeId)
			)
			const results = await Promise.all(exchangePromises)
			return results.filter(Boolean)
		},
	})

	const deleteMutation = useMutation(
		orpc.cryptocurrency.remove.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.cryptocurrency.key()
				})
				router.navigate({ to: '/cryptocurrencies' })
			},
			onError: (error) => {
				console.error('Failed to delete cryptocurrency:', error)
			}
		})
	)

	const handleDelete = () => {
		deleteMutation.mutate(cryptocurrency.id)
		setShowDeleteModal(false)
	}

	return (
		<div className="py-6">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-6">
					<Link
						to="/cryptocurrencies"
						className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
					>
						<svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
						</svg>
						Back to Cryptocurrencies
					</Link>
				</div>

				<div className="bg-white shadow-lg rounded-lg">
					<div className="px-4 py-5 sm:px-6 border-b border-gray-200">
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<img
									src={cryptocurrency.logo}
									alt={cryptocurrency.name}
									className="h-12 w-12 rounded-full mr-4"
									onError={(e) => {
										e.currentTarget.style.display = 'none'
									}}
								/>
								<div>
									<h1 className="text-2xl font-bold text-gray-900">{cryptocurrency.name}</h1>
									<p className="text-sm text-gray-600">{cryptocurrency.symbol} • {cryptocurrency.slug}</p>
								</div>
							</div>
							<div className="flex space-x-3">
								<Link
									to="/cryptocurrencies/$id/edit"
									params={{ id: cryptocurrency.id.toString() }}
									className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
								>
									Edit
								</Link>
								<button
									onClick={() => setShowDeleteModal(true)}
									className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
								>
									Delete
								</button>
							</div>
						</div>
					</div>

					<div className="px-4 py-5 sm:p-6">
						<dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
							<div>
								<dt className="text-sm font-medium text-gray-500">Name</dt>
								<dd className="mt-1 text-sm text-gray-900">{cryptocurrency.name}</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">Symbol</dt>
								<dd className="mt-1 text-sm text-gray-900">{cryptocurrency.symbol}</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">Slug</dt>
								<dd className="mt-1 text-sm text-gray-900">{cryptocurrency.slug}</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">CoinMarketCap ID</dt>
								<dd className="mt-1 text-sm text-gray-900">{cryptocurrency.cmcId}</dd>
							</div>
							<div className="sm:col-span-2">
								<dt className="text-sm font-medium text-gray-500">Logo URL</dt>
								<dd className="mt-1 text-sm text-gray-900 break-all">{cryptocurrency.logo}</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">Created</dt>
								<dd className="mt-1 text-sm text-gray-900">
									{new Date(cryptocurrency.createdAt).toLocaleDateString()}
								</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">Updated</dt>
								<dd className="mt-1 text-sm text-gray-900">
									{new Date(cryptocurrency.updatedAt).toLocaleDateString()}
								</dd>
							</div>
						</dl>
					</div>
				</div>

				{/* Exchange Assignments */}
				<div className="mt-8 bg-white shadow-lg rounded-lg">
					<div className="px-4 py-5 sm:px-6 border-b border-gray-200">
						<h3 className="text-lg leading-6 font-medium text-gray-900">
							Exchange Assignments ({exchangeCryptocurrencies.length})
						</h3>
						<p className="mt-1 max-w-2xl text-sm text-gray-500">
							Exchanges where this cryptocurrency is listed
						</p>
					</div>
					<div className="px-4 py-5 sm:p-6">
						{(exchangeCryptocurrencies.length) === 0 ? (
							<p className="text-gray-500 text-center py-4">No exchange assignments found</p>
						) : (
							<div className="space-y-4">
								{exchangeCryptocurrencies.map((assignment) => {
									const exchange = exchanges.find((e) => e.id === (assignment).exchangeId)
									return (
										<div key={(assignment).id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
											<div className="flex items-center space-x-3">
												<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
													<span className="text-xs font-medium text-gray-600">
														{exchange?.name.substring(0, 2).toUpperCase()}
													</span>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-900">{exchange?.name}</p>
													<p className="text-sm text-gray-500">Assignment ID: {(assignment).id}</p>
												</div>
											</div>
											<Link
												to="/assignments/$id"
												params={{ id: (assignment).id.toString() }}
												className="text-blue-600 hover:text-blue-500 text-sm font-medium"
											>
												View Details
											</Link>
										</div>
									)
								})}
							</div>
						)}
					</div>
				</div>

				{/* Delete Modal */}
				{showDeleteModal && (
					<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
						<div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
							<div className="mt-3 text-center">
								<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
									<svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
									</svg>
								</div>
								<h3 className="text-lg font-medium text-gray-900 mt-2">Delete Cryptocurrency</h3>
								<div className="mt-2 px-7 py-3">
									<p className="text-sm text-gray-500">
										Are you sure you want to delete "{cryptocurrency.name}"? This action cannot be undone and will also remove all associated exchange assignments.
									</p>
								</div>
								<div className="items-center px-4 py-3">
									<button
										onClick={handleDelete}
										className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
									>
										Delete
									</button>
									<button
										onClick={() => setShowDeleteModal(false)}
										className="mt-3 px-4 py-2 bg-white text-gray-500 text-base font-medium rounded-md w-full shadow-sm border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
