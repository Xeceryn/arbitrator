import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { orpc } from '@/orpc/client'

export const Route = createFileRoute('/')({
	component: DashboardHome,
})

function DashboardHome() {
	const { data: cryptocurrencies } = useSuspenseQuery(
		orpc.cryptocurrency.list.queryOptions({ input: {} })
	)
	const { data: exchanges } = useSuspenseQuery(
		orpc.exchange.list.queryOptions()
	)
	const { data: exchangeCryptocurrencies } = useSuspenseQuery(
		orpc.exchangeCryptocurrency.list.queryOptions()
	)
	const { data: exchangeCryptocurrencyChains } = useSuspenseQuery(
		orpc.exchangeCryptocurrencyChain.list.queryOptions()
	)

	const stats = {
		totalCryptocurrencies: cryptocurrencies.data.length,
		totalExchanges: exchanges.length,
		totalAssignments: exchangeCryptocurrencies.length,
		totalChains: exchangeCryptocurrencyChains.length
	}

	return (
		<div className="py-6">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
					<p className="mt-1 text-sm text-gray-600">
						Overview of your cryptocurrency exchange management system
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="bg-white rounded-lg shadow p-6">
						<div className="flex items-center">
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-600">Total Cryptocurrencies</p>
								<p className="text-2xl font-bold text-gray-900">{stats.totalCryptocurrencies}</p>
							</div>
							<div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
								<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
								</svg>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow p-6">
						<div className="flex items-center">
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-600">Total Exchanges</p>
								<p className="text-2xl font-bold text-gray-900">{stats.totalExchanges}</p>
							</div>
							<div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
								<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
								</svg>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow p-6">
						<div className="flex items-center">
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-600">Active Assignments</p>
								<p className="text-2xl font-bold text-gray-900">{stats.totalAssignments}</p>
							</div>
							<div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
								<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow p-6">
						<div className="flex items-center">
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-600">Chain Configurations</p>
								<p className="text-2xl font-bold text-gray-900">{stats.totalChains}</p>
							</div>
							<div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
								<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
								</svg>
							</div>
						</div>
					</div>
				</div>

				{/* Recent Activity */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="bg-white rounded-lg shadow">
						<div className="px-6 py-4 border-b border-gray-200">
							<h3 className="text-lg font-medium text-gray-900">Recent Cryptocurrencies</h3>
						</div>
						<div className="p-6">
							{
								<div className="space-y-3">
									{cryptocurrencies.data.map((crypto) => (
										<div key={crypto.id} className="flex items-center justify-between py-2">
											<div className="flex items-center space-x-3">
												<img
													src={crypto.logo}
													alt={crypto.name}
													className="w-8 h-8 rounded-full"
													onError={(e) => {
														e.currentTarget.style.display = 'none'
													}}
												/>
												<div>
													<p className="text-sm font-medium text-gray-900">{crypto.name}</p>
													<p className="text-sm text-gray-500">{crypto.symbol}</p>
												</div>
											</div>
											<span className="text-sm text-gray-400">CMC #{crypto.cmcId}</span>
										</div>
									))}
								</div>
							}
						</div>
					</div>

					<div className="bg-white rounded-lg shadow">
						<div className="px-6 py-4 border-b border-gray-200">
							<h3 className="text-lg font-medium text-gray-900">Active Exchanges</h3>
						</div>
						<div className="p-6">
							{exchanges.length === 0 ? (
								<p className="text-gray-500 text-center py-4">No exchanges found</p>
							) : (
								<div className="space-y-3">
									{exchanges.slice(0, 5).map((exchange) => (
										<div key={exchange.id} className="flex items-center justify-between py-2">
											<div className="flex items-center space-x-3">
												<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
													<span className="text-xs font-medium text-gray-600">
														{exchange.name.substring(0, 2).toUpperCase()}
													</span>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-900">{exchange.name}</p>
													<p className="text-sm text-gray-500">{exchange.slug}</p>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
