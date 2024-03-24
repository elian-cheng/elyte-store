import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from 'api/users';
import { cacheKeys } from 'utils/constants';

const useGetUserProfile = (id: string | null) => {
  const query = useQuery({
    queryKey: cacheKeys.userProfile(id as string),
    queryFn: async () => {
      return await getUserProfile(id as string);
    },
    enabled: id !== null,
  });

  return query;
};

export default useGetUserProfile;
