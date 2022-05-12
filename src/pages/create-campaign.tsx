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
// https://github.com/lifeeric/material-ui-dropzone#installation
import { DropzoneArea } from 'react-mui-dropzone';
import validator from 'validator';
import SubHeader from '@/components/SubHeader';
import Button from '@/components/Button';
import { readFile } from '@/utils/file';
import {
  Format,
  FormatCategories,
  SpaceFormatResolutions,
  SpaceFormats,
} from '@/utils/formats';
import {
  convertBase64ToFile,
  getAspectFromFormat,
  getHeightFromFormat,
  getWidthFromFormat,
} from '@/utils/image';
import { EPSILON } from '@/utils/helpers';
import { pinFileToIPFS, pinJSONToIPFS } from '@/lib/ipfs';
import { useZestyMarketUSDC } from '@/utils/hooks';
import ZestyImageDialog from '@/components//ZestyImageDialog';
import { useRouter } from 'next/router';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

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
const StyledDropzoneArea = styled(Stack)<StackProps>(({ theme }) => ({
  '& .dropzone': {
    height: 56,
    width: 540,
    minHeight: 56,
    backgroundColor: `transparent`,
    border: `1px dashed #ffffff30`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    position: `relative`,
  },
  '& .dropzone-paragraph': {
    color: `#5F5777`,
    fontWeight: 400,
    fontSize: 18,
    margin: 0,
  },
  '& .MuiDropzoneAreaActive': {},
  '& .MuiDropzoneArea-textContainer': {
    display: `flex`,
    flexDirection: `row-reverse`,
  },
  '& .MuiDropzoneArea-icon': {
    width: 24,
    height: 24,
    color: `#5F5777`,
    marginRight: 12,
  },
  '& .MuiDropzonePreviewList-root': {
    width: 540,
    position: `absolute`,
    textAlign: `left`,
    justifyContent: `center`,
    backgroundColor: theme.palette.background.paper,
    margin: 0,
  },
  '& .MuiDropzonePreviewList-image': {
    display: `none`,
  },
  '& .MuiDropzonePreviewList-imageContainer': {
    display: `flex`,
    alignContent: `center`,
    padding: `0 16px !important`,
    backgroundColor: `#413859`,
    height: 56,
    width: 540,
    maxWidth: `100%`,
    textAlign: `left`,

    '& p': {
      lineHeight: `54px`,
      width: 540,
    },
  },
  '& .MuiDropzonePreviewList-removeButton': {
    backgroundColor: `transparent`,
    boxShadow: `none`,
    color: theme.palette.text.secondary,
    opacity: 1,
    top: 8,
    right: 8,
    '&:hover': {
      backgroundColor: `transparent`,
      color: theme.palette.text.primary,
    },
  },
}));

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
  const [dropzoneKey, setDropzoneKey] = useState<string>(`0`);
  const [image, setImage] = useState<string | null>(null);
  const [url, setURL] = useState<string>(``);
  const [description, setDescription] = useState<string>(``);

  const [openImageDialog, setOpenImageDialog] = useState<boolean>(false);

  const isSubmitDisabled =
    !name ||
    !format ||
    image === null ||
    !url ||
    (url && !validator.isURL(url));

  const onImageUploaded = async (img: File[]) => {
    if (!img.length) {
      return;
    }
    const file = img[0];
    const imageDataUrl = await readFile(file);
    if (format == SpaceFormats.Twitch && file.type === `image/gif`) {
      const img = new Image();
      img.onload = () => {
        const twitchHeight = getHeightFromFormat(SpaceFormats.Twitch);
        const twitchAspectRatio = getAspectFromFormat(SpaceFormats.Twitch);
        const imageAspectRatio = img.width / img.height;
        // Checks if the image aspects are the same, avoids float rounding issues
        if (
          img.height === twitchHeight &&
          Math.abs(imageAspectRatio - twitchAspectRatio) < EPSILON
        ) {
          setImage(imageDataUrl);
        } else {
          // error
          setDropzoneKey(dropzoneKey === `0` ? `1` : `0`);
        }
      };
      img.src = imageDataUrl;
    } else {
      setImage(imageDataUrl);
      setOpenImageDialog(true);
    }
  };

  const onImageDelete = () => {
    setImage(null);
  };

  const onImageCropped = (img: string): void => {
    setImage(img);
  };

  const onCloseDialog = (e: any) => {
    setOpenImageDialog(false);
    // Remove image if dialog was closed due to an event and
    // not from a function call with false
    if (e) {
      setImage(null);
      setDropzoneKey(dropzoneKey === `0` ? `1` : `0`);
    }
  };

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

      const campaignCreationRes = await zestyMarketUSDC.buyerCampaignCreate(
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

        <StyledDropzoneArea {...formFieldProps}>
          <Stack direction="row" alignItems="baseline">
            <StyledLabel>The Frontpage</StyledLabel>
            {format && (
              <StyledSubLabel>
                ({getWidthFromFormat(format)} x {getHeightFromFormat(format)})
              </StyledSubLabel>
            )}
          </Stack>
          <DropzoneArea
            key={dropzoneKey}
            clearOnUnmount
            showFileNames
            showAlerts={false}
            filesLimit={1}
            maxFileSize={2097152} // 2MB
            dropzoneText={`Drag and Drop your files here`}
            acceptedFiles={[`image/*`]}
            dropzoneClass="dropzone"
            dropzoneParagraphClass="dropzone-paragraph"
            onChange={onImageUploaded}
            onDelete={onImageDelete}
          />
        </StyledDropzoneArea>
        {image && (
          <ZestyImageDialog
            format={format as Format}
            open={openImageDialog}
            onDialogClose={onCloseDialog}
            image={image}
            onImageCropped={onImageCropped}
          />
        )}
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
