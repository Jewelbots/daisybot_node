var twitter = require('ntwitter')
	, fs = require('fs')
  , express = require('express');


var twit = new twitter({
	consumer_key: 'oXAbKQyQ47h9CBVXmMGdQ',
      consumer_secret: 'z9EqbFpf4dhNuY6M1Eawk3W2dwnt9B1PoQRAMyWtxTU',
      access_token_key: '15524875-L916RzSGVMqi1DlZz4MiB7RCgsWhuKSsD9T7Pn5i1',
      access_token_secret: 'GLMDBi2NFYl3eZmUZ4zmhphDMozXesMN16DI9NOaIo'

});

// Global to hold the tweet score

var tweetScore = 0;

var words = fs.readFileSync('words_clean.txt').toString()
	, wordMap = {}
	, splitWords = words.split("\n");
	//, board = new j5.Board();

//put all the words into an object
for(var i = 0; i < splitWords.length; i++){
	var line = splitWords[i]
	var compactLineArr = line.replace(/\s+/g, " ").split(' ')
	var score = compactLineArr[0];
	var word = compactLineArr[1];
	// Assuming that none of our words are reserved words like "prototype"
	wordMap[word] = score
}


//board.on("ready", function(){
var onReady = function() {


//setup LEDs
//var blue = new j5.Led(9)
//	, red = new j5.Led(10)
//	, green = new j5.Led(11);




//get sentiment
var sentiment = function(tweet){
console.log("made it to sentiment");
	for(var i = 0; i < tweet.length; i++){
			var word = tweet[i];
			if(wordMap[word.toLowerCase()]) {
				console.log("Word: " + word + " / score: " + wordMap[word.toLowerCase()]);
				tweetScore += parseFloat(wordMap[word.toLowerCase()]);
        
				if(tweetScore > 0){
//			  red.off();
//		           blue.on();
//		 	  green.off();
				}
				else if (tweetScore < -1){
//			   red.on();
//			   green.on();
//			   blue.off();

				}
				else if (tweetScore < 0){
//			  red.off();
//		 	  blue.off();
//			  green.on();
				}

			}

		}

console.log(tweetScore);

}

//ping twitter
	twit.stream('statuses/filter', { 'follow' : '2236980362'},
	  function(stream) {
	  	stream.on('data', function (data) {
     if(data){
      console.log(data);
      var tweet = data.text.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").split(' ');
			sentiment(tweet);
      }
				}
			)
	  })
} //)

onReady()

// REST api

var app = express();
app.get('/happy_score.txt', function(req, res) {  
  console.log("Got request /happy_score.txt: " + tweetScore);
  res.send("" + tweetScore); // needs to be string for some reason?
});

app.listen(process.env.PORT || 8888);
//app.listen(3000);
console.log('Listening on port 3000');
