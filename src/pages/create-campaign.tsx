import React, { useState } from 'react';
import {
  Box,
  Stack,
  StackProps,
  TextField,
  Typography,
  Select,
  MenuItem,
  ListSubheader,
  FormHelperText,
  styled,
} from '@mui/material';
import validator from 'validator';
import SubHeader from '@/components/SubHeader';
import Button from '@/components/Button';
import {
  Format,
  FormatCategories,
  SpaceFormatResolutions,
} from '@/utils/formats';
import {
  convertBase64ToFile,
  getHeightFromFormat,
  getWidthFromFormat,
} from '@/utils/image';
import { pinFileToIPFS, pinJSONToIPFS } from '@/lib/ipfs';
import { useZestyMarketUSDC } from '@/utils/hooks';
import { useRouter } from 'next/router';
import ZestyImageUploader from '@/components/ZestyImageUploader';

const StyledForm = styled(Box)({
  maxWidth: 1400,
  alignItems: `flex-start`,
  margin: `30px auto`,
});
const StyledLabel = styled(Typography)({
  fontSize: 18,
  fontWeight: 600,
});
const StyledSubLabel = styled(Typography)({
  fontSize: 16,
  fontWeight: 400,
  color: `#ffffff30`,
  marginLeft: 8,
});
const StyledTextField = styled(TextField)({
  width: 540,
  minHeight: 56,
  '& fieldset': {
    borderColor: `#ffffff30`,
    borderRadius: 8,
  },
});
const StyledSelect = styled(Select)({
  width: 540,
  height: 56,
  '& fieldset': {
    borderColor: `#ffffff30`,
    borderRadius: 8,
  },
  '& svg': {
    fill: `#ffffff30`,
  },
});
const StyleHelperText = styled(FormHelperText)({
  position: `absolute`,
  bottom: -20,
  right: 0,
});

const formFieldProps: StackProps = {
  direction: `row`,
  alignItems: `center`,
  justifyContent: `space-between`,
  width: `100%`,
  maxWidth: 800,
  position: `relative`,
  marginBottom: `24px`,
};

const getFormatChoices = () => {
  let index = 0;
  return Object.keys(FormatCategories).map(
    (group: string, choicesIdx: number) => {
      const items = FormatCategories[group as Format].map((choice) => {
        return (
          <MenuItem key={index++} value={choice}>
            {SpaceFormatResolutions[choice] || choice}
          </MenuItem>
        );
      });
      return [<ListSubheader key={choicesIdx}>{group}</ListSubheader>, items];
    },
  );
};

const CreateCampaign = () => {
  const zestyMarketUSDC = useZestyMarketUSDC(true);
  const router = useRouter();

  const [name, setName] = useState<string>(``);
  const [format, setFormat] = useState<string>(``);
  const [image, setImage] = useState<string | null>(null);
  const [url, setURL] = useState<string>(``);
  const [description, setDescription] = useState<string>(``);

  const isSubmitDisabled =
    !name ||
    !format ||
    image === null ||
    !url ||
    (url && !validator.isURL(url));

  const onSubmit = async () => {
    if (image === null) {
      return;
    }

    try {
      // showloading
      const file = convertBase64ToFile(image);
      const formData = new FormData();
      formData.append(`file`, file);

      // snackbar  "Data is being uploaded to IPFS, please wait and do not close this window just yet"

      const imgIPFSRes = await pinFileToIPFS(formData);
      const newImageUrl = `ipfs://${imgIPFSRes.data.IpfsHash}`;
      const campaignData = {
        name: name.trim(),
        description: description.trim(),
        url: url.trim(),
        image: newImageUrl,
        format: format.trim(),
      };

      const jsonIPFSHash = await pinJSONToIPFS(campaignData);
      // snackbar `Data has been uploaded to IPFS, please approve the creation of the campaign on the contract`,

      await zestyMarketUSDC.buyerCampaignCreate(
        `ipfs://` + jsonIPFSHash.data.IpfsHash,
      );

      // snackbar:  `Please wait for the data to be added on chain`

      // await campaignCreationRes.wait();
      // snackbar: `Successfully created a new campaign`
      // show loading
      // change route?
      router.push(`/`);
    } catch (err) {
      console.log(`Campaign creation error: `, err);
      // snackbar: `An Error has occured`
    }
  };

  return (
    <>
      <SubHeader label="New Campaign" />
      <StyledForm
        component="form"
        sx={{
          display: `flex`,
          flexDirection: `column`,
        }}
      >
        <Stack {...formFieldProps}>
          <StyledLabel>Campaign Name</StyledLabel>
          <StyledTextField
            placeholder="Type a campaign name..."
            variant="outlined"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Stack>

        <Stack {...formFieldProps}>
          <StyledLabel>Ad Formats</StyledLabel>
          <StyledSelect
            variant="outlined"
            value={format}
            onChange={(e) => {
              setFormat(e.target.value as string);
            }}
          >
            {getFormatChoices()}
          </StyledSelect>
        </Stack>

        <Stack {...formFieldProps}>
          <Stack direction="row" alignItems="baseline">
            <StyledLabel>The Frontpage</StyledLabel>
            {format && (
              <StyledSubLabel>
                ({getWidthFromFormat(format)} x {getHeightFromFormat(format)})
              </StyledSubLabel>
            )}
          </Stack>
          <ZestyImageUploader format={format} onImageUpdate={setImage} />
        </Stack>

        <Stack {...formFieldProps}>
          <StyledLabel>Call to action URL</StyledLabel>
          <StyledTextField
            placeholder="https://yourdomain.com/pageurl"
            variant="outlined"
            value={url}
            onChange={(e) => {
              setURL(e.target.value);
            }}
          />
          {url && !validator.isURL(url) && (
            <StyleHelperText>Invalid URL</StyleHelperText>
          )}
        </Stack>

        <Stack {...formFieldProps}>
          <Stack direction="row" alignItems="baseline">
            <StyledLabel>Description</StyledLabel>
            <StyledSubLabel>(Optional)</StyledSubLabel>
          </Stack>
          <StyledTextField
            placeholder="Type and enter description for your campaign"
            variant="outlined"
            multiline
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </Stack>

        <Stack justifyContent="center">
          <Button disabled={!!isSubmitDisabled} onClick={onSubmit}>
            Create New Campaign
          </Button>
        </Stack>
      </StyledForm>
    </>
  );
};

export default CreateCampaign;
