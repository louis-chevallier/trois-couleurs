
import { w2form, query, w2utils, w2ui, w2popup, w2alert } from 'https://rawgit.com/vitmalina/w2ui/master/dist/w2ui.es6.min.js'

let people = [
    { id: 1, text: 'Adams, John' },
    { id: 2, text: 'Johnson, Peter' },
    { id: 3, text: 'Lewis, Frank' },
    { id: 4, text: 'Cruz, Steve' },
    { id: 5, text: 'Donnun, Nick' }
]



import { w2grid } from 'https://rawgit.com/vitmalina/w2ui/master/dist/w2ui.es6.min.js'

let grid = new w2grid({
    name: 'grid',
    box: '#grid',
    url: 'data/list.json',
    method: 'GET', // need this to avoid 412 error on Safari
    columns: [
        { field: 'fname', text: 'First Name', size: '30%' },
        { field: 'lname', text: 'Last Name', size: '30%' },
        { field: 'email', text: 'Email', size: '40%' },
        { field: 'sdate', text: 'Start Date', size: '120px' }
    ]
});

/*
let form = new w2form({
    box: '#form',
    name: 'form',
    url: 'server/post',
    header: 'Field Types',
    record: {
        simple: {
            text: 'default text value',
            alpha: 'ABC123',
            int: null,
            float: 0
        },
        single: {
            check: true,
            toggle: true
        },
        list: 3,
        enum: [1, 4]
    },
    fields: [
        { field: 'simple.alpha', type: 'alphaNumeric',
          html: { label: 'Alpha Numeric', attr: 'style="width: 300px"' }
        },
        { field: 'simple.text', type: 'text',
          html: { label: 'Text', attr: 'style="width: 300px"' }
        },
        { field: 'simple.int', type: 'int',
          html: { label: 'Integer', attr: 'style="width: 60px"' },
          options: { arrows: true, min: 0, max: 50 }
        },
        { field: 'simple.float', type: 'float',
          html: { label: 'Float', attr: 'style="width: 60px"' },
          options: { arrows: true, format: true, precision: 2, min: 0, max: 50, step: 0.1 }
        },
        { field: 'date.date', type: 'date',
          html: { label: 'Date', attr: 'style="width: 90px"', text: ' @time' }
        },
        { field: 'date.time', type: 'time',
          html: { anchor: '@time', label: 'Time ', attr: 'style="width: 90px"' }
        },
        { field: 'date.datetime', type: 'datetime',
          html: { label: 'Date & Time' }
        },
        { field: 'list', type: 'list',
          html: { label: 'List' },
          options: { items: w2utils.clone(people) }
        },
        { field: 'enum', type: 'enum',
          html: { label: 'Multiple', attr: 'style="width: 400px"' },
          options: { openOnFocus: true, items: w2utils.clone(people) }
        },
        { field: 'file', type: 'file',
          html: { label: 'Files', attr: 'style="width: 400px"' },
          options: { maxHeight: 100 }
        },
        { field: 'textarea', type: 'textarea',
          html: { label: 'Text Area', attr: 'style="width: 400px; height: 60px; resize: none"' }
        },
        { field: 'select', type: 'select', required: false,
          html: { label: 'Select', text: ' <-- regular drop down' },
          options: { items: ['fist', 'second'] }
        },
        { field: 'single.check', type: 'checkbox',
          html: { label: 'Check box' }
        },
        { field: 'single.toggle', type: 'toggle',
          html: { label: 'Toggle' }
        },
        { field: 'checks', type: 'checks',
          html: { label: 'Check Boxes' },
          options: { items: ['Check 1', 'Check 2', 'Check 3', 'Check 4'] }
        },
        { field: 'radio', type: 'radio',
          html: { label: 'Radio Box' },
          options: { items: ['Radio 1', 'Radio 2', 'Radio 3', 'Radio 4'] }
        }
    ],
    actions: {
        Reset() {
            this.clear();
        },
        Save() {
            if (form.validate().length == 0) {
                w2popup.open({
                    title: 'Form Data',
                    with: 600,
                    height: 550,
                    body: `<pre>${JSON.stringify(this.getCleanRecord(), null, 4)}</pre>`,
                    actions: { Ok: w2popup.close }
                })
            }
        },
        custom: {
            text: '<span style="font-size: 16px">←</span> click to see data',
            class: 'custom-class',
            style: 'background-image: none; background-color: transparent; border: 0px; margin: 0 0 0 -10px;',
            onClick() {
                w2alert('Not me!! The other button')
            }
        }
    }
})
*/
;

//import * as math from 'mathjs';

const List = (x) => Array.from(x);

// Generic dimension sizes types
const ROWS = 2;
const COLS = 3;
const A = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
const B = Array.from({ length: COLS }, () => Array(ROWS).fill(0));
const C = math.multiply(A, B);

