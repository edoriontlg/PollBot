/* 
Do not delete depencies !!
 _______  _______  ___      ___      _______  _______  _______ 
|       ||       ||   |    |   |    |  _    ||       ||       |
|    _  ||   _   ||   |    |   |    | |_|   ||   _   ||_     _|
|   |_| ||  | |  ||   |    |   |    |       ||  | |  |  |   |  
|    ___||  |_|  ||   |___ |   |___ |  _   | |  |_|  |  |   |  
|   |    |       ||       ||       || |_|   ||       |  |   |  
|___|    |_______||_______||_______||_______||_______|  |___|  

PollBot V1.1.0, Edorion and LepGamingGo
*/

const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
const ProgressBar = require('progress');

var persistentData; //DATA
var emojiMax = 0;

//Read the token from the token.txt file
var token = fs.readFileSync('token.txt', 'utf8');

//Init persitentData and emojilist
var persistentData = {};
var emojiList = {};

//Some random var
totalVote = 0;

bot.login(token); //Login the bot with the token read in token.txt

bot.on("ready", function () { //When the bot is ready, do this

    console.log("PollBot Connected !"); //We know when the bot is connected


    bot.user.setPresence("online"); //Visual informations on discord
    bot.user.setActivity("PollHelp for help"); //Visual informations on discord

    //Initiate persistentData. This basically get all the polls
    dataPath = "data/data.json";
    var contents = fs.readFileSync(dataPath);
    persistentData = JSON.parse(contents);

    //Get the emojilist
    var contents = fs.readFileSync("data/emojilist.json");
    emojiList = JSON.parse(contents);
    for (var key in emojiList["emoji"]) {
        emojiMax++;
    }

    console.log(FgCyan + "Total emojis : " + FgGreen + emojiMax);

})


