
document.getElementById("summarize").addEventListener("click",()=>{
    const result = document.getElementById("result");

    const summaryType = document.getElementById("summary-type").ariaValueMax;

    result.innerHTML = '<div class="loader"></div>';

    chrome.storage.sync.get(["apikey"],({apikey})=>{
        if(!apikey){
            result.textContent = "No API key set. Click the gear icon to add one.";
            return;
        }

        chrome.tabs.query({active:true,currentWindow:true},([tab])=>{
        chrome.tabs.sendMessage(
            tab.id,
            {type: "GET_ARTICLE_TEXT"},
           async ({text})=>{
               if(!text){
                result.textContent = "Couldn't extract text from this page.";
                return;
               }

               try{
                const summary = await getGeminiSummary(text,summaryType,apikey);
                result.textContent = summary;
               }catch(error){
                result.textContent = "Error";
               }
            }
        );
    });

    });

    
});

async function getGeminiSummary(rawText,type,apiKey) {
    const max = 20000;
    const text = rawText.length >max ? rawText.slice(0,max)+"...":rawText;

    const promptMap = {
        brief:`Summarize in 2-3 sentences:\n\n${text}`,
        detailed:`Gice a detailed summary:\n\n${text}`,
        bullets:`Summarizr in 5-7  bullet points 
        (start each line with "->"):\n\n${text}`
    };

    const prompt = promptMap[type] || promptMap.brief;

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                contents:[{parts:[{text:prompt}]}],
            }),
        }
    );

    if(!res.ok){
        const {error} = await res.json();
        throw new Error(error?.message || "Request failed");
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text??"No summary.";
}