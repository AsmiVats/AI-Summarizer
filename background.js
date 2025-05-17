chrome.runtime.onInstalled.addListener(()=>{
    chrome.storage.sync.get(["apikey"],(result)=>{
        if(!result.apikey){
            chrome.tabs.create({url:"options.html"});
        }
    })
});