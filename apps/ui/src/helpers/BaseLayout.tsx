import type { PropsWithChildren } from '@kitajs/html';
import { Navbar } from '../views/components/Navbar';
import { Sidebar } from '../views/components/Sidebar';
import { NotificationToast } from '../views/components/NotificationToast';


type Props = PropsWithChildren<{
	title?: string;
}>

export const BaseLayout = async ({ title = 'E9 - Arbitmage', children }: Props) => {
	return (
		<>
			{
				`<!DOCTYPE html>`
			}
			<html lang="en" data-theme="dark"
			>
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
					<title safe>{title}</title>
					<link rel="icon" href="/public/favicon.ico" />

					<link href="/public/css/styles.css" rel="stylesheet" />

					<script src="/public/js/htmx.min.js"></script>
					<script src="/public/js/hyperscript.min.js"></script>
					<script src="/public/js/lucide.js"></script>
					<script src="/public/js/theme-change.js"></script>

					<script src="/public/dist/scripts.js"></script>
					<script src="/public/dist/notification-toast.js"></script>

					{
						// <script src="https://unpkg.com/lucide@latest"></script>

						// <script>
						// 	{`lucide.createIcons();`}
						// </script>
					}
				</head>
				<body hx-indicator='.progress'>
					<Sidebar>
						<progress class="progress w-full"></progress>
						<Navbar>
							<div id="toast-container" class=" z-100 toast toast-bottom toast-end">
								<NotificationToast message="testing notification" level="info" />
							</div>
						</Navbar>
						<div id="main-content">
							{children}
						</div>
					</Sidebar>

					<footer class="footer justify-center sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
						<aside>
							<p>Copyright © BedokCorp {new Date().getFullYear()} - Built with Love by <a class={"font-bold"} href="https://sulthonuladib.dev">Sulthonul Adib</a></p>
						</aside>
					</footer>
				</body>
			</html >
		</>
	);
};

