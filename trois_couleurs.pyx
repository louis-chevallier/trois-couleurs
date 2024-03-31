
import numpy as np
from utillc import *
import sys
import sympy
from sympy import symbols
import matplotlib.pyplot as plt 
from typing import TypeVar
import numpy as np
from numpy.typing import NDArray

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
    a,b,c,d,x = symbols("a,b,c,d,x", real=True)
    p1, p2, p3 = t
    eq = []
    eq += [ a ]
    eq += [ a + b   + c   + d        - p1] 
    eq += [ a + 2*b + 4*c + 8*d      - p2] 
    eq += [ a + 3*b + 9*c + 3*3*3*d  - p3]

    s = sympy.solve(eq, [a,b,c,d])
    EKOX(s)
    b,c,d = map(float, (s[b], s[c], s[d]))
    EKOX((b,c,d))
    
    def crot(x : np.ndarray) -> np.ndarray:
        return np.round(b*x + c*x*x + d*x*x*x).astype(int)
    return crot

crot = rot_func((2, 3, 1))
crot2 = rot_func((1, 3, 2))

EKOX([ crot(x) for x in range(4)])
EKOX([ crot2(x) for x in range(4)])


N = 3
N_ = Literal[N]
# la taille d'un plateau : N x N
TT = NDArray[Shape2D[N_, N_]]

factors = [ 4**i for i in range(N*N)]
EKOX(factors)
factors = np.asarray(factors).reshape((N, N))
EKOX(factors)

# 0 : vide, 1, 2, 3 les 3 couleurs

colors = set([1,2,3])

#board
def zero() -> TT :
    b = np.zeros(shape = (N, N)).astype(np.ubyte)
    return b

def normal(bb) -> int:
    """
    calcule une représentation unique quelquesoit les variantes qui sont équivalentes
    => par rotation symetries
    => par changement de couleur
    """
    emp = (bb == 0).sum()
    if emp == N*N :
        return 0
    
    b = bb
    b1 = np.flipud(b); 
    b2 = np.fliplr(b); 
    b3 = np.rot90(b); 
    b4 = np.rot90(b3);
    b5 = np.rot90(b4); 
    b6 = b.T; 
    b7 = b[::-1, ::-1].T; 

    l = [ b, b1, b2, b3,  b4,  b5, b6, b7]
    l1 = [ crot(e) for e in l]
    l2 = [ crot(e) for e in l1]
    l3 = [ crot2(e) for e in l]
    l4 = [ crot(e) for e in l3]
    l5 = [ crot(e) for e in l4]
    
    def hh(b) :
        xx = b * factors
        return xx.sum()
    
    ss = [ hh(e) for e in l + l1 + l2 + l3 + l4 + l5 ]
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

class Node :
    """
    coords : y,x
    """
    def __init__(self, b: TT, father = None) :
        self.board = b
        self.losing = False
        self.father = father
        self.children = []
        if father is not None :
            father.children.append(self)
        
    def empty(self) -> NDArray :
        res = np.argwhere(self.board == 0)
        return res

    def neighbours(self, c : NDArray, filled = True) -> list:
        y, x = c
        l = [ (y, x+1), (y, x-1), (y+1, x), (y-1, x) ]

        if filled :
            l = [ (yy,xx) for (yy, xx) in l if
                  xx >= 0 and xx < N and yy >= 0 and yy < N and self.board[yy, xx] > 0]
        else :
            l = [ (yy,xx) for (yy, xx) in l if
                  xx >= 0 and xx < N and yy >= 0 and yy < N and self.board[yy, xx] == 0]
        return l

    def possible_moves(self) :
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
        return N*N - (self.board == 0).sum()
    
    def apply(self, m : tuple) -> np.array :
        (y, x), col = m
        b = self.board.copy()
        b[y, x] = col
        return b

root = Node(zero())
seen = {}

step = 0
front = [root]
max_front = 1
min_emp = N*N
breadth_first = True
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

def check(r, father, hh) :
    if normal(r.board) in seen :
        r = seen[normal(r.board)]

    assert(normal(r.board) not in hh)
    hh1 = dict(hh)
    hh1[normal(r.board)] = r
    #EKOX(r.level())
    if father is not None :
        assert(father.level() == r.level() - 1)
    #EKOX([( r.level(), c.level()) for c in r.children])
    [ check(c, r, hh1) for c in r.children]    

while(True) :
    #EKOX((step, len(front)))
    p = front.pop(0)
    nn = normal(p.board)

    emp = (p.board == 0).sum()

    if p.eq("1201") :    EKO()
    #EKOX(step)
    #EKOX(parse(root, ""))
    #check(root, None)
    if emp < min_emp :
        EKOT("min_emp %d, seen %d" % (min_emp, len(seen)))
    min_emp = min(min_emp, emp)

    if emp >= 0 :
        if nn in seen :
            assert(seen[nn].level() == p.level())
            #EKOX(p.eq("1201"))
            #EKOX(step)
            #EKOX(seen[nn].board)
            #EKOX(p.board)
            #EKOX(parse(seen[nn], ''))
            #EKOX(parse(p, ''))
        else :
            seen[nn] = p            
            ms = p.possible_moves()
            """
            if len(ms) == 0 and len(p.empty()) == 2:
                EKOX(p.empty())
                EKOX(len(p.empty()))
                EKOX(p.board)
            """
            #EKOX(ms)
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

        if len(seen) > 10000 :
            break

        if len(cc) % 100000  == 0:
            plt.plot(cc)
            plt.show()

    if len(front) == 0  :
        #EKOT("seen %d" % len(seen))
        #plt.plot(cc)
        #plt.show()
        EKO()
        break


def solve(r) :
    if normal(r.board) in seen :
        r = seen[normal(r.board)]
    for c in r.children :
        assert(r.level() + 1 == c.level())
        solve(c)
        r.losing = all([ (not c.losing) for c in r.children])

EKO()
check(root, None, {})
EKO()
solve(root)
EKOX(root.losing)


#EKOX(parse(root, ""))






