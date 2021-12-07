/* var customer = {
    name: 'Justin Smith',
    Address: '4 3rd ST Houlton, ME 04730-3238',
    soldFor: 'me',
    OrderDate: 'Sep 11, 2020',
    TotalPrice: .1
};
*/
var OrderController = (function() {
    // removed soldFor because the data isn't easily available in order slips
    function Customer(name, address, date, price, payout) {
    this.name = name;
    this.address = address;
    this.date = date;
    this.price = price;
    this.payout = payout;
};
        //TCG fees = 12.75% + .30
    //adding this functionality later(now)
    /*function payout(price) {
        var tempPrice = price;
        var comFees, proFees;
        // add shipping fee to orders under $5
        if (price < 5) {
            tempPrice = price + .78;
        }
        // subtract fees
        // commision fee is 10.25% and maxes out at $50
        // processing fee is 2.5% + $.30
        comFees = price * .1025;
        if (comFees > 50) {
            comFees = 50;
        }
        // calc processing fees (2.5% + .30)
        proFees = price * .025 + .30;
        
        tempPrice = tempPrice - (comFees + proFees);
        //subtract shipping
        //check if shipping number was needed (above 35$)
        // shipping prices have changed so for simplicities sake I'm using the most recent prices
        if (price >= 35) {
            tempPrice -= 4.3;
        } else {
            tempPrice -= .60;
        }
        return tempPrice;
    };*/

    // main array for storing Orders
    var orders = [];
    
    return {
        
        addItem: function(name, address, date, price, payout) {
            // push object onto array
            orders.push(new Customer(name, address, date, price, payout));
            console.log(orders);
        },
        
        findItem: function(searchTerm) {
            var results = [];
            for(var i = 0; i < orders.length; i++) {
                if(orders[i].name === searchTerm) {
                    results = orders[i];
                    break;
                } //else {
                //  console.log("Sorry, we couldn't find anyone by that name.");
                //}
            }
            return results;
        },
        //TCG fees = 12.75% + .30
        //adding this functionality later(now)
        calcPayout: function(price) {
            var tempPrice = price;
            var comFees, proFees;
            // add shipping fee to orders under $5
            if (price < 5) {
                tempPrice = price + .78;
            }
            // subtract fees
            // commision fee is 10.25% and maxes out at $50
            // processing fee is 2.5% + $.30
            comFees = price * .1025;
            if (comFees > 50) {
                comFees = 50;
            }
            // calc processing fees (2.5% + .30)
            proFees = price * .025 + .30;
        
            tempPrice = tempPrice - (comFees + proFees);
            //subtract shipping
            //check if shipping number was needed (above 35$)
            // shipping prices have changed so for simplicities sake I'm using the most recent prices
            if (price >= 35) {
                tempPrice -= 4.3;
            } else {
                tempPrice -= .60;
            }
            return tempPrice;
        }
    }
})();

// Controller for all elements directly related to the UI
var UIController = (function() {
    // object for accessing elements in the DOM
    var DOMstrings = {
    name: '.Customer',
    address: '.Address',
    orderDate: '.order-date',
    price: '.price',
    payout: '.payout',
    submit: '.sumbit',
    searchBy: '.search_by',
    search: '.search',
    display: '.display-wrapper'
    };
    
    
    return {
        //grab the contents of every textbox
        getInput: function() {
            return {
                name: document.querySelector(DOMstrings.name).value,
                address: document.querySelector(DOMstrings.address).value,
                orderDate: document.querySelector(DOMstrings.orderDate).value,
                price: parseFloat(document.querySelector(DOMstrings.price).value),
                searchBy: document.querySelector(DOMstrings.searchBy).value
            }
        },
        // Clear text fields after either adding an order or searching for an order.
        clearOrderFields: function() {
            var fields, fieldsArr;
            //get list of the fields
            fields = document.querySelectorAll(DOMstrings.name + ',' + DOMstrings.address + ',' + DOMstrings.orderDate + ',' + DOMstrings.price + ',' + DOMstrings.searchBy);
            //use slice to convert list to array
            fieldsArr = Array.prototype.slice.call(fields);
        
            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });
            fieldsArr[0].focus;
        },
        clearDisplayField: function() {
            //remove the Html created by DisplayOrder at the start on each new search
            // get the DOM element
            const element = document.getElementById('display');
            // remove html if present
            console.log(element.firstElementChild);
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        
        },
        //Displays data on the searched order
        displayOrder: function(obj) {
            var html, newHtml, element;
            element = DOMstrings.display;
            html = '<p>Customer: %name%</p><p>Address: %address%</p><p>Ordered on: %date%</p><p>Price: %price%</p><p>Payout: %payout%</p>';
    
            //replace the placeholder text with date from the indexed orders entry
            newHtml = html.replace('%name%', obj.name);
            newHtml = newHtml.replace('%address%', obj.address);
            newHtml = newHtml.replace('%date%', obj.date);
            newHtml = newHtml.replace('%price%', obj.price);
            newHtml = newHtml.replace('%payout%', obj.payout);
    
            // insert the new html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        getDOMstrings: function() {
            return DOMstrings;
        }
        
    }
    
})();

