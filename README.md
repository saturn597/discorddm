DiscordDM
======================
A client for sending and receiving DMs in Discord. (Very incomplete).


Installation
======================
If you have node and npm, install using these steps. 1) Clone this repository. 2) From the command line, navigate to the new directory that contains index.js. 3) Finally, type `npm install`.


Use
======================
To sign in, you'll need your Discord secret token.

Put that token by itself in a file called "token" and put it in the same directory as index.js.

Once that's done, you can run DiscordPM with `node index.js`.

Tab switches focus between the different panes. While the friend list pane is selected, use the arrow keys to switch friends. When the message display is selected, use the arrow keys to scroll through messages. When the message entry pane is selected, type your message then hit enter to send.

Ctrl-c, escape or (outside of the message entry pane) "q" will quit.

