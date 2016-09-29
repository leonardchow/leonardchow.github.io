import os

print '\nWelcome to the File Renamer!\n'

path_name_array = ['./heads/', './torso/']
name_prefix_array = ['head', 'torso']
set_name_array = ['imageSetHead', 'imageSetTorso']
set_desc_array = ["Please select an image for your character's head!", "Please select an image for your character's torso!"]
image_set_object = {}

DRY_RUN = True

# print 'This is %s' % ('a dry run.' if DRY_RUN else 'NOT a dry run.')
# print 'Do you wish to continue? Y / N'

print 'Do you want to do a dry run? Y / N'

user_cont = raw_input()

if user_cont == 'y' or user_cont == 'Y':
    DRY_RUN = True
elif user_cont == 'n' or user_cont == 'N':
    DRY_RUN = False
else:
    print 'Please enter Y or N next time.'
    quit()

print 'Parsing files...\n'
for (idx_path, path_name) in enumerate(path_name_array):

    file_list = os.listdir(path_name)
    path_array = []
    image_set = {'setDescription' : set_desc_array[idx_path], 'imagePaths' : path_array}

    if file_list[0] == '.DS_Store':
        file_list.remove('.DS_Store')

    # print file_list
    # print '\n'

    for (idx_name, old_name) in enumerate(file_list):

        if old_name == '.DS_Store': continue

        # get extension e.g.: .jpg
        extension = os.path.splitext(old_name)[1]
        # set new name according to the new name prefix
        new_name = "%s-%d%s" % (name_prefix_array[idx_path], idx_name, extension)

        if DRY_RUN:
            print "Would rename %s to %s" % (old_name, new_name)
        else :
            print "Renaming %s to %s" % (old_name, new_name)
            old_name_path = os.path.join(path_name, old_name)
            new_name_path = os.path.join(path_name, new_name)
            os.rename(old_name_path, new_name_path)

        # set the name and path to be e.g.: '../images' + /heads/ + head-1.jpg
        parsed_path_name = path_name_array[idx_path].split('.')[1]
        name_and_path = "../images%s%s" % (parsed_path_name, new_name)
        path_array.append(name_and_path)

    set_name = set_name_array[idx_path]
    image_set_object[set_name] = image_set
    print image_set_object

output = "var imageSetObject = " + str(image_set_object)
print 'Done parsing.'

# print "\n%s" % (output)
if not DRY_RUN:
    print 'Opening file to write...'
    with open("clothesPickerImageSetJS.js", "w") as text_file:
        print 'Writing .js file...'
        text_file.write(output)
        print 'All done.'


# === Example of ideal output ===
# var imageSetObject = {
#   "imageSetHead" : {
#     "setDescription" : "Please select an image for your character's head!",
#     "imagePaths" : ["freshscanlogo.png", "freshscanlogo-flipped.png", "freshscanlogo.png", "freshscanlogo-flipped.png","freshscanlogo.png", "freshscanlogo-flipped.png","freshscanlogo.png", "freshscanlogo-flipped.png"]
#   }
#
# };
