#!/bin/bash

md2html tutorial.txt > _tutorial.html 
cat header.html _tutorial.html | sed -e 's/<code>/<code class="javascript">/' >tutorial.html
rm _tutorial.html
