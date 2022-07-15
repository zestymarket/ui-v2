import React, { useState } from 'react';
import Image from 'next/image';
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
import { useSnackbar } from 'notistack';
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

const StyledProgress1Button = styled(Button)({
  color: `#fff`,
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

type ButtonVariants = 'DEFAULT' | 'LOADING_1' | 'LOADING_2';

const CreateCampaign = () => {
  const zestyMarketUSDC = useZestyMarketUSDC(true);
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [name, setName] = useState<string>(``);
  const [format, setFormat] = useState<string>(``);
  const [image, setImage] = useState<string | null>(null);
  const [url, setURL] = useState<string>(``);
  const [description, setDescription] = useState<string>(``);
  const [buttonVariant, setButtonVariant] = useState<ButtonVariants>(`DEFAULT`);

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

      const snackbarKey1 = enqueueSnackbar(
        `Data is being uploaded to IPFS, please wait and DO NOT close this window.`,
        {
          variant: `info`,
          anchorOrigin: {
            horizontal: `center`,
            vertical: `bottom`,
          },
        },
      );

      setButtonVariant(`LOADING_1`);
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
      const snackbarKey2 = enqueueSnackbar(
        `Data has been uploaded to IPFS, please approve the creation of the campaign on the contract`,
        {
          variant: `success`,
          autoHideDuration: 2000,
          anchorOrigin: {
            horizontal: `center`,
            vertical: `top`,
          },
        },
      );
      closeSnackbar(snackbarKey1);

      await zestyMarketUSDC.buyerCampaignCreate(
        `ipfs://` + jsonIPFSHash.data.IpfsHash,
      );
      const snackbarKey3 = enqueueSnackbar(
        `Please wait for the data to be added on chain`,
        {
          variant: `info`,
          autoHideDuration: 2000,
          anchorOrigin: {
            horizontal: `center`,
            vertical: `bottom`,
          },
        },
      );
      closeSnackbar(snackbarKey2);
      setButtonVariant(`LOADING_2`);

      enqueueSnackbar(`Successfully created a new campaign`, {
        variant: `success`,
        anchorOrigin: {
          horizontal: `center`,
          vertical: `bottom`,
        },
      });
      closeSnackbar(snackbarKey3);

      // show loading
      // change route?
      router.push(`/`);
    } catch (err) {
      console.log(`Campaign creation error: `, err);
      enqueueSnackbar((err as any).message || `Campaign creation error`, {
        variant: `error`,
        autoHideDuration: 2000,
        anchorOrigin: {
          horizontal: `center`,
          vertical: `bottom`,
        },
      });
    }
  };

  const renderSubmitButton = () => (
    <Button disabled={!!isSubmitDisabled} onClick={onSubmit}>
      Create New Campaign
    </Button>
  );

  const renderSubmitButtonProgress1 = () => (
    <StyledProgress1Button outlined onClick={() => null}>
      <Stack flexDirection="row">
        <div style={{ marginRight: 8 }}>
          <Image
            src="/icons/loading.svg"
            alt="loading image"
            width={24}
            height={24}
          />
        </div>
        <span>1/2 Campaign creating...</span>
      </Stack>
    </StyledProgress1Button>
  );

  const renderSubmitButtonProgress2 = () => (
    <StyledProgress1Button outlined onClick={() => null}>
      <Stack flexDirection="row">
        <div style={{ marginRight: 8 }}>
          <Image
            src="/icons/loading.svg"
            alt="loading image"
            width={24}
            height={24}
          />
        </div>
        <span>2/2 Campaign creating...</span>
      </Stack>
    </StyledProgress1Button>
  );

  const buttonRenderer: { [key in ButtonVariants]: () => JSX.Element } = {
    DEFAULT: renderSubmitButton,
    LOADING_1: renderSubmitButtonProgress1,
    LOADING_2: renderSubmitButtonProgress2,
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
          <StyledLabel>Billboard Format</StyledLabel>
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
            <StyledLabel>Image</StyledLabel>
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

        <Stack justifyContent="center">{buttonRenderer[buttonVariant]()}</Stack>
      </StyledForm>
    </>
  );
};

export default CreateCampaign;
