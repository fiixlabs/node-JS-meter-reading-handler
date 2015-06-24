#!/usr/bin/python

import spidev
import time
import os
import sys

# Define constants
light_channel  = 0
delay          = 1
cap            = 30


f = open('scratch/config', 'r')
config = int(f.read())
f.close()

temp_num = config - 1
temp_str = 'temp/' + str(temp_num) + 'LightReading.csv'
if os.path.isfile(temp_str):
  command = 'rm ' + temp_str
  os.system(command)

temp_str = 'temp/' + str(config) + 'LightReading.csv'
if os.path.isfile(temp_str):
  command = 'rm ' + temp_str
  os.system(command)

f = open('temp/' + str(config) + 'LightReading.csv', 'a')
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


while True:
  # Read the light sensor data
  light_level  = ReadChannel(light_channel)

  #First Line Output
  if line_count == 0:
    f.write('Meter Reading,Unit,Date\n')
    line_count += 1

  date = time.time()

  if line_count != cap and line_count != 0:
    f.write(str(light_level) + ',Light,' + str(date) + '\n')
    line_count += 1
  elif line_count == cap:
    f.write(str(light_level) + ',Light,' + str(date))
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

    command = 'mv temp/' + str(config) + 'LightReading.csv data/' + str(new_config) + 'data.csv'
    config = temp_num

    os.system(command)

    f = open('temp/' + str(config) + 'LightReading.csv', 'a')

  #Wait before repeating loop
  time.sleep(delay)