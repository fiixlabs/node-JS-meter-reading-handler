NODE JS METER READING FILE HANDLER v1.4
=======================================


TABLE OF CONTENTS
-----------------

  1. Authors & Contributors
  2. Introduction  
  3. Requirements  
  4. Installation  
  5. Setup  
  6. Configuration  
    6.1 API Setup  
    6.2 Format Setup  
    6.3 File Setup  
    6.4 External Scripts  
    6.5 Batch Setup  
    6.6 Reset  
  7. Running  
  8. Troubleshooting  
    8.1 API Connecting  
    8.2 Adding Units  
  9. Licensing  
  10. Examples  
    10.1 1data.csv  
    10.2 2data.csv  
    10.3 3data.csv  
    10.4 4data.csv  
    10.5 5data.csv  
    10.6 6data.csv  
    10.7 7data.csv  
    10.8 8data.csv  
    10.9 config.txt  
    10.10 allSensors.py  
    10.11 photocell.py  
    10.12 temperature.py  
    10.13 potential.py  
  11. Changelog  
    v1.4.4  
    v1.4.3  
    v1.4.2  
    v1.4.1  
    v1.4.0  
    v1.2.0  


1 AUTHORS & CONTRIBUTORS
------------------------

v1.2.0 Created May 12,  2015 by Jake Uskoski  
v1.4.0 Created June 4,  2015 by Jake Uskoski  
v1.4.1 Created June 8,  2015 by Jake Uskoski  
v1.4.2 Created June 11, 2015 by Jake Uskoski  
v1.4.3 Created June 24, 2015 by Jake Uskoski  
v1.4.4 Created Aug 25,  2016 by Jake Uskoski  



2 INTRODUCTION
--------------

The Node JS Automated Meter Reading File Handler is a program which
takes CSV files from its designated folder, formats the necessary information,
and sends the data to your CMMS, through the use of the Fiix JavaScript API. The
program runs in the console through the use of Node JavaScript.

Before attempting to run the program, please be sure to extract all of the files
from the ZIP package. The program cannot be run from the ZIP. This "README.txt"
file is a stripped version of this README, lacking any markdown code for the
sake of making it more readable as plain text.

There is no "step-by-step-beginner-guide.txt" for this package. All necessary
information is included in this README.



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
  5. Fiix
    * Available at www.fiixsoftware.com


4 INSTALLATION
--------------

The Node JS version of the Automated Meter Reading File Handler requires node
JS, as well as the Q and node-localstorage modules. All instructions in this
README are using the command line.

Installing node JS depends on the computer. There are many different ways
available online, including the main download page of the Node JS website,

  https://nodejs.org/download/

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


5 SETUP
-------

Within the program folder where the runnable.html file is located, there is a
folder named "data" which is used for placing CSV files in. The files must be
named using the following format:

  <number><name>.csv  

The <name> must be the same for every file, and the numbers must increment
naturally, beginning at 1. For example:

  1data.csv  
  2data.csv  
  3data.csv  
  ...  
  15data.csv  

The default configuration setting uses "data.csv" as the filename, but can
be configured. The configuration file must be prepared before the first run, or
else the program will fail to function. See "CONFIGURATION" for more details.



6 CONFIGURATION
---------------

The configuration file, located in the "config" folder and named "config.txt",
has four categories:

  1. API Setup  
  2. Format Setup  
  3. File Setup  
  4. Batching Setup  
  5. Reset  

All lines that take output to the program are preceded by a tilde ("~").
Removing the tilde from before a line will stop it from being read by the
program, and adding additional tildes to the beginning of lines will cause
errors which will prevent the program from reading the config.txt file. To
prevent any errors from occurring within the configuration, avoid using, adding,
and deleting tildes.

For example files using the various optional settings, see section 11.


6.1 API SETUP
-------------

The API setup has four requirements:

  0:  API URL                                                    - [REQUIRED]  
  1:  Application Key                                            - [REQUIRED]  
  2:  Access Key                                                 - [REQUIRED]  
  3:  API Secret Key                                             - [REQUIRED]  

To learn about getting your API keys, go to the web page:

  http://www.fiixsoftware.com/api/docs/guide.html

and see the section "Getting your API Access Keys".


6.2 FORMAT SETUP
----------------

