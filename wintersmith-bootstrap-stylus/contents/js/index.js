if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}



$(document).ready(function () {

	//------------------------------------------------
	//  GOTO WIKI/JIRA BUTTONS
	//------------------------------------------------
	var JiraNumber = $("#jiraCardNumber");

	function getCardNumber () {
		var cardNumber = JiraNumber.val(), href = "";
		
		if (!cardNumber.startsWith("NOVAPRIMA-")) {
			href = "NOVAPRIMA-";
		}

		href += cardNumber; 

		return href;
	}

	$("#gotoJira").click(function () {
		var href = getCardNumber(), url = "https://jira.smals.be/browse/" + href;
		window.open(url);
	});

	$("#gotoWiki").click(function () {
		var href = getCardNumber(), url = "http://novaprima:8080/wiki/Wiki.jsp?page=" + href;
		window.open(url);
	});


	//------------------------------------------------
	//  COUNTDOWN BUTTONS
	//------------------------------------------------
	function getDateString() {
		// get current date string
		var now = new Date();
		var datestring = now.format("yyyymmdd") + "T";
		return datestring;
	}

	var count1550 = $("#count1550"), count1620 = $("#count1620"), count1650 = $("#count1650");
	function setCountdownButtons () {
		var datestring = getDateString();
		count1550.attr('href', "http://www.timeanddate.com/countdown/generic?iso=" + datestring + "1550&p0=48")
		count1620.attr('href', "http://www.timeanddate.com/countdown/generic?iso=" + datestring + "1620&p0=48")
		count1650.attr('href', "http://www.timeanddate.com/countdown/generic?iso=" + datestring + "1650&p0=48")

		window.setTimeout(setCountdownButtons, 10000);
	}
	setCountdownButtons();


});