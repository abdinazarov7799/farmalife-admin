import React from 'react';
import DoctorsContainer from "../containers/DoctorsContainer.jsx";
import HasAccess from "../../../services/auth/HasAccess.jsx";
import config from "../../../config.js";

const DoctorsPage = () => {
    return <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN]}><DoctorsContainer /></HasAccess>
};
export default DoctorsPage;
