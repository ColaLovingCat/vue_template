import { fetchRequest } from '../../commons/utils/fetch';

export const upload = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return fetchRequest('https://10.179.244.202:440/api/File/upload', {
    method: 'POST',
    data: formData,
  });
};
