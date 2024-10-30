import React from 'react';

const InfoItem = ({ label, value }) => (
  <div className="info-item">
    <h3 className="text-lg font-medium mb-2">{label}</h3>
    <p className="text-gray-800">{value || "Non spécifié"}</p>
  </div>
);

export default function InfoInpDisplay({ user, inpInfo }) {


  const renderStudentInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium text-gray-500">École</p>
        <p className="mt-1 text-sm text-gray-900">{inpInfo.school?.name || 'Non spécifié'}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Filière</p>
        <p className="mt-1 text-sm text-gray-900">{inpInfo.study?.name || 'Non spécifié'}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Niveau</p>
        <p className="mt-1 text-sm text-gray-900">{inpInfo.level_choices_display || 'Non spécifié'}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Année du bac</p>
        <p className="mt-1 text-sm text-gray-900">{inpInfo.bac_year || 'Non spécifié'}</p>
      </div>
    </div>
  );

  const renderProfessorInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium text-gray-500">Matière</p>
        <p className="mt-1 text-sm text-gray-900">{inpInfo.subject || 'Non spécifié'}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Écoles</p>
        <p className="mt-1 text-sm text-gray-900">{inpInfo.school.length > 0 ? inpInfo.school.map(s => s.name).join(', ') : 'Non spécifié'}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Filières</p>
        <p className="mt-1 text-sm text-gray-900">{inpInfo.study.length > 0 ? inpInfo.study.map(s => s.name).join(', ') : 'Non spécifié'}</p>
      </div>
    </div>
  );

  const renderPersonnelInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium text-gray-500">Poste</p>
        <p className="mt-1 text-sm text-gray-900">{inpInfo.job || 'Non spécifié'}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Administration</p>
        <p className="mt-1 text-sm text-gray-900">{inpInfo.administration || 'Non spécifié'}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">École</p>
        <p className="mt-1 text-sm text-gray-900">{inpInfo.school?.name || 'Non spécifié'}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Filière</p>
        <p className="mt-1 text-sm text-gray-900">{inpInfo.study?.name || 'Non spécifié'}</p>
      </div>
    </div>
  );

  return (
    <div>
      {user.status_choice === 'etudiant' && renderStudentInfo()}
      {user.status_choice === 'professeur' && renderProfessorInfo()}
      {user.status_choice === 'personnel' && renderPersonnelInfo()}
    </div>
  );
}
