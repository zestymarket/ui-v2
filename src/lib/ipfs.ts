import axios from 'axios';

const pinJSONToIPFS = (data: any): Promise<any> => {
  return axios.post(
    `${process.env.NEXT_PUBLIC_IPFS_PINNER}/api/pinJSONToIPFS`,
    data,
  );
};

const pinFileToIPFS = (data: FormData): Promise<any> => {
  return axios.post(
    `${process.env.NEXT_PUBLIC_IPFS_PINNER}/api/pinFileToIPFS`,
    data,
  );
};

export { pinJSONToIPFS, pinFileToIPFS };
