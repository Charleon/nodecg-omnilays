[![OMNILays Logo](http://i.imgur.com/nh4z4QM.png)](http://www.twitch.com/sethcharleon)

**Current Version:** 1.0 Beta

OMNILays is a collection of functional overlays aimed for the fighting-game scene. The first version contains content
to get started streaming and is themed heavily towards Guilty Gear -Xrd Sign-, however, as the name entitles; the goal
is to make a final product that's easily skinnable and modular.
It is primarily aimed at [Twitch](http://twitch.tv) broadcasters using [Open Broadcaster Software](https://obsproject.com/) or 
[xSplit](https://www.xsplit.com/), but is usable in any environment that can render HTML.

### Installation
There are two prerequisites to get OMNILays working.
* Download and install [git](https://git-scm.com/)
2. Download and install [nodejs](https://nodejs.org/en/)

Then:

1. download and install [nodecg](http://nodecg.com/). here comes a short summary: 
Make a new folder, in that folder, rightclick, choose "Open Git Bash.." and in the prompt, type:
   * npm install nodecg-cli -g 
   * mkdir nodecg && cd nodecg 
   * nodecg setup
2. download and extract this bundle into nodecg/bundles, rename the folder to "OMNILays", it should NOT be named "nodecg-omnilays"
3. in the nodecg folder, rightclick and choose “open git bash here”.
5. In the prompt, type ‘nodecg start’ and keep the prompt open for as long as you use the overlay
6. The above step set up a local server on your computer so you can now test it out! either in your browser (Chrome is the only one that gives the CORRECT result), or in xSplit or OBS
For OBS you need the [CLR Browser Plugin](https://obsproject.com/forum/resources/clr-browser-source-plugin.22/), but the latest xSplit version already has support to add web url:s using the "Add page URL.." option

### Usage
Open **http://localhost:9090/dashboard/#** to see the dashboard. From here you control the rest of the overlay. You should do this from your browser.

##### http://localhost:9090/view/OMNILays/MatchScreen.html 
![MatchScreen](http://i.imgur.com/rnpHY7I.png)
This screen contains the Player Panels, controlled through Player Control Panel and Stream Control Panel in the dashboard. Test in browser or directly in OBS/xSplit
* Support for Adding, Removing and Renaming players.
* Support to tie a specific player to a country flag.
* Optional special animation for winner in FT3, FT5 or FT10 Matches

##### http://localhost:9090/view/OMNILays/RoundRobinTable.html
![RoundRobinTable](http://i.imgur.com/YMHcxRE.png)

This screen contains the roundrobin-table and is controlled by the RoundRobinTable panel in the dashboard
* Support to place the table according to your wishes
* Support for Win/Lose syntax, or 1-5 syntax.

##### http://localhost:9090/view/OMNILays/CommentatorScreen.html
![CommentatorScreen](http://i.imgur.com/eJPFoiD.png)
This screen shows commentator names and twitter for up to two commentators and is controlled by the CommentatorScreen Panel in the Dashboard

##### http://localhost:9090/view/OMNILays/PrefightScreen.html
![PrefightScreen](http://i.imgur.com/TodC4Lf.png)
This screen shows information about player names, characters and what type of match it is (usable for e.g Pools, Winners, Winners Round 2, etc etc) and is controlled by the Prefight Screen Dashboard

### License
OMNILays is provided under the MIT license

### Contributors
* [Tobias "Charleon" Nerg](http://twitch.tv/sethcharleon)

### Contact
For any inquiries, feedback, or ideas, please contact me on my twitter:
* Twitter: @CharleonChan
