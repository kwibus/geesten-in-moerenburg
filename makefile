
ROOT_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
export PATH:="$(ROOT_DIR)node_modules/.bin/:$(PATH)"

SHELL :=/bin/bash -O extglob

ignore:=$(shell git ls-files --others -i --exclude-standard src)
src:=$(filter-out $(ignore) , $(shell cd $(ROOT_DIR); find src -type f))

js-source:=$(wildcard src/js/*)
css-dir:=src/css
css-map-source:=\
   node_modules/sweetalert2/dist/sweetalert2.min.css\
   node_modules/leaflet-easybutton/src/easy-button.css\
   node_modules/leaflet/dist/leaflet.css\
   $(css-dir)/leaflet-sidebar.css\
   $(css-dir)/spel.css\
   $(css-dir)/Leaflet.Photo.css\


other-src:= $(filter-out  $(js-source) $(css-map-source), $(src))
other-dist:= $(other-src:src/%=dist/%)

leaflet-images-src:=$(wildcard node_modules/leaflet/dist/images/*)
leaflet-images-dist:=$(leaflet-images-src:node_modules/leaflet/%=%)

VPATH = $(ROOT_DIR)

# .PHONY: clean build

build: dist/js/bundle.js dist/css/spel.css $(other-dist) $(leaflet-images) $(leaflet-images-dist) | dist/

dist/:
	git clone -b gh-pages --single-branch $(ROOT_DIR) $(ROOT_DIR)/dist
	cd $(ROOT_DIR)dist ;\
	git remote set-url origin git@github.com:kwibus/geesten-in-moerenburg.git
	$(MAKE) clean


dist/js/bundle.js: $(js-source) dist/js
	browserify -g uglifyify $(ROOT_DIR)src/js/map.js > $(ROOT_DIR)dist/js/bundle.js

dist/js: |  dist/
	mkdir -p $(ROOT_DIR)dist/js


dist/css: |  dist/
	mkdir -p $(ROOT_DIR)dist/css

dist/css/spel.css:  $(css-map-source) | dist/css
	PATH=$(PATH) ;cleancss -o $(ROOT_DIR)/dist/css/spel.css $(css-map-source)

dist/css/%.min.css:  src/css/%.min.css | dist/css
	cp  $(ROOT_DIR)$< $(ROOT_DIR)$@

dist/css/%.css:  src/css/%.css | dist/css
	PATH=$(PATH);cleancss -o  $(ROOT_DIR)$@ $(ROOT_DIR)$<


dist/images: |  dist/
	mkdir -p $(ROOT_DIR)dist/images

dist/images/%: node_modules/leaflet/dist/images/% |   dist/images
	cp $(ROOT_DIR)$< $(ROOT_DIR)$@

dist/%: src/%
	install -D $(ROOT_DIR)$< $(ROOT_DIR)$@

clean:
	rm -rf $(ROOT_DIR)dist/!(.git|.|..)

test:
	echo $(PATH)
	echo $$PATH


