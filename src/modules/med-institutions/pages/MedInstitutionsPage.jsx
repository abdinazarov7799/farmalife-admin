import React from 'react';
import MedInstitutionsContainer from "../containers/MedInstitutionsContainer.jsx";
import HasAccess from "../../../services/auth/HasAccess.jsx";
import config from "../../../config.js";

const MedInstitutionsPage = () => {
    return <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN]}><MedInstitutionsContainer /></HasAccess>
};
export default MedInstitutionsPage;
