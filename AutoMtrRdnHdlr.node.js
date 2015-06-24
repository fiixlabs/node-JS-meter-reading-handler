////////////////////INFORMATION//////////////////////////////////////////////////
//Automated Meter Reading File Handler///////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//Created By: Jake Uskoski///////////////////////////////////////////////////////
//Created On: May 5, 2015////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//Last Modified By: Jake Uskoski/////////////////////////////////////////////////
//Last Modified On: June 24, 2015////////////////////////////////////////////////
//Email: jake.uskoski@maintenanceassistant.com///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//Version Number: Node 1.4.3/////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//Maintenance Assistant//////////////////////////////////////////////////////////
//www.maintenanceassistant.com///////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


////////////////////INITIALIZATION///////////////////////////////////////////////
//Gets the necessary requirements////////////////////////////////////////////////
var maApi = require("./js/ma-cmms-client-js-2.3.2.min.js"),//////////////////////
    fs = require('fs'),//////////////////////////////////////////////////////////
    Q = require('q'),////////////////////////////////////////////////////////////
    spawn = require('child_process').spawn;//////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
if(typeof localStorage === "undefined" || localStorage === null) {///////////////
    var LocalStorage = require('node-localstorage').LocalStorage;////////////////
    localStorage = new LocalStorage('./scratch');////////////////////////////////
}////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//Clears the console & outputs a pretty title for the user///////////////////////
console.log("\033[2J\033[0f");///////////////////////////////////////////////////
opening();///////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//Begins the program/////////////////////////////////////////////////////////////
setTimeout(function() {program();}, 1000);///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


////////////////////LOCAL STORAGE FUNCTIONS//////////////////////////////////////
//Grabs the local storage, or make one if it doesn't exist///////////////////////
function fetchStorage(strName) {
    //Fetches the requested local storage
    var varValue = localStorage.getItem(strName);
    
    //Creates the local storage if it doesn't exist
    if(varValue === null) {
        varValue = localStorage.setItem(strName, "1");
        return 1;
    } else {
        //Returns the value of the requested local storage as an integer
        return parseInt(varValue);
    }
}///////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//Increments the value of the last checked file//////////////////////////////////
function storageInc(strName) {
    //Gets the requested local storage
    var intInc = fetchStorage(strName);
    //Takes the value of the requested local storage and increments it
    intInc = parseInt(intInc) + 1;
    //Checks if the number has reached an outragous value
    if(intInc > 10000) {
        //Reset the file number counter back to reset
        intInc = 1;
        //Blasts the log file
        try {
            fs.writeFileSync(Date() + "log/log.txt", "Log file has been emptied.");
            console.log("!!!\nLog file has been blasted to conserve memory.\n!!!\n");
        } catch (e) {
            if(e.code=== 'ENOENT') {
                try {
                    fs.writeFileSync("log/log.txt", localStorage.getItem("err"));
                } catch (oh) {
                    console.log("--> Failed to make the missing log.txt file.\n");
                }
            } else {
                console.log("--> Unexpected error during log blast attempt.\n");
            }
        }
    }
    //Saves the new value to the local storage
    localStorage.setItem(strName, intInc.toString());
}/////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//Logs the error data to the log.txt/////////////////////////////////////////////
function log() {
    localStorage.setItem("err", ("\n\n\n" + localStorage.getItem("err")));
    
    try {
        fs.appendFileSync("log/log.txt", localStorage.getItem("err"));
    } catch (e) {
        if(e.code=== 'ENOENT') {
            try {
                fs.writeFileSync("log/log.txt", localStorage.getItem("err"));
            } catch (oh) {
                console.log("--> Failed to make the missing log.txt file.\n");
            }
        } else {
            console.log("--> Unexpected error during log attempt.\n");
        }
    }
    localStorage.setItem("err", "");
}///////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


////////////////////FORMATTING FUNCTIONS/////////////////////////////////////////
//Formats the file name for a clean input////////////////////////////////////////
function stringFormat(objConfig) {
    //Formats the path of the file to be read for the fetchFileDB function
    var intStorage = fetchStorage("fileList");
    var strFormat = "data/" + intStorage + objConfig.FNames;

    return strFormat;
}/////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//Makes a pretty output on the console///////////////////////////////////////////
function opening() {
console.log("");
console.log("");
console.log("          .:;;;;;,");
console.log("     ,,;;;;;;;;;;;;;;;:");
console.log("   ;;;;;;;;;':`    .,;;;;,,,,,,,,,,,,,,,,,,,,,,,,,,,,,");
console.log(" .;;;;;;;,       ;;;;;;;;;;,,,,,,,,,,,,,,,,,,,,,,,,,,,,");
console.log(" ;;;;;;:       ';;;;;;;;;;;;,,,    .,,,.    .,,,,   ,,,,");
console.log(";;;;;''`          ;;;;;;;;;;,,,  ,  :,:  ,  .,,,  :  ,,,,");
console.log(":;;,      ';.        `';;;;;,,,  ,,  :  ,,  .,:  ...  :,,,");
console.log(" ;.      ;;;;;;'.        ;;:,,,  ,,,   ,,,  .:  .:::.  :,,,");
console.log("  ;;'. ;;;;;;;;;;;;       .,,,,,,,,,,,,,,,,,.,,,,,,,,,,,,,,,");
console.log("    ';;;;;;;;;;;;;;;;.  `:,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,");
console.log("      `';;;;;;;;;;;;';");
console.log("");
console.log("");
console.log("Automated Meter Reading File Handler");
console.log("maintenanceassistant.com\n");
}///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


