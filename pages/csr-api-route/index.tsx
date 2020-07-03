import React from "react";
import useSWR from 'swr';
import fetch from "../../src/fetch";
import {Post} from "../../src/post";

export default function ClientSideRenderingApiRoute() {
    const {data} = useSWR<Post[]>('/api/posts', fetch)

    return (
        data ? <div className="container">
                <h1 className="title">
                    Client side rendering with api route
                </h1>

                <ul>
                    {data.map(item => <li key={item.id}>{item.title}</li>)}
                </ul>
            </div>
            : "loading..."
    )
}
