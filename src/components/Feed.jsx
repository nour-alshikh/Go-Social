import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom'

import { client } from '../client'
import MasonaryLayout from './MasonaryLayout'
import Spinner from './Spinner'
import { feedQuery, searchQuery } from "../utils/data"

const Feed = () => {
    const [loading, setLoading] = useState(false)
    const [pins, setPins] = useState(null)

    const { categoryId } = useParams()

    useEffect(() => {
        setLoading(true)
        if (categoryId) {
            const query = searchQuery(categoryId)
            client.fetch(query)
                .then((data) => {
                    setPins(data)
                    setLoading(false)
                })
        } else {
            client.fetch(feedQuery)
                .then((data) => {
                    setPins(data);
                    setLoading(false)
                })
        }
    }, [categoryId])


    if (loading) return <Spinner message='We are adding new Ideas to your feed' />

    if (!pins?.length) return <h2>No Pins available</h2>

    return (
        <div className="">
            {pins && <MasonaryLayout pins={pins} />}
        </div>
    )
}

export default Feed