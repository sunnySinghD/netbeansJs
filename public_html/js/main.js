/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function Element(label, type, value, id){
    this.Label = label !== null ? label : "No label";
    this.Type = type !== null ? type : "No type";
    this.Value = "No value";
    this.setValue(value);
    this.Id = id !== null ? id : -1;
    this.Next = null;
};

Element.prototype.draw = function(){
    return "Type: " + this.Type + "</br>Label: " + this.Label + "</br>Value: " + this.Value;
};

Element.prototype.add = function(newElement){
    if (newElement instanceof Element)
    {
        this.Next = newElement;
      
    }
};
 // set the value of an element based on a given type      
Element.prototype.setValue = function(value){
    var trueValue = "No Value";
    if (this.Type !== null && this.Type !== undefined && value !== null){
        // depending on the type, change the value to an appropriate value
        switch(this.Type.toLowerCase()){
            // for a boolean set the value of the element to a boolean
            case("bool"): 
                if (typeof value === "string" && value.toLowerCase() === "true"){ 
                    trueValue = true;
                }
                else if (typeof value === "boolean"){
                    trueValue = value;
                }
                else {
                    trueValue = false;
                }
                break;
            case("text"):
            default:
                trueValue = value;
        }
    }
    this.Value = trueValue;
};  
           
var ElementList = {
    First: null,
    Last: null,
    Size: 0,
    LastId: 0,
    ElementIsSelected: false,
    
    // add a new element to the last element of the list
    add: function(newElement){
        // if the list is empty we add the new element as the first
        if (this.First == null)
        {
            this.First = newElement;
            this.Last = this.First;
            this.Size = 0;
        }
        // otherwise the new element is added to the last
        else
        {
            // tell the last to make its next the new element
            this.Last.add(newElement);
            // set the last to the new element
            this.Last = newElement;
        }
        this.Size++;
    },
    
    // add a new element to the list and return it
   addElement: function(label, type, value){
        this.add(new Element(label, type, value, this.LastId++));
        return this.Last;
    },
    
    // remove (the first) element with a given label, type, value
    remove: function(label, type, value){
        var currentElement = this.First;

        // if the element we want to remove is first
        if (currentElement.Label === label &&
                currentElement.Type === type &&
                currentElement.Value === value){
                // if there are values after the first, set the list to start at the next
                if (this.First.Next !== null){
                    this.First = this.First.Next; 
                    this.Size--;
                }
                // no other values means the list is empty after we remove the head
                else {
                    this.First = null;
                    this.Last = this.First;
                    this.Size=0;
                }
        }
        else{
            var finished = false;
            while(currentElement.Next !== null && !finished){
                // if we find our element to remove, we should update the previous node to point to its next
                if (currentElement.Next.Label === label &&
                    currentElement.Next.Type === type &&
                    currentElement.Next.Value === value){
                    // if the element we want to remove is the last
                    if (currentElement.Next === this.Last){
                        currentElement.Next = null;
                        this.Last = currentElement;
                    }
                    // element is in the middle of the list ( betweeen elements )
                    else{
                        currentElement.Next = currentElement.Next.Next;
                    }
                    this.Size--;
                    finished = true;
                }
                else{
                    // if we haven't found it, continue iterating through the list
                    currentElement = currentElement.Next;
                }
            }
        }
    },
    // remove (the first) element with a given id
    removeById: function(id){
        var currentElement = this.First;

        // if the element we want to remove is first
        if (currentElement.Id === id){
                // if there are values after the first, set the list to start at the next
                if (this.First.Next !== null){
                    this.First = this.First.Next; 
                    this.Size--;
                }
                // no other values means the list is empty after we remove the head
                else {
                    this.First = null;
                    this.Last = this.First;
                    this.Size=0;
                }
        }
        else{
            var finished = false;
            while(currentElement.Next !== null && !finished){
                // if we find our element to remove, we should update the previous node to point to its next
                if (currentElement.Next.Id === id){
                    // if the element we want to remove is the last
                    if (currentElement.Next === this.Last){
                        currentElement.Next = null;
                        this.Last = currentElement;
                    }
                    // element is in the middle of the list ( betweeen elements )
                    else{
                        currentElement.Next = currentElement.Next.Next;
                    }
                    this.Size--;
                    finished = true;
                }
                else{
                    // if we haven't found it, continue iterating through the list
                    currentElement = currentElement.Next;
                }
            }
        }
    },    
    // remove an element from the list
    removeElement: function(elementToRemove){
        if (elementToRemove instanceof Element){
            remove(elementToRemove.Label, elementToRemove.Type, elementToRemove.Value);
        }
    },
     // return (the first) element with a given id
    getById: function(id){
        if (id !== null && typeof id === 'number'){
            var currentElement = this.First;

            while (currentElement !== null){
                if (currentElement.Id === id){
                    return currentElement;
                }
                currentElement = currentElement.Next;
            }
        }
        return null;
    }
};

// add an Element to the html display
function AddElementToDisplayList(anElement) {
    if (anElement instanceof Element){
        var newElementJquery = $("<li>" + anElement.draw() + "</li>").data("elementId", anElement.Id);
        $("#elementlist").append(newElementJquery);
    }
}

// sets hidden on create panel div to false to show edit button and inputs
function DisplayEditButton() {
    $(document).ready(function(){
        // show the display panel
        $(".displayPanel").attr("hidden", false);
        // hide the create button 
        $('.displayPanel .create').attr("hidden", true);
        // hide our save button and the original create button which opened the displayPanel
        $('.displayPanel .edit').attr("hidden", false);
        $("#createButton").attr("hidden", true);
    });
};

