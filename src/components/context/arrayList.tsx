export const searchList = [
    { name: "angle", sym: `<span style="color:pink"> &ang; </span>` },
    { name: "cube", sym: ` &NotCupCap; ` },
    { name: "notequal", sym: ` &NotCupCap; ` },
    { name: ">>", sym: ` &#8921; ` },
    { name: "divide", sym: ` &divide; ` },
    { name: "plus", sym: `  &plus;  ` },
    { name: "=", sym: ` <span style="color:green"> = </span> ` },
    { name: "-", sym: ` &minus; ` },
    { name: "return", sym: `<span style="color:green"> return </span> ` },
    { name: "sum", sym: ` &sum; ` },
    { name: "pi", sym: `<span style="color:blue" > &pi; </span>` },
    { name: "dot", sym: `&sdot;` },
    { name: "infinity", sym: `&infin;` },
    { name: "sqrt", sym: `<span style="color:red">&radic;</span>` },
    { name: "integral", sym: ` <span style="font-size:110%">&int;</span>` },
    { name: "empty", sym: `<span style="color:blue"> &empty; </span> ` },
    { name: "dbarrow", sym: `<span style="color:red"> &hArr; </span> ` },
    { name: "arrow", sym: `<span style="color:blue"> &rArr; </span> ` },
    { name: "lim", sym: ` lim &rArr;` },
    { name: "promise", sym: `<span style="color:red">$& </span>` },
    { name: "divide", sym: ` &#47; ` },
    { name: "function", sym: ` <span style="color:red">function</span> ` },

]

export function ConvertRes({ sym }: { sym: string }) {
    return (
        <p dangerouslySetInnerHTML={{ __html: sym }} />
    )
}