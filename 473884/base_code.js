function seoCheck(html_content) {
	checkValidHTML(html_content)

	//If it is valid

	checkTags(html_content)
}

function checkValidHTML(content){
	// implement this to check if the content is valid HTML
}

function checkTags(content){
	// implement this to check if the required tags are present
}

module.exports = { seoCheck }