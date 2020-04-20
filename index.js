// Define element handler
class ElementHandler {
	element(element) {
		if (element.tagName === "title") {
			element.setInnerContent("CloudFlare Workers Application");
		}
		if (element.tagName === "h1") {
			element.setInnerContent("My Profile");
		}
		if (element.tagName === "p") {
			element.setInnerContent(
				"Hello! My name is Daniyal. You can discover more about me here: "
			);
		}
		if (element.tagName === "a") {
			element.setAttribute("href", "https://www.linkedin.com/in/dani-syed/");
			element.setInnerContent("Daniyal Syed on LinkedIn");
		}
	}
}

addEventListener("fetch", (event) => {
	event.respondWith(handleRequest(event.request));
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
	// Make fetch request to variants object
	let paths = await fetch(
		"https://cfw-takehome.developers.workers.dev/api/variants"
	);

	// Get both paths of variants
	let data = await paths.json();
	let variants = data.variants;

	// Get random index for variant 1 or 2
	let index = Math.floor(Math.random() * 2);

	// Prepare random random variant page as response
	let page = await fetch(variants[index]);
	page = new Response(page.body, page);

	// Set cookie
	page.headers.set("set-cookie", "id = " + index.toString());

	// Apply HTML modifications
	let htmlwriter = new HTMLRewriter();
	htmlwriter
		.on("p", new ElementHandler())
		.on("title", new ElementHandler())
		.on("a", new ElementHandler())
		.on("h1", new ElementHandler());
	return htmlwriter.transform(page);
}
