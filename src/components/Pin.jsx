import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { urlFor, client } from "../client"
import { fetchUser } from '../utils/fetchUser'


const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {

    const [postHovered, setPostHovered] = useState(false);

    const [savingPost, setSavingPost] = useState(false)

    const navigate = useNavigate();

    const user = fetchUser()

    let alreadySaved = save?.filter((item) => item?.postedBy?._id === user?.uid);

    alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

    const savePin = (id) => {
        if (alreadySaved?.length === 0) {
            setSavingPost(true)

            client.patch(id).setIfMissing({ save: [] })
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userID: user?.uid,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user?.uid
                    }
                }])
                .commit()
                .then(() => {
                    window.location.reload()
                    setSavingPost(false)
                })
        }
    }

    const deletePin = (id) => {
        client.delete(id).then(() => {
            window.location.reload()
        })
    }

    return (
        <div className="m-2 ">
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration ease-in-out"
            >
                <img src={urlFor(image).width(250).url()} className="rounded-lg w-full" alt="user-post" />
                {postHovered && (
                    <div className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr2 py-2 z-50"
                        style={{ height: '100%' }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <a
                                    href={`${image?.asset?.url}?dl=`}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-xl text-dark opacity-75 hover:opacity-100 outline-none hover:shadow"
                                >
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                            {
                                alreadySaved?.length !== 0 ? (
                                    <button
                                        type="button"
                                        className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            savePin(_id)
                                        }
                                        }
                                    >{save?.length} Saved</button>
                                )
                                    :
                                    (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                savePin(_id)
                                            }}
                                            className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                                        >{savingPost ? 'Saving' : "Save"}</button>
                                    )
                            }
                        </div>

                        <div className="flex justify-between items-center gap-2 w-full ">
                            {
                                destination && (
                                    <a href={destination}
                                        onClick={(e) => e.stopPropagation()}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-white flex items-center gap-2 text-black font-bold p-2 px-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                                    >
                                        <BsFillArrowUpRightCircleFill />
                                        {destination.length > 20 ? destination.slice(8, 15) : destination.slice(8)}
                                    </a>
                                )
                            }
                            {
                                postedBy?._id === user?.uid && (
                                    <button type="button"

                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deletePin(_id)
                                        }}
                                        className="bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold text-base rounded-3xl hover:shadow-md outline-none">
                                        <AiTwotoneDelete />
                                    </button>
                                )
                            }
                        </div>
                    </div>
                )}
            </div>
            <Link
                to={`user-profile/${postedBy?._id}`}
                className="flex gap-2 mt-2 items-center"
            >
                <img src={postedBy?.image} className="w-8 h-8 rounded-full object-cover" alt="user-profile" />
                <p className="font-semibold capitalize">{postedBy?.username}</p>
            </Link>
        </div >
    )
}

export default Pin