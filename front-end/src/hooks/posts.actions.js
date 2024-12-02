import useSWR from 'swr';
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