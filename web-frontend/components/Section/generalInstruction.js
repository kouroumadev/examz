import Image from "next/image"
import Card from '../Cards/Card'

export default function GeneralInstruction() {
  const generalInstruction = ['The clock has been set at the server and the countdown timer at the top right corner of your screen will display the time remaining for you to complete the exam. When the clock runs out the exam ends by default - you are not required to end or submit your exam.', 'The question palette at the right of screen shows one of the following statuses of each of the questions numbered:']
  const markAnswer = [
    {
      icon: "/asset/icon/table/ic_not_visited.svg",
      desc: "You have not visited the question yet"
    },
    {
      icon: "/asset/icon/table/ic_not_answer.svg",
      desc: "You have not answered the question"
    },
    {
      icon: "/asset/icon/table/ic_not_answer_mark.svg",
      desc: "You have NOT answered the question but have marked the question for review"
    },
    {
      icon: "/asset/icon/table/ic_answer_mark.svg",
      desc: "You have answered the question but marked it for review"
    },
    {
      icon: "/asset/icon/table/ic_answer.svg",
      desc: "You have answered the question"
    },
  ]
  const stepAnswer = ['Click on the question number in the Question Palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question.', 'Click on Save and Next to save your answer for the current question and then go to the next question.', 'Click on Mark for Review and Next to save your answer for the current question and also mark it for review , and then go to the next question.', 'Note that your answer for the current question will not be saved, if you navigate to another question directly by clicking on a question number without saving the answer to the previous question.']

  return (
    <div className="min-w-full overflow-x-hidden">
      <Card className="h-128">
        <h1 className="font-bold text-xl">General Instruction</h1>
        <ul>
          {generalInstruction.map((item, index) => (
            <li key={index} className="flex gap-2">
              <span>{index + 1}. </span>
              <span>
                {item}
              </span>
            </li>
          ))}
          {markAnswer.map((item, index) => (
            <div key={index} className="flex gap-2 ml-8 mt-2">
              <Image src={item.icon} height={32} width={32} />
              <span className="my-auto">{item.desc}</span>
            </div>
          ))}
          <p className="mt-2">The Marked for Review status simply acts as a reminder that you have set to look at the question again. If an answer is selected for a question that is Marked for Review, the answer will be considered in the final evaluation.</p>
        </ul>
        <h1 className="font-bold text-xl">Navigating to a Question</h1>
        <p>To answer a question, do the following: <br />
          <ul>
            {stepAnswer.map((item, index) => (
              <li key={index} className="flex gap-2">
                <span>{index + 1}. </span>
                <span>
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            You can view all the questions by clicking on the Question Paper button. This feature is provided, so that if you want you can just see the entire question paper at a glance.
          </p>
        </p>
      </Card>
    </div>
  )
}