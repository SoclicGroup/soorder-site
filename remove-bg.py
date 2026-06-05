from PIL import Image

img = Image.open("Logo-soorder.png").convert("RGBA")
data = img.getdata()
new_data = []
for item in data:
    if item[0] < 30 and item[1] < 30 and item[2] < 30:
        new_data.append((0, 0, 0, 0))
    else:
        new_data.append(item)
img.putdata(new_data)
img.save("logo-transparent.png")
print("Done — logo-transparent.png saved")
