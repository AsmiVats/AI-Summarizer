document.addEventListener("DOMContentLoaded",()=>{
    chrome.storage.sync.get(["apikey"],({apikey})=>{
        if(apikey) document.getElementById("api-key").value = apikey;
    });

    document.getElementById("save-button").addEventListener("click",()=>{
        const apiKey = document.getElementById("api-key").value.trim();
        if(!apiKey)return;

        chrome.storage.sync.set({apikey:apiKey},()=>{
            document.getElementById("success-message").style.display = "block";
            setTimeout(()=> window.close(),1000);
        });
    });
});