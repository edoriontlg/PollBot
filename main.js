/* 
Do not delete depencies !!
 _______  _______  ___      ___      _______  _______  _______ 
|       ||       ||   |    |   |    |  _    ||       ||       |
|    _  ||   _   ||   |    |   |    | |_|   ||   _   ||_     _|
|   |_| ||  | |  ||   |    |   |    |       ||  | |  |  |   |  
|    ___||  |_|  ||   |___ |   |___ |  _   | |  |_|  |  |   |  
|   |    |       ||       ||       || |_|   ||       |  |   |  
|___|    |_______||_______||_______||_______||_______|  |___|  

PollBot V0.0.1, Edorion
*/

const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client()

//Read the token from the token.txt file
var token = fs.readFileSync('token.txt', 'utf8');

bot.login(token)

bot.on("ready", function () {
    console.log("PollBot Connected !")
    bot.user.setPresence("online")
})

bot.on("message", message => {

    if (message.content.startsWith("CreatePoll")) {

        //Create the name of the poll based on the date, so we avoid writing the same poll in multiple files
        var pollName = Date.now()

        console.log(BgMagenta + FgBlack + " - Poll Detected - " + FgWhite + BgBlack);

        //This modify the message so that we only keep the answers
        activePoll = message.content.split("=");
        activePoll.splice(0, 1);
        pollChoices = activePoll[0].split(";");

        //Write the poll name so we can find it later, plus the values
        console.log(FgCyan + "Poll initiated. Name : " + FgGreen + pollName + "\n"
            + FgCyan + "Answers : " + FgGreen + pollChoices + FgWhite);


        //Create all the data    
        console.log(FgYellow + "Creating poll" + FgWhite)
        try {
            pollChoices.forEach(element => {

                //This is where you put your json data. for me, this is the answers and their percentage
                var tempData = {
                    answer: element,
                    percentage: 0
                };

                //If tempData didn't worked, this message wont show up
                console.log(FgYellow + "Successfully created the tempData " + FgWhite + JSON.stringify(tempData));
            });

        } catch (error) {
            console.log(FgRed + "Failed to create the json for the poll" + FgWhite + "\n"
                + error);
        }

    }

    if (message.content.startsWith("PollHelp")) {
        message.channel.send("To create a poll, send `CreatePoll=Answer 1;Answer 2;Answer 3`."
            + "\nYou can set any number of choices between 2 and ∞.")
    }
})



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