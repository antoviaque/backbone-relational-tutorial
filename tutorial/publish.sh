#!/bin/bash

markdown_py tutorial.txt > _tutorial.html 
cat header.html _tutorial.html | sed -e 's/<code>/<code class="javascript">/' >tutorial.html
