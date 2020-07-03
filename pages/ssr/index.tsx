import React from "react";
import fetch from 'cross-fetch';
import {GetStaticPropsResult} from "next";
import {Post} from "../../src/post";

export async function getServerSideProps(): Promise<GetStaticPropsResult<Props>> {
    const res = await fetch('https://my-json-server.typicode.com/typicode/demo/posts');
    const posts = await res.json();
    return {
        props: {
            posts
        }
    }
}

type Props = {
    posts: Post[]
}

function ServerSideRendering(props: Props) {
    return (
        <div className="container">
            <h1 className="title">
                Server side rendering
            </h1>

            <ul>
                {props.posts.map(item => <li key={item.id}>{item.title}</li>)}
            </ul>
        </div>
    )
}

export default ServerSideRendering