////////////////////FILE FETCH FUNCTIONS/////////////////////////////////////////
//Gets the configuration information/////////////////////////////////////////////
function fetchConfig() {
    var arrData,
    arrConfig = new Array(13),
    intLength,
    j = 0,
    blnFlag = false,
    objConfig = new Object(),
    data;

    //Reads the config.txt file
    try {
        data = fs.readFileSync("config/config.txt", "utf8");
    } catch (e) {
        if(e.code=== 'ENOENT') {
            localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: \"config.txt\" not found.\n"));
        } else {
            localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Unexpected error.\n"));
        }
        return false;
    }

    console.log("Reading the config.txt...\n");

    //Separates by line
    arrData = data.split(/\n/);
    intLength = arrData.length;

    //Reads through each line, looking for ones beginning with a tilde ('~')
    for(var i = 0; i < intLength; i += 1) {
        if(arrData[i].charAt(0) === '~') {
            //Removes the tilde and puts the data into a temporary placeholder array
            arrData[i] = arrData[i].replace('~','');
            arrData[i] = arrData[i].replace('\r','');
            arrConfig[j] = arrData[i];

            //Checks for fatal errors and inconsistencies in the config.txt
            switch(j) {

                //API URL
                case 0:
                //Application Key
                case 1:
                //Access Key
                case 2:
                //API Secret Key
                case 3:
                //File Name
                case 10:
                    if(arrConfig[j] === '') {
                        blnFlag = true;
                        localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Issue with configuration setting " + j +
                                                     ". Empty.\n"));
                    }
                    break;

                //Meter Reading Only
                case 4:
                //Quotation Wrapping
                case 6:
                //File And Position Tracking Reset
                case 23:
                    if((parseInt(arrConfig[j]) !== 0) && (parseInt(arrConfig[j]) !== 1)) {
                        blnFlag = true;
                        localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Issue with configuration setting " + j +
                                                     ". Not a 0 or 1.\n"));
                    } else {
                        arrConfig[j] = (parseInt(arrConfig[j]) !== 0) ? true : false;
                    }
                    break;

                //Delimiter
                case 5:
                    if(arrConfig[j].search(/(\.|[0-9])/) !== -1) {
                        blnFlag = true;
                        localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Issue with configuration setting " + j +
                            ". Contains a \".\" or 0-9.\n"));
                    }
                    if(arrConfig[j] === '') {
                        arrConfig[j] = ',';
                    }
                    break;

                //Automatic Date Reading
                case 7:
                    if((parseInt(arrConfig[j]) !== 0) && (parseInt(arrConfig[j]) !== 1)) {
                        blnFlag = true;
                        localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Issue with configuration setting " + j +
                                                     ". Not a 0 or 1.\n"));
                    } else if((parseInt(arrConfig[j]) === 0) && (parseInt(arrConfig[4]) === 1)) {
                        blnFlag = true;
                        localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Issue with configuration setting " + j +
                                                     ". Required on.\n"));
                    } else {
                        arrConfig[j] = (parseInt(arrConfig[j]) !== 0) ? true : false;
                    }
                    break;

                //Set Default ID
                case 8:
                    arrConfig[j] = arrConfig[j].replace(/(,|\s+)/g, '');
                    if((isNaN(parseInt(arrConfig[j])) === true) && (parseInt(arrConfig[4]) === 0) && (arrConfig[j] !== '')) {
                        blnFlag = true;
                        localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Issue with configuration setting " + j +
                                                     ". Not a number.\n"));
                    } else if((isNaN(parseInt(arrConfig[j])) === true) && (parseInt(arrConfig[4]) === 1)) {
                        blnFlag = true;
                        localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Issue with configuration setting " + j +
                                                     ". Not a number or empty.\n"));
                    }
                    break;

                //Set Default Unit
                case 9:
                    if((arrConfig[j] === '') && (parseInt(arrConfig[4]) === 1)) {
                        blnFlag = true;
                        localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Issue with configuration setting " + j +
                                                     ". Empty.\n"));
                    }
                    break;

                //Assed ID Column Header
                case 11:
                    if((arrConfig[j] === '') && (arrConfig[4] === 0) && (arrConfig[6] === '')) {
                        blnFlag = true;
                        localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Issue with configuration setting " + j +
                                                     ". Empty.\n"));
                    }
                    break;

                //Meter Reading Value Column Header
                case 12:
                    if((arrConfig[j] === '') && (parseInt(arrConfig[4]) === 0)) {
                        blnFlag = true;
                        localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Issue with configuration setting " + j +
                                                     ". Empty.\n"));
                    }
                    break;

                //Meter Reading Value Unit Measurement Column Header
                case 13:
                    if((arrConfig[j] === '') && (arrConfig[4] === 0) && (arrConfig[7] === '')) {
                        blnFlag = true;
                        localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Issue with configuration setting " + j +
                                                     ". Empty.\n"));
                    }
                    break;

                //Date Column Header
                case 14:
                    if((arrConfig[j] === '') && (arrConfig[4] === 0) && (arrConfig[5] === 0)) {
                        blnFlag = true;
                        localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Issue with configuration setting " + j +
                                                     ". Empty.\n"));
                    }
                    break;

                //Nothing required for Work Order ID Column Header

                //Child Process Creation
                case 16:
                    console.log("Checking for child process 1...");
                    //Checks if there is a child to be created
                    if(arrConfig[j] !== "") {
			            console.log("Found a process.\nStarting child process...");
                        //Parses the string to form a child
                        var arrSplice = arrConfig[j].split(' ').splice(1);
                        var child1 = spawn(arrConfig[j].split(' ')[0], arrSplice);

                        //dereferences the child to run in parallel
                        child1.unref();

                        //Gives the child processes an output
                        child1.stdout.on('data', function(data) {
                            console.log("Child Process 1: " + data + '\n');
                        });
                        child1.stderr.on('data', function(data) {
                            console.log("\n--> Child Process 1 - Error: " + data + '\n');
                        });
                        child1.on('close', function(code) {
                            console.log("--> Child process 1 exited with code: " + code + '\n');
                        });
                    }
                    break;

                case 17:
                    console.log("Checking for child process 2...");
                    //Checks if there is a child to be created
                    if(arrConfig[j] !== "") {
			            console.log("Found a process.\nStarting child process...");
                        //Parses the string to form a child
                        var arrSplice = arrConfig[j].split(' ').splice(1);
                        var child2 = spawn(arrConfig[j].split(' ')[0], arrSplice);

                        //dereferences the child to run in parallel
                        child2.unref();

                        //Gives the child processes an output
                        child2.stdout.on('data', function(data) {
                            console.log("Child Process 2: " + data + '\n');
                        });
                        child2.stderr.on('data', function(data) {
                            console.log("\n--> Child Process 2 - Error: " + data + '\n');
                        });
                        child2.on('close', function(code) {
                            console.log("--> Child process 2 exited with code: " + code + '\n');
                        });
                    }
                    break;

                case 18:
                    console.log("Checking for child process 3...");
                    //Checks if there is a child to be created
                    if(arrConfig[j] !== "") {
			            console.log("Found a process.\nStarting child process...");
                        //Parses the string to form a child
                        var arrSplice = arrConfig[j].split(' ').splice(1);
                        var child3 = spawn(arrConfig[j].split(' ')[0], arrSplice);

                        //dereferences the child to run in parallel
                        child3.unref();

                        //Gives the child processes an output
                        child3.stdout.on('data', function(data) {
                            console.log("Child Process 3: " + data + '\n');
                        });
                        child3.stderr.on('data', function(data) {
                            console.log("\n--> Child Process 3 - Error: " + data + '\n');
                        });
                        child3.on('close', function(code) {
                            console.log("--> Child process 3 exited with code: " + code + '\n');
                        });
                    }
                    break;

                case 19:
                    console.log("Checking for child process 4...");
                    //Checks if there is a child to be created
                    if(arrConfig[j] !== "") {
			            console.log("Found a process.\nStarting child process...");
                        //Parses the string to form a child
                        var arrSplice = arrConfig[j].split(' ').splice(1);
                        var child4 = spawn(arrConfig[j].split(' ')[0], arrSplice);

                        //dereferences the child to run in parallel
                        child4.unref();

                        //Gives the child processes an output
                        child4.stdout.on('data', function(data) {
                            console.log("Child Process 4: " + data + '\n');
                        });
                        child4.stderr.on('data', function(data) {
                            console.log("\n--> Child Process 4 - Error: " + data + '\n');
                        });
                        child4.on('close', function(code) {
                            console.log("--> Child process 4 exited with code: " + code + '\n');
                        });
                    }
                    break;

                case 20:
                    console.log("Checking for child process 5...");
                    //Checks if there is a child to be created
                    if(arrConfig[j] !== "") {
			            console.log("Found a process.\nStarting child process...");
                        //Parses the string to form a child
                        var arrSplice = arrConfig[j].split(' ').splice(1);
                        var child5 = spawn(arrConfig[j].split(' ')[0], arrSplice);

                        //dereferences the child to run in parallel
                        child5.unref();

                        //Gives the child processes an output
                        child5.stdout.on('data', function(data) {
                            console.log("Child Process 5: " + data + '\n');
                        });
                        child5.stderr.on('data', function(data) {
                            console.log("\n--> Child Process 5 - Error: " + data + '\n');
                        });
                        child5.on('close', function(code) {
                            console.log("--> Child process 5 exited with code: " + code + '\n');
                        });
                    }
                    break;

                //Maximum Batch Requests Per Minute
                case 21:
                    if(isNaN(parseInt(arrConfig[j])) === true) {
                        blnFlag = true;
                        localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Issue with configuration setting " + j +
                                                     ". Empty or not a number.\n"));
                    }
                    break;

                //Time Delay Between Files
                case 22:
                    if(isNaN(parseInt(arrConfig[j])) === true) {
                        blnFlag = true;
                        localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Issue with configuration setting " + j +
                                                     ". Empty or not a number.\n"));
                    } else if(parseInt(arrConfig[j]) < 0) {
                        blnFlag = true;
                        localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Issue with configuration setting " + j +
                                                     ". Cannot enter less than zero.\n"));
                    }
                    break;
            }

            //Increments the position of the temporary placeholder array
            j += 1;
        }
    }

    //Checks that there are exactly 13 pieces of readable data in the config.txt
    if(j !== 24) {
        blnFlag = true;
        localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Issue with configuration settings. Either missing or has extra settings." +
                " Check lines beginning with \"~\".\n"));
    }

    //Checks if there's anything immediately code-breaking in the config.txt data
    if(blnFlag === false) {
        //Places the config.txt data into an object for easier handling
        //API SETUP
        objConfig.APIURL = arrConfig[0];
        objConfig.APIKey = arrConfig[1];
        objConfig.APIAcs = arrConfig[2];
        objConfig.APISrt = arrConfig[3];
        //FORMAT SETUP
        objConfig.FmtMRO = arrConfig[4];
        objConfig.FmtDlr = arrConfig[5];
        objConfig.FmtQWD = arrConfig[6];
        objConfig.FmtADR = arrConfig[7];
        objConfig.FmtDID = arrConfig[8];
        objConfig.FmtDUt = arrConfig[9];
        //FILE SETUP
        objConfig.FNames = arrConfig[10];
        objConfig.FleAID = arrConfig[11];
        objConfig.FleMRd = arrConfig[12];
        objConfig.FleMRU = arrConfig[13];
        objConfig.FleDtS = arrConfig[14];
        objConfig.FleWID = arrConfig[15];
        //BATCHING SETUP
        objConfig.MaxBtc = parseInt(arrConfig[21]);
        objConfig.FDelay = parseInt(arrConfig[22]);
        //RESET
        objConfig.Reboot = arrConfig[23];
    } else {
        //If the configuration data is improper
        return false;
    }

    return objConfig;
}///////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//Gets the information for units from the CMMS server////////////////////////////
function fetchUnitDB(maCmmsClient) {
    var def = Q.defer();

    //Fetches the Unit information from the server
    maCmmsClient.find({
        "className": "MeterReadingUnit",
        "fields": "strName, id",
        "callback": function(ret) {
            if(!ret.error) {
                def.resolve(ret.objects);
            } else {
                //Outputs a failure to the user and returns a failure to break out of the current iteration of the runnable loop
                localStorage.setItem("err", Date() + "\nSTATUS: Attempt to fetch the unit information from the server was unsuccessful.\n" + localStorage.getItem("err"));
		console.log("--> Server error.");
		console.log("--> " + ret.error.leg + "\n--> " + ret.error.message + '\n');
                def.resolve(false);
            }
        }
    });
    
    return def.promise;
}///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//Gets CSV file into Javascript//////////////////////////////////////////////////
function fetchFileDB(objUnitDB, objConfig) {
    var newData,
        objFormatted,
        intLength,
        intDBLength,
        posID,
        posValue,
        posUnit,
        posDate,
        posWorkID,
        strDlr,
        tempArr,
        blnFlag = false,
        data;
    
    //Fetch the current file to be read
    try {
        data = fs.readFileSync(stringFormat(objConfig), "utf8");
    } catch (e) {
        if(e.code !== 'ENOENT') {
            localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Unexpected error\n"));
            localStorage.setItem("err", Date() + "\nSTATUS: Failed to obtain or format the CSV file data.\n" + localStorage.getItem("err"));
            log();
        }
        return false;
    }

    //Checks if the config.txt dictates "Meter Reading Only" or not
    if(objConfig.FmtMRO === false) {
        //Separates the file into an array of items
        data = data.replace(/\r/g, "\n");
        data = data.replace(/\n\n/g, "\n");
        data = data.split("\n");

        //Splits the first line of the file, the header row, into single entries
            //Taking into consideration Quotation Wrapping ("data","data")
            if(objConfig.FmtQWD === true) {
                strDlr = "\"" + objConfig.FmtDlr + "\"";
                newData = data[0].split(strDlr);
                newData[0] = newData[0].replace(/"/, '');
                newData[newData.length - 1] = newData[newData.length - 1].replace(/"/, '');
            } else {
                newData = data[0].split(objConfig.FmtDlr);
            }

            intLength = newData.length;

        //Finds the columns to be read from the file data based on the config.txt settings
        for(var i = 0; i < intLength; i += 1) {
            if((newData[i] === objConfig.FleAID) && (objConfig.FmtDID === 0)) {posID = i; }
            if(newData[i] === objConfig.FleMRd) {posValue = i;}
            if((newData[i] === objConfig.FleMRU) && (objConfig.FmtDUt === '')) {posUnit = i;}
            if((newData[i] === objConfig.FleDtS) && (objConfig.FmtADR === 0)) {posDate = i;}
            if((newData[i] === objConfig.FleWID) && (objConfig.FleWID !== '')) {posWorkID = i;}
        }

        //Checks for any missing headers, and reports them to the user
        if(
            ((posID === undefined) && (objConfig.FmtDID === 0)) ||
		(posValue === undefined) ||
		((posUnit === undefined) && (objConfig.FmtDUt === '')) ||
		((posDate === undefined) && (objConfig.FmtADR === 0))
        ){
            localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: File did not contain one or more of the required headings:\n"));
            if((posID === undefined) && (objConfig.FmtDID === 0)) {
                localStorage.setItem("err", (localStorage.getItem("err") + "  ~" + objConfig.FleAID + "\n"));
            }
            if(posValue === undefined) {
                localStorage.setItem("err", (localStorage.getItem("err") + "  ~" + objConfig.FleMRd + "\n"));
            }
            if((posUnit === undefined) && (objConfig.FmtDUt === '')) {
                localStorage.setItem("err", (localStorage.getItem("err") + "  ~" + objConfig.FleMRU + "\n"));
            }
            if((posDate === undefined) && (objConfig.FmtADR === 0)) {
                localStorage.setItem("err", (localStorage.getItem("err") + "  ~" + objConfig.FleDtS + "\n"));
            }
            if((posWorkID === undefined) && (objConfig.FleWID !== "")) {
                localStorage.setItem("err", (localStorage.getItem("err") + "  ~" + objConfig.FleWID + "\n"));
            }
            localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Please either fix the file headings, or change the configuration files.\n"));
            localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Changing the configuration files will require restarting the program after.\n"));
            localStorage.setItem("err", Date() + "\nSTATUS: Failed to obtain or format the CSV file data.\n" + localStorage.getItem("err"));
            log();

            //Jumps out of the function before formatting and skips the batch recursion, reaching the cycleEnd function to wait for the next runnable loop iteration
            return false;
        }

        //Prepares for the loop of inserting data to the array
        intLength = data.length;
        objFormatted = new Array(intLength-1);

        //Takes all of the data from the file and places it into an array of objects
        for(var i = 1; i < intLength; i += 1) {
            tempArr =  (objConfig.FmtQWD === true) ? data[i].split(strDlr) : data[i].split(objConfig.FmtDlr);
            tempArr[0] = tempArr[0].replace(/"/, '');
            tempArr[tempArr.length - 1] = tempArr[tempArr.length - 1].replace(/"/, '');

            //Builds the object
            objFormatted[i-1] = new Object();
            objFormatted[i-1].intAssetID = (objConfig.FmtDID === '') ? tempArr[posID] : objConfig.FmtDID;
            objFormatted[i-1].dblMeterReading = tempArr[posValue];
            objFormatted[i-1].intMeterReadingUnitsID = (objConfig.FmtDUt === '') ? tempArr[posUnit] : objConfig.FmtDUt;
            objFormatted[i-1].dtmDateSubmitted = (objConfig.FmtADR === false) ? Date.parse(tempArr[posDate]) : Date.parse(Date());
            if((posWorkID !== undefined) && (tempArr[posWorkID] !== '')) {
                objFormatted[i-1].intWorkOrderID = tempArr[posWorkID];
            }
        }

    //"Meter Reading Only" data Pull
    } else {
        //Convert the file into an array
        data = data.replace(/\r/g, "\n");
        data = data.replace(/\n\n/g, "\n");
        data = data.split("\n");

        intLength = data.length;
        objFormatted = new Array(intLength); 

        for(var i = 0; i < intLength; i += 1) {
            //Check the line to make sure it's a meter reading
            if((isNaN(data[i]) === true) || (isNaN(parseFloat(data[i])) === true)) {
                blnFlag = true;
                localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Error with item " +
                                             (i + 1) + " - \"" + data[i] + "\" is not a number, or empty\n"));
            }

            //Set up the object
            objFormatted[i] = new Object();
            objFormatted[i].intAssetID = objConfig.FmtDID;
            objFormatted[i].dblMeterReading = data[i];
            objFormatted[i].intMeterReadingUnitsID = objConfig.FmtDUt;
            objFormatted[i].dtmDateSubmitted =  Date.parse(Date());
        }
    }

    if(blnFlag === true) {
        localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: File " + stringFormat(objConfig) + " will be reattempted in "
				     + objConfig.FDelay + " minutes.\r" + "STATUS DETAILS: Please fix the file data before the next file read attempt\n"));
        localStorage.setItem("err", Date() + "\nSTATUS: Failed to obtain or format the CSV file data.\n" + localStorage.getItem("err"));
        log();

        //Jumps out of the function before formatting and skips the batch recursion, reaching the cycleEnd function to wait for the next runnable loop iteration
        return false;
    }

    //Prepares for the next loop
    intLength = objFormatted.length;
    intDBLength = objUnitDB.length;

    //Sets all of the unit data to server item IDs, so that they can be properly batched
    for(var i = 0; i < intLength; i += 1) {
        //Resets the flag for the next item
        blnFlag = false;

        //Checks the current item against all unit data to find a match, and replaces the string with an ID integer if a match is found
        for(var j = 0; j < intDBLength; j += 1) {
            if(objFormatted[i].intMeterReadingUnitsID.toUpperCase() === objUnitDB[j].strName.toUpperCase()) {
                objFormatted[i].intMeterReadingUnitsID = objUnitDB[j].id;
                blnFlag = true;
            }
            //Breaks out of the loop for the current item if it has already been assigned an ID, for saving time
            if(blnFlag === true) {break;}
        }

        //Checks if the current item being formatted did not have a match with the server's unit data
        if(blnFlag === false) {
            localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Error with row " + (i + 2) + "'s unit data - \"" +
                objFormatted[i].intMeterReadingUnitsID + "\" is not registered in the database\n" +
		"STATUS DETAILS: File " + stringFormat(objConfig) + " will be reattempted in " + objConfig.FDelay + " minutes.\n" +
		"STATUS DETAILS: Please either fix the file data or add the missing unit to the CMMS before the next file read attempt.\n"));
            localStorage.setItem("err", Date() + "\nSTATUS: Failed to obtain or format the CSV file data.\n" + localStorage.getItem("err"));
            log();

            //Ends the function and forces the program to jump to the beginning of the next runnable loop iteration
            return false;
        }
    }

    return objFormatted;

}///////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


