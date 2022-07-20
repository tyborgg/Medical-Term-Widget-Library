const body = document.body;                                                                     //body tag
const head = document.head;                                                                     //head tag
var div = document.getElementById("alterText");
var input = document.getElementById("userQuestion");

input.addEventListener("keypress", function(Event) {
    if(Event.key === "Enter"){
        Event.preventDefault();
        document.getElementById("userSubmit").click();
    }
});

document.getElementById("userSubmit").onclick = function(){                                     //Executes when submit button is clicked
    var userInput = document.getElementById("userQuestion").value;                              //Holds user input (text)
    div.textContent = "";

    var terms = ["hello", "tyler pastor", "world"];                                             //Arbitrary keywords to be highlighted
    var indexNum = [];
    var term = "";
    var prev = 0;
    var termLength = 0;

    while(terms.length != 0){
        var index = Number.MAX_VALUE;

        for(let i = 0; i < terms.length; i++){                                                  //Finds the first keyword within the user input
            var tempIndex = userInput.search(terms[i]);
            if(index > tempIndex && tempIndex != -1){
                index = tempIndex;
                term = terms[i];
                termLength = terms[i].length;
                console.log ("Term length: ", terms[i].length);
            }
        }

        console.log("Index: ", index);

        var keyword = document.createElement("div");                                            //Creates a div element that will hold the keyword text (highlighted)
        keyword.id = "term" + index.toString();
        keyword.textContent = userInput.substring(index, index + termLength);
        keyword.style.backgroundColor = "yellow";
        keyword.style.display = "inline-block";
        keyword.style.position = "relative";

        var keywordInfo = document.createElement("div");                                        //Creates a div element to hold keyword information (i.e. definition) 
        keywordInfo.id = "termInfo" + index.toString();
        keywordInfo.textContent = "This Holds Information";
        keywordInfo.style.color = "white";
        keywordInfo.style.backgroundColor = "blue";
        keywordInfo.style.position = "absolute";
        keywordInfo.style.bottom = "30px";
        keywordInfo.style.display = "none";
        keyword.append(keywordInfo);

        indexNum.push(index.toString());

        console.log("Term: ", term);

        if(index == 0){
            div.append(keyword);
        }
        else{
            div.append(userInput.substring(prev, index), keyword);
        }

        terms.splice(terms.indexOf(term), 1);                                                   //Removes keyword from the list (don't highlight the same word twice)
        prev = index + termLength;
        console.log("Prev: ", prev);
    }

    for(let i = 0; i < indexNum.length; i++){                                                   //Adds the hover style to the keyword (info appears while hovering) 
        document.getElementById("term" + indexNum[i]).onmouseover = function () {
            document.getElementById("termInfo" + indexNum[i]).style.display = "block";
        }
        document.getElementById("term" + indexNum[i]).onmouseout = function () {
            document.getElementById("termInfo" + indexNum[i]).style.display = "none";
        }
    }

    if(index + termLength != userInput.length){                                                 //Adds the rest of the unhighlighted text to the parent div
        div.append(userInput.substring(prev, userInput.length));
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function widget(elements){
    var elementText = document.querySelectorAll(elements);                                  //Retrieves a list of all p-tags and div-tags in the document
    var count = 0;
    var indexNum = [];

    console.log(elementText);

    for(let i = 0; i < elementText.length; i++){
        if(elementText[i].childElementCount == 0){                                              //Checks to see if the <p> element has no children
            var text = elementText[i].innerHTML;
            elementText[i].innerHTML = "";
            var terms = ["heart", "blood"];                                                     //Holds a list of all keywords found in the current element tag
            var term = "";
            var prev = 0;
            var termLength = 0;
                        
            while(terms.length != 0){
                var index = Number.MAX_VALUE;
        
                for(let i = 0; i < terms.length; i++){                                          //Finds the first keyword within the user input
                    var tempIndex = text.search(terms[i]);
                    if(index > tempIndex && tempIndex != -1){
                        index = tempIndex;
                        term = terms[i];
                        termLength = terms[i].length;
                        console.log ("Term length: ", terms[i].length);
                    }
                }
        
                console.log("Index: ", index);
        
                var keyword = document.createElement("div");                                    //Creates a div element that will hold the keyword text (highlighted)
                keyword.id = "term" + count.toString();
                keyword.textContent = text.substring(index, index + termLength);
                keyword.style.backgroundColor = "yellow";
                keyword.style.display = "inline-block";
                keyword.style.position = "relative";
        
                var keywordInfo = document.createElement("div");                                //Creates a div element that will hold the 
                keywordInfo.id = "termInfo" + count.toString();                                 //keyword information (such as a definition)
                keywordInfo.textContent = "This Holds Information";
                keywordInfo.style.color = "white";
                keywordInfo.style.backgroundColor = "blue";
                keywordInfo.style.position = "absolute";
                keywordInfo.style.bottom = "30px";
                keywordInfo.style.display = "none";
                keyword.append(keywordInfo);
        
                indexNum.push(count.toString());
                count = count + 1;                                                              //Increment counter
        
                console.log("Term: ", term);
        
                if(index == 0){
                    elementText[i].append(keyword);
                }
                else{
                    elementText[i].append(text.substring(prev, index), keyword);
                }
        
                terms.splice(terms.indexOf(term), 1);                                           //Removes keyword from the list (don't highlight the same word twice)
                prev = index + termLength;
                console.log("Prev: ", prev);
            }
        
            if(index + termLength != text.length){                                              //Adds the rest of the unhighlighted text to the current element tag
                elementText[i].append(text.substring(prev, text.length));
            }
        }
    }

    for(let i = 0; i < indexNum.length; i++){                                                   //Adds the hover style to the keyword (info appears while hovering)
        document.getElementById("term" + indexNum[i]).onmouseover = function () {
            document.getElementById("termInfo" + indexNum[i]).style.display = "block";
        }
        document.getElementById("term" + indexNum[i]).onmouseout = function () {
            document.getElementById("termInfo" + indexNum[i]).style.display = "none";
        }

        console.log("IndexNum: ", indexNum[i]);
    }
}

widget("div, p, h1, h2");                                                                                       //Function Call