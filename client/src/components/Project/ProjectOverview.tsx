import React, { memo } from "react";

function ProjectOverview (props: any) {
    return (
        <React.Fragment>
            <h1>The Project Overview Page</h1>
            <div>Add Images, text, and compatible HTML content</div> 
        </React.Fragment>
    );
}

export default memo(ProjectOverview);