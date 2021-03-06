
//variables for stock fetch (JM)
let apiStockUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="
let apiKey = "&apikey=MYP2P4U87W95DBG6";
let stockInputEl = document.querySelector("#stacked-stockname");
let stockDateEl = document.querySelector("#stack-stockdate");
let stockFormEl = document.querySelector("#stock-form");
let searchBtnEl = document.querySelector("#stk");
let errorStockEl = document.querySelector(".error-msg");


let stkHistoryArr = [];
let update = 0;

// Get stock price api (JM)
let getStockUrl = function (stock, stkdate) {
    console.log("api: ", stock, stkdate);
    let apiUrl = apiStockUrl + stock + apiKey;
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);

                // This is undefined error check on stock api array
                if (!data.hasOwnProperty("Meta Data")) {
                    errorStockEl.textContent = "";
                    errorStockEl.textContent = "Please enter a valid stock symbol and a valid date.  ** holidays are not valid dates **";
                    errorStockEl.style.display = "block";
                    return;
                } else if (!data["Meta Data"].hasOwnProperty("2. Symbol")) {
                    errorStockEl.textContent = "";
                    errorStockEl.textContent = "Please enter a valid stock symbol and a valid date.  ** holidays are not valid dates **";
                    errorStockEl.style.display = "block";
                    return;
                } else {
                    saveSearchHistory(stock);
                    update = 1;
                    getSearchHistory(update);
                    update = 0;
                }
                // This is undefined error check on date api array
                if (!data.hasOwnProperty("Time Series (Daily)")) {
                    errorStockEl.textContent = "";
                    errorStockEl.textContent = "Please enter a valid stock symbol and a valid date.  ** holidays are not valid dates **";
                    errorStockEl.style.display = "block";
                    return;
                } else if (!data["Time Series (Daily)"].hasOwnProperty(stkdate)) {
                    errorStockEl.textContent = "";
                    errorStockEl.textContent = "Please enter a valid stock symbol and a valid date.  ** holidays are not valid dates **";
                    errorStockEl.style.display = "block";
                    return;
                } else {
                    saveSearchHistory(stock);
                    update = 1;
                    getSearchHistory(update);
                    update = 0;
                }

                displayStock = data["Meta Data"]["2. Symbol"];
                displayStock.textContent = ""; // Created to remove last stock name (BR)
                let upperStock = displayStock.toUpperCase();

                let stockNameEl = document.querySelector('.stock-legend');
                let stknme = document.createElement('p');
                stockNameEl.textContent = ""; // Created to remove last stock Prices (BR)
                stockNameEl.appendChild(stknme);
                stknme.innerHTML = "Stock: " + upperStock;
                stknme.style.backgroundColor = "white";
                stknme.style.color = "#2a72f6";


                let stockPriceEl = document.querySelector('.stock-legend');
                let stkpr = document.createElement('p');
                stockPriceEl.appendChild(stkpr);
                dispMM = stkdate.slice(5, 7);
                dispDD = stkdate.slice(8, 10);
                dispYYYY = stkdate.slice(0, 4);
                dispStkDte = dispMM + "/" + dispDD + "/" + dispYYYY;
                stkpr.innerHTML = "Price Date: " + dispStkDte;
                stkpr.style.backgroundColor = "white";

                displayOpen = data["Time Series (Daily)"][stkdate]["1. open"];
                displayHigh = data["Time Series (Daily)"][stkdate]["2. high"];
                // displayLow was givin value "UNDEFINED" because of a typo (BR)
                displayLow = data["Time Series (Daily)"][stkdate]["3. low"];
                displayClose = data["Time Series (Daily)"][stkdate]["4. close"];
                displayVolume = data["Time Series (Daily)"][stkdate]["5. volume"];

                // Show stock open price
                let stockOpenEl = document.querySelector('.stock-legend');
                let stkopen = document.createElement('p');
                stockOpenEl.appendChild(stkopen);
                // applied method math.round with toFixed to reduce decimals in the value (BR)
                stkopen.innerHTML = "Open: " + (Math.round(displayOpen)).toFixed(2);
                stkopen.style.backgroundColor = "white";

                // Show stock high
                let stockHighEl = document.querySelector('.stock-legend');
                let stkhigh = document.createElement('p');
                stockHighEl.appendChild(stkhigh);
                // applied method math.round with toFixed to reduce decimals in the value (BR)
                stkhigh.innerHTML = "High: " + (Math.round(displayHigh)).toFixed(2);
                stkhigh.style.backgroundColor = "white";

                // Show stock low
                let stockLowEl = document.querySelector('.stock-legend');
                let stklow = document.createElement('p');
                stockLowEl.appendChild(stklow);
                // applied method math.round with toFixed to reduce decimals in the value (BR)
                stklow.innerHTML = "Low: " + (Math.round(displayLow)).toFixed(2);
                stklow.style.backgroundColor = "white";

                // Show closing stock price
                let stockCloseEl = document.querySelector('.stock-legend');
                let stkclose = document.createElement('p');
                stockCloseEl.appendChild(stkclose);
                // applied method math.round with toFixed to reduce decimals in the value (BR)
                stkclose.innerHTML = "Close: " + (Math.round(displayClose)).toFixed(2);
                stkclose.style.backgroundColor = "white";

                // Show stock closing price
                let stockVolumeEl = document.querySelector('.stock-legend');
                let stkvolume = document.createElement('p');
                stockVolumeEl.appendChild(stkvolume);
                stkvolume.innerHTML = "Volume: " + displayVolume;
                stkvolume.style.backgroundColor = "white";

            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
        .catch(function (error) {
            alert("unable to connect");
        });

};