//When a message is received, do this
bot.on("message", message => {

    if (message.content.startsWith("CreatePoll")) {
        //Create the name of the poll based on the date, so we avoid writing the same poll in multiple files
        
        var pollID = Date.now();
        var erreur = false;


        console.log(BgRed + FgBlack + " - Poll Detected - " + FgWhite + BgBlack);

        //This modify the message so that we only keep the answers
        activePoll = message.content.split("=");
        //We get the name of the Poll and the answers
        try{
            pollArguments = activePoll[1].split(";");
            pollStart = activePoll[0].split("(");
            pollStart2 = pollStart[1].split(")");
            pollName = pollStart2[0];
            if (pollArguments.length <= 1){ //The Poll need at least 2 answers
                console.log(BgRed + FgBlack + " ERROR NOT ENOUGHT ANSWERS " + FgWhite + BgBlack);
                erreur = true;
            }
            if (pollArguments[pollArguments.length - 1] == ""){ //avoid null arguments
                console.log(BgRed + FgBlack + " ERROR DON'T FINISH BY ; " + FgWhite + BgBlack);
                erreur = true;
            }

            var pollChoices = new Array(pollArguments.length);
            var pollEmoji = new Array(pollArguments.length);
            var usedEmoji = ["none"];

            elementID = -1;

            pollArguments.forEach(element => {

                elementID += 1;
                temp = pollArguments[elementID].split("(");
                pollChoices[elementID] = temp[0];
                try{
                    temp = temp[1].split(")");
                    pollEmoji[elementID] = temp[0];
                    if (emojiList["emoji"].hasOwnProperty(pollEmoji[elementID]) && usedEmoji.includes(pollEmoji[elementID]) == false){
                        usedEmoji.push(pollEmoji[elementID]);
                    }else {
                        pollEmoji[elementID] = "none";
                    }
                   
                }catch(error){
                    pollEmoji[elementID] = "none";
                }
                
                console.log(pollEmoji[elementID]);

            });


        }catch (error) {
            console.log(BgRed + FgBlack + " ERROR WRITE POLLHELP FOR INFORMATIONS " + FgWhite + BgBlack +"\n" +
                error);
            erreur = true;
        }
    

        if (erreur == false){
            //Write the poll name so we can find it later, plus the values
            console.log(FgCyan + "Poll initiated. Name : " + FgGreen + pollName + "\n" +
                FgCyan + "Answers : " + FgGreen + pollChoices + FgWhite);


            //Try-catch, avoiding crashes (so bot wont have to restart in case of an error)
            try {

                //Create the poll and his data
                console.log(FgCyan + "Creating poll data" + FgWhite)

                //Set up of the data ([INFO] part)
                persistentData["DATA"][pollID] = {
                    "Info": {
                        "Name": pollName,
                        "User": message.author.username, //Creator of the poll
                        "UserID": message.author.id      //Id of the creator
                    }
                }
                console.log(FgMagenta + "Poll info created in DATA" + FgWhite)

                var numberElement = 0;
                var emojiError = false
    

                //For each choices
                pollChoices.forEach(element => {

                    numberElement = numberElement + 1; //Count the element

                    if (numberElement > emojiMax) { //ERROR because not enouth emoji
                        emojiError = true;
                        message.channel.send("Too much answers. Try with less answers or add more emojis in ```emojilist.json```")
                    } else {

                        //Create the element in the DATA (basically saving answers)
                        if (persistentData["DATA"][pollID].hasOwnProperty("Choices")) { //Test if the choices has been set up

                            persistentData["DATA"][pollID]["Choices"][element] = 0; //If yes save the answer

                        } else {  //If no set up the choices

                            persistentData["DATA"][pollID]["Choices"] = {  //Initiate Choices
                                'initial': 0
                            } 

                            persistentData["DATA"][pollID]["Choices"][element] = 0; //And save the answer
                            delete persistentData["DATA"][pollID]["Choices"]['initial'];  //delete the inital value used to create Choices
                        }

                        //Choose a emoji for this answer

                        if (pollEmoji[numberElement - 1] != "none"){

                            choosedEmoji = pollEmoji[numberElement - 1];
                        }



                        if (pollEmoji[numberElement - 1] == "none"){ //If the answer have no emoji argument
                            var continueEmoji = true;
                            while (continueEmoji == true) {

                                var emojiNumber = getRandomInt(1, emojiMax) //Get a random emoji
                                var i = 0;
                                for (var key in emojiList["emoji"]) {
                                    i = i + 1;
                                    if (i == emojiNumber) {
                                        var choosedEmoji = key;
                                    }
                                }

                                //Verify if this emoji is not used
                                if (usedEmoji.includes(choosedEmoji)) {
                                    continueEmoji = true; //The emoji is already used
                                } else {
                                    continueEmoji = false;     //None emoji has been choosed so this one is good
                                }
                            }
                        }


                        if (persistentData["DATA"][pollID].hasOwnProperty("emoji")) { //Test if emoji category has been set up
                            persistentData["DATA"][pollID]["emoji"][choosedEmoji] = element;
                        } else {
                            persistentData["DATA"][pollID]["emoji"] = { //If no set it up
                                'initial': 0
                            } //If no set up the choices
                            persistentData["DATA"][pollID]["emoji"][choosedEmoji] = element; //And save the emoji for this answer
                            delete persistentData["DATA"][pollID]["emoji"]['initial'];
                        }
                        usedEmoji.push(choosedEmoji); //Add the choosed emoji to the list to not use it again
                    }

                });

                if (emojiError == false) { //No error so send the messsage
                    //If the data is created with no errors, send this message and continue is job
                    console.log(FgMagenta + "Poll data succesfully created\n" + FgWhite);

                    console.log(FgCyan + "Sending message" + FgWhite);

                    //This send the message created by createPollLook()
                    message.channel.send(createPollLook(pollID));

                    //End of the poll creation process. 
                    console.log(FgMagenta + "Message sent !! Poll is active" + FgWhite);

                    //Reload the data so it includes the newly made poll
                    reloadData();
                } else {
                    console.log(FgRed + "Failed to create the poll" + FgWhite + "\n" +
                        FgBlue + "Not enought emoji in the list" + FgWhite);
                }

            } catch (error) {
                console.log(FgRed + "Failed to create the poll" + FgWhite + "\n" +
                    error);
            }
        }
    }


    //Help command
    if (message.content.startsWith("PollHelp")) {
        message.delete;
        message.channel.send("To create a poll, send ```CreatePoll(Name)=Answer 1(emoji1);Answer 2(emoji2);Answer 3(emoji3)```" +
            "\nYou can set any number of choices between 2 and the number of emote you have in emojilist.json." +
            "\n\nYou can delete a poll by sending ```DeletePoll POLL_NUMBER```"
            + "\n\nTo vote, add the emoji associated with your answer."
            + "\n\nYou can modify your vote by removing your last vote.")
    }

    //This is used to delete old polls
    if (message.content.startsWith("DeletePoll ")) {

        splitMessage = message.content.split(" "); //Get the ID of the poll
        if (persistentData["DATA"].hasOwnProperty(splitMessage[1])) { //If the poll does exist, delete it
            delete persistentData["DATA"][splitMessage[1]];
            console.log(FgMagenta + "Succesfuly deleted the data" + FgWhite);
            reloadData();
            message.channel.send("Poll deleted");
        } else {
            message.channel.send("This poll does not exist");
        }
    }

    //Get the ID of the poll message
    if (message.content.startsWith("Poll number ")) {

        splitMessage = message.content.split(" "); //Get the ID of the poll
        ID = splitMessage[2].split("\n")
        if (persistentData["DATA"].hasOwnProperty(ID[0])) { //If the poll does exist, note his id
            persistentData["DATA"][ID[0]]["Info"]["MessageID"] = message.id;
            reloadData();
        }
    }

    //Reload Channel
    if (message.content.startsWith("Reload poll ")) {

        splitMessage = message.content.split(" "); //Get the ID of the poll
        ID = splitMessage[2];
        console.log(ID);
        if(persistentData["DATA"].hasOwnProperty(ID)){
            message.channel.send(createPollLook(ID));
        }

    }

    //See more information of the poll
    if (message.content.startsWith("Info poll ")) {

        splitMessage = message.content.split(" "); //Get the ID of the poll
        ID = splitMessage[2];
        if(persistentData["DATA"].hasOwnProperty(ID)){
            message.channel.send(createPollInfo(ID));
        }

    }

    //Add a emoji
    if (message.content == "Add emoji poll"){

        message.channel.send("REACT TO THIS MESSAGE WITH THE EMOJI YOU WANT TO ADD");


    }



})

