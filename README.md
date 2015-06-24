MA Labs Node JS Meter Reading File Handler v1.4
-----------------------------------------------
- - -

TABLE OF CONTENTS
-----------------

1. [Authors & Contributors][head0100]  
2. [Introduction][head0200]  
3. [Requirements][head0300]  
4. [Installation][head0400]  
5. [Setup][head0500]  
6. [Configuration][head0600]  
  6.1 [API Setup][head0601]  
  6.2 [Format Setup][head0602]  
  6.3 [File Setup][head0603]  
  6.4 [External Scripts][head0604]  
  6.5 [Batch Setup][head0605]  
  6.6 [Reset][head0606]  
7. [Running][head0700]  
8. [Troubleshooting][head0800]  
  8.1 [API Connecting][head0801]  
  8.2 [Adding Units][head0802]  
9. [Licensing][head0900]  
10. [Examples][head1000]  
  10.1 [1data.csv][head1001]  
  10.2 [2data.csv][head1002]  
  10.3 [3data.csv][head1003]  
  10.4 [4data.csv][head1004]  
  10.5 [5data.csv][head1005]  
  10.6 [6data.csv][head1006]  
  10.7 [7data.csv][head1007]  
  10.8 [8data.csv][head1008]  
  10.9 [config.txt][head1009]  
  10.10 [allSensors.py][head1010]  
  10.11 [photocell.py][head1011]  
  10.12 [temperature.py][head1012]  
  10.13 [potential.py][head1013]  
11. [Change Log][head1100]  
  [v1.4.3][v143]  
  [v1.4.2][v142]  
  [v1.4.1][v141]  
  [v1.4.0][v140]  
  [v1.2.0][v120]  


<br>

1 AUTHORS &amp; CONTRIBUTORS
----------------------------

v1.2.0 Created May 12,  2015 by Jake Uskoski  
v1.4.0 Created June 4,  2015 by Jake Uskoski  
v1.4.1 Created June 8,  2015 by Jake Uskoski  
v1.4.2 Created June 11, 2015 by Jake Uskoski  
v1.4.3 Created June 24, 2015 by Jake Uskoski  

[Back to Top][BackToTop]
<br>

2 INTRODUCTION
--------------

The MA Labs Node JS Automated Meter Reading File Handler is a program which
takes CSV files from its designated folder, formats the necessary information,
and sends the data to the Maintenance Assistant CMMS, through the use of the
Maintenance Assistant JavaScript API. The program runs in the console through
the use of Node JavaScript.

Before attempting to run the program, please be sure to extract all of the files
from the ZIP package. The program cannot be run from the ZIP. The "README.txt"
file is a stripped version of this README, lacking any markdown code for the
sake of making it more readable as plain text.

There is no "step-by-step-beginner-guide.txt" for this package. All necessary
information is included in this README.

[Back to Top][BackToTop]
<br>

3 REQUIREMENTS
--------------

1. Node JS  
  * See Installation section  
 2. Additional node packages  
  * See Installation section  
3. A stable internet connection  
4. Python 2.7.4  
  * Only required if using the example programs or programming in python  
    * Comes installed on the Raspberry Pi's Raspbian operating system  

[Back to Top][BackToTop]
<br>

4 INSTALLATION
--------------

The Node JS version of the Automated Meter Reading File Handler requires node
JS, as well as the Q and node-localstorage modules. All instructions in this
README are using the command line.

Installing node JS depends on the computer. There are many different ways
available online, including the main download page of the Node JS website,