////////////////////BATCH FUNCTIONS///////////////////////////////////////////////
//Pings the server to check for a correct API setup///////////////////////////////
function ping(maCmmsClient) {
    var def = Q.defer();

    //Pings the server, checking for a connection
    maCmmsClient.rpc({
        "name": "Ping",
        "callback": function(ret) {
            //Returns a success or failure
            if (!ret.error) {
                console.log("Ping successful.\n");
                def.resolve(true);
            } else {
                def.resolve(false);
            }
        }
    });

    return def.promise;
}///////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//Uses the formatted data to create an array for batching/////////////////////////
function prepBatch(maCmmsClient, objFormatted, objConfig) {
    var intLength = objFormatted.length,
    arrBatchDB,
    arrPushDB,
    intPosition = 0,
    intCount = 0,
    k,
    holder;

    //Prepares the arrays to the lengths of the file data and total amount of batches
    arrBatchDB = new Array(intLength);
    arrPushDB = new Array(Math.ceil(intLength/objConfig.MaxBtc));

    //Prepares all of the individual rows of data
    for(var i = 0; i < intLength; i += 1) {
        arrBatchDB[i] = {
            "className": "MeterReading",
            "object": objFormatted[i],
            "fields": "id, intAssetID, dblMeterReading, dv_intMeterReadingUnitsID"
        };
    }

    //Groups the rows into batch requests, preparing them to be sent later
    for(var j = 0; (j * objConfig.MaxBtc) < intLength; j += 1) {
        
        //Creates an array of proper length based on the remaining number of items
        if ((intLength - intCount) < objConfig.MaxBtc) {
            //Sets up for the remainder of the items (less than a full batch)
            arrPushDB[j] = new Array(intLength - intCount);
        } else {
            //Sets up for a full batch (there's at least the maximum batch size of items available)
            arrPushDB[j] = new Array(objConfig.MaxBtc);
        }
    
        //Prepares to package the next batch from where the previous left off
        k = 0;
        holder = intPosition + objConfig.MaxBtc;
    
        //Creates a batch request
        for(var i = intPosition; ((i < holder) && (i < intLength)); i += 1) {
            arrPushDB[j][k] = maCmmsClient.prepareAdd(arrBatchDB[i]);
            intPosition += 1;
            k += 1;
        }

        //Tracks the position of the batches within the file
        intCount += objConfig.MaxBtc;
    }

    return arrPushDB;
}/////////////////
//////////////////////////////////////////////////////////////////////////////////
//Recursive batching function, pushes a batch to the server once a minute/////////
function pushBatch(maCmmsClient, objConfig, arrToPush, j, intError) {
    var objPush,
    intLength = arrToPush.length;

    //Prepares the request to get sent to the CMMS
    objPush = {
        "requests": arrToPush[j],
        "callback": function(ret) {
            if(!ret.error) {
                //Moves to the next batch waiting to be sent to the server
                j += 1;

                //Checks for the end of the pre-prepared batches
                if(j !== intLength) {
                    //Increments the position within the file in case of failure
                    storageInc("filePosition");

                    setTimeout(function(){pushBatch(maCmmsClient, objConfig, arrToPush, j, 0);}, 61*1000);   //Delay a minute before recursion, clearing the error count
                } else {
                    //Stops calling the pushBatch recursion

                    //Deletes the last read file (for the sake of saving memory)
                    var temp = "data/" + localStorage.getItem("fileList") + objConfig.FNames;
                    var child = spawn("rm", [temp]);

                    //Outputs to the console
                    console.log(Date() + "\nFile " + stringFormat(objConfig) + " was successfully completed.\n");

                    //Outputs to the log file
                    try {
                        fs.appendFileSync("log/log.txt", (Date() + "\nFile " + stringFormat(objConfig) + " was successfully completed\n"));
                    } catch (e) {
                        if(e.code=== 'ENOENT') {
                            try {
                                fs.writeFileSync("log/log.txt", localStorage.getItem("err"));
                            } catch (oh) {
                                console.log("--> Failed to make the missing log.txt file.\n");
                            }
                        } else {
                            console.log("--> Unexpected error during log attempt.\n");
                        }
                    }
                    
                    //Increments the value of which file is to be read & resets the position in the file for the next one
                    storageInc("fileList");
                    localStorage.setItem("filePosition", "0");

                    //Moves back into the Runnable loop
                    endCycle(maCmmsClient, objConfig, false);
                }
            } else {
                //Reduces the amount of remaining errors for the current batch
                intError += 1;
                console.log("--> " + ret.error.leg + "\n--> " + ret.error.message + '\n');

                //Checks if the current batch has no remaining errors
                if(intError !== 10) {
                    //Continues attempting, going back into recursion on the same batch
                    setTimeout(function(){pushBatch(maCmmsClient, objConfig, arrToPush, j, intError);}, 61*1000); //Reattempt the batch after a minute
                } else {
                    //Outputs to the console
                    console.log(Date() + "\n--> File " + stringFormat(objConfig) + " was not successfully completed.\n");

                    //Outputs to the log file
                    try {
                        fs.appendFileSync("log/log.txt", (Date() + "\nFile " + stringFormat(objConfig) + " was not successfully completed\n"));
                    } catch (e) {
                        if(e.code=== 'ENOENT') {
                            try {
                                fs.writeFileSync("log/log.txt", localStorage.getItem("err"));
                            } catch (oh) {
                                console.log("--> Failed to make the missing log.txt file.\n");
                            }
                        } else {
                            console.log("--> Unexpected error during log attempt.\n");
                        }
                    }
                    //Stops calling the pushBatch recursion, exiting out of the batch recursion and returning to the runnable recursion
                    endCycle(maCmmsClient, objConfig, false);
                }
            }
        }
    }

    //sends the batch request. This is the real magic
    maCmmsClient.batch(objPush);
}///////
//////////////////////////////////////////////////////////////////////////////////


