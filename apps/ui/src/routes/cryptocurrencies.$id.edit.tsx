import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { orpc } from '@/orpc/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/cryptocurrencies/$id/edit')({
	component: EditCryptocurrency,
})


function EditCryptocurrency() {
	const { id } = Route.useParams()
	const router = useRouter()
	const queryClient = useQueryClient()

	const { data: cryptocurrency } = useSuspenseQuery(
		(orpc as any).cryptocurrency.findById.queryOptions({
			input: parseInt(id)
		})
	)

	const updateMutation = useMutation(
		(orpc as any).cryptocurrency.update.mutationOptions({
			onSuccess: (data: any) => {
				queryClient.invalidateQueries({
					queryKey: (orpc as any).cryptocurrency.key()
				})
				router.navigate({
					to: '/cryptocurrencies/$id',
					params: { id: data.id.toString() }
				})
			},
			onError: (error: any) => {
				console.error('Failed to update cryptocurrency:', error)
			}
		})
	)

	const form = useForm({
		defaultValues: {
			name: (cryptocurrency as any).name,
			symbol: (cryptocurrency as any).symbol,
			slug: (cryptocurrency as any).slug,
			logo: (cryptocurrency as any).logo,
			cmcId: (cryptocurrency as any).cmcId
		},
		onSubmit: async ({ value }) => {
			updateMutation.mutate({ 
				id: (cryptocurrency as any).id,
				payload: value as any
			} as any)
		},
	})

	return (
		<div className="py-6">
			<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-6">
					<Link
						to="/cryptocurrencies/$id"
						params={{ id }}
						className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
					>
						<svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
						</svg>
						Back to {(cryptocurrency as any).name}
					</Link>
				</div>

				<div className="bg-white shadow-lg rounded-lg">
					<div className="px-4 py-5 sm:px-6 border-b border-gray-200">
						<h1 className="text-lg font-medium text-gray-900">Edit Cryptocurrency</h1>
						<p className="mt-1 text-sm text-gray-600">
							Update the cryptocurrency information
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
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<form.Field name="name">
								{(field) => (
									<div>
										<Label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
											Name *
										</Label>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Bitcoin"
											className="mt-1"
										/>
										{field.state.meta.errors.length > 0 && (
											<p className="mt-2 text-sm text-red-600">
												{field.state.meta.errors[0]}
											</p>
										)}
									</div>
								)}
							</form.Field>

							<form.Field name="symbol">
								{(field) => (
									<div>
										<Label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
											Symbol *
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
										{field.state.meta.errors.length > 0 && (
											<p className="mt-2 text-sm text-red-600">
												{field.state.meta.errors[0]}
											</p>
										)}
									</div>
								)}
							</form.Field>

							<form.Field name="slug">
								{(field) => (
									<div>
										<Label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
											Slug *
										</Label>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
											placeholder="bitcoin"
											className="mt-1"
										/>
										{field.state.meta.errors.length > 0 && (
											<p className="mt-2 text-sm text-red-600">
												{field.state.meta.errors[0]}
											</p>
										)}
									</div>
								)}
							</form.Field>

							<form.Field name="cmcId">
								{(field) => (
									<div>
										<Label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
											CoinMarketCap ID *
										</Label>
										<Input
											id={field.name}
											name={field.name}
											type="number"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
											placeholder="1"
											className="mt-1"
										/>
										{field.state.meta.errors.length > 0 && (
											<p className="mt-2 text-sm text-red-600">
												{field.state.meta.errors[0]}
											</p>
										)}
									</div>
								)}
							</form.Field>
						</div>

						<form.Field name="logo">
							{(field) => (
								<div>
									<Label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
										Logo URL *
									</Label>
									<Input
										id={field.name}
										name={field.name}
										type="url"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="https://example.com/bitcoin-logo.png"
										className="mt-1"
									/>
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
								to="/cryptocurrencies/$id"
								params={{ id }}
								className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								Cancel
							</Link>
							<Button
								type="submit"
								disabled={updateMutation.isPending}
								className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
							>
								{updateMutation.isPending ? 'Updating...' : 'Update Cryptocurrency'}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
