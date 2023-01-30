import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function Footer(props) {
    const product = [
        {
            name: 'Quizzes', url: '/quizzes'
        },
        {
            name: 'Prev Paper', url: '/prev-paper'
        },
        {
            name: 'Upcoming Exam', url: '/upcoming-exam'
        },
        {
            name: 'Exams', url: '/exam'
        }
    ];
    const about = [
        {
            name: 'Vision & Mission', url: '/vision-and-mission'
        }
    ];
    const policy = [
        {
            name: 'Term & Condition | Privacy Policy', url: '/privacy-policy'
        }
    ];
    return (
        <>
            {/* desktop */}
            <div div className={`w-full hidden md:inline-block bg-blue-1 text-white py-5`}>
                <div className={` md:w-full md:p-12 lg:w-full grid md:grid-cols-4 p-4 justify-center gap-4 mt-4`}>
                    <div>
                        <h1 className="font-bold text-2xl"> Examz</h1>
                        <p className="text-sm mt-6">
                            Examz is a one step destination for all types of exam preparation. We help student excel in
                            their exam by using our advance AI and teacher networks.
                        </p>
                        <div className="flex mt-4 gap-4">
                            <div className='w-8'>
                                <a href="https://www.instagram.com/examzpro" target="_blank" rel="noopener noreferrer">
                                    <img className='object-cover' src="/asset/icon/footer/ic_instagram.png"
                                         alt="Instagram"/>
                                </a>
                            </div>
                            <div className='w-8'>
                                <a href="https://twitter.com/ExamzPro" target="_blank" rel="noopener noreferrer">
                                    <img className='object-cover' src="/asset/icon/footer/ic_twitter.png"
                                         alt="Twitter"/>
                                </a>
                            </div>
                            <div className='w-8'>
                                <a href="https://www.youtube.com/channel/UCSvoN-tFF1OxLlDundaocfw" target="_blank"
                                   rel="noopener noreferrer">
                                    <img className='object-cover' src="/asset/icon/footer/ic_youtube.png"
                                         alt="Youtube"/>
                                </a>
                            </div>
                            <div className='w-8'>
                                <a href="https://www.facebook.com/examzpro" target="_blank" rel="noopener noreferrer">
                                    <img className='object-cover' src="/asset/icon/ic_facebook.png" alt="Facebook"/>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className="font-bold text-xl">Quick Links</h1>
                        <ul className="text-sm mt-6">
                            {product.map((item, index) => (
                                <li key={index} className="mb-4">
                                    <Link href={item.url}>
                                        <a>{item.name}</a>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h1 className="font-bold text-xl">About Us</h1>
                        <ul className="text-sm mt-6">
                            {about.map((item, index) => (
                                <li key={index} className="mb-4">
                                    <Link href={item.url}>
                                        <a>{item.name}</a>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h1 className="font-bold text-xl">Reach Us </h1>
                        <ul className="text-sm mt-6">
                            <li className="mb-4"><img src="/asset/icon/footer/ic_mail.png" className="inline w-6 mr-2"/>hello@examz.pro
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="md:px-10 md:flex md:justify-between mx-4">
                    <p>© 2022 Examz All rights reserved</p>
                    <p>
                        {policy.map((item, index) => (
                            <span key={index} className="mb-4">
                <Link href={item.url}>
                  <a>{item.name}</a>
                </Link>
              </span>
                        ))}
                    </p>
                </div>
            </div>
            {/* mobile */}
            <div className='bg-blue-1  md:hidden text-white  p-4'>
                <div className='flex'>
                    <div className='w-full'>
                        <h1 className="font-bold text-xl">About Us</h1>
                        <ul className="text-sm mt-6">
                            {about.map((item, index) => (
                                <li key={index} className="mb-4">
                                    <Link href={item.url}>
                                        <a>{item.name}</a>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='w-full'>
                        <h1 className="font-bold text-xl">Quick Links</h1>
                        <ul className="text-sm mt-6">
                            {product.map((item, index) => (
                                <li key={index} className="mb-4">
                                    <Link href={item.url}>
                                        <a>{item.name}</a>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div>
                    <h1 className="font-bold text-xl">Reach Us </h1>
                    <ul className="text-sm mt-6">
                        <li className="mb-2"><img src="/asset/icon/footer/ic_mail.png" className="inline w-6 mr-2"/>hello@examz.pro
                        </li>
                    </ul>
                </div>
                <div>
                    <h1 className="font-bold text-2xl text-center mt-4"> Examz</h1>
                    <div className="flex mt-2 mx-auto justify-center gap-4">
                        <div className='w-8'>
                            <a href="https://www.instagram.com/examzpro" target="_blank" rel="noopener noreferrer">
                                <img className='object-cover' src="/asset/icon/footer/ic_instagram.png"
                                     alt="Instagram"/>
                            </a>
                        </div>
                        <div className='w-8'>
                            <a href="https://twitter.com/ExamzPro" target="_blank" rel="noopener noreferrer">
                                <img className='object-cover' src="/asset/icon/footer/ic_twitter.png" alt="Twitter"/>
                            </a>
                        </div>
                        <div className='w-8'>
                            <a href="https://www.youtube.com/channel/UCSvoN-tFF1OxLlDundaocfw" target="_blank"
                               rel="noopener noreferrer">
                                <img className='object-cover' src="/asset/icon/footer/ic_youtube.png" alt="Youtube"/>
                            </a>
                        </div>
                        <div className='w-8'>
                            <a href="https://www.facebook.com/examzpro" target="_blank" rel="noopener noreferrer">
                                <img className='object-cover' src="/asset/icon/ic_facebook.png" alt="Facebook"/>
                            </a>
                        </div>
                    </div>
                    <p className='text-center'>
                        {policy.map((item, index) => (
                            <span key={index} className="mb-4">
                <Link href={item.url}>
                  <a>{item.name}</a>
                </Link>
              </span>
                        ))}</p>
                    <p className='text-center'>© 2022 Examz, All rights reserved</p>
                </div>
            </div>
        </>

    )
}

export default Footer