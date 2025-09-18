import { type PropsWithChildren } from '@kitajs/html';

const SideBarItem = ({ title, path }: { title: string, path: string }) => {
	return (
		<li><a
			hx-target='#main-content'
			hx-get={path}
			hx-swap='innerHTML'
			hx-trigger='click'
			hx-push-url="true"
			hx-indicator='.progress'
			safe
		>{title}</a></li>
	);
}

export const Sidebar = ({ children }: PropsWithChildren) => {
	return (
		<div class="z-30 drawer lg:drawer-open">
			<input id="left-drawer" type="checkbox" class="drawer-toggle" />
			<div class="drawer-side">
				<ul class="menu bg-base-300 text-base-content h-full p-4">
					<li class="font-semibold text-xl">
						<a
							href='/'
						><img
								class="mask mask-squircle w-14"
								src='/public/favicon.ico'
							/>arbitmage</a>
					</li>
					<SideBarItem title='Dashboard' path='dashboard' />
					<SideBarItem title='Signal' path='signal' />
					<SideBarItem title='Exchange Management' path='markets' />
					<SideBarItem title='Cryptocurrency Management' path='coins' />
					<SideBarItem title='Chain Management' path='chain' />
					<SideBarItem title='Assignment' path='assignment' />
				</ul>
				<div class={""}>
					build with love by <a href="https://sulthonuladib.dev">Sulthonul Adib</a>
				</div>
			</div>
			<div class="drawer-content flex flex-col">
				{children}
			</div>
		</div>
	);
}
