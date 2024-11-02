import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from '../helpers/axios';
import { getUser } from '../hooks/user.actions';
import axiosService from '../helpers/axios';
import Layout from './Layout';
import Loading from '../components/assets/Loading';
import StudentCard from '../components/StudentCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MdOutlineSwapHoriz } from "react-icons/md";

export default function PeerPage() {
  const { peerId } = useParams();
  const [students, setStudents] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalStudents, setTotalStudents] = useState(0);
  const currentUser = getUser();

  const { data: peerData, error: peerError, isLoading: peerLoading, mutate } = 
    useSWR(peerId ? `/peer/${peerId}/` : null, fetcher);

  // Vérifier si l'utilisateur connecté est le délégué
  const isManager = React.useMemo(() => {
    if (!currentUser || !peerData?.manager) return false;
    return currentUser.public_id === peerData.manager.user;
  }, [currentUser, peerData]);

  const fetchStudents = async (searchValue = '', reset = false) => {
    if (loading) return;
    setLoading(true);

    try {
      let url;
      if (searchValue) {
        // Utiliser StudentViewSet pour la recherche
        const params = new URLSearchParams();
        params.append('peer', peerId);
        params.append('search', searchValue);
        url = `/student/?${params.toString()}`;
      } else {
        // Utiliser PeerViewSet pour l'affichage initial/pagination
        url = reset ? `/peer/${peerId}/students/` : nextUrl;
      }

      const response = await axiosService.get(url);
      
      if (reset) {
        setStudents(response.data.results);
      } else {
        setStudents(prev => [...prev, ...response.data.results]);
      }
      
      setNextUrl(response.data.next);
      setTotalStudents(response.data.count);

    } catch (error) {
      console.error('Erreur lors du chargement des étudiants:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour le chargement initial
  useEffect(() => {
    if (peerId) {
      fetchStudents('', true);
    }
  }, [peerId]);

  // Effet pour la recherche avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (peerId) {
        fetchStudents(searchTerm, true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fonction pour transférer le rôle
  const handleTransferRole = async (studentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir transférer le rôle de délégué à cet étudiant ?')) {
      return;
    }

    try {
      await axiosService.post(`/peer/${peerId}/delegate-manager/`, {
        new_manager: studentId
      });
      await mutate();
    } catch (error) {
      console.error('Erreur lors du transfert:', error);
      alert('Erreur lors du transfert du rôle');
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
            Promotion {peerData?.label}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Informations</h2>
              <p className="text-gray-600">Filière: {peerData?.study_label}</p>
              <p className="text-gray-600">École: {peerData?.school_label}</p>
              <p className="text-gray-600">Année: {new Date(peerData?.year).getFullYear()}</p>
              <p className="text-gray-600">Effectif total: {totalStudents} étudiants</p>
            </div>
            {peerData?.manager && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-gray-700">Délégué</h2>
                </div>
                <StudentCard student={peerData.manager} />
              </div>
            )}
          </div>
        </div>

        {/* Liste des étudiants avec barre de recherche */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">
                {searchTerm 
                  ? `Résultats pour "${searchTerm}" (${students.length} sur ${totalStudents} étudiants)`
                  : `Liste des étudiants (${totalStudents})`
                }
              </h2>
            </div>
            
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un étudiant par nom ou prénom..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {loading && students.length === 0 ? (
            <Loading />
          ) : (
            <div style={{ minHeight: '200px' }}>
              <InfiniteScroll
                dataLength={students.length}
                next={() => !searchTerm && fetchStudents()}
                hasMore={!searchTerm && nextUrl !== null}
                loader={<Loading />}
                endMessage={
                  <p className="text-center text-gray-500 py-4">
                    {students.length === 0 
                      ? searchTerm 
                        ? "Aucun étudiant trouvé pour cette recherche" 
                        : "Aucun étudiant dans cette promotion"
                      : "Plus d'étudiants à afficher"
                    }
                  </p>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map((student) => (
                    <div key={student.public_id} className="relative group">
                      <StudentCard student={student} />
                      {isManager && student.public_id !== peerData.manager.public_id && (
                        <button
                          onClick={() => handleTransferRole(student.public_id)}
                          title="Transférer le rôle de délégué"
                          className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-indigo-600 
                                   text-gray-600 hover:text-white rounded-full shadow-sm 
                                   opacity-0 group-hover:opacity-100 transition-all duration-200
                                   border border-gray-200 hover:border-indigo-600"
                        >
                          <MdOutlineSwapHoriz size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </InfiniteScroll>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
