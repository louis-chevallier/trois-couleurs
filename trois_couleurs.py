
import numpy as np
from utillc import *
import sys
import sympy
from sympy import symbols, lambdify, Integer
import matplotlib.pyplot as plt 
from typing import TypeVar
import numpy as np
from numpy.typing import NDArray
import numpy
from numba import jit
from numba import njit
from itertools import chain
#from numba.typed import List as List
List = lambda x : list(x)

from typing import Literal, Tuple, TypeVar
# Generic dimension sizes types
T1 = TypeVar("T1", bound=int)
T2 = TypeVar("T2", bound=int)
T3 = TypeVar("T3", bound=int)

# Dimension types represented as typles
Shape = Tuple
Shape1D = Shape[T1]
Shape2D = Shape[T1, T2]
Shape3D = Shape[T1, T2, T3]

ROWS = Literal[2]
COLS = Literal[3]
A: NDArray[Shape2D[ROWS, COLS]] = np.zeros((2,3))
B: NDArray[Shape2D[COLS, ROWS]] = np.zeros((3,2))
C: NDArray[Shape2D[ROWS, ROWS]] = np.dot(A, B)


utillc.print_everything()
EKO()

import inspect, os

"""
 rotation les couleurs

crot
# 0 => 0
# 1 => 2
# 2 => 3
# 3 => 1

et
 crot2
# 0 => 0
# 1 => 1
# 2 => 3
# 3 => 2

 on a tout par : x, crot(x), crot(crot(x)), crot2(x), crot(crot2(x)), crot(crot(crot2(x)))

"""

def rot_func(t) :
    """
    calcul d'une rotation des couleurs en utilisant un polynome
    p(x) = a + b x + c x*x + d * x*x*x
    p(0) -> 0 - c'est le codage d'une case vide qui doit rester vide
    p(1) -> p1, p(2) -> p2, p(3) -> p3
    on determine les coefs en fournissant les pi ( dans le param t)
    """
    a,b,c,d,x = symbols("a,b,c,d,x", real=True)
    pol = symbols("pol", integer=True)
    p1, p2, p3 = t
    eq = []
    eq += [ a ]
    eq += [ a + b   + c   + d        - p1] 
    eq += [ a + 2*b + 4*c + 8*d      - p2] 
    eq += [ a + 3*b + 9*c + 3*3*3*d  - p3]
    
    p = a + b*x + c*x*x + d*x*x*x
    s = sympy.solve(eq, [a,b,c,d])
    EKOX(s)
    EKOX(p.subs(s))
    #f1 = lambdify([ a, b, c, d], s, "numpy")

    f1 = lambdify([ x ], p.subs(s), "numpy")
    
    EKOX(t)
    EKOX(f1(1))
    EKOX(f1(2))
    EKOX(f1(3))
    
    f1j = jit(f1, nopython=True)
    return f1j


# pour construire toutes les variantes équivalentes en couleur d'une position
EKO()
crotf_ =  rot_func((2, 3, 1))
crot2f_ = rot_func((1, 3, 2))
crotf = lambda x : np.round(crotf_(x)).astype(np.uint8) 
crot2f = lambda x : np.round(crot2f_(x)).astype(np.uint8)

ar = lambda x : np.asarray(x)
aa = ar((0, 1,2,3))


EKOX(aa)
EKOX(crotf(aa))
EKOX(crotf(crotf(aa)))
EKOX(crot2f(aa))
EKOX(crotf(crot2f(aa)))
EKOX(crot2f(crotf(aa)))

EKON([ crotf(x) for x in range(4)])
EKOX([ crot2f(x) for x in range(4)])

DDD = 4

DN,DM = DDD, DDD # DN == DM car le calcul de symetries l'obligent
EKOT('cc')
DN_ = Literal[DN]
DM_ = Literal[DM]
EKOT('bb')
# la taille d'un plateau : N x N
TT = NDArray[Shape2D[DN_, DM_]]
EKOT('aa')

factors = [ 4**i for i in range(DN*DM)]
EKOX(factors[-1])
EKOX(pow(factors[-1], 1/(DN*DM - 1)))
EKOX(('factors', factors))
factors = np.asarray(factors).reshape((DN, DM))
EKOX(factors.shape)
EKOX(('factors', factors))

# codage des couleurs
# 0 : vide, 1, 2, 3 les 3 couleurs

colors = set([1,2,3])

# codage d'une position : le tableau => un nombre
def hh(b : TT) -> numpy.int64 :
    xx = b * factors
    return xx.sum()


# random board
def random() -> TT :
    b = np.random.uniform(0, 3, size=(DN, DM)).round().astype(np.uint8)
    return b

