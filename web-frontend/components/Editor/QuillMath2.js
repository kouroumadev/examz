import { useState } from "react";
import dynamic from "next/dynamic";
const QuillEditor = dynamic(
  () => import("./QuillEditor").then((mod) => mod.default),
  { ssr: false, loading: () => <p>Editor loading ...</p> }
);
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
  ["\\binom{n}{k}", "\\binom"]
];

export default function Home() {
  const [operators, setOperators] = useState(CUSTOM_OPERATORS);
  const [displayHistory, setDisplayHistory] = useState(true);
  const options = { displayHistory, operators };

  return (
    <div>
      <QuillEditor options={options}/>
    </div>
  );
}