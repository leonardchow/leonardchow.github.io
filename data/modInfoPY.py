import csv
import sys

print 'Opening file'
f = open(sys.argv[1], 'rt')
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

keys = data[0]
masterArr = []

print 'Beginning parsing...'
for idx, item in enumerate(data):
    obj = {}
    if idx != 0:
        for idn, pop in enumerate(item):
            obj[keys[idn]] = pop
            #if idn != 4:
                #obj[keys[idn]] = pop
            #else:
                #if pop == 'TRUE':
                    #popTemp = True
                #else:
                    #popTemp = False
                #obj[keys[4]] = popTemp

        masterArr.append(obj)

output = "var modInfoPack = " + str(masterArr)
print 'Done parsing.'

print 'Opening file to write...'
with open("outputJS.js", "w") as text_file:
    print 'Writing...'
    text_file.write(output)
    print 'All done.'
