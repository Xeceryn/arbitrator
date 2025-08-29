import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orpc } from '@/orpc/client'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/exchanges/$id')({
	component: ExchangeDetail,
})

function ExchangeDetail() {
	const { id } = Route.useParams()
	const router = useRouter()
	const queryClient = useQueryClient()

	const { data: exchange } = useSuspenseQuery(
		(orpc as any).exchange.findById.queryOptions({
			input: parseInt(id)
		})
	)

	const deleteMutation = useMutation(
		(orpc as any).exchange.remove.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: (orpc as any).exchange.key()
				})
				router.navigate({ to: '/exchanges' })
			},
			onError: (error: any) => {
				console.error('Failed to delete exchange:', error)
			}
		})
	)

	const handleDelete = () => {
		if (window.confirm(`Are you sure you want to delete ${(exchange as any).name}? This action cannot be undone.`)) {
			deleteMutation.mutate((exchange as any).id)
		}
	}

	return (
		<div className="py-6">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-6">
					<Link
						to="/exchanges"
						className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
					>
						<svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
						</svg>
						Back to Exchanges
					</Link>
				</div>

				<div className="bg-white shadow-lg rounded-lg overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
									<span className="text-lg font-bold text-gray-600">
										{(exchange as any).name.substring(0, 2).toUpperCase()}
									</span>
								</div>
								<div>
									<h1 className="text-2xl font-bold text-gray-900">{(exchange as any).name}</h1>
									<p className="text-gray-600">{(exchange as any).slug}</p>
								</div>
							</div>
							<div className="flex space-x-3">
								<Link
									to="/exchanges/$id/edit"
									params={{ id }}
									className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
								>
									Edit
								</Link>
								<Button
									onClick={handleDelete}
									disabled={deleteMutation.isPending}
									variant="destructive"
									className="px-4 py-2 text-sm"
								>
									{deleteMutation.isPending ? 'Deleting...' : 'Delete'}
								</Button>
							</div>
						</div>
					</div>

					<div className="px-6 py-4">
						<dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
							<div>
								<dt className="text-sm font-medium text-gray-500">Exchange Name</dt>
								<dd className="mt-1 text-sm text-gray-900">{(exchange as any).name}</dd>
							</div>

							<div>
								<dt className="text-sm font-medium text-gray-500">Slug</dt>
								<dd className="mt-1 text-sm text-gray-900">{(exchange as any).slug}</dd>
							</div>

							<div>
								<dt className="text-sm font-medium text-gray-500">CoinMarketCap ID</dt>
								<dd className="mt-1 text-sm text-gray-900">{(exchange as any).cmcId}</dd>
							</div>

							<div>
								<dt className="text-sm font-medium text-gray-500">Base Currency</dt>
								<dd className="mt-1 text-sm text-gray-900">{(exchange as any).baseCurrency}</dd>
							</div>

							<div>
								<dt className="text-sm font-medium text-gray-500">Registered on CMC</dt>
								<dd className="mt-1 text-sm text-gray-900">
									{(exchange as any).registeredOnCmc ? 'Yes' : 'No'}
								</dd>
							</div>

							<div>
								<dt className="text-sm font-medium text-gray-500">Created</dt>
								<dd className="mt-1 text-sm text-gray-900">
									{new Date((exchange as any).createdAt).toLocaleDateString()}
								</dd>
							</div>

							<div>
								<dt className="text-sm font-medium text-gray-500">Last Updated</dt>
								<dd className="mt-1 text-sm text-gray-900">
									{new Date((exchange as any).updatedAt).toLocaleDateString()}
								</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</div>
	)
}