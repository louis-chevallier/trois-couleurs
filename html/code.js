


import * as math from 'mathjs';

const List = (x) => Array.from(x);

// Generic dimension sizes types
const ROWS = 2;
const COLS = 3;
const A = math.zeros([ROWS, COLS]);
const B = math.zeros([COLS, ROWS]);
const C = math.multiply(A, B);


const crotf_ = (x) => -(x ** 3) / 3 + x ** 2 / 2 + 11 * x / 6;
const crot2f_ = (x) => -2 * x ** 3 / 3 + 5 * x ** 2 / 2 - 5 * x / 6;

const crotf = (x) => Math.round(crotf_(x));
const crot2f = (x) => Math.round(crot2f_(x));

const ar = (x) => Array.from(x);
const aa1 = ar([0, 1, 2, 3]);

const DDD = 1;
const DN = DDD, DM = DDD; // DN == DM car le calcul de symetries l'obligent
const taille_plateau = [DN, DM];
console.assert(DN === DM); // on veut un tableau carré because, on gere pas les rotations autrement

const TT = Array(DN).fill().map(() => Array(DM).fill(0));
EKON(taille_plateau);

let factors = Array.from({ length: DN * DM }, (_, i) => 4 ** i);
factors = math.reshape(factors, [DN, DM]);

const colors = new Set([1, 2, 3]);

function hh(b) {
    const xx = math.multiply(b, factors);
    return math.sum(xx);
}

function random() {
    const b = math.random([DN, DM]).map(row => row.map(val => Math.round(val * 3)));
    return b;
}

const aa = random();

function zero() {
    return Array(DN).fill().map(() => Array(DM).fill(0));
}

function normal(bb) {
    const emp = bb.flat().filter(x => x === 0).length;
    if (emp === DN * DM) {
        return 0;
    }
    
    const b = bb;
    const b1 = b.reverse();
    const b2 = b[0].map((_, colIndex) => b.map(row => row[colIndex])).reverse();
    const b3 = b.map((row, rowIndex) => row.map((_, colIndex) => b[b.length - 1 - colIndex][rowIndex]));
    const b4 = b3.map((row, rowIndex) => row.map((_, colIndex) => b3[b3.length - 1 - colIndex][rowIndex]));
    const b5 = b4.map((row, rowIndex) => row.map((_, colIndex) => b4[b4.length - 1 - colIndex][rowIndex]));
    const b6 = b[0].map((_, colIndex) => b.map(row => row[colIndex]));
    const b7 = b.map(row => row.reverse()).map((row, rowIndex) => row.map((_, colIndex) => b[rowIndex][b[rowIndex].length - 1 - colIndex]));
    
    const l = [b, b1, b2, b3, b4, b5, b6, b7];
    const l0 = l;
    const l1 = l.map(crotf);
    const l2 = l1.map(crotf);
    const l3 = l.map(crot2f);
    const l4 = l3.map(crotf);
    const l5 = l1.map(crot2f);
    const ss = [...l0, ...l1, ...l2, ...l3, ...l4, ...l5].map(hh);
    ss.sort();
    return ss[0];
}

let node_number = 0;
function inc() {
    return node_number++;
}

class Node {
    constructor(b, father = null) {
        this.number = inc();
        this.board = b;
        this.losing = "?"; // pour celui qui doit jouer dans cette position
        this.father = father;
        this.children = [];
        this.friend = null;
        
        if (father !== null) {
            father.children.push(this);
        }
    }

    name() {
        return "n" + this.number;
    }

    chain(ref) {
        console.assert(this.friend === null);
        this.friend = ref;
    }

    empty() {
        return this.board.flatMap((row, rowIndex) => row.map((val, colIndex) => (val === 0 ? [rowIndex, colIndex] : null))).filter(x => x);
    }

    neighbours(c, filled = true) {
        const [y, x] = c;
        let l = [[y, x + 1], [y, x - 1], [y + 1, x], [y - 1, x]];

        if (filled) {
            l = l.filter(([yy, xx]) => xx >= 0 && xx < DM && yy >= 0 && yy < DN && this.board[yy][xx] > 0);
        } else {
            l = l.filter(([yy, xx]) => xx >= 0 && xx < DM && yy >= 0 && yy < DN && this.board[yy][xx] === 0);
        }
        return l;
    }

