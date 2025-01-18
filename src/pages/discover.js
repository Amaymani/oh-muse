import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';


const Discover = () => {
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
                    const response = await axios.get(`/api/search-user?query=${debounceQuery}`);
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
        <div>
            <Navbar />
            <div className="search-bar flex justify-center w-full  mt-10">
                <div className=' flex justify-center  flex-col items-center md:w-[50%] w-[80%]'>
                    <div className='border-b border-purp flex w-full'>
                        <span className=' text-purp  font-semibold'> oh/</span>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="  Search for users..."
                            className=' md:mx-0 mx-10 w-full text-lg'
                        />
                    </div>
                    {results.length > 0 && (
                        <ul className='flex flex-col w-full rounded-b-2xl bg-zinc-900'>
                            {results.map((user) => (
                                <Link className='border-t py-3 border-gray-700' key={user._id} href={`/profile/${user.username}`}>
                                    <span className='text-purp pl-2 font-semibold'>oh/</span>{user.username}
                                </Link>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className='flex justify-center items-center text-xl mt-20'><i className="fa-solid fa-code text-2xl text-purp mr-5"></i><div>Explore page<br />under construction</div></div>

        </div>
    );
};

export default Discover;