//When a reaction is added, do this
bot.on('messageReactionAdd', (messageReaction, user) => {

    //If the reacted message is a poll
    if (messageReaction.message.content.startsWith("Poll number ")) {
        splitMessage = messageReaction.message.content.split(" "); 
        split2 = splitMessage[2].split("\n")
        pollID = split2[0]        //Get the ID of the poll

        //If the poll does exist in data.json
        if (persistentData["DATA"].hasOwnProperty(pollID)) {

            //For better readabilty
            reactEmoji = messageReaction.emoji;
            console.log(reactEmoji.name);
            console.log(reactEmoji.identifier)


            //If the emoji category of the poll contain this emoji, do this
            if (persistentData["DATA"][pollID]["emoji"].hasOwnProperty(reactEmoji.name)) {

                //Reset userIsOk
                var userIsOk = false;
                var reactAnswer = persistentData["DATA"][pollID]["emoji"][reactEmoji.name]

                //Test if Users has been set up
                if (persistentData["DATA"][pollID].hasOwnProperty("Users")) {

                    if (persistentData["DATA"][pollID]["Users"].hasOwnProperty(user)) {
                        userIsOk = false; //The user already voted
                    } else {
                        userIsOk = true; //The user is clean
                    }

                } else {

                    persistentData["DATA"][pollID]["Users"] = { //If no set it up
                        'initial': 0
                    } //If no set up the choices
                    delete persistentData["DATA"][pollID]["Users"]['initial'];
                    userIsOk = true //The user didn't voted because the User was not set up
                }

                if(persistentData["DATA"][pollID].hasOwnProperty("UsersName") == false){
                    persistentData["DATA"][pollID]["UsersName"] = { //If no set it up
                        'initial': 0
                    } //If no set up the choices
                    delete persistentData["DATA"][pollID]["UsersName"]['initial'];
                }

                if (userIsOk == true) { //The user didn't voted in this poll


                    persistentData["DATA"][pollID]["Choices"][reactAnswer]++; //Add a vote
                    persistentData["DATA"][pollID]["Users"][user] = reactAnswer; //Assign this vote to this user
                    persistentData["DATA"][pollID]["UsersName"][user.username] = reactAnswer;              

                    reloadData();

                    //Rewrite the message
                    messageReaction.message.edit(createPollLook(pollID));

                } else { //The user already voted

                    console.log(FgRed + "Failed to save the vote" + FgWhite + "\n" +
                        FgBlue + "This user already voted" + FgWhite);
                    if(persistentData["DATA"][pollID]["Users"][user] != reactAnswer){
                        messageReaction.remove(user); //Remove the vote
                    }

                }
            } else { //This emoji can't be used
                messageReaction.remove(user); //Remove the vote
            }
        }
    }

    if (messageReaction.message.content == "REACT TO THIS MESSAGE WITH THE EMOJI YOU WANT TO ADD"){

        var reactEmoji = messageReaction.emoji;

        emojiName = reactEmoji.name;
        if (emojiList["emoji"].hasOwnProperty(emojiName) == false){
            if (reactEmoji.identifier.startsWith("%")){
                emojiList["emoji"][emojiName] = emojiName;
            } else {
                emojiList["emoji"][emojiName] = "<:" + reactEmoji.identifier + ">";
            }
            reloadDataEmoji();
            emojiMax++;
            messageReaction.message.delete();
        } else {
            messageReaction.message.edit("ERROR");
            messageReaction.message.delete(5000);
        }
        

    }





})

