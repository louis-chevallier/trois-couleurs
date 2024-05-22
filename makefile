
compile : setup.py trois_couleurs.py
#	python setup.py build_ext --inplace
	cython trois_couleurs.py
	time python -c 'import trois_couleurs'

start :
	time python trois_couleurs.py


clean :
	rm -f trois_couleurs.c
	rm -fr build cython_debug *.so



