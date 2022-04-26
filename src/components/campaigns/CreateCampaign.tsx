import { Box, Stack, StackProps, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { DropzoneArea } from 'material-ui-dropzone';
import React, { useState } from 'react';
import SubHeader from '../SubHeader';
import Button from '../Button';
import { readFile } from '@/utils/file';
import { SpaceFormats } from '@/utils/formats';
import { getAspectFromFormat, getHeightFromFormat } from '@/utils/image';
import { EPSILON } from '@/utils/helpers';
import UploadIcon from '/icons/upload.svg';
import NextImage from 'next/image';

const StyledForm = styled(Box)({
  maxWidth: 1400,
  alignItems: `flex-start`,
  margin: `30px auto`,
});
const StyledLabel = styled(Typography)({
  fontSize: 18,
  fontWeight: 600,
});

const StyledTextField = styled(TextField)({
  width: 540,
  height: 56,
  '& fieldset': {
    borderColor: `#ffffff30`,
    borderRadius: 8,
  },
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
  sx: { mb: 3 },
};

const CreateCampaign = () => {
  const [format, setFormat] = useState<string>();
  const [dropzoneKey, setDropzoneKey] = useState<string>(`0`);
  const [image, setImage] = useState<string | null>(null);

  const onImageUploaded = async (img: File[]) => {
    if (!img.length) {
      return;
    }
    const file = img[0];
    const imageDataUrl = await readFile(file);
    console.log(`== uplaoded file==`, file);
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
      // setOpenImageDialog(true);
    }
  };

  const onImageDelete = () => {
    console.log(`=del `);
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
          />
        </Stack>

        <Stack {...formFieldProps}>
          <StyledLabel>Ad Formats</StyledLabel>
          <StyledTextField variant="outlined" />
        </Stack>

        <StyledDropzoneArea {...formFieldProps}>
          <StyledLabel>The Frontpage</StyledLabel>
          <StyledLabel>(150 x 600)</StyledLabel>
          <DropzoneArea
            key={dropzoneKey}
            clearOnUnmount
            showFileNames
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

        <Stack {...formFieldProps}>
          <StyledLabel>Call to action URL</StyledLabel>
          <StyledTextField
            placeholder="https://yourdomain.com/pageurl"
            variant="outlined"
          />
        </Stack>

        <Stack {...formFieldProps}>
          <StyledLabel>Description (optional)</StyledLabel>
          <StyledTextField
            placeholder="Type and enter description for your campaign"
            variant="outlined"
          />
        </Stack>

        <Stack justifyContent="center">
          <Button onClick={() => null}>Create New Campaign</Button>
        </Stack>
      </StyledForm>
    </>
  );
};

export default CreateCampaign;
