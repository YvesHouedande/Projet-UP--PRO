import React from 'react';
import { Link } from 'react-router-dom';

export default function StudentCard({ student }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
      <Link to={`/profile/${student.user}`} className="flex items-start space-x-4">
        <img 
          src={student.avatar} 
          alt={`${student.first_name} ${student.last_name}`}
          className="w-16 h-16 rounded-full object-cover border border-gray-200"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {student.first_name} {student.last_name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{student.email}</p>
          <div className="mt-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {student.level_choices_display}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-600">
            {student.study.name} - {student.school.name}
          </div>
          {student.number && (
            <p className="mt-1 text-sm text-gray-500">
              Tel: {student.number}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
} 