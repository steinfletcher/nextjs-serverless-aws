import React from "react";
import useSWR from "swr";
import {Post} from "../../src/post";
import fetch from "../../src/fetch";

function ClientSideRendering() {
    const {data, error} = useSWR<Post[]>('https://my-json-server.typicode.com/typicode/demo/posts', fetch)

    if (error) {
        return <div className="container">
            Error
        </div>
    }

    return (
        <div className="container">
            <h1 className="title">
                Client side rendering
            </h1>

            {
                data
                    ? <ul>{data.map(item => <li key={item.id}>{item.title}</li>)}</ul>
                    : "...loading"
            }
        </div>
    )
}

export default ClientSideRendering
