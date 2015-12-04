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
