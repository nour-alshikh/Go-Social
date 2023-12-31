import { AiOutlineLogout } from 'react-icons/ai'
import { useEffect, useState } from "react"
import { useNavigate, useParams } from 'react-router-dom'
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data'
import { client } from '../client'
import MasonaryLayout from './MasonaryLayout'
import Spinner from './Spinner'
import { auth } from '../firebase'

const randomImage = 'http://source.unsplash.com/1600x900/?nature,photography,technology'

const activeBtnStyles = "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none"
const notActiveBtnStyles = "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none"

const UserProfile = ({ loggedInUser }) => {

    const [user, setUser] = useState(null)
    const [pins, setPins] = useState(null)
    const [text, setText] = useState('Created')
    const [activeBtn, setActiveBtn] = useState('created')

    const navigate = useNavigate()

    const { userId } = useParams()

    useEffect(() => {
        const query = userQuery(userId)
        client.fetch(query)
            .then((data) => {
                setUser(data[0]);
            })
    }, [userId])

    useEffect(() => {
        if (text === 'Created') {
            const createdPinsQuery = userCreatedPinsQuery(userId);
            client.fetch(createdPinsQuery).then((data) => {
                setPins(data)
            })
        } else {
            const savedPinsQuery = userSavedPinsQuery(userId);
            client.fetch(savedPinsQuery).then((data) => {
                setPins(data)
            })
        }

    }, [text, userId])

    if (!user) {
        return <Spinner message="Loading Profile" />
    }

    const signOut = () => {
        auth.signOut()
            .then(() => {
                localStorage.clear()
                navigate('/login')
            })
            .catch((error) => {
                console.log(error.message);
            })
    }

    console.log(pins);

    return (
        <div className=' relative pb-2 h-full justify-center items-center'>
            <div className='flex flex-col pb-5'>
                <div className="relative mb-7 flex flex-col">
                    <div className="flex flex-col justify-center items-center">
                        <img
                            src={randomImage}
                            className=' w-full h-370 2xl:h-510 shadow-lg object-cover'
                            alt="banner-pic" />
                        <img
                            className=' rounded-full w-20 h-20 -mt-10 shadow-xl object-cover'
                            src={user?.image} alt="user-pic" />
                        <h1 className=' font-bold text-3xl text-center mt-3'>
                            {user.userName}
                        </h1>
                        <div className=' absolute top-0 z-1 right-0 p-2'>
                            {userId === loggedInUser?._id ? (
                                <button
                                    type="button"
                                    className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md'
                                    onClick={signOut}
                                >
                                    <AiOutlineLogout color='red' fontSize={21} />
                                </button>
                            )
                                :
                                ""}
                        </div>
                    </div>
                    <div>
                        <div className='text-center mb-7'>
                            <button
                                type='button'
                                onClick={(e) => {
                                    setText(e.target.textContent)
                                    setActiveBtn('created')
                                }}
                                className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
                            >
                                Created
                            </button>
                            <button
                                type='button'
                                onClick={(e) => {
                                    setText(e.target.textContent)
                                    setActiveBtn('saved')
                                }}
                                className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
                            >
                                Saved
                            </button>
                        </div>
                        {
                            pins?.length ? (
                                <div className=' px-2'>
                                    <MasonaryLayout pins={pins} />
                                </div>
                            )
                                :
                                (
                                    <div className=' text-center flex justify-center font-bold items-center w-full text-xl mt-2'>
                                        No Pins Found!
                                    </div>
                                )
                        }
                    </div>
                </div>
            </div>
        </div>
    )

}

export default UserProfile