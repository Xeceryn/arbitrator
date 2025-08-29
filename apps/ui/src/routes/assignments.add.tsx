import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { orpc } from '@/orpc/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/assignments/add')({
	component: AddAssignment,
})

function AddAssignment() {
	const router = useRouter()
	const queryClient = useQueryClient()

	const { data: cryptocurrencies } = useSuspenseQuery(
		(orpc as any).cryptocurrency.list.queryOptions()
	)

	const { data: exchanges } = useSuspenseQuery(
		(orpc as any).exchange.list.queryOptions()
	)

	const createMutation = useMutation(
		(orpc as any).exchangeCryptocurrency.assign.mutationOptions({
			onSuccess: (data: any) => {
				queryClient.invalidateQueries({
					queryKey: (orpc as any).exchangeCryptocurrency.key()
				})
				router.navigate({
					to: '/assignments/$id',
					params: { id: data.id.toString() }
				})
			},
			onError: (error: any) => {
				console.error('Failed to create assignment:', error)
			}
		})
	)

	const form = useForm({
		defaultValues: {
			exchangeId: 0,
			cryptocurrencyId: 0,
			exchangeSymbol: ''
		},
		onSubmit: async ({ value }) => {
			createMutation.mutate(value as any)
		},
	})

	return (
		<div className="py-6">
			<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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

				<div className="bg-white shadow-lg rounded-lg">
					<div className="px-4 py-5 sm:px-6 border-b border-gray-200">
						<h1 className="text-lg font-medium text-gray-900">Create Assignment</h1>
						<p className="mt-1 text-sm text-gray-600">
							Assign a cryptocurrency to an exchange
						</p>
					</div>

					<form
						onSubmit={(e) => {
							e.preventDefault()
							e.stopPropagation()
							form.handleSubmit()
						}}
						className="px-4 py-5 sm:p-6 space-y-6"
					>
						<form.Field name="exchangeId">
							{(field) => (
								<div>
									<Label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
										Exchange *
									</Label>
									<select
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
										className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									>
										<option value={0}>Select an exchange</option>
										{((exchanges as any)?.data || (exchanges as any) || []).map((exchange: any) => (
											<option key={(exchange as any).id} value={(exchange as any).id}>
												{(exchange as any).name}
											</option>
										))}
									</select>
									{field.state.meta.errors.length > 0 && (
										<p className="mt-2 text-sm text-red-600">
											{field.state.meta.errors[0]}
										</p>
									)}
								</div>
							)}
						</form.Field>

						<form.Field name="cryptocurrencyId">
							{(field) => (
								<div>
									<Label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
										Cryptocurrency *
									</Label>
									<select
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
										className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									>
										<option value={0}>Select a cryptocurrency</option>
										{((cryptocurrencies as any)?.data || (cryptocurrencies as any) || []).map((crypto: any) => (
											<option key={crypto.id} value={crypto.id}>
												{crypto.name} ({crypto.symbol})
											</option>
										))}
									</select>
									{field.state.meta.errors.length > 0 && (
										<p className="mt-2 text-sm text-red-600">
											{field.state.meta.errors[0]}
										</p>
									)}
								</div>
							)}
						</form.Field>

						<form.Field name="exchangeSymbol">
							{(field) => (
								<div>
									<Label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
										Exchange Symbol *
									</Label>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value.toUpperCase())}
										placeholder="BTC"
										className="mt-1"
									/>
									<p className="mt-1 text-xs text-gray-500">
										The symbol used for this cryptocurrency on the selected exchange
									</p>
									{field.state.meta.errors.length > 0 && (
										<p className="mt-2 text-sm text-red-600">
											{field.state.meta.errors[0]}
										</p>
									)}
								</div>
							)}
						</form.Field>

						<div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
							<Link
								to="/assignments"
								className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								Cancel
							</Link>
							<Button
								type="submit"
								disabled={createMutation.isPending}
								className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
							>
								{createMutation.isPending ? 'Creating...' : 'Create Assignment'}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}