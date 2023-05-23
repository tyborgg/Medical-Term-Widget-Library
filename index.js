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
var totalTerms = 0;
var definitionsNotFound = 0;
termsNotFound = [];

async function widget(elementTags){
    var elementList = document.querySelectorAll(elementTags);                                  //Retrieves a list of the specified element tags in the document
    var count = 0;
    var definitions = [];
    var indexNum = [];
    var relationships = [];
    var typeOfRel = [];

    for(let i = 0; i < elementList.length; i++){
        if(elementList[i].childElementCount == 0 && elementList[i].innerHTML != ""){            //Checks to see if the element tag has no children
            var text = elementList[i].innerHTML.toString();
            var APItext = elementList[i].innerHTML.replace(/ /g, '+');
            elementPos = elementList[i].getBoundingClientRect();
            elementList[i].innerHTML = "";


            var termList = [];                                                                  //Holds a list of all keywords found in the current element tag
            var res = await fetch("https://data.bioontology.org/annotator?text=" + APItext + "&ontologies=OCHV,CST,COSTART,CPT,GO,HL7,HCPCS,ICD10,ICD9CM,ICPC2P,LOINC,MEDLINEPLUS,NCIT,NCBITAXON,NDDF,OMIM,PDQ,RXNORM,SNOMEDCT,SNMI,VANDF,WHO-ART&longest_only=true&exclude_numbers=true&whole_word_only=true&exclude_synonyms=true&apikey=2a530beb-245c-4daa-904d-efd673c67249");
            var terms = await res.json();
            
            for(let i = 0; i < terms.length; i++){
                if(termList.indexOf(terms[i].annotations[0].text) == -1){
                    termList.push(terms[i].annotations[0].text);
                }
            }

            totalTerms += termList.length;
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
                        break;
                    }
                    else{
                        termList.splice(termList.indexOf(term), 1);
                    }
                }
                
                var keyword = document.createElement("a");                                    //Creates a div element that will hold the keyword text (highlighted)
                keyword.id = "term" + count.toString();
                keyword.href = "https://en.wikipedia.org/wiki/" + text.substring(index, index + termLength);
                keyword.textContent = text.substring(index, index + termLength);
                keyword.style.color = "#3366cc";
                keyword.style.display = "inline-block";
                keyword.style.position = "relative";
                keyword.style.cursor = "pointer";
                keyword.style.textDecoration = "none";
                keyword.style.transition = ".2s";

                var definition = "No Definition Found";
                var res = await fetch("http://localhost:5000/definition/term/" + text.substring(index, index + termLength).toLowerCase());
                var data = await res.json();

                if(data.Definitions_Returned != 0){
                    var val = 0;
                    definition = data.Definitions[0].DEF;

                    for(var k = 0; k < data.Definitions_Returned - 1; k++){
                        if(data.Definitions[k].STR.toLowerCase() == text.substring(index, index + termLength)){
                            console.log("here");
                            definition = data.Definitions[k].DEF;
                            val = k;
                            break;
                        }
                    }

                    res = await fetch("http://localhost:5000/relation/AUI/" + data.Definitions[val].AUI);
                    data = await res.json();

                    var temp1 = [];
                    var temp2 = [];
                    if(data.Relations_Returned != 0){
                        for(var m = 0; m < data.Relations_Returned - 1; m++){
                            temp1.push(data.Relations[m].STR2);
                            temp2.push(data.Relations[m].RELA);
                        }

                        relationships.push(temp1);
                        typeOfRel.push(temp2);
                    }
                    else{
                        relationships.push(["No relationships found"]);
                        typeOfRel.push(["No relationships found"]);
                    }
                }
                else{
                    relationships.push(["No relationships found"]);
                    typeOfRel.push(["No relationships found"]);
                    definitionsNotFound += 1;

                    if(termsNotFound.indexOf(term.toLowerCase()) == -1){
                        termsNotFound.push(term.toLowerCase());
                    }
                }

                definitions.push(definition);
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
                    elementList[i].append(keyword);
                }
        
                termList.splice(termList.indexOf(term), 1);                                     //Removes keyword from the list (don't highlight the same word twice)
                prev = index + termLength;
                tempText = text.substring(prev, text.length - 1);
            }
        
            if(index + termLength != text.length){                                              //Adds the rest of the unhighlighted text to the current element tag
                elementList[i].append(text.substring(prev, text.length));
            }
        }
    }

    for(let i = 0; i < indexNum.length; i++){                                                   
        var keyword = document.getElementById("term" + indexNum[i]);
        var elementPos = keyword.getBoundingClientRect();
        var w = window.innerWidth;

        var keywordInfo = document.createElement("div");
        keywordInfo.id = "termInfo" + indexNum[i];    
        keywordInfo.style.color = "black";
        keywordInfo.style.backgroundColor = "white";
        keywordInfo.style.textAlign = "left";
        keywordInfo.style.padding = "15px 15px 15px 15px";
        keywordInfo.style.fontFamily = "Arial, Helvetica, sans-serif";
        keywordInfo.style.fontVariant = "normal";
        keywordInfo.style.position = "absolute";
        keywordInfo.style.width = "270px";
        keywordInfo.style.maxHeight = "180px";
        keywordInfo.style.overflow = "auto";
        keywordInfo.style.fontSize = "14px";
        keywordInfo.style.zIndex = "1000";

        var triangle = document.createElement("div");
        triangle.id = "triangle" + indexNum[i];
        triangle.style.width = "0";
        triangle.style.height = "0";
        triangle.style.borderLeft = "8px solid transparent";
        triangle.style.borderRight = "8px solid transparent";
        triangle.style.filter = "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.25))";
        triangle.style.position = "absolute";
        triangle.style.left = "50%";
        triangle.style.transform = "translate(-50%, 0px)";
        triangle.style.zIndex = "1000";
        triangle.style.visibility = "hidden";
        triangle.style.opacity = "0";
        triangle.style.transition = "0.2s";

        if(elementPos.y < 230){
            if(elementPos.x < 110){
                keywordInfo.style.top = "9px";
                keywordInfo.style.left = "-20px";
                triangle.style.borderBottom = "10px solid white";
            }
            else if(elementPos.x > (w - 200)){
                keywordInfo.style.top = "9px";
                keywordInfo.style.right = "-20px";
                triangle.style.borderBottom = "10px solid white";
            }
            else{
                keywordInfo.style.top = "9px";
                keywordInfo.style.left = "50%";
                keywordInfo.style.transform = "translate(-50%, 0px)";
                triangle.style.borderBottom = "10px solid white";
            }
        }
        else{
            if(elementPos.x < 120){
                keywordInfo.style.bottom = "9px";
                keywordInfo.style.left = "-20px";
                triangle.style.borderTop = "10px solid white";
                triangle.style.bottom = "100%";
            }
            else if(elementPos.x > (w - 200)){
                keywordInfo.style.bottom = "9px";
                keywordInfo.style.right = "-20px";
                triangle.style.borderTop = "10px solid white";
                triangle.style.bottom = "100%";
            }
            else{
                keywordInfo.style.bottom = "9px";
                keywordInfo.style.left = "50%";
                keywordInfo.style.transform = "translate(-50%, 0px)";
                triangle.style.borderTop = "10px solid white";
                triangle.style.bottom = "100%";
            }
        }

        console.log(definitions.length, relationships.length, typeOfRel.length);

        var keywordDefinitionText = document.createElement("div");
        keywordDefinitionText.innerHTML = "<strong style=\"color:#3366cc\">Definition:</strong><br>" + definitions[i];

        var keywordRelationshipText = document.createElement("div");
        keywordRelationshipText.innerHTML = "<strong style=\"color:#3366cc\">Relationships:</strong>";
        var br = document.createElement("br");

        if(relationships[i][0] != "No relationships found"){

            var list = document.createElement("ul");
            
            for(var r = 0; r < relationships[i].length; r++){
                var bp = document.createElement("li");
                bp.innerHTML = "<strong>Term:</strong> " + relationships[i][r] + "<br> <strong>Type:</strong> " + typeOfRel[i][r].replaceAll("_", " ");
                list.appendChild(bp);
            }

            keywordRelationshipText.append(list);
        }
        else{
            keywordRelationshipText.innerHTML = "No Relationships Found"
        }

        keywordInfo.append(keywordDefinitionText, keywordRelationshipText);
        triangle.append(keywordInfo);
        keyword.append(triangle);
    }

    for(let i = 0; i < indexNum.length; i++){                                                   //Adds the hover style to the keyword (info appears while hovering)
        document.getElementById("term" + indexNum[i]).onmouseover = function () {
            document.getElementById("term" + indexNum[i]).style.textDecoration = "underline";
            document.getElementById("triangle" + indexNum[i]).style.visibility = "visible";
            document.getElementById("triangle" + indexNum[i]).style.opacity = "1";
        }
        document.getElementById("term" + indexNum[i]).onmouseout = function () {
            document.getElementById("term" + indexNum[i]).style.textDecoration = "none";
            document.getElementById("triangle" + indexNum[i]).style.visibility = "hidden";
            document.getElementById("triangle" + indexNum[i]).style.opacity = "0";
        }
    }
}

widget("p");                                                                       //Function Call