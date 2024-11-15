import React from 'react';

const InfoCard = ({ label, value }) => (
  <div className="bg-white p-4 rounded-xl border-2 border-green-200 
                  shadow-[3px_3px_0px_0px_rgba(34,197,94,0.2)]">
    <p className="text-sm font-medium text-green-600 mb-1">{label}</p>
    <p className="text-gray-800">{value || "Non spécifié"}</p>
  </div>
);

export default function InfoInpDisplay({ user, inpInfo }) {
  const renderStudentInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoCard label="École" value={inpInfo.school?.name} />
      <InfoCard label="Filière" value={inpInfo.study?.name} />
      <InfoCard label="Niveau" value={inpInfo.level_choices_display} />
      <InfoCard label="Année du bac" value={inpInfo.bac_year} />
      <InfoCard label="Promotion" value={inpInfo.peer?.label} />
    </div>
  );

  const renderProfessorInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoCard label="Matière" value={inpInfo.subject} />
      <InfoCard 
        label="Écoles" 
        value={inpInfo.school.length > 0 ? inpInfo.school.map(s => s.name).join(', ') : null} 
      />
      <InfoCard 
        label="Filières" 
        value={inpInfo.study.length > 0 ? inpInfo.study.map(s => s.name).join(', ') : null} 
      />
    </div>
  );

  const renderPersonnelInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoCard label="Poste" value={inpInfo.job} />
      <InfoCard label="Administration" value={inpInfo.administration} />
      <InfoCard label="École" value={inpInfo.school?.name} />
      <InfoCard label="Filière" value={inpInfo.study?.name} />
    </div>
  );

  return (
    <div className="space-y-6">
      {user.status_choice === 'etudiant' && renderStudentInfo()}
      {user.status_choice === 'professeur' && renderProfessorInfo()}
      {user.status_choice === 'personnel' && renderPersonnelInfo()}
    </div>
  );
}
