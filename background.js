chrome.runtime.onInstalled.addListener(()=>{
    chrome.storage.sync.get(["apikey"],(result)=>{
        if(!result.apikey){
            chrome.tab.create({url:"options.html"});
        }
    })
})