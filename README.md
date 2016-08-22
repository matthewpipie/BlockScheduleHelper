# BlockScheduleHelper
Version 2.1.0 by Matthew Giordano (matthewpipie)  

HOW TO CLONE:  
`git clone --recursive https://github.com/matthewpipie/BlockScheduleHelper.git`

If you want to de-minify the HTML/CSS/JS (recommended)

`cd BlockScheduleHelper`  
`cd www`  
`git checkout master`  
Then feel free to edit the files in the www directory, as that is where the majority of my code is located.  Good luck reading this mess!

HOW TO TEST CHANGES:  
First, install `cordova-icon` and `cordova-splash` via `npm install cordova-icon -g` and `npm install cordova-splash -g`  
Then, simply go to config.xml, change the name, id, and author to something else, and `cordova run android` / `cordova build ios`

NOTE: Almost all of the actual code I wrote for this is in a submodule ([BlockScheduleHelperWWW](https://github.com/matthewpipie/BlockScheduleHelperWWW/)).  Go there if you want to submit a pull request or issue, NOT HERE!

# License
Copyright (c) 2016 Matthew Giordano  
The part of the program that I wrote is licensed with the APGLv3 License.  For more, read the LICENSES file in the www folder.