let finNews = () => {
    fetch("https://bloomberg-market-and-financial-news.p.rapidapi.com/news/list?id=markets", {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "00e26da5d4msh20070461cdf2903p10f06djsne3ef9c15568f",
            "x-rapidapi-host": "bloomberg-market-and-financial-news.p.rapidapi.com"
        }
    })
    .then(response => {
        response.json().then(function (data) {
            console.log(data);
            displayNews = data["modules"]["0"]["stories"]["0"].title;
            let newsEl = document.querySelector('.fin-news');
            let dispNews = document.createElement('p');
            newsEl.appendChild(dispNews);
            dispNews.innerHTML = displayNews

            newsImage = data["modules"]["0"]["stories"]["0"].image;
            let imageEl = document.querySelector('.fin-news');
            let dispImage = document.createElement('img');
            imageEl.appendChild(dispImage);
            dispImage.src = newsImage;
          
            newsUrl = data["modules"]["0"]["stories"]["0"].longURL;
            let urlEl = document.querySelector('.fin-news');
            let dispUrl = document.createElement('a');
            urlEl.appendChild(dispUrl);
            dispUrl.href = newsUrl;
            dispUrl.textContent = "Click to read article";

        })
    })
    .catch(err => {
        console.error(err);
    });

};

let stockMktIndex = () => {
    fetch("https://financialmodelingprep.com/api/v3/quote/%5EGSPC,%5EDJI,%5EIXIC?apikey=2301f75afa78fc52aa6f76d1208a3425", {
        "method": "GET"
    })
    .then(response => {
        response.json().then(function (data) {
            console.log("stock indexes: ", data);

            // Dow Jones
            let dowEl = document.querySelector('.fin-index');
            let dispDow = document.createElement('p');
            dowEl.appendChild(dispDow);
            dispDow.innerHTML = "DOW Jones"
            dispDow.style.width = "120px"


            let displayDow = data["0"].price;
            let dowpEl = document.querySelector('.fin-index');
            let dispDowp = document.createElement('p');
            dowpEl.appendChild(dispDowp);
            dispDowp.innerHTML = displayDow;
            dispDowp.style.width = "85px"


            let displayDowChg = data["0"].change;
            let dowchgEl = document.querySelector('.fin-index');
            let dispDowChg = document.createElement('p');
            dowchgEl.appendChild(dispDowChg);
            dispDowChg.innerHTML = displayDowChg;

            if (displayDowChg > 0) {
                dispDowChg.style.color = "lightgreen";
            };
            if (displayDowChg < 0) {
                dispDowChg.style.color = "red";
            };

            let breakEl = document.querySelector('.fin-index');
            let brEl = document.createElement('br');
            breakEl.appendChild(brEl);


            // S&P 500
            let sandpEl = document.querySelector('.fin-index');
            let dispSP = document.createElement('p');
            sandpEl.appendChild(dispSP);
            dispSP.innerHTML = "S&P 500"
            dispSP.style.width = "120px"

            let displaySP = data["1"].price;
            let sppEl = document.querySelector('.fin-index');
            let dispspp = document.createElement('p');
            sppEl.appendChild(dispspp);
            dispspp.innerHTML = displaySP;
            dispspp.style.width = "85px"


            let displaySPChg = data["1"].change;
            let spchgEl = document.querySelector('.fin-index');
            let dispspChg = document.createElement('p');
            spchgEl.appendChild(dispspChg);
            dispspChg.innerHTML = displaySPChg;

            if (displaySPChg > 0) {
                dispspChg.style.color = "lightgreen";
            };
            if (displaySPChg < 0) {
                dispspChg.style.color = "red";
            };

            let break2El = document.querySelector('.fin-index');
            let br2El = document.createElement('br');
            break2El.appendChild(br2El);

            
            // NASDAQ
            let nasEl = document.querySelector('.fin-index');
            let dispNas = document.createElement('p');
            nasEl.appendChild(dispNas);
            dispNas.innerHTML = "NASDAQ"
            dispNas.style.width = "120px"


            let displayNasp = data["1"].price;
            let naspEl = document.querySelector('.fin-index');
            let dispnasp = document.createElement('p');
            naspEl.appendChild(dispnasp);
            dispnasp.innerHTML = displayNasp;
            dispnasp.style.width = "85px"


            let displayNasChg = data["1"].change;
            let naschgEl = document.querySelector('.fin-index');
            let dispNasChg = document.createElement('p');
            naschgEl.appendChild(dispNasChg);
            dispNasChg.innerHTML = displayNasChg;

            if (displayNasChg > 0) {
                dispNasChg.style.color = "lightgreen";
            };
            if (displayNasChg < 0) {
                dispNasChg.style.color = "red";
            };

        })
    })
};


