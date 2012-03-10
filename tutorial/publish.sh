#!/bin/bash

markdown_py tutorial.txt > _tutorial.html ; cat header.html _tutorial.html >tutorial.html
