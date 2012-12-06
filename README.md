Seneca.io procedurally generated business cards
===

Generates a hexagon maze for the Seneca.io business cards. Built using jQuery and SVG with Raphaël.

Clone the repo, open index.html to view the maze generation.

Converting SVG to PDF
---

Since I'm using Moo cards I need to upload the images in a compatible image format. The best choice here is PDF.

I'm using Inkscape to do the conversion process with the following command...

    inkscape -f file.svg -A file.pdf

You may need to set up your paths and patch your inkscape script to make this work. See http://zkwarl.blogspot.co.uk/2006/08/inkscape-tip-use-inkscape-on-command.html and it's comments for more info.