////////////////////EXECUTION FUNCTIONS///////////////////////////////////////////
//Program Function, gets the configuration file data and begins the program///////
function program() {
    var objConfig,
    maCmmsClient,
    retPing;

    //Clears the error report
    localStorage.setItem("err", "");

    //gets the config.txt data
    objConfig = fetchConfig();

    if(objConfig !== false) {
        //API Connection Setup
        maCmmsClient = new maApi();
        maCmmsClient.setBaseUri(objConfig.APIURL);
        maCmmsClient.setAppKey(objConfig.APIKey);
        maCmmsClient.setAuthToken(objConfig.APIAcs);
        maCmmsClient.setPKey(objConfig.APISrt);

        //Pings the server to check if the API was properly set up
        retPing = ping(maCmmsClient);
        retPing.then(function(prmPing) {
            if(prmPing !== false) {
                //Resets the position tracking if required by the config.txt
                if(objConfig.Reboot !== false) {
                    localStorage.setItem("fileList","1");
                    localStorage.setItem("filePosition","0");
                }

                //Begins running the program
                runnable(maCmmsClient, objConfig, false);
            } else {
                //Outputs failure for user
                localStorage.setItem("err", Date() + "\nSTATUS: Unable to proceed. CMMS could not be called.\n" + localStorage.getItem("err"));
                localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Either unable to connect to the internet or the API is not properly set up.\n"));
                localStorage.setItem("err", (localStorage.getItem("err") + "API Setup requirements in config.txt may be improper.\n"));
                log();
            }
        }).catch(function() {
            //In case of a failed promise
            localStorage.setItem("err", Date() + "\nSTATUS: Unable to proceed. CMMS could not be called.\n" + localStorage.getItem("err"));
            localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Ending program.\n"));
            log();
        });
    } else {
        //Outputs for the user
        localStorage.setItem("err", Date() + "\nSTATUS: Failed to fetch config.txt file.\n" + localStorage.getItem("err"));
        localStorage.setItem("err", (localStorage.getItem("err") + "STATUS DETAILS: Ending program.\n"));
        log();
    }
}////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//Control Function, runs the program//////////////////////////////////////////////
function runnable(maCmmsClient, objConfig, waiting) {
    var objUnitDB,
    objFormattedDB,
    arrPush;

    //Gets the server's IDs for the different measurements
    objUnitDB = fetchUnitDB(maCmmsClient);
    objUnitDB.then(function(prmDB) {
        
        //If the unit IDs were successfully obtained, continues
        if(prmDB !== false) {

            //Finds and formats the designated file
            objFormattedDB = fetchFileDB(prmDB, objConfig);
                
            //If there is a valid file, continues
            if(objFormattedDB !== false) {

                waiting = false;

                //Prepares to begin batching
                arrPush = prepBatch(maCmmsClient, objFormattedDB, objConfig);

                try {
                    fs.appendFileSync("log/log.txt", "\n\n\n" + Date() + "\nAttempting to push the file...\n");
                    console.log(Date() + "\nAttempting to push the file...");
                } catch (e) {
                    if(e.code=== 'ENOENT') {
                        try {
                            fs.writeFileSync("log/log.txt", localStorage.getItem("err"));
                        } catch (oh) {
                            console.log("--> Failed to make the missing log.txt file.\n");
                        }
                    } else {
                        console.log("--> Unexpected error during log attempt.\n");
                    }
                }

                //Recursive batch call basedon the file read and the last known position of the file, if it failed earlier
                pushBatch(maCmmsClient, objConfig, arrPush, fetchStorage("filePosition"), 0);
            } else {
                //Outputs for the user, and prepares for the next iteration of the runnable loop
                //localStorage.setItem("err", Date() + "\nSTATUS: Failed to obtain or format the CSV file data.\n" + localStorage.getItem("err"));
                //log();
                console.log("Waiting for a file: " + stringFormat(objConfig));
		waiting = true;
                endCycle(maCmmsClient, objConfig, waiting);
            }

        } else {
            endCycle(maCmmsClient, objConfig, waiting);
        }
    }).catch(function() {
        //In case of a failed promise
        localStorage.setItem("err", Date() + "\nSTATUS: Attempt to fetch the unit information from the server was unsuccessful.\n" + localStorage.getItem("err"));
        log();
	console.log("--> Promise fail.\n");

        endCycle(maCmmsClient, objConfig, waiting);
    });
}///////////////////////
//////////////////////////////////////////////////////////////////////////////////
//Cleanup Code////////////////////////////////////////////////////////////////////
function endCycle(maCmmsClient, objConfig, waiting) {
    //Creates a loop back into the runnable
    setTimeout(function() {runnable(maCmmsClient, objConfig, waiting);}, objConfig.FDelay*60*1000 + 5000);
}///////////////////////
//////////////////////////////////////////////////////////////////////////////////