&nbsp;&nbsp;&nbsp;[https://nodejs.org/download/][nodejs]  

Otherwise, from a Raspberry Pi, running the following code from the command line
will install Node JS:

    sudo apt-get install node  

Next, make sure npm is at the latest version, by running the following command
from the command line:

    sudo npm install npm -g  

Next, find and enter the directory where the Automated Meter Reading File
Handler is saved, and use the following commands:

    npm install node-localstorage  
    npm install q  

Once done, the program is ready to be prepared for running. See "SETUP" for more
details.

[Back to Top][BackToTop]
<br>

5 SETUP
-------

Within the program folder where the runnable.html file is located, there is a
folder named "data" which is used for placing CSV files in. The files must be
named using the following format:

&nbsp;&nbsp;&nbsp;&#60;number\>&#60;name\>.csv  

The &#60;name\> must be the same for every file, and the numbers must increment
naturally, beginning at 1. For example:

&nbsp;&nbsp;&nbsp;1data.csv  
&nbsp;&nbsp;&nbsp;2data.csv  
&nbsp;&nbsp;&nbsp;3data.csv  
&nbsp;&nbsp;&nbsp;...  
&nbsp;&nbsp;&nbsp;15data.csv  

The default configuration setting uses "data.csv" as the filename, but can
be configured. The configuration file must be prepared before the first run, or
else the program will fail to function. See "CONFIGURATION" for more details.

[Back to Top][BackToTop]
<br>

6 CONFIGURATION
---------------

The configuration file, located in the "config" folder and named "config.txt",
has four categories:

1. [API Setup][head0601] 
2. [Format Setup][head0602]  
3. [File Setup][head0603]  
4. [External Scripts][head0604]  
5. [Batch Setup][head0605]  
6. [Reset][head0606]  

All lines that take output to the program are preceded by a tilde ("~").
Removing the tilde from before a line will stop it from being read by the
program, and adding additional tildes to the beginning of lines will cause
errors which will prevent the program from reading the config.txt file. To
prevent any errors from occurring within the configuration, avoid using, adding,
and deleting tildes.

For example files using the various optional unrequired settings, see section
11.

[Back to Top][BackToTop]

### 6.1 API SETUP ###

The API setup has four requirements:

&nbsp;&nbsp;&nbsp;0:  API URL                                                            - \[REQUIRED]  
&nbsp;&nbsp;&nbsp;1:  Application Key                                                    - \[REQUIRED]  
&nbsp;&nbsp;&nbsp;2:  Access Key                                                         - \[REQUIRED]  
&nbsp;&nbsp;&nbsp;3:  API Secret Key                                                     - \[REQUIRED]  

To learn about getting your API keys, go to the web page:

&nbsp;&nbsp;&nbsp;[https://www.maintenanceassistant.com/api/docs/guide.html][maAPIdoc]

and see the section "Getting your API Access Keys".

[Back to Top][BackToTop]

### 6.2 FORMAT SETUP ###

The Format setup has two requirements and three optional values:

&nbsp;&nbsp;&nbsp;4:  [Meter Reading Only][6204]                                         - \[REQUIRED] \[TOGGLE]  
&nbsp;&nbsp;&nbsp;5:  [Delimiter][6205]                                                  - \[NOT REQUIRED]  
&nbsp;&nbsp;&nbsp;6:  [Quotation Wrapped Data][6206]                                     - \[REQUIRED] \[TOGGLE]  
&nbsp;&nbsp;&nbsp;7:  [Automatic Date Reading][6207]                                     - \[REQUIRED] \[TOGGLE]  
&nbsp;&nbsp;&nbsp;8:  [Set Default ID][6208]                                             - \[NOT REQUIRED]  
&nbsp;&nbsp;&nbsp;9:  [Set Default Unit][6209]                                           - \[NOT REQUIRED]  

[Back to Top][BackToTop]

#### 4: Meter Reading Only ####

This setting is for cases where the files being placed in the "data" folder only
contain a single column (or single string) of meter reading data, and nothing
else.

[Back to Top][BackToTop]

#### 5: Delimiter ####

The Delimiter setting, when left blank, defaults to using the comma (","), the
basic delimiter of CSV files. If the CSV files being placed in the "data" folder
have a different delimiter than the comma, then it may be entered into this
setting.

An example would be using the vertical bar ("|") or ampersand ("&amp;") instead of
the comma as the delimiter for the CSV files.

&nbsp;&nbsp;&nbsp;id,Meter Reading,Unit,Date  
&nbsp;&nbsp;&nbsp;id|Meter Reading|Unit|Date  
&nbsp;&nbsp;&nbsp;id&amp;Meter Reading&amp;Unit&amp;Date  

**NOTE:**
The delimiter can be any length, not just one character, but it must remain
identical throughout the file, and must be the same for all files in the "data"
folder. Using different delimiters will result in the data not being separated
properly, leading to improper amounts of batches and continuously failing
attempts to send data to the CMMS.

[Back to Top][BackToTop]

#### 6: Quotation Wrapped Data ####

The Quotation Wrapped Data setting is for if the program used to generate CSV
files wraps all data in quotations. This is common for CSV files, and allows for
use of the delimiter within the CSV data, in cases such as notes or description
columns, without ruining the parsing of the data.

In the following example, the headings "Meter, Reading" and "Meter, Unit" would
be left alone.

&nbsp;&nbsp;&nbsp;"id","Meter, Reading","Meter, Unit","Date"  

Without the quotation wrapping, such as the following example, the headings
would be separated into "id", "Meter", " Reading", "Meter", " Unit", "Date".

&nbsp;&nbsp;&nbsp;id,Meter, Reading,Meter, Unit,Date  

[Back to Top][BackToTop]

#### 7: Automatic Date Reading ####

The Automatic Date Reading setting causes the program to override the Date
Column Header setting \[13] in the File Setup section, instead using the time
the item was read from the file by the program. If the Meter Reading Only
setting \[4] is toggled on, then the Automatic Date Reading setting is
required to be on as well, but the Automatic Date Reading setting can also be
toggled on without the Meter Reading Only setting.

[Back to Top][BackToTop]

#### 8: Set Default ID ####

Similar to the Automatic Date Reading setting \[6], the Set Default ID
setting will override the Asset ID Column Header setting \[10] and attach
whatever ID that has been entered in the Set Default ID setting to each meter
reading, regardless of any IDs in the file.

Like the Automatic Date Reading setting \[6], the Set Default ID setting is
required when the Meter Reading Only setting \[4] is toggled on.

[Back to Top][BackToTop]

#### 9: Set Default Unit ####

Similar to the Set Default ID setting \[7], the Set Default Unit setting will
override the Meter Reading Value Unit Measurement Column Header setting \[12]
and attach whatever unit that has been entered in the Set Default Unit setting
to each meter reading, regardless of any units in the file.

[Back to Top][BackToTop]

### 6.3 FILE SETUP ###

The file setup has five requirements and an optional value:

&nbsp;&nbsp;&nbsp;10: [File Name][6310]                                                  - \[REQUIRED]  
&nbsp;&nbsp;&nbsp;11: [Asset ID Column Header][6311]                                     - \[REQUIRED]  
&nbsp;&nbsp;&nbsp;12: [Meter Reading Value Column Header][6312]                          - \[REQUIRED]  
&nbsp;&nbsp;&nbsp;13: [Meter Reading Value Unit Measurement Column Header][6313]         - \[REQUIRED]  
&nbsp;&nbsp;&nbsp;14: [Date Column Header][6314]                                         - \[REQUIRED]  
&nbsp;&nbsp;&nbsp;15: [Work Order ID Column Header][6315]                                - \[NOT REQUIRED]  

[Back to Top][BackToTop]

#### 10: File Name ####

File Name refers to the names given to all of the
files in the "data" folder. The name must include the ".csv" and cannot include
any numbers. Leaving the File Name empty ("~") results in a fatal error.

**IMPORTANT:**  
Once the program reads the 10000th file ("10000&#60;filename\>.csv"), it begins
looking for 1&#60;filename\>.csv again. This is so that the file numbering never
reaches a point where the value is beyond the scope of a number in javascript,
or a number (int, float, double, etc.) in any other programming language.

Whenever a file is finished being successfully read by the program, it is
deleted to conserve memory space, therefore external scripts can also loop their
naming to return to "1&#60;filename\>" after "10000&#60;filename\>.csv".

[Back to Top][BackToTop]

#### 11: Asset ID Column Header ####

The Asset ID Column Header setting is for the header which appears in all files,
for the column containing the data for the Asset IDs related to the meter
readings. The header name must be the same across all files in the "data"
folder, or else the program will throw an error and wait until the file is
altered before proceeding. The configuration file can also be altered to
compensate, but any changes made to the configuration file requires the program
to be closed and reopened to take affect.

Asset ID is different from Asset Code. To view the ID of assets, take the
following steps:

1. Log into the CMMS (if not already logged in).  
2. Select Assets from the menu on the left.  
3. Click on the "Set Visible Columns" button.  
  * On a desktop, the button is a small image of a list made of squares and
    rectangles, located to the far right of the page, above the list of assets.  
4. Check the box labelled "id".  
5. Click the "OK" button.  
6. The ID value of the assets should appear as a new column in the list.  

If the Meter Reading Only setting \[4] is toggled on, or the Set Default ID
setting \[7] is not empty, then the Asset ID Column Header setting will be
ignored, under the assumption that there are no headers in the files, and only
one column or string of data for meter readings, or the assumption that the
configured default is the correct value.

[Back to Top][BackToTop]

#### 12: Meter Reading Value Column Header ####

Similar to the Asset ID Column Header setting \[10], the Meter Reading Value
Column Header setting is for the header which appears in all files, for the
column containing the data for the meter reading data. The meter readings should
be purely numerical, with the unit separated and in a different column.

If the Meter Reading Only setting \[4] is toggled on, then the Meter Reading
Value Column Header setting will be ignored, under the assumption that there are
no headers in the files, and only one column or string of data for meter
readings.

[Back to Top][BackToTop]

#### 13: Meter Reading Value Unit Measurement Column Header ####

Similar to the Asset ID Column Header setting \[10], the Meter Reading Value
Unit Measurement Column Header setting is for the header which appears in all
files, for the column containing the data for the unit of the meter reading
data.

If the Meter Reading Only setting \[4] is toggled on, or the Set Default Unit
setting \[8] is not empty, then the Meter Reading Value Unit Measurement
Column Header setting will be ignored, under the assumption that there are no
headers in the files, and only one column or string of data for meter readings,
or the assumption that the configured default is the correct value.

[Back to Top][BackToTop]

####14: Date Column Header ####

Similar to the Asset ID Column Header setting \[10], the Date Column Header
setting is for the header which appears in all files, for the column containing
the dates that the meter reading data was taken at.

For best results, the date data in the CSV files should be using RFC2822 format
or ISO 8601 Date format. Any other format may result in unexpected values, and
therefore should be avoided.

&nbsp;&nbsp;&nbsp;For RFC2822 Format, see [https://tools.ietf.org/html/rfc2822#page-14][RFC2822]  
&nbsp;&nbsp;&nbsp;For ISO 8601 Format, see [https://www.w3.org/TR/NOTE-datetime-970915.html][ISO8601]  

If the Meter Reading Only setting \[4] is toggled on, or the Automatic Date
Reading setting \[6] is toggled on, then the Date Column Header setting will
be ignored, under the assumption that there are no headers in the files, and only
one column or string of data for meter readings, or the assumption that the
configured default is the correct value. 

[Back to Top][BackToTop]

#### 15: Work Order ID Column Header ####

Similar to the Asset ID Column Header setting \[10], the Work Order ID Column
Header setting is for the header which appears in all files, for the column
containing the IDs of the work orders the meter reading data is related to. If
a row is missing a work order ID, but the header is in the file, the meter
reading will be treated as though it has no related work order.

If the Meter Reading Only setting \[4] is toggled on, then the Work Order ID
Column Header setting will be ignored, under the assumption that there are no
headers in the files, and only one column or string of data for meter readings.

[Back to Top][BackToTop]

### 6.4 EXTERNAL SCRIPTS ###

The external scripts has five open slots:

&nbsp;&nbsp;&nbsp;16: Child Process 1                                                    - \[NOT REQUIRED]  
&nbsp;&nbsp;&nbsp;17: Child Process 2                                                    - \[NOT REQUIRED]  
&nbsp;&nbsp;&nbsp;18: Child Process 3                                                    - \[NOT REQUIRED]  
&nbsp;&nbsp;&nbsp;19: Child Process 4                                                    - \[NOT REQUIRED]  
&nbsp;&nbsp;&nbsp;20: Child Process 5                                                    - \[NOT REQUIRED]  

The child processes are commands which will be run at the start of the program,
and will end when the program ends. The commands are called through the command
line, and if they are meant to run permanentlyin a loop, they should be
structured to do so on their own. Once called, the program will never interact
with the child processes again until closing.

For example usage of the child processes, see the example "config.txt" file in
the "EXconfig" folder (within the examples folder).

[Back to Top][BackToTop]

### 6.5 BATCH SETUP ###

The batch setup has two requirements:

&nbsp;&nbsp;&nbsp;21: [Maximum Batch Requests Per Minute][6521]                          - \[REQUIRED]  
&nbsp;&nbsp;&nbsp;22: [Time Delay Between Files][6522]                                   - \[REQUIRED]  

[Back to Top][BackToTop]

#### 21: Maximum Batch Requests Per Minute ####

The maximum batch requests per minute value keeps the server from throttling the
program, and varies depending on the size of the company using the CMMS. If the
program repeatedly fails to send batch requests, and there is a stable internet
connection, it is because the maximum batch requests per minute is set too high.
Each batch request is a single meter reading, so an MBR/min of 200 means that
the program will attempt to send up to two hundred meter readings from the CSV
file currently being read to the CMMS. Due to the nature of the program, all two
hundred will be sent at once, and then a minute delay will begin after the
server responds, to prevent throttling.

[Back to Top][BackToTop]

#### 22: Time Delay Between Files ####

The time delay between files is meant to force the program to wait before moving
to the next file, or continuing the current file if closed or failed before
finishing previously, so that a user is capable of making any changes to the CSV
files in the "data" folder, altering unit data in the CMMS, or adding more files
for the program to read, before the next check. It also gives time for any
internet instability to resolve before re attempting to send files to the CMMS.
The value is in minutes, and the default setting is half an hour.

[Back to Top][BackToTop]

### 6.6 RESET ###

The reset setup has one requirement:

&nbsp;&nbsp;&nbsp;23: Reset The File And Position Tracking                               - \[REQUIRED] \[TOGGLE]

The reset option, which is either 0 or 1, is meant for resetting the position of
the program's tracking. The program automatically saves how many files it has
read, and how much of the current file it has sent to the CMMS. Changing the
value to from 0 to 1 will cause the next time the program is opened to reset the
position, and leaving the option at 1 will cause the position to reset every
time the program is opened until the value is changed back to 0.

If the tracking is reset, but the files in the "data" folder have not changed,
the program will begin at the first file and begin sending all of the data that
has already been read. This will create duplicates of data on the CMMS, which
should be avoided. Position tracking should only be reset if the files in the
"data" folder are being removed from the folder and new files beginning at "1"
are being placed in the "data" folder.

[Back to Top][BackToTop]
<br>

7 RUNNING
---------

Once the configuration file is prepared, and any external scripts are in place,
enter the directory containing the "AutoMtrRdnHdlr.node.js" file and run it from
the command line, through node:

    node AutoMtrRdnHdlr.node.js

[Back to Top][BackToTop]
<br>

8 TROUBLESHOOTING
-----------------

Most errors are reported to the user through the "log.txt" file located in the
"log" folder. Any server related error can be due to either throttling or
rejection from the server, which is most likely an issue with the maximum batch
requests per minute (see section 6.4), an unstable internet connection, or a
lack of an internet connection.

Any error which has the status details of "Ending Program." is a fatal error.
Fatal errors require the program to be restarted. Documented fatal errors can
only occur before the program begins its endless runtime loop. All other issues
merely cause the program to delay itself and re attempt at a later time.

The following are any of the possible documented errors:

1. "Failed to fetch config.txt file."  
  * Fatal error.  
  * There was an issue with the config.txt, or in reaching it.  
  * If there were no status details, check to make sure that there is a folder
    named "config" in the same directory as the "Runnable.html" and within the
    "config" folder, there is a file named "config.txt". Otherwise, there may
    have been an unexpected issue with fetching the file.  

2. "Unable to proceed. CMMS could not be called."  
  * Fatal error.  
  * Either the API is configured incorrectly, the internet connection at the
    time of starting the program was unstable, or there is no internet
    connection.  
  * After re attempting to start the program with a stable internet connection,
    check the config.txt to make sure the API is set up properly. The API
    could be paused in the CMMS. In which case, see "API CONNECTING" below.  

3. "Attempt to fetch the unit information from the server was unsuccessful."  
  * The server could not be reached. Check the internet connection to make
    sure it is stable, and try again. Make sure there is unit data in the CMMS
    for the program to find.  

4. "Failed to find the CSV file &#60;filename\>."  
  * The mentioned file the program is attempting to find does not exist, or
    there was an unexpected issue with fetching the file.  

5. "Failed to obtain or format the CSV file data."  
  * If there are no status details, there was an unexpected issue with
    fetching the file.  
  * If the status details say the unit data is not registered in the
    database, either there was a spelling mistake, or the unit data needs to
    be registered in the CMMS. See "ADDING UNITS" below.  

Any other errors which occur without a status message are unknown.

[Back to Top][BackToTop]

### 8.1 API CONNECTING ###

From a desktop view of the CMMS:

1. Log into the CMMS (if not already logged in).  
2. Select "Settings" from the menu on the left.  
3. Choose "Api Application Settings" from the options within "Settings". 
4. Select the application your automated meter reading file handler is
   connected to.  
5. If the switch beside the "Name of Api Application" box says "Inactive",
   click it to allow the program to connect to the CMMS through the API.  
6. Check to make sure the program is set to "System Facing Integration" in the
   general settings. Change the setting if it is not.  
7. Click save at the top of the screen.  

[Back to Top][BackToTop]

### 8.2 ADDING UNITS ###

From a desktop view of the CMMS:

1. Log into the CMMS (if not already logged in).  
2. Select "Assets" from the menu on the left.  
3. Select any asset.  
4. Switch to the tab labelled "Metering/Events".  
5. Click the page with a plus sign in the bottom left corner of the meter
   readings to make a new meter reading.  
6. Click the downward facing arrow beside the units to view all units.  
7. Click the "New" button.  
8. Create a new unit.  
9. Click the small "x" at the top of the pop-up boxes to close the meter
   reading without making a new one.  

[Back to Top][BackToTop]
<br>

9 LICENSING
-----------

Maintenance Assistant Labs Automated Meter Reading File Handler uses the bundled
package of the Maintenance Assistant CMMS client for JavaScript which is
available under the Apache License 2.0. For more information, see the files:

&nbsp;&nbsp;&nbsp;[LICENSE.txt][licensetxt]  
&nbsp;&nbsp;&nbsp;[NOTICE.txt][noticetxt]  

Copyright (c) 2011, 2012, Lawrence S. Maccherone, Jr.
The node-localstorage package is licenced under the MIT License. For more
information, visit the web page:

&nbsp;&nbsp;&nbsp;[https://tldrlegal.com/license/mit-license][mitLicense]  

Copyright 2009–2015 Kristopher Michael Kowal and contributors.
The q package is licensed under the MIT License. For more information, visit the
web page above.

[Back to Top][BackToTop]
<br>

10 EXAMPLES
-----------

All examples for the program are located in the "examples" folder. The example
configuration file is titled "EXconfig.txt", located in the "EXconfig" folder
within, and uses settings appropriate for the "6data.csv" file in the "EXdata"
folder.

The "EXdata" folder contains eight different files. Each file is an example for
the different optional settings. For more information on the specifics of each
file, see below.

The "EXpython" folder contains four example python scripts, three of which can
be run simultaneously. The specifics of usage are written about below.

It is highly recommended that the example files are opened using Notepad (if
using Windows), or an equivalent basic text editing program. Viewing the files
in a spreadsheet application, such as Microsoft Excel, can result in unexpected
issues with the viewing of the data and formatting of the examples.

[Back to Top][BackToTop]

### 10.1 1data.csv ###

The "[1data.csv][1data]" file is a basic CSV file of meter readings. It only contains the
needed headers for the program to run with a generic configuration. If the file
had more columns with various headers, it wouldn't make a difference, since all
the program needs are the four columns shown in the "1data.csv" file.

The header names are configurable (see section 6.3).

[Back to Top][BackToTop]

### 10.2 2data.csv ###

The "[2data.csv][2data]" file is an example file using the optional toggle setting "4:
Meter Reading Only" (see section 6.2). It is assumed for this file that setting
4 is turned on, and settings 7, 8, and 9 are in use.

[Back to Top][BackToTop]

### 10.3 3data.csv ###

The "[3data.csv][2data]" file is an example file using the optional setting "5:
Delimiter" (see section 6.2). It is assumed for this file that setting 5 has
been set to "^", and no other optional settings are in use.

[Back to Top][BackToTop]

### 10.4 4data.csv ###

The "[4data.csv][4data]" file is an example file using the optional toggle setting "6:
Quotation Wrapped Data" (see section 6.2). It is assumed for this file that
setting 6 is turned on, and no other optional settings are in use.

[Back to Top][BackToTop]

### 10.5 5data.csv ###

The "[5data.csv][4data]" file is an example file using the optional toggle setting "7:
Automatic Date Reading" (see section 6.2). It is assumed for this file that
setting 7 is turned on, and no other optional settings are in use.

[Back to Top][BackToTop]

### 10.6 6data.csv ###

The "[6data.csv][5data]" file is an example file using the optional setting "8: Set
Default ID" (see section 6.2). It is assumed for this file that setting 8 has a
valid asset ID entered, and no other optional settings are in use.

[Back to Top][BackToTop]

### 10.7 7data.csv ###

The "[7data.csv][6data]" file is an example file using the optional setting "9: Set
Default Unit" (see section 6.2). It is assumed for this file that setting 9 has
a valid unit (registered in the CMMS) entered, and no other optional settings
are in use.

[Back to Top][BackToTop]

### 10.8 8data.csv ###

The "[8data.csv][7data]" file is an example file using the optional setting "14: Work
Order ID Column Header" (see section 6.3). It is assumed for this file that
setting 14 has a valid header name entered, and no other optional settings are
in use.

[Back to Top][BackToTop]

### 10.9 config.txt ###

The "[config.txt][8data]" file is an example for using both the optional setting "8: Set
Default ID" (see section 6.2) and the "allSensors.py" example external script.
The URL and keys given are placeholders, and are not real. Only the API URL
resembles a legitimate value for the setting.

The reason the Set default ID setting is used as well, is because the files
produced by the external "allSensors.py" script do not include an id column, and
therefore must have it set by the main program's configuration.

[Back to Top][BackToTop]

### 10.10 allSensors.py ###

The "[allSensors.py][allSens.py]" file is a program which takes the readings of a photocell,
LM35DZ temperature sensor, and potentiameter, which are connected through a
MCP3008 chip for analog readings. The photocell is set to the first pin,
followed by the temperature sensor to the second pin and the potentiameter to
the third pin. The example temperature sensor used during testing needed a
minimum of four volts, and so the MCP3008 chip was connected to a five volt line
for power.

The program must first be moved to the main folder where the
"AutoMtrRdnHdlr.node.js" file is located in order to use it.

To reset the script's file naming back to "1data.csv", open the filed named
"[config][ScrCon]" in the "scratch" folder. Set the number to "1", save the file, and
close it. Doing so will reset all of the example scripts, since each one uses
the "config" file in the "scratch" folder.

Requires python 2.7.10 and spidev.

Steps for enabling SPI and installing the spidev wrapper used can be found here:

&nbsp;&nbsp;&nbsp;[https://www.raspberrypi-spy.co.uk/2014/08/enabling-the-spi-interface-on-the-raspberry-pi/][spidev]  

[Back to Top][BackToTop]

### 10.11 photocell.py ###

The "[photocell.py][photo.py]" file is a program which takes the readings of a photocell,
which is connected through a MCP3008 chip for analog readings. The photocell
needs to be connected to the first pin of the MCP3008 chip for the script to
run.

To reset the script's file naming back to "1data.csv", open the filed named
"[config][ScrCon]" in the "scratch" folder. Set the number to "1", save the file, and
close it. Doing so will reset all of the example scripts, since each one uses
the "config" file in the "scratch" folder.

This script is meant to run simultaneously alongside the "[temperature.py][temp.py]" and
"[potential.py][potent.py]" scripts. It must first be moved to the main folder where
the "AutoMtrRdnHdlr.node.js" file is located in order to use it.

Requires python 2.7.10 and spidev.

Steps for enabling SPI and installing the spidev wrapper used can be found here:

&nbsp;&nbsp;&nbsp;[https://www.raspberrypi-spy.co.uk/2014/08/enabling-the-spi-interface-on-the-raspberry-pi/][spidev]  

[Back to Top][BackToTop]

### 10.12 temperature.py ###

The "[temperature.py][temp.py]" file is a program which takes the readings of an LM35DZ
temperature sensor, which is connected through a MCP3008 chip for analog
readings. The temperature sensor needs to be connected to the second pin of the
MCP3008 chip for the script to run.

This script is meant to run simultaneously alongside the "[photocell.py][photo.py]" and
"[potential.py][potent.py]" scripts. It must first be moved to the main folder where
the "AutoMtrRdnHdlr.node.js" file is located in order to use it.

To reset the script's file naming back to "1data.csv", open the filed named
"[config][ScrCon]" in the "scratch" folder. Set the number to "1", save the file, and
close it. Doing so will reset all of the example scripts, since each one uses
the "config" file in the "scratch" folder.

Requires python 2.7.10 and spidev.

Steps for enabling SPI and installing the spidev wrapper used can be found here:

&nbsp;&nbsp;&nbsp;[https://www.raspberrypi-spy.co.uk/2014/08/enabling-the-spi-interface-on-the-raspberry-pi/][spidev]  

[Back to Top][BackToTop]

### 10.13 potential.py ###

The "[potential.py][potent.py]" file is a program which takes the readings of a
potentiameter, which is connected through a MCP3008 chip for analog readings.
The potentiameter needs to be connected to the third pin of the MCP3008 chip for
the script to run.

This script is meant to run simultaneously alongside the "[photocell.py][photo.py]" and
"[temperature.py][temp.py]" scripts. It must first be moved to the main folder where
the "AutoMtrRdnHdlr.node.js" file is located in order to use it.

To reset the script's file naming back to "1data.csv", open the filed named
"[config][ScrCon]" in the "scratch" folder. Set the number to "1", save the file, and
close it. Doing so will reset all of the example scripts, since each one uses
the "config" file in the "scratch" folder.

Requires python 2.7.10 and spidev.

Steps for enabling SPI and installing the spidev wrapper used can be found here:

&nbsp;&nbsp;&nbsp;[https://www.raspberrypi-spy.co.uk/2014/08/enabling-the-spi-interface-on-the-raspberry-pi/][spidev]  

[Back to Top][BackToTop]
<br>

11 CHANGE LOG
-------------

### v1.4.3 ###

* Updated the "README.txt" file to reflect recent changes  
  * Added the example python scrips  
  * Added the external scripts section of the configuration  
* Added example python programs  
* Prepared for hosting on GitHub  

[Back to Top][BackToTop]

### v1.4.2 ###

* Added ability to handle multiple possible child processes (up to 5)  
  * External scripts now take up settings 16 to 20  
  * Updated the "config.txt" file   
* Improved console outputs for the user  
  * Also added ASCII art of MA CMMS  
* Improved memory conservation  
  * Program now deletes files after it finishes pushing them to the CMMS  
  * Program now resets itself to searching for "1&#60;filename\>.csv" after 10000 files  
    * Program also blasts the log file during the reset  
* Minor bug fixes  
* Minor internal documentation corrections  
* "README.txt" file has not been updated to reflect recent changes  

[Back to Top][BackToTop]

### v1.4.1 ###

* Added additional script running  
  * setting 16: "Child Process"  
  * Updated the "config.txt" file  
* minor bug fixes  
* "README.txt" file has not been updated to reflect recent changes  

[Back to Top][BackToTop]

### v1.4.0 ###

* Made equivalent to the HTML 1.4 version  
  * Updated the "config.txt" file  
    * Changed the "Splitter" setting to "Delimiter"  
    * Added "Quotation Wrapped Data" setting  
    * Cleaned up the file  
  * Made "Delimiter" setting usable without the "Meter Reading Only" setting  
  * Minor bug fixes  
  * Updated the "README.txt" file  
    * No longer equivalent to the "README.md" of the HTML version  
  * Added the example files  
  * Added information to the top of the code  
    * For easier updating/version control  
  * Improved outputs for the user  

[Back to Top][BackToTop]

### v1.2.0 ###

* Created the Node JS version  
  * Equivalent to the HTML 1.2 version  

[Back to Top][BackToTop]


[head0100]: #1-authors--contributors
[head0200]: #2-introduction
[head0300]: #3-requirements
[head0400]: #4-installation
[head0500]: #5-setup
[head0600]: #6-configuration
[head0601]: #61-api-setup
[head0602]: #62-format-setup
[head0603]: #63-file-setup
[head0604]: #64-external-scripts
[head0605]: #65-batch-setup
[head0606]: #66-reset
[head0700]: #7-running
[head0800]: #8-troubleshooting
[head0801]: #81-api-connecting
[head0802]: #82-adding-units
[head0900]: #9-licensing
[head1000]: #10-examples
[head1001]: #101-1datacsv
[head1002]: #102-2datacsv
[head1003]: #103-3datacsv
[head1004]: #104-4datacsv
[head1005]: #105-5datacsv
[head1006]: #106-6datacsv
[head1007]: #107-7datacsv
[head1008]: #108-8datacsv
[head1009]: #109-configtxt
[head1010]: #1010-allsensorspy
[head1011]: #1011-photocellpy
[head1012]: #1012-temperaturepy
[head1013]: #1013-potentialpy
[head1100]: #11-change-log

[v143]: #v143
[v142]: #v142
[v141]: #v141
[v140]: #v140
[v120]: #v120

[6204]: #4-meter-reading-only
[6205]: #5-delimiter
[6206]: #6-quotation-wrapped-data
[6207]: #7-automatic-date-reading
[6208]: #8-set-default-id
[6209]: #9-set-default-unit
[6310]: #10-file-name
[6311]: #11-asset-id-column-header
[6312]: #12-meter-reading-value-column-header
[6313]: #13-meter-reading-value-unit-measurement-column-header
[6314]: #14-date-column-header
[6315]: #15-work-order-id-column-header
[6521]: #21-maximum-batch-requests-per-minute
[6522]: #22-time-delay-between-files

[BackToTop]: #ma-labs-node-js-meter-reading-file-handler-v14

[nodejs]: https://nodejs.org/download/
[maAPIdoc]: https://www.maintenanceassistant.com/api/docs/guide.html
[RFC2822]: https://tools.ietf.org/html/rfc2822#page-14
[ISO8601]: https://www.w3.org/TR/NOTE-datetime-970915.html
[mitLicense]: https://tldrlegal.com/license/mit-license
[spidev]: https://www.raspberrypi-spy.co.uk/2014/08/enabling-the-spi-interface-on-the-raspberry-pi/

[licensetxt]: LICENSE.txt
[noticetxt]: NOTICE.txt

[1data]: examples/EXdata/1data.csv
[2data]: examples/EXdata/2data.csv
[3data]: examples/EXdata/3data.csv
[4data]: examples/EXdata/4data.csv
[5data]: examples/EXdata/5data.csv
[6data]: examples/EXdata/6data.csv
[7data]: examples/EXdata/7data.csv
[8data]: examples/EXdata/8data.csv

[allSens.py]: examples/EXpython/allSensors.py
[photo.py]: examples/EXpython/photocell.py
[temp.py]: examples/EXpython/temperature.py
[potent.py]: examples/EXpython/potential.py
[ScrCon]: scratch/config
