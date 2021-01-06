import React, { memo } from "react";

function Home (props: any) {
    return (
        <React.Fragment>
            <h1>The Home Page</h1>
            <div>Add Images, text, and compatible HTML content</div> 
        </React.Fragment>
    );
}

export default memo(Home);