//When a reaction is removed do this...
bot.on('messageReactionRemove', (messageReaction, user) => {

    //Verify if the reaction is on a poll
    if (messageReaction.message.content.startsWith("Poll number ")) { 

        splitMessage = messageReaction.message.content.split(" ");
        split2 = splitMessage[2].split("\n")
        pollID = split2[0] //Get the ID of the poll

        //Assign the emoji for better readability
        reactEmoji = messageReaction.emoji;

        //Check if user category does exist
        if (persistentData["DATA"][pollID].hasOwnProperty("Users")) {

            //Check if the user voted
            if (persistentData["DATA"][pollID]["Users"].hasOwnProperty(user)) {
            
                //If the emoji does correspond to a vote
                if (persistentData["DATA"][pollID]["emoji"].hasOwnProperty(reactEmoji.name)) {

                
                    if (persistentData["DATA"][pollID]["Users"][user] == persistentData["DATA"][pollID]["emoji"][reactEmoji.name]) {

                        //For better readability
                        var removeAnswer = persistentData["DATA"][pollID]["Users"][user];

                        //Delete the vote
                        persistentData["DATA"][pollID]["Choices"][removeAnswer] = persistentData["DATA"][pollID]["Choices"][removeAnswer] - 1;
                        
                        //Delete the user
                        delete persistentData["DATA"][pollID]["Users"][user];
                        delete persistentData["DATA"][pollID]["UsersName"][user.username];


                        reloadData();
                        messageReaction.message.edit(createPollLook(pollID))
                    }
                }
            }
        }
    }
})




//This function will create the poll look
function createPollLook(ID) {
    returnedStringToPoll = "Poll number " + ID + "\n";
    PollName = persistentData["DATA"][ID]["Info"]["Name"];
    PollAuthor = persistentData["DATA"][ID]["Info"]["UserID"];
    returnedStringToPoll += "Question by <@" + PollAuthor + "> : " + PollName + "\n";

    //reset totalVote
    totalVote = 0;



    var size = 0;

    //Get the number of choices
    if (persistentData["DATA"].hasOwnProperty(ID)) {
        for (var key in persistentData["DATA"][ID]["Choices"]) {
            totalVote += persistentData["DATA"][ID]["Choices"][key];
            size++;
        }
    }

    //Write totalVotes for easy understanding
    console.log("Votes : " + totalVote);

    for (let index = 0; index < size; index++) {
        var i = 0;
        for (var key in persistentData["DATA"][ID]["Choices"]) {
            if (i == index) {
                var answer = key;
            }
            i = i + 1;
        } 

        emojisend = "";
        for (var key in persistentData["DATA"][ID]["emoji"]) {
            if (persistentData["DATA"][ID]["emoji"][key] == answer) {
                var emojiName = key;
            }
        }
        emojisend = emojiList["emoji"][emojiName];

        returnedStringToPoll += "\n";
        returnedStringToPoll += emojisend + " : **" + answer + "** (" + persistentData["DATA"][ID]["Choices"][answer] + " votes)\n";


        if (totalVote != 0) { //Create the progress bar
            returnedStringToPoll += "⬜".repeat(Math.round((persistentData["DATA"][ID]["Choices"][answer] / totalVote) * 10));
            returnedStringToPoll += "⬛".repeat(10 - Math.round((persistentData["DATA"][ID]["Choices"][answer] / totalVote) * 10));
        } else {
            returnedStringToPoll += "⬛".repeat(10);
        }
    }
    return returnedStringToPoll
}