//Global controller for the app
var Controller = (function(OrderCtrl, UICtrl) {
    
    //Retrieve data from fields and call addOrder or searchData
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector('.submit').addEventListener('click', ctrlAddItem);
        
        //search array for order with the matching name
        document.querySelector(DOM.search).addEventListener('click', ctrlSearchData);
    };
    
    var ctrlAddItem = function() {
        var input, newItem, payout;
        // get the field input data
        input = UICtrl.getInput();
        // check to see that all relavent fields have been filled
        if(input.name !== "" && input.address !== "" && input.soldFor !== "" && input.orderDate !== "" && !isNaN(input.price) && input.price > 0) {
            //generate payout
            payout = OrderCtrl.calcPayout(input.price);
            // add the new order to the Order controller
            newItem = OrderCtrl.addItem(input.name, input.address, input.orderDate, input.price, payout);
        }
        // Clear fields
        UICtrl.clearOrderFields();
    }
    
    var ctrlSearchData = function() {
        // clear display field for new search
        UICtrl.clearDisplayField();
        
        var newSearch = []; // make it an array in case multiple results are found
        var searchTerm = UICtrl.getInput();
        if(searchTerm.searchBy !== "") {
            newSearch = OrderCtrl.findItem(searchTerm.searchBy);
            console.log(newSearch);
            }
        //Display the search results on the UI
        UICtrl.displayOrder(newSearch);
        
        //Clear fields
        UICtrl.clearOrderFields();
    }
    
    //Start the App
    return {
        init: function() {
            console.log('The app has started!');
            setupEventListeners();
        }
    };
    
})(OrderController, UIController);

Controller.init();


/* ------ OLD VERSION ------
function Customer(name, address, soldFor, date, price) {
    this.name = name;
    this.address = address;
    this.soldFor = soldFor;
    this.date = date;
    this.price = price;
};

//TCG fees = 12.75% + .30
//adding this functionality later
Customer.prototype.finalPrice = function() {
    var tempPrice = this.price;
    var comFees, proFees;
    // add shipping fee to orders under $5
    if (this.price < 5) {
        tempPrice = this.price + .78;
    }
    // subtract fees
    // commision fee is 10.25% and maxes out at $50
    // processing fee is 2.5% + $.30
    // will have to add this later and calculate the point the $50 limit is reached.  It's 487.88
    if (this.price >== 487.88) {
        comFees = 50;
    } else {
        comFees = this.price * .1025;
    }
    // calc processing fees (2.5% + .30)
    proFees = this.price * .025 + .30;
    
    tempPrice = tempPrice - (comFees + proFees);
    //subtract shipping
    //check if shipping number was needed (above 28$)
    if (this.price >= 28) {
        tempPrice -= 4.1;
    } else {
        tempPrice -= .55;
    }
    this.price = tempPrice;
}

var DOMstrings = {
    name: '.Customer',
    address: '.Address',
    soldFor: '.sold-for',
    orderDate: '.order-date',
    price: '.price',
    searchBy: '.search_by',
    display: '.display-wrapper'
}

var orders = [];
//Add new order on to the array
function addOrder(name,address, soldFor, date, Price) {
    // push object onto array
    orders.push(new Customer(name, address, soldFor, date, Price));
}

function clearOrderFields() {
    var fields, fieldsArr;
    //get list of the fields
    fields = document.querySelectorAll(DOMstrings.name + ',' + DOMstrings.address + ',' + DOMstrings.soldFor + ',' + DOMstrings.orderDate + ',' + DOMstrings.price);
    //use slice to convery list to array
    fieldsArr = Array.prototype.slice.call(fields);
    
    fieldsArr.forEach(function(current, index, array){
        current.value = "";
    });
    fieldsArr[0].focus;
}
//For clearing the search field and Display div
function clearFields(str) {
    // pass in the DOM string we want to clear
    var field, fieldArr;
    field = document.querySelector(str);
    
    fieldArr = Array.prototype.slice.call(field);
    
    fieldArr.forEach(function(current, index, array){
        current.value = "";
    });
    
}

//Displays data on the searched order
function displayOrder(obj) {
    var html, newHtml, element;
    element = DOMstrings.display;
    html = '<p>Customer: %name%</p><p>Address: %address%</p><p>Sold for: %soldFor%</p><p>Ordered on: %date%</p><p>Price: %price%</p>';
    
    //replace the placeholder text with date from the indexed orders entry
    newHtml = html.replace('%name%', obj.name);
    newHtml = newHtml.replace('%address%', obj.address);
    newHtml = newHtml.replace('%soldFor%', obj.soldFor);
    newHtml = newHtml.replace('%date%', obj.date);
    newHtml = newHtml.replace('%price%', obj.price);
    
    // insert the new html into the DOM
    document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
}
//Retrieve data from fields and call addOrder
document.querySelector('.submit').addEventListener('click', function() {
    var name = document.querySelector('.Customer').value;
    var address = document.querySelector('.Address').value;
    var soldFor = document.querySelector('.sold-for').value;
    var orderDate = document.querySelector('.order-date').value;
    var price = parseFloat(document.querySelector('.price').value);
    
    addOrder(name, address, soldFor, orderDate, price);
    clearOrderFields();
    console.log(orders);
    
})
//search array for order with the matching name
document.querySelector('.search').addEventListener('click', function() {
    var searchTerm = document.querySelector('.search_by').value;
    
    clearFields(DOMstrings.display);
    clearFields(DOMstrings.searchBy);
    
    for(var i = 0; i < orders.length; i++) {
        if(orders[i].name === searchTerm) {
            displayOrder(orders[i]);
            console.log(orders[i]);
        } //else {
          //  console.log("Sorry, we couldn't find anyone by that name.");
        //}
    }
})
*/