// Get intial stock 
let initialStock = function () {
    let today = new Date();
    let mm = ("0" + (today.getMonth() + 1)).slice(-2)
    let dd = ("0" + today.getDate()).slice(-2);
    let yyyy = today.getFullYear();
    console.log("FB - before switch: ", mm, dd, yyyy);
    // New code to check if date valid
    switch (new Date().getDay()) {
        case 0:
            dd = dd - 2;
            break;
        case 1:
            dd = dd - 3;
            break;
        default:
            dd = dd - 1;
    }
    if (dd < 10) dd = '0' + dd;
    console.log("FB - After switch: ", mm, dd, yyyy);

    displayDate = yyyy + "-" + mm + "-" + dd;
    console.log("FB - Date: ", displayDate);
    errorStockEl.textContent = "";
    let stock = "FB";
    let stkdate = displayDate;
    console.log(stock, stkdate);
    if (stock && stkdate) {
        getStockUrl(stock, stkdate);
        stockInputEl.value = "";
        stockDateEl.value = "";
    } else {
        errorStockEl.textContent = "";
        errorStockEl.textContent = "Please enter a valid stock symbol and a valid date.  ** holidays are not valid dates **";
        errorStockEl.style.display = "block";
    }
};


// Get stock name from input (JM)
let formSubmitHandler = function (event) {
    event.preventDefault();
    errorStockEl.textContent = "";
    let stock = stockInputEl.value.trim();
    let stkdate = stockDateEl.value;
    console.log(stock, stkdate);
    if (stock && stkdate) {
        getStockUrl(stock, stkdate);
        stockInputEl.value = "";
        stockDateEl.value = "";
    } else {
        errorStockEl.textContent = "";
        errorStockEl.textContent = "Please enter a valid stock symbol and a valid date.  ** holidays are not valid dates **";
        errorStockEl.style.display = "block";
    }
};

