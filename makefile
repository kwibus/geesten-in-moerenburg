SHELL := bash -O extglob
ROOT_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

ignore:=$(shell git ls-files --others -i --exclude-standard src)
src:=$(filter-out $(ignore) , $(shell cd $(ROOT_DIR); find src -type f))

js-source:=$(wildcard src/js/*)

other-src:= $(filter-out  $(js-source), $(src))
other-dist:= $(other-src:src/%=dist/%)

VPATH = $(ROOT_DIR)

# .PHONY: clean build 

build: dist/js/bundle.js $(other-dist) dist/
dist/:
	git clone -b gh-pages --single-branch $(ROOT_DIR) $(ROOT_DIR)/dist
	cd $(ROOT_DIR)dist ;\
	git remote set-url origin git@github.com:kwibus/geesten-in-moerenburg.git
	$(MAKE) clean
	

dist/js/bundle.js: $(js-source) dist/js
	browserify $(ROOT_DIR)src/js/map.js > $(ROOT_DIR)dist/js/bundle.js

dist/js: |  dist/
	mkdir -p $(ROOT_DIR)dist/js


dist/%: src/%
	install -D $(ROOT_DIR)$< $(ROOT_DIR)$@


clean:
	rm -rf $(ROOT_DIR)dist/!(.git|.|..)




