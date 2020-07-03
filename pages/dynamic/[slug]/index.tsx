import React from "react";
import fetch from 'cross-fetch';
import {GetServerSidePropsResult, GetStaticPropsContext} from "next";
import {Post} from "../../../src/post";

type Props = {
    post: Post
}

export async function getServerSideProps(context: GetStaticPropsContext<{slug: string}>): Promise<GetServerSidePropsResult<Props>> {
    const res = await fetch('https://my-json-server.typicode.com/typicode/demo/posts/' + context.params!.slug);
    const post = await res.json();
    return {
        props: {
            post
        }
    }
}

function DynamicRoute(props: Props) {
    return (
        <div className="container">
            <h1 className="title">
                Dynamic route
            </h1>
            <h2>
                {props.post.title}
            </h2>
        </div>
    )
}

export default DynamicRoute
