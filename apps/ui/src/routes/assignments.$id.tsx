import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orpc } from '@/orpc/client'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/assignments/$id')({
	component: AssignmentDetail,
})

function AssignmentDetail() {
	const { id } = Route.useParams()
	const router = useRouter()
	const queryClient = useQueryClient()

	const { data: assignment } = useSuspenseQuery(
		(orpc).exchangeCryptocurrency.findById.queryOptions({
			input: parseInt(id)
		})
	)

	const deleteMutation = useMutation(
		orpc.exchangeCryptocurrency.unassign.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: (orpc).exchangeCryptocurrency.key()
				})
				router.navigate({ to: '/assignments' })
			},
			onError: (error: any) => {
				console.error('Failed to delete assignment:', error)
			}
		})
	)

	const handleDelete = () => {
		if (window.confirm('Are you sure you want to unassign this cryptocurrency from the exchange? This action cannot be undone.')) {
			deleteMutation.mutate((assignment).id)
		}
	}

	return (
		<div className="py-6">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-6">
					<Link
						to="/assignments"
						className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
					>
						<svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
						</svg>
						Back to Assignments
					</Link>
				</div>

				<div className="bg-white shadow-lg rounded-lg overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-bold text-gray-900">Assignment Details</h1>
								<p className="text-gray-600">Exchange cryptocurrency assignment</p>
							</div>
							<div className="flex space-x-3">
								<Button
									onClick={handleDelete}
									disabled={deleteMutation.isPending}
									variant="destructive"
									className="px-4 py-2 text-sm"
								>
									{deleteMutation.isPending ? 'Unassigning...' : 'Unassign'}
								</Button>
							</div>
						</div>
					</div>

					<div className="px-6 py-4">
						<dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
							<div>
								<dt className="text-sm font-medium text-gray-500">Assignment ID</dt>
								<dd className="mt-1 text-sm text-gray-900">{(assignment).id}</dd>
							</div>

							<div>
								<dt className="text-sm font-medium text-gray-500">Exchange Symbol</dt>
								<dd className="mt-1 text-sm text-gray-900">{(assignment).exchangeSymbol}</dd>
							</div>

							<div>
								<dt className="text-sm font-medium text-gray-500">Exchange ID</dt>
								<dd className="mt-1 text-sm text-gray-900">{(assignment).exchangeId}</dd>
							</div>

							<div>
								<dt className="text-sm font-medium text-gray-500">Cryptocurrency ID</dt>
								<dd className="mt-1 text-sm text-gray-900">{(assignment).cryptocurrencyId}</dd>
							</div>

							<div>
								<dt className="text-sm font-medium text-gray-500">Created</dt>
								<dd className="mt-1 text-sm text-gray-900">
									{new Date((assignment).createdAt).toLocaleDateString()}
								</dd>
							</div>

							<div>
								<dt className="text-sm font-medium text-gray-500">Last Updated</dt>
								<dd className="mt-1 text-sm text-gray-900">
									{new Date((assignment).updatedAt).toLocaleDateString()}
								</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</div>
	)
}
