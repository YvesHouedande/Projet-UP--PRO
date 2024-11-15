import useSWR from 'swr';
import { fetcher } from '../helpers/axios';
import axiosService from '../helpers/axios';

export function usePosts(source = 'etudiant', peerId = null, serviceId = null) {
  let url = '/general_post/';
  if (peerId) {
    url = `/peer/${peerId}/posts/`;
  } else if (serviceId) {
    url = `/service/${serviceId}/posts/`;
  } else {
    url = `/general_post/?source=${source}`;
  }

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  const createPost = async (formData) => {
    try {
      // Créer le post
      const response = await axiosService.post(url, formData);
      
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
    createPost
  };
} 