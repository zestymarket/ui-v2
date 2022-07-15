interface Format {
  [key: string]: {
    aspect: number;
    height: number;
    width: number;
    pow2: boolean;
  };
}

interface ZestyImage {
  width: number;
  height: number;
}

export interface PixelCrop {
  width: number;
  height: number;
  x: number;
  y: number;
}

let tempCanvas: HTMLCanvasElement,
  tctx: CanvasRenderingContext2D | null,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D | null;

const setup = () => {
  tempCanvas = document.createElement(`canvas`);
  tctx = tempCanvas.getContext(`2d`);
  canvas = document.createElement(`canvas`);
  ctx = canvas.getContext(`2d`);
};

const formats: Format = {
  Tall: { aspect: 0.75, height: 1024, width: 768, pow2: true }, // 768/1024
  Wide: { aspect: 4, height: 256, width: 1024, pow2: true }, // 1024/256
  Square: { aspect: 1.0, height: 1024, width: 1024, pow2: false }, // 1024/1024
  qr: { aspect: 1.0, height: 250, width: 256, pow2: false }, // 256/256
  qr500: { aspect: 1.0, height: 500, width: 500, pow2: false }, // 500/500
};

export function getAspectFromFormat(format: string) {
  return formats[format].aspect;
}

export function getHeightFromFormat(format: string) {
  return formats[format].height;
}

export function getWidthFromFormat(format: string) {
  return formats[format].width;
}

export function getIsFormatSquare(format: string) {
  return formats[format].pow2;
}

function toPowerOfTwo(num: number) {
  return Math.pow(2, Math.ceil(Math.log(num) / Math.log(2)));
}

function createImage(url: string): Promise<ZestyImage> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener(`load`, () => resolve(image));
    image.addEventListener(`error`, (error) => reject(error));
    image.setAttribute(`crossOrigin`, `anonymous`); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });
}

function resizeTo(canvas: HTMLCanvasElement, pct: number, isSquare: boolean) {
  tctx?.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
  const cw = canvas.width;
  const ch = canvas.height;
  tempCanvas.width = cw;
  tempCanvas.height = ch;
  tctx?.drawImage(canvas, 0, 0);
  canvas.width *= pct;
  canvas.height *= pct;
  if (isSquare) {
    canvas.width = toPowerOfTwo(canvas.width);
    canvas.height = toPowerOfTwo(canvas.height);
  }
  const ctx = canvas.getContext(`2d`);
  ctx?.drawImage(tempCanvas, 0, 0, cw, ch, 0, 0, canvas.width, canvas.height);
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCrop,
  imageHeight = 1024,
  isSquare = false,
) {
  const image: ZestyImage = await createImage(imageSrc);
  if (!canvas) {
    setup();
  }

  ctx?.clearRect(0, 0, canvas.width, canvas.height);

  const maxSize = Math.max(image.width || 0, image.height || 0);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx?.drawImage(
    // @ts-ignore
    image,
    safeArea / 2 - (image.width || 0) * 0.5,
    safeArea / 2 - (image.height || 0) * 0.5,
  );
  const data = ctx?.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx?.putImageData(
    // @ts-ignore
    data,
    Math.round(0 - safeArea / 2 + (image.width * 0.5 - pixelCrop.x)),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y),
  );
  resizeTo(canvas, imageHeight / pixelCrop.height, isSquare);
  // As Base64 string

  return canvas.toDataURL(`image/jpeg`);
}

export const convertBase64ToFile = function (image: string) {
  const byteString = atob(image.split(`,`)[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }
  const newBlob = new Blob([ab], {
    type: `image/jpeg`,
  });
  return newBlob;
};