The Format setup has two requirements and three optional values:

  4:  Meter Reading Only                                         - [REQUIRED] [TOGGLE]  
  5:  Delimiter                                                  - [NOT REQUIRED]  
  6:  Quotation Wrapped Data                                     - [REQUIRED] [TOGGLE]  
  7:  Automatic Date Reading                                     - [REQUIRED] [TOGGLE]  
  8:  Set Default ID                                             - [NOT REQUIRED]  
  9:  Set Default Unit                                           - [NOT REQUIRED]  


4: Meter Reading Only
`````````````````````
This setting is for cases where the files being placed in the "data" folder only
contain a single column (or single string) of meter reading data, and nothing
else.


5: Delimiter
````````````
The Delimiter setting, when left blank, defaults to using the comma (","), the
basic delimiter of CSV files. If the CSV files being placed in the "data" folder
have a different delimiter than the comma, then it may be entered into this
setting.

An example would be using the vertical bar ("|") or ampersand ("&") instead of
the comma as the delimiter for the CSV files.

  id,Meter Reading,Unit,Date  
  id|Meter Reading|Unit|Date  
  id&Meter Reading&Unit&Date  

NOTE:
The delimiter can be any length, not just one character, but it must remain
identical throughout the file, and must be the same for all files in the "data"
folder. Using different delimiters will result in the data not being separated
properly, leading to improper amounts of batches and continuously failing
attempts to send data to the CMMS.


6: Quotation Wrapped Data
`````````````````````````
The Quotation Wrapped Data setting is for if the program used to generate CSV
files wraps all data in quotations. This is common for CSV files, and allows for
use of the delimiter within the CSV data, in cases such as notes or description
columns, without ruining the parsing of the data.

In the following example, the headings "Meter, Reading" and "Meter, Unit" would
be left alone.

  "id","Meter, Reading","Meter, Unit","Date"  

Without the quotation wrapping, such as the following example, the headings
would be separated into "id", "Meter", " Reading", "Meter", " Unit", "Date".

  id,Meter, Reading,Meter, Unit,Date  


7: Automatic Date Reading
`````````````````````````
The Automatic Date Reading setting causes the program to override the Date
Column Header setting [13] in the File Setup section, instead using the time
the item was read from the file by the program. If the Meter Reading Only
setting [4] is toggled on, then the Automatic Date Reading setting is
required to be on as well, but the Automatic Date Reading setting can also be
toggled on without the Meter Reading Only setting.


8: Set Default ID
`````````````````
Similar to the Automatic Date Reading setting [6], the Set Default ID
setting will override the Asset ID Column Header setting [10] and attach
whatever ID that has been entered in the Set Default ID setting to each meter
reading, regardless of any IDs in the file.

Like the Automatic Date Reading setting [6], the Set Default ID setting is
required when the Meter Reading Only setting [4] is toggled on.


9: Set Default Unit
```````````````````
Similar to the Set Default ID setting [7], the Set Default Unit setting will
override the Meter Reading Value Unit Measurement Column Header setting [12]
and attach whatever unit that has been entered in the Set Default Unit setting
to each meter reading, regardless of any units in the file.


6.3 FILE SETUP
--------------

The file setup has five requirements and an optional value:

  10: File Name                                                  - [REQUIRED]  
  11: Asset ID Column Header                                     - [REQUIRED]  
  12: Meter Reading Value Column Header                          - [REQUIRED]  
  13: Meter Reading Value Unit Measurement Column Header         - [REQUIRED]  
  14: Date Column Header                                         - [REQUIRED]  
  15: Work Order ID Column Header                                - [NOT REQUIRED]  


10: File Name
`````````````
File Name refers to the names given to all of the
files in the "data" folder. The name must include the ".csv" and cannot include
any numbers. Leaving the File Name empty ("~") results in a fatal error.

IMPORTANT:  
Once the program reads the 10000th file ("10000<filename>.csv"), it begins
looking for 1<filename>.csv again. This is so that the file numbering never
reaches a point where the value is beyond the scope of a number in javascript,
or a number (int, float, double, etc.) in any other programming language.

Whenever a file is finished being successfully read by the program, it is
deleted to conserve memory space, therefore external scripts can also loop their
naming to return to "1<filename>" after "10000<filename>.csv".


11: Asset ID Column Header
``````````````````````````
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

If the Meter Reading Only setting [4] is toggled on, or the Set Default ID
setting [7] is not empty, then the Asset ID Column Header setting will be
ignored, under the assumption that there are no headers in the files, and only
one column or string of data for meter readings, or the assumption that the
configured default is the correct value.


