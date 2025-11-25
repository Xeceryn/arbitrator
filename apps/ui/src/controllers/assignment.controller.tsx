// .onError((error) => {
// 	switch (error.code) {
// 		case "UNKNOWN":
// 			console.log("Unknown error", error);
// 			break;
//
// 		case "NOT_FOUND":
// 			console.log("Not found", error);
// 			return redirect("/home");
// 		case "INTERNAL_SERVER_ERROR":
// 			return (
// 				<BaseLayout title="Error" children={<div>Internal server error</div>} />
// 			);
// 		case "PARSE":
// 			console.log("Parse error", error);
// 			break;
// 		default:
// 			console.log("Unhandled error", error.error);
// 			return (
// 				<BaseLayout title="Error" children={<div>Unhandled error</div>} />
// 			);
// 	}
// })
//
// .get("/assignments", async ({ hxRequest }) => {
// 	if (hxRequest) {
//
// 		return (
// 			<>
// 				<title>Assignment</title>
// 				<Assignment />
// 			</>
// 		)
// 	}
// 	const assignmentTable = await Assignment();
// 	return BaseLayout({
// 		title: "Assignment",
// 		children: assignmentTable
// 	})
// })
//
// .get("/assignments/market/:id/coin", async ({ params, hxRequest, set }) => {
// 	if (!hxRequest) {
// 		return redirect("/assignments");
// 	}
//
// 	set.headers = {
// 		"hx-push-url": `?market_id=${params.id}`
// 	}
//
// 	return (
// 		<>
// 			<CoinAssignmentTable id={params.id} />
// 		</>
// 	)
//
// }, {
// 	params: t.Object({
// 		id: t.Number()
// 	})
// })
