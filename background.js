
var text = prompt("Введите текст для устранения мошеннических модификаций и чисел");
changeText (text);


function changeText(text){
	text = text.replace(/  +/gi," ");
	if(text == " "||text == "") alert("Пустое значение")
	text  = text.replace(/%/gi, " процент ").replace(/&/gi, "8").toLowerCase().replace(/  +/gi," ");
	if(text != / */gi)
	text = checkForLatin(text);
	if(text != / */gi)
	text = checkNumbers(text);
	if(text != / */gi)
	text = checkMistakes(text);
	if(text != / */gi)
	text = text.replace(/\d/gi,"").replace(/  +/gi," ");
	alert(text);
}

//проверка орфографии через yandex api
function checkMistakes(text){
	var link = 'https://speller.yandex.net/services/spellservice/checkText?text=' + text + "&options=520&format=plain"; 
	var errorReg = /<error.*?<\/error>/gi, wordReg = /(?<=<word>).*?(?=<\/word>)/, changeReg = /(?<=<s>).*?(?=<\/s>)/;
	var request = new XMLHttpRequest();
	request.open("GET", link, false);
	request.onreadystatechange = function(answer) {
		if(request.readyState == 4 && request.status == 200) {  
			var errors = request.response.match(errorReg);
			var wordError  = "", wordCorrect = "";
			if(errors != null || errors != undefined) {
				for (var i = 0; i < errors.length; i++) {
					wordError = errors[i].match(wordReg)[0];
					wordCorrect = errors[i].match(changeReg)[0];
					text = text.replace(wordError, wordCorrect);
				}
			}
			text = text.replace(/\+/gi, " ");
		}  
	};
	request.send();
	return text;
}
//проверка слов на содержащиеся в них латинские символы (комбинация латинских символов и кириллицы)
function checkForLatin(text) {
	var words = text.split(" ");
	text = "";
	var lat = false, kir = false;
	var alphabet = { e: "е", y: "у", u: "и", o: "о", p: "р", a: "а", k: "к", x: "х", c: "с", b: "в", n: "п", m: "м"};
	for (var i = 0; i < words.length; i++) {
		lat = /[a-z]/gi.test(words[i]);
		kir = /[а-яё\d\W_]/gi.test(words[i]);
		if (lat == true && kir == true) {
			for(let letter of words[i]) {
				if (/kir/gi.test(letter) == false && alphabet[letter]!=undefined){
					letter = alphabet[letter];
				}
			}
		}
		text+=words[i] + " ";		
	}
	return text.trim();
}
//проверка на наличие карт, телефонов и прочих комбинаций цифр
function checkNumbers(textStart){
	var change = {ч:"4", о:"0", б:"6", в:"8", b:"6", o:"0", l:"1", з:"3"};
	text = textStart.replace(/ /gi,"");
	for(let letter of text) {
		if ((letter == "ч" || letter == "о" || letter == "б" || letter == "в" || letter == "b"|| letter == "l"|| letter == "l" || letter == "з") && change[letter]!=undefined)
			letter = change[letter];
	}
	var telReg = /(7|8)?9\d{9}(?=[^\d])/gi, cardReg =/\d{16}(?=[^\d])/gi;
	var cardPresence = false, phonePresence = false, creditCards = null, phoneNumbers = null;
	if(cardReg.test(text) == true) {
		var creditCards = text.match(cardReg); 
		cardPresence = true;
		console.log("Банковские карты");
		console.log(creditCards);
	} 
	if(telReg.test(text) == true) {
		phoneNumbers = text.match(telReg);
		phonePresence = true;
		console.log("Номера телефонов");
		console.log(phoneNumbers);
	} 
	return textStart.replace(/\/d/gi, "");
}
