import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from '../helpers/axios';
import Layout from './Layout';
import Loading from '../components/assets/Loading';
import StudentCard from '../components/StudentCard';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function PeerPage() {
  const { peerId } = useParams();
  const [peerInfo, setPeerInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: peerData, error: peerError, isLoading: peerLoading } = 
    useSWR(peerId ? `/peer/${peerId}/` : null, fetcher);

  useEffect(() => {
    if (peerData) {
      setPeerInfo(peerData);
      fetchStudents();
    }
  }, [peerData]);

  const fetchStudents = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetcher(nextUrl || `/peer/${peerId}/students/`);
      const newStudents = response.results;
      setStudents(prev => [...prev, ...newStudents]);
      setNextUrl(response.next);
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants:', error);
    } finally {
      setLoading(false);
    }
  };

  if (peerLoading) return <Loading />;
  if (peerError) return <div>Erreur de chargement des données</div>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* En-tête de la promotion */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Promotion {peerInfo?.label || peerId}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Informations</h2>
              <p className="text-gray-600">Filière: {peerInfo?.study_label}</p>
              <p className="text-gray-600">École: {peerInfo?.school_label}</p>
              <p className="text-gray-600">Année: {new Date(peerInfo?.year).getFullYear()}</p>
              <p className="text-gray-600">Nombre d'étudiants: {students.length}</p>
            </div>
            {peerInfo?.manager && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Délégué</h2>
                <StudentCard student={peerInfo.manager} />
              </div>
            )}
          </div>
        </div>

        {/* Liste des étudiants */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Étudiants ({students.length})
            </h2>
            <div className="text-sm text-gray-500">
              {peerInfo?.study_label} - {peerInfo?.school_label}
            </div>
          </div>

          <div style={{ minHeight: '200px' }}>
            <InfiniteScroll
              dataLength={students.length}
              next={fetchStudents}
              hasMore={nextUrl !== null}
              loader={
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                </div>
              }
              endMessage={
                <p className="text-center text-gray-500 py-4">
                  {students.length === 0 ? "Aucun étudiant dans cette promotion" : "Plus d'étudiants à afficher"}
                </p>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((student) => (
                  <StudentCard key={student.public_id} student={student} />
                ))}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </Layout>
  );
}