12: Meter Reading Value Column Header
`````````````````````````````````````
Similar to the Asset ID Column Header setting [10], the Meter Reading Value
Column Header setting is for the header which appears in all files, for the
column containing the data for the meter reading data. The meter readings should
be purely numerical, with the unit separated and in a different column.

If the Meter Reading Only setting [4] is toggled on, then the Meter Reading
Value Column Header setting will be ignored, under the assumption that there are
no headers in the files, and only one column or string of data for meter
readings.


13: Meter Reading Value Unit Measurement Column Header
``````````````````````````````````````````````````````
Similar to the Asset ID Column Header setting [10], the Meter Reading Value
Unit Measurement Column Header setting is for the header which appears in all
files, for the column containing the data for the unit of the meter reading
data.

If the Meter Reading Only setting [4] is toggled on, or the Set Default Unit
setting [8] is not empty, then the Meter Reading Value Unit Measurement
Column Header setting will be ignored, under the assumption that there are no
headers in the files, and only one column or string of data for meter readings,
or the assumption that the configured default is the correct value.


14: Date Column Header
``````````````````````
Similar to the Asset ID Column Header setting [10], the Date Column Header
setting is for the header which appears in all files, for the column containing
the dates that the meter reading data was taken at.

For best results, the date data in the CSV files should be using RFC2822 format
or ISO 8601 Date format. Any other format may result in unexpected values, and
therefore should be avoided.

  For RFC2822 Format, see http://tools.ietf.org/html/rfc2822#page-14  
  For ISO 8601 Format, see http://www.w3.org/TR/NOTE-datetime-970915.html  

If the Meter Reading Only setting [4] is toggled on, or the Automatic Date
Reading setting [6] is toggled on, then the Date Column Header setting will
be ignored, under the assumption that there are no headers in the files, and only
one column or string of data for meter readings, or the assumption that the
configured default is the correct value. 


15: Work Order ID Column Header
```````````````````````````````
Similar to the Asset ID Column Header setting [10], the Work Order ID Column
Header setting is for the header which appears in all files, for the column
containing the IDs of the work orders the meter reading data is related to. If
a row is missing a work order ID, but the header is in the file, the meter
reading will be treated as though it has no related work order.

If the Meter Reading Only setting [4] is toggled on, then the Work Order ID
Column Header setting will be ignored, under the assumption that there are no
headers in the files, and only one column or string of data for meter readings.


6.4 EXTERNAL SCRIPTS
--------------------
The external scripts has five open slots:

  16: Child Process 1                                            - [NOT REQUIRED]  
  17: Child Process 2                                            - [NOT REQUIRED]  
  18: Child Process 3                                            - [NOT REQUIRED]  
  19: Child Process 4                                            - [NOT REQUIRED]  
  20: Child Process 5                                            - [NOT REQUIRED]  

The child processes are commands which will be run at the start of the program,
and will end when the program ends. The commands are called through the command
line, and if they are meant to run permanently in a loop, they should be
structured to do so on their own. Once called, the program will never interact
with the child processes again until closing.

For example usage of the child processes, see the example "config.txt" file in
the "EXconfig" folder (within the examples folder).


6.5  BATCH SETUP
----------------

The batch setup has two requirements:

  21: Maximum Batch Requests Per Minute                          - [REQUIRED]  
  22: Time Delay Between Files                                   - [REQUIRED]  


