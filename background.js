/**
  * 
  * To install simply go to chrome > settings > extensions > Load unpacked extension 
  * Then navigate to the directory that you saved the MyAdBlockChrome folder to and click ok
  * Then magically you're ready to start blocking ads.
  *
  * Ad Block Plus started white listing some ad agencies. 
  * I imaging because they were paid to. 
  * So I decided I would role my own ad block
  * This is that ad block. It is not very complex but gets the job done.
  * I have not added any features to make the blocked ad's divs pretty.
  * 
  * It works by blocking HTTP requests from known ad hosts. 
  * We load in the host list then block the requests based on who they're calling to.
  * We block the request before it is even sent,
  * so that we don't have to load all that extra mess then filter it out after.
  *
*/

(function(){
  // Set the object that is going to recieve the promise
  var urlList = getList();
  // Use the promise to call functions pending the async request
  urlList.then(function(result) {
    return blockAds(result);
  }).catch(function(reject) {
    console.error(reject);
  });
  // Block the ads!
  function blockAds(patterns){
    chrome.webRequest.onBeforeRequest.addListener(
      function(info) { 
        // log the host that was blocked in the background page
        console.log("Blocked: " + info.url);
        // cancel the request for matched url pattern
        return { cancel: true };
      },
      // get the formated url patterns
      {urls: format(patterns)},
      ["blocking"]
    );
  }
  // Gets list of known ad server host names
  function getList() {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open("GET", "http://pgl.yoyo.org/as/serverlist.php?hostformat=nohtml");
      req.onload = function() {
        if (req.status == 200) {
          resolve(req.response);
        }
        else {
          reject(Error(req.statusText));
        }
      };
      req.onerror = function() {
        reject(Error("Network Error"));
      };
      req.send();
    });
  }
  // Format the list of host names to match the expected pattern
  function format(list){
    var patterns = list.split("\n");
    // We have to remove the last element in the array because it is a newline. If we didn't it would return "*://*./*" as a formated host name which would block all traffic
    patterns.pop();
    for(var i = 0; i < patterns.length;i++){
      patterns[i] = "*://*." + patterns[i] + "/*"
    }
    return patterns;
  }
})();
