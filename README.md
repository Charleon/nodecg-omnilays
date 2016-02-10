![OMNILays Logo](http://i.imgur.com/qqTP9P6.png?1)

**Current Version:** 1.0 Beta UNIEL Graphics

OMNILays is a collection of functional overlays aimed for the fighting-game scene. The first version contained content
to get started streaming and is themed heavily towards Guilty Gear -Xrd Sign-, however, in this branch I've added a UNIEL look and feel 
to the MatchScreen (player nameplates only).

**NOTE THAT THIS VERSION IS ONLY COMPATIBLE WITH NODECG v0.7 >**

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
   * npm install
   * bower install
   * nodecg install charleon/nodecg-omnilays
   * cd bundles/nodecg-omnilays
   * git checkout unielgraphics 
   The last line will switch from the xrd nameplates to the uniel nameplates
6. In the prompt, under the nodecg root type ‘nodecg start’ and keep the prompt open for as long as you use the overlay
7. The above step set up a local server on your computer so you can now test it out! either in your browser (Chrome is the only one that gives the CORRECT result), or in xSplit or OBS
For OBS you need the [CLR Browser Plugin](https://obsproject.com/forum/resources/clr-browser-source-plugin.22/), but the latest xSplit version already has support to add web url:s using the "Add page URL.." option

### Usage
Open **http://localhost:9090/dashboard/#** to see the dashboard. From here you control the rest of the overlay. You should do this from your browser.
##### http://localhost:9090/graphics/nodecg-omnilays/MatchScreen.html 
![MatchScreen](https://images-2.discordapp.net/eyJ1cmwiOiJodHRwOi8vaS5pbWd1ci5jb20vRVNZV3V6Qi5wbmcifQ.EgHdR9iUDzuzqeJi2C0szRm-qAc.png)
This screen contains the Player Panels, controlled through Player Control Panel and Stream Control Panel in the dashboard. Test in browser or directly in OBS/xSplit
* Support for Adding, Removing and Renaming players.
* Support to tie a specific player to a country flag.
* Optional special animation for winner in FT3, FT5 or FT10 Matches

All other screens use XRD graphics for now

### License
OMNILays is provided under the MIT license

### Contributors
* [Tobias "Charleon" Nerg](http://twitch.tv/sethcharleon)

### Contact
For any inquiries, feedback, or ideas, please contact me on my twitter:
* Twitter: @CharleonChan