//This function reload the Data
function reloadData() {

    console.log(FgCyan + "Reloding the Data..." + FgWhite)

    var json = JSON.stringify(persistentData); //Prepare the DATA for saving

    fs.writeFile(dataPath, json, 'utf8', function callback(err) {
        if (err) {
            console.log(FgRed + err + FgWhite);
        } else {
            console.log(FgMagenta + "Data written successfuly" + FgWhite);
        }
    });


    console.log(FgMagenta + "Success!!!" + FgWhite)
}

//Get a random number
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//This return number emoji from numbers
function numberToEmoji(number = 0) {
    if (number == 0) {
        return ('0️⃣')
    } else if (number == 1) {
        return ('1️⃣')
    } else if (number == 2) {
        return ('2️⃣')
    } else if (number == 3) {
        return ('3️⃣')
    } else if (number == 4) {
        return ('4️⃣')
    } else if (number == 5) {
        return ('5️⃣')
    } else if (number == 6) {
        return ('6️⃣')
    } else if (number == 7) {
        return ('7️⃣')
    } else if (number == 8) {
        return ('8️⃣')
    } else if (number == 9) {
        return ('9️⃣')
    } else {
        return ('🔟')
    }
}


//This return a number from emoji number
function emojiToNumber(number = "0️⃣") {
    if (number == '0️⃣') {
        return (0)
    } else if (number == '1️⃣') {
        return (1)
    } else if (number == '2️⃣') {
        return (2)
    } else if (number == '3️⃣') {
        return (3)
    } else if (number == '4️⃣') {
        return (4)
    } else if (number == '5️⃣') {
        return (5)
    } else if (number == '6️⃣') {
        return (6)
    } else if (number == '7️⃣') {
        return (7)
    } else if (number == '8️⃣') {
        return (8)
    } else if (number == '9️⃣') {
        return (9)
    } else {
        return (10)
    }
}

//This function will create the poll look
function createPollInfo(ID) {
    returnedStringToPoll = "POLL INFO: \n ```"
    returnedStringToPoll += "Poll number " + ID + "\n";
    PollName = persistentData["DATA"][ID]["Info"]["Name"];
    PollAuthor = persistentData["DATA"][ID]["Info"]["User"];
    returnedStringToPoll += "Question by " + PollAuthor + " : " + PollName + "\n";

    //reset totalVote
    totalVote = 0;



    var size = 0;

    //Get the number of choices
    if (persistentData["DATA"].hasOwnProperty(ID)) {
        for (var key in persistentData["DATA"][ID]["Choices"]) {
            totalVote += persistentData["DATA"][ID]["Choices"][key];
            size++;
        }
    }

    for (let index = 0; index < size; index++) {
        var i = 0;
        for (var key in persistentData["DATA"][ID]["Choices"]) {
            if (i == index) {
                var answer = key;
            }
            i = i + 1;
        } 

        emojisend = "";
        for (var key in persistentData["DATA"][ID]["emoji"]) {
            if (persistentData["DATA"][ID]["emoji"][key] == answer) {
                var emojiName = key;
            }
        }
        emojisend = emojiList["emoji"][emojiName];

        returnedStringToPoll += "\n";
        returnedStringToPoll += emojiName + " : " + answer + " (" + persistentData["DATA"][ID]["Choices"][answer] + " votes) :\n";

        for (var key in persistentData["DATA"][ID]["UsersName"]) {
            if (persistentData["DATA"][ID]["UsersName"][key] == answer) {
                returnedStringToPoll += key + " \n";
            }
        }

    }

    returnedStringToPoll += "```"
    return returnedStringToPoll
}

function reloadDataEmoji() {

    console.log(FgCyan + "Reloding the Data..." + FgWhite)

    var json = JSON.stringify(emojiList); //Prepare the DATA for saving

    fs.writeFile("data/emojilist.json", json, 'utf8', function callback(err) {
        if (err) {
            console.log(FgRed + err + FgWhite);
        } else {
            console.log(FgMagenta + "Data written successfuly" + FgWhite);
        }
    });


    console.log(FgMagenta + "Success!!!" + FgWhite)
}


//This is the color value used to make the console looks cool.
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"