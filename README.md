# PollBot V1.0.0

Welcome !! This bot is created so that we can do polls in discord (yay)

## How to setup

 - do ```npm install``` and wait for everything to set up
 - create a file named ```token.txt``` next to ```main.js```, and write your token inside
 - Finally, open up a command prompt and type in ```node main.js```
 - Enjoy !!
 
 ## How to use
 
 - To create a poll, send in the chat ```CreatePoll=FIRST CHOICE;SECOND CHOICE;ETC```. You can add as many choices as you have emoji in ```emojilist.json```
 
 - To vote, add the emoji associated with the answer you want. You can re vote, but only if you delete your last vote

 - To Delete a poll (from the json and not the chat), just write ```DeletePoll POLL_ID```. The poll id is written at the top of the poll message
 
 - To add your emoji, simply edit ```emojilist.json``` by adding the ID of the emoji you want (Documentation about emoji [Here](https://discordapp.com/developers/docs/resources/emoji)
 
 ## About
 
 This bot was made on a idea of Edorion and written by LepGamingGo and Edorion. We're a small team of gamers using discord since a long time, and we found this idea really fun to make (and useful). So we made this !!
 
 This bot is under the GPLv3 License.
