import os
from PIL import Image

file = open("assets/data.js", "w")

file.write("var puzzles =\n")
file.write("[\n")

for root, dirs, files in os.walk("images"):
    for filename in files:
        colors = []
        tiles = []

        image = Image.open("images/" + filename)
        pixels = image.load()
        for y in range(0, image.size[1]):
            tiles.append([])
            for x in range(0, image.size[0]):
                r = pixels[x, y][0]
                g = pixels[x, y][1]
                b = pixels[x, y][2]
                a = pixels[x, y][3]
                if a == 255:
                    color = "{r: " + str(r) + ", g: " + str(g) + ", b: " + str(b) + "}"
                    if color not in colors:
                        colors.append(color)
                    
                    tiles[y].append(colors.index(color))
                else:
                    tiles[y].append("0")

        file.write("    {\n")
        file.write("        name: \"" + filename.split(".")[0] + "\",\n")

        file.write("        colors: [")
        for color in colors:
            file.write(color + ",")
        file.write("],\n")

        file.write("        tiles: [")
        for tile in tiles:
            file.write("[")
            for colorIndex in tile:
                file.write(str(colorIndex) + ",")
            file.write("],")
        file.write("],\n")

        file.write("    },\n")

    file.write("];")