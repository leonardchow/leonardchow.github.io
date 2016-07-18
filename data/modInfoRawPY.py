import csv
import sys
import re

print 'Opening file'
f = open(sys.argv[1], 'rt') #opens using the argument after this .py file.
#f = open("modInfoCSV.csv", 'rt')
print 'Reading...'

try:
    reader = csv.reader(f)
    data = list(reader)
except:
    print 'ERROR: Couldn\'t read!'
finally:
    f.close()
    print 'Read file.'

#Create arrays and variables:
codeArr = []
modTypeArr = []
nameArr = []
creditArr = []
isCoreModArr = []
headerRow = ['code', 'modType', 'name', 'MCs', 'isCoreMod']
firstRow = ['Please select module:', '0', '', '0', 'FALSE']
coreMods = ['NM1101E', 'NM2101', 'NM2103', 'NM2104', 'NM4102']

print 'Beginning parsing...'
for line in data:
    #print line
    for lineInner in line:
        #print lineInner
        item = str(lineInner)

        search = re.search('(^[A-Z]+)([0-9]{4})', item)
        #Find string that:
        #Starts with any capital letter, at least once
        #And has exactly 4 numbers after that. Brackets around groups is optional, but can be used to retrieve the string.
        if (search != None):
            #If a module code is found:
            #Get modType
            modType = str(search.group(1))

            #Check MCs
            creditCount = 0
            creditLevel = int(search.group(2)[0])

            if (creditLevel > 3):
                creditCount = 5
            else:
                creditCount = 4

            #Check isCoreMod
            isCoreMod = 'FALSE'
            if any(x in item for x in coreMods):
                isCoreMod = 'TRUE'

            #Write details to Arrays
            codeArr.append(item)
            modTypeArr.append(modType)
            creditArr.append(creditCount)
            isCoreModArr.append(isCoreMod)

        elif (len(item) > 3):
            #If lineInner is not a module code, and is longer than 3 chars, append it as a name!
            nameArr.append(item)

print 'Done parsing.'

print 'Opening file to write...'
fw = open("modInfoCSV-2.csv", 'wt')

try:
    print 'Writing...'
    writer = csv.writer(fw)
    writer.writerow(headerRow)
    writer.writerow(firstRow)
    for idx in range(len(codeArr)):
        itemArr = []
        itemArr.append(codeArr[idx]) #code
        itemArr.append(modTypeArr[idx])#modType
        itemArr.append(nameArr[idx]) #name
        itemArr.append(creditArr[idx]) #MCs
        itemArr.append(isCoreModArr[idx]) #isCoreMod
        writer.writerow(itemArr)
except:
    print 'ERROR: Couldn\'t write!'
finally:
    fw.close()
    print 'All done.'

#output = "var modInfoArray = " + str(masterArr)
#print output
#with open("outputJS.js", "w") as text_file:
    #text_file.write(output)
