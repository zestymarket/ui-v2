import axios from 'axios';

const getNotifications = (eth_address: string): Promise<any> => {
  eth_address = eth_address.toLowerCase();
  return axios.get(
    `${process.env.NEXT_PUBLIC_BOB}/${eth_address}/notification`,
  );
};

export { getNotifications };
