import { convertOldFormats } from '../formats';
import { formatIpfsUri } from '../helpers';

export default class CampaignData {
  name: string;
  description: string;
  url: string;
  format: string;
  image: string;
  buyer: string;
  uri: any;

  constructor(data: { buyerCampaign: CampaignData }, uri: any) {
    this.name = uri.name;
    this.description = uri.description;
    this.url = uri.url;
    this.format = convertOldFormats(uri.format);
    this.image = formatIpfsUri(uri.image);
    this.buyer = data.buyerCampaign.buyer;
    this.uri = uri;
  }
}
