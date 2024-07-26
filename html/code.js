  
<script type="module">
  import { w2form, query, w2utils, w2ui, w2popup, w2alert } from 'https://rawgit.com/vitmalina/w2ui/master/dist/w2ui.es6.min.js'

let people = [
    { id: 1, text: 'Adams, John' },
    { id: 2, text: 'Johnson, Peter' },
    { id: 3, text: 'Lewis, Frank' },
    { id: 4, text: 'Cruz, Steve' },
    { id: 5, text: 'Donnun, Nick' }
]
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
});
</script>
