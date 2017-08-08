#!/usr/bin/env sh

if [ -d _site ] && [ -f _includes/main.css ] ; then
    exit
elif [ ! -f _includes/main.css ] ; then
    touch _includes/main.css # Liquid quits if include not found
fi

bundle exec jekyll build --trace --strict_front_matter
