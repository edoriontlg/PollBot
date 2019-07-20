/* 
Do not delete depencies !!
 _______  _______  ___      ___      _______  _______  _______ 
|       ||       ||   |    |   |    |  _    ||       ||       |
|    _  ||   _   ||   |    |   |    | |_|   ||   _   ||_     _|
|   |_| ||  | |  ||   |    |   |    |       ||  | |  |  |   |  
|    ___||  |_|  ||   |___ |   |___ |  _   | |  |_|  |  |   |  
|   |    |       ||       ||       || |_|   ||       |  |   |  
|___|    |_______||_______||_______||_______||_______|  |___|  

PollBot V0.0.1, Edorion and Leo
*/

const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
const ProgressBar = require('progress');

var persistentData; //DATA

//Read the token from the token.txt file
var token = fs.readFileSync('token.txt', 'utf8');

//Init of the pollData array
var pollData = [];

//Init persitentData
var persistentData = {};

//Some random var
totalVote = 0;

bot.login(token); //Login the bot with the token read in token.txt

bot.on("ready", function () { //When the bot is ready, do this

    console.log("PollBot Connected !"); //We know when the bot is connected


    bot.user.setPresence("online"); //Visual informations on discord
    bot.user.setActivity("PollHelp for help"); //Visual informations on discord

    //The data stored
    dataPath = "data/data.json";
    var contents = fs.readFileSync(dataPath);
    persistentData = JSON.parse(contents);
})


//When a message is received, do this
bot.on("message", message => {

    if (message.content.startsWith("CreatePoll")) {

        //Clear the last poll. I'm working on something so that the bot can manage multiple poll. For the moment, he manage only one
        pollData = [];
        console.log(FgRed + "Cleared last pollData" + FgWhite);


        //Create the name of the poll based on the date, so we avoid writing the same poll in multiple files
        var pollName = Date.now();



        console.log(BgMagenta + FgBlack + " - Poll Detected - " + FgWhite + BgBlack);

        //This modify the message so that we only keep the answers
        activePoll = message.content.split("=");
        activePoll.splice(0, 1);
        pollChoices = activePoll[0].split(";");



        //Write the poll name so we can find it later, plus the values
        console.log(FgCyan + "Poll initiated. Name : " + FgGreen + pollName + "\n" +
            FgCyan + "Answers : " + FgGreen + pollChoices + FgWhite);


        try {

            //Create all the data in pollData 
            console.log(FgCyan + "Creating pollData" + FgWhite)

            //Set up of the data ([INFO] part)
            persistentData["DATA"][pollName] = {
                "Info": {
                    "Name": pollName,
                    "User": message.author.username,
                    "UserID": message.author.id
                }
            }
            console.log(FgMagenta + "Poll info created in DATA" + FgWhite)

            pollChoices.forEach(element => {

                //This is where you put your answer data. for me, this is the answers and their number of votes
                var tempData = {
                    answer: element,
                    votes: 0
                };

                pollData.push(tempData);

                //Create the element in the DATA
                if (persistentData["DATA"][pollName].hasOwnProperty("Choices")) { //Test if the choices has been set up
                    persistentData["DATA"][pollName]["Choices"][element] = 0; //If yes save the answer
                } else {
                    persistentData["DATA"][pollName]["Choices"] = {
                        'initial': 0
                    } //If no set up the choices
                    persistentData["DATA"][pollName]["Choices"][element] = 0; //And save the answer
                    delete persistentData["DATA"][pollName]["Choices"]['initial'];
                }
            });

            //If the pollData is created with no errors, send this message and continue doing is job
            console.log(FgMagenta + "Poll data succesfully created\n" + FgWhite);

            console.log(FgMagenta + "Sending message" + FgWhite);

            //This send the message created by createPollLook()
            message.channel.send("Poll number " + pollName + "\n" +
                createPollLook()
            );

            //End of the poll creation process. 
            console.log(FgMagenta + "Message sent !! Poll is active" + FgWhite);

            //Reload the data so it includes the newly made poll
            reloadData();

        } catch (error) {
            console.log(FgRed + "Failed to create the poll" + FgWhite + "\n" +
                error);
        }
    }


    //Help command
    if (message.content.startsWith("PollHelp")) {
        message.delete;
        message.channel.send("To create a poll, send ```CreatePoll=Answer 1;Answer 2;Answer 3```" +
            "\nYou can set any number of choices between 2 and 10." +
            "\n\nYou can delete a poll by sending ```DeletePoll POLL_NUMBER```")
    }

    //This is used to delete old polls
    if (message.content.startsWith("DeletePoll ")) {

        splitMessage = message.content.split(" ");
        if (persistentData["DATA"].hasOwnProperty(splitMessage[1])) {
            delete persistentData["DATA"][splitMessage[1]];
            console.log(FgYellow + "Succesfuly deleted the data" + FgWhite);
            reloadData();
        }
    }


    //This get the ID of the message so that we can delete it later
    if (message.content.startsWith("Poll number ")) {
        splitMessage = message.content.split(" ");
        ID = splitMessage[2].split("\n");
        console.log(ID[0]);
        if (persistentData["DATA"].hasOwnProperty(ID[0])) {
            persistentData["DATA"][ID[0]]["Info"]["MessageID"] = message.id;
            reloadData();
        } else {
            console.log('OK£IHOUU');
        }
    }
})

//When a reaction is added, do this
bot.on('messageReactionAdd', (messageReaction, user) => {
    if (messageReaction.message.content.startsWith("Poll number ")) {
        messageReaction.message.channel.send("yeyeyey");
    }
})




//This function will create the poll look
function createPollLook() {
    returnedStringToPoll = "";

    //reset totalVote
    totalVote = 0;

    /*    Test function : create random votes
    pollData.forEach(element => {
        element.votes += Math.round(Math.random() * (300 - 0) + 0);   
    });
    */

    pollData.forEach(element => {
        totalVote += element.votes;
    });

    console.log(pollData); //Write the pollData and the totalVotes for easy understanding
    console.log(totalVote);

    for (let index = 0; index < pollData.length; index++) { //For each value in pollData, it will
        const element = pollData[index]; //Create 2 lines

        returnedStringToPoll += "\n";
        returnedStringToPoll += index + "° : **" + element.answer + "** (" + element.votes + " votes)\n";

        if (totalVote != 0) { //Create the progress bar
            returnedStringToPoll += "⬜".repeat((element.votes / totalVote) * 10)
        }
    }
    return returnedStringToPoll
}

//This function will return a bar based on the number of votes and the total votes


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

//This function reload the Data
function reloadData() {

    console.log(FgYellow + "Reloding the Data..." + FgWhite)

    var json = JSON.stringify(persistentData); //Prepare the DATA for saving

    fs.writeFile(dataPath, json, 'utf8', function readFileCallback(err, data) { //Save the DATA
        if (err) {
            console.log(FgRed + "erreur inatendue..." + FgWhite)
            console.log(err);
        } else {
            console.log("DATA saved!")
        }
    })

    try {

        var contents = fs.readFileSync(dataPath); //Read the new DATA
        persistentData = JSON.parse(JSON.stringify(contents)); //Reload in "persistantData" the new DATA
        console.log("Success!!!")

    } catch (error) {

        console.log(FgRed + "Error !!" + FgWhite)
    }
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