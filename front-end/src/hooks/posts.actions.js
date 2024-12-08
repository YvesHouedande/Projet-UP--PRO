import useSWR, { mutate as globalMutate } from 'swr';
import { fetcher } from '../helpers/axios';
import axiosService from '../helpers/axios';

export function usePosts(source, peerId = null, serviceId = null) {
  let url = '/general_post/';
  let postSource;
  
  if (serviceId) {
    url = `/service/${serviceId}/general_post/`;
    postSource = 'service';
  } else if (peerId) {
    url = `/peer/${peerId}/general_post/`;
    postSource = 'promotion';
  } else {
    postSource = source;
  }

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  const createPost = async (formData) => {
    try {
      if (formData.has('source')) {
        formData.delete('source');
      }
      formData.append('source', postSource);
      
      const response = await axiosService.post(url, formData);
      const newPost = response.data;

      // Mise à jour du cache avec le nouveau post
      const updateCache = (oldData) => ({
        ...oldData,
        results: [newPost, ...(oldData?.results || [])]
      });
      
      // Mise à jour du cache local
      await mutate(updateCache, false);
      
      // Mise à jour du cache global
      await globalMutate('/general_post/', updateCache, false);

      // Mise à jour des autres caches si nécessaire
      if (serviceId) {
        await globalMutate(key => key.startsWith('/service/'), undefined, { revalidate: true });
      }
      if (peerId) {
        await globalMutate(key => key.startsWith('/peer/'), undefined, { revalidate: true });
      }

      return newPost;
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