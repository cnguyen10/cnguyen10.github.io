window.onload = async function() {
    var bib;
    var eq_dict;

    bib = await generate_bibliography();
    parse_citep(bib);

    eq_dict = await number_equations();
    parse_eqref(eq_dict);
}

async function generate_bibliography () {
    const Cite = require('citation-js');
    var my_bib = new Cite();
    // var options = {
    //     format: 'string',
    //     type: 'html'
    // }
    var bib_div;
    var raw_bibtex;

    raw_bibtex = document.getElementById('raw-bibtex').textContent;
    my_bib.add(raw_bibtex.replace(/(\r\n|\n|\r|\\\n)/gm, ""));

    let output = my_bib.format('bibliography', {
    format: 'html',
    template: 'harvard',
    lang: 'en-US',
    prepend ({id}) { return `<li><a name="${id}" style="text-decoration: none;">`},
    append () { return "</a></li>"}
    });

    bib_div = document.getElementById('bibliography');

    bib_div.innerHTML = output;

    return my_bib;
}

async function parse_citep(bib_csl) {
    // search for \citep{} and replace by corresponding citation
    // to make the web run fast, \citep is enclosed within Katex identifier \(\citep{}\)
    var cite_spans = document.querySelectorAll('span[data-cite]');
    var parent_span;
    var list_citations;
    var cite_text;

    for (var i = 0; i < cite_spans.length; i++) {
        // get citation text
        list_citations = cite_spans[i].innerText.split(";");
        cite_text = "(";
        list_citations.forEach(element => {
            temp = bib_csl.format('citation', {format: 'html', template: 'harvard', lang: 'en-US', entry: element});
            cite_text += "<a href=#" + element + ">";
            cite_text += temp.slice(1, -1);
            cite_text += "</a>";
        });
        cite_text += ")";
        cite_text = cite_text.replace("</a><a", "</a>, <a");

        // get parent node and update content
        parent_span = cite_spans[i].closest('span > span.katex').parentNode;
        parent_span.innerHTML = cite_text;
    }
}

async function number_equations(){
    var equations = document.querySelectorAll('[id^=eq]');
    var eq_dict = {};
    for (var i = 0; i < equations.length; i++) {
        equations[i].innerHTML = i + 1;
        equations[i].setAttribute("name", equations[i].id);
        
        // add the equation into a list of key-value pair: id = counter_value
        eq_dict[equations[i].id] = i + 1;
    }
    return eq_dict;
}

async function parse_eqref(eq_dict) {
    // parse the text "\(\eqref{eq:*}\)" to an equation number
    // Args:
    //    eq_dict: eq_id = eq_number

    var parent_span;
    var eq_id;
    var equation_spans = document.querySelectorAll('span[data-equation]');
    console.log(equation_spans.length);
    for (var i = 0; i < equation_spans.length; i++) {
        eq_id = equation_spans[i].innerText.replace("−", "-");

        // get parent node and update content
        if (eq_id in eq_dict) {
            parent_span = equation_spans[i].closest('span > span.katex').parentNode;
            parent_span.innerHTML = "<a style=\"text-decoration: none;\" href=\"#" + eq_id + "\">(" + eq_dict[eq_id] + ")</a>";
        }
    }
}