21: Maximum Batch Requests Per Minute
`````````````````````````````````````
The maximum batch requests per minute value
keeps the server from throttling the program, and varies depending on the size
of the company using the CMMS. If the program repeatedly fails to send batch
requests, and there is a stable internet connection, it is because the maximum
batch requests per minute is set too high. Each batch request is a single meter
reading, so an MBR/min of 200 means that the program will attempt to send up to
two hundred meter readings from the CSV file currently being read to the CMMS.
Due to the nature of the program, all two hundred will be sent at once, and then
a minute delay will begin after the server responds, to prevent throttling.


22: Time Delay Between Files
````````````````````````````
The time delay between files is meant to force the program to wait before moving
to the next file, or continuing the current file if closed or failed before
finishing previously, so that a user is capable of making any changes to the CSV
files in the "data" folder, altering unit data in the CMMS, or adding more files
for the program to read, before the next check. It also gives time for any
internet instability to resolve before re attempting to send files to the CMMS.
The value is in minutes, and the default setting is half an hour.


6.6  RESET
----------

The reset setup has one requirement:

  23: Reset The File And Position Tracking                       - [REQUIRED] [TOGGLE]

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



7  RUNNING
----------

Once the configuration file is prepared, and any external scripts are in place,
enter the directory containing the "AutoMtrRdnHdlr.node.js" file and run it from
the command line, through node:

    node AutoMtrRdnHdlr.node.js



8  TROUBLESHOOTING
------------------

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

4. "Failed to find the CSV file <filename>."  
  * The mentioned file the program is attempting to find does not exist, or
    there was an unexpected issue with fetching the file.  

5. "Failed to obtain or format the CSV file data."  
  * If there are no status details, there was an unexpected issue with
    fetching the file.  
  * If the status details say the unit data is not registered in the
    database, either there was a spelling mistake, or the unit data needs to
    be registered in the CMMS. See "ADDING UNITS" below.  

Any other errors which occur without a status message are unknown.


8.1  API CONNECTING
-------------------

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


8.2  ADDING UNITS
-----------------

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



9  LICENSING
------------

The Node JS Automated Meter Reading File Handler uses the bundled package of the
Fiix CMMS client for JavaScript which is available under the Apache License 2.0.
For more information, see the files:

  LICENSE.txt  
  NOTICE.txt  

Copyright (c) 2011, 2012, Lawrence S. Maccherone, Jr.
The node-localstorage package is licenced under the MIT License. For more
information, visit the web page:

  https://tldrlegal.com/license/mit-license  

Copyright 2009–2015 Kristopher Michael Kowal and contributors.
The q package is licensed under the MIT License. For more information, visit the
web page above.



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


10.1 1data.csv
--------------

The "1data.csv" file is a basic CSV file of meter readings. It only contains the
needed headers for the program to run with a generic configuration. If the file
had more columns with various headers, it wouldn't make a difference, since all
the program needs are the four columns shown in the "1data.csv" file.

The header names are configurable (see section 6.3).


10.2 2data.csv
--------------

The "2data.csv" file is an example file using the optional toggle setting "4:
Meter Reading Only" (see section 6.2). It is assumed for this file that setting
4 is turned on, and settings 7, 8, and 9 are in use.


10.3 3data.csv
--------------

The "3data.csv" file is an example file using the optional setting "5:
Delimiter" (see section 6.2). It is assumed for this file that setting 5 has
been set to "^", and no other optional settings are in use.


10.4 4data.csv
--------------

The "4data.csv" file is an example file using the optional toggle setting "6:
Quotation Wrapped Data" (see section 6.2). It is assumed for this file that
setting 6 is turned on, and no other optional settings are in use.


10.5 5data.csv
--------------

The "5data.csv" file is an example file using the optional toggle setting "7:
Automatic Date Reading" (see section 6.2). It is assumed for this file that
setting 7 is turned on, and no other optional settings are in use.


10.6 6data.csv
--------------

The "6data.csv" file is an example file using the optional setting "8: Set
Default ID" (see section 6.2). It is assumed for this file that setting 8 has a
valid asset ID entered, and no other optional settings are in use.


10.7 7data.csv
--------------

The "7data.csv" file is an example file using the optional setting "9: Set
Default Unit" (see section 6.2). It is assumed for this file that setting 9 has
a valid unit (registered in the CMMS) entered, and no other optional settings
are in use.


10.8 8data.csv
--------------

The "8data.csv" file is an example file using the optional setting "14: Work
Order ID Column Header" (see section 6.3). It is assumed for this file that
setting 14 has a valid header name entered, and no other optional settings are
in use.

10.9 config.txt
---------------

The "config.txt" file is an example for using both the optional setting "8: Set
Default ID" (see section 6.2) and the "allSensors.py" example external script.
The URL and keys given are placeholders, and are not real. Only the API URL
resembles a legitimate value for the setting.

The reason the Set default ID setting is used as well, is because the files
produced by the external "allSensors.py" script do not include an id column, and
therefore must have it set by the main program's configuration.


10.10 allSensors.py
-------------------

The "allSensors.py" file is a program which takes the readings of a photocell,
LM35DZ temperature sensor, and potentiometer, which are connected through a
MCP3008 chip for analog readings. The photocell is set to the first pin,
followed by the temperature sensor to the second pin and the potentiometer to
the third pin. The example temperature sensor used during testing needed a
minimum of four volts, and so the MCP3008 chip was connected to a five volt line
for power.

The program must first be moved to the main folder where the
"AutoMtrRdnHdlr.node.js" file is located in order to use it.

To reset the script's file naming back to "1data.csv", open the file named
"config" in the "scratch" folder. Set the number to "1", save the file, and
close it. Doing so will reset all of the example scripts, since each one uses
the "config" file in the "scratch" folder. 

Requires python 2.7.10 and spidev.

Steps for enabling SPI and installing the spidev wrapper used can be found here:

  http://www.raspberrypi-spy.co.uk/2014/08/enabling-the-spi-interface-on-the-raspberry-pi/  


10.11 photocell.py
------------------

The "photocell.py" file is a program which takes the readings of a photocell,
which is connected through a MCP3008 chip for analog readings. The photocell
needs to be connected to the first pin of the MCP3008 chip for the script to
run.

This script is meant to run simultaneously alongside the "temperature.py" and
"potential.py" scripts.It must first be moved to the main folder where
the "AutoMtrRdnHdlr.node.js" file is located in order to use it.

To reset the script's file naming back to "1data.csv", open the file named
"config" in the "scratch" folder. Set the number to "1", save the file, and
close it. Doing so will reset all of the example scripts, since each one uses
the "config" file in the "scratch" folder.

Requires python 2.7.10 and spidev.

Steps for enabling SPI and installing the spidev wrapper used can be found here:

  http://www.raspberrypi-spy.co.uk/2014/08/enabling-the-spi-interface-on-the-raspberry-pi/  


10.12 temperature.py
--------------------

The "temperature.py" file is a program which takes the readings of an LM35DZ
temperature sensor, which is connected through a MCP3008 chip for analog
readings. The temperature sensor needs to be connected to the second pin of the
MCP3008 chip for the script to run.

This script is meant to run simultaneously alongside the "photocell.py" and
"potential.py" scripts.It must first be moved to the main folder where
the "AutoMtrRdnHdlr.node.js" file is located in order to use it.

To reset the script's file naming back to "1data.csv", open the file named
"config" in the "scratch" folder. Set the number to "1", save the file, and
close it. Doing so will reset all of the example scripts, since each one uses
the "config" file in the "scratch" folder.

Requires python 2.7.10 and spidev.

Steps for enabling SPI and installing the spidev wrapper used can be found here:

  http://www.raspberrypi-spy.co.uk/2014/08/enabling-the-spi-interface-on-the-raspberry-pi/  


10.13 potential.py
------------------

The "potential.py" file is a program which takes the readings of a
potentiometer, which is connected through a MCP3008 chip for analog readings.
The potentiometer needs to be connected to the third pin of the MCP3008 chip for
the script to run.

This script is meant to run simultaneously alongside the "photocell.py" and
"temperature.py" scripts.It must first be moved to the main folder where
the "AutoMtrRdnHdlr.node.js" file is located in order to use it.

To reset the script's file naming back to "1data.csv", open the file named
"config" in the "scratch" folder. Set the number to "1", save the file, and
close it. Doing so will reset all of the example scripts, since each one uses
the "config" file in the "scratch" folder.

Requires python 2.7.10 and spidev.

Steps for enabling SPI and installing the spidev wrapper used can be found here:

  http://www.raspberrypi-spy.co.uk/2014/08/enabling-the-spi-interface-on-the-raspberry-pi/  


11 CHANGELOG
------------

v1.4.4
------
* Updated documentation and files to reflect rebranding

v1.4.3
------
* Updated the "README.txt" file to reflect recent changes  
  * Added the example python scripts  
  * Added the external scripts section of the configuration  
* Added example python programs  
* Prepared for hosting on GitHub  

v1.4.2
------
* Added ability to handle multiple possible child processes (up to 5)  
  * External scripts now take up settings 16 to 20  
  * Updated the "config.txt" file   
* Improved console outputs for the user  
  * Also added ASCII art of MA CMMS  
* Improved memory conservation  
  * Program now deletes files after it finishes pushing them to the CMMS  
  * Program now resets itself to searching for "1<filename>" after 10000 files  
    * Program also blasts the log file during the reset  
* Minor bug fixes  
* Minor internal documentation corrections  
* "README.txt" file has not been updated to reflect recent changes  


v1.4.1
------
* Added additional script running  
  * setting 16: "Child Process"  
  * Updated the "config.txt" file  
* minor bug fixes  
* "README.txt" file has not been updated to reflect recent changes  


v1.4.0
------

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


v1.2.0
------

* Created the Node JS version  
  * Equivalent to the HTML 1.2 version  
