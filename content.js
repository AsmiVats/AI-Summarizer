function getText(){
    const article = document.querySelector("article");
    if(article) return article.innerHTML; 

    const paragraphs = Array.from(document.querySelectorAll("p"));
    return paragraphs.map((p)=>p.innerText).join("\n");
}

chrome.runtime.onMessage.addListener((req,_sender,sendResponse)=>{
    if((req.type === "GET_ARTICLE_TEXT")){
        const text = getText();
        sendResponse({text});
         return true;
    }
})