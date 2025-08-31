import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { orpc } from '@/orpc/client'
import { useState } from 'react'

export const Route = createFileRoute('/cryptocurrencies')({
	component: CryptocurrencyList,
})

function CryptocurrencyList() {
	const { data: cryptocurrencies } = useSuspenseQuery(
		orpc.cryptocurrency.list.queryOptions({ input: {} })
	)
	const [searchTerm, setSearchTerm] = useState('')

	const filteredCryptos = ((cryptocurrencies)?.data || (cryptocurrencies) || []).filter((crypto) =>
		crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<div className="py-6">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-2xl font-bold text-gray-900">Cryptocurrencies</h1>
						<p className="mt-2 text-sm text-gray-700">
							Manage and track all cryptocurrencies in your system
						</p>
					</div>
					<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
						<Link
							to="/cryptocurrencies/add"
							className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
						>
							Add Cryptocurrency
						</Link>
					</div>
				</div>

				<div className="mt-6">
					<div className="mb-4">
						<input
							type="text"
							placeholder="Search cryptocurrencies..."
							className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					<div className="bg-white shadow overflow-hidden sm:rounded-md">
						{filteredCryptos.length === 0 ? (
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
										d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
									/>
								</svg>
								<h3 className="mt-2 text-sm font-medium text-gray-900">No cryptocurrencies</h3>
								<p className="mt-1 text-sm text-gray-500">
									Get started by adding a new cryptocurrency.
								</p>
								<div className="mt-6">
									<Link
										to="/cryptocurrencies/add"
										className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
									>
										Add Cryptocurrency
									</Link>
								</div>
							</div>
						) : (
							<ul className="divide-y divide-gray-200">
								{filteredCryptos.map((crypto) => (
									<li key={crypto.id}>
										<Link
											to="/cryptocurrencies/$id"
											params={{ id: crypto.id.toString() }}
											className="block hover:bg-gray-50 px-4 py-4 sm:px-6"
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center">
													<div className="flex-shrink-0">
														<img
															className="h-10 w-10 rounded-full"
															src={crypto.logo}
															alt={crypto.name}
															onError={(e) => {
																e.currentTarget.style.display = 'none'
															}}
														/>
													</div>
													<div className="ml-4">
														<div className="flex items-center">
															<div className="text-sm font-medium text-gray-900">
																{crypto.name}
															</div>
															<div className="ml-2 flex-shrink-0 flex">
																<p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
																	{crypto.symbol}
																</p>
															</div>
														</div>
														<div className="text-sm text-gray-500">
															Slug: {crypto.slug} • CMC ID: {crypto.cmcId}
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