aa = random()
EKOX(hh(aa))
EKOX(hh(crotf(aa)))
EKOX(hh(crotf(crotf(aa))))
EKOX(hh(crot2f(aa)))
EKOX(hh(crotf(crot2f(aa))))
EKOX(hh(crot2f(crotf(aa))))

#board vide
def zero() -> TT :
    b = np.zeros(shape = (DN, DM)).astype(np.uint8)
    return b

#@jit(nopython=True)
def normal(bb : TT) -> numpy.int64:
    """
    calcule une représentation unique quelquesoit les variantes qui sont équivalentes
    => par rotation symetries
    => par changement de couleur
    """
    emp = (bb == 0).sum()
    if emp == DN*DM :
        return 0
    
    b = bb
    b1 = np.flipud(b); 
    b2 = np.fliplr(b); 
    b3 = np.rot90(b); 
    b4 = np.rot90(b3);
    b5 = np.rot90(b4); 
    b6 = b.T; 
    b7 = b[::-1, ::-1].T; 

    l = List([ b, b1, b2, b3,  b4,  b5, b6, b7])
    l0 = l
    l1 = map(crotf, l)
    l2 = map(crotf, l1)
    l3 = map(crot2f, l)
    l4 = map(crotf, l3)
    l5 = map(crot2f, l1)    
    ss = map(hh, chain(l0, l1, l2, l3, l4, l5))
    ss = sorted(ss)
    return ss[0]

"""
aa = np.asarray([[ 1,2,3,1],
                 [ 1,0,0,0],
                 [ 1,1,0,0],
                 [ 1,0,0,0]])
EKOX(normal(aa))
aa = np.asarray([[ 1,2,3,2],
                 [ 1,0,0,0],
                 [ 1,1,1,0],
                 [ 1,0,0,0]])
EKOX(normal(aa))
aan = Node(aa)
ms = aan.possible_moves()
nexts = [ aan.apply(m) for m in ms]
#EKOX(nexts)
"""

node_number = 0
def inc() :
    global node_number
    x = node_number
    node_number += 1
    return x


class Node :
    """
    les noeuds de l'arbre
    coords dans le tableau: y,x
    """
    
    def __init__(self, b: TT, father = None) :
        self.number = inc()
        self.board = b
        self.losing = "?" # pour celui qui doit jouer dans cette position
        self.father = father
        self.children = []
        
        # les noeuds équivalents sont chainés entre eux
        self.friend = None
        
        if father is not None :
            father.children.append(self)

    def name(self) :
        return "n" + str(self.number) 

            
    def chain(self, ref) :
        assert(self.friend == None)
        self.friend = ref
        
    def empty(self) -> NDArray :
        res = np.argwhere(self.board == 0)
        return res

    def neighbours(self, c : NDArray, filled = True) -> list:
        """
        cases voisines de c
        """
        y, x = c
        l = [ (y, x+1), (y, x-1), (y+1, x), (y-1, x) ]

        if filled :
            l = [ (yy,xx) for (yy, xx) in l if
                  xx >= 0 and xx < DM and yy >= 0 and yy < DN and self.board[yy, xx] > 0]
        else :
            l = [ (yy,xx) for (yy, xx) in l if
                  xx >= 0 and xx < DM and yy >= 0 and yy < DN and self.board[yy, xx] == 0]
        return l

    def possible_moves(self) :
        """
        les positions atteignables à partir de celle là
        """
        e = self.empty()
        res = []
        for c in e :
            nb = self.neighbours(c, filled = True)
            nb = np.asarray(nb).T
            if len(nb) == 0 :
                colors_available = colors
            else :
                colors_around = set(self.board[tuple(nb)])
                colors_available = colors - colors_around
            for e in colors_available : res += [ ( c, e) ]
        return res

    def eq(self, nn) :
        return nn == ''.join(map(str,self.board.flatten()))

    def level(self) :
        return DN*DM - (self.board == 0).sum()
    
    def apply(self, m : tuple) -> np.array :
        (y, x), col = m
        b = self.board.copy()
        b[y, x] = col
        return b


max_front = 1
min_empty_cells = DN*DM * 12
breadth_first = False # otherwise depth first
cc=[]
EKO()

def parse(r, tab) :
    if normal(r) in seen :
        r = seen[normal(r)]

    p = ('\n' + tab + 'losing=' + str(r.losing) +
         '\n' + tab + 'level=' + str(r.level()) +    
         '\n' + tab + str(r.board[0]) +
         '\n' + tab + str(r.board[1]))
    ss = ''.join([ parse(c, tab + '\t') for c in r.children])
    return p + ss

        

def dump(n, t="") :
    EKON(normal(n.board), n.level())
    for e in n.children :
        dump(e, t+"\t")

