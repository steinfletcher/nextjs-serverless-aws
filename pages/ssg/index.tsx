import React from "react";
import fetch from 'cross-fetch';
import {Post} from "../../src/post";
import {GetStaticPropsResult} from "next";

type Props = {
    posts: Post[]
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
    const res = await fetch('https://my-json-server.typicode.com/typicode/demo/posts');
    const posts = await res.json();
    return {
        props: {
            posts
        }
    }
}

function StaticSiteGeneration(props: Props) {
    return (
        <div className="container">
            <h1 className="title">
                Static site generation
            </h1>

            <ul>
                {props.posts.map(item => <li key={item.id}>{item.title}</li>)}
            </ul>
        </div>
    )
}

export default StaticSiteGeneration
