DEPLOY_DIR = /deploy
export DATE:=$(shell date +%Y-%m-%d_%Hh%Mm%Ss)
export HOST=$(shell hostname)
SHELL=bash
export GITINFO=$(shell git log --pretty=format:"%h - %an, %ar : %s" -1)


compile : setup.py trois_couleurs.py
#	python setup.py build_ext --inplace
	cython trois_couleurs.py
	time python -c 'import trois_couleurs'

start :
	time python trois_couleurs.py


clean :
	rm -f trois_couleurs.c
	rm -fr build cython_debug *.so

deploy :
	-git commit -a -m $(WOD)
	-git push
	-cd $(DEPLOY_DIR); rm -fr trois-couleurs; git clone  https://github.com/louis-chevallier/trois-couleurs.git

draw :
	
