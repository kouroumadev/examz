import {useEffect, useState} from 'react';
import $ from "jquery";
import katex from "katex";
import dynamic from "next/dynamic";

const QuillEditor = dynamic(
    () => import("./QuillEditor").then((mod) => mod.default),
    {ssr: false, loading: () => <p>Editor loading ...</p>}
);

if (typeof window !== "undefined") {
    window.katex = katex;
    window.jQuery = window.$ = $;
    const mathquill4quill = require("mathquill4quill");
    require("mathquill/build/mathquill.js");
}

const CUSTOM_OPERATORS = [
    ["\\pm", "\\pm"],
    ["\\sqrt{x}", "\\sqrt"],
    ["\\sqrt[3]{x}", "\\sqrt[3]{}"],
    ["\\sqrt[n]{x}", "\\nthroot"],
    ["\\frac{x}{y}", "\\frac"],
    ["\\sum^{s}_{x}{d}", "\\sum"],
    ["\\prod^{s}_{x}{d}", "\\prod"],
    ["\\coprod^{s}_{x}{d}", "\\coprod"],
    ["\\int^{s}_{x}{d}", "\\int"],
    ["\\binom{n}{k}", "\\binom"],
    ["{x}^{y}", "\\superscript"],
    ["{x}_{y}", "\\subscript"],
];

export default function Quill({
                                  readOnly = false,
                                  data = false,
                                  type = "",
                                  subType = "",
                                  setData = false,
                                  className,
                                  register = false,
                                  render
                              }) {
    const [text, setText] = useState()
    const [operators, setOperators] = useState(CUSTOM_OPERATORS);
    const [displayHistory, setDisplayHistory] = useState(false);
    const [dataDefault, setDataDefault] = useState()
    const options = {displayHistory, operators};
    useEffect(() => {
        if (setData !== false) {
            setData(text)
        }
        if (register !== false) {
            register(text)
        }
    }, [text, render])

    useEffect(() => {
        if (setData !== false) {
            setData(data)
            setDataDefault(data)
        }
        if (register !== false) {
            register(data)
            setDataDefault(data)
        }
    }, [data])

    return (
        <div className={`${className} bg-white`} data-type={type} data-subType={subType}>
            {data !== false && (
                <QuillEditor readOnly={readOnly} data={data} options={options} setText={(data) => setText(data)}/>
            )}
        </div>
    );
};