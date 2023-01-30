import React from "react";
import { TitleButton } from "./TitleButton";
import Slider from '../Slider/Slider.js'
import CardExams from "../Cards/CardExams";
import CardQuizzes from "../Cards/CardQuizzes";
import CardAttempted from '../Cards/CardAttempted'
import CardPractice from "../Cards/CardPractice";
import CardPaper from "../Cards/CardPaper";

export default function MainSlider({ title, isLive, urlSeeAll, type, data, ArrowColor, count = 0 }) {
  return (
    <>
      <TitleButton title={title} isLive={isLive} count={data.length} url={urlSeeAll} />
      <Slider ArrowColor="blue" count={data.length} >
        {data.map((item, index) => (
          <>{type === 'exams' && (
            <CardExams key={index} data={item} url={`${item.has_unfinished === 1 ? '/student/exams/' + item.slug + '?id=' + item.result_id : '/student/exams/' + item.slug}`} />
          )}
            {type === 'quiz' && (
              <CardQuizzes key={index} data={item} url={`${item.has_unfinished === 1 ? '/student/quizzes/' + item.slug + '?id=' + item.result_id : '/student/quizzes/' + item.slug}`}  />
            )}
            {type === 'practice' && (
              <CardPractice key={index} data={item} url={`${item.has_unfinished === 1 ? '/student/practice/' + item.slug + '?id=' + item.result_id : '/student/practice/' + item.slug}`} />
            )}
            {type === 'attemptedQuiz' && (
              <CardAttempted key={index} data={item} url={`/student/quizzes/${item.slug}`} score={`/student/quizzes/${item.quiz.slug}/${item.id}`} />
            )}
            {type === 'attemptedExams' && (
              <CardAttempted key={index} data={item} url={`/student/exams/${item.slug}`} score={`/student/exams/${item.exams.slug}/${item.id}`} />
            )}
            {type === 'paper' && (
            <CardPaper key={index} data={item} />
            )}
          </>
        ))}
      </Slider>
    </>
  )
}