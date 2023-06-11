
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import shareVideo from '../assets/share.mp4'
import no_background from '../assets/no_background.png'

import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase'

import { client } from '../client'

const Login = () => {

    const navigate = useNavigate()

    const signInApi = () => {
        signInWithPopup(auth, provider)
            .then((response) => {
                localStorage.setItem('user', JSON.stringify(response.user))
                const { displayName, uid, photoURL } = response.user
                const doc = {
                    _id: uid,
                    _type: "user",
                    userName: displayName,
                    image: photoURL
                }
                client.createIfNotExists(doc).then(() => {
                    navigate('/', { replace: true })
                })
            })
    }

    return (
        <div className='flex justify-start items-center flex-col h-screen'>
            <div className='relative h-full w-full'>
                <video
                    src={shareVideo}
                    typeof='video/mp4'
                    autoPlay
                    loop
                    controls={false}
                    muted
                    className='w-full h-full object-cover'
                />
                <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
                    <div className='p-5 '>
                        <img src={no_background} width="130px" alt="logo" />
                    </div>
                    <div className='shadow-2xl'>
                        <button
                            type='button'
                            className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none' onClick={signInApi}

                        >
                            <FcGoogle className='mr-4' /> Sign in with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login