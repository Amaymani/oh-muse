import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import Link from 'next/link';

const SearchCommunity = () => {

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [debounceQuery, setDebounceQuery] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceQuery(query);
        }, 700);

        return () => clearTimeout(handler);
    }, [query]);

    useEffect(() => {
        if (debounceQuery.length > 0) {
            const fetchResults = async () => {
                try {
                    const response = await axios.get(`/api/fetch-communities?query=${debounceQuery}`, {
                        params: {
                            page: "search-communities",
                        },
                    });
                    setResults(response.data);
                } catch (error) {
                    console.error('Error fetching search results:', error);
                }
            };
            fetchResults();
        } else {
            setResults([]);
        }
    }, [debounceQuery]);
    return (
        <div className='search-community flex flex-col justify-center w-full mt-10 items-center'>
            <div className=' flex justify-center  flex-col items-center md:w-[50%] w-[80%]'>
                <div className='border-b border-purp flex w-full'>
                    <span className=' text-purp  font-semibold'> oh/</span>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="  Search for cohmmunities..."
                        className=' md:mx-0 mx-10 w-full text-lg'
                        aria-label="Search for communities"
                    />
                </div>
                {results.length > 0 && (
                    <ul className='flex flex-col w-full rounded-b-2xl bg-zinc-900'>
                        {results.map((community) => (
                            <Link className='border-t py-3 border-gray-700' key={community._id} href={`/community/${community._id}`}>
                                <span className='text-purp pl-2 font-semibold'>oh/</span>{community.communityName}
                            </Link>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default SearchCommunity