// sets hidden on create panel div to false to show create button and inputs
function DisplayCreatePanel() {
    $(document).ready(function(){
        // clear the existing label and value
        $("#label").val("");
        $('#value').val("");
        
        // show the div with the add button
        $(".displayPanel").attr("hidden", false);
        $('.displayPanel .create').attr("hidden", false);
        
        // hide our save button and the original create button which opened the displayPanel
        $('.displayPanel .edit').attr("hidden", true);
        $("#createButton").attr("hidden", true);
    });
};
// hides the create panel div
function HideCreatePanel() {
    $(document).ready(function(){
        // remove highlight class of previously highlighted 
        $("#elementlist .highlight").removeClass("highlight");
        ElementList.ElementIsSelected = false;
        
        elementDeselected();
    });
};
// take all the input values, validate them and then create a new element
function finishedCreate() {
    $(document).ready(function(){   
        var newLabel = $("#label").val();
        var newType = $("#type").val();
        var newValue = $("#value").val();
        if (newLabel && newType && newValue)
        {
//            FormElements.add(newLabel, newType, newValue);
//            $("#elementlist").append("<li>" + FormElements.drawLast() + "</li>");
            AddElementToDisplayList(ElementList.addElement(newLabel, newType, newValue));
        }
        // clear the existing label and value
        $("#label").val("");
        $('#value').val("");
    });
};

// remove the button selected
function elementSelected() {
    ElementList.ElementIsSelected = true;
    $(document).ready(function(){
        // hide the create button and the create panel
        $(".displayPanel").attr("hidden", true);
        $("#createButton").attr("hidden", true);
        
        // show the edit panel
        $(".editPanel").attr("hidden", false);
    });
}

function elementDeselected() {
    ElementList.ElementIsSelected = false;
    $(document).ready(function(){
        // hide the create button and the create panel
        $(".displayPanel").attr("hidden", true);
        $("#createButton").attr("hidden", false);
        
        // hide the edit panel
        $(".editPanel").attr("hidden", true);
    });
}
// remove the clicked element from the element list (and the display)
function removeClicked() {
    $(document).ready(function(){
        var id = $("#elementlist .highlight").data("elementId");
        $("#elementlist .highlight").remove();
        ElementList.removeById(id);
        elementDeselected();
    });
}

function saveAll(){
    if (Modernizr.localstorage){
        // store all data relavant to ElementList

        // save the size to count when loading
        localStorage["Size"]=ElementList.Size;
        var index = 0;
        var currentElement = ElementList.First;

        while(currentElement !== null){
	    localStorage[index++] = JSON.stringify({Label:currentElement.Label, Type:currentElement.Type, Value:currentElement.Value});
            currentElement = currentElement.Next;
        }
    }
}

function loadAll(){
    if (Modernizr.localstorage){
        // on loadAll() we set lastId to 0 and give each element a new id starting at 0
        ElementList.LastId = 0;
        
        var index = 0;
        
        // read in elements based on Size
        var count = localStorage["Size"];
        var currentElement;
        for (; count > 0; count--){
            currentElement = JSON.parse(localStorage[index]);
            AddElementToDisplayList(ElementList.addElement(currentElement.Label, currentElement.Type, currentElement.Value));
            index++;
        }
    }
}
    
function gotoView(){
    //save the form elements to local storage before jumping to the view.html
    saveAll();
};
// load the saved values from local storage and register event handlers
function loadIndex(){
    
   loadAll();

// set up event handling to toggle highlighting (only one at a time)
    $(document).ready(function(){

        // if an element is clicked in the list, handle highlighting
        $("#elementlist").on("click", "li", function(){
            // if an element has not been highlighted, highlight the selected item and set our flag
            if (!ElementList.ElementIsSelected){
                $(this).addClass("highlight");
                elementSelected();
            }
            else {
                // this is the item that has been highlighted, unhighlight and set flag to false
                if ( $(this).hasClass("highlight") ){
                    $(this).removeClass("highlight");
                    elementDeselected();
                }
                else {
                    // remove highlight class of previously highlighted 
                    $("#elementlist .highlight").removeClass("highlight");
                    
                    // keep flag as true, add highlight to this class
                    $(this).addClass("highlight");
                    elementSelected();
                }
            }
        });
        
         // create click handler for the edit button
        $("#editButton").click(function(){

            // a single element from the list should be clicked at this point, retrieve it
            var highlightElement = $("#elementlist .highlight");
            var id = highlightElement.data("elementId");

            // get the element from the id in the highlighted element
            var elementToEdit = ElementList.getById(id);
            // fill the label, type, and value fields with the element's data
            if (elementToEdit){
                $("#label").val(elementToEdit.Label);
                $("#type").val(elementToEdit.Type);
                $("#value").val(elementToEdit.Value);
            
                // show the create panel display fields and the save edit button
                DisplayEditButton();
                // hide the edit panel
                $(".editPanel").attr("hidden", true);
            }

        });
        
         // create click handler for the save edit button ( used after editing is completed )
        $("#saveEditButton").click(function(){

            // save the changes 
            
            // a single element from the list should be clicked at this point, retrieve it
            var highlightElement = $("#elementlist .highlight");
            var id = highlightElement.data("elementId");

            // get the element from the id in the highlighted element
            var elementToEdit = ElementList.getById(id);
            // fill the label, type, and value fields with the element's data
            if (elementToEdit){
                elementToEdit.Label = $("#label").val();
                elementToEdit.Type = $("#type").val();
                elementToEdit.setValue($("#value").val());
            }
            $("#elementlist .highlight").html(elementToEdit.draw());
            // hide the create panel fields with 
            HideCreatePanel();
            
            // remove highlight class of previously highlighted 
            $("#elementlist .highlight").removeClass("highlight");
            ElementList.ElementIsSelected = false;
            
        });
        
    });
    
   
        
};


