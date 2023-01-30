import {useState, useEffect} from 'react'
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Footer from '../components/footer/footer'
import Header from '../components/Navbar/header';
import {useForm} from "react-hook-form";
import {loginUser, registerUser} from '../action/auth/authAction'
import {FaEye, FaEyeSlash} from "react-icons/fa";
import Auth from '../action/auth/authAction';
import apiAuth from './api/auth';
import {useToast} from '@chakra-ui/react'
import {useRouter} from "next/router";
import Button from '../components/Button/button'
import Image from 'next/image';
import Slider from '../components/Slider/Slider';
import CardExams from '../components/Cards/CardExams';
import Link from 'next/link';
import apiLanding from '../action/landingPage'
import {CardNews2} from '../components/Cards/CardNews';

function Landing(props) {
    const Router = useRouter()
    const toast = useToast()
    const realStory = [1, 2, 3]
    const [passwdLogin, setPasswdLogin] = useState(true)
    const [passwdRegister, setPasswdRegister] = useState(true)
    const [confirm, setConfirm] = useState(true)
    const [formStatus, setFormStatus] = useState('login')
    const [infoReset, setInfoReset] = useState()
    const [errors, setErrors] = useState(null)
    const {register, handleSubmit, resetField, reset, getValues} = useForm();
    const [renderLogin, setRenderLogin] = useState(false)

    const [dataNews, setDataNews] = useState([])
    const [dataUpcoming, setDataUpcoming] = useState([])
    useEffect(() => {
        const getData = async () => {
            await apiLanding.indexNews(3)
                .then((res) => {
                    setDataNews(res.data.data)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        const getUpcoming = async () => {
            await apiLanding.ExamsUpcoming(8, '', '')
                .then((res) => {
                    setDataUpcoming(res.data.data)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        getData()
        getUpcoming()
    }, [])
    useEffect(() => {
        // some browsers (like safari) may require a timeout to delay calling this
        // function after a page has loaded; otherwise, it may not update the position
        window.scrollTo(0, 0);
    }, [Router, renderLogin]);


    useEffect(() => {
        const uri = Router.asPath.split('#')
        if (uri[1] === 'register') {
            setFormStatus('register')
        }
    }, [])

    const onRegister = async () => {
        const data = {
            name: getValues('name'),
            email: getValues('email'),
            phone: getValues('phone'),
            password: getValues('password'),
            password_confirmation: getValues('password_confirmation')
        }
        await Auth.register(data)
            .then((res) => {
                props.registerUser(res)
                if (res.status === 201) {
                    toast({
                        title: 'Email Verification',
                        description: "Please Check Your Email",
                        status: 'success',
                        position: 'top-right',
                        duration: 9000,
                        isClosable: true,
                    })
                    reset()
                    setFormStatus('login')
                }
            })
            .catch((err) => {
                setErrors(err.response.data)
            })
    }

    const onLogin = async () => {
        const data = {
            email: getValues('email'),
            password: getValues('password')
        }
        await Auth.login(data)
            .then((res) => {
                props.loginUser(res)
            })
            .catch((err) => {
                console.log(err.response.data)
                if (err.response.data === 'Email not verified') {
                    toast({
                        title: 'Email not verified',
                        description: "Please Check Your Email",
                        status: 'error',
                        position: 'top-right',
                        duration: 9000,
                        isClosable: true,
                    })
                }
                setErrors(err.response.data)
            })
    }

    const onLoginGoogle = async () => {
        await apiAuth.loginGoogle()
            .then((res) => {
                window.location.href = res.data.data.url
            })
    }

    const onForgot = async () => {
        await apiAuth.forgotPassword({email: getValues('email')})
            .then((res) => {
                setInfoReset(res.data.message)
            })
            .catch((err) => {
                setErrors(err.response.data)
            })
    }

    const onChangeForm = (to) => {
        resetField('name')
        resetField('phone')
        resetField('email')
        resetField('password')
        resetField('confirmation_password')
        setFormStatus(to)
    }

    return (
        <>
            <section className='bg  bg-transparent '>
                <img src='/asset/img/background.png' className='bg-img hidden md:flex'/>
                <section>
                    <Header/>
                    <div className="grid md:grid-cols-2 ">
                        <div
                            className={`md:pt-36 pt-16 text-center md:text-left md:pl-36  md:flex md:flex-col text-white ${formStatus === 'register' && 'hidden'}`}>
                            <h1 className="font-bold md:text-5xl">All-in-One Site <br/>
                                for Exam Preparation</h1>
                            <p className="mt-2">Makes exam preparation simplified!</p>
                        </div>
                        {formStatus === 'login' && (
                            <div className='md:my-40 my-4 bg-white rounded-lg md:w-96 p-6 mx-auto md:mx-auto'>
                                <form onSubmit={handleSubmit(onLogin)}>
                                    <h1 className="text-xl text-center">Welcome to Examz!</h1>
                                    <p className="text-black-3 text-center">Be ready for exam with us</p>
                                    <p className="mt-2">Email / Phone {errors && errors.data && (
                                        <span className="text-red-1 text-sm">{errors.data.email}</span>
                                    )}</p>
                                    <input type="text" className="p-2 border rounded w-full"
                                           placeholder="Input Email or Phone" {...register("email")} />
                                    <p className="mt-2">Password {errors && errors.data && (
                                        <span className="text-red-1 text-sm">{errors.data.password}</span>
                                    )}</p>
                                    <div className="relative">
                                        <input type={`${passwdLogin ? 'password' : 'text'}`}
                                               className="form w-full border p-2 mb-2 rounded"
                                               placeholder="Input New Password" {...register("password")} />
                                        <span
                                            className="absolute inset-y-0 cursor-pointer right-0 pr-3 flex items-center text-sm leading-5"
                                            onClick={() => {
                                                passwdLogin ? setPasswdLogin(false) : setPasswdLogin(true)
                                            }}>
                      {passwdLogin ?
                          (<FaEyeSlash className=" z-10 inline-block align-middle"/>) :
                          (<FaEye className=" z-10 inline-block align-middle"/>)
                      }
                    </span>
                                    </div>
                                    <span
                                        className="text-right text-end mt-4 text-black-3 cursor-pointer hover:text-blue-1"
                                        onClick={() => {
                                            setErrors(null)
                                            setFormStatus('forgotPassword')
                                        }}>Forgot Password ?</span>
                                    {errors && errors.message === 'Unauthorized' && (
                                        <p className="text-red-1 text-sm">Check your email or password</p>
                                    )}
                                    <button type="submit"
                                            className="w-full bg-yellow-1 text-white p-2 mt-4 rounded">Login
                                    </button>
                                </form>
                                <p className="text-center m-2 text-black-4">or continue with</p>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <button
                                        className="flex w-full  gap-4 justify-center border px-6 py-2 border-yellow-1 rounded"
                                        onClick={() => onLoginGoogle()}><img src="/asset/icon/ic_google.png" height={16}
                                                                             width={16} className="my-auto"
                                                                             alt="login with google"/> Google
                                    </button>
                                </div>
                                <p className="text-center mt-2 text-black-3">Dont you have account ? <button
                                    className='text-blue-1 font-bold' onClick={() => {
                                    onChangeForm('register')
                                    setErrors(null)
                                }}>Register</button></p>
                            </div>
                        )}

                        {formStatus === 'register' && (
                            <form onSubmit={handleSubmit(onRegister)}
                                  className="md:my-24 my-16 bg-white md:w-96  rounded-lg m-4 p-4  p-6 mx-auto md:mx-auto">
                                <h1 className="text-xl text-center">Create Account</h1>
                                <p className="text-black-3 text-center">create an account and get a lot of benefits</p>
                                <p className="mt-4">Full Name {errors && errors.data && (
                                    <span className="text-red-1 text-sm">{errors.data.name}</span>
                                )}</p>
                                <input type="text" className="p-2 border rounded w-full"
                                       placeholder="Input Your Fullname"{...register("name")} />
                                <p className="mt-2">Email {errors && errors.data && (
                                    <span className="text-red-1 text-sm">{errors.data.email}</span>
                                )}</p>
                                <input type="text" className="p-2 border rounded w-full"
                                       placeholder="Input Your Email" {...register("email")} />
                                <p className="mt-2">Phone {errors && errors.data && (
                                    <span className="text-red-1 text-sm">{errors.data.phone}</span>
                                )}</p>
                                <input type="number" className="p-2 border rounded w-full"
                                       placeholder="Input Your Phone Number"{...register("phone")} />
                                <div className='flex-col md:flex-row gap-4'>
                                    <div className='w-full'>
                                        <p className="mt-2">Password</p>
                                        <div className="relative">
                                            <input type={`${passwdRegister ? 'password' : 'text'}`}
                                                   className="form w-full border p-2 rounded-lg"
                                                   placeholder="Input Your Password" {...register("password")} />
                                            <span
                                                className="absolute inset-y-0 cursor-pointer right-0 pr-3 flex items-center text-sm leading-5"
                                                onClick={() => {
                                                    passwdRegister ? setPasswdRegister(false) : setPasswdRegister(true)
                                                }}>
                        {passwdRegister ?
                            (<FaEyeSlash className=" z-10 inline-block align-middle"/>) :
                            (<FaEye className=" z-10 inline-block align-middle"/>)
                        }
                      </span>
                                        </div>
                                    </div>
                                    <div className='w-full'>
                                        <p className="mt-2">Confirm Password</p>
                                        <div className="relative">
                                            <input type={`${confirm ? 'password' : 'text'}`}
                                                   className="form w-full border p-2 rounded"
                                                   placeholder="Confirmation Password" {...register("password_confirmation")} />
                                            <span
                                                className="absolute inset-y-0 cursor-pointer right-0 pr-3 flex items-center text-sm leading-5"
                                                onClick={() => {
                                                    confirm ? setConfirm(false) : setConfirm(true)
                                                }}>
                        {confirm ?
                            (<FaEyeSlash className=" z-10 inline-block align-middle"/>) :
                            (<FaEye className=" z-10 inline-block align-middle"/>)
                        }
                      </span>
                                        </div>
                                    </div>
                                </div>
                                {errors && errors.data && (
                                    <p className="text-red-1 text-sm">{errors.data.password}</p>
                                )}

                                <button className="w-full bg-yellow-1 text-white p-2 mt-4 rounded">Register</button>
                                <p className="text-right mt-2 text-black-1">Do you have account ? <button
                                    className='font-bold text-blue-1' onClick={() => {
                                    onChangeForm('login')
                                    setErrors(null)
                                }}> Login </button></p>
                            </form>
                        )}

                        {formStatus === 'forgotPassword' && (
                            <div className='rounded-lg p-6 mx-auto md:mx-auto'>
                                <form onSubmit={handleSubmit(onForgot)}
                                      className="md:my-40 my-4 bg-white rounded-lg p-4 md:mt-64 md:w-96 p-6 mx-auto md:mx-auto">
                                    <h1 className="text-xl text-center">Forgot Password ?</h1>
                                    <p className="text-black-3 text-center">Enter your email or phone number to reset
                                        your password.</p>
                                    <p className="mt-4">Email {errors && (
                                        <span className="text-red-1 text-sm">{errors.message}</span>
                                    )}</p>
                                    <input type="text" className="p-2 border rounded w-full"
                                           placeholder="Input Your Email" {...register("email", {required: true})} />
                                    <p className="text-blue-1 text-xs">{infoReset}</p>
                                    <button className="w-full bg-yellow-1 text-white p-2 mt-4 rounded">Submit</button>
                                    <div className='flex mt-2 flex-col-reverse md:gap-2 md:flex-row-reverse'>
                                        <div className='inline my-auto'>
                                            <button className="text-blue-1 my-auto" onClick={() => {
                                                onChangeForm('login')
                                                setErrors(null)
                                            }}>Login
                                            </button>
                                            &nbsp;or&nbsp;
                                            <button className="text-blue-1" onClick={() => {
                                                onChangeForm('register')
                                                setErrors(null)
                                            }}> Register
                                            </button>
                                        </div>
                                        <div className=" text-black-3 ">Remember Password ?</div>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </section>
            </section>
            <div className="clear-both"></div>
            <section
                className={`${formStatus === 'forgotPassword' ? 'mt-36' : 'mt-20'} grid xl:grid-cols-3 gap-4 mx-4 md:mx-16 mb-20`}>
                <div className="m-2 ">
                    <Image src="/asset/icon/ic_question.png" height="48" width="48" alt='icon question'/>
                    <h1 className="font-semibold text-1xl mt-4 pb-1">Top Quality Questions</h1>
                    <p>All questions and solutions, designed by top exam experts, based on latest patterns and actual
                        exam level</p>
                </div>

                <div className="m-2 filter">
                    <Image src="/asset/icon/ic_live.png" height="48" width="48" alt='icon live'/>
                    <h1 className="font-semibold text-1xl mt-4 pb-1">Live Tests for Real Experience</h1>
                    <p>Get your All-India Rank and feel the thrill of a real-exam. Groom your pressure handling and time
                        management skills.</p>
                </div>

                <div className="m-2">
                    <Image src="/asset/icon/ic_diagram.png" height="48" width="48" alt='icon diagram'/>
                    <h1 className="font-semibold text-1xl mt-4 pb-1">Personalized, detailed Analysis</h1>
                    <p>Know your weaknesses, strengths and everything else that you need to know to improve your score
                        and rank.</p>
                </div>
            </section>

            <section className="bg-black-9 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 py-20 px-4 md:px-20 px-4">
                <div className="self-center mr-4">
                    <h1 className="font-bold text-black-1 text-2xl pb-1">Real number can be trusted</h1>
                    <p className="text-black-3 mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis
                        scelerisque at quam congue posuere libero in sit quam. Consequat, scelerisque non tincidunt sit
                        lectus senectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis scelerisque
                        at quam congue posuere libero in sit quam. Consequat, scelerisque non tincidunt sit lectus
                        senectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
                <div className="flex-col">
                    <div className='flex '>
                        <div className="w-1/2 bg-white m-2 p-5 rounded-lg  filter drop-shadow-md">
                            <Image width={32} height={32} src="/asset/icon/ic_read.png" alt="icon"/>
                            <h1 className="mt-4 font-bold">1+ Lakh</h1>
                            <p>Student registered in our platform</p>
                        </div>
                        <div className="w-1/2 bg-white m-2 p-5 rounded-lg   filter drop-shadow-md">
                            <Image width={32} height={32} src="/asset/icon/ic_ball.png" alt="icon"/>
                            <h1 className="mt-4 font-bold">5+ Lakh</h1>
                            <p>Quiz attempted by our student</p>
                        </div>
                    </div>
                    <div className='flex'>
                        <div className="w-1/2 bg-white m-2 p-5 rounded-lg filter drop-shadow-md">
                            <Image width={32} height={32} src="/asset/icon/ic_a+.png" alt="icon"/>
                            <h1 className="mt-4 font-bold">10+ Lakh</h1>
                            <p>Test attempted by our student</p>
                        </div>
                        <div className="w-1/2 bg-white m-2 p-5 rounded-lg   filter drop-shadow-md">
                            <Image width={32} height={32} src="/asset/icon/ic_ask.png" alt="icon"/>
                            <h1 className="mt-4 font-bold">1 Lakh+</h1>
                            <p>Question in our platform</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <h1 className="text-2xl text-center font-bold text-black-1 p-1">Real story from our student</h1>
                <p className="text-black-4  text-center">Read and get inspired by stories from our happy student</p>


                {/* desktop */}
                <div className='flex'>
                    <div className='md:mx-auto my-8 hidden lg:flex'>
                        <Slider ArrowColor="blue" count={3}>
                            {realStory.map((item, index) => (
                                <div key={index} className=" filter w-96 drop-shadow-lg bg-white p-8 m-4">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Intega aliquam lectus
                                        risus ut vestibulum consequat comodo lorem. Risus, in eget tristique commodo
                                        lectus mattis et.</p>
                                    <div className="flex flex-row mt-4">
                                        <img src="/asset/icon/ava1.png" alt="photo profile"
                                             className="object-cover w-8 h-8"/>
                                        <div className="flex flex-col ml-4">
                                            <h1 className="font-bold align-center">John Doe</h1>
                                            <p className="text-black-4">Level I of the CFA* Exam</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                {/* mobile */}
                <div className='lg:hidden'>
                    <Slider ArrowColor="blue" count={3}>
                        {realStory.map((item, index) => (
                            <div key={index} className="flex-col filter max-w-lg  drop-shadow-lg bg-white p-8 m-4">
                                <div className='flex w-64'>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Intega aliquam lectus
                                        risus ut vestibulum consequat comodo lorem. Risus, in eget tristique commodo
                                        lectus mattis et.</p>
                                </div>
                                <div className="flex flex-row gap-2 mt-4">
                                    <img src="/asset/icon/ava1.png" alt="photo profile" className="object-cover "/>
                                    <div className="flex flex-col ">
                                        <h1 className="font-bold align-center">John Doe</h1>
                                        <p className="text-black-4">Level I of the CFA* Exam</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>

            <section
                className="bg-blue-1 md:bg-upcoming bg-upcoming-mobile bg-cover bg-hero py-4 md:py-8 px-4 md:px-20">
                <div className='flex justify-between'>
                    <span className="text-white font-bold text-2xl ml-4">Upcoming Exams</span>
                    {dataUpcoming.length > 4 && (
                        <Link href="/upcoming-exam">
                            <a className='inline-block hover:text-blue-4 mt-2 text-white'>
                                See All
                            </a>
                        </Link>
                    )}
                </div>
                <Slider ArrowColor="white" count={dataUpcoming.length}>
                    {dataUpcoming.map((item, index) => (
                        <CardExams key={index} data={item}
                                   url={`${item.has_unfinished === 1 ? '/student/exams/' + item.slug + '?id=' + item.result_id : '/student/exams/' + item.slug}`}/>
                    ))}
                </Slider>
            </section>

            {
                dataNews.length > 2 && (
                    <section className="py-20">
                        <h1 className="text-2xl text-center font-bold text-black-1 p-1">Lates news from us</h1>
                        <p className="text-black-4 mx-8 text-center">Read and get inspired by these latest news curated by
                            us</p>
                        {/* desktop */}
                        <div className='flex'>
                            <div className='md:mx-auto hidden md:flex'>
                                <Slider ArrowColor="blue" count={3}>
                                    {dataNews.map((item) => (
                                        <CardNews2 key={item} dataNews={item} url={`/news/${item.slug}`}/>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                        {/* mobile */}
                        <div className='md:hidden'>
                            <Slider ArrowColor="blue" count={3}>
                                {dataNews.map((item) => (
                                    <CardNews2 key={item} dataNews={item} url={`/news/${item.slug}`}/>
                                ))}
                            </Slider>
                        </div>
                    </section>
                )
            }

            <section className="py-20 bg-blue-6 flex-row items-center text-center">
                <h1 className="text-2xl text-center  font-bold text-black-1 p-1">Start your preparation for now</h1>
                <p className="text-black-3 mx-4 mb-4 text-center">Makes your exam preparation more simplified with
                    Examz</p>
                <div onClick={() => setRenderLogin(!renderLogin)}>
                    <Button title="Get Started For Free"/>
                </div>
            </section>

            <section>
                <Footer/>
            </section>

        </>
    )
}

Landing.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
});
export default connect(mapStateToProps, {loginUser, registerUser})(Landing);
