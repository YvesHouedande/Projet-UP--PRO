import useSWR from 'swr';
import { fetcher } from '../helpers/axios';
import axiosService from '../helpers/axios';

export function usePeerPosts(peerId) {
  const url = `/peer/${peerId}/general_post/`;
  
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  const createPeerPost = async (formData) => {
    try {
      // Créer le post via l'endpoint spécifique
      const response = await axiosService.post(`/peer/${peerId}/create-post/`, formData);
      
      // Mettre à jour le cache SWR avec le nouveau post
      const updatedData = {
        ...data,
        results: [response.data, ...(data?.results || [])]
      };
      
      await mutate(updatedData, false);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    posts: data?.results || [],
    error,
    isLoading,
    mutate,
    createPeerPost
  };
} 