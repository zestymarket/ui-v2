import { styled } from '@mui/material';
import React, { useState } from 'react';
// https://github.com/lifeeric/material-ui-dropzone#installation
import { DropzoneArea } from 'react-mui-dropzone';
import { Format, SpaceFormats } from '@/utils/formats';
import { getAspectFromFormat, getHeightFromFormat } from '@/utils/image';
import { EPSILON } from '@/utils/helpers';
import { readFile } from '@/utils/file';
import ZestyImageDialog from './ZestyImageDialog';

const StyledDropzoneArea = styled(`div`)(({ theme }) => ({
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

interface Props {
  format: string;
  onImageUpdate: (img: string | null) => void;
}

const ZestyImageUploader: React.FC<Props> = (props) => {
  const [dropzoneKey, setDropzoneKey] = useState<string>(`0`);
  const [image, setImage] = useState<string | null>(null);
  const [openImageDialog, setOpenImageDialog] = useState<boolean>(false);

  const onImageUploaded = async (img: File[]) => {
    if (!img.length) {
      return;
    }
    const file = img[0];
    const imageDataUrl = await readFile(file);

    setImage(imageDataUrl);
    setOpenImageDialog(true);
    props.onImageUpdate(imageDataUrl);
  };

  const onImageDelete = () => {
    setImage(null);
    props.onImageUpdate(null);
  };

  const onImageCropped = (img: string): void => {
    setImage(img);
    props.onImageUpdate(img);
  };

  const onCloseDialog = (e: any) => {
    setOpenImageDialog(false);
    // Remove image if dialog was closed due to an event and
    // not from a function call with false
    if (e) {
      setImage(null);
      setDropzoneKey(dropzoneKey === `0` ? `1` : `0`);
      props.onImageUpdate(null);
    }
  };

  return (
    <>
      <StyledDropzoneArea>
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
      {image && openImageDialog && (
        <ZestyImageDialog
          format={props.format as Format}
          open={openImageDialog}
          onDialogClose={onCloseDialog}
          image={image}
          onImageCropped={onImageCropped}
        />
      )}
    </>
  );
};

export default ZestyImageUploader;
