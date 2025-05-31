import React from 'react';
import SpecializationsContainer from "../containers/SpecializationsContainer.jsx";
import HasAccess from "../../../services/auth/HasAccess.jsx";
import config from "../../../config.js";

const SpecializationsPage = () => {
    return <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN]}><SpecializationsContainer /></HasAccess>
};
export default SpecializationsPage;
