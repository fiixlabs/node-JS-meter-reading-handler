#!/usr/bin/python

import spidev
import time
import os
import sys

# Define constants
light_channel  = 0
temp_channel   = 1
potent_channel = 2
delay          = 1
cap            = 20


f = open('scratch/config', 'r')
config = int(f.read())
f.close()

temp_num = config - 1
temp_str = 'temp/' + str(temp_num) + 'readings.csv'
if os.path.isfile(temp_str):
  command = 'rm ' + temp_str
  os.system(command)

temp_str = 'temp/' + str(config) + 'readings.csv'
if os.path.isfile(temp_str):
  command = 'rm ' + temp_str
  os.system(command)

f = open('temp/' + str(config) + 'readings.csv', 'a')
line_count = 0


# Open SPI bus

spi = spidev.SpiDev()
spi.open(0,0)


# Function to read SPI data from MCP3008 chip
# Channel must be an integer 0-7

def ReadChannel(channel):
  adc = spi.xfer2([1,(8+channel)<<4,0])
  data = ((adc[1]&3) << 8) + adc[2]
  return data


# Function to convert data to voltage level,
# rounded to specified number of decimal places.

def ConvertVolts(data,places):
  volts = (data * 5) / float(1023)
  volts = round(volts,places)
  return volts


# Function to calculate temperature from
# TMP36 data, rounded to specified
# number of decimal places.

def ConvertTemp(data,places):
  temp = ((data * 500)/float(1023))-3
  temp = round(temp,places)
  return temp


while True:
  # Read the light sensor data
  light_level  = ReadChannel(light_channel)
  light_volts  = ConvertVolts(light_level,2)

  # Read the temperature sensor data
  temp_level   = ReadChannel(temp_channel)
  temp_volts   = ConvertVolts(temp_level,2)
  temp         = ConvertTemp(temp_level,2)

  #Read the potentiometer data
  potent_level = ReadChannel(potent_channel)

  #First Line Output
  if line_count == 0:
    f.write('Meter Reading,Unit,Date\n')
    line_count += 1

  date = time.time()

  if line_count != cap and line_count != 0:
    f.write(str(light_level) + ',Light,' + str(date) + '\n' +
            str(temp) + ',celsius,' + str(date) + '\n' +
            str(potent_level) + ',potential,' + str(date) + '\n')
    line_count += 1
  elif line_count == cap:
    f.write(str(light_level) + ',Light,' + str(date) + '\n' +
            str(temp) + ',celsius,' + str(date) + '\n' +
            str(potent_level) + ',potential,' + str(date))
    f.close()
    line_count = 0

    #double check config
    f = open('scratch/config', 'r+')
    new_config = int(f.read())
    temp_num = new_config + 1
    if temp_num > 10000:
        temp_num = 1
    f.seek(0)
    f.write(str(temp_num))
    f.truncate()
    f.close()

    command = 'mv temp/' + str(config) + 'readings.csv data/' + str(new_config) + 'data.csv'
    config = temp_num

    os.system(command)

    f = open('temp/' + str(config) + 'readings.csv', 'a')

  #Wait before repeating loop
  time.sleep(delay)