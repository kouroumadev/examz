import React from "react";
import Link from "next/link";
import Button from "../Button/button";
import Card from "../Cards/Card";

export default function SectionQuestion({ dataExams, indexActiveSection, urlBack, type, setActiveSection, setIndexActiveSection, activeSection }) {
  return (
    <>
      <div className="flex  gap-4 bg-white rounded-lg pt-4 px-4 mb-4">
        {dataExams.sections.map((item, index) => (
          <div key={index} className={` ${activeSection === item.name ? 'text-blue-1 border-b-2 border-blue-1 font-bold' : 'text-black-5'} cursor-pointer pb-4`} onClick={() => {
            setActiveSection(item.name)
            setIndexActiveSection(index)
          }}>
            {item.name}
          </div>
        ))}
      </div>
      <Card title={dataExams.name} >
        {dataExams.sections[indexActiveSection].questions.map((item, index) => (
          <div key={index}>
            {item.type === 'paragraph' && (
              <>
                <div className="flex">
                  {index + 1}.
                  <div className="text-container" dangerouslySetInnerHTML={{ __html: item?.instruction }} />
                </div>
                <div className="text-container ml-3" dangerouslySetInnerHTML={{ __html: item?.paragraph }} />
              </>
            )}
            {item.items.map((itemQuestion, indexQuestion) => {
              const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
              return (
                <div key={indexQuestion}>
                  <div className={`flex ${item.type === 'paragraph' && 'ml-4'} mt-2 `}>
                    {item.type === 'paragraph' ? indexQuestion + 1 : index + 1}.
                    <div className="text-container " dangerouslySetInnerHTML={{ __html: itemQuestion.question }} />
                  </div>
                  {itemQuestion.options.map((itemOptions, indexOption) => (
                    <div key={indexOption} className={`${item.type === 'paragraph' ? 'ml-8' : 'ml-4'}`}>
                      <span className="m-auto">{alphabet[indexOption]}. </span>
                      {itemOptions.title}
                    </div>
                  ))}
                  <p className={`${item.type === 'paragraph' ? 'ml-8' : 'ml-4'} text-blue-1 mt-2 font-bold `}>Answer :

                    {itemQuestion.options.map((itemOptions, indexOption) => {
                      return (
                        <span key={indexOption}> {itemOptions.correct === 1 && alphabet[indexOption]}</span>
                      )
                    })}
                  </p>
                </div>
              )
            })}
            <div className="border-b my-4" />
          </div>
        ))}
        <div className="flex flex-row-reverse ">
          <Link href={urlBack}>
            <a>
              <Button title={`Back to List ${type}`} />
            </a>
          </Link>
        </div>
      </Card>
    </>
  )
}