    possible_moves() {
        const e = this.empty();
        const res = [];
        for (const c of e) {
            const nb = this.neighbours(c, true);
            const nbT = nb.map(([yy, xx]) => [yy, xx]);
            let colors_available;
            if (nbT.length === 0) {
                colors_available = colors;
            } else {
                const colors_around = new Set(nbT.map(([yy, xx]) => this.board[yy][xx]));
                colors_available = new Set([...colors].filter(x => !colors_around.has(x)));
            }
            for (const e of colors_available) res.push([c, e]);
        }
        return res;
    }

    eq(nn) {
        return nn === this.board.flat().join('');
    }

    level() {
        return DN * DM - this.board.flat().filter(x => x === 0).length;
    }

    apply(m) {
        const [[y, x], col] = m;
        const b = this.board.map(row => row.slice());
        b[y][x] = col;
        return b;
    }
}

let max_front = 1;
let min_empty_cells = DN * DM * 12;

const cc = [];

function parse(r, tab) {
    if (normal(r) in seen) {
        r = seen[normal(r)];
    }

    const p = `\n${tab}losing=${r.losing}\n${tab}level=${r.level()}\n${tab}${r.board[0]}\n${tab}${r.board[1]}`;
    const ss = r.children.map(c => parse(c, tab + '\t')).join('');
    return p + ss;
}

function dump(n, t = "") {
    EKON(normal(n.board), n.level());
    for (const e of n.children) {
        dump(e, t + "\t");
    }
}

function check(r, father) {
    if (father !== null) {
        console.assert(father.level() === r.level() - 1);
    }
    r.children.forEach(c => check(c, r));
}

let step_count = 0;
function plus() {
    return step_count++;
}

function recursive_build(p) {
    const istep = plus();
    const nn = normal(p.board);

    const empy_cells_num = p.board.flat().filter(x => x === 0).length;

    if (empy_cells_num >= 0) {
        if (nn in seen) {
            console.assert(seen[nn].level() === p.level());
            p.chain(seen[nn]);
        } else {
            seen[nn] = p;
            const ms = p.possible_moves();
            if (ms.length === 0) {
                p.losing = true;
            } else {
                p.losing = true;
                for (const m of ms) {
                    const new_node = new Node(p.apply(m), p);
                    recursive_build(new_node);
                    if (new_node.losing) {
                        p.losing = false;
                        break;
                    }
                }
            }
        }
    } else {
        EKON(min_empty_cells, len(seen), nn, istep);
        EKOX(p.board);
    }
}

function solve(r) {
    if (r.friend !== null) {
        console.assert(r.number > r.friend.number);
        r.losing = r.friend.losing;
    } else {
        for (const c of r.children) {
            console.assert(r.level() + 1 === c.level());
            solve(c);
        }
        r.losing = r.children.every(c => !c.losing);
    }
}

node_number = 0;
const root = new Node(zero());
const seen = {};

EKOT("building recursif...");
recursive_build(root);
EKON(len(seen));
EKOX(step_count);
EKOX(node_number);
solve(root);
EKOX(root.losing);

node_number = 0;
const front = [root];
let step = 0;

if (false) {
    EKOT("building...");
    for (let istep = 0; istep < 999999; istep++) {
        const p = front.shift();
        const nn = normal(p.board);

        const empy_cells_num = p.board.flat().filter(x => x === 0).length;

        if (empy_cells_num >= 0) {
            if (nn in seen) {
                console.assert(seen[nn].level() === p.level());
                p.chain(seen[nn]);
            } else {
                seen[nn] = p;
                const ms = p.possible_moves();
                if (ms.length === 0) {
                    p.losing = true;
                } else {
                    const nexts = ms.map(m => new Node(p.apply(m), p));
                    front.push(...nexts);
                }
            }
            step++;
            max_front = Math.max(max_front, front.length);
            cc.push(front.length);
        } else {
            EKON(min_empty_cells, len(seen), nn, istep);
            EKOX(p.board);
        }

        if (front.length === 0) {
            EKO();
            break;
        }
    }

    EKON(node_number, max_front);
    EKON(len(seen), istep);
    EKO();
    check(root, null);
    EKO();
    solve(root);
    EKOX(root.losing);
}

function dot(r, fd) {
    const status = r.losing ? "L" : "W";
    const nrm = normal(r.board);
    const ref = nrm in seen ? "ref:" + seen[nrm].name() : "";
    const board = String(r.board);
    const bb = "";
    fd.write(`${r.name()} [ label="${r.name()} ${status} \\n ${bb} ${ref}"]`);
    for (const e of r.children) {
        fd.write(`n${r.number} -> n${e.number};\n`);
        dot(e, fd);
    }
}

if (false) {
    const f = fs.createWriteStream('dot.dot');
    f.write("digraph troiscouleurs {");
    dot(root, f);
    f.write("}");
}