// Display time (BR)
var now = moment().format("hh:mm");
// console.log(now);

// create datepicker (BR)
$("#stack-stockdate").datepicker({
    beforeShowDay: $.datepicker.noWeekends,
    dateFormat: 'yy-mm-dd',
    minDate: -142,
    maxDate: -1

});

// Get stock name from search history 
let formSubmitHistory = function (event) {
    event.preventDefault();
    errorStockEl.textContent = "";
    console.log("Event................................:  ", event);
    let stock = event.target.value;
    // let currencyChosen = currencyList.value;
    if (stock) {
        stockInputEl.value = "";
        let today = new Date();
        let mm = ("0" + (today.getMonth() + 1)).slice(-2)
        let dd = ("0" + today.getDate()).slice(-2);
        let yyyy = today.getFullYear();
        console.log("before switch: ", mm, dd, yyyy);
        // New code to check if date valid
        switch (new Date().getDay()) {
            case 0:
                dd = dd - 2;
                break;
            case 1:
                dd = dd - 3;
                break;
            default:
                dd = dd - 1;
        }
        if (dd < 10) dd = '0' + dd;
        console.log("After switch: ", mm, dd, yyyy);

        displayDate = yyyy + "-" + mm + "-" + dd;
        console.log("Date: ", displayDate);
        stkdate = displayDate;
        console.log("stkdate: ", stkdate);
        getStockUrl(stock, stkdate);
        stockInputEl.value = "";
        stockDateEl.value = "";
        currencyChosen = "";
    } else {
        errorStockEl.style.display = "block";
    }
};

// Load search history
let getSearchHistory = function (update) {
    if ("StockSearch" in localStorage) {
        let retrievedData = localStorage.getItem("StockSearch");
        stkHistoryArr = JSON.parse(retrievedData);
        if (update === 1) {
            let parent = document.querySelector('#stk');
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
            let priceparent = document.querySelector('#stk');
            while (priceparent.firstChild) {
                priceparent.removeChild(priceparent.firstChild);
            }
        }
        let i = 0;
        let loadSearchEl = document.querySelector('#stk');
        let searchInput = document.createElement('option');
        // searchInput.classList.add('stock-history-p');        
        loadSearchEl.appendChild(searchInput);
        searchInput.innerHTML = "Select...: ";
        while (i < stkHistoryArr.length) {
            let loadstock = stkHistoryArr[i]
            let loadstockEl = document.querySelector('#stk');
            let stockInput = document.createElement('option');
            stockInput.value = loadstock;
            // stockInput.classList.add('btn-hist');
            loadstockEl.appendChild(stockInput);
            stockInput.innerHTML = loadstock.toUpperCase();
            i++;
        }
    } else {
        return;
    }
};

// Save search history
let saveSearchHistory = function (stock) {
    if ("StockSearch" in localStorage) {
        let retrievedData = localStorage.getItem("StockSearch");
        stkHistoryArr = JSON.parse(retrievedData);

        let i = 0;
        while (i < stkHistoryArr.length) {
            let stockUP = stock.toUpperCase();
            let arrUP = stkHistoryArr[i].toUpperCase();
            if (stockUP === arrUP) {
                return;
            } else {
                i++;
            }
        }

        if (stkHistoryArr.length <= 6) {
            stkHistoryArr.unshift(stock);
            localStorage.setItem("StockSearch", JSON.stringify(stkHistoryArr));
        } else {
            stkHistoryArr.unshift(stock);
            stkHistoryArr.pop(stock);
            localStorage.setItem("StockSearch", JSON.stringify(stkHistoryArr));
        }
    } else {
        stkHistoryArr.push(stock);
        localStorage.setItem("StockSearch", JSON.stringify(stkHistoryArr));
    }
};

// Call history, stock fetch, stock history (JM)
getSearchHistory();
initialStock();
stockMktIndex();
finNews();

stockFormEl.addEventListener("submit", formSubmitHandler);
searchBtnEl.addEventListener("change", formSubmitHistory);
