import React, { useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Cropper, { Area, Point } from 'react-easy-crop';
import {
  getCroppedImg,
  getAspectFromFormat,
  getHeightFromFormat,
  getIsFormatSquare,
  PixelCrop,
} from '../utils/image';
import { Format, getDefaultFormat } from '../utils/formats';
import Button from './Button';

const StyledDialog = styled(Dialog)({
  '& .MuiPaper-root': {
    borderRadius: 24,
    overflowX: `hidden`,
  },
});
const StyledDialogContent = styled(DialogContent)({
  backgroundColor: `#fff`,
  minWidth: 440,
  height: 400,
  padding: 0,
});
const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: `#fff`,
  padding: theme.spacing(3),
}));
const StyledTitle = styled(Typography)(({ theme }) => ({
  color: `#050407`,
  fontSize: 26,
  fontWeight: 700,
  marginBottom: theme.spacing(2),
}));
const StyledSubTitle = styled(Typography)({
  color: `#5F5777`,
  fontSize: 15,
});
const StyledCloseButton = styled(IconButton)(({ theme }) => ({
  position: `absolute`,
  top: theme.spacing(4),
  right: theme.spacing(3),
  backgroundColor: theme.palette.text.secondary,
  color: theme.palette.text.primary,
  height: theme.spacing(3),
  width: theme.spacing(3),
  '&:hover': {
    backgroundColor: theme.palette.text.secondary,
    opacity: 0.8,
  },
  '& svg': {
    width: theme.spacing(2),
  },
}));
const StyledCropWrapper = styled(`div`)({
  height: `100%`,
  position: `relative`,
  width: `100%`,
});
const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  backgroundColor: `#fff`,
  margin: 0,
  padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
  flexDirection: `row-reverse`,
}));

interface Props {
  format: Format;
  open: boolean;
  image: string;
  onDialogClose: (tmp?: any) => void;
  onImageCropped: (img: string) => void;
}

const ZestyImageDialog: React.FC<Props> = ({
  format,
  open,
  image,
  onDialogClose,
  onImageCropped,
}) => {
  const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(
    null,
  );

  const onCropChange = (newCrop: Point) => {
    setCrop(newCrop);
  };

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const setCroppedImage = useCallback(async () => {
    try {
      onDialogClose(false);
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels as PixelCrop,
        getHeightFromFormat(format || getDefaultFormat()),
        getIsFormatSquare(format || getDefaultFormat()),
      );
      onImageCropped(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [image, format, onDialogClose, onImageCropped, croppedAreaPixels]);

  return (
    <div>
      <StyledDialog
        onClose={onDialogClose}
        scroll="body"
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <StyledDialogTitle>
          <StyledTitle>Crop Image</StyledTitle>
          <StyledSubTitle>Move to crop your image</StyledSubTitle>
          <StyledCloseButton>
            <CloseIcon />
          </StyledCloseButton>
        </StyledDialogTitle>
        <StyledDialogContent>
          <StyledCropWrapper>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={getAspectFromFormat(format || getDefaultFormat())}
              onCropChange={onCropChange}
              onCropComplete={onCropComplete}
              onZoomChange={onZoomChange}
            />
          </StyledCropWrapper>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button
            autoFocus
            onClick={setCroppedImage}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </StyledDialogActions>
      </StyledDialog>
    </div>
  );
};

export default ZestyImageDialog;
