import numpy as np
from utillc import *
import sys
import sympy
from sympy import symbols


a,b,c,d,x = symbols("a,b,c,d,x", real=True)

eq = []

eq += [ a ]
eq += [ a + b   + c   + d        - 2] 
eq += [ a + 2*b + 4*c + 8*d      - 3] 
eq += [ a + 3*b + 9*c + 3*3*3*d  - 1]

s = sympy.solve(eq, [a,b,c,d])
EKOX(s)

b,c,d = 11/6, 1/2, -1/3

crot = lambda x : np.round(b*x + c*x*x + d*x*x*x).astype(int)

EKOX([ crot(x) for x in range(4)])


# la taille d'un plateau : N x N
N = 4

# 0 : vide, 1, 2, 3 les 3 couleurs

colors = set([1,2,3])

#board
def zero() :
    b = np.zeros(shape = (N, N)).astype(np.ubyte)
    return b


seen = {}

class Node :
    """
    coords : y,x
    """
    def __init__(self, b) :
        self.board = b

    def normal(self) :
        b = self.board
        b1 = np.flipud(b)
        b2 = np.fliplr(b)
        b3 = np.rot90(b)
        b4 = np.rot90(b3)
        b5 = b.T
        
        b = [ b, b1, b2, b3,  b4,  b5]
        b1 = [ crot(e) for e in b]
        b2 = [ crot(e) for e in b1]
        b3 = [ crot(e) for e in b2]
        ss = [ hash(e.tobytes()) for e in b + b1 + b2 + b3]
        ss = sorted(ss)
        return ss[0]
        

    def empty(self) :
        res = np.argwhere(self.board == 0)
        return res

    def neighbours(self, c, filled = True) :
        y, x = c
        l = [ (y, x+1), (y, x-1), (y+1, x), (y-1, x) ]

        if filled :
            l = [ (yy,xx) for (yy, xx) in l if xx >= 0 and xx < N and yy >= 0 and yy < N and self.board[yy, xx] > 0]

        else :
            l = [ (yy,xx) for (yy, xx) in l if xx >= 0 and xx < N and yy >= 0 and yy < N and self.board[yy, xx] == 0]
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

    def apply(self, m) :
        (y, x), col = m
        b = self.board.copy()
        b[y, x] = col
        return b

n = Node(zero())

step = 0
front = [n]
breadth_first = False
while(True) :
    #EKOX((step, len(front)))
    p = front.pop(0)
    nn = p.normal()
    if nn not in seen :
        seen[nn] = step
        ms = p.possible_moves()
        """
        if len(ms) == 0 and len(p.empty()) == 2:
            EKOX(p.empty())
            EKOX(len(p.empty()))
            EKOX(p.board)
        """

        #EKOX(ms)
        nexts = [ Node(p.apply(m)) for m in ms]
        if breadth_first :
            front = front + nexts
        else :
            front = nexts + front
        step += 1
    if len(front) == 0  :
        EKO()
        break
