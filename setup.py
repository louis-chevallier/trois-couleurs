from setuptools import setup
from setuptools import Extension, setup
from Cython.Build import cythonize
from Cython.Compiler.Options import get_directive_defaults
directive_defaults = get_directive_defaults()

directive_defaults['linetrace'] = True
directive_defaults['binding'] = True


extensions = [
    Extension('source', ['trois_couleurs.py'], define_macros=[('CYTHON_TRACE', '1')])
]
setup(ext_modules=cythonize(extensions, gdb_debug=False))