// Placeholder for utillc.print_everything()
console.log("Print everything function called");

function rot_func(t) {
    const [p1, p2, p3] = t;
    const a = math.symbol('a');
    const b = math.symbol('b');
    const c = math.symbol('c');
    const d = math.symbol('d');
    const x = math.symbol('x');
    
    const eq = [
        a,
        math.add(math.add(math.add(a, b), c), d).subtract(p1),
        math.add(math.add(math.add(a, math.multiply(2, b)), math.multiply(4, c)), math.multiply(8, d)).subtract(p2),
        math.add(math.add(math.add(a, math.multiply(3, b)), math.multiply(9, c)), math.multiply(27, d)).subtract(p3)
    ];
    
    const p = math.add(a, math.add(math.multiply(b, x), math.add(math.multiply(c, math.pow(x, 2)), math.multiply(d, math.pow(x, 3)))));
    const s = math.solve(eq, [a, b, c, d]);
    
    const f1 = (x) => p.subs(s);
    
    return f1;
}

const crotf_ = rot_func([2, 3, 1]);
const crot2f_ = rot_func([1, 3, 2]);
const crotf = (x) => Math.round(crotf_(x)).toString(2);
const crot2f = (x) => Math.round(crot2f_(x)).toString(2);

const ar = (x) => Array.from(x);
const aa1 = ar([0, 1, 2, 3]);

const DDD = 4;
const DN = DDD, DM = DDD; // DN == DM car le calcul de symetries l'obligent
const taille_plateau = [DN, DM];
console.assert(DN === DM); // on veut un tableau carré because, on gere pas les rotations autrement

const TT = Array.from({ length: DN }, () => Array(DM).fill(0));
console.log("EKON called with taille_plateau");

let factors = Array.from({ length: DN * DM }, (_, i) => Math.pow(4, i));
factors = Array.from({ length: DN }, (_, i) => factors.slice(i * DM, (i + 1) * DM));

// codage des couleurs
const colors = new Set([1, 2, 3]);

function hh(b) {
    const xx = b.map((row, i) => row.map((val, j) => val * factors[i][j])).flat();
    return xx.reduce((acc, val) => acc + val, 0);
}

function random() {
    const b = Array.from({ length: DN }, () => Array.from({ length: DM }, () => Math.round(Math.random() * 3)));
    return b;
}

const aa = random();

function zero() {
    return Array.from({ length: DN }, () => Array(DM).fill(0));
}

function normal(bb) {
    const emp = bb.flat().filter(x => x === 0).length;
    if (emp === DN * DM) {
        return 0;
    }
    
    const b = bb;
    const b1 = b.map(row => row.slice().reverse());
    const b2 = b.map(row => row.reverse());
    const b3 = b[0].map((_, colIndex) => b.map(row => row[colIndex])).reverse();
    const b4 = b3.map(row => row.slice().reverse());
    const b5 = b4.map(row => row.slice().reverse());
    const b6 = b[0].map((_, colIndex) => b.map(row => row[colIndex]));
    const b7 = b.map(row => row.slice().reverse()).map(row => row.slice().reverse());
    
    const l = List([b, b1, b2, b3, b4, b5, b6, b7]);
    const l0 = l;
    const l1 = l.map(crotf);
    const l2 = l1.map(crotf);
    const l3 = l.map(crot2f);
    const l4 = l3.map(crotf);
    const l5 = l1.map(crot2f);
    const ss = [...l0, ...l1, ...l2, ...l3, ...l4, ...l5].map(hh).sort();
    return ss[0];
}

var node_number = 0;
function inc() {
    return node_number++;
}

class Node {
    constructor(b, father = null) {
        this.number = inc();
        this.board = b;
        this.losing = "?";
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
        return this.board.flatMap((row, y) => row.map((val, x) => (val === 0 ? [y, x] : null))).filter(Boolean);
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
            const nbTransposed = nb[0].map((_, colIndex) => nb.map(row => row[colIndex]));
            const colors_available = nbTransposed.length === 0 ? colors : new Set([...colors].filter(color => !new Set(nbTransposed.map(([yy, xx]) => this.board[yy][xx])).has(color)));
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

let cc = [];

function parse(r, tab) {
    if (normal(r) in seen) {
        r = seen[normal(r)];
    }

    const p = `\n${tab}losing=${r.losing}\n${tab}level=${r.level()}\n${tab}${r.board[0]}\n${tab}${r.board[1]}`;
    const ss = r.children.map(c => parse(c, tab + '\t')).join('');
    return p + ss;
}

function dump(n, t = "") {
    console.log(normal(n.board), n.level());
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
        console.log(min_empty_cells, seen.length, nn, istep);
        console.log(p.board);
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

console.log("building recursif...");
recursive_build(root);
console.log(seen.length);
console.log(step_count);
console.log(node_number);
solve(root);
console.log(root.losing);

