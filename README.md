# BishBlock
My crack at rolling my own ad block... it is not pretty by any means.

To install copy the files background.js and manifest.json and put them into a zip file then change the zip file ext to .xpi. Make sure the .xpi file is in the root directory located with the other two files. Then go to chrome > settings > extensions > Load unpacked extension. Then navigate to the directory that you saved the MyAdBlockChrome folder to and click ok then magically you're ready to start blocking ads.

Ad Block Plus started white listing some ad agencies. I imaging because they were paid to. So I decided I would role my own ad block this is that ad block. It is not very complex but gets the job done. I have not added any features to make the blocked ad's divs pretty.

It works by blocking HTTP requests from known ad hosts. We load in the host list then block the requests based on who they're calling to. We block the request before it is even sent, so that we don't have to load all that extra mess then filter it out after.
