import { Accessor, createEffect } from "solid-js";
import QRCode, { QRCodeRenderersOptions } from "qrcode";

interface Props {
  content: Accessor<string>;
  options?: Accessor<QRCodeRenderersOptions>;
}

const defaultQrOptions: QRCodeRenderersOptions = {
  width: 512,
  errorCorrectionLevel: "medium",
  margin: 1,
  color: {
    // light: "#",
    // dark: "#0000ff",
  },
};

function QrCode({ content, options }: Props) {
  let canvas!: HTMLCanvasElement;

  createEffect(async () => {
    if (content()) {
      await QRCode.toCanvas(canvas, content(), {
        ...defaultQrOptions,
        ...(options?.() ?? {}),
      });
    } else {
      const context = canvas.getContext("2d");
      context?.clearRect(0, 0, canvas.width, canvas.height);
    }
  });

  async function downloadAsImage() {
    let canvas = document.createElement("canvas");
    await QRCode.toCanvas(canvas, content(), {
      ...defaultQrOptions,
      ...(options?.() ?? {}),
      width: 1024,
    });

    let downloadLink = document.createElement("a");
    downloadLink.setAttribute("download", "QRCode.png");
    canvas.toBlob((blob) => {
      let url = URL.createObjectURL(blob!);
      downloadLink.setAttribute("href", url);
      downloadLink.click();
    }, "image/png");
  }

  return (
    <div>
      <canvas ref={canvas} id="qr" />
      {content() ? (
        <div class="flex justify-center">
          <div
            class="btn btn-wide btn-primary cursor-pointer"
            onClick={() => downloadAsImage()}
          >
            Save as image
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default QrCode;
