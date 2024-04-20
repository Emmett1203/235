"use strict";
	window.onload = init;
	
	function init(){
		document.querySelector("#search").onclick = getData;
	}
	
	function getData(){
		// 1 - main entry point to web service
		const SERVICE_URL = "https://www.amiiboapi.com/api/amiibo/?name=";
		
		// No API Key required!
		
		// 2 - build up our URL string
		// not necessary for this service endpoint
		let url = SERVICE_URL;
		
		// 3 - parse the user entered term we wish to search
		// not necessary for this service endpoint
		let term = document.querySelector("#searchterm").value.trim();
		term = encodeURIComponent(term);
		url+=term;
		
		// 4 - update the UI
		document.querySelector("#debug").innerHTML = `<b>Contacting server...</a>`;
		
		// 5 - create a new XHR object
		let xhr = new XMLHttpRequest();
	

		// 6 - set the onload handler
		xhr.onload = dataLoaded;
	
		// 7 - set the onerror handler
		xhr.onerror = dataError;

		// 8 - open connection and send the request
		xhr.open("GET",url);
		xhr.send();
	}
	
	function dataError(e){
		console.log("An error occurred");
	}
	
	function dataLoaded(e){
		// 1 - e.target is the xhr object
		let xhr = e.target;

		//Get tpye
		var amiiboStyle = document.querySelector("#amiiboStyle");
		var styleType = amiiboStyle.value;

		//Check release
		var amiiboDate = document.querySelector("#amiiboDate");
		var dateType = amiiboDate.value;

		// 2 - xhr.responseText is the JSON file we just downloaded
		console.log(xhr.responseText);
	
		// 3 - turn the text into a parsable JavaScript object
		let obj = JSON.parse(xhr.responseText);
		
		// 4 - if there is an array of results, loop through them
		let results = obj.amiibo;
		let bigString = ``;
        for(let i=0; i<results.length; i++){
        let firstResult = results[i];
		
		//I apologize in advance for this code. Actually I'm not sorry. I'm evil.
		let line = ``;

		if(dateType == "na" && firstResult.release.na != null){
			line = `<div class='result'><a href="${firstResult.image}"target="_blank"><img src="${firstResult.image}" title="${firstResult.character}" /></a>`
			line += `<span>${firstResult.character}</span>`  
			line += `<p>North America: ${firstResult.release.na}</p></div>`
		}
		
		if(dateType == "eu" && firstResult.release.eu != null){
			line = `<div class='result'><a href="${firstResult.image}"target="_blank"><img src="${firstResult.image}" title="${firstResult.character}" /></a>`
			line += `<span>${firstResult.character}</span>`  
			line += `<p>Europe: ${firstResult.release.eu}</p></div>`
		}	
		
		if(dateType == "au" && firstResult.release.au != null){
			line = `<div class='result'><a href="${firstResult.image}"target="_blank"><img src="${firstResult.image}" title="${firstResult.character}" /></a>`
			line += `<span>${firstResult.character}</span>`  
			line += `<p>Australia: ${firstResult.release.au}</p></div>`
		}		
		
		if(dateType == "jp" && firstResult.release.jp != null){
			line = `<div class='result'><a href="${firstResult.image}"target="_blank"><img src="${firstResult.image}" title="${firstResult.character}" /></a>`
			line += `<span>${firstResult.character}</span>`  
			line += `<p>Japan: ${firstResult.release.jp}</p></div>`
		}			
		
		if(dateType == "all"){
			line = `<div class='result'><a href="${firstResult.image}"target="_blank"><img src="${firstResult.image}" title="${firstResult.character}" /></a>`
			line += `<span>${firstResult.character}</span></div>`
		}

		console.log(firstResult.type);
		console.log(amiiboStyle);

		//Type
		if(styleType == "all")
		{
			bigString += line;
		}
		else if(firstResult.type != "all" && firstResult.type == styleType)
		{
			bigString += line;
		}


        }

        let plauge = `<div class='result'><img src="images/Minilla.png" title="Plauge" />`;
        plauge += `<h2>Plague</h2></div>`

        bigString += plauge;

		// 5 - display final results to user
		document.querySelector("#content").innerHTML = bigString;

        document.querySelector("#debug").innerHTML = `<b>Done!</a>`;
	}	
	