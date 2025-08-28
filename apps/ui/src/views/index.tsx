

export const component = () => {
	const doctype = "<!DOCTYPE html>"

	return (
		<>
			{doctype}
			< html lang="en" >
				<head>
					<meta charset="UTF-8"></meta>
					<meta name="viewport" content="width=device-width, initial-scale=1"></meta>
					<title>UI</title>
					<script src="../../assets/lister.ts"></script>
				</head>

				<body>
					<div>
						<button id="test" type="button">HELLO</button>
					</div>
				</body>

			</html >
		</>
	);
};
