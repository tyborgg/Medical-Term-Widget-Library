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

async function widget(elementTags){
    var elementList = document.querySelectorAll(elementTags);                                  //Retrieves a list of all p-tags and div-tags in the document
    var count = 0;
    var indexNum = [];

    console.log("List:", elementList);

    for(let i = 0; i < elementList.length; i++){
        if(elementList[i].childElementCount == 0 && elementList[i].innerHTML != ""){                                              //Checks to see if the element tag has no children
            var text = elementList[i].innerHTML;
            var APItext = elementList[i].innerHTML.replace(/ /g, '+');
            console.log("Type:", elementList[i].localName,"\nText:", text);
            elementList[i].innerHTML = "";

            var termList = [];                                                                  //Holds a list of all keywords found in the current element tag

            var res = await fetch("http://data.bioontology.org/annotator?text=" + APItext + "&longest_only=true&apikey=2a530beb-245c-4daa-904d-efd673c67249");
            var terms = await res.json();

            console.log(terms);
            
            for(let i = 0; i < terms.length; i++){
                if(termList.indexOf(terms[i].annotations[0].text) == -1){
                    termList.push(terms[i].annotations[0].text);
                }
            }

            console.log("Term List:", termList);

            var term = "";
            var prev = 0;
            var termLength = 0;
            var index = 0;
            var tempText = text;
                        
            while(termList.length != 0){
                for(let i = 0; i < termList.length; i++){                                       //Finds the first keyword within the user input
                    var tempIndex = tempText.toLowerCase().indexOf(termList[i].toLowerCase());
                    if(tempIndex != -1){
                        index = tempIndex + prev;
                        term = termList[i];
                        termLength = termList[i].length;
                        console.log("Term: ", term);
                        console.log ("Term length: ", termList[i].length);
                        console.log("Index: ", index);
                        break;
                    }
                    else{
                        termList.splice(termList.indexOf(term), 1);
                    }
                }

                
                var keyword = document.createElement("div");                                    //Creates a div element that will hold the keyword text (highlighted)
                keyword.id = "term" + count.toString();
                keyword.textContent = text.substring(index, index + termLength);
                keyword.style.backgroundColor = "yellow";
                keyword.style.display = "inline-block";
                keyword.style.position = "relative";

                var definition = "No Definition Found";
                var res = await fetch("http://localhost:5000/definition/term/" + term.toLowerCase());
                var data = await res.json();

                if(data.Definitions_Returned != 0){
                    definition = data.Definitions[0].DEF;
                }
        
                var keywordInfo = document.createElement("div");                                //Creates a div element that will hold the 
                keywordInfo.id = "termInfo" + count.toString();                                 
                keywordInfo.textContent = definition;                             //Keyword information (such as a definition)
                keywordInfo.style.color = "white";
                keywordInfo.style.backgroundColor = "black";
                keywordInfo.style.border = "2px";
                keywordInfo.style.borderColor = "blue";
                keywordInfo.style.borderRadius = "5px"
                keywordInfo.style.textAlign = "center";
                keywordInfo.style.padding = "5px 5px 5px 5px";
                keywordInfo.style.position = "absolute";
                keywordInfo.style.zIndex = "1";
                keywordInfo.style.width = "120px";
                keywordInfo.style.bottom = "120%";
                keywordInfo.style.left = "50%";
                keywordInfo.style.marginLeft = "-60px";
                keywordInfo.style.visibility = "hidden" ;
                keywordInfo.style.opacity = "0";
                keywordInfo.style.transition = "opacity 1s";
                
                keyword.append(keywordInfo);
        
                indexNum.push(count.toString());
                count = count + 1;                                                              //Increment counter
        
                if(index == 0){
                    elementList[i].append(keyword);
                }
                else{
                    if(prev == index){
                        elementList[i].append(" ");
                    }
                    else{
                        elementList[i].append(text.substring(prev, index));
                    }   
                    console.log(text.substring(prev, index));
                    elementList[i].append(keyword);
                }
        
                termList.splice(termList.indexOf(term), 1);                                     //Removes keyword from the list (don't highlight the same word twice)
                prev = index + termLength;
                console.log("Prev: ", prev);

                tempText = text.substring(prev, text.length - 1);
            }
        
            if(index + termLength != text.length){                                              //Adds the rest of the unhighlighted text to the current element tag
                elementList[i].append(text.substring(prev, text.length));
            }
        }
    }

    for(let i = 0; i < indexNum.length; i++){                                                   //Adds the hover style to the keyword (info appears while hovering)
        document.getElementById("term" + indexNum[i]).onmouseover = function () {
            document.getElementById("termInfo" + indexNum[i]).style.visibility = "visible";
            document.getElementById("termInfo" + indexNum[i]).style.opacity = "1";
        }
        document.getElementById("term" + indexNum[i]).onmouseout = function () {
            document.getElementById("termInfo" + indexNum[i]).style.visibility = "hidden";
            document.getElementById("termInfo" + indexNum[i]).style.opacity = "0";
        }

        console.log("IndexNum: ", indexNum[i]);
    }
}

widget("div, p, h1, h2");                                                                       //Function Call