def check(r, father) :
    if father is not None :
        assert(father.level() == r.level() - 1)
    #EKOX([( r.level(), c.level()) for c in r.children])
    [ check(c, r) for c in r.children]    


step_count = 0
def plus() :
    global step_count
    step_count += 1
    return step_count


def build(p : Node) :
    """
    recursive prog
    """
    istep = plus()
    nn = normal(p.board)

    empy_cells_num = (p.board == 0).sum()
    #EKON(empy_cells_num, min_empty_cells)
    if p.eq("1201") :    EKO()
    #EKOX(step)
    #EKOX(parse(root, ""))
    #check(root, None)

    if empy_cells_num >= 0 :
        if nn in seen :
            assert(seen[nn].level() == p.level())
            # on a déjà traité un noeud de clé identique : q = seen[nn]
            # pas besoin de poursuivre
            p.chain(ref = seen[nn]);
        else :
            seen[nn] = p            
            ms = p.possible_moves()
            if len(ms) == 0 :
                p.losing = True
            else :
                ls = []
                p.losing = True
                for m in ms :
                    new_node  = Node(p.apply(m), p)
                    build(new_node)
                    if new_node.losing :
                        p.losing = False
                        break
                    ls.append(new_node)
    else :
        # terminal node
        EKON(min_empty_cells, len(seen), nn, istep)
        EKOX(p.board)
        
def solve(r) :
    # friend must have been visited yet
    if r.friend is not None :
        r.losing = r.friend.losing
    else :
        for c in r.children :
            assert(r.level() + 1 == c.level())
            solve(c)
            # no children => empty list => True
        r.losing = all([ (not c.losing) for c in r.children])



root, seen = Node(zero()), {}

EKOT("re building...")
build(root)
EKOX(step_count)
EKOX(node_number)
solve(root)
EKOX(root.losing)

root, seen = Node(zero()), {}
front = [root]
step = 0
        
# construction de l'arbre en profondeur ou en largeur d'abord
EKOX(front[0].board)
EKOT("building...")
for istep in range(999999) :
    #EKOX((step, len(front)))
    p = front.pop(0)
    nn = normal(p.board)

    empy_cells_num = (p.board == 0).sum()
    #EKON(empy_cells_num, min_empty_cells)
    if p.eq("1201") :    EKO()
    #EKOX(step)
    #EKOX(parse(root, ""))
    #check(root, None)

    """
    if empy_cells_num < min_empty_cells :
        min_empty_cells = min(min_empty_cells, empy_cells_num)
        EKON(min_empty_cells, len(seen), len(front), istep)
        EKOX(p.board)
    """ 

    if empy_cells_num >= 0 :
        if nn in seen :
            assert(seen[nn].level() == p.level())

            # on a déjà traité un noeud de clé identique : q = seen[nn]
            # pas besoin de poursuivre
            p.chain(ref = seen[nn]);
            #EKOX(p.eq("1201"))
            #EKOX(step)
            #EKOX(seen[nn].board)
            #EKOX(p.board)
            #EKOX(parse(seen[nn], ''))
            #EKOX(parse(p, ''))
        else :
            seen[nn] = p            
            ms = p.possible_moves()
            if len(ms) == 0 :
                p.losing = True
            else :
                nexts = [ Node(p.apply(m), p) for m in ms]
                if breadth_first :
                    front = front + nexts
                else :
                    front = nexts + front

        #EKOX(len(seen))
        step += 1

        #if len(front) > max_front :        EKOX(len(front))
        max_front = max(max_front, len(front))
        cc.append(len(front))

        #if len(seen) > 10000 : break
        """
        if len(cc) % 100000  == 0:
            plt.plot(cc)
            plt.show()
        """
    else :
        # terminal node
        EKON(min_empty_cells, len(seen), nn, istep)
        EKOX(p.board)
        
    if len(front) == 0  :
        #EKOT("seen %d" % len(seen))
        #plt.plot(cc)
        #plt.show()
        EKO()
        break

EKOX(node_number)

EKON(len(seen), istep)
def dot(r, fd) :
    status = "L" if r.losing else "W"
    nrm = normal(r.board)
    ref = "ref:" + seen[nrm].name() if nrm in seen else ""
    board = str(r.board)
    bb = ""
    fd.write(r.name() + ' [ label="' + r.name() + " " + status + ' \\n ' + bb + " " + ref + '"]')
    for e in r.children :
        fd.write("n" + str(r.number) + " -> n" + str(e.number) + ";\n")
        dot(e, fd)



        
EKO()
check(root, None)
EKO()
solve(root)
EKOX(root.losing)




if False :
    with open('dot.dot', 'w') as f:
        f.write("digraph troiscouleurs {")
        dot(root, f)
        f.write("}")
    


#check(root, None, {})



#EKOX(parse(root, ""))






