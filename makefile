
start :
	time python trois_couleurs.pyx
	python setup.py build_ext --inplace
	cython trois_couleurs.pyx
	time python -c 'import trois_couleurs'


