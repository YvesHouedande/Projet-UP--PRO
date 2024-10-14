import React from 'react';

const InfoItem = ({ label, value }) => (
  <div className="info-item">
    <h3 className="text-lg font-medium mb-2">{label}</h3>
    <p className="text-gray-800">{value || "Non spécifié"}</p>
  </div>
);

export default function InfoInpDisplay({ user, inpInfo }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {user.status_choice === 'etudiant' && (
        <>
          <InfoItem label="Filière" value={inpInfo.study} />
          <InfoItem label="École" value={inpInfo.school} />
          <InfoItem label="Niveau" value={inpInfo.level_choices} />
          <InfoItem label="Année du bac" value={inpInfo.bac_year} />
        </>
      )}
      {user.status_choice === 'professeur' && (
        <>
          <InfoItem label="Matière" value={inpInfo.subject} />
          <InfoItem label="Écoles" value={inpInfo.school} />
          <InfoItem label="Filières" value={inpInfo.study} />
        </>
      )}
      {user.status_choice === 'administration' && (
        <>
          <InfoItem label="Poste" value={inpInfo.job} />
          <InfoItem label="Administration" value={inpInfo.administration} />
          <InfoItem label="École" value={inpInfo.school} />
          <InfoItem label="Filières" value={inpInfo.study} />
        </>
      )}
    </div>
  );
}
