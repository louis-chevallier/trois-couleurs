
start :
	python trois_couleurs.py
	python setup.py build_ext --inplace
	cython trois_couleurs.py
	python -c 'import trois_couleurs'


