import axios from 'axios';

const getNotifications = (eth_address: string, page = 1): Promise<any> => {
  eth_address = eth_address.toLowerCase();
  return axios.get(
    `${
      process.env.NEXT_PUBLIC_BOB
    }/${eth_address}/notification?page=${page.toString()}`,
  );
};

export